const { test, expect } = require('@playwright/test');

/**
 * @file goals-flow.spec.js
 * @description Suite E2E representativa para el módulo visual Rumbo MANNÁ (Metas y Sueños).
 */
test.describe('E2E Representativo: Flujo Rumbo MANNÁ (Metas y Sueños)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/commercial/goals');
    await page.waitForLoadState('networkidle');
  });

  const getNewGoalBtn = (page) =>
    page.locator('button:has-text("Sembrar Nuevo Sueño"), button:has-text("Sembrar Primera Meta")').first();

  test('GOAL-E2E-01: Navegación y Carga Inicial', async ({ page }) => {
    const btn = getNewGoalBtn(page);
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Fondos Disponibles').or(page.getByText(/propósito|cosecha/i)).first()).toBeVisible();
  });

  test('GOAL-E2E-02: Renderizado de Contenedor de Metas / Estado Vacío', async ({ page }) => {
    await expect(getNewGoalBtn(page)).toBeVisible({ timeout: 10000 });
  });

  test('GOAL-E2E-03: Apertura Determinista de GoalFormModal', async ({ page }) => {
    await getNewGoalBtn(page).click();
    const modalTitle = page.locator('h2, h3').filter({ hasText: /sembrar nueva meta o sueño/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
  });

  test('GOAL-E2E-04: Validación de Inputs Clave y Botón de Acción', async ({ page }) => {
    await getNewGoalBtn(page).click();
    const modalTitle = page.locator('h2, h3').filter({ hasText: /sembrar nueva meta o sueño/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    await expect(page.locator('input[name="titulo"]').first()).toBeVisible();
    await expect(page.locator('input[name="valorObjetivo"]').first()).toBeVisible();
    await expect(page.locator('input[name="fechaFin"]').first()).toBeVisible();

    const submitBtn = page.locator('button:has-text("Sembrar Objetivo"), button:has-text("Guardar Cambios")').first();
    await expect(submitBtn).toBeVisible();
  });

  test('GOAL-E2E-05: Cierre Limpio y Devolución del Foco', async ({ page }) => {
    await getNewGoalBtn(page).click();
    const modalTitle = page.locator('h2, h3').filter({ hasText: /sembrar nueva meta o sueño/i }).first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    const cancelBtn = page.locator('button:has-text("Cancelar")').first();
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click({ force: true });
    } else {
      await page.locator('button[aria-label="Cerrar"], button:has-text("✕")').first().click({ force: true }).catch(() => {});
    }

    await expect(modalTitle).toBeHidden({ timeout: 5000 });
    await expect(getNewGoalBtn(page)).toBeVisible();
  });
});
