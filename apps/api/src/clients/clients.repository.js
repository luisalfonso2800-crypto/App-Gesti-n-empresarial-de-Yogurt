import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ClientsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async findById(id) {
    return this.prisma.cliente.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return this.prisma.cliente.create({
      data: {
        nombre: data.nombre,
        tipoCliente: data.tipoCliente,
        canal: data.canal,
        contacto: data.contacto,
        telefono: data.telefono,
        direccion: data.direccion,
        diasCredito: data.diasCredito,
        observaciones: data.observaciones
      }
    });
  }
}
