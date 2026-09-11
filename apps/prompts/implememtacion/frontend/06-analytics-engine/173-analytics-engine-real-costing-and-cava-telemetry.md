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