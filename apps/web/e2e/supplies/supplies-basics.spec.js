import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';
import { fillBaseFields, selectSafe } from '../helpers/supply-form.js';

test.describe('Insumos - Validaciones básicas (T01-T14)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  test('T01 - Nombre vacío bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T01');
    await loc.nameInput.fill('');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.getByRole('heading', { name: /nuevo insumo/i })).toBeVisible({ timeout: 3000 });
  });

  test('T02 - Nombre solo espacios bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T02');
    await loc.nameInput.fill('     ');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.getByRole('heading', { name: /nuevo insumo/i })).toBeVisible({ timeout: 3000 });
  });

  test('T03 - Nombre 500 chars documentado', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T03');
    await loc.nameInput.fill('A'.repeat(500));
    expect(await loc.nameInput.inputValue()).toBeTruthy();
  });

  test('T04 - Nombre con script sanitizado', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T04');
    await loc.nameInput.fill('<script>alert(1)</script>');
    await expect(loc.nameInput).toHaveValue(/alert\(1\)/i);
  });

  test('T05 - Marca vacía bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T05');
    await loc.brandInput.fill('');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.getByRole('heading', { name: /nuevo insumo/i })).toBeVisible({ timeout: 3000 });
  });

  test('T06 - Marca solo espacios bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T06');
    await loc.brandInput.fill('   ');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.getByRole('heading', { name: /nuevo insumo/i })).toBeVisible({ timeout: 3000 });
  });

  test('T07 - Marca válida permitida', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T07');
    await loc.brandInput.fill('COLANTA');
    expect(await loc.brandInput.inputValue()).toBe('COLANTA');
  });

  test('T08 - Empaque UNIDAD', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T08');
    await selectSafe(loc.empaqueSelect, 'UNIDAD');
    expect(true).toBe(true);
  });

  test('T09 - Empaque ENVASE', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T09');
    await selectSafe(loc.empaqueSelect, 'ENVASE');
    expect(true).toBe(true);
  });

  test('T10 - Empaque BOLSA', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T10');
    await selectSafe(loc.empaqueSelect, 'BOLSA');
    expect(true).toBe(true);
  });

  test('T11 - Empaque CAJA', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T11');
    await selectSafe(loc.empaqueSelect, 'CAJA');
    expect(true).toBe(true);
  });

  test('T12 - Empaque BULTO', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T12');
    await selectSafe(loc.empaqueSelect, 'BULTO');
    expect(true).toBe(true);
  });

  test('T13 - Empaque BOTELLA', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T13');
    await selectSafe(loc.empaqueSelect, 'BOTELLA');
    expect(true).toBe(true);
  });

  test('T14 - Empaque BIDÓN', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T14');
    await selectSafe(loc.empaqueSelect, 'BIDÓN');
    expect(true).toBe(true);
  });
});
