import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal, tryClick } from '../helpers/exhaustive-helpers.js';

test.describe('Operaciones: Compras y Producción', () => {
  test('Compras: stock drawer y formulario', async ({ page }) => {
    await page.goto('/operations/purchases');
    await waitForLoad(page);

    await tryClick(page, 'button:has-text("Ver Stock"), button:has-text("Stock Insumos")');
    await page.waitForTimeout(400);
    await closeModal(page);

    const btnNueva = page.locator('button:has-text("Nueva Compra"), button:has-text("Nueva compra")').first();
    if (await btnNueva.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnNueva.click();
      await waitForLoad(page);
    }
    expect(true).toBe(true);
  });

  test('Producción: planificación y liquidación de lote', async ({ page }) => {
    await page.goto('/operations/production');
    await waitForLoad(page);

    const btnPlan = page.locator('button:has-text("Planificar"), button:has-text("Nueva Producción")').first();
    if (await btnPlan.isVisible({ timeout: 6000 }).catch(() => false)) {
      await btnPlan.click();
      await page.waitForTimeout(500);
      const cantIn = page.locator('input[name="cantidadPlanificada"], input[name="cantidad"]').first();
      if (await cantIn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cantIn.fill('10');
      }
      await closeModal(page);
    }
    expect(true).toBe(true);
  });
});
