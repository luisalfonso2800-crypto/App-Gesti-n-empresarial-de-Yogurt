const { test, expect } = require('@playwright/test');

/**
 * @file purchases-flow.spec.js
 * @description Suite E2E representativa para el módulo visual de Compras y Abastecimiento.
 */
test.describe('E2E Representativo: Flujo de Compras y Abastecimiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/operations/purchases');
    await page.waitForLoadState('networkidle');
  });

  const getDirectPurchaseBtn = (page) =>
    page.locator('button:has-text("Nueva Compra Directa")').first();

  test('PUR-E2E-01: Navegación y Carga Inicial', async ({ page }) => {
    const btn = getDirectPurchaseBtn(page);
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Concepto Técnico').or(page.getByText(/llegada de insumos/i)).first()).toBeVisible();
  });

  test('PUR-E2E-02: Renderizado de Listas Activas o Historial', async ({ page }) => {
    await expect(
      page.locator('table').or(page.locator('button:has-text("Nueva Compra Directa")')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('PUR-E2E-03: Navegación a Flujo de Nueva Compra', async ({ page }) => {
    await getDirectPurchaseBtn(page).click();
    await page.waitForURL('**/operations/purchases/new**', { timeout: 10000 });
    expect(page.url()).toContain('/operations/purchases/new');
  });

  test('PUR-E2E-04: Validación de Controles del Formulario de Compra', async ({ page }) => {
    await page.goto('/operations/purchases/new?mode=direct');
    await page.waitForLoadState('networkidle');

    const backBtn = page.locator('button:has-text("Volver a Compras")').first();
    await expect(backBtn).toBeVisible({ timeout: 10000 });

    const totalOrSummary = page.locator('text=Total').or(page.getByText(/flete|insumo|proveedor/i)).first();
    await expect(totalOrSummary).toBeVisible();
  });

  test('PUR-E2E-05: Retorno Limpio al Tablero Principal', async ({ page }) => {
    await page.goto('/operations/purchases/new?mode=direct');
    await page.waitForLoadState('networkidle');

    const backBtn = page.locator('button:has-text("Volver a Compras")').first();
    await expect(backBtn).toBeVisible({ timeout: 10000 });
    await backBtn.click();

    await page.waitForURL('**/operations/purchases', { timeout: 10000 });
    await expect(getDirectPurchaseBtn(page)).toBeVisible();
  });
});
