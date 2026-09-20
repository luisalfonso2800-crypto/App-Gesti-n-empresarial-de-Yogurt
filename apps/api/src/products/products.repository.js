import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.producto.findMany({
      include: { presentacion: true },
    });
  }

  async findActive() {
    return this.prisma.producto.findMany({
      where: { activo: true },
      include: { presentacion: true },
    });
  }

  async findIntermediates() {
    const products = await this.prisma.producto.findMany({
      where: { activo: true },
      include: {
        presentacion: true,
        inventario: true,
        lotes: {
          where: { tipoLote: 'SEMIELABORADO_WIP' },
          orderBy: { fechaProduccion: 'desc' },
          take: 1,
        },
      },
    });

    const result = [];
    for (const p of products) {
      const isBaseOrWip =
        p.categoria === 'BASES_LACTEAS' ||
        p.categoria === 'INTERMEDIO_WIP' ||
        p.tipo === 'INTERMEDIO_WIP' ||
        p.categoria === 'INSUMO_BASE_WIP' ||
        p.nombre?.toUpperCase().includes('BASE');

      if (!isBaseOrWip) {
        continue;
      }

      const rawCosto = Number(p.lotes?.[0]?.costoUnitario || p.inventario?.costoPromedio || p.costoEstandar || 0);
      const costoLitro = rawCosto > 0 ? rawCosto : 4390;
      const costoGramo = costoLitro / 1000; // $4.39 COP por gramo

      // Opción 1: Inóculo / Cepa
      result.push({
        ...p,
        id: p.id,
        idItem: `INOCULO:${p.id}`,
        nombre: `INÓCULO / INICIADOR (${p.nombre})`,
        displayLabel: `INÓCULO / INICIADOR (${p.nombre}) - g`,
        unidadMedida: 'g',
        tipoItem: 'INOCULO_WIP',
        costoUnitario: costoGramo,
        costoEstandar: costoGramo,
      });

      // Opción 2: Base a Granel
      result.push({
        ...p,
        id: p.id,
        idItem: `BASE:${p.id}`,
        nombre: `${p.nombre} (Base a Granel)`,
        unidadMedida: p.unidadMedida || 'Litros',
        tipoItem: 'BASE_GRANEL',
        displayLabel: `${p.nombre} (Base a Granel - Litros)`,
        costoUnitario: costoLitro,
        costoEstandar: costoLitro,
      });

      // Si tiene presentación específica envasada
      if (p.presentacion && p.presentacion.nombre !== p.nombre && p.presentacion.tipoEnvase !== 'TANQUE_GRANEL') {
        result.push({
          ...p,
          id: p.id,
          idItem: `PROD:${p.id}`,
          nombre: `${p.nombre} (${p.presentacion.nombre})`,
          unidadMedida: 'Litros',
          tipoItem: 'PRODUCTO_ENVASADO',
          displayLabel: `${p.nombre} (${p.presentacion.nombre})`,
          costoEstandar: p.costoEstandar || 0,
        });
      }
    }

    return result;
  }

  async findById(id) {
    return this.prisma.producto.findUnique({
      where: { id },
      include: { presentacion: true },
    });
  }

  async create(data) {
    return this.prisma.producto.create({
      data,
    });
  }

  async update(id, data) {
    const {
      id: _id,
      presentacion,
      recetas,
      producciones,
      lotes,
      detalleVentas,
      inventario,
      movimientos,
      recetasConsumo,
      detallesProduccionConsumo,
      createdAt,
      updatedAt,
      ...cleanData
    } = data || {};

    const idPresentacionFinal = cleanData.idPresentacion || presentacion?.id;
    if (idPresentacionFinal) {
      cleanData.idPresentacion = idPresentacionFinal;
    }

    return this.prisma.producto.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id) {
    return this.prisma.producto.update({
      where: { id },
      data: { activo: false },
    });
  }

  async countDependencies(id) {
    return this.prisma.producto.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            recetas: true,
            producciones: true,
            lotes: true,
            detalleVentas: true,
            movimientos: true,
            recetasConsumo: true,
            detallesProduccionConsumo: true,
          },
        },
      },
    });
  }

  async hardDelete(id) {
    return this.prisma.$transaction(async (tx) => {
      await tx.inventarioProducto.deleteMany({
        where: { idProducto: id },
      });
      return tx.producto.delete({
        where: { id },
      });
    });
  }
}
