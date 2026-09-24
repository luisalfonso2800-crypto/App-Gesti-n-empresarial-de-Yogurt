import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal } from '../helpers/exhaustive-helpers.js';

test.describe('Catálogos: Insumos canónicos', () => {
  test('Insumos: modal, fuzzing y creación canónica', async ({ page }) => {
    await page.goto('/catalog/supplies');
    await waitForLoad(page);

    const btnNuevo = page.getByRole('button', { name: /(nuevo registro|nuevo insumo)/i }).or(page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Insumo")')).first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // Fuzzing: abrir modal vacío y cerrar
    await btnNuevo.click();
    await page.waitForTimeout(500);
    await closeModal(page);
    await page.locator('[role="dialog"], [class*="modalCard"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(200);

    // Creación de insumo canónico
    await btnNuevo.click({ timeout: 5000 });
    await page.waitForTimeout(500);

    const timestamp = Date.now();
    const supplyName = `CANONICAL_SUPPLY_${timestamp}`;
    await page.locator('input[name="nombre"]').fill(supplyName);

    // Cascada habilitada: categoria -> subcategoria
    const catSelect = page.locator('select[name="categoria"]');
    await catSelect.waitFor({ state: 'visible', timeout: 2000 });
    await catSelect.selectOption({ index: 1 });

    const subSelect = page.locator('select[name="subcategoria"]');
    await subSelect.waitFor({ state: 'visible', timeout: 2000 });
    await subSelect.selectOption({ index: 1 });

    // Campos secundarios
    await page.locator('input[name="marca"]').fill('CANONICAL_BRAND');
    await page.locator('select[name="empaque"]').selectOption({ index: 1 });
    await page.locator('select[name="unidadBase"]').selectOption({ index: 1 });

    const contenidoInput = page.locator('input[name="contenidoReferencial"]');
    await expect(contenidoInput).toBeVisible({ timeout: 3000 });
    await expect(contenidoInput).toBeEnabled({ timeout: 3000 });
    await contenidoInput.fill('1000');

    const stockMinimoInput = page.locator('input[name="stockMinimo"]');
    await expect(stockMinimoInput).toBeVisible({ timeout: 3000 });
    await expect(stockMinimoInput).toBeEnabled({ timeout: 3000 });
    await stockMinimoInput.fill('10');

    const saveBtn = page.getByRole('button', { name: /guardar insumo/i }).first();
    await expect(saveBtn).toBeEnabled({ timeout: 3000 });
    await saveBtn.click({ timeout: 3000 });
    await page.waitForTimeout(500);
  });
});
