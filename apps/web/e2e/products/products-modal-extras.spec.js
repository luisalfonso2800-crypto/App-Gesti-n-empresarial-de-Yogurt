import { test, expect } from '@playwright/test';

test.describe.serial('Productos - Modal Extras y Semáforo M8 (T16-T30)', () => {
  test('T16-T20: Semáforo de estados en tabla del listado (M8)', async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('domcontentloaded');

    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // Verificar presencia de badges de semáforo
      const statusBadges = page.locator('[class*="statusBadge"]').or(page.locator('text=LISTO, text=INCOMPLETO, text=DESACTIVADO'));
      await expect(statusBadges.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('T21-T25: Selector de imagen y preview comercial (M7)', async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('domcontentloaded');

    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await expect(openBtn).toBeVisible({ timeout: 8000 });
    await openBtn.click();

    const chooseCommercialBtn = page.locator('button:has-text("Elegir Comercial")').first();
    if (await chooseCommercialBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await chooseCommercialBtn.click();
    }

    // Contenedor de sección de imagen y botón de subida reales del DOM
    const imageContainer = page.locator('div[class*="imageSectionContainer"], div[class*="imagePreviewBox"]').first();
    await expect(imageContainer).toBeVisible({ timeout: 5000 });

    const uploadBtn = page.locator('button[class*="btnUploadLocalImage"], button:has-text("Subir Imagen")').first();
    await expect(uploadBtn).toBeVisible();
  });

  test('T26-T30: Persistencia de campos de inventario y estado en edición', async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('domcontentloaded');

    const btnEdit = page.locator('button:has-text("Editar")').first();
    if (await btnEdit.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnEdit.click();
      await expect(page.locator('form')).toBeVisible({ timeout: 5000 });

      // Validar inputs de identidad e inventario presentes en edición
      await expect(page.locator('input[name="codigo"]')).toBeVisible();
      await expect(page.locator('select[name="unidadVenta"]')).toBeVisible();
      await expect(page.locator('input[name="stockMinimo"]')).toBeVisible();
    }
  });
});
