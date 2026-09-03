import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class PaymentsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.pago.findMany({
      include: { cliente: true, venta: true }
    });
  }

  async findById(id) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: { cliente: true, venta: true }
    });
  }

  async create(data) {
    return this.prisma.pago.create({
      data: {
        fechaPago: new Date(data.fechaPago),
        idCliente: data.idCliente,
        idVenta: data.idVenta,
        valorPagado: data.valorPagado,
        metodoPago: data.metodoPago,
        referencia: data.referencia,
        observaciones: data.observaciones
      }
    });
  }
}
