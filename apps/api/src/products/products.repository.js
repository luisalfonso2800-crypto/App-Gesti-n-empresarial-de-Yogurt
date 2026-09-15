import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.producto.findMany({
      include: { presentacion: true },
    });
  }

  async findActive() {
    return this.prisma.producto.findMany({
      where: { activo: true },
      include: { presentacion: true },
    });
  }

  async findById(id) {
    return this.prisma.producto.findUnique({
      where: { id },
      include: { presentacion: true },
    });
  }

  async create(data) {
    return this.prisma.producto.create({
      data,
    });
  }

  async update(id, data) {
    const {
      id: _id,
      presentacion,
      recetas,
      producciones,
      lotes,
      detalleVentas,
      inventario,
      movimientos,
      recetasConsumo,
      detallesProduccionConsumo,
      createdAt,
      updatedAt,
      ...cleanData
    } = data || {};

    const idPresentacionFinal = cleanData.idPresentacion || presentacion?.id;
    if (idPresentacionFinal) {
      cleanData.idPresentacion = idPresentacionFinal;
    }

    return this.prisma.producto.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id) {
    return this.prisma.producto.update({
      where: { id },
      data: { activo: false },
    });
  }

  async countDependencies(id) {
    return this.prisma.producto.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            recetas: true,
            producciones: true,
            lotes: true,
            detalleVentas: true,
            movimientos: true,
            recetasConsumo: true,
            detallesProduccionConsumo: true,
          },
        },
      },
    });
  }

  async hardDelete(id) {
    return this.prisma.$transaction(async (tx) => {
      await tx.inventarioProducto.deleteMany({
        where: { idProducto: id },
      });
      return tx.producto.delete({
        where: { id },
      });
    });
  }
}
