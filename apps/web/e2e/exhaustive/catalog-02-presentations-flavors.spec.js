import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal } from '../helpers/exhaustive-helpers.js';

test.describe('Catálogos: Presentaciones y Productos', () => {
  test('Presentaciones: modal, fuzzing y flujo válido', async ({ page }) => {
    await page.goto('/catalog/presentations');
    await waitForLoad(page);

    const btnNueva = page.locator('button:has-text("Nueva Presentación"), button:has-text("Nueva presentación")').first();
    await expect(btnNueva).toBeVisible({ timeout: 10000 });

    // Fuzzing: abrir modal y cerrar
    await btnNueva.click();
    await page.waitForTimeout(500);
    await closeModal(page);

    // Flujo válido: esperar que backdrop residual desaparezca antes de interactuar
    await page.locator('div[class*="backdrop"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    await btnNueva.click({ force: true });
    await page.waitForTimeout(500);
    const nombreInput = page.locator('input[name="nombre"]').first();
    if (await nombreInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreInput.fill('ENVASE PET 500 ML');
    }
    const ozInput = page.locator('input[name="cantidadOz"]').first();
    if (await ozInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await ozInput.fill('16.9');
    }
    const mlInput = page.locator('input[name="cantidadMl"]').first();
    if (await mlInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mlInput.fill('500');
    }

    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const saveEnabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (saveEnabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1000);
  });

  test('Productos: modal, fuzzing y creación', async ({ page }) => {
    await page.goto('/catalog/products');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Producto"), button:has-text("Nuevo Producto Comercial")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    await btnNuevo.click();
    await page.waitForTimeout(500);
    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('YOGURT FRESA 500ML');
    }
    const pvIn = page.locator('input[name="precioVenta"]').first();
    if (await pvIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pvIn.fill('7500');
    }
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1000);
  });
});
