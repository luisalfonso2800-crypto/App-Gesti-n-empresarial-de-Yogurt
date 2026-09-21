import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class ProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.findWithCavaStock();
  }

  async findActive() {
    return this.findWithCavaStock({ activo: true });
  }

  async findForSaleSelector() {
    const products = await this.prisma.producto.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        categoria: true,
        precioVenta: true,
        precioMayorista: true,
        cantidadMinimaMayorista: true,
        imagenUrl: true,
        presentacion: {
          select: {
            id: true,
            nombre: true,
            cantidadOz: true,
            cantidadMl: true,
            tipoEnvase: true,
            unidadMedida: true
          }
        },
        inventario: {
          select: {
            cantidadActual: true,
            costoPromedio: true
          }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    return products.map(p => {
      const stockReal = Number(p.inventario?.cantidadActual || 0);
      const pres = p.presentacion;
      const volPres = pres ? (
        pres.cantidadMl ? `${pres.cantidadOz ? `${pres.cantidadOz} oz / ` : ''}${pres.cantidadMl} ml` : (pres.nombre || '')
      ) : '';

      return {
        ...p,
        stock: stockReal,
        stockCava: stockReal,
        stockActual: stockReal,
        volumenPresentacion: volPres,
        presentacionNombre: pres?.nombre || ''
      };
    });
  }

  async findWithCavaStock(where = {}) {
    const products = await this.prisma.producto.findMany({
      where,
      include: {
        presentacion: true,
        inventario: true,
        lotes: {
          where: { estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } },
          select: { cantidadDisponible: true, tipoLote: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    // Cargar todos los productos con inventario y lotes para resolución consolidada por nombre base
    const allProducts = await this.prisma.producto.findMany({
      include: {
        inventario: true,
        lotes: {
          where: { estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } },
          select: { cantidadDisponible: true }
        }
      }
    });

    return products.map(prod => {
      const baseName = (prod.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase();

      // Buscar productos coincidentes por ID o por nombre base
      const matching = allProducts.filter(item => {
        if (item.id === prod.id) return true;
        const itemClean = (item.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase();
        return itemClean === baseName;
      });

      let totalLotes = 0;
      let totalInventario = 0;

      for (const m of matching) {
        const invQty = Number(m.inventario?.cantidadActual || 0);
        totalInventario += invQty;
        const lotesSum = (m.lotes || []).reduce((acc, l) => acc + Number(l.cantidadDisponible || 0), 0);
        totalLotes += lotesSum;
      }

      // Tomar el mayor entre lotes físicos activos y el inventario registrado
      const stockReal = Math.max(totalLotes, totalInventario);

      const pres = prod.presentacion;
      const volPres = pres ? (
        pres.volumen || pres.volumenOzMl || (
          pres.cantidadMl ? `${pres.cantidadOz ? `${pres.cantidadOz} oz / ` : ''}${pres.cantidadMl} ml` : ''
        ) || pres.capacidad || ''
      ) : '';

      return {
        ...prod,
        stock: stockReal,
        stockLitros: stockReal,
        stockCava: stockReal,
        stockActual: stockReal,
        volumenPresentacion: volPres,
        nombrePresentacion: pres?.nombre || ''
      };
    });
  }

  async findIntermediates() {
    const products = await this.prisma.producto.findMany({
      where: {
        activo: true,
        OR: [
          { categoria: 'BASES_LACTEAS' },
          { categoria: 'INTERMEDIO_WIP' }
        ]
      },
      include: {
        presentacion: true,
        inventario: true,
        lotes: {
          where: { tipoLote: 'SEMIELABORADO_WIP', cantidadDisponible: { gt: 0 } },
          orderBy: { fechaProduccion: 'desc' }
        }
      }
    });

    const activeWipLot = await this.prisma.lote.findFirst({
      where: { tipoLote: 'SEMIELABORADO_WIP', cantidadDisponible: { gt: 0 } },
      orderBy: { fechaVencimiento: 'asc' }
    });

    const basesMap = new Map();

    for (const p of products) {
      const nombreLimpio = (p.nombre || '')
        .replace(/\s*\(.*?\)/g, '')
        .replace(/\s*-\s*YOGURT A GRANEL/i, '')
        .trim();

      if (!nombreLimpio) continue;

      const rawCosto = Number(p.lotes?.[0]?.costoUnitario || p.inventario?.costoPromedio || p.costoEstandar || 0);
      const costoLitro = rawCosto > 0 ? rawCosto : 4390;

      // Si aún no está en el mapa, o si este registro tiene inventario físico con stock real
      const existing = basesMap.get(nombreLimpio);
      const currentStock = Number(p.inventario?.cantidadActual || 0);
      const existingStock = Number(existing?.inventario?.cantidadActual || 0);

      if (!existing || currentStock > existingStock) {
        basesMap.set(nombreLimpio, {
          ...p,
          nombre: nombreLimpio,
          displayLabel: nombreLimpio,
          unidadMedida: 'Litros',
          tipoItem: 'BASE_GRANEL',
          costoUnitario: costoLitro,
          costoEstandar: costoLitro
        });
      }
    }

    const result = [];

    // Ítem maestro permanente de inóculo láctico (WIP) para formulación de recetas
    const baseReferencia = basesMap.size > 0 ? Array.from(basesMap.values())[0] : products[0];
    const baseId = baseReferencia?.id || 'INOCULO_BASE_WIP';
    const costoLitroBase = Number(baseReferencia?.costoUnitario || baseReferencia?.costoEstandar || 4390);
    const costoGramo = costoLitroBase / 1000;

    result.push({
      ...(baseReferencia || {}),
      id: baseId,
      idItem: `INOCULO:${baseId}`,
      nombre: '🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)',
      displayLabel: '🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP) - g',
      unidadMedida: 'g',
      unidad: 'g',
      tipoItem: 'INOCULO_WIP',
      categoria: 'INOCULO_WIP',
      costoUnitario: costoGramo,
      costoEstandar: costoGramo
    });

    // Agregar las bases deduplicadas limpias
    for (const base of basesMap.values()) {
      result.push(base);
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
    const cleanData = { ...data };
    if (cleanData.precioVenta !== undefined) {
      cleanData.precioVenta = Number(cleanData.precioVenta);
    }
    if (cleanData.margenObjetivo !== undefined) {
      cleanData.margenObjetivo = Number(cleanData.margenObjetivo);
    }
    if (cleanData.precioMayorista !== undefined) {
      cleanData.precioMayorista = cleanData.precioMayorista !== null && cleanData.precioMayorista !== '' ? Number(cleanData.precioMayorista) : null;
    }
    if (cleanData.cantidadMinimaMayorista !== undefined) {
      cleanData.cantidadMinimaMayorista = cleanData.cantidadMinimaMayorista !== null && cleanData.cantidadMinimaMayorista !== '' ? Number(cleanData.cantidadMinimaMayorista) : 12;
    }
    if (cleanData.descuentoMayoristaPorcentaje !== undefined) {
      cleanData.descuentoMayoristaPorcentaje = cleanData.descuentoMayoristaPorcentaje !== null && cleanData.descuentoMayoristaPorcentaje !== '' ? Number(cleanData.descuentoMayoristaPorcentaje) : null;
    }
    return this.prisma.producto.create({
      data: cleanData,
    });
  }

  async update(id, data) {
    const {
      id: _id,
      stockLitros,
      stockCava,
      stockActual,
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

    if (cleanData.precioVenta !== undefined) {
      cleanData.precioVenta = Number(cleanData.precioVenta);
    }
    if (cleanData.margenObjetivo !== undefined) {
      cleanData.margenObjetivo = Number(cleanData.margenObjetivo);
    }
    if (cleanData.precioMayorista !== undefined) {
      cleanData.precioMayorista = cleanData.precioMayorista !== null && cleanData.precioMayorista !== '' ? Number(cleanData.precioMayorista) : null;
    }
    if (cleanData.cantidadMinimaMayorista !== undefined) {
      cleanData.cantidadMinimaMayorista = cleanData.cantidadMinimaMayorista !== null && cleanData.cantidadMinimaMayorista !== '' ? Number(cleanData.cantidadMinimaMayorista) : 12;
    }
    if (cleanData.descuentoMayoristaPorcentaje !== undefined) {
      cleanData.descuentoMayoristaPorcentaje = cleanData.descuentoMayoristaPorcentaje !== null && cleanData.descuentoMayoristaPorcentaje !== '' ? Number(cleanData.descuentoMayoristaPorcentaje) : null;
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
