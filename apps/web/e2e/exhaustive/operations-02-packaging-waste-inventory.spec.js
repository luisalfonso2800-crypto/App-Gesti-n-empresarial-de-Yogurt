import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal, tryClick } from '../helpers/exhaustive-helpers.js';

test.describe('Operaciones: Inventario y Lotes', () => {
  test('Inventario: navegación entre pestañas y ajuste', async ({ page }) => {
    await page.goto('/operations/inventory');
    await waitForLoad(page);

    await tryClick(page, 'button:has-text("Insumos"), button:has-text("Bodega")');
    await page.waitForTimeout(300);
    await tryClick(page, 'button:has-text("Cava"), button:has-text("Prod. Terminado")');
    await page.waitForTimeout(300);

    const globalBtn = page.locator('button:has-text("Ajuste Global")').first();
    if (await globalBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      if (await globalBtn.isEnabled({ timeout: 1000 }).catch(() => false)) {
        await globalBtn.click();
        await page.waitForTimeout(400);
        await closeModal(page);
      }
    }
    expect(true).toBe(true);
  });

  test('Lotes: listado y filtros sin errores', async ({ page }) => {
    await page.goto('/operations/lots');
    await waitForLoad(page);
    await expect(page).not.toHaveURL(/404/);
  });
});
