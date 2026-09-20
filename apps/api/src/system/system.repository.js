/**
 * @file system.repository.js
 * @module system
 * @description Repositorio para consultas ligeras de estado del sistema y onboarding.
 * @responsibility Ejecutar conteos directos con Prisma de forma atómica y ligera.
 * @usedBy apps/api/src/system/system.service.js
 * @dependencies apps/api/src/database/prisma.service.js
 */
import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SystemRepository {
  /**
   * @param {PrismaService} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Obtiene los conteos ligeros de entidades maestras y transaccionales para diagnóstico y onboarding.
   * @returns {Promise<Object>} Conteos crudos de la base de datos
   */
  async getOnboardingCounts() {
    const [
      presentations,
      supplies,
      suppliers,
      products,
      recipes,
      suppliesWithStock,
      finishedLotsWithStock,
      sales,
      clients
    ] = await Promise.all([
      // Formatos de envase activos o registrados
      this.prisma.presentacion.count({
        where: { activo: true }
      }),
      // Insumos dados de alta
      this.prisma.insumo.count({
        where: { activo: true }
      }),
      // Proveedores registrados
      this.prisma.proveedor.count({
        where: { activo: true }
      }),
      // Productos terminados creados
      this.prisma.producto.count({
        where: { activo: true }
      }),
      // Recetas formuladas y aprobadas/activas
      this.prisma.receta.count({
        where: { activo: true }
      }),
      // Insumos con cantidadActual > 0 en Inventario
      this.prisma.inventario.count({
        where: {
          cantidadActual: { gt: 0 }
        }
      }),
      // Lotes comerciales terminados con saldo disponible > 0 (excluyendo solo planta / base intermedia)
      this.prisma.lote.count({
        where: {
          cantidadDisponible: { gt: 0 },
          producto: {
            canalVenta: { notIn: ['SOLO_PLANTA', 'USO_INTERNO'] },
            categoria: { notIn: ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'TOPPING_CEREAL'] }
          }
        }
      }),
      // Ventas de productos comerciales terminados con precio > 0
      this.prisma.venta.count({
        where: {
          totalVenta: { gt: 0 },
          detalles: {
            some: {
              precioUnitario: { gt: 0 },
              producto: {
                canalVenta: { notIn: ['SOLO_PLANTA', 'USO_INTERNO'] }
              }
            }
          }
        }
      }),
      // Clientes registrados
      this.prisma.cliente.count({
        where: { activo: true }
      })
    ]);

    return {
      presentations,
      supplies,
      suppliers,
      products,
      recipes,
      suppliesWithStock,
      finishedLotsWithStock,
      sales,
      clients
    };
  }
}
