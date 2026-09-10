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

  async startProduction(id) {
    return this.prisma.$transaction(async (prisma) => {
      const produccion = await prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true }
      });
      if (!produccion) throw new Error("Producción no encontrada");
      if (produccion.estado !== 'PLANIFICADA') throw new Error("Solo órdenes planificadas pueden iniciarse");

      for (const det of produccion.detalles) {
        const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
        const stock = inv ? Number(inv.cantidadActual) : 0;
        if (stock < Number(det.cantidadTeorica)) {
          throw new Error(`Stock insuficiente para el insumo ${det.idInsumo}`);
        }
      }

      return prisma.produccion.update({
        where: { id },
        data: { estado: 'EN_PROCESO' },
        include: { detalles: true }
      });
    });
  }

  async createPurchaseOrderFromShortage(data) {
    const { itemsFaltantes } = data; // Array of { idInsumo, faltante }
    if (!itemsFaltantes || itemsFaltantes.length === 0) throw new Error("No hay items faltantes especificados");

    return this.prisma.$transaction(async (prisma) => {
      const oc = await prisma.ordenCompra.create({
        data: {
          codigo: `ORD-FALTANTE-${Date.now()}`,
          nombre: `Abastecimiento Automático por Faltante de Producción`,
          estado: 'PENDIENTE',
          items: {
            create: itemsFaltantes.map(f => ({
              idInsumo: f.idInsumo,
              cantidad: f.faltante,
              estadoItem: 'PENDIENTE'
            }))
          }
        },
        include: { items: true }
      });
      return oc;
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

      let costoTotalLote = 0;

      // Update production details and discount raw materials
      for (const updateDet of data.detalles) {
        const det = produccion.detalles.find(d => d.id === updateDet.id);
        if (det) {
          const qtyReal = Number(updateDet.cantidadRealUtilizada);
          const diferencia = qtyReal - Number(det.cantidadTeorica);
          
          const inv = await prisma.inventario.findUnique({ where: { idInsumo: det.idInsumo } });
          const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
          const costoUnitarioInsumo = inv ? Number(inv.costoPromedio || 0) : (Number(det.costoTeorico) / Number(det.cantidadTeorica) || 0);
          
          const costReal = qtyReal * costoUnitarioInsumo;
          costoTotalLote += costReal;
          
          await prisma.detalleProduccion.update({
            where: { id: det.id },
            data: {
              cantidadRealUtilizada: qtyReal,
              diferencia: diferencia,
              costoReal: costReal
            }
          });

          const stockNuevo = stockAnterior - qtyReal;

          await prisma.movimientoInventario.create({
            data: {
              idInsumo: det.idInsumo,
              tipoMovimiento: 'SALIDA_PRODUCCION',
              cantidad: qtyReal,
              stockAnterior: stockAnterior,
              stockNuevo: stockNuevo,
              costoUnitario: costoUnitarioInsumo,
              motivo: 'Consumo por orden de producción',
              operacionOrigen: produccion.id
            }
          });
          
          await prisma.inventario.upsert({
            where: { idInsumo: det.idInsumo },
            update: { cantidadActual: stockNuevo },
            create: { idInsumo: det.idInsumo, cantidadActual: stockNuevo }
          });
        }
      }

      const qtyProducida = Number(data.cantidadProducidaReal) || Number(produccion.cantidadPlanificada);
      const costoUnitarioFabricacion = qtyProducida > 0 ? costoTotalLote / qtyProducida : 0;

      // Update main production status
      await prisma.produccion.update({
        where: { id },
        data: {
          estado: 'COMPLETADA',
          cantidadProducidaReal: qtyProducida,
          fechaProduccion: new Date()
        }
      });

      // Generate Lot for Finished Product
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
          estado: 'DISPONIBLE',
          costoUnitario: costoUnitarioFabricacion
        }
      });

      await prisma.produccion.update({
        where: { id },
        data: { idLote: lote.id }
      });

      // Upsert Finished Product Inventory
      const invProd = await prisma.inventarioProducto.findUnique({ where: { idProducto: produccion.idProducto } });
      const stockAnteriorProd = invProd ? Number(invProd.cantidadActual) : 0;
      const stockNuevoProd = stockAnteriorProd + qtyProducida;
      
      // Calculate new weighted average cost
      let nuevoCostoPromedio = costoUnitarioFabricacion;
      if (invProd && stockAnteriorProd > 0) {
        const valorAnterior = stockAnteriorProd * Number(invProd.costoPromedio || 0);
        const valorNuevo = qtyProducida * costoUnitarioFabricacion;
        nuevoCostoPromedio = (valorAnterior + valorNuevo) / stockNuevoProd;
      }

      await prisma.inventarioProducto.upsert({
        where: { idProducto: produccion.idProducto },
        update: { cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio },
        create: { idProducto: produccion.idProducto, cantidadActual: stockNuevoProd, costoPromedio: nuevoCostoPromedio }
      });

      // Insert Movement for Finished Product
      await prisma.movimientoInventario.create({
        data: {
          idProducto: produccion.idProducto,
          tipoMovimiento: 'ENTRADA_PRODUCCION',
          cantidad: qtyProducida,
          stockAnterior: stockAnteriorProd,
          stockNuevo: stockNuevoProd,
          costoUnitario: costoUnitarioFabricacion,
          motivo: 'Ingreso a cava de producto terminado',
          operacionOrigen: produccion.id
        }
      });

      return prisma.produccion.findUnique({
        where: { id },
        include: { detalles: true, lotes: true }
      });
    });
  }
}
