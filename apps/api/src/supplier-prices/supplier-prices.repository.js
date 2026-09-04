import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SupplierPricesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    try {
      return await this.prisma.precioProveedor.findMany({
        include: { insumo: true, proveedor: true },
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async findActive() {
    try {
      return await this.prisma.precioProveedor.findMany({
        where: { activo: true },
        include: { insumo: true, proveedor: true },
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async findById(id) {
    return this.prisma.precioProveedor.findUnique({
      where: { id },
      include: { insumo: true, proveedor: true },
    });
  }

  async create(data) {
    return this.prisma.precioProveedor.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.precioProveedor.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.precioProveedor.update({
      where: { id },
      data: { activo: false },
    });
  }
}
