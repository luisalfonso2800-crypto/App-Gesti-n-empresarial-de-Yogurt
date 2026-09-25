import { test, expect } from '@playwright/test';

test.describe.serial('Productos - Modal Cálculos Financieros (C01-C05)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('domcontentloaded');
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await expect(openBtn).toBeVisible({ timeout: 8000 });
    await openBtn.click();
    const chooseCommercialBtn = page.locator('button:has-text("Elegir Comercial")').first();
    if (await chooseCommercialBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await chooseCommercialBtn.click();
    }
    await expect(page.locator('form')).toBeVisible({ timeout: 5000 });
  });

  test('C01: Cálculo de Precio Sugerido a partir de Costo Estimado y Margen', async ({ page }) => {
    const costInput = page.locator('input[name="costoEstimado"]').first();
    const marginInput = page.locator('input[name="margenObjetivo"]').first();

    await costInput.fill('4000');
    await marginInput.fill('30');

    // Precio sugerido = 4000 / (1 - 0.30) ≈ 5714
    const suggestedBox = page.locator('text=Sugerido:').first().or(page.locator('text=Precio Sugerido').first());
    await expect(suggestedBox).toBeVisible();
    await expect(page.locator('text=5.714').or(page.locator('text=5714')).first()).toBeVisible();
  });

  test('C02: Cálculo de Margen Real al ingresar Precio de Venta y Costo', async ({ page }) => {
    const costInput = page.locator('input[name="costoEstimado"]').first();
    const priceInput = page.locator('input[name="precioVenta"]').first();

    await costInput.fill('5000');
    await priceInput.fill('10000');

    // Margen real = ((10000 - 5000) / 10000) * 100 = 50%
    const realMarginBox = page.locator('div[class*="marginFeedback"], div[class*="projectionMetricsBox"], div[class*="Metric"]').filter({ hasText: /50%/ }).first();
    await expect(realMarginBox).toBeVisible();
  });

  test('C03: Margen Real negativo o alerta si Costo supera Precio de Venta', async ({ page }) => {
    const costInput = page.locator('input[name="costoEstimado"]').first();
    const priceInput = page.locator('input[name="precioVenta"]').first();

    await costInput.fill('12000');
    await priceInput.fill('10000');

    const marginBad = page.locator('div[class*="marginFeedback"]').filter({ hasText: /Margen Real/ });
    await expect(marginBad).toBeVisible();
    await expect(marginBad).toContainText('Margen Real');
    await expect(marginBad).toContainText('-20%');
  });

  test('C04: Proyecciones financieras en tarjeta interactiva', async ({ page }) => {
    const priceInput = page.locator('input[name="precioVenta"]').first();
    const marginInput = page.locator('input[name="margenObjetivo"]').first();

    await priceInput.fill('8000');
    await marginInput.fill('25');

    // Tarjeta proyecta Costo Máx. y Ganancia Esperada
    await expect(page.locator('text=Costo Máx. Receta').first()).toBeVisible();
    await expect(page.locator('text=Ganancia Esperada').first()).toBeVisible();
  });

  test('C05: Formato monetario COP con separadores de miles', async ({ page }) => {
    const priceInput = page.locator('input[name="precioVenta"]').first();
    await priceInput.fill('15000');
    await expect(priceInput).toHaveValue('15.000');
  });
});
