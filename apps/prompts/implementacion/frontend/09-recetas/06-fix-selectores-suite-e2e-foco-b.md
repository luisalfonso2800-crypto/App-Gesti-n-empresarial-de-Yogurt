# TAREA CONTROLADA — CORRECCIÓN DE SELECTORES EN SUITE E2E FOCO B: ETAPAS Y BOM (R13, R14, R18)

OBJETIVO TÉCNICO:
Resolver los 3 fallos en `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js` para alcanzar el 12/12 en verde:
1. En R13: Evitar el selector genérico `input[value=""]` que resuelve a un `input[type="number"]`. Seleccionar el input de texto del nombre de la etapa usando `input[type="text"]` o por su placeholder.
2. En R14: Corregir la aserción de reloj en horas (/02:00/) flexibilizando el locator para no depender de la clase inexistente `timeClockBadge`.
3. En R18: Reemplazar el selector bloqueante `input[max="100"]` por selectores resilientes como `input[name*="merma" i]` o `input[placeholder*="%"]`.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, EXACTAMENTE 1 EDICIÓN):
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- Modificar EXCLUSIVAMENTE: `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js`.
- Respetar el límite de líneas (≤ 140 líneas).

ACCIONES ESPECÍFICAS:

1. En R13 (Formulario de etapa permite ingresar nombre y orden):
   ```javascript
   await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
   const nombreFaseInput = page.locator('input[placeholder*="nombre" i], input[placeholder*="etapa" i], input[type="text"]').first();
   await expect(nombreFaseInput).toBeVisible({ timeout: 4000 });
   await nombreFaseInput.fill('Etapa de Homogeneización');
   await expect(nombreFaseInput).toHaveValue('Etapa de Homogeneización');
   ```
2. En R14 (Tiempo de proceso):
   ```javascript
   await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
   const timeInput = page.locator('input[placeholder="0"]').first();
   await timeInput.fill('120');
   await expect(page.locator('text=/02:00|2h|2:00/').first()).toBeVisible({ timeout: 4000 });
   ```
3. En R18 (Merma):
   ```javascript
   await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
   await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
   const mermaInput = page.locator('input[name*="merma" i], input[placeholder="0"][step="0.1"], input[max="100"]').first();
   await expect(mermaInput).toBeVisible({ timeout: 4000 });
   await mermaInput.fill('5');
   await expect(mermaInput).toHaveValue('5');
   ```
