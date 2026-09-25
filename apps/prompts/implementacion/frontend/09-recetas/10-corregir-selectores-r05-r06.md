# TAREA CONTROLADA — CORRECCIÓN EXACTA DE SELECTORES EN R05 Y R06 (RECIPES-ORPHANS-AND-GATE)

OBJETIVO TÉCNICO:
Resolver el fallo en `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js` en los tests R05 y R06 para alcanzar 30/30 tests en verde (100% PASS):
1. Error actual: el selector `div[class*="orphanCard"]:not(...)` resuelve a `<div class="recipes_orphanCardAvatar...">` (el avatar SVG que tiene texto vacío `""`).
2. Solución: Apuntar a la tarjeta contenedora real que posee el botón "+ Crear Receta" o al contenedor de texto del huérfano, validando que contenga el texto correspondiente (WIP o COM/COMERCIAL).

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 1 LECTURA, EXACTAMENTE 1 EDICIÓN):
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- Modificar EXCLUSIVAMENTE: `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js`.
- Respetar el límite de ≤ 140 líneas por archivo.

ACCIONES ESPECÍFICAS:

En `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js`:
Reemplazar los bloques de prueba R05 y R06 por:

```javascript
  test('R05: Filtro por tipo WIP muestra solo tarjetas correspondientes', async ({ page }) => {
    const filterSelect = page.locator('select').filter({ hasText: /Todos|Comercial|WIP/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.selectOption({ label: 'WIP / Tanque' }).catch(async () => {
        await filterSelect.selectOption('WIP');
      });
      // Cada tarjeta huérfana contiene el botón "+ Crear Receta"
      const cards = page.locator('div').filter({ has: page.locator('button:has-text("+ Crear Receta")') });
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/WIP/i);
      }
    }
  });

  test('R06: Filtro por tipo Comercial muestra solo tarjetas con badge COM', async ({ page }) => {
    const filterSelect = page.locator('select').filter({ hasText: /Todos|Comercial|WIP/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.selectOption({ label: 'Comercial' }).catch(async () => {
        await filterSelect.selectOption('COMERCIAL');
      });
      const cards = page.locator('div').filter({ has: page.locator('button:has-text("+ Crear Receta")') });
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/COM|COMERCIAL/i);
      }
    }
  });
```
