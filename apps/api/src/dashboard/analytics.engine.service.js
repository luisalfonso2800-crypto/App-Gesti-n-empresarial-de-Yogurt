import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
@Dependencies(PrismaService)
export class AnalyticsEngineService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 1. Valorización Real de Cava de Producto Terminado
   */
  async getCavaValuation() {
    const invProductos = await this.prisma.inventarioProducto.findMany({
      include: { producto: true }
    });
    
    let totalCavaValue = 0;
    let totalUnidadesListas = 0;

    invProductos.forEach(inv => {
      const cantidad = Number(inv.cantidadActual || 0);
      const costo = Number(inv.costoPromedio || 0);
      totalCavaValue += cantidad * costo;
      totalUnidadesListas += cantidad;
    });

    return { totalCavaValue, totalUnidadesListas };
  }

  /**
   * 2. Liquidación de Costo Real por Ingrediente
   */
  async getCostBreakdown(idProducto) {
    // Buscar la receta activa
    const receta = await this.prisma.receta.findFirst({
      where: { idProducto, activo: true },
      include: {
        etapas: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: {
                    inventario: true,
                    precios: {
                      orderBy: { fechaRegistro: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!receta) return [];

    const breakdown = [];
    const rendimientoBase = Number(receta.rendimientoBase || 1);

    receta.etapas.forEach(etapa => {
      etapa.detalles.forEach(detalle => {
        const insumo = detalle.insumo;
        let costoUnitarioBase = 0;
        if (insumo.inventario && Number(insumo.inventario.costoPromedio) > 0) {
          costoUnitarioBase = Number(insumo.inventario.costoPromedio);
        } else if (insumo.precios && insumo.precios.length > 0) {
          costoUnitarioBase = Number(insumo.precios[0].costoUnidadBase);
        }

        const cantidadRequerida = Number(detalle.cantidadRequerida || 0);
        const mermaPorcentaje = Number(detalle.mermaPorcentaje || 0);
        
        // Cantidad con merma (lo que realmente se gasta)
        const cantidadTotal = cantidadRequerida * (1 + (mermaPorcentaje / 100));
        
        // Costo para la receta entera
        const costoTotalInsumo = cantidadTotal * costoUnitarioBase;
        
        // Costo unitario para 1 unidad del producto (basado en el rendimiento)
        const costoPorUnidad = costoTotalInsumo / (rendimientoBase > 0 ? rendimientoBase : 1);

        breakdown.push({
          name: insumo.nombre,
          cost: costoPorUnidad,
          percentage: 0 // Se calcula abajo
        });
      });
    });

    const totalCost = breakdown.reduce((acc, curr) => acc + curr.cost, 0);

    // Calcular porcentajes
    breakdown.forEach(item => {
      if (totalCost > 0) {
        item.percentage = (item.cost / totalCost) * 100;
      }
    });

    return {
      breakdown,
      totalCost
    };
  }

  /**
   * 3. Clasificación en la Matriz Ventas × Utilidad (4-Box Quadrant)
   */
  async getClassificationMatrix(ventasMes, margenPorcentaje) {
    // Definimos los umbrales para clasificar
    // Asumiremos unos umbrales base o buscaremos un promedio de ventas
    // ventasMes es unidades vendidas o total? El prompt dice "unidades vendidas en el mes".
    // Margen alto vs bajo (ej: 30%)
    
    // Simplificación para la lógica de la matriz 4-box basada en umbrales estáticos o dinámicos:
    const ALTA_VENTA_UMBRAL = 100; // Unidades vendidas (podemos ajustarlo)
    const ALTA_UTILIDAD_UMBRAL = 30; // Margen %

    let quadrant = '';
    let label = '';
    let action = '';
    let badgeColor = '';

    const esAltaVenta = ventasMes >= ALTA_VENTA_UMBRAL;
    const esAltaUtilidad = margenPorcentaje >= ALTA_UTILIDAD_UMBRAL;

    if (esAltaVenta && esAltaUtilidad) {
      quadrant = 'ESTRELLA';
      label = 'Producto Estrella';
      action = 'Priorizar producción continua';
      badgeColor = '#10B981'; // Verde
    } else if (esAltaVenta && !esAltaUtilidad) {
      quadrant = 'VOLUMEN';
      label = 'Alta Venta / Baja Utilidad';
      action = 'Revisar costos o receta';
      badgeColor = '#F59E0B'; // Ambar
    } else if (!esAltaVenta && esAltaUtilidad) {
      quadrant = 'NICHO_RENTABLE';
      label = 'Nicho Rentable';
      action = 'Impulsar comercialmente';
      badgeColor = '#3B82F6'; // Azul
    } else {
      quadrant = 'DEBIL';
      label = 'Producto Débil';
      action = 'Evaluar reformulación o retiro';
      badgeColor = '#EF4444'; // Rojo
    }

    return {
      quadrant,
      label,
      action,
      badgeColor
    };
  }

  async getProductAnalytics(idProducto) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Unidades vendidas en el mes
    const ventasMesAgg = await this.prisma.detalleVenta.aggregate({
      _sum: { cantidad: true },
      where: {
        idProducto,
        venta: { fechaVenta: { gte: startOfMonth } }
      }
    });

    const ventasMes = Number(ventasMesAgg._sum.cantidad || 0);

    const costBreakdownResult = await this.getCostBreakdown(idProducto);
    
    return {
      ventasMes,
      breakdown: costBreakdownResult.breakdown,
      calculatedCost: costBreakdownResult.totalCost
    };
  }
}
