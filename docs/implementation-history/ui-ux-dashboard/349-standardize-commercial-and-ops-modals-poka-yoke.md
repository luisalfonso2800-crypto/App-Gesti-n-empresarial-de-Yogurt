TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 TOOL CALLS):
Estandarizar los modales de Comercial y Operaciones (`SaleModal`, `ExpenseFormModal`, `PaymentFormModal` y `GlobalInventoryAdjustmentModal`) aplicando el patrón Poka-Yoke canónico: bandera `hasSubmitted`, bordes rojos reactivos (`#EF4444`) y microtextos explicativos individuales por campo defectuoso.

FUENTES DE VERDAD:
- Auditoría: `docs/auditoria-modales-y-validaciones-poka-yoke.md`
- Patrón de referencia: `apps/web/src/components/catalog/SupplierModal.jsx`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`

REGLAS ANTI-CONSUMO DE CUOTA:
- PROHIBIDO búsquedas globales (`Search`, `Find`).
- Máximo 1 lectura por archivo a modificar.
- Límite SRP estricto (< 135 líneas por archivo).

OBJETIVO:
1. En `SaleModal.jsx` (y su hook `useSaleForm.js`):
   - Activar `hasSubmitted` al intentar enviar.
   - Resaltar en rojo (`.inputErrorBorder`): `idCliente`, `fechaVenta` y la lista de despacho si está vacía.
2. En `ExpenseFormModal.jsx`:
   - Resaltar en rojo: `categoria`, `descripcion` y `valor` si están vacíos o `<= 0` tras `hasSubmitted`.
3. En `PaymentFormModal.jsx`:
   - Resaltar en rojo: `idCliente`, `idVenta` y `valorPagado` (especialmente si excede el saldo).
4. En `GlobalInventoryAdjustmentModal.jsx`:
   - Resaltar en rojo: `idInsumo`, `cantidad` (> 0) y el campo condicional correspondiente (`costoUnitario` o `motivo`).

5. Restricciones Técnicas:
   - Modularizar subcomponentes si algún archivo excede las líneas permitidas por SRP.
   - Cero inline styles.
   - Validar sintaxis con `node --check`.
   - Ejecutar: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los formularios de Ventas, Gastos, Pagos e Inventario quedan alineados con validación atómica reactiva y bordes rojos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.