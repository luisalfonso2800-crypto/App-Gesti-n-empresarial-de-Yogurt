import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class InventoryRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.inventario.findMany({
      include: { insumo: true }
    });
  }

  async findByInsumo(idInsumo) {
    return this.prisma.inventario.findUnique({
      where: { idInsumo },
      include: { insumo: true }
    });
  }

  async findMovements(idInsumo) {
    return this.prisma.movimientoInventario.findMany({
      where: { idInsumo },
      orderBy: { fechaMovimiento: 'desc' }
    });
  }
}
