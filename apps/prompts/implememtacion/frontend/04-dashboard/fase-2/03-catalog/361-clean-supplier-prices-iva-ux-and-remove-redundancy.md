TAREA CONTROLADA — DEPURACIÓN DE REDUNDANCIA DE IVA EN TABLA Y MODAL DE PRECIOS DE PROVEEDORES

OBJETIVO TÉCNICO:
1. Eliminar la columna redundante "Régimen IVA" en `PricesComparisonTable.jsx` para dar mayor amplitud y limpieza a la tabla.
2. Formatear la columna "Base / IVA ($)" para que, cuando el producto no tenga IVA (ej: leche en granja o bienes sin impuesto), muestre el valor pleno y el microtexto "Sin IVA (No aplica)".
3. Asegurar que en el modal `SupplierPriceModal.jsx` desmarcar "Aplica IVA" apague los campos tributarios y liquide el costo neto al 100% sin confusiones.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
- apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
- apps/web/src/app/catalog/supplier-prices/supplier-prices.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas ciegas (`Find`, `Search`).
- Leer únicamente los 3 archivos indicados (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar SRP (< 145 líneas por archivo; desacoplar si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN LA TABLA (`PricesComparisonTable.jsx`):
   - En el `<thead>`: Eliminar el encabezado `<th>Régimen IVA</th>`.
   - En el `<tbody>`: Eliminar el `<td>` que renderizaba el badge `<span className={styles.taxBadge}>IVA 19%</span>`.
   - En la columna `Base / IVA ($)`:
     * Si `tieneIva === true`:
       - Línea principal: `$ {formatCurrency(baseSinIva)}`
       - Microtexto: `+ $ {formatCurrency(montoIva)} (IVA ${porcentajeIva}%)` (color `#059669` o `#64748B`).
     * Si `tieneIva === false`:
       - Línea principal: `$ {formatCurrency(precioEmpaque)}`
       - Microtexto: `Sin IVA (No aplica)` (color `#94A3B8`).

2. EN EL MODAL (`SupplierPriceModal.jsx`):
   - Al desmarcar `[ ] Aplica IVA`:
     * Ocultar o deshabilitar los campos `TASA IVA (%)` y `MODALIDAD FISCAL`.
     * Fijar en el estado: `porcentajeIva: 0`, `precioIncluyeIva: true`.
     * En la tarjeta de resumen interno del modal, proyectar:
       - Subtotal Base: `$ [Precio]`
       - Monto IVA: `$ 0`
       - Costo por Unidad Base Final: `$ [Precio / Equivalente] / [Unidad]`
       - Nota: `✦ Tarifa sin IVA: Este insumo no genera impuestos adicionales.`

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
   - `node --check apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La tabla no tiene columna repetida de "Régimen IVA".
- Los insumos sin IVA muestran con claridad su estado sin valores en cero erróneos.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Columna eliminada en: PricesComparisonTable.jsx
- Comportamiento condicional de IVA adaptado en: SupplierPriceModal.jsx
- Resultado verify-srp.js: