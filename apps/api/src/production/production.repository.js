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

  async getRecipeBom(idReceta, cantidadProduccion, variantesQuery) {
    const receta = await this.prisma.receta.findUnique({
      where: { id: idReceta },
      include: {
        etapas: {
          where: { activo: true },
          include: { detalles: { where: { activo: true }, include: { insumo: true } } }
        }
      }
    });
    
    if (!receta) throw new Error("Receta no encontrada");
    
    const variantes = variantesQuery ? variantesQuery.split(',') : [];
    const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);
    
    const bom = [];
    
    for (const etapa of receta.etapas) {
      for (const det of etapa.detalles) {
        if (det.esOpcional && !variantes.includes(det.grupoVariante)) {
          continue; // Skip optional items not in active variants
        }
        
        let reqTeorico = Number(det.cantidadRequerida) * factorEscala;
        const merma = Number(det.mermaPorcentaje) || 0;
        reqTeorico = reqTeorico * (1 + (merma / 100));
        
        if (det.unidad === 'Unidades') {
          reqTeorico = Math.ceil(reqTeorico);
        }
        
        const inv = await this.prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
        const stockActual = inv ? Number(inv.cantidadActual) : 0;
        const faltante = Math.max(0, reqTeorico - stockActual);
        
        // Find cost from latest provider prices
        const price = await this.prisma.precioProveedor.findFirst({
          where: { idInsumo: det.idInsumo, activo: true },
          orderBy: { fechaRegistro: 'desc' }
        });
        const costoUnitario = price ? Number(price.costoUnidadBase) : 0;
        const costoTeorico = reqTeorico * costoUnitario;
        
        bom.push({
          idInsumo: det.idInsumo,
          nombreInsumo: det.insumo.nombre,
          etapa: etapa.nombre,
          tipoInsumo: det.tipoInsumo,
          requeridoTeorico: reqTeorico,
          unidad: det.unidad,
          stockActual: stockActual,
          faltante: faltante,
          ok: faltante === 0,
          costoTeorico: costoTeorico,
          costoUnitario: costoUnitario
        });
      }
    }
    
    return bom;
  }

  async createWithTransaction(data) {
    return this.prisma.$transaction(async (prisma) => {
      // Create production record with snapshot of BOM
      const produccion = await prisma.produccion.create({
        data: {
          fechaPlanificada: data.fechaPlanificada ? new Date(data.fechaPlanificada) : null,
          fechaProduccion: new Date(data.fechaProduccion),
          idProducto: data.idProducto,
          cantidadPlanificada: data.cantidadPlanificada,
          cantidadProducidaReal: data.cantidadProducidaReal || 0,
          estado: data.estado || 'PLANIFICADA',
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
          observaciones: data.observaciones,
          detalles: {
            create: data.detalles.map(d => ({
              idInsumo: d.idInsumo,
              cantidadTeorica: d.cantidadTeorica,
              unidad: d.unidad,
              costoTeorico: d.costoTeorico,
              // Init to 0 or same as theoretical, but usually 0 until complete
              cantidadRealUtilizada: null,
              costoReal: null,
              diferencia: null
            }))
          }
        },
        include: { detalles: true }
      });

      return produccion;
    });
  }

  async completeProduction(id, data) {
    return this.prisma.$transaction(async (prisma) => {
      const produccion = await prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true }
      });
      
      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado === 'COMPLETADA') throw new Error("Producción ya completada");

      // Update production details
      for (const updateDet of data.detalles) {
        const det = produccion.detalles.find(d => d.id === updateDet.id);
        if (det) {
          const qtyReal = Number(updateDet.cantidadRealUtilizada);
          const diferencia = qtyReal - Number(det.cantidadTeorica);
          // Recalculate cost
          const unitCost = Number(det.costoTeorico) / Number(det.cantidadTeorica);
          const costReal = qtyReal * (isNaN(unitCost) ? 0 : unitCost);
          
          await prisma.detalleProduccion.update({
            where: { id: det.id },
            data: {
              cantidadRealUtilizada: qtyReal,
              diferencia: diferencia,
              costoReal: costReal
            }
          });

          // Discount inventory
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          if (!inv || Number(inv.cantidadActual) < qtyReal) {
             // In real scenario we might allow negative stock or throw, but rules say discount from reported.
             // We'll just decrement, Prisma supports it (might go negative).
          }

          // Create inventory movement
          await prisma.movimientoInventario.create({
            data: {
              idInsumo: det.idInsumo,
              tipoMovimiento: 'SALIDA',
              cantidad: qtyReal,
              motivo: 'PRODUCCION',
              operacionOrigen: produccion.id
            }
          });
          
          // Upsert inventory
          await prisma.inventario.upsert({
            where: { idInsumo: det.idInsumo },
            update: { cantidadActual: { decrement: qtyReal } },
            create: { idInsumo: det.idInsumo, cantidadActual: -qtyReal }
          });
        }
      }

      const qtyProducida = data.cantidadProducidaReal || produccion.cantidadPlanificada;

      // Update main production status
      await prisma.produccion.update({
        where: { id },
        data: {
          estado: 'COMPLETADA',
          cantidadProducidaReal: qtyProducida,
          fechaProduccion: new Date()
        }
      });

      // Generate Lot
      const lote = await prisma.lote.create({
        data: {
          tipoLote: 'PRODUCTO_TERMINADO',
          idProduccion: produccion.id,
          idProducto: produccion.idProducto,
          fechaProduccion: new Date(),
          fechaVencimiento: produccion.fechaVencimiento || new Date(Date.now() + 15 * 86400000),
          cantidadInicial: qtyProducida,
          cantidadDisponible: qtyProducida,
          unidad: 'UNIDAD',
          estado: 'DISPONIBLE'
        }
      });

      await prisma.produccion.update({
        where: { id },
        data: { idLote: lote.id }
      });

      return prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true, lotes: true }
      });
    });
  }
}
