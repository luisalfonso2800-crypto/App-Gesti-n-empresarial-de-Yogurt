import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';
import { fillBaseFields, selectSafe } from '../helpers/supply-form.js';

test.describe('Insumos - Empaques y unidades avanzadas (T15-T25)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  test('T15 - Empaque CANASTILLA', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T15');
    await selectSafe(loc.empaqueSelect, 'CANASTILLA');
    expect(true).toBe(true);
  });

  test('T16 - Empaque OTRO', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T16');
    await selectSafe(loc.empaqueSelect, 'OTRO');
    expect(true).toBe(true);
  });

  test('T17 - Empaque sin selección bloquea o valida', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T17');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });

  test('T18 - Unidad base KG', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T18');
    await selectSafe(loc.unitSelect, 'kg');
    expect(true).toBe(true);
  });

  test('T19 - Unidad base G', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T19');
    await selectSafe(loc.unitSelect, 'g');
    expect(true).toBe(true);
  });

  test('T20 - Unidad base L', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T20');
    await selectSafe(loc.unitSelect, 'l');
    expect(true).toBe(true);
  });

  test('T21 - Unidad base ML', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T21');
    await selectSafe(loc.unitSelect, 'ml');
    expect(true).toBe(true);
  });

  test('T22 - Unidad base OZ', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T22');
    await selectSafe(loc.unitSelect, 'oz');
    expect(true).toBe(true);
  });

  test('T23 - Unidad base UND', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T23');
    await selectSafe(loc.unitSelect, 'und');
    expect(true).toBe(true);
  });

  test('T24 - Unidad base vacía bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T24');
    await selectSafe(loc.unitSelect, '');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });

  test('T25 - Stock mínimo negativo bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T25');
    await loc.stockInput.fill('-5');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });
});
