import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SuppliesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.insumo.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        precios: {
          where: { activo: true },
          take: 1,
          orderBy: { fechaRegistro: 'desc' }
        },
        inventario: {
          select: {
            cantidadActual: true
          }
        },
        _count: {
          select: {
            detallesCompra: true,
            movimientos: true,
            detallesReceta: true,
            detallesProduccion: true,
            lotes: true,
            ordenCompraItems: true
          }
        }
      }
    });
  }

  async findActive() {
    return this.prisma.insumo.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        precios: {
          where: { activo: true },
          take: 1,
          orderBy: { fechaRegistro: 'desc' }
        }
      }
    });
  }

  async findBrands() {
    const brands = await this.prisma.insumo.findMany({
      where: { activo: true, marca: { not: '' } },
      select: { marca: true },
      distinct: ['marca'],
      orderBy: { marca: 'asc' }
    });
    return brands.map(b => b.marca).filter(Boolean);
  }

  async findById(id) {
    return this.prisma.insumo.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return this.prisma.insumo.create({
      data,
    });
  }

  async update(id, data) {
    const { id: _id, precios, createdAt, updatedAt, ...cleanData } = data;
    return this.prisma.insumo.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id) {
    return this.prisma.insumo.update({
      where: { id },
      data: { activo: false },
    });
  }

  async countDependencies(id) {
    return this.prisma.insumo.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            detallesCompra: true,
            movimientos: true,
            detallesReceta: true,
            detallesProduccion: true,
            lotes: true,
            ordenCompraItems: true,
            precios: true,
          },
        },
      },
    });
  }

  async hardDelete(id) {
    return this.prisma.$transaction(async (tx) => {
      await tx.inventario.deleteMany({
        where: { idInsumo: id },
      });
      return tx.insumo.delete({
        where: { id },
      });
    });
  }
}
