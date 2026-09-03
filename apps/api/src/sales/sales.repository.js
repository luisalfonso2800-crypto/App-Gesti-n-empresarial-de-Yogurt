import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SalesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.venta.findMany({
      include: { detalles: true, cliente: true }
    });
  }

  async findById(id) {
    return this.prisma.venta.findUnique({
      where: { id },
      include: { detalles: true, cliente: true }
    });
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // Check and update lots (decrease available quantity)
      for (const detalle of data.detalles) {
        if (detalle.idLote) {
          const lote = await prisma.lote.findUnique({ where: { id: detalle.idLote } });
          if (!lote || lote.cantidadDisponible < detalle.cantidad) {
            throw new Error(`Insufficient stock in Lot ${detalle.idLote}`);
          }
          await prisma.lote.update({
            where: { id: detalle.idLote },
            data: { cantidadDisponible: { decrement: detalle.cantidad } }
          });
        }
      }

      const venta = await prisma.venta.create({
        data: {
          fechaVenta: new Date(data.fechaVenta),
          idCliente: data.idCliente,
          canalVenta: data.canalVenta,
          tipoPago: data.tipoPago,
          fechaLimitePago: data.fechaLimitePago ? new Date(data.fechaLimitePago) : null,
          totalVenta: data.totalVenta,
          valorPagado: data.valorPagado,
          saldoPendiente: data.saldoPendiente,
          estado: data.estado || 'COMPLETADA',
          observaciones: data.observaciones,
          detalles: {
            create: data.detalles.map(d => ({
              idProducto: d.idProducto,
              idLote: d.idLote,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              descuento: d.descuento,
              totalLinea: d.totalLinea,
              costoUnitario: d.costoUnitario,
              utilidadUnitaria: d.utilidadUnitaria,
              utilidadTotal: d.utilidadTotal
            }))
          }
        },
        include: { detalles: true }
      });

      return venta;
    });
  }
}
