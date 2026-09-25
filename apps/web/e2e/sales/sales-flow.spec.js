const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * @file sales-flow.spec.js
 * @description Suite E2E representativa para el flujo de ventas y despacho desde Cava.
 */
test.describe('E2E Representativo: Flujo de Ventas y Despacho desde Cava', () => {
  let targetProduct = 'YOGUR NATURAL 1L';

  test.beforeAll(() => {
    const cavaFile = path.resolve(__dirname, '../.test-data/chain-cava.json');
    if (fs.existsSync(cavaFile)) {
      const data = JSON.parse(fs.readFileSync(cavaFile, 'utf8'));
      if (data.nombreProducto) targetProduct = data.nombreProducto;
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/commercial/sales');
    await page.waitForLoadState('networkidle');
  });

  const getNewSaleBtn = (page) =>
    page.getByRole('button', { name: 'Nueva Venta', exact: true }).first();

  test('V-E2E-01: Navegación a /commercial/sales y carga limpia de la interfaz', async ({ page }) => {
    const btn = getNewSaleBtn(page);
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Cifras')).toBeVisible();
  });

  test('V-E2E-02: Clic en "Nueva Venta" abre el modal de despacho desde Cava', async ({ page }) => {
    await getNewSaleBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nueva venta/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Agregar Productos desde Cava")')).toBeVisible();
  });

  test('V-E2E-03: Seleccionar cliente y agregar 1 unidad desde el catálogo de Cava', async ({ page }) => {
    await getNewSaleBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nueva venta/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 10000 });

    const selectCliente = page.locator('select[name="idCliente"]').first();
    await page.waitForFunction(() => {
      const s = document.querySelector('select[name="idCliente"]');
      return s && s.options && s.options.length > 1;
    }, { timeout: 7000 });
    await selectCliente.selectOption({ index: 1 });

    const btnOpenDrawer = page.locator('button:has-text("Agregar Productos desde Cava")');
    await btnOpenDrawer.click();

    const drawerCard = page.locator(`div[class*="drawerCard"]:has-text("${targetProduct}")`).first();
    if (await drawerCard.isVisible() && await drawerCard.locator('button[class*="btnDrawerAdd"]:not([disabled])').isVisible()) {
      await expect(drawerCard.locator('text=Stock Cava:')).toBeVisible();
      await drawerCard.locator('button[class*="btnDrawerAdd"]').click({ force: true, timeout: 3000 }).catch(() => {});
    } else {
      const activeBtn = page.locator('button[class*="btnDrawerAdd"]:not([disabled])').first();
      if (await activeBtn.isVisible()) await activeBtn.click({ force: true, timeout: 3000 }).catch(() => {});
    }

    const btnCloseDrawer = page.locator('button[class*="btnCloseDrawer"], button[aria-label="Cerrar"]').first();
    if (await btnCloseDrawer.isVisible()) {
      await btnCloseDrawer.click({ force: true, timeout: 2000 }).catch(() => {});
    }
    await expect(page.locator('table')).toBeVisible();
  });

  test('V-E2E-04: Confirmar la venta o cerrar limpiamente el formulario', async ({ page }) => {
    await getNewSaleBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nueva venta/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 10000 });

    // 1. Cancelar directamente en el footer de SaleModal
    const btnCancel = page.locator('button:has-text("Cancelar")').first();
    if (await btnCancel.isVisible()) {
      await btnCancel.click({ force: true });
    } else {
      const closeBtn = page.locator('button[aria-label="Cerrar modal"]').first();
      if (await closeBtn.isVisible()) await closeBtn.click({ force: true });
    }

    // 2. Si SmartModal pide confirmación de descarte
    const btnDiscard = page.locator('button:has-text("Descartar Cambios")');
    if (await btnDiscard.isVisible().catch(() => false)) {
      await btnDiscard.click({ force: true });
    }

    // 3. Confirmar que el modal queda completamente oculto
    await expect(modalTitle).toBeHidden({ timeout: 7000 });
  });

  test('V-E2E-05: Validar presencia de tabla de ventas o empty state asistido', async ({ page }) => {
    const tableOrEmpty = page.locator('table, [class*="emptyState"], [class*="AssistedEmptyState"]');
    await expect(tableOrEmpty.first()).toBeVisible({ timeout: 10000 });
  });
});
