import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SalesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    const ventas = await this.prisma.venta.findMany({
      include: {
        cliente: { select: { id: true, nombre: true, tipoCliente: true, canal: true } },
        detalles: {
          include: {
            producto: { select: { id: true, nombre: true, precioVenta: true, precioMayorista: true } }
          }
        }
      },
      orderBy: { fechaVenta: 'desc' }
    });

    return ventas.map(venta => {
      const costoTotal = (venta.detalles || []).reduce((acc, d) => {
        const cUnit = Number(d.costoUnitario || 0);
        return acc + (cUnit * Number(d.cantidad || 0));
      }, 0);

      return {
        ...venta,
        clienteNombre: venta.cliente?.nombre || 'Cliente Ocasional',
        clienteTipo: venta.cliente?.tipoCliente || 'MINORISTA',
        costoTotal
      };
    });
  }

  async findById(id) {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: {
        cliente: { select: { id: true, nombre: true, tipoCliente: true, canal: true } },
        detalles: {
          include: {
            producto: { select: { id: true, nombre: true, precioVenta: true, precioMayorista: true } }
          }
        }
      }
    });

    if (!venta) return null;

    const costoTotal = (venta.detalles || []).reduce((acc, d) => {
      const cUnit = Number(d.costoUnitario || 0);
      return acc + (cUnit * Number(d.cantidad || 0));
    }, 0);

    return {
      ...venta,
      clienteNombre: venta.cliente?.nombre || 'Cliente Ocasional',
      clienteTipo: venta.cliente?.tipoCliente || 'MINORISTA',
      costoTotal
    };
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      let totalCosto = 0;
      let totalVentaReal = 0;

      const processedDetalles = [];

      for (const d of data.detalles) {
        let loteToUse = null;
        let qtyToFulfill = Number(d.cantidad);

        // FEFO if lote not explicitly given
        if (!d.idLote) {
          const lotes = await prisma.lote.findMany({
            where: { 
              idProducto: d.idProducto, 
              estado: 'DISPONIBLE',
              cantidadDisponible: { gt: 0 }
            },
            orderBy: { fechaVencimiento: 'asc' }
          });
          
          let remaining = qtyToFulfill;
          for (const l of lotes) {
            if (remaining <= 0) break;
            const take = Math.min(Number(l.cantidadDisponible), remaining);
            processedDetalles.push({ ...d, cantidad: take, idLote: l.id, costoUnitarioLote: Number(l.costoUnitario || 0) });
            remaining -= take;
            
            await prisma.lote.update({
              where: { id: l.id },
              data: {
                cantidadDisponible: { decrement: take },
                estado: (Number(l.cantidadDisponible) - take) <= 0 ? 'AGOTADO' : l.estado
              }
            });
          }
          if (remaining > 0) throw new Error(`Stock insuficiente para el producto ${d.idProducto}`);
        } else {
          // Lote explícito
          const lote = await prisma.lote.findUnique({ where: { id: d.idLote } });
          if (!lote || Number(lote.cantidadDisponible) < qtyToFulfill) {
            throw new Error(`Stock insuficiente en el Lote ${d.idLote}`);
          }
          processedDetalles.push({ ...d, cantidad: qtyToFulfill, idLote: lote.id, costoUnitarioLote: Number(lote.costoUnitario || 0) });
          
          await prisma.lote.update({
            where: { id: d.idLote },
            data: { 
              cantidadDisponible: { decrement: qtyToFulfill },
              estado: (Number(lote.cantidadDisponible) - qtyToFulfill) <= 0 ? 'AGOTADO' : lote.estado
            }
          });
        }
      }

      // Descontar InventarioProducto y crear Movimientos
      const finalDetallesCreate = [];
      for (const d of processedDetalles) {
        const inv = await prisma.inventarioProducto.findUnique({ where: { idProducto: d.idProducto } });
        const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        const stockNuevo = stockAnterior - d.cantidad;
        
        await prisma.inventarioProducto.update({
          where: { idProducto: d.idProducto },
          data: { cantidadActual: stockNuevo }
        });

        const costoUnit = d.costoUnitarioLote || (inv ? Number(inv.costoPromedio) : 0);
        const subVenta = d.totalLinea !== undefined ? Number(d.totalLinea) : (d.cantidad * Number(d.precioUnitario));
        const util = subVenta - (d.cantidad * costoUnit);

        finalDetallesCreate.push({
          idProducto: d.idProducto,
          idLote: d.idLote,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          descuento: d.descuento || 0,
          tarifaIva: d.tarifaIva !== undefined ? Number(d.tarifaIva) : 0,
          baseGravable: d.baseGravable !== undefined ? Number(d.baseGravable) : (d.cantidad * Number(d.precioUnitario)),
          montoIva: d.montoIva !== undefined ? Number(d.montoIva) : 0,
          totalLinea: subVenta,
          costoUnitario: costoUnit,
          utilidadUnitaria: Number(d.precioUnitario) - costoUnit,
          utilidadTotal: util
        });

        // Este await requiere Venta ID pero la Venta aun no existe, lo hacemos despues de crear Venta
      }

      const venta = await prisma.venta.create({
        data: {
          fechaVenta: new Date(data.fechaVenta),
          idCliente: data.idCliente,
          canalVenta: data.canalVenta,
          tipoPago: data.tipoPago,
          fechaLimitePago: data.fechaLimitePago ? new Date(data.fechaLimitePago) : null,
          aplicaIva: Boolean(data.aplicaIva),
          subtotal: data.subtotal !== undefined ? Number(data.subtotal) : Number(data.totalVenta),
          descuentoTotal: data.descuentoTotal !== undefined ? Number(data.descuentoTotal) : 0,
          baseImponible: data.baseImponible !== undefined ? Number(data.baseImponible) : Number(data.totalVenta),
          ivaTotal: data.ivaTotal !== undefined ? Number(data.ivaTotal) : 0,
          totalVenta: data.totalVenta,
          valorPagado: data.valorPagado,
          saldoPendiente: data.saldoPendiente,
          estado: data.estado || 'COMPLETADA',
          observaciones: data.observaciones,
          detalles: {
            create: finalDetallesCreate
          }
        },
        include: {
          detalles: {
            include: { producto: true }
          },
          cliente: true
        }
      });

      // Si la venta tiene un abono o pago inicial, registrarlo en la tabla Pagos
      if (Number(data.valorPagado || 0) > 0) {
        await prisma.pago.create({
          data: {
            fechaPago: new Date(data.fechaVenta),
            idCliente: data.idCliente,
            idVenta: venta.id,
            valorPagado: data.valorPagado,
            metodoPago: data.metodoPago || 'EFECTIVO',
            referencia: data.referenciaPago || 'Abono Inicial Venta',
            observaciones: data.observacionesPago || 'Registro automático de pago/abono en venta'
          }
        });
      }

      // Crear movimientosInventario
      for (const d of finalDetallesCreate) {
         // Requerimos recalcular stock anterior porque puede haber varios items del mismo producto en la misma orden
         // Para simplicidad en este loop final:
         const currentInv = await prisma.inventarioProducto.findUnique({ where: { idProducto: d.idProducto } });
         const stockDespuesMov = currentInv ? Number(currentInv.cantidadActual) : 0;
         // Note: we already discounted it above, so stockNuevo is currentInv.cantidadActual. 
         // stockAnterior would be stockNuevo + d.cantidad
         
         await prisma.movimientoInventario.create({
           data: {
             idProducto: d.idProducto,
             idLote: d.idLote,
             tipoMovimiento: 'SALIDA_VENTA',
             cantidad: d.cantidad,
             stockAnterior: stockDespuesMov + d.cantidad,
             stockNuevo: stockDespuesMov,
             costoUnitario: d.costoUnitario,
             motivo: 'Venta',
             operacionOrigen: venta.id
           }
         });
      }

      return venta;
    });
  }
}
