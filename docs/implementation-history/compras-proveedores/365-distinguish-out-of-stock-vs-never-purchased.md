TAREA CONTROLADA — DIFERENCIACIÓN VISUAL: INSUMOS AGOTADOS VS NO ADQUIRIDOS / SIN HISTORIAL

OBJETIVO TÉCNICO:
En `StockLookupDrawer.jsx`, diferenciar con precisión los insumos que se quedaron sin existencias (AGOTADO en rojo) de aquellos que simplemente están registrados en el catálogo de insumos pero nunca han tenido ingresos o compras en inventario (SIN COMPRAS / NUNCA ADQUIRIDO en gris neutro).

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas ciegas (`Find`, `Search`).
- Leer únicamente `StockLookupDrawer.jsx` y su módulo CSS (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar el límite de líneas SRP (< 145 líneas en el componente JSX).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `StockLookupDrawer.jsx`:
   - Al cruzar los datos entre `supplies` e `inventory`:
     * Determinar si el insumo tiene presencia real en el inventario:
       ```javascript
       const invItem = inventoryMap.get(supply.idInsumo || supply.id);
       const hasInventoryRecord = Boolean(invItem);
       const stockReal = Number(invItem?.cantidadActual ?? 0);
       const stockMinimo = Number(supply.stockMinimo || 0);
       ```
     * Clasificar el estado del insumo:
       - Si `!hasInventoryRecord || (invItem?.ultimaActualizacion == null && stockReal === 0)`:
         `status = 'UNACQUIRED'` (Label: "SIN INGRESOS / NO ADQUIRIDO", color gris neutro).
       - Si `hasInventoryRecord && stockReal <= 0`:
         `status = 'DEPLETED'` (Label: "AGOTADO", color rojo).
       - Si `stockReal > 0 && stockReal <= stockMinimo`:
         `status = 'LOW'` (Label: "BAJO MÍNIMO", color ámbar).
       - Si `stockReal > stockMinimo`:
         `status = 'OPTIMAL'` (Label: "EN RANGO", color verde).
   - En el renderizado de la tarjeta:
     * Si el estado es `'UNACQUIRED'`:
       - Mostrar badge `.badgeNeutral`: `SIN INGRESOS`.
       - Renderizar texto secundario: `Stock: Sin compras previas • (Mín: ${stockMinimo} ${supply.unidadBase})`.
     * Si es `'DEPLETED'`:
       - Mostrar badge `.badgeDanger`: `AGOTADO`.
       - Renderizar texto secundario: `Stock: 0 ${supply.unidadBase} • (Mín: ${stockMinimo} ${supply.unidadBase})`.

2. EN `new-purchase.module.css`:
   - Añadir la clase para el estado neutro:
     ```css
     .badgeNeutral {
       background-color: #F1F5F9;
       color: #64748B;
       border: 1px solid #CBD5E1;
       font-size: 0.68rem;
       font-weight: 700;
       padding: 0.15rem 0.45rem;
       border-radius: 9999px;
       letter-spacing: 0.03em;
     }
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los insumos sin inventario histórico ya no alarman como "AGOTADO", sino como "SIN INGRESOS / NO ADQUIRIDO".
- Los insumos que se consumieron hasta cero muestran "AGOTADO" en rojo.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Clasificación de estados implementada en: StockLookupDrawer.jsx
- Resultado verify-srp.js: