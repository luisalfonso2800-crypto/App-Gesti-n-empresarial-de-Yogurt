import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class SimulationEngineService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Simula la producción de X unidades de un producto
   * @param {string} productoId
   * @param {number} cantidadSimulada
   * @param {number} precioSimulado (opcional para simulación de margen)
   */
  async simulateBatch(productoId, cantidadSimulada, precioSimulado = null) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
      include: {
        recetas: {
          where: { activo: true },
          include: {
            etapas: {
              include: {
                detalles: {
                  include: {
                    insumo: {
                      include: { inventario: true, precios: { take: 1, orderBy: { fechaRegistro: 'desc' } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!producto || !producto.recetas || producto.recetas.length === 0) {
      throw new Error('El producto no posee una receta activa configurada.');
    }

    const receta = producto.recetas[0];
    const rendimientoBase = Number(receta.rendimientoBase || 1);
    const factorEscala = cantidadSimulada / rendimientoBase;

    let costoTotalSimulado = 0;
    let esViable = true;
    const requerimientosMap = new Map();

    for (const etapa of receta.etapas) {
      for (const det of etapa.detalles) {
        const insumoId = det.insumoId;
        const mermaFactor = 1 + (Number(det.mermaPorcentaje || 0) / 100);
        const cantidadNecesaria = Number(det.cantidadRequerida) * factorEscala * mermaFactor;
        
        let costoUnitario = 0;
        let stockDisponible = 0;
        
        if (det.insumo.inventario) {
          stockDisponible = Number(det.insumo.inventario.cantidadActual || 0);
          costoUnitario = Number(det.insumo.inventario.costoPromedio || 0);
        }
        
        if (costoUnitario === 0 && det.insumo.precios && det.insumo.precios.length > 0) {
           costoUnitario = Number(det.insumo.precios[0].costoUnidadBase || 0);
        }

        const subtotalCosto = cantidadNecesaria * costoUnitario;
        costoTotalSimulado += subtotalCosto;
        
        // Sumar si el insumo ya está en el map
        if (requerimientosMap.has(insumoId)) {
          const req = requerimientosMap.get(insumoId);
          req.cantidadNecesaria += cantidadNecesaria;
          req.subtotalCosto += subtotalCosto;
        } else {
          requerimientosMap.set(insumoId, {
            insumoId: det.insumo.id,
            nombre: det.insumo.nombre,
            unidad: det.insumo.unidadBase,
            cantidadNecesaria,
            stockDisponible,
            costoUnitario,
            subtotalCosto
          });
        }
      }
    }

    const requerimientos = Array.from(requerimientosMap.values()).map(req => {
      const deficit = req.stockDisponible < req.cantidadNecesaria ? (req.cantidadNecesaria - req.stockDisponible) : 0;
      if (deficit > 0) esViable = false;
      return {
        insumoId: req.insumoId,
        nombre: req.nombre,
        unidad: req.unidad,
        cantidadNecesaria: Number(req.cantidadNecesaria.toFixed(2)),
        stockDisponible: Number(req.stockDisponible.toFixed(2)),
        deficit: Number(deficit.toFixed(2)),
        alcanza: deficit === 0,
        subtotalCosto: Math.round(req.subtotalCosto),
        costoUnitario: req.costoUnitario
      };
    });

    const precioVentaEfectivo = precioSimulado ? Number(precioSimulado) : Number(producto.precioVenta || 0);
    const ingresoProyectado = precioVentaEfectivo * cantidadSimulada;
    const utilidadProyectada = ingresoProyectado - costoTotalSimulado;
    const margenProyectado = ingresoProyectado > 0 
      ? Number(((utilidadProyectada / ingresoProyectado) * 100).toFixed(1)) 
      : 0;

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precioVentaActual: Number(producto.precioVenta || 0),
        categoria: producto.categoria
      },
      escenario: {
        cantidadSimulada,
        precioAplicado: precioVentaEfectivo,
        esViable,
        ingresoProyectado: Math.round(ingresoProyectado),
        costoTotalSimulado: Math.round(costoTotalSimulado),
        costoUnitarioProyectado: Math.round(costoTotalSimulado / (cantidadSimulada || 1)),
        utilidadProyectada: Math.round(utilidadProyectada),
        margenProyectado
      },
      requerimientos
    };
  }
}
