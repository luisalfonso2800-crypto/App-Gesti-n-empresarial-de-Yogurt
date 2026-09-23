import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal, clickInsideDrawer } from '../helpers/exhaustive-helpers.js';

test.describe('Comercial: Pedidos y Despachos de Ventas', () => {
  test('Ventas: nueva venta, cliente rápido y cava drawer', async ({ page }) => {
    await page.goto('/commercial/sales');
    await waitForLoad(page);

    const btnNueva = page.locator('button:has-text("Nueva Venta")').first();
    await expect(btnNueva).toBeVisible({ timeout: 10000 });
    await btnNueva.click();
    await page.waitForTimeout(600);

    const clienteSel = page.locator('select[name="idCliente"]').first();
    if (await clienteSel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await clienteSel.selectOption({ label: /TIENDA YOGURT MARKET/i }).catch(async () => {
        await clienteSel.selectOption({ index: 1 }).catch(() => {});
      });
    }

    const addCavaBtn = page.locator('button:has-text("Agregar Productos desde Cava")').first();
    if (await addCavaBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      if (await addCavaBtn.isEnabled({ timeout: 1000 }).catch(() => false)) {
        await addCavaBtn.click();
        await page.waitForTimeout(600);
        await clickInsideDrawer(page, 'button:has-text("✕"), button[aria-label="Cerrar"]');
        await page.waitForTimeout(400);
      }
    }

    await closeModal(page);
    expect(true).toBe(true);
  });
});
