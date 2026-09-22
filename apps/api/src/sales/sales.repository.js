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
        
        // Recálculo server-side estricto de cada detalle (HAL-F10-02, HAL-F7-02, HAL-F7-03, HAL-F7-04, HAL-F4-06)
        const cantidadNum = Number(d.cantidad);
        const precioUnitNum = Number(d.precioUnitario);
        const brutoLinea = cantidadNum * precioUnitNum;
        const descuentoTotalLinea = Number(d.descuento || 0);
        const tipoDesc = d.tipoDescuento || 'COMERCIAL';

        // Descuento comercial reduce base gravable; descuento financiero no la reduce (HAL-F7-03, HAL-F7-04)
        const descComercial = tipoDesc === 'COMERCIAL' ? descuentoTotalLinea : 0;
        const descFinanciero = tipoDesc === 'FINANCIERO' ? descuentoTotalLinea : 0;

        const baseDespuesComercial = Math.max(0, brutoLinea - descComercial);

        // Consultar configuración de IVA del producto si no viene explícita en detalle
        const prodDb = await prisma.producto.findUnique({
          where: { id: d.idProducto },
          select: { precioIncluyeIva: true, tarifaIva: true }
        });

        const precioIncluyeIva = d.precioIncluyeIva !== undefined 
          ? Boolean(d.precioIncluyeIva) 
          : (prodDb?.precioIncluyeIva ?? true);

        let tarifaIva = Number(d.tarifaIva !== undefined ? d.tarifaIva : (prodDb?.tarifaIva || 0));
        // Normalizar si viene en porcentaje (ej 19) o decimal (0.19)
        if (tarifaIva > 1) {
          tarifaIva = tarifaIva / 100;
        }
        if (data.aplicaIva && tarifaIva === 0) {
          tarifaIva = 0.19;
        }

        let baseGravableLinea = baseDespuesComercial;
        let montoIvaLinea = 0;

        if (tarifaIva > 0) {
          if (precioIncluyeIva) {
            // HAL-F7-02: Precio incluye IVA -> Base = Bruto / (1 + IVA)
            baseGravableLinea = baseDespuesComercial / (1 + tarifaIva);
            montoIvaLinea = baseDespuesComercial - baseGravableLinea;
          } else {
            // Precio NO incluye IVA -> Base = Bruto; IVA se adiciona
            baseGravableLinea = baseDespuesComercial;
            montoIvaLinea = baseGravableLinea * tarifaIva;
          }
        }

        // Total de la línea considerando descuento financiero posterior (HAL-F7-03)
        const totalLineaBruto = baseGravableLinea + montoIvaLinea;
        const totalLinea = Math.max(0, totalLineaBruto - descFinanciero);

        const util = totalLinea - (cantidadNum * costoUnit);

        serverSubtotal += brutoLinea;
        serverDescuentoTotal += descuentoTotalLinea;
        serverBaseImponible += baseGravableLinea;
        serverIvaTotal += montoIvaLinea;
        serverTotalVenta += totalLinea;

        finalDetallesCreate.push({
          idProducto: d.idProducto,
          idLote: d.idLote,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          descuento: descuentoTotalLinea,
          tarifaIva: tarifaIva,
          baseGravable: Number(baseGravableLinea.toFixed(4)),
          montoIva: Number(montoIvaLinea.toFixed(4)),
          totalLinea: Number(totalLinea.toFixed(2)),
          costoUnitario: costoUnit,
          utilidadUnitaria: precioUnitNum - costoUnit,
          utilidadTotal: Number(util.toFixed(2))
        });
      }

      const serverSubtotalFinal = Number(serverSubtotal.toFixed(2));
      const serverDescuentoFinal = Number(serverDescuentoTotal.toFixed(2));
      const serverBaseFinal = Number(serverBaseImponible.toFixed(2));
      const serverIvaFinal = Number(serverIvaTotal.toFixed(2));
      const serverTotalVentaFinal = Number(serverTotalVenta.toFixed(2));

      const valorPagadoNum = Number(data.valorPagado || 0);
      // HAL-F9-04 + HAL-F4-08: saldo negativo = saldo a favor del cliente (anticipo)
      const saldoPendienteCalc = serverTotalVentaFinal - valorPagadoNum;

      const venta = await prisma.venta.create({
        data: {
          fechaVenta: new Date(data.fechaVenta),
          idCliente: data.idCliente,
          canalVenta: data.canalVenta,
          tipoPago: data.tipoPago,
          fechaLimitePago: data.fechaLimitePago ? new Date(data.fechaLimitePago) : null,
          aplicaIva: Boolean(data.aplicaIva),
          subtotal: serverSubtotalFinal,
          descuentoTotal: serverDescuentoFinal,
          baseImponible: serverBaseFinal,
          ivaTotal: serverIvaFinal,
          totalVenta: serverTotalVentaFinal,
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
