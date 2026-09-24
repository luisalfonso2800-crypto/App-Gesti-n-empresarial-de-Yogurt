import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow, fillGlobalFlete, getPurchaseLocators } from '../helpers/purchase-form.js';
import { fillRowItem } from '../helpers/purchase-helpers.js';

test.describe.serial('Compras - Poka-Yoke y Persistencia Local (T30-T33)', () => {
  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
  });

  test('T30 - Campo Marca transforma texto a MAYÚSCULAS en vivo', async ({ page }) => {
    await addRow(page);
    const marcaInput = page.locator('input[class*="marcaInput"]').first();
    await marcaInput.pressSequentially('alpina del campo', { delay: 10 });
    expect(await marcaInput.inputValue()).toBe('ALPINA DEL CAMPO');
  });

  test('T31 - Sanitización de caracteres especiales en Marca', async ({ page }) => {
    await addRow(page);
    const marcaInput = page.locator('input[class*="marcaInput"]').first();
    await marcaInput.pressSequentially('Colanta$$##%%', { delay: 10 });
    const val = await marcaInput.inputValue();
    expect(val).not.toContain('$');
    expect(val).not.toContain('#');
  });

  test('T32 - Input de Flete rechaza letras y símbolos', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillGlobalFlete(page, 'ABC5000$$XYZ');
    const val = await loc.fleteInput.inputValue();
    expect(val.replace(/\D/g, '')).toBe('5000');
  });

  test('T33 - Persistencia de borrador en localStorage tras recarga', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await addRow(page);
    await fillRowItem(page, 0, { marca: 'BORRADOR PERSISTENTE' });
    await page.waitForTimeout(600); // Debounce de 400ms en useFormPhaseData
    await page.reload();
    await expect(loc.rowCards.first()).toBeVisible({ timeout: 6000 });
  });
});
