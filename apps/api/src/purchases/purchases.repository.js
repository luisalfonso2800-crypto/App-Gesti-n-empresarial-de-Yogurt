import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PurchasesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.compra.findMany({
      include: { detalles: true }
    });
  }

  async findById(id) {
    return this.prisma.compra.findUnique({
      where: { id },
      include: { detalles: true }
    });
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      const compra = await prisma.compra.create({
        data: {
          idProveedor: data.idProveedor,
          fechaCompra: new Date(data.fechaCompra),
          estado: data.estado || 'CONFIRMADA',
          total: data.total,
          observaciones: data.observaciones,
          detalles: {
            create: data.detalles.map(d => ({
              idInsumo: d.idInsumo,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              subtotal: d.subtotal
            }))
          }
        },
        include: { detalles: true }
      });

      if (compra.estado === 'CONFIRMADA') {
        for (const detalle of compra.detalles) {
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: detalle.idInsumo } });
          if (inv) {
            await prisma.inventario.update({
              where: { idInsumo: detalle.idInsumo },
              data: { cantidadActual: { increment: detalle.cantidad } }
            });
          } else {
            await prisma.inventario.create({
              data: {
                idInsumo: detalle.idInsumo,
                cantidadActual: detalle.cantidad
              }
            });
          }

          await prisma.movimientoInventario.create({
            data: {
              idInsumo: detalle.idInsumo,
              tipoMovimiento: 'ENTRADA',
              cantidad: detalle.cantidad,
              motivo: 'COMPRA',
              operacionOrigen: compra.id
            }
          });
        }
      }
      return compra;
    });
  }
}
