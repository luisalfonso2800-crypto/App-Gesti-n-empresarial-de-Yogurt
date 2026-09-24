# TAREA CONTROLADA — CORRECCIÓN DE SELECTORES DEL MODAL DE COTIZACIONES (COMBOMOX, PLACEHOLDER Y DROPDOWN)

## DIAGNÓSTICO PREVIO Y CAUSA RAÍZ
Inspeccionando directamente el código fuente real del modal (`SupplierPriceModal.jsx:55-95` y `SupplierPriceCombobox.jsx:55-68`), se identificaron 3 causas exactas de discrepancia:
1. **Discrepancia del placeholder en el Insumo:**
   - Input real: `placeholder="Buscar insumo..."` (no `"Seleccionar o buscar insumo..."`).
   - Proveedor real: `placeholder="Buscar proveedor..."` o `placeholder="Bloqueado (elija insumo)"`.
2. **Discrepancia en las opciones del desplegable:**
   - Opciones reales: `div[class*="dropdownItem"]` (no tienen atributo `role="option"`).
3. **Apertura del desplegable (onFocus / click):**
   - El desplegable se abre con foco o clic en el input.

## ARCHIVOS A MODIFICAR:
- `apps/web/e2e/helpers/supplier-price-form.js`
- `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`
- `apps/web/e2e/supplier-prices/supplier-prices-modal-calc.spec.js`

## REGLAS DE CUOTA ESTRICTA:
- Cero modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- Límites de líneas: helper < 80 líneas, specs ≤ 140 líneas.
- Sin timeouts fijos innecesarios.
