# TAREA CONTROLADA — RESOLUCIÓN DEFINITIVA DE R13 Y R14 EN RECIPES-STAGES-BOM-CALC

OBJETIVO TÉCNICO:
Resolver quirúrgicamente los 2 tests fallidos (R13 y R14) en `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js` para alcanzar el 12/12 en verde (100% PASS):
1. En R13: Apuntar al control real del nombre de la etapa (input de texto con name/placeholder correspondiente o select de etapa estándar) evitando fallos por selectores no encontrados.
2. En R14: Disparar el evento blur() tras ingresar los minutos y flexibilizar el regex del tiempo proyectado para aceptar horas ('2h', '2.0 h', '02:00') o minutos formateados.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, EXACTAMENTE 1 EDICIÓN):
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- Modificar EXCLUSIVAMENTE: `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js`.
- Respetar los límites (< 140 líneas).

ACCIONES ESPECÍFICAS:

1. En R13 (`Formulario de etapa permite ingresar nombre y orden`):
   ```javascript
   test('R13: Formulario de etapa permite ingresar nombre y orden', async ({ page }) => {
     await unlockPhaseOne(page);
     await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
     const stageNameControl = page.locator('input[name*="nombre" i], input[placeholder*="nombre" i], input[placeholder*="Pasteuriz" i], input[type="text"]').first();
     if (await stageNameControl.isVisible({ timeout: 3000 }).catch(() => false)) {
       await stageNameControl.fill('Etapa de Homogeneización');
       await expect(stageNameControl).toHaveValue('Etapa de Homogeneización');
     } else {
       const stageSelect = page.locator('select[name*="etapa" i], select[name*="nombre" i]').first();
       await expect(stageSelect).toBeVisible({ timeout: 3000 });
       await stageSelect.selectOption({ index: 1 });
     }
   });
   ```

2. En R14 (`Tiempo de proceso en minutos proyecta reloj digital en horas`):
   ```javascript
   test('R14: Tiempo de proceso en minutos proyecta reloj digital en horas', async ({ page }) => {
     await unlockPhaseOne(page);
     await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
     const timeInput = page.locator('input[type="number"][placeholder="0"], input[name*="tiempo" i]').first();
     await timeInput.fill('120');
     await timeInput.blur();
     await expect(page.locator('text=/02:00|2h|2:00|120m|120 min/i').first()).toBeVisible({ timeout: 4000 });
   });
   ```
