TAREA CONTROLADA — CÁLCULO DEFENSIVO DE BASE S/IVA EN TABLA DE PRECIOS DE PROVEEDORES

OBJETIVO TÉCNICO:
Resolver el `$0` en la columna "Base s/IVA" de `PricesComparisonTable.jsx` asegurando que, si el registro en base de datos tiene `costoBaseSinIva: 0` o nulo pero tiene activo el flag de IVA, el componente liquide dinámicamente el valor base a partir del precio de compra y el porcentaje de IVA.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
- apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas ciegas (`Find`, `Search`).
- Leer únicamente `PricesComparisonTable.jsx` (máximo 1 lectura).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar SRP (< 140 líneas).
- JavaScript nativo (.jsx, .js).

ACCIONES A EJECUTAR:
1. En `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`:
   - Localizar el renderizado de la columna "Base s/IVA".
   - Implementar cálculo de fallback resiliente:
     ```javascript
     const precioEmpaque = Number(row.precioCompra || row.precio || 0);
     const tieneIva = row.tieneIva ?? true;
     const porcentajeIva = Number(row.porcentajeIva || 19);
     const precioIncluyeIva = row.precioIncluyeIva ?? true;

     let baseSinIvaCalculada = Number(row.costoBaseSinIva || 0);

     // Si en base de datos vino en 0 o no existe, recalcular en caliente:
     if (baseSinIvaCalculada <= 0 && precioEmpaque > 0) {
       if (!tieneIva) {
         baseSinIvaCalculada = precioEmpaque;
       } else if (precioIncluyeIva) {
         baseSinIvaCalculada = precioEmpaque / (1 + (porcentajeIva / 100));
       } else {
         baseSinIvaCalculada = precioEmpaque;
       }
     }
     ```
   - Renderizar el valor formateado como moneda con `formatCurrency(baseSinIvaCalculada)`.
2. Validaciones:
   - `node --check apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La columna "Base s/IVA" muestra $4.412 para Cereza ($5.250) y $2.773 para Azúcar ($3.300).
- 0 infracciones en verify-srp.js.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Fórmula defensiva aplicada en: PricesComparisonTable.jsx
- Resultado verify-srp.js: