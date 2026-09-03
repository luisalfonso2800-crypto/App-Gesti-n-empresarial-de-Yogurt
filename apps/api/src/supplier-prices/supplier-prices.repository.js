import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SupplierPricesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.precioProveedor.findMany();
  }

  async findActive() {
    return this.prisma.precioProveedor.findMany({
      where: { activo: true },
    });
  }

  async findById(id) {
    return this.prisma.precioProveedor.findUnique({
      where: { id },
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
