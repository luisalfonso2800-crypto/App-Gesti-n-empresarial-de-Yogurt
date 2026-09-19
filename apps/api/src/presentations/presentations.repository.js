import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PresentationsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.presentacion.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.presentacion.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id) {
    return this.prisma.presentacion.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return this.prisma.presentacion.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.presentacion.update({
      where: { id },
      data,
    });
  }

  async countProductsByPresentation(id) {
    return this.prisma.producto.count({
      where: { idPresentacion: id },
    });
  }

  async remove(id) {
    return this.prisma.presentacion.update({
      where: { id },
      data: { activo: false },
    });
  }

  async deletePermanent(id) {
    return this.prisma.presentacion.delete({
      where: { id },
    });
  }
}
