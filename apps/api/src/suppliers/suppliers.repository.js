import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SuppliersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.proveedor.findMany();
  }

  async findActive() {
    return this.prisma.proveedor.findMany({
      where: { activo: true },
    });
  }

  async findById(id) {
    return this.prisma.proveedor.findUnique({
      where: { id },
    });
  }

  async findByNombreOrNit(nombre, nitCedula) {
    return this.prisma.proveedor.findFirst({
      where: {
        OR: [
          { nombre },
          { nitCedula }
        ]
      }
    });
  }

  async create(data) {
    return this.prisma.proveedor.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.proveedor.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.proveedor.update({
      where: { id },
      data: { activo: false },
    });
  }
}
