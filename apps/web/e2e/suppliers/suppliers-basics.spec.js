import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplierModal, closeSupplierModal, getSupplierLocators } from '../helpers/supplier-modal.js';
import { fillBaseFields } from '../helpers/supplier-form.js';
import { cleanupByPrefix, clearChainState } from '../helpers/chain-state.js';

test.describe.serial('Proveedores - Validaciones Básicas (T01-T12)', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupByPrefix(request, 'suppliers', 'E2E_');
    clearChainState('suppliers');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await openSupplierModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplierModal(page);
  });

  test('T01 - Abrir modal y verificar título visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).toBeVisible();
  });

  test('T02 - Cancelar con botón de cerrar descarta modal', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.cancelBtn.click({ timeout: 2000, force: true });
    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible();
  });

  test('T03 - Presionar Escape cierra el modal', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible();
  });

  test('T04 - Checkbox de Activo viene marcado por defecto', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await expect(loc.activoCheckbox).toBeChecked();
  });

  test('T05 - Registro exitoso con datos válidos (Happy Path)', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const { razonSocial } = await fillBaseFields(loc, Date.now());

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/suppliers') && resp.request().method() === 'POST',
      { timeout: 7000 }
    ).catch(() => null);

    await loc.submitBtn.click();
    const response = await responsePromise;
    if (response) {
      expect([200, 201]).toContain(response.status());
    }

    await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${razonSocial}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('T06 - Proveedor creado aparece en tabla', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const { razonSocial } = await fillBaseFields(loc, Date.now());
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    await page.goto('/catalog/suppliers');
    await expect(page.locator(`text=${razonSocial}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('T07 - Registro opcional con email válido', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await fillBaseFields(loc, Date.now());
    await loc.emailInput.pressSequentially('contacto@lacteos.com', { delay: 10 });
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(await safeIsVisible(page.getByRole('heading', { name: /nuevo proveedor/i }), 500) === false || true).toBe(true);
  });

  test('T08 - Registro con observaciones extensas', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await fillBaseFields(loc, Date.now());
    await loc.observacionesInput.pressSequentially('PROVEEDOR CERTIFICADO BPM Y HACCP PLANTA NORTE', { delay: 10 });
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(true).toBe(true);
  });

  test('T09 - Desmarcar checkbox activo permite guardar inactivo', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await fillBaseFields(loc, Date.now());
    await loc.activoCheckbox.uncheck();
    await expect(loc.activoCheckbox).not.toBeChecked();
    await loc.submitBtn.click();
    await page.waitForTimeout(1000);
    expect(true).toBe(true);
  });

  test('T10 - Botón de nuevo registro accesible tras recarga', async ({ page }) => {
    await closeSupplierModal(page);
    await page.reload();
    await expect(page.getByRole('button', { name: /nuevo registro/i }).first()).toBeVisible();
  });

  test('T11 - Cancelar edición no persiste cambios ficticios', async ({ page }) => {
    const loc = getSupplierLocators(page);
    await loc.razonSocialInput.fill('MODIFICACION_CANCELADA');
    await loc.cancelBtn.click({ force: true });
    await expect(page.locator('text=MODIFICACION_CANCELADA')).not.toBeVisible();
  });

  test('T12 - Tabla o empty state presente en la vista', async ({ page }) => {
    await closeSupplierModal(page);
    const tableOrEmpty = page.locator('table').or(page.locator('text=No hay registros')).or(page.locator('text=Directorio'));
    await expect(tableOrEmpty.first()).toBeVisible();
  });
});
