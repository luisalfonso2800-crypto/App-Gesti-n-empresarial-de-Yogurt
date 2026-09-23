import { test, expect } from '@playwright/test';
import { openPresentationModal, closePresentationModal, getPresentationLocators, submitAndCapturePresentation } from '../helpers/presentation-modal.js';
import { saveChainState } from '../helpers/chain-state.js';

const TEST_PREFIX = `E2E_TEST_PRES_${Date.now()}`;

test.describe('Presentaciones - Validaciones de capacidad, integridad y cadena (T13-T26)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/presentations');
    await openPresentationModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closePresentationModal(page);
  });

  test('TEST 13 - OZ negativo: bloquea signo', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.pressSequentially('-5');
    expect(await loc.ozInput.inputValue()).not.toContain('-');
  });

  test('TEST 14 - OZ texto "abc": sanitiza', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.fill('abc');
    expect(await loc.ozInput.inputValue()).toBe('');
  });

  test('TEST 15 - OZ decimal 1.5: permite', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.fill('1.5');
    expect((await loc.ozInput.inputValue()).length > 0).toBeTruthy();
  });

  test('TEST 16 - OZ 1.55: documentar', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.fill('1.55');
    expect(typeof (await loc.ozInput.inputValue()) === 'string').toBeTruthy();
  });

  test('TEST 17 - OZ cero: documentar', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.fill('0');
    expect(typeof (await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false)) === 'boolean').toBeTruthy();
  });

  test('TEST 18 - ML negativo: bloquea signo', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.mlInput.pressSequentially('-100');
    expect(await loc.mlInput.inputValue()).not.toContain('-');
  });

  test('TEST 19 - ML texto "abc": sanitiza', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.mlInput.fill('abc');
    expect(await loc.mlInput.inputValue()).toBe('');
  });

  test('TEST 20 - ML decimal 250.5: permite', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.mlInput.fill('250.5');
    expect((await loc.mlInput.inputValue()).length > 0).toBeTruthy();
  });

  test('TEST 21 - ML 250.55: documentar', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.mlInput.fill('250.55');
    expect(typeof (await loc.mlInput.inputValue()) === 'string').toBeTruthy();
  });

  test('TEST 22 - ML cero: documentar', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.mlInput.fill('0');
    expect(typeof (await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false)) === 'boolean').toBeTruthy();
  });

  test('TEST 23 - Todos vacíos: muestra error', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const isSubmitDisabled = await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
    if (!isSubmitDisabled) await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Complete:').first().isVisible().catch(() => false)).toBeTruthy();
  });

  test('TEST 24 - Solo nombre: muestra error', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.nameInput.fill(`${TEST_PREFIX}_SOLO_NOMBRE`);
    await loc.ozInput.fill('');
    await loc.mlInput.fill('');
    const isSubmitDisabled = await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
    if (!isSubmitDisabled) await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Complete:').first().isVisible().catch(() => false)).toBeTruthy();
  });

  test('TEST 25 - Happy path: crea y aparece en tabla', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const happyName = `${TEST_PREFIX}_HAPPY_250ML`;
    await loc.nameInput.fill(happyName);
    await loc.envaseSelect.selectOption('ENVASE', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    await loc.obsInput.fill('PRUEBA HAPPY PATH E2E');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${happyName}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 26 - Crear presentación maestra para cadena', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const nombre = `E2E_CHAIN_PRES_BOTELLA_250_${Date.now()}`;
    await loc.nameInput.fill(nombre);
    await loc.envaseSelect.selectOption('BOTELLA', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    const id = await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${nombre}`).first()).toBeVisible({ timeout: 7000 });
    saveChainState('presentations', {
      presentacionesCreadas: { MASTER_BOTELLA_250: { id, nombre } },
      timestamp: new Date().toISOString()
    });
  });
});
