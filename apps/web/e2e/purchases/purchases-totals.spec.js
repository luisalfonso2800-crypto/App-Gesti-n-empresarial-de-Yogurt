import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow, fillGlobalFlete, getPurchaseLocators } from '../helpers/purchase-form.js';
import { fillRowItem } from '../helpers/purchase-helpers.js';

test.describe.serial('Compras - Cálculos de Totales e IVA (T19-T24)', () => {
  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
    await addRow(page);
  });

  test('T19 - Cálculo de Ingreso Neto refleja cantidad x contenido neto', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BOLSA / PAQUETE', contenidoNeto: 1000, cantidad: 5, precio: 3000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/5\.000|5000/);
  });

  test('T20 - Subtotal de línea refleja precio por empaques', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 4, precio: 2500 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/10\.000|10000/);
  });

  test('T21 - IVA 19% se calcula y desglosa en la sección contable', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 2, precio: 5000, aplicaIva: true });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('div[class*="ivaDesgloseMicro"]')).toContainText(/Base:/i);
  });

  test('T22 - Adición de flete global se suma al total acumulado', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillRowItem(page, 0, { cantidad: 2, precio: 5000 });
    await fillGlobalFlete(page, 15000);
    await expect(loc.stickyTotalAmount).toContainText(/25\.000|25000/);
  });

  test('T23 - Conversión de total en pesos a letras en sticky bar', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillRowItem(page, 0, { cantidad: 2, precio: 5000 });
    await expect(loc.stickyTotalWords).toContainText(/diez mil/i);
  });

  test('T24 - Desglose resumen general de compra en tarjeta inferior', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 2, precio: 5000 });
    await expect(page.getByText(/total compra a pagar/i)).toBeVisible();
  });
});
