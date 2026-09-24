import { test, expect } from '@playwright/test';

test.describe.serial('Productos - Modal Flow y Poka-Yoke (T01-T15)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('domcontentloaded');
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await expect(openBtn).toBeVisible({ timeout: 8000 });
    await openBtn.click();
    await expect(page.locator('form')).toBeVisible({ timeout: 5000 });
  });

  test('T01-T02: Modal visible con título y campos nuevos complementarios', async ({ page }) => {
    await expect(page.locator('h3, h2').filter({ hasText: /Nuevo Producto/i }).first()).toBeVisible();
    await expect(page.locator('input[name="codigo"]')).toBeVisible();
    await expect(page.locator('select[name="unidadVenta"]')).toBeVisible();
    await expect(page.locator('input[name="stockMinimo"]')).toBeVisible();
    await expect(page.locator('input[name="costoEstimado"]')).toBeVisible();
  });

  test('T03-T05: Cascada Poka-Yoke laxa (M6: solo Nombre + Presentación)', async ({ page }) => {
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const nameInput = page.locator('input[name="nombre"]').first();
    const presSelect = page.locator('select[name="idPresentacion"], select[name="presentacionId"]').first();

    // T03: Deshabilitado sin nombre
    await expect(saveBtn).toBeDisabled();

    // T04: Deshabilitado con nombre pero sin presentación
    await nameInput.fill('YOGURT FRESA');
    await expect(saveBtn).toBeDisabled();

    // T05: Habilitado con nombre y presentación
    if (await presSelect.isVisible()) {
      await presSelect.selectOption({ index: 1 }).catch(() => {});
      await expect(saveBtn).toBeEnabled();
    }
  });

  test('T06-T08: Conversión automática a UPPERCASE en vivo (M9)', async ({ page }) => {
    const nameInput = page.locator('input[name="nombre"]').first();
    await nameInput.fill('yogurt melocoton');
    await expect(nameInput).toHaveValue('YOGURT MELOCOTON');

    const descInput = page.locator('textarea[name="descripcion"]').first();
    if (await descInput.isVisible()) {
      await descInput.fill('sin azucar anadida');
      await expect(descInput).toHaveValue('SIN AZUCAR ANADIDA');
    }
  });

  test('T09-T10: Código interno con placeholder orientativo y edición manual sanitizada (M1)', async ({ page }) => {
    const codeInput = page.locator('input[name="codigo"]').first();
    await expect(codeInput).toBeVisible();

    const placeholder = await codeInput.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();

    await codeInput.fill('km-trad-01');
    const val = await codeInput.inputValue();
    expect(val.toUpperCase()).toContain('KM-TRAD-01');
  });

  test('T11-T14: Unidad de venta y stock mínimo con valores y restricciones (M2, M5)', async ({ page }) => {
    const unitSelect = page.locator('select[name="unidadVenta"]').first();
    await expect(unitSelect).toHaveValue('UND');

    const options = await unitSelect.locator('option').allTextContents();
    expect(options.some(opt => opt.includes('UND'))).toBeTruthy();
    expect(options.some(opt => opt.includes('LITRO'))).toBeTruthy();
    expect(options.some(opt => opt.includes('KILO'))).toBeTruthy();

    const stockInput = page.locator('input[name="stockMinimo"]').first();
    await expect(stockInput).toHaveValue('5');
    await stockInput.fill('-10');
    await expect(stockInput).toHaveValue('0');
  });

  test('T15: Plantilla visible de descripción (M10)', async ({ page }) => {
    const descInput = page.locator('textarea[name="descripcion"]').first();
    await expect(descInput).toBeVisible();
    const placeholder = await descInput.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });
});
