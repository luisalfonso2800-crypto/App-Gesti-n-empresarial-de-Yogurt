# IMPLEMENTACIÓN DEL MOTOR ANALÍTICO (FASE 1): COSTEO REAL DE RECETAS, VALORIZACIÓN DE CAVA Y MATRIZ 4-BOX

REGLAS DE ARQUITECTURA Y MODO BISTURÍ:
- Crea el nuevo servicio desacoplado `apps/api/src/dashboard/analytics.engine.service.js` para no saturar `dashboard.service.js`.
- Modifica `apps/api/src/dashboard/dashboard.service.js`, `dashboard.module.ts` (o `.js`), `apps/web/src/app/dashboard/components/LiquidSilosCanvas.jsx` y la tarjeta de Telemetría de Productos en `apps/web/src/app/dashboard/page.jsx`.
- Cero Tailwind: conserva CSS Modules.
- Cero scroll: la vista actual debe mantenerse en 100vh exactos sin romper ningún contrato de datos existente.
- Erradica de raíz el mock duro detectado en la auditoría (`cost * 0.4`): los costos y márgenes deben calcularse a partir de `Receta`, `DetalleReceta` y compras reales en Prisma.

---

### 1. CREACIÓN DEL MOTOR ANALÍTICO (`apps/api/src/dashboard/analytics.engine.service.js`):
Implementa el motor analítico que ejecute los cálculos de la Matriz Maestra:

1. **Valorización Real de Cava de Producto Terminado:**
   - Consulta `prisma.inventarioProducto.findMany({ include: { producto: true } })`.
   - Suma el capital inmovilizado: `totalCavaValue = sum(cantidadActual * costoPromedio)`.
   - Calcula el total de unidades listas en cava.

2. **Liquidación de Costo Real por Ingrediente (Sin porcentajes arbitrarios):**
   - Para el producto en rotación o seleccionado:
     * Consulta su `Receta` activa y los insumos requeridos en `DetalleReceta`.
     * Cruza la cantidad requerida con el `costoPromedio` de la tabla `Inventario` (o el último precio registrado en `PrecioProveedor`).
     * Calcula el factor de merma (`mermaPorcentaje`) real.
     * Retorna el arreglo desglosado: `[{ name: 'Leche cruda', cost: 1850, percentage: 54 }, ...]`.
     * Calcula la utilidad unitaria real: `precioVenta - costoTotalCalculado` y el margen porcentual real.

3. **Clasificación en la Matriz Ventas × Utilidad (4-Box Quadrant):**
   - Cruza las unidades vendidas en el mes con la utilidad generada:
     * Alta Venta + Alta Utilidad ➔ `ESTRELLA` (Priorizar producción).
     * Alta Venta + Baja Utilidad ➔ `VOLUMEN` (Revisar costos o receta).
     * Baja Venta + Alta Utilidad ➔ `NICHO_RENTABLE` (Impulsar comercialmente).
     * Baja Venta + Baja Utilidad ➔ `DEBIL` (Evaluar reformulación o retiro).

---

### 2. INTEGRACIÓN EN `dashboard.service.js`:
1. Inyecta `AnalyticsEngineService`.
2. En `getFullTelemetry()`:
   - Reemplaza `inventoryValuation.finishedGoodsValue` por el valor real calculado de la Cava (para sustituir el `$0` actual).
   - Reemplaza `productsTelemetry.costBreakdown` por el desglose real proveniente de recetas e inventario.
   - Agrega al payload de cada producto:
     ```json
     {
       "classification": {
         "quadrant": "ESTRELLA",
         "label": "Producto Estrella",
         "action": "Priorizar producción continua",
         "badgeColor": "#10B981"
       }
     }
     ```

---

### 3. ACTUALIZACIÓN EN FRONTEND (CERO REGRESIONES):

1. **Silo de Cava de Producto Terminado (`LiquidSilosCanvas.jsx`):**
   - Asegura que el canvas reciba `finishedGoodsValue` y el nivel volumétrico de Producto Terminado real.
   - El tanque derecho ("CAVA PRODUCTO") debe desplegar su nivel de fluido y la cifra real en pesos formateada (ej. `$ 2.450.000` en lugar de `$ 0`).

2. **Tarjeta de Telemetría de Productos (`page.jsx` / `Dashboard.module.css`):**
   - Añade en la esquina superior del producto un pill sutil de clasificación SCADA:
     ```jsx
     {product.classification && (
       <span 
         className={styles.quadrantBadge} 
         style={{ borderColor: product.classification.badgeColor, color: product.classification.badgeColor }}
         title={product.classification.action}
       >
         ✦ {product.classification.label.toUpperCase()}
       </span>
     )}
     ```
   - Actualiza el tacómetro radial para que refleje el margen real calculado contra recetas vivas.

---

### VALIDACIÓN:
1. Compila la API con `pnpm --filter api build` y el frontend con `pnpm --filter web build --no-lint`.
2. En `http://localhost:3000/dashboard`:
   - El Silo "CAVA PRODUCTO" ahora tiene fluido animado y valor real en pesos.
   - La tarjeta de telemetría de productos exhibe su clasificación operativa (`ESTRELLA`, `VOLUMEN`, etc.) calculada con datos de Prisma.
   - El dashboard se mantiene estrictamente en 100vh sin scrollbar.

   # IMPLEMENTACIÓN DEL MOTOR ANALÍTICO (FASE A/B): COSTEO REAL DE RECETAS, VALORIZACIÓN DE CAVA Y MATRIZ 4-BOX

