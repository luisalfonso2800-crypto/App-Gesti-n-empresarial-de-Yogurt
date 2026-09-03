import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class RecipesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.receta.findMany();
  }

  async findActive() {
    return this.prisma.receta.findMany({
      where: { activo: true },
    });
  }

  async findById(id) {
    return this.prisma.receta.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return this.prisma.receta.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.receta.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.receta.update({
      where: { id },
      data: { activo: false },
    });
  }
}
