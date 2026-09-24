TAREA CONTROLADA — CREACIÓN DE HELPERS E2E BASE (PRECIOS, CARRITO, CHECKLIST Y FUSIÓN)

OBJETIVO TÉCNICO:
Crear 4 helpers modulares en `apps/web/e2e/helpers/` que encapsulen las interacciones complejas con los 4 focos auditados:
1. `supplier-price-form.js`: Automatiza el llenado del modal de cotización respetando la cascada Poka-Yoke 1→6 y el formateo de IVA.
2. `cart-toggle.js`: Gestiona la adición/remoción de insumos desde la tabla comparativa hacia el carrito y valida el badge reactivo en el Header.
3. `order-merge.js`: Controla el modo fusión en `/operations/purchases`, la selección de checkboxes y la validación de mínimo 2 listas.
4. `checklist-item.js`: Administra el cambio de estado de un ítem en el checklist en `/operations/purchases/new`, desplegando motivos al descartar.

REGLAS DE ORO Y PRESUPUESTO ESTRICTO (TOOL BUDGET: MÁXIMO 4 LECTURAS, EXACTAMENTE 4 CREACIONES):
- PROHIBIDO modificar o tocar código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO crear specs o ejecutar Playwright en esta tarea (la ejecución la realiza el operador humano).
- CERO timeouts fijos ciegos (`page.waitForTimeout` > 300ms prohibido); usar `waitFor({ state: 'visible' })`, `toBeEnabled()` o polling de Playwright.
- Cada helper debe ser modular y tener MENOS de 100 líneas (cumpliendo `check-e2e-limits.js`).
- Código 100% JavaScript nativo (.js) con tipado JSDoc. Prohibido TypeScript.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- `apps/web/e2e/helpers/safe-visible.js` (utilidad a importar)
- `apps/web/e2e/helpers/check-e2e-limits.js`
- `apps/prompts/testing/INFORME-AUDITORIA-PRECIOS-CHECKLIST-LISTAS.md` (matriz de selectores)

ACCIONES A EJECUTAR:

1. Crear `apps/web/e2e/helpers/supplier-price-form.js` (< 95 líneas):
   - Importar `{ expect }` de `@playwright/test`.
   - Exportar función `fillSupplierPriceForm(page, data)`:
     * Paso 1: Abrir combobox de insumo (`input[placeholder*="Seleccionar o buscar insumo..."]`), tipear `data.insumoNombre` y seleccionar la opción del desplegable.
     * Paso 2: Esperar que el combobox de proveedor esté habilitado (`toBeEnabled({ timeout: 3000 })`), tipear `data.proveedorNombre` y seleccionar la opción.
     * Paso 3: Seleccionar presentación en el select correspondiente (`data.presentacion`).
     * Paso 4: Seleccionar unidad base (`data.unidadMedida`).
     * Paso 5: Esperar que el input de cantidad esté habilitado (`toBeEnabled()`) y tipear `data.cantidad`. Verificar que la pleca (`.plecaBadge` o span adyacente) contenga `data.unidadMedida`.
     * Paso 6: Digitar precio en el input monetario.
     * Manejo fiscal: Si `data.aplicaIva === false`, desmarcar el checkbox si estuviera activo y confirmar que los campos de tasa estén ocultos. Si es `true`, marcarlo y seleccionar la modalidad (`data.modalidad || 'PRECIO_INCLUYE_IVA'`).

2. Crear `apps/web/e2e/helpers/cart-toggle.js` (< 80 líneas):
   - Exportar función `toggleCartItem(page, insumoNombre)`:
     * Ubicar la fila de la tabla que contiene `insumoNombre` dentro de `PricesComparisonTable`.
     * Capturar el contador inicial del badge en el Header:
       `const badge = page.locator('button[aria-label="Abrir carrito de compras"] span.cartBadge');`
       `const initialCount = (await badge.isVisible().catch(() => false)) ? parseInt(await badge.innerText(), 10) : 0;`
     * Hacer clic en el botón de acción de compra (`button:has-text("Comprar")` o `button:has-text("En lista")`).
     * Esperar que el botón cambie de estado textual.
     * Retornar el nuevo valor entero del badge del carrito.

3. Crear `apps/web/e2e/helpers/order-merge.js` (< 75 líneas):
   - Exportar función `executeOrderMerge(page, orderCodes)`:
     * Validar que `orderCodes.length >= 2`; de lo contrario, lanzar un `Error('La fusión requiere al menos 2 listas')`.
     * Clic en el botón `button:has-text("Fusionar Seleccionadas")`.
     * Iterar sobre cada código de orden, ubicar la tarjeta contenedora y marcar su checkbox (`input[type="checkbox"].mergeCheckbox`).
     * Verificar que el botón `button:has-text("Confirmar Fusión")` esté habilitado (`toBeEnabled()`).
     * Clic en "Confirmar Fusión" y esperar que el modal de confirmación concluya la operación.

4. Crear `apps/web/e2e/helpers/checklist-item.js` (< 90 líneas):
   - Exportar función `markChecklistItemStatus(page, itemNombre, status, motivo = '', descartar = false)`:
     * Ubicar el contenedor `.operationalRowWrapper` que incluya `itemNombre`.
     * Si `status === 'CONSEGUIDO'`: Clic en `button:has-text("Conseguido")`.
     * Si `status === 'NO_CONSEGUIDO'`:
       - Clic en `button:has-text("No Conseguido")`.
       - Seleccionar el motivo en `select.motivoSelect`.
       - Si el motivo incluye "Otro motivo", llenar `input.motivoInput` con el texto proporcionado.
       - Confirmar con `button:has-text("Registrar motivo y descartar")` o `button:has-text("Registrar motivo y mantener en lista")` según el booleano `descartar`.

VERIFICACIÓN OBLIGATORIA:
1. `node --check apps/web/e2e/helpers/supplier-price-form.js`
2. `node --check apps/web/e2e/helpers/cart-toggle.js`
3. `node --check apps/web/e2e/helpers/order-merge.js`
4. `node --check apps/web/e2e/helpers/checklist-item.js`
5. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los 4 archivos existen y ninguno supera las 100 líneas.
- `check-e2e-limits.js` retorna código 0.
- DETENTE inmediatamente tras reportar. NO escribas tests todavía.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Tabla con: Helper | Líneas de código | Funciones exportadas.
- Salida del comando check-e2e-limits.js.
- Estado: [COMPLETADO / BLOQUEADO].