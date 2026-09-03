import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.producto.findMany();
  }

  async findActive() {
    return this.prisma.producto.findMany({
      where: { activo: true },
    });
  }

  async findById(id) {
    return this.prisma.producto.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return this.prisma.producto.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.producto.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.producto.update({
      where: { id },
      data: { activo: false },
    });
  }
}
