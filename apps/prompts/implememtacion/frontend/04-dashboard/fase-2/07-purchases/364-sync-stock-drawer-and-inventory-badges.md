TAREA CONTROLADA — SINCRONIZACIÓN DE STOCK REAL EN DRAWER Y SEMÁFOROS VISUALES CROMÁTICOS

OBJETIVO TÉCNICO:
1. Corregir el falso "Stock: 0 g / AGOTADO" en `StockLookupDrawer.jsx` vinculando el stock físico real de la bodega (`/api/v1/inventory`) para que Azúcar muestre 1.000 g y Cereza 125 g.
2. Reemplazar los badges planos de texto por pastillas cromáticas institucionales (Rojo = Agotado, Ámbar = Bajo Mínimo, Verde = Óptimo) tanto en el Drawer como en la tabla de Inventario (`/operations/inventory`).
3. En el catálogo de Insumos (`/catalog/supplies`), proyectar un microindicador visual del estado del inventario para saber si hay existencias sin cambiar de pantalla.

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx
- apps/web/src/app/operations/inventory/page.jsx
- apps/web/src/app/catalog/supplies/page.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales (`Find`, `Search`).
- Leer únicamente los 3 archivos indicados (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules.
- Respetar el límite de líneas SRP (< 145 líneas por componente JSX).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `StockLookupDrawer.jsx`:
   - Al cargar datos, consultar de forma concurrente o prioritaria `/api/v1/inventory` (que contiene `cantidadActual` e `insumo` cruzado) o enriquecer los insumos con el mapa de inventario:
     ```javascript
     // Mapear stock real desde inventario:
     const stockMap = new Map(inventoryData.map(inv => [inv.idInsumo, Number(inv.cantidadActual || 0)]));
     const stockReal = stockMap.get(supply.idInsumo || supply.id) ?? 0;
     ```
   - Calcular la bandera semafórica dinámica:
     * Si `stockReal <= 0`: Badge Rojo "AGOTADO".
     * Si `stockReal > 0 && stockReal <= stockMinimo`: Badge Ámbar "BAJO MÍNIMO".
     * Si `stockReal > stockMinimo`: Badge Verde "EN RANGO / ÓPTIMO".
   - Renderizar el stock con su número y unidad real: `Stock: 1000 g (Mín: 1.000 g)`.

2. EN `apps/web/src/app/operations/inventory/page.jsx`:
   - En la columna "Semáforo", sustituir el texto plano por un badge estilizado mediante clases CSS del módulo:
     * `.badgeDanger` (Rojo: `#DC2626`, fondo `#FEE2E2` para Agotado / Crítico).
     * `.badgeWarning` (Ámbar: `#D97706`, fondo `#FEF3C7` para Bajo Mínimo).
     * `.badgeSuccess` (Verde: `#059669`, fondo `#D1FAE5` para Óptimo).

3. EN `apps/web/src/app/catalog/supplies/page.jsx`:
   - Mostrar junto a `Stock Mínimo` una cápsula o punto semafórico discreto que indique si el insumo está en alerta o abastecido.

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
   - `node --check apps/web/src/app/operations/inventory/page.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- El drawer muestra el stock real de bodega (Azúcar 1.000 g, Cereza 125 g) y no ceros falsos.
- La columna Semáforo en inventario tiene colores visuales inmediatos.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Fuente de stock vinculada en: StockLookupDrawer.jsx
- Badges visuales implementados en: inventory/page.jsx
- Resultado verify-srp.js: