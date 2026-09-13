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
      include: { 
        insumo: {
          include: { precios: true }
        }
      },
      orderBy: { fechaActualizacion: 'desc' }
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

  async findFinishedProducts() {
    return this.prisma.inventarioProducto.findMany({
      include: { producto: { include: { presentacion: true } } },
      orderBy: { fechaActualizacion: 'desc' }
    });
  }

  async adjustInventory({ idInsumo, idProducto, cantidadAjuste, tipo, motivo, costoUnitario: inputCosto }) {
    return this.prisma.$transaction(async (tx) => {
      let stockAnterior = 0;
      let costoUnitario = 0;
      
      if (idInsumo) {
        const insumoRecord = await tx.insumo.findUnique({ where: { idInsumo } });
        if (!insumoRecord) throw new Error('Insumo no encontrado');

        const inv = await tx.inventario.findUnique({ where: { idInsumo } });
        stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        const costoAnterior = inv ? Number(inv.costoPromedio || 0) : 0;
        
        // Determinar el costo unitario del movimiento
        if (inputCosto !== undefined && inputCosto !== null && inputCosto !== '') {
          costoUnitario = Number(inputCosto) || 0;
        } else if (costoAnterior > 0) {
          costoUnitario = costoAnterior;
        } else if (insumoRecord.costoBase) {
          costoUnitario = Number(insumoRecord.costoBase);
        } else {
          costoUnitario = 0;
        }

        const stockNuevo = stockAnterior + cantidadAjuste;

        // Calcular nuevo costo promedio
        let nuevoCostoPromedio = costoAnterior;
        if (!inv || stockAnterior <= 0) {
          // Caso en frío o existencia previa en cero
          nuevoCostoPromedio = costoUnitario > 0 ? costoUnitario : Number(insumoRecord.costoBase || 0);
        } else if ((tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO') && cantidadAjuste > 0 && costoUnitario > 0) {
          // Ponderación de costo promedio
          const valorAnterior = stockAnterior * costoAnterior;
          const valorAjuste = cantidadAjuste * costoUnitario;
          nuevoCostoPromedio = stockNuevo > 0 ? (valorAnterior + valorAjuste) / stockNuevo : costoUnitario;
        }

        await tx.inventario.upsert({
          where: { idInsumo },
          create: { 
            idInsumo, 
            cantidadActual: stockNuevo,
            costoPromedio: nuevoCostoPromedio > 0 ? nuevoCostoPromedio : null
          },
          update: { 
            cantidadActual: stockNuevo,
            costoPromedio: nuevoCostoPromedio > 0 ? nuevoCostoPromedio : inv.costoPromedio
          }
        });

        return tx.movimientoInventario.create({
          data: {
            idInsumo,
            tipoMovimiento: tipo,
            cantidad: Math.abs(cantidadAjuste),
            stockAnterior,
            stockNuevo,
            costoUnitario: costoUnitario > 0 ? costoUnitario : null,
            motivo
          }
        });
      } else if (idProducto) {
        const inv = await tx.inventarioProducto.findUnique({ where: { idProducto } });
        stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        costoUnitario = inv ? Number(inv.costoPromedio || 0) : 0;
        if (inputCosto !== undefined && inputCosto !== null && inputCosto !== '') {
          costoUnitario = Number(inputCosto) || costoUnitario;
        }
        
        const stockNuevo = stockAnterior + cantidadAjuste;

        await tx.inventarioProducto.upsert({
          where: { idProducto },
          create: { idProducto, cantidadActual: stockNuevo, costoPromedio: costoUnitario > 0 ? costoUnitario : null },
          update: { cantidadActual: stockNuevo }
        });

        return tx.movimientoInventario.create({
          data: {
            idProducto,
            tipoMovimiento: tipo,
            cantidad: Math.abs(cantidadAjuste),
            stockAnterior,
            stockNuevo,
            costoUnitario: costoUnitario > 0 ? costoUnitario : null,
            motivo
          }
        });
      }
      throw new Error('Debe proveer idInsumo o idProducto');
    });
  }
}