REGLAS DE ARQUITECTURA Y MODO BISTURÍ:
- Crea el nuevo servicio desacoplado `apps/api/src/dashboard/analytics.engine.service.js` para no saturar `dashboard.service.js` siguiendo la arquitectura analítica por capas.
- Modifica `apps/api/src/dashboard/dashboard.service.js`, `apps/web/src/app/dashboard/components/LiquidSilosCanvas.jsx` y la tarjeta de Telemetría de Productos en `apps/web/src/app/dashboard/page.jsx`.
- Cero Tailwind: conserva CSS Modules.
- Cero scroll: la vista actual debe mantenerse en 100vh exactos sin romper ningún contrato de datos existente.
- Erradica de raíz el mock duro detectado en auditoría (`cost * 0.4`): los costos y márgenes deben derivarse de `Receta`, `DetalleReceta` y compras reales en Prisma.

---

### 1. SERVICIO ANALÍTICO DESACOPLADO (`apps/api/src/dashboard/analytics.engine.service.js`):
Crea el servicio con las funciones analíticas centrales:

```javascript
export class AnalyticsEngineService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 1. Valorización Real de Cava de Producto Terminado
   * Suma capital inmovilizado: sum(cantidadActual * costoPromedio)
   */
  async getCavaValuation() {
    const inventarioPT = await this.prisma.inventarioProducto.findMany({
      include: { producto: true }
    });

    const totalValor = inventarioPT.reduce((acc, curr) => {
      const cant = Number(curr.cantidadActual || 0);
      const costo = Number(curr.costoPromedio || 0);
      return acc + (cant * costo);
    }, 0);

    const totalUnidades = inventarioPT.reduce((acc, curr) => {
      return acc + Number(curr.cantidadActual || 0);
    }, 0);

    return {
      totalValor,
      totalUnidades,
      items: inventarioPT
    };
  }

  /**
   * 2. Desglose Real de Costo por Ingrediente y Margen
   * Deriva costos directos desde Receta -> DetalleReceta -> Inventario / PreciosProveedor
   */
  async getProductRealCosting(productoId) {
    const receta = await this.prisma.receta.findFirst({
      where: { productoId },
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
    });

    if (!receta || !receta.detalles || receta.detalles.length === 0) {
      return null;
    }

    const rendimiento = Number(receta.rendimientoBase || 1);
    let costoTotalBatch = 0;
    const breakdown = [];

    for (const det of receta.detalles) {
      const cantRequerida = Number(det.cantidadRequerida || 0);
      const mermaFactor = 1 + (Number(det.mermaPorcentaje || 0) / 100);
      const cantEfectiva = cantRequerida * mermaFactor;

      // Priorizar costo promedio ponderado de inventario, fallback a último precio de compra
      const costoUnitarioInsumo = 
        Number(det.insumo.inventarios?.[0]?.costoPromedio || 0) || 
        Number(det.insumo.preciosProveedor?.[0]?.costoUnidadBase || 0);

      const subtotalInsumo = cantEfectiva * costoUnitarioInsumo;
      costoTotalBatch += subtotalInsumo;

      breakdown.push({
        insumoId: det.insumoId,
        nombre: det.insumo.nombre,
        unidad: det.insumo.unidadBase,
        cantidad: cantEfectiva,
        costoUnitario: costoUnitarioInsumo,
        costoTotal: subtotalInsumo
      });
    }

    const costoUnitarioReal = rendimiento > 0 ? (costoTotalBatch / rendimiento) : 0;

    // Calcular participación porcentual por ingrediente
    const costDistribution = breakdown.map(item => ({
      name: item.nombre,
      cost: item.costoTotal / rendimiento,
      percentage: costoTotalBatch > 0 ? Math.round((item.costoTotal / costoTotalBatch) * 100) : 0
    }));

    return {
      costoUnitarioReal: Math.round(costoUnitarioReal),
      breakdown: costDistribution
    };
  }

  /**
   * 3. Matriz 4-Box Ventas vs Utilidad (Estrella, Volumen, Nicho, Débil)
   */
  classifyProductQuadrant(ventasUnidades, utilidadUnitaria, umbralVenta = 50, umbralUtilidad = 1500) {
    const isHighSales = ventasUnidades >= umbralVenta;
    const isHighProfit = utilidadUnitaria >= umbralUtilidad;

    if (isHighSales && isHighProfit) {
      return {
        quadrant: 'ESTRELLA',
        label: 'Estrella',
        action: 'Priorizar producción continua',
        badgeColor: '#10B981'
      };
    } else if (isHighSales && !isHighProfit) {
      return {
        quadrant: 'VOLUMEN',
        label: 'Volumen',
        action: 'Revisar receta o reprecificar',
        badgeColor: '#F59E0B'
      };
    } else if (!isHighSales && isHighProfit) {
      return {
        quadrant: 'NICHO_RENTABLE',
        label: 'Nicho Rentable',
        action: 'Impulsar promoción comercial',
        badgeColor: '#6366F1'
      };
    } else {
      return {
        quadrant: 'DEBIL',
        label: 'Bajo Rendimiento',
        action: 'Evaluar retiro o reformulación',
        badgeColor: '#9CA3AF'
      };
    }
  }
}

{product.classification && (
  <span 
    className={styles.quadrantBadge} 
    style={{ 
      borderColor: product.classification.badgeColor, 
      color: product.classification.badgeColor 
    }}
    title={product.classification.action}
  >
    ✦ {product.classification.label.toUpperCase()}
  </span>
)}


.quadrantBadge {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid;
  background-color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

