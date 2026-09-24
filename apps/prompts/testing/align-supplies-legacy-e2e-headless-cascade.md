# TAREA CONTROLADA — FORZAR MODO HEADLESS Y ALINEAR SUITE LEGACY DE INSUMOS A LA CASCADA POKA-YOKE

## OBJETIVO TÉCNICO:
1. Asegurar que Playwright se ejecute siempre en modo `headless: true` (sin abrir ventanas de Chrome en pantalla) para máxima velocidad de ejecución.
2. Actualizar los helpers y casos de prueba legacy en `apps/web/e2e/supplies/` para que respeten la regla de cascada progresiva: antes de interactuar con campos avanzados (`empaque`, `unidadBase`, `stockMinimo`), deben ingresar obligatoriamente `nombre`, `categoría` y `subcategoría` para evitar agotar los 20s de timeout por controles en estado `disabled`.

## FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- apps/web/playwright.config.js (o archivo de configuración de Playwright)
- apps/web/e2e/helpers/supply-form.js (o el helper central de insumos si existe)
- apps/web/e2e/supplies/supplies-basics.spec.js (o supplies-advanced.spec.js)
- .agents/rules/07-token-efficiency-and-tool-budget.md

## REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 3 EDICIONES):
- NO tocar código de producción (`apps/web/src`, `apps/api/src`).
- CERO búsquedas recursivas masivas (`grep`, `find`, `listDir`).
- Prohibido lanzar scripts temporales (`patch.js`, etc.).
- NO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).

## ACCIONES A EJECUTAR:

1. FORZAR MODO HEADLESS EN CONFIGURACIÓN:
   - En `apps/web/playwright.config.js` (o en su bloque `use`):
     Asegurar `headless: true` de forma permanente para el proyecto Chromium, garantizando que ninguna prueba despliegue la ventana del navegador.

2. AJUSTE DE CASCADA EN HELPER CENTRAL O BEFOREEACH DE INSUMOS:
   - En los archivos de prueba legacy de `apps/web/e2e/supplies/`:
     * Localizar la función de llenado base (`fillSupplyBase` o `openSupplyModal`).
     * Cuando un test requiera probar un campo intermedio (ej. T15-T17 con `empaque`, T18-T24 con `unidadBase`, T25 con `stockMinimo`), asegurar que el test primero escriba un nombre válido (`temp_name`), seleccione una categoría y subcategoría para habilitar la cascada.
     * En los tests que validan campos deshabilitados (ej. T01 "Nombre vacío bloquea submit"), verificar que la aserción evalúe `toBeDisabled()` en lugar de intentar hacer click en un botón/control bloqueado.

3. ADAPTACIÓN DE LABELS DINÁMICOS:
   - Reemplazar cualquier selector que busque el texto obsoleto `"CONTENIDO POR EMPAQUE / PRESENTACIN"` por el contenedor del input numérico o `page.locator('input[name="contenidoNeto"]').or(page.getByLabel(/¿cuánto.*tiene/i))`.

## VERIFICACIÓN:
1. `node --check apps/web/e2e/supplies/supplies-basics.spec.js`
2. `node .agents/scripts/verify-srp.js`

## CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- `playwright.config.js` garantiza ejecución desatendida sin GUI (`headless: true`).
- Los tests legacy no intentan interactuar con inputs deshabilitados sin activar previamente la cascada.
- `verify-srp.js` finaliza con código 0.
- DETENTE inmediatamente tras reportar.

## REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivos modificados.
- Confirmación de modo Headless activo.
- Comando exacto en una sola línea para que el operador humano corra la suite.
- Estado: [COMPLETADO / BLOQUEADO].
