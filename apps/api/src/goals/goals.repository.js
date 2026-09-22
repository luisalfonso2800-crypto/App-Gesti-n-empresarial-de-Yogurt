import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class GoalsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.metaEmpresarial.findMany({
      where: { activo: true },
      include: {
        metaPadre: true,
        subMetas: {
          where: { activo: true }
        },
        aportes: {
          orderBy: { fecha: 'desc' }
        }
      },
      orderBy: [
        { ordenPrioridad: 'asc' },
        { fechaInicio: 'asc' }
      ]
    });
  }

  async findById(id) {
    return this.prisma.metaEmpresarial.findUnique({
      where: { id },
      include: {
        metaPadre: true,
        subMetas: {
          where: { activo: true }
        },
        aportes: {
          orderBy: { fecha: 'desc' }
        }
      }
    });
  }

  async create(data) {
    return this.prisma.metaEmpresarial.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        ambito: data.ambito || 'EMPRESARIAL',
        categoriaSueno: data.categoriaSueno || 'OTRO',
        tipoMetrica: data.tipoMetrica || 'VENTAS_TOTALES',
        estrategiaAsignacion: data.estrategiaAsignacion || (data.ambito === 'PERSONAL_FAMILIAR' ? 'MANUAL' : 'METRICA_GLOBAL'),
        porcentajeFlujo: data.porcentajeFlujo !== undefined ? data.porcentajeFlujo : 0,
        ordenPrioridad: data.ordenPrioridad !== undefined ? Number(data.ordenPrioridad) : 1,
        valorObjetivo: data.valorObjetivo,
        horizonte: data.horizonte || 'MEDIANO_PLAZO',
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        metaPadreId: data.metaPadreId || null,
        observaciones: data.observaciones || null,
        activo: data.activo !== undefined ? data.activo : true,
      },
      include: {
        aportes: true
      }
    });
  }

  async delete(id) {
    return this.prisma.metaEmpresarial.update({
      where: { id },
      data: { activo: false }
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.ambito !== undefined) updateData.ambito = data.ambito;
    if (data.categoriaSueno !== undefined) updateData.categoriaSueno = data.categoriaSueno;
    if (data.tipoMetrica !== undefined) updateData.tipoMetrica = data.tipoMetrica;
    if (data.estrategiaAsignacion !== undefined) updateData.estrategiaAsignacion = data.estrategiaAsignacion;
    if (data.porcentajeFlujo !== undefined) updateData.porcentajeFlujo = Number(data.porcentajeFlujo);
    if (data.ordenPrioridad !== undefined) updateData.ordenPrioridad = Number(data.ordenPrioridad);
    if (data.valorObjetivo !== undefined) updateData.valorObjetivo = Number(data.valorObjetivo);
    if (data.horizonte !== undefined) updateData.horizonte = data.horizonte;
    if (data.fechaInicio !== undefined) updateData.fechaInicio = new Date(data.fechaInicio);
    if (data.fechaFin !== undefined) updateData.fechaFin = new Date(data.fechaFin);
    if (data.metaPadreId !== undefined) updateData.metaPadreId = data.metaPadreId;
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;

    return this.prisma.metaEmpresarial.update({
      where: { id },
      data: updateData,
      include: { aportes: true }
    });
  }

  async createAporte(metaId, monto, nota = null) {
    return this.prisma.aporteMeta.create({
      data: {
        metaId,
        monto,
        nota,
        fecha: new Date()
      }
    });
  }

  async getTotalAportesByMeta(metaId) {
    const result = await this.prisma.aporteMeta.aggregate({
      where: { metaId },
      _sum: { monto: true }
    });
    return Number(result._sum.monto || 0);
  }

  async getTotalAportesAllMetas() {
    const result = await this.prisma.aporteMeta.aggregate({
      _sum: { monto: true }
    });
    return Number(result._sum.monto || 0);
  }

  // Métodos de consulta de agregación reactiva del ERP
  async getSumVentas(fechaInicio, fechaFin) {
    const result = await this.prisma.venta.aggregate({
      where: {
        fechaVenta: {
          gte: fechaInicio,
          lte: fechaFin
        },
        estado: { not: 'CANCELADA' }
      },
      _sum: {
        totalVenta: true
      }
    });
    return Number(result._sum.totalVenta || 0);
  }

  async getSumRecaudos(fechaInicio, fechaFin) {
    const result = await this.prisma.pago.aggregate({
      where: {
        fechaPago: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      _sum: {
        valorPagado: true
      }
    });
    return Number(result._sum.valorPagado || 0);
  }

  async getSumProduccionLts(fechaInicio, fechaFin) {
    const result = await this.prisma.produccion.aggregate({
      where: {
        fechaProduccion: {
          gte: fechaInicio,
          lte: fechaFin
        },
        estado: { not: 'CANCELADO' }
      },
      _sum: {
        cantidadProducidaReal: true
      }
    });
    return Number(result._sum.cantidadProducidaReal || 0);
  }

  async getSumGastos(fechaInicio, fechaFin) {
    const result = await this.prisma.gasto.aggregate({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      _sum: {
        valor: true
      }
    });
    return Number(result._sum.valor || 0);
  }

  async getAllTimeRecaudos() {
    const result = await this.prisma.pago.aggregate({
      _sum: { valorPagado: true }
    });
    return Number(result._sum.valorPagado || 0);
  }

  async getAllTimeGastos() {
    const result = await this.prisma.gasto.aggregate({
      _sum: { valor: true }
    });
    return Number(result._sum.valor || 0);
  }
}
