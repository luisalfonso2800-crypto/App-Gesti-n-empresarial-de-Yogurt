import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class LotsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.lote.findMany({
      include: { produccion: true, producto: true }
    });
  }

  async findById(id) {
    return this.prisma.lote.findUnique({
      where: { id },
      include: { produccion: true, producto: true }
    });
  }
}
