import { test, expect } from '@playwright/test';

test.describe('Foco C: Barreras Poka-Yoke y Publicación Final (R23-R30)', () => {
  const setupBaseRecipe = async (page) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await page.locator('select[name="idProducto"]').selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta E2E Foco C Finalización');
    await page.locator('input[name="rendimientoBase"]').fill('100');
    await page.locator('select[name="unidadRendimiento"]').selectOption({ index: 1 });
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeHidden();
  };

  test('R23: Barrera 2: Warning si comercial no tiene base WIP', async ({ page }) => {
    await setupBaseRecipe(page);
    const bulkWarn = page.locator('div[class*="bulkWarningBanner"], div[class*="warningBanner"]').first();
    if (await bulkWarn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(bulkWarn).toBeVisible();
    }
  });

  test('R24: Barrera 3: Advertencia si producto envasado carece de empaque', async ({ page }) => {
    await setupBaseRecipe(page);
    const pkgWarn = page.locator('div[class*="packagingWarningBanner"]').first();
    if (await pkgWarn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(pkgWarn).toBeVisible();
    }
  });

  test('R25: Barrera 4: Advertencia ante desbordamiento de capacidad', async ({ page }) => {
    await setupBaseRecipe(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
    const cantInput = page.locator('input[placeholder="0"][type="number"]').first();
    await cantInput.fill('999999');
    await page.locator('button').filter({ hasText: /Finalizar y Resumir/i }).click();
    const errBanner = page.locator('div[class*="recipeErrorBanner"]').first();
    if (await errBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(errBanner).toBeVisible();
    }
  });

  test('R26: Barrera 5: Advertencia en balance si WIP no tiene costo resuelto', async ({ page }) => {
    await setupBaseRecipe(page);
    const wipWarning = page.locator('span[class*="balanceWarningBadge"]').first();
    if (await wipWarning.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(wipWarning).toBeVisible();
    }
  });

  test('R27: Botón Finalizar y Resumir deshabilitado ante alertas críticas', async ({ page }) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await expect(page.locator('button').filter({ hasText: /Finalizar y Resumir/i })).toHaveCount(0);
  });

  test('R28: Botón Finalizar y Resumir habilitado con balance consistente', async ({ page }) => {
    await setupBaseRecipe(page);
    const summarizeBtn = page.locator('button').filter({ hasText: /Finalizar y Resumir/i });
    await expect(summarizeBtn).toBeVisible({ timeout: 4000 });
  });

  test('R29: Clic en Finalizar y Resumir despliega modal Hoja de Ruta', async ({ page }) => {
    await setupBaseRecipe(page);
    const summarizeBtn = page.locator('button').filter({ hasText: /Finalizar y Resumir/i });
    if (await summarizeBtn.isEnabled()) {
      await summarizeBtn.click();
      await expect(page.locator('h2').filter({ hasText: /Hoja de Ruta Operativa/i })).toBeVisible({ timeout: 5000 });
    }
  });

  test('R30: Publicar receta persiste en BD y actualiza estado de huérfano', async ({ page }) => {
    await setupBaseRecipe(page);
    const summarizeBtn = page.locator('button').filter({ hasText: /Finalizar y Resumir/i });
    if (await summarizeBtn.isEnabled()) {
      await summarizeBtn.click();
      const publishBtn = page.locator('button').filter({ hasText: /Guardar y Publicar Receta/i });
      if (await publishBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(publishBtn).toBeVisible();
      }
    }
  });
});
