import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Decimal, toDecimal, add, sub, mul, div, toNumber } from '../common/decimal/decimal-utils.js';

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
        const cUnit = toDecimal(d.costoUnitario || 0);
        return add(acc, mul(cUnit, d.cantidad || 0));
      }, toDecimal(0));

      return {
        ...venta,
        clienteNombre: venta.cliente?.nombre || 'Cliente Ocasional',
        clienteTipo: venta.cliente?.tipoCliente || 'MINORISTA',
        costoTotal: toNumber(costoTotal.toDecimalPlaces(2))
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
      const cUnit = toDecimal(d.costoUnitario || 0);
      return add(acc, mul(cUnit, d.cantidad || 0));
    }, toDecimal(0));

    return {
      ...venta,
      clienteNombre: venta.cliente?.nombre || 'Cliente Ocasional',
      clienteTipo: venta.cliente?.tipoCliente || 'MINORISTA',
      costoTotal: toNumber(costoTotal.toDecimalPlaces(2))
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
        // HAL-F4-07: Resta exacta con Decimal preservando saldo real
        const stockNuevo = toNumber(sub(stockAnterior, d.cantidad));
        
        await prisma.inventarioProducto.update({
          where: { idProducto: d.idProducto },
          data: { cantidadActual: stockNuevo }
        });

        const costoUnit = d.costoUnitarioLote || (inv ? Number(inv.costoPromedio) : 0);
        
        // Recálculo server-side estricto de cada detalle (HAL-F10-02, HAL-F7-02, HAL-F7-03, HAL-F7-04, HAL-F4-06, HAL-F4-07)
        const cantidadDec = toDecimal(d.cantidad);
        const precioUnitDec = toDecimal(d.precioUnitario);
        const brutoLineaDec = mul(cantidadDec, precioUnitDec);
        const descuentoTotalLineaDec = toDecimal(d.descuento || 0);
        const tipoDesc = d.tipoDescuento || 'COMERCIAL';

        // Descuento comercial reduce base gravable; descuento financiero no la reduce (HAL-F7-03, HAL-F7-04)
        const descComercialDec = tipoDesc === 'COMERCIAL' ? descuentoTotalLineaDec : toDecimal(0);
        const descFinancieroDec = tipoDesc === 'FINANCIERO' ? descuentoTotalLineaDec : toDecimal(0);

        const baseDespuesComercialDec = Decimal.max(0, sub(brutoLineaDec, descComercialDec));

        // Consultar configuración de IVA del producto si no viene explícita en detalle
        const prodDb = await prisma.producto.findUnique({
          where: { id: d.idProducto },
          select: { precioIncluyeIva: true, tarifaIva: true }
        });

        const precioIncluyeIva = d.precioIncluyeIva !== undefined 
          ? Boolean(d.precioIncluyeIva) 
          : (prodDb?.precioIncluyeIva ?? true);

        let tarifaIvaDec = toDecimal(d.tarifaIva !== undefined ? d.tarifaIva : (prodDb?.tarifaIva || 0));
        // Normalizar si viene en porcentaje (ej 19) o decimal (0.19)
        if (tarifaIvaDec.gt(1)) {
          tarifaIvaDec = div(tarifaIvaDec, 100);
        }
        if (data.aplicaIva && tarifaIvaDec.isZero()) {
          tarifaIvaDec = toDecimal(0.19);
        }

        let baseGravableLineaDec = baseDespuesComercialDec;
        let montoIvaLineaDec = toDecimal(0);

        if (tarifaIvaDec.gt(0)) {
          if (precioIncluyeIva) {
            // HAL-F7-02 / HAL-F4-07: Precio incluye IVA -> Base = Bruto / (1 + IVA) con Decimal
            baseGravableLineaDec = div(baseDespuesComercialDec, add(1, tarifaIvaDec));
            montoIvaLineaDec = sub(baseDespuesComercialDec, baseGravableLineaDec);
          } else {
            // Precio NO incluye IVA -> Base = Bruto; IVA se adiciona
            baseGravableLineaDec = baseDespuesComercialDec;
            montoIvaLineaDec = mul(baseGravableLineaDec, tarifaIvaDec);
          }
        }

        // Total de la línea considerando descuento financiero posterior (HAL-F7-03)
        const totalLineaBrutoDec = add(baseGravableLineaDec, montoIvaLineaDec);
        const totalLineaDec = Decimal.max(0, sub(totalLineaBrutoDec, descFinancieroDec));

        const utilDec = sub(totalLineaDec, mul(cantidadDec, costoUnit));

        serverSubtotal += toNumber(brutoLineaDec);
        serverDescuentoTotal += toNumber(descuentoTotalLineaDec);
        serverBaseImponible += toNumber(baseGravableLineaDec);
        serverIvaTotal += toNumber(montoIvaLineaDec);
        serverTotalVenta += toNumber(totalLineaDec);

        finalDetallesCreate.push({
          idProducto: d.idProducto,
          idLote: d.idLote,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          descuento: toNumber(descuentoTotalLineaDec),
          tarifaIva: toNumber(tarifaIvaDec),
          baseGravable: toNumber(baseGravableLineaDec.toDecimalPlaces(4)),
          montoIva: toNumber(montoIvaLineaDec.toDecimalPlaces(4)),
          totalLinea: toNumber(totalLineaDec.toDecimalPlaces(2)),
          costoUnitario: costoUnit,
          utilidadUnitaria: toNumber(sub(precioUnitDec, costoUnit)),
          utilidadTotal: toNumber(utilDec.toDecimalPlaces(2))
        });
      }

      const serverSubtotalFinal = toNumber(toDecimal(serverSubtotal).toDecimalPlaces(2));
      const serverDescuentoFinal = toNumber(toDecimal(serverDescuentoTotal).toDecimalPlaces(2));
      const serverBaseFinal = toNumber(toDecimal(serverBaseImponible).toDecimalPlaces(2));
      const serverIvaFinal = toNumber(toDecimal(serverIvaTotal).toDecimalPlaces(2));
      const serverTotalVentaFinal = toNumber(toDecimal(serverTotalVenta).toDecimalPlaces(2));

      const valorPagadoNum = toNumber(toDecimal(data.valorPagado || 0));
      // HAL-F9-04 + HAL-F4-08 + HAL-F4-07: saldo con Decimal exacto
      const saldoPendienteCalc = toNumber(sub(serverTotalVentaFinal, valorPagadoNum).toDecimalPlaces(2));

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
