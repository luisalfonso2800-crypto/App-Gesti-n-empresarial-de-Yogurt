import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ExpensesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.gasto.findMany();
  }

  async findById(id) {
    return this.prisma.gasto.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return this.prisma.gasto.create({
      data: {
        fecha: new Date(data.fecha),
        categoria: data.categoria,
        descripcion: data.descripcion,
        valor: data.valor,
        tipoGasto: data.tipoGasto,
        periodo: data.periodo,
        observaciones: data.observaciones
      }
    });
  }
}
