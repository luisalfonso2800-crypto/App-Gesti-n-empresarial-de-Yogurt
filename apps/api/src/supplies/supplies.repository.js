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
    });
  }

  async findActive() {
    return this.prisma.insumo.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
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
    return this.prisma.insumo.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.insumo.update({
      where: { id },
      data: { activo: false },
    });
  }
}
