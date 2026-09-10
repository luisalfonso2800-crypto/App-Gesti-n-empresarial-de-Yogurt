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

  async adjustInventory({ idInsumo, idProducto, cantidadAjuste, tipo, motivo }) {
    return this.prisma.$transaction(async (tx) => {
      let stockAnterior = 0;
      let costoUnitario = 0;
      
      if (idInsumo) {
        const inv = await tx.inventario.findUnique({ where: { idInsumo } });
        stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        costoUnitario = inv ? Number(inv.costoPromedio || 0) : 0;
        
        const stockNuevo = stockAnterior + cantidadAjuste;

        await tx.inventario.upsert({
          where: { idInsumo },
          create: { idInsumo, cantidadActual: stockNuevo },
          update: { cantidadActual: stockNuevo }
        });

        return tx.movimientoInventario.create({
          data: {
            idInsumo,
            tipoMovimiento: tipo,
            cantidad: Math.abs(cantidadAjuste),
            stockAnterior,
            stockNuevo,
            costoUnitario,
            motivo
          }
        });
      } else if (idProducto) {
        const inv = await tx.inventarioProducto.findUnique({ where: { idProducto } });
        stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        costoUnitario = inv ? Number(inv.costoPromedio || 0) : 0;
        
        const stockNuevo = stockAnterior + cantidadAjuste;

        await tx.inventarioProducto.upsert({
          where: { idProducto },
          create: { idProducto, cantidadActual: stockNuevo },
          update: { cantidadActual: stockNuevo }
        });

        return tx.movimientoInventario.create({
          data: {
            idProducto,
            tipoMovimiento: tipo,
            cantidad: Math.abs(cantidadAjuste),
            stockAnterior,
            stockNuevo,
            costoUnitario,
            motivo
          }
        });
      }
      throw new Error('Debe proveer idInsumo o idProducto');
    });
  }
}
