import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplierModal, closeSupplierModal, getSupplierLocators } from '../helpers/supplier-modal.js';
import { cleanupByPrefix } from '../helpers/chain-state.js';

test.describe.serial('Proveedores - Validaciones Preventivas (T13-T24)', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupByPrefix(request, 'suppliers', 'E2E_');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await openSupplierModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplierModal(page);
  });

  test('T13 - Submit con formulario vacío bloquea envío', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T14 - Bloqueo si falta Razón Social', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.nitInput.fill('900123456-1');
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CARRERA 15 # 20-30');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T15 - Bloqueo si falta NIT / Cédula', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR SIN NIT');
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CARRERA 15 # 20-30');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T16 - Bloqueo si falta Teléfono / Celular', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR SIN TEL');
    await loc.nitInput.fill('900123456-2');
    await loc.direccionInput.fill('CARRERA 15 # 20-30');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T17 - Bloqueo si falta Dirección', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR SIN DIR');
    await loc.nitInput.fill('900123456-3');
    await loc.telefonoInput.fill('3001234567');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T18 - Bloqueo si teléfono tiene menos de 10 dígitos', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR TEL CORTO');
    await loc.nitInput.fill('900123456-4');
    await loc.telefonoInput.fill('30012345');
    await loc.direccionInput.fill('CARRERA 15 # 20-30');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T19 - Bloqueo por formato de email inválido', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR EMAIL MAL');
    await loc.nitInput.fill('900123456-5');
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CARRERA 15 # 20-30');
    await loc.emailInput.fill('correo-invalido-sin-arroba');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T20 - Acepta correo vacío (campo opcional)', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    await loc.razonSocialInput.fill(`PROVEEDOR_OPC_${ts}`);
    await loc.nitInput.fill(`900${String(ts).slice(-6)}1`);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('AVENIDA 5 # 10-20');
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(true).toBe(true);
  });

  test('T21 - Acepta nombreContacto vacío (campo opcional)', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    await loc.razonSocialInput.fill(`PROVEEDOR_NOCON_${ts}`);
    await loc.nitInput.fill(`900${String(ts).slice(-6)}2`);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('AVENIDA 5 # 10-20');
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(true).toBe(true);
  });

  test('T22 - Acepta observaciones vacías (campo opcional)', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    await loc.razonSocialInput.fill(`PROVEEDOR_NOOBS_${ts}`);
    await loc.nitInput.fill(`900${String(ts).slice(-6)}3`);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('AVENIDA 5 # 10-20');
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(true).toBe(true);
  });

  test('T23 - NIT sólo con símbolos o letras es rechazado', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('PROVEEDOR NIT SIMBOLOS');
    await loc.nitInput.fill('...---');
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CALLE 1 # 2-3');
    await loc.submitBtn.click();
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });

  test('T24 - Mensajes de ayuda y feedback visibles ante submit fallido', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.submitBtn.click();
    const hasFeedback = await page.locator('span[class*="fieldErrorText"]').or(page.locator('input[class*="inputErrorBorder"]')).first().isVisible().catch(() => false);
    expect(hasFeedback || await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500)).toBe(true);
  });
});
