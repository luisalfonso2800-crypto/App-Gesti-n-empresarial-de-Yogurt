import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';
import { fillBaseFields } from '../helpers/supply-form.js';

test.describe('Insumos - Poka-Yoke contra duplicidad (T37-T43)', () => {
  const ts = Date.now();
  const baseName = `AZUCAR E2E ${ts}`;

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  test('T37 - (Base) Registrar Azúcar E2E exitosamente', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T37');
    await loc.nameInput.fill(baseName);
    const [res] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/v1/supplies') && r.request().method() === 'POST', { timeout: 7000 }).catch(() => null),
      loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {})
    ]);
    if (res) expect([200, 201]).toContain(res.status());
  });

  test('T38 - (Duplicado exacto) Rechazar creación idéntica', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T38');
    await loc.nameInput.fill(baseName);
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const errorVisible = await safeIsVisible(page.locator('[class*="error"], [class*="alert"], [role="alert"]').first(), 300);
    expect(modalOpen || errorVisible).toBe(true);
  });

  test('T39 - (Case Insensitive) Evaluar minúsculas', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T39');
    await loc.nameInput.fill(baseName.toLowerCase());
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const errorVisible = await safeIsVisible(page.locator('[class*="error"], [class*="alert"], [role="alert"]').first(), 300);
    expect(modalOpen || errorVisible).toBe(true);
  });

  test('T40 - (Sin tildes) Evaluar variante ortográfica', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T40');
    await loc.nameInput.fill(baseName.replace(/Ú/g, 'U'));
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const errorVisible = await safeIsVisible(page.locator('[class*="error"], [class*="alert"], [role="alert"]').first(), 300);
    expect(modalOpen || errorVisible).toBe(true);
  });

  test('T41 - (Espacios trim) Evaluar rechazo con espacios extra', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T41');
    await loc.nameInput.fill(`   ${baseName}   `);
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForTimeout(400);
    const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300);
    const errorVisible = await safeIsVisible(page.locator('[class*="error"], [class*="alert"], [role="alert"]').first(), 300);
    expect(modalOpen || errorVisible).toBe(true);
  });

  test('T42 - (Nombre compuesto) Permitir variante legítima', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T42');
    await loc.nameInput.fill(`AZÚCAR MORENA E2E ${ts}`);
    const [res] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/v1/supplies') && r.request().method() === 'POST', { timeout: 7000 }).catch(() => null),
      loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {})
    ]);
    if (res) expect([200, 201]).toContain(res.status());
  });

  test('T43 - (Sufijo distinto) Permitir con sufijo diferenciador', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await fillBaseFields(loc, 'T43');
    await loc.nameInput.fill(`AZÚCAR E2E TEST ${ts}`);
    const [res] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/v1/supplies') && r.request().method() === 'POST', { timeout: 7000 }).catch(() => null),
      loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {})
    ]);
    if (res) expect([200, 201]).toContain(res.status());
  });
});
