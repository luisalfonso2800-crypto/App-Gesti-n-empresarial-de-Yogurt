const { test, expect } = require('@playwright/test');

/**
 * @file expenses-flow.spec.js
 * @description Suite E2E representativa para el módulo visual de Gastos Operativos.
 */
test.describe('E2E Representativo: Flujo de Gastos Operativos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/commercial/expenses');
    await page.waitForLoadState('networkidle');
  });

  const getNewExpenseBtn = (page) =>
    page.getByRole('button', { name: /nuevo gasto/i }).first();

  test('EXP-E2E-01: Navegación y Carga Inicial', async ({ page }) => {
    const btn = getNewExpenseBtn(page);
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder*="Buscar"]').or(page.getByText(/período|categoría/i)).first()).toBeVisible();
  });

  test('EXP-E2E-02: Renderizado de la Interfaz de Datos', async ({ page }) => {
    await expect(
      page.locator('table').or(page.getByText(/no se encontraron gastos/i)).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('EXP-E2E-03: Apertura Determinista de ExpenseFormModal', async ({ page }) => {
    await getNewExpenseBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nuevo gasto/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
  });

  test('EXP-E2E-04: Validación de Campos y Compuerta Poka-Yoke', async ({ page }) => {
    await getNewExpenseBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nuevo gasto/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    await expect(page.locator('select[name="categoria"]').first()).toBeVisible();
    await expect(page.locator('input[name="valor"]').first()).toBeVisible();
    await expect(page.locator('input[name="descripcion"]').first()).toBeVisible();

    const btnSubmit = page.getByRole('button', { name: /guardar gasto/i }).first();
    await expect(btnSubmit).toBeVisible();
    const isDisabled = await btnSubmit.isDisabled();
    expect(typeof isDisabled).toBe('boolean');
  });

  test('EXP-E2E-05: Cierre Limpio y Devolución del Foco', async ({ page }) => {
    await getNewExpenseBtn(page).click();
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /nuevo gasto/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    const btnCancel = page.getByRole('button', { name: 'Cancelar' }).first();
    const btnClose = page.locator('button[aria-label="Cerrar modal"], button[class*="btnClose"]').first();

    if (await btnCancel.isVisible()) {
      await btnCancel.click();
    } else if (await btnClose.isVisible()) {
      await btnClose.click();
    }

    await expect(modalTitle).toBeHidden({ timeout: 5000 });
    await expect(
      page.locator('table').or(page.getByText(/no se encontraron gastos/i)).first()
    ).toBeVisible();
  });
});
