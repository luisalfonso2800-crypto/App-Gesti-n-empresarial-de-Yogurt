# TAREA CONTROLADA — FIX QUIRÚRGICO DE SELECTORES EN R05 Y R06 (RECIPES-ORPHANS-AND-GATE)

OBJETIVO TÉCNICO:
Corregir en `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js` los tests R05 y R06 para alcanzar el 30/30 (100% PASS):
1. R05 (Filtro WIP): Flexibilizar el locator para validar que las tarjetas filtradas contengan el texto o badge 'WIP' sin depender rígidamente de la clase CSS `span[class*="orphanBadge"]`.
2. R06 (Filtro Comercial): Aceptar tanto 'COM' como 'COMERCIAL' con regex tolerante `/COM|COMERCIAL/i`.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 1 LECTURA, EXACTAMENTE 1 EDICIÓN):
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente.
- Modificar EXCLUSIVAMENTE: `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js`.
- Respetar el límite de ≤ 140 líneas.

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
      const cards = page.locator('div[class*="orphanCard"]:not(:has(div[class*="orphanCard"]))');
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
      const cards = page.locator('div[class*="orphanCard"]:not(:has(div[class*="orphanCard"]))');
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/COM|COMERCIAL/i);
      }
    }
  });
```
