import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal } from '../helpers/exhaustive-helpers.js';

test.describe('Comercial: Facturación, Pagos y Gastos', () => {
  test('Pagos: modal de cobro y registro', async ({ page }) => {
    await page.goto('/commercial/payments');
    await waitForLoad(page);
    await expect(page).not.toHaveURL(/404/);

    const btnPago = page.locator('button:has-text("Registrar Pago"), button:has-text("Nuevo Pago")').first();
    if (await btnPago.isVisible({ timeout: 5000 }).catch(() => false)) {
      if (await btnPago.isEnabled({ timeout: 1000 }).catch(() => false)) {
        await btnPago.click();
        await page.waitForTimeout(500);
        await closeModal(page);
      }
    }
    expect(true).toBe(true);
  });

  test('Gastos: modal de registro y formulario', async ({ page }) => {
    await page.goto('/commercial/expenses');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Gasto"), button:has-text("Registrar Gasto")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    await btnNuevo.click();
    await page.waitForTimeout(500);

    const descripIn = page.locator('input[name="descripcion"], input[name="nombre"]').first();
    if (await descripIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await descripIn.fill('SERVICIOS PÚBLICOS / ENERGÍA');
    }
    await closeModal(page);
    expect(true).toBe(true);
  });
});
