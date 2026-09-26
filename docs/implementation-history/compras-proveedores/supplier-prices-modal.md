TAREA CONTROLADA — SUITE E2E FOCO A: MODAL "NUEVO PRECIO DE PROVEEDOR" (T01-T15 + C01-C08 EN 2 ARCHIVOS ATÓMICOS)

OBJETIVO TÉCNICO:
Crear la cobertura E2E para el modal "Nuevo Precio de Proveedor" en `/catalog/supplier-prices`:
1. Validar severamente el Poka-Yoke de la cascada secuencial 1→6 (insumo → proveedor → presentación → unidad → cantidad → precio).
2. Validar cálculos duales: costo sin IVA, costo con IVA, equivalente unidad base, subtotal, monto IVA y costo por unidad base final.
3. Para cumplir estrictamente con `check-e2e-limits.js` (MAX_LINES=150, MAX_TESTS=15), dividir la suite en dos archivos independientes:
   - `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js` (T01 a T15)
   - `apps/web/e2e/supplier-prices/supplier-prices-modal-calc.spec.js` (C01 a C08)
4. CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`). Reutilizar el helper `supplier-price-form.js`.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, EXACTAMENTE 2 CREACIONES):
- PROHIBIDO modificar archivos en `apps/web/src/**` o `apps/api/**`.
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO `waitForTimeout` fijos; usar `expect(locator).toBeVisible()`, `toBeEnabled()` o polling de Playwright.
- Cada archivo `.spec.js` debe tener ≤ 140 líneas y ≤ 15 bloques `test()`.
- Usar los selectores verificados en la auditoría forense (inputs con placeholder, roles ARIA, clases estables).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- `apps/web/e2e/helpers/supplier-price-form.js`
- `apps/prompts/testing/INFORME-AUDITORIA-PRECIOS-CHECKLIST-LISTAS.md`

ACCIONES A EJECUTAR:

1. Crear `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js` (≤ 135 líneas, 15 tests T01-T15):
   - Importar `{ test, expect }` de `@playwright/test`.
   - Estructurar con `test.describe.serial('Precios Proveedores - Cascada y Poka-Yoke (T01-T15)', ...)`:
     * `beforeEach`: Navegar a `/catalog/supplier-prices`, hacer clic en `button:has-text("Nueva Cotización")` o `button:has-text("+ Nueva Cotización")` y esperar el formulario.
     * T01: Modal visible con título "Nuevo Precio de Proveedor" / "Nueva Cotización".
     * T02: Input de Insumo habilitado; Combobox Proveedor deshabilitado (`toBeDisabled()`).
     * T03: Al tipear y seleccionar un Insumo se habilita el campo de Proveedor.
     * T04: Al seleccionar Proveedor se habilita el selector de Presentación Comercial.
     * T05: Al seleccionar Presentación se habilita el selector de Unidad de Medida.
     * T06: Al seleccionar Unidad se habilita Cantidad y Precio de Compra.
     * T07: Cambiar Unidad limpia o resetea Cantidad y Precio.
     * T08: Checkbox "Aplica IVA" desmarcado oculta los campos de Tasa IVA y Modalidad Fiscal.
     * T09: Checkbox "Aplica IVA" marcado precarga Tasa 19% (nunca 0%).
     * T10: Pleca de unidad base (`.plecaBadge` o similar) refleja la unidad elegida (kg/L/und).
     * T11: Campo Precio de compra muestra el texto en letras debajo del input.
     * T12: Botón de submit ("Guardar Cotización" o "Guardar Precio") deshabilitado si faltan campos obligatorios.
     * T13: Botón de submit se habilita cuando todos los campos están completos.
     * T14: Envío válido cierra el modal y no deja errores en pantalla.
     * T15: Modal se cierra limpiamente con botón Cancelar o tecla Escape sin guardar.

2. Crear `apps/web/e2e/supplier-prices/supplier-prices-modal-calc.spec.js` (≤ 120 líneas, 8 tests C01-C08):
   - Importar `{ test, expect }` de `@playwright/test` y `{ fillSupplierPriceForm }` de `../helpers/supplier-price-form.js`.
   - Estructurar con `test.describe.serial('Precios Proveedores - Cálculos Matemáticos e IVA (C01-C08)', ...)`:
     * `beforeEach`: Navegar a `/catalog/supplier-prices` y abrir el modal.
     * C01: BULTO x 50 kg x $120.000 sin IVA -> Verifica Costo Base Unitario = $2.400 / kg.
     * C02: BOLSA x 500 g x $8.000 sin IVA -> Verifica Costo Base = $16 / g.
     * C03: BIDÓN x 20 L x $60.000 sin IVA -> Verifica Costo Base = $3.000 / L.
     * C04: BOTELLA x 750 ml x $6.000 sin IVA -> Verifica Costo Base = $8 / ml.
     * C05: CAJA x 24 und x $12.000 sin IVA -> Verifica Costo Base = $500 / und.
     * C06: Modalidad "Precio incluye IVA" (19%): Base = $100.000, IVA = $19.000, Total = $119.000.
     * C07: Modalidad "IVA adicional (+ tasa)" (19%): Base = $50.000, IVA = $9.500, Total = $59.500.
     * C08: Exento (Sin IVA desmarcado): Subtotal Base = Total a pagar, Monto IVA = $0.

VERIFICACIÓN OBLIGATORIA:
1. `node --check apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`
2. `node --check apps/web/e2e/supplier-prices/supplier-prices-modal-calc.spec.js`
3. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Ambos archivos creados respetan ≤ 140 líneas y ≤ 15 tests cada uno.
- `check-e2e-limits.js` no arroja nuevos errores en la carpeta `supplier-prices/`.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Tabla con: Archivo | Líneas | Tests implementados.
- Salida de `check-e2e-limits.js` para los nuevos archivos.
- Comando exacto en una línea para que el operador humano pruebe la suite en PowerShell.
- Estado: [COMPLETADO / BLOQUEADO].