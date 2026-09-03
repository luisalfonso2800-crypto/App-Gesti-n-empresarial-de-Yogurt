import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ProductionRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.produccion.findMany({
      include: { detalles: true, lotes: true }
    });
  }

  async findById(id) {
    return this.prisma.produccion.findUnique({
      where: { id },
      include: { detalles: true, lotes: true }
    });
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // Create production record
      const produccion = await prisma.produccion.create({
        data: {
          fechaPlanificada: data.fechaPlanificada ? new Date(data.fechaPlanificada) : null,
          fechaProduccion: new Date(data.fechaProduccion),
          idProducto: data.idProducto,
          cantidadPlanificada: data.cantidadPlanificada,
          cantidadProducidaReal: data.cantidadProducidaReal,
          estado: data.estado || 'COMPLETADA',
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
          observaciones: data.observaciones,
          detalles: {
            create: data.detalles.map(d => ({
              idInsumo: d.idInsumo,
              cantidadTeorica: d.cantidadTeorica,
              cantidadRealUtilizada: d.cantidadRealUtilizada,
              diferencia: d.diferencia,
              unidad: d.unidad,
              costoTeorico: d.costoTeorico,
              costoReal: d.costoReal
            }))
          }
        },
        include: { detalles: true }
      });

      if (produccion.estado === 'COMPLETADA') {
        // Generate Lot
        const lote = await prisma.lote.create({
          data: {
            tipoLote: 'PRODUCTO_TERMINADO',
            idProduccion: produccion.id,
            idProducto: produccion.idProducto,
            fechaProduccion: produccion.fechaProduccion,
            fechaVencimiento: produccion.fechaVencimiento,
            cantidadInicial: produccion.cantidadProducidaReal || produccion.cantidadPlanificada,
            cantidadDisponible: produccion.cantidadProducidaReal || produccion.cantidadPlanificada,
            unidad: 'UNIDAD', // Defaulting for simplicity
            estado: 'DISPONIBLE'
          }
        });

        // Update produccion with lote ID
        await prisma.produccion.update({
          where: { id: produccion.id },
          data: { idLote: lote.id }
        });

        // Consume inventory for each detail
        for (const detalle of produccion.detalles) {
          const cantidadUsada = detalle.cantidadRealUtilizada || detalle.cantidadTeorica;
          
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: detalle.idInsumo } });
          if (!inv || inv.cantidadActual < cantidadUsada) {
            throw new Error(`Inventory insufficient for Insumo ${detalle.idInsumo}`);
          }

          await prisma.inventario.update({
            where: { idInsumo: detalle.idInsumo },
            data: { cantidadActual: { decrement: cantidadUsada } }
          });

          await prisma.movimientoInventario.create({
            data: {
              idInsumo: detalle.idInsumo,
              tipoMovimiento: 'SALIDA',
              cantidad: cantidadUsada,
              motivo: 'PRODUCCION',
              operacionOrigen: produccion.id
            }
          });
        }
      }
      return produccion;
    });
  }
}
