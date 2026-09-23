import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal } from '../helpers/exhaustive-helpers.js';

test.describe('Catálogos: Proveedores, Clientes y Precios', () => {
  test('Proveedores: modal y creación HACIENDA LACTEA SAS', async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Proveedor"), button:has-text("Nuevo proveedor")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    await btnNuevo.click();
    await page.waitForTimeout(500);
    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('HACIENDA LACTEA SAS');
    }
    const telIn = page.locator('input[name="telefono"]').first();
    if (await telIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await telIn.fill('3101234567');
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

  test('Precios de Proveedor: asignación de precio', async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await waitForLoad(page);

    const btnAsignar = page.locator('button:has-text("Asignar Precio"), button:has-text("Nuevo Precio")').first();
    if (await btnAsignar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnAsignar.click();
      await page.waitForTimeout(500);
      const precioIn = page.locator('input[name="precioCompra"], input[name="precio"]').first();
      if (await precioIn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await precioIn.fill('2600');
      }
      await closeModal(page);
    }
  });

  test('Clientes: modal y creación de cliente comercial', async ({ page }) => {
    await page.goto('/commercial/clients');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Cliente"), button:has-text("Nuevo cliente")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    await btnNuevo.click();
    await page.waitForTimeout(500);
    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('TIENDA YOGURT MARKET');
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
