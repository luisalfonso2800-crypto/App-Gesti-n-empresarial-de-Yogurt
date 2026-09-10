import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class LotsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.lote.findMany({
      include: { produccion: true, producto: true }
    });
  }

  async findById(id) {
    return this.prisma.lote.findUnique({
      where: { id },
      include: { produccion: true, producto: true }
    });
  }

  async discardLot(id, cantidadMotivo) {
    return this.prisma.$transaction(async (prisma) => {
      const lote = await prisma.lote.findUnique({
        where: { id },
        include: { producto: true, insumo: true }
      });
      if (!lote) throw new Error("Lote no encontrado");
      
      const cantidadADescontar = Math.abs(cantidadMotivo.cantidad);
      if (Number(lote.cantidadDisponible) < cantidadADescontar) {
        throw new Error("Cantidad a descartar excede lo disponible en el lote");
      }

      // Update Lote
      const updatedLote = await prisma.lote.update({
        where: { id },
        data: {
          cantidadDisponible: { decrement: cantidadADescontar },
          estado: (Number(lote.cantidadDisponible) - cantidadADescontar) <= 0 ? 'AGOTADO' : lote.estado
        }
      });

      // Si es de producto terminado, descontar de InventarioProducto
      if (lote.tipoLote === 'PRODUCTO_TERMINADO' && lote.idProducto) {
        const inv = await prisma.inventarioProducto.findUnique({ where: { idProducto: lote.idProducto } });
        const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        const stockNuevo = stockAnterior - cantidadADescontar;
        
        await prisma.inventarioProducto.update({
          where: { idProducto: lote.idProducto },
          data: { cantidadActual: stockNuevo }
        });

        await prisma.movimientoInventario.create({
          data: {
            idProducto: lote.idProducto,
            idLote: lote.id,
            tipoMovimiento: 'MERMA_VENCIMIENTO',
            cantidad: cantidadADescontar,
            stockAnterior,
            stockNuevo,
            costoUnitario: lote.costoUnitario,
            motivo: cantidadMotivo.motivo || 'Vencimiento',
          }
        });
      } 
      // Si es insumo, descontar de Inventario
      else if (lote.idInsumo) {
        const inv = await prisma.inventario.findUnique({ where: { idInsumo: lote.idInsumo } });
        const stockAnterior = inv ? Number(inv.cantidadActual) : 0;
        const stockNuevo = stockAnterior - cantidadADescontar;

        await prisma.inventario.update({
          where: { idInsumo: lote.idInsumo },
          data: { cantidadActual: stockNuevo }
        });

        await prisma.movimientoInventario.create({
          data: {
            idInsumo: lote.idInsumo,
            idLote: lote.id,
            tipoMovimiento: 'MERMA_VENCIMIENTO',
            cantidad: cantidadADescontar,
            stockAnterior,
            stockNuevo,
            costoUnitario: lote.costoUnitario,
            motivo: cantidadMotivo.motivo || 'Vencimiento',
          }
        });
      }

      return updatedLote;
    });
  }
}
