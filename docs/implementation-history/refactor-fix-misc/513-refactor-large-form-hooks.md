TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Reducir la complejidad de `useFormPhaseData.js` extrayendo las fórmulas de cálculo de impuestos y subtotales a un módulo utilitario puro:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de `useFormPhaseData.js`.
- Modificar EXCLUSIVAMENTE el hook y crear su archivo de utilidades puras.

ARCHIVOS A MODIFICAR / CREAR:
1. `apps/web/src/app/operations/purchases/new/utils/purchaseCalculations.js`
2. `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`

INSTRUCCIONES TÉCNICAS:

1. Módulo Utilitario Puro (`purchaseCalculations.js`):
   - Extraer la lógica matemática de líneas de detalle, descuentos e IVA:
     ```javascript
     export function calculatePurchaseTotals(items = [], globalTaxRate = 19) {
       return items.reduce((acc, item) => {
         const qty = Number(item.cantidad || 0);
         const price = Number(item.precioUnitario || 0);
         const subtotal = qty * price;
         const tax = item.aplicaIva ? (subtotal * (globalTaxRate / 100)) : 0;
         return {
           subtotalGeneral: acc.subtotalGeneral + subtotal,
           totalImpuestos: acc.totalImpuestos + tax,
           totalNeto: acc.totalNeto + subtotal + tax
         };
       }, { subtotalGeneral: 0, totalImpuestos: 0, totalNeto: 0 });
     }
     ```

2. Integración en `useFormPhaseData.js`:
   - Importar `calculatePurchaseTotals` y delegar las operaciones repetitivas de cálculo en el render.
   - Reducir significativamente las líneas del hook manteniendo intacta la API que consume la vista.
   - Respetar el límite de líneas SRP (< 135 líneas por archivo nuevo).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/purchases/new/utils/purchaseCalculations.js`
2. `node --check apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los totales e impuestos en la pantalla de nueva compra se calculan de manera limpia e idéntica a la esperada.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
