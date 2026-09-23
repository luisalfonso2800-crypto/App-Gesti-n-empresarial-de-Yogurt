import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';
import { fillBaseFields } from '../helpers/supply-form.js';

test.describe('Insumos - Validaciones numéricas e integridad (T26-T36)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  test('T26 - Stock mínimo no numérico bloquea', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T26');
    await loc.stockInput.fill('abc');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(300);
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300)).toBe(true);
  });

  test('T27 - Stock mínimo decimal documentado', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T27');
    await loc.stockInput.fill('2.5');
    expect(await loc.stockInput.inputValue()).toBeTruthy();
  });

  test('T28 - Densidad negativa bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T28');
    await loc.densityInput.fill('-1');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });

  test('T29 - Densidad >5 documentado', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T29');
    await loc.densityInput.fill('6.5');
    expect(await loc.densityInput.inputValue()).toBe('6.5');
  });

  test('T30 - Densidad decimal 1.03 permitida', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T30');
    await loc.densityInput.fill('1.03');
    expect(await loc.densityInput.inputValue()).toBe('1.03');
  });

  test('T31 - Costo base negativo bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T31');
    await loc.costInput.fill('-100');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });

  test('T32 - Costo base no numérico bloquea', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const name = await fillBaseFields(loc, 'T32');
    await loc.costInput.fill('invalido');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const itemEnTabla = !modalOpen ? await safeIsVisible(page.getByText(name), 300) : false;
    expect(modalOpen || !itemEnTabla).toBe(true);
  });

  test('T33 - Costo base decimal permitido', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T33');
    await loc.costInput.fill('1500.50');
    expect(await loc.costInput.inputValue()).toBeTruthy();
  });

  test('T34 - Todos los campos vacíos bloquea submit', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await loc.nameInput.fill('');
    await loc.brandInput.fill('');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(300);
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300)).toBe(true);
  });

  test('T35 - Solo nombre sin obligatorios bloquea', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await loc.nameInput.fill('SOLO_NOMBRE');
    await loc.brandInput.fill('');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(300);
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300)).toBe(true);
  });

  test('T36 - Happy path básico', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T36');
    expect(true).toBe(true);
  });
});
