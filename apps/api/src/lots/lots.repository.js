import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class LotsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    const lotes = await this.prisma.lote.findMany({
      where: {
        tipoLote: { in: ['PRODUCTO_TERMINADO', 'SEMIELABORADO_WIP'] }
      },
      include: {
        produccion: true,
        producto: {
          include: {
            presentacion: true
          }
        },
        lotePadre: true,
        lotesHijos: true
      },
      orderBy: { fechaProduccion: 'desc' }
    });

    return lotes.map(lote => {
      let unidadReal = lote.unidad;
      if (!unidadReal || unidadReal === 'UNIDAD' || unidadReal === 'UND') {
        unidadReal = lote.producto?.presentacion?.unidadMedida || (lote.tipoLote === 'SEMIELABORADO_WIP' ? 'Litros' : 'Litros');
      }
      return {
        ...lote,
        unidad: unidadReal
      };
    });
  }

  async findById(id) {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      include: {
        produccion: true,
        producto: {
          include: {
            presentacion: true
          }
        },
        lotePadre: true,
        lotesHijos: true
      }
    });

    if (!lote) return null;

    let unidadReal = lote.unidad;
    if (!unidadReal || unidadReal === 'UNIDAD' || unidadReal === 'UND') {
      unidadReal = lote.producto?.presentacion?.unidadMedida || (lote.tipoLote === 'SEMIELABORADO_WIP' ? 'Litros' : 'Litros');
    }
    return {
      ...lote,
      unidad: unidadReal
    };
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
