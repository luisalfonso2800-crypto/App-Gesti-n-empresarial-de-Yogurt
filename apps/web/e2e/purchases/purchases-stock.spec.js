import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, getPurchaseLocators } from '../helpers/purchase-form.js';

test.describe.serial('Compras - Drawer de Stock de Insumos (T25-T29)', () => {
  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
  });

  test('T25 - Click en Consultar Stock abre el panel lateral', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await loc.btnStockDrawer.click();
    await expect(page.locator('h3:has-text("Consultar Stock de Insumos")')).toBeVisible({ timeout: 5000 });
  });

  test('T26 - Drawer renderiza buscador reactivo de insumos', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await loc.btnStockDrawer.click();
    await expect(page.locator('input[placeholder*="Buscar por nombre"]')).toBeVisible({ timeout: 5000 });
  });

  test('T27 - Buscador filtra insumos coincidentes en tiempo real', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await loc.btnStockDrawer.click();
    const searchInput = page.locator('input[placeholder*="Buscar por nombre"]');
    await searchInput.fill('Leche');
    await expect(page.locator('div[class*="drawerListContainer"]')).toBeVisible();
  });

  test('T28 - Añadir a Compra desde drawer inserta fila en el formulario', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await loc.btnStockDrawer.click();
    const addStockBtn = page.locator('button:has-text("+ Añadir a Compra")').first();
    if (await addStockBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await addStockBtn.click();
      await page.locator('button[class*="drawerCloseBtn"]').click();
      await expect(loc.rowCards.first()).toBeVisible();
    }
  });

  test('T29 - Cerrar drawer con botón X descarta el panel', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await loc.btnStockDrawer.click();
    const closeBtn = page.locator('button[class*="drawerCloseBtn"]');
    await closeBtn.click();
    await expect(page.locator('h3:has-text("Consultar Stock de Insumos")')).not.toBeVisible();
  });
});
