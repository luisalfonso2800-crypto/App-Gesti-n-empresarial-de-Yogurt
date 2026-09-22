import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { normalizeUnit, areCompatible, convert } from '../common/units/unit-registry.js';

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
    const records = await this.prisma.inventarioProducto.findMany({
      where: {
        producto: {
          categoria: { in: ['LACTEOS', 'PRODUCTO_TERMINADO', 'BASES_LACTEAS', 'PREMEZCLA_PLANTA'] }
        }
      },
      include: {
        producto: {
          include: {
            presentacion: true,
            recetas: { take: 1, select: { unidadRendimiento: true } },
            lotes: {
              where: {
                cantidadDisponible: { gt: 0 }
              }
            }
          }
        }
      },
      orderBy: { fechaActualizacion: 'desc' }
    });

    return records.map((item) => {
      const prod = item.producto || {};
      const lotesActivos = prod.lotes || [];
      // HAL-F4-08: no truncar stock real — si hay desajuste, debe ser visible
      const stockRealLotes = lotesActivos.length > 0
        ? lotesActivos.reduce((acc, l) => acc + Number(l.cantidadDisponible || 0), 0)
        : Number(item.cantidadActual || 0);

      let costoRef = Number(item.costoPromedio || prod.costoEstandar || 0);
      const unidadReceta = prod.recetas?.[0]?.unidadRendimiento;
      const esEnvasado = Boolean(prod.presentacionId || prod.categoria === 'LACTEOS');
      const unidadMedida = unidadReceta || prod.unidadMedida || (esEnvasado ? 'Unidades' : 'Litros');

      // Poka-Yoke contable: si el costo base o estándar estaba expresado en gramos y la unidad es Litros, ajustar factor
      if ((unidadMedida === 'Litros' || unidadMedida === 'L') && costoRef > 0 && costoRef < 10) {
        costoRef = costoRef * 1000;
      }

      // Blindaje de desbordamiento: si el costo unitario por litro excede un umbral lógico (> $15.000/L), normalizar a estándar (~3869 COP/L)
      if (costoRef > 15000) {
        costoRef = Number(prod.recetas?.[0]?.costoUnitarioProyectado || prod.costoEstandar || 3869);
        if (costoRef > 15000) costoRef = 3869;
      }

      const valorizacionTotal = stockRealLotes * costoRef;
      const pres = prod.presentacion;
      const volPres = pres ? (
        pres.volumen || pres.volumenOzMl || (
          pres.cantidadMl ? `${pres.cantidadOz ? `${pres.cantidadOz} oz / ` : ''}${pres.cantidadMl} ml` : ''
        ) || pres.capacidad || ''
      ) : '';

      return {
        ...item,
        costoPromedio: costoRef,
        cantidadActual: stockRealLotes,
        unidadMedida: unidadMedida,
        valorizacionTotal: valorizacionTotal,
        volumenPresentacion: volPres,
        nombrePresentacion: pres?.nombre || '',
        lotes: lotesActivos
      };
    });
  }

  async findWipLots() {
    return this.prisma.lote.findMany({
      where: {
        tipoLote: 'SEMIELABORADO_WIP',
        cantidadDisponible: { gt: 0 }
      },
      include: {
        producto: true,
        lotePadre: true
      },
      orderBy: { fechaVencimiento: 'asc' }
    });
  }

  async adjustInventory({ idInsumo, idProducto, cantidadAjuste, tipo, motivo, costoUnitario: inputCosto, unidadMovimiento }) {
    return this.prisma.$transaction(async (tx) => {
      let stockAnterior = 0;
      let costoUnitario = 0;
      
      if (idInsumo) {
        const insumoRecord = await tx.insumo.findUnique({ where: { idInsumo } });
        if (!insumoRecord) throw new Error('Insumo no encontrado');

        // HAL-F2-02: Normalizar dimensionalmente la cantidad al unidadBase del insumo
        let cantidadNormalizada = cantidadAjuste;
        if (unidadMovimiento) {
          const unitFrom = normalizeUnit(unidadMovimiento);
          const unitTo = normalizeUnit(insumoRecord.unidadBase);
          if (unitFrom && unitTo && unitFrom !== unitTo) {
            if (!areCompatible(unitFrom, unitTo)) {
              throw new Error(`Unidad del movimiento (${unidadMovimiento}) incompatible con unidad base del insumo (${insumoRecord.unidadBase})`);
            }
            cantidadNormalizada = convert(cantidadAjuste, unitFrom, unitTo);
          }
        }

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

        const stockNuevo = stockAnterior + cantidadNormalizada;

        // Calcular nuevo costo promedio
        let nuevoCostoPromedio = costoAnterior;
        if (!inv || stockAnterior <= 0) {
          // Caso en frío o existencia previa en cero
          nuevoCostoPromedio = costoUnitario > 0 ? costoUnitario : Number(insumoRecord.costoBase || 0);
        } else if ((tipo === 'CARGA_INICIAL' || tipo === 'AJUSTE_POSITIVO') && cantidadNormalizada > 0 && costoUnitario > 0) {
          // Ponderación de costo promedio
          const valorAnterior = stockAnterior * costoAnterior;
          const valorAjuste = cantidadNormalizada * costoUnitario;
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
            cantidad: Math.abs(cantidadNormalizada),
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
