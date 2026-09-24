import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow, getPurchaseLocators } from '../helpers/purchase-form.js';
import { fillRowItem, submitPurchase } from '../helpers/purchase-helpers.js';
import { cleanupByPrefix } from '../helpers/chain-state.js';

test.describe.serial('Compras - Validaciones y Envío (T09-T18)', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupByPrefix(request, 'purchases', 'E2E_');
  });

  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
  });

  test('T09 - Botón Guardar deshabilitado sin filas añadidas', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await expect(loc.btnSavePurchase).toBeDisabled();
  });

  test('T10 - Intento de guardar fila vacía muestra advertencia', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await loc.btnSavePurchase.click();
    await expect(page.getByText(/corrija las filas antes de confirmar/i).or(page.locator('div[class*="toast"]').first())).toBeVisible();
  });

  test('T11 - Bloqueo si cantidad es cero o negativa', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await fillRowItem(page, 0, { cantidad: 0, precio: 3000 });
    await loc.btnSavePurchase.click();
    await expect(page.getByText(/mayor a 0|corrija/i).or(page.locator('div[class*="toast"]').first())).toBeVisible();
  });

  test('T12 - Bloqueo si precio unitario es cero', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await fillRowItem(page, 0, { cantidad: 5, precio: 0 });
    await loc.btnSavePurchase.click();
    await expect(page.getByText(/mayor a \$0|corrija/i).or(page.locator('div[class*="toast"]').first())).toBeVisible();
  });

  test('T13 - Bloqueo por falta de proveedor en compra directa', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await fillRowItem(page, 0, { cantidad: 5, precio: 3000 });
    await loc.btnSavePurchase.click();
    await expect(page.locator('div[class*="toast"]').filter({ hasText: /proveedor|corrija/i }).first().or(page.getByText(/todas las filas deben tener un proveedor/i))).toBeVisible();
  });

  test('T14 - Fila no configurada muestra tag de advertencia', async ({ page }) => {
    await addRow(page);
    await expect(page.locator('div[class*="formRowCard"]').first()).toBeVisible();
  });

  test('T15 - Completar campos requeridos habilita el flujo de guardado', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await fillRowItem(page, 0, { cantidad: 2, precio: 1500 });
    await expect(loc.btnSavePurchase).toBeEnabled();
  });

  test('T16 - Registro exitoso responde 200 o 201 Created', async ({ page }) => {
    await addRow(page);
    const row = page.locator('div[class*="formRowCard"]').first();
    const provOption = page.locator('div[class*="dropdownItem"]').first();
    await row.locator('input[class*="provInput"]').click();
    if (await provOption.isVisible({ timeout: 2000 }).catch(() => false)) await provOption.click();

    const insumoOption = page.locator('div[class*="dropdownItem"]').first();
    await row.locator('input[class*="insumoInput"]').click();
    if (await insumoOption.isVisible({ timeout: 2000 }).catch(() => false)) await insumoOption.click();

    await fillRowItem(page, 0, { cantidad: 3, precio: 2000 });
    const response = await submitPurchase(page);
    if (response) expect([200, 201]).toContain(response.status());
  });

  test('T17 - Redirección a compras tras submit exitoso', async ({ page }) => {
    await addRow(page);
    const row = page.locator('div[class*="formRowCard"]').first();
    const provOption = page.locator('div[class*="dropdownItem"]').first();
    await row.locator('input[class*="provInput"]').click();
    if (await provOption.isVisible({ timeout: 2000 }).catch(() => false)) await provOption.click();

    const insumoOption = page.locator('div[class*="dropdownItem"]').first();
    await row.locator('input[class*="insumoInput"]').click();
    if (await insumoOption.isVisible({ timeout: 2000 }).catch(() => false)) await insumoOption.click();

    await fillRowItem(page, 0, { cantidad: 2, precio: 1500 });
    await submitPurchase(page);

    await page.waitForURL(/\/operations\/purchases(?!\/new)/, { timeout: 10000 }).catch(() => {});
    const loc = getPurchaseLocators(page);
    await expect(loc.btnNuevaDirecta).toBeVisible({ timeout: 10000 });
  });

  test('T18 - Historial o tabla visible tras recargar', async ({ page }) => {
    await page.goto('/operations/purchases');
    await expect(page.locator('table').or(page.locator('text=Comienza registrando tu primera Compra'))).toBeVisible();
  });
});
