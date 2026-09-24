import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow, getPurchaseLocators } from '../helpers/purchase-form.js';
import { cleanupByPrefix } from '../helpers/chain-state.js';

test.describe.serial('Compras - Validaciones Básicas de UI (T01-T08)', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupByPrefix(request, 'purchases', 'E2E_');
  });

  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
  });

  test('T01 - Encabezado Compras visible en página principal', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await expect(loc.titleHeader).toBeVisible();
  });

  test('T02 - Botones de acción principales presentes en cabecera', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await expect(loc.btnNuevaDirecta).toBeVisible();
    await expect(loc.btnGestionarLista).toBeVisible();
  });

  test('T03 - Click en Nueva Compra Directa navega a la URL con mode=direct', async ({ page }) => {
    await openPurchaseForm(page);
    expect(page.url()).toContain('/operations/purchases/new');
  });

  test('T04 - Barra fija contiene título de compra directa y controles', async ({ page }) => {
    await openPurchaseForm(page);
    const loc = getPurchaseLocators(page);
    await expect(loc.stickyTitle).toContainText(/nueva compra directa/i);
    await expect(loc.btnAddRow).toBeVisible();
    await expect(loc.btnSavePurchase).toBeVisible();
  });

  test('T05 - Click en + Añadir Fila inserta una tarjeta de ítem', async ({ page }) => {
    await openPurchaseForm(page);
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await expect(loc.rowCards).toHaveCount(1);
  });

  test('T06 - Añadir múltiples filas incrementa el conteo de tarjetas', async ({ page }) => {
    await openPurchaseForm(page);
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await addRow(page);
    await addRow(page);
    await expect(loc.rowCards).toHaveCount(3);
  });

  test('T07 - Limpiar Borrador vacía las filas tras confirmación', async ({ page }) => {
    await openPurchaseForm(page);
    const loc = getPurchaseLocators(page);
    await addRow(page);
    page.on('dialog', dialog => dialog.accept());
    await loc.btnClearDraft.click();
    await expect(loc.rowCards).toHaveCount(0);
  });

  test('T08 - Volver a Compras regresa al listado general', async ({ page }) => {
    await openPurchaseForm(page);
    const loc = getPurchaseLocators(page);
    await loc.btnBack.click();
    await page.waitForURL(/\/operations\/purchases$/, { timeout: 8000 });
    await expect(loc.titleHeader).toBeVisible();
  });
});
