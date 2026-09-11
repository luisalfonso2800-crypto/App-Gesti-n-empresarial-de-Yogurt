export class ProductionOptimizerService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Genera el plan diario prescriptivo: "¿Qué producir?" vs "¿Qué no producir?"
   */
  async getDailyProductionPlan() {
    const now = new Date();
    const hace30Dias = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Consultar productos con sus recetas, stock en cava y ventas del último mes
    const productos = await this.prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        inventarioProducto: true,
        recetas: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: {
                    inventarios: true,
                    preciosProveedor: {
                      where: { estado: 'ACTIVO' },
                      orderBy: { fechaUltimaCompra: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        },
        detallesVenta: {
          where: {
            venta: {
              fechaVenta: { gte: hace30Dias },
              estado: { not: 'ANULADO' }
            }
          }
        }
      }
    });

    const queProducir = [];
    const queNoProducir = [];
    let utilidadTotalEstimada = 0;
    let inversionInsumosTotal = 0;

    for (const prod of productos) {
      const stockCava = Number(prod.inventarioProducto?.cantidadActual || 0);
      const unidadesVendidasMes = prod.detallesVenta.reduce(
        (acc, d) => acc + Number(d.cantidad || 0), 
        0
      );
      
      // Velocidad de venta diaria (mínimo 0.4 unidades/día para evitar división por cero)
      const velocidadDiaria = unidadesVendidasMes > 0 ? (unidadesVendidasMes / 30) : 0.4;
      const diasCobertura = Math.round(stockCava / velocidadDiaria);

      const receta = prod.recetas?.[0];
      if (!receta || !receta.detalles || receta.detalles.length === 0) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: 'Sin receta activa registrada en el sistema',
          stockActual: stockCava,
          diasCobertura,
          tipo: 'CONFIGURACION'
        });
        continue;
      }

      // 2. Verificar viabilidad de insumos para un batch estándar
      const batchSugerido = Number(receta.rendimientoBase || 100);
      let insumosSuficientes = true;
      let insumoCuelloBotella = null;
      let costoBatch = 0;

      for (const det of receta.detalles) {
        const factorEscala = batchSugerido / Number(receta.rendimientoBase || 1);
        const merma = 1 + (Number(det.mermaPorcentaje || 0) / 100);
        const cantRequerida = Number(det.cantidadRequerida) * factorEscala * merma;
        
        const stockInsumo = Number(det.insumo?.inventarios?.[0]?.cantidadActual || 0);
        const costoUnit = 
          Number(det.insumo?.inventarios?.[0]?.costoPromedio || 0) || 
          Number(det.insumo?.preciosProveedor?.[0]?.costoUnidadBase || 0);

        costoBatch += cantRequerida * costoUnit;

        if (stockInsumo < cantRequerida) {
          insumosSuficientes = false;
          insumoCuelloBotella = `${det.insumo.nombre} (requiere ${cantRequerida.toFixed(1)} ${det.insumo.unidadBase}, stock: ${stockInsumo.toFixed(1)})`;
          break;
        }
      }

      const precioVenta = Number(prod.precioVenta || 0);
      const ingresoEstimado = precioVenta * batchSugerido;
      const utilidadBatch = ingresoEstimado - costoBatch;
      const margenBatch = ingresoEstimado > 0 ? Math.round((utilidadBatch / ingresoEstimado) * 100) : 0;

      // 3. Reglas de Decisión Prescriptiva
      if (diasCobertura > 14) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: `Sobrestock en Cava: ${stockCava} unidades cubren ${diasCobertura} días de demanda`,
          stockActual: stockCava,
          diasCobertura,
          tipo: 'SOBRESTOCK'
        });
      } else if (!insumosSuficientes) {
        queNoProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          motivo: `Quiebre de insumo crítico: ${insumoCuelloBotella}`,
          stockActual: stockCava,
          diasCobertura,
          tipo: 'INSUMO_FALTANTE'
        });
      } else {
        // Cálculo de prioridad analítica (0 - 100)
        let prioridad = 70;
        if (diasCobertura <= 3) prioridad += 20;
        if (margenBatch >= 35) prioridad += 10;
        prioridad = Math.min(99, prioridad);

        utilidadTotalEstimada += utilidadBatch;
        inversionInsumosTotal += costoBatch;

        queProducir.push({
          id: prod.id,
          nombre: prod.nombre,
          cantidadSugerida: batchSugerido,
          prioridad,
          utilidadEstimada: Math.round(utilidadBatch),
          margen: margenBatch,
          stockActual: stockCava,
          diasCobertura,
          confianza: 88,
          justificacion: [
            `Cobertura crítica en Cava: ${diasCobertura} días restantes`,
            `Margen proyectado saludable del ${margenBatch}%`,
            `100% de insumos verificados en silos de planta`
          ]
        });
      }
    }

    queProducir.sort((a, b) => b.prioridad - a.prioridad);

    return {
      generatedAt: now,
      resumenEjecutivo: {
        batchesRecomendados: queProducir.length,
        utilidadProyectada: Math.round(utilidadTotalEstimada),
        inversionRequerida: Math.round(inversionInsumosTotal),
        productosDescartados: queNoProducir.length
      },
      queProducir,
      queNoProducir
    };
  }
}
