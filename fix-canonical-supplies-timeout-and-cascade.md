TAREA CONTROLADA — FIX DE CUELGUE DE 5 MINUTOS EN CATALOG-01-SUPPLIES-CATEGORIES Y NORMALIZACIÓN DE TIMEOUT

OBJETIVO TÉCNICO:
Resolver definitivamente el cuelgue en `apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js` y normalizar el timeout global en `apps/web/playwright.config.js`:
1. Normalizar el timeout de test en `playwright.config.js` a un valor operativo estándar (30.000 ms) para que ninguna falla quede colgada durante 5 minutos.
2. En `catalog-01-supplies-categories.spec.js`:
   - Tras `closeModal(page)` en el fuzzing inicial, esperar explícitamente a que el diálogo y su backdrop desaparezcan (`waitFor({ state: 'hidden' })`) antes de pulsar nuevamente `btnNuevo`.
   - Llenar los campos en orden estricto de cascada Poka-Yoke (`nombre`, `categoria`, `subcategoria`, `marca`, `empaque`, `unidadBase`, `contenido`) para que el botón `"Guardar Insumo"` se habilite.
   - Apuntar el submit al texto real del botón (`page.getByRole('button', { name: /guardar insumo/i })`).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- apps/web/playwright.config.js (Líneas 1 a 25)
- apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js (Líneas 1 a 55)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, MÁXIMO 2 EDICIONES):
- NO tocar código de producción (`apps/web/src`, `apps/api/src`).
- CERO búsquedas recursivas (`grep`, `find`, `listDir`).
- Editar EXCLUSIVAMENTE `apps/web/playwright.config.js` y `apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js`.
- NO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).

ACCIONES ESPECÍFICAS:

1. En `apps/web/playwright.config.js`:
   - Reemplazar `timeout: 300000` por `timeout: 30000` (30 segundos), evitando cuelgues prolongados de 5 minutos ante cualquier colisión futura.

2. En `apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js`:
   - **Fase Fuzzing (L10 a L20):**
     Tras invocar `closeModal(page)`, esperar que el modal se oculte del todo:
     ```javascript
     await closeModal(page);
     await page.locator('[role="dialog"], [class*="modalCard"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
     await page.waitForTimeout(200);
     ```
   - **Fase Creación Canónica (L20 a L45):**
     * Reapertura segura:
       `await btnNuevo.click({ timeout: 5000 });`
     * Cumplir la cascada Poka-Yoke obligatoria:
       ```javascript
       const timestamp = Date.now();
       const supplyName = `CANONICAL_SUPPLY_${timestamp}`;
       await page.locator('input[name="nombre"]').fill(supplyName);
       
       // Cascada habilitada: categoria -> subcategoria
       const catSelect = page.locator('select[name="categoria"]');
       await catSelect.waitFor({ state: 'visible', timeout: 2000 });
       await catSelect.selectOption({ index: 1 });

       const subSelect = page.locator('select[name="subcategoria"]');
       await subSelect.waitFor({ state: 'visible', timeout: 2000 });
       await subSelect.selectOption({ index: 1 });

       // Campos secundarios
       await page.locator('input[name="marca"]').fill('CANONICAL_BRAND');
       await page.locator('select[name="empaque"]').selectOption({ index: 1 });
       await page.locator('select[name="unidadBase"]').selectOption({ index: 1 });
       await page.locator('input[name="contenidoNeto"]').or(page.locator('input[type="text"]').filter({ hasText: /cuanto/i })).first().fill('1000').catch(() => {});
       await page.locator('input[name="stockMinimo"]').fill('10');
       ```
     * Submit certero:
       ```javascript
       const saveBtn = page.getByRole('button', { name: /guardar insumo/i }).first();
       if (await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
         await saveBtn.click({ timeout: 3000 });
       }
       ```

VERIFICACIÓN:
1. `node --check apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- El timeout global queda en 30s.
- El spec resuelve el fuzzing y la reapertura sin colisiones de overlay.
- `verify-srp.js` retorna código 0.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivos editados y líneas modificadas.
- Comando en una sola línea para prueba por el operador humano.
- Estado: [COMPLETADO / BLOQUEADO].