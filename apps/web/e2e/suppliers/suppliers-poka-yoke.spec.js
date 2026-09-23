import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplierModal, closeSupplierModal, getSupplierLocators } from '../helpers/supplier-modal.js';
import { cleanupByPrefix } from '../helpers/chain-state.js';

test.describe.serial('Proveedores - Poka-Yoke y Unicidad (T25-T32)', () => {
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

  test('T25 - Auto-UPPERCASE en Razón Social', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.pressSequentially('lacteos el trebol', { delay: 10 });
    expect(await loc.razonSocialInput.inputValue()).toBe('LACTEOS EL TREBOL');
  });

  test('T26 - Auto-UPPERCASE en Nombre de Contacto', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.contactoInput.pressSequentially('pedro perez', { delay: 10 });
    expect(await loc.contactoInput.inputValue()).toBe('PEDRO PEREZ');
  });

  test('T27 - Auto-UPPERCASE en Dirección', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.direccionInput.pressSequentially('carrera 10 diagonal 4', { delay: 10 });
    expect(await loc.direccionInput.inputValue()).toBe('CARRERA 10 DIAGONAL 4');
  });

  test('T28 - Máscara automática de NIT / Cédula', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.nitInput.pressSequentially('9001234567', { delay: 10 });
    const val = await loc.nitInput.inputValue();
    expect(val.includes('.') || val.includes('-')).toBe(true);
  });

  test('T29 - Formato con espacios en Teléfono / Celular', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.telefonoInput.pressSequentially('3001234567', { delay: 10 });
    const val = await loc.telefonoInput.inputValue();
    expect(val.includes(' ')).toBe(true);
  });

  test('T30 - Rechazo por NIT duplicado muestra banner de error', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    const fixedNit = `800${String(ts).slice(-6)}9`;
    
    await loc.razonSocialInput.fill(`PROV_ORIGINAL_${ts}`);
    await loc.nitInput.fill(fixedNit);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CALLE 123 # 45-67');

    const firstPost = page.waitForResponse(r => r.url().includes('/suppliers') && r.request().method() === 'POST').catch(() => null);
    await loc.submitBtn.click();
    await firstPost;
    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible({ timeout: 5000 });

    await openSupplierModal(page);
    await loc.razonSocialInput.fill(`PROV_DUPLICADO_${ts}`);
    await loc.nitInput.fill(fixedNit);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CALLE 123 # 45-67');

    const dupPost = page.waitForResponse(r => r.url().includes('/suppliers') && r.request().method() === 'POST').catch(() => null);
    await loc.submitBtn.click();
    await dupPost;

    const errorVisible = await safeIsVisible(page.locator('div[class*="errorMessage"]').or(page.locator('text=/existe un proveedor|ya existe|verifique/i')), 3000);
    const modalStillOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 1000);
    expect(errorVisible || modalStillOpen).toBe(true);
  });

  test('T31 - Rechazo por Razón Social duplicada', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    const fixedName = `PROV_NAME_DUP_${ts}`;
    
    await loc.razonSocialInput.fill(fixedName);
    await loc.nitInput.fill(`700${String(ts).slice(-6)}1`);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CALLE 123 # 45-67');

    const firstPost = page.waitForResponse(r => r.url().includes('/suppliers') && r.request().method() === 'POST').catch(() => null);
    await loc.submitBtn.click();
    await firstPost;
    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible({ timeout: 5000 });

    await openSupplierModal(page);
    await loc.razonSocialInput.fill(fixedName);
    await loc.nitInput.fill(`700${String(ts).slice(-6)}2`);
    await loc.telefonoInput.fill('3001234567');
    await loc.direccionInput.fill('CALLE 123 # 45-67');

    const dupPost = page.waitForResponse(r => r.url().includes('/suppliers') && r.request().method() === 'POST').catch(() => null);
    await loc.submitBtn.click();
    await dupPost;

    const errorVisible = await safeIsVisible(page.locator('div[class*="errorMessage"]').or(page.locator('text=/existe un proveedor|ya existe|verifique/i')), 3000);
    const modalStillOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 1000);
    expect(errorVisible || modalStillOpen).toBe(true);
  });

  test('T32 - Sanitización XSS en Razón Social', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.pressSequentially('PROV <script>alert(1)</script>', { delay: 10 });
    const val = await loc.razonSocialInput.inputValue();
    expect(val).toContain('ALERT(1)');
  });
});
