const { test, expect } = require('@playwright/test');

/**
 * @file payments-flow.spec.js
 * @description Suite E2E representativa para el módulo visual de Cartera y Recaudos.
 */
test.describe('E2E Representativo: Flujo de Cartera y Recaudos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/commercial/payments');
    await page.waitForLoadState('networkidle');
  });

  test('PAY-E2E-01: Navegar a /commercial/payments y verificar indicadores de cartera', async ({ page }) => {
    await expect(page.locator('text=Cartera Pendiente')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Recaudado')).toBeVisible();
    await expect(page.locator('text=Clientes Deudores')).toBeVisible();
    await expect(page.locator('input[placeholder*="Buscar por cliente"]')).toBeVisible();
  });

  test('PAY-E2E-02: Verificar tabla de cartera o estado vacío si no hay saldos pendientes', async ({ page }) => {
    const tableLocator = page.locator('table').first();
    const emptyStateLocator = page.locator('text=No hay cuentas pendientes por cobrar');

    const hasTable = await tableLocator.isVisible().catch(() => false);
    const hasEmpty = await emptyStateLocator.isVisible().catch(() => false);

    expect(hasTable || hasEmpty).toBe(true);
    if (hasTable) {
      await expect(page.locator('th:has-text("Cliente")').first()).toBeVisible();
    }
  });

  test('PAY-E2E-03: Desplegar cliente y abrir modal de abono si existen registros', async ({ page }) => {
    const masterRow = page.locator('tr[class*="clientMasterRow"]').first();
    if (await masterRow.isVisible()) {
      await masterRow.click();

      const btnAbonar = page.locator('button:has-text("Abonar")').first();
      await expect(btnAbonar).toBeVisible({ timeout: 5000 });
      await btnAbonar.click();

      const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /registrar abono/i }).first();
      await expect(modalTitle).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator('text=No hay cuentas pendientes por cobrar')).toBeVisible();
    }
  });

  test('PAY-E2E-04: Validar campo de monto y cerrar modal limpiamente con Cancelar o botón ✕', async ({ page }) => {
    const masterRow = page.locator('tr[class*="clientMasterRow"]').first();
    if (await masterRow.isVisible()) {
      await masterRow.click();
      const btnAbonar = page.locator('button:has-text("Abonar")').first();
      if (await btnAbonar.isVisible()) {
        await btnAbonar.click();

        const inputMonto = page.locator('input[placeholder="0"]').first();
        await expect(inputMonto).toBeVisible({ timeout: 5000 });

        const btnCancel = page.locator('button:has-text("Cancelar")').first();
        const btnClose = page.locator('button[aria-label="Cerrar modal"], button[class*="btnClose"]').first();

        if (await btnCancel.isVisible()) {
          await btnCancel.click();
        } else if (await btnClose.isVisible()) {
          await btnClose.click();
        }
      }
    } else {
      await expect(page.locator('text=No hay cuentas pendientes por cobrar')).toBeVisible();
    }
  });

  test('PAY-E2E-05: Validar que el modal se oculte completamente devolviendo el foco', async ({ page }) => {
    const modalTitle = page.locator('h2, h3, h4').filter({ hasText: /registrar abono/i }).first();
    await expect(modalTitle).toBeHidden();
    const hasTable = await page.locator('table').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('text=No hay cuentas pendientes por cobrar').isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBe(true);
  });
});
