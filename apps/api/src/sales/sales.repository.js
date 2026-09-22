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

      // Descontar InventarioProducto y crear Movimientos con recálculo server-side
      const finalDetallesCreate = [];
      let serverSubtotal = 0;
      let serverDescuentoTotal = 0;
      let serverBaseImponible = 0;
      let serverIvaTotal = 0;
      let serverTotalVenta = 0;

      for (const d of processedDetalles) {
        const inv = await prisma.inventarioProducto.findUnique({ where: { idProducto: d.idProducto } });
        const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        const stockNuevo = stockAnterior - d.cantidad;
        
        await prisma.inventarioProducto.update({
          where: { idProducto: d.idProducto },
          data: { cantidadActual: stockNuevo }
        });

        const costoUnit = d.costoUnitarioLote || (inv ? Number(inv.costoPromedio) : 0);
        
        // Recálculo server-side estricto de cada detalle (HAL-F10-02)
        const cantidadNum = Number(d.cantidad);
        const precioUnitNum = Number(d.precioUnitario);
        const subtotalLinea = cantidadNum * precioUnitNum;
        const descuentoLinea = Number(d.descuento || 0);
        const subtotalConDesc = Math.max(0, subtotalLinea - descuentoLinea);

        let tarifaIva = Number(d.tarifaIva || 0);
        if (data.aplicaIva && tarifaIva === 0) {
          tarifaIva = 0.19; // Tarifa general IVA si aplicaIva está activo y no vino específica
        }

        let baseLinea = subtotalConDesc;
        let montoIva = 0;
        let totalLinea = subtotalConDesc;

        if (tarifaIva > 0) {
          // Por regla general del sistema comercial actual: subtotal es base y se adiciona IVA
          baseLinea = subtotalConDesc;
          montoIva = Math.round(baseLinea * tarifaIva);
          totalLinea = baseLinea + montoIva;
        }

        const util = totalLinea - (cantidadNum * costoUnit);

        serverSubtotal += subtotalLinea;
        serverDescuentoTotal += descuentoLinea;
        serverBaseImponible += baseLinea;
        serverIvaTotal += montoIva;
        serverTotalVenta += totalLinea;

        finalDetallesCreate.push({
          idProducto: d.idProducto,
          idLote: d.idLote,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          descuento: descuentoLinea,
          tarifaIva: tarifaIva,
          baseGravable: baseLinea,
          montoIva: montoIva,
          totalLinea: totalLinea,
          costoUnitario: costoUnit,
          utilidadUnitaria: precioUnitNum - costoUnit,
          utilidadTotal: util
        });
      }

      const valorPagadoNum = Number(data.valorPagado || 0);
      const saldoPendienteCalc = Math.max(0, serverTotalVenta - valorPagadoNum);

      const venta = await prisma.venta.create({
        data: {
          fechaVenta: new Date(data.fechaVenta),
          idCliente: data.idCliente,
          canalVenta: data.canalVenta,
          tipoPago: data.tipoPago,
          fechaLimitePago: data.fechaLimitePago ? new Date(data.fechaLimitePago) : null,
          aplicaIva: Boolean(data.aplicaIva),
          subtotal: serverSubtotal,
          descuentoTotal: serverDescuentoTotal,
          baseImponible: serverBaseImponible,
          ivaTotal: serverIvaTotal,
          totalVenta: serverTotalVenta,
          valorPagado: valorPagadoNum,
          saldoPendiente: saldoPendienteCalc,
          estado: data.estado || (saldoPendienteCalc <= 0 ? 'COMPLETADA' : 'PENDIENTE'),
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
