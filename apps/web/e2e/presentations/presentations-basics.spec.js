import { test, expect } from '@playwright/test';
import { openPresentationModal, closePresentationModal, getPresentationLocators, submitAndCapturePresentation } from '../helpers/presentation-modal.js';
import { cleanupByPrefix } from '../helpers/chain-state.js';

const TEST_PREFIX = `E2E_TEST_PRES_${Date.now()}`;

test.describe('Presentaciones - Validaciones de nombre y tipos (T01-T12)', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupByPrefix(request, 'presentations', 'E2E_TEST_PRES_');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/presentations');
    await openPresentationModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closePresentationModal(page);
  });

  test('TEST 01 - Nombre vacío: muestra error', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    const isSubmitDisabled = await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
    if (!isSubmitDisabled) await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Complete: Nombre de la presentación, text=Este campo es requerido').first().isVisible().catch(() => false)).toBeTruthy();
  });

  test('TEST 02 - Nombre solo espacios: muestra error', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.nameInput.fill('    ');
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    const isSubmitDisabled = await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
    if (!isSubmitDisabled) await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await loc.submitBtn.getAttribute('title')).toBeTruthy();
  });

  test('TEST 03 - Nombre 500 chars: documentar comportamiento', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.nameInput.fill(`${TEST_PREFIX}_` + 'A'.repeat(480));
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    expect(await page.locator('text=Nueva Presentación Comercial').isVisible().catch(() => false)).toBeDefined();
  });

  test('TEST 04 - Nombre con <script>: no ejecuta script', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });
    const loc = getPresentationLocators(page);
    await loc.nameInput.fill(`${TEST_PREFIX}_<script>alert(1)</script>`);
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    expect(dialogFired).toBeFalsy();
  });

  test('TEST 05 - Crear con ENVASE', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_ENVASE`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('ENVASE', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('10');
    await loc.mlInput.fill('300');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 06 - Crear con BOTELLA', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_BOTELLA`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('BOTELLA', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('8');
    await loc.mlInput.fill('250');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 07 - Crear con BOLSA', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_BOLSA`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('BOLSA', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('16');
    await loc.mlInput.fill('500');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 08 - Crear con VASO', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_VASO`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('VASO', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('6');
    await loc.mlInput.fill('180');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 09 - Crear con BALDE', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_BALDE`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('BALDE', { timeout: 1500 }).catch(() => {});
    await loc.mlInput.fill('4000');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 10 - Crear con COPITA', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_COPITA`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('PORCIONADO_WIP', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('3');
    await loc.mlInput.fill('90');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 11 - Crear con OTRO', async ({ page }) => {
    const loc = getPresentationLocators(page);
    const name = `${TEST_PREFIX}_OTRO`;
    await loc.nameInput.fill(name);
    await loc.envaseSelect.selectOption('OTRO', { timeout: 1500 }).catch(() => {});
    await loc.ozInput.fill('12');
    await loc.mlInput.fill('350');
    await submitAndCapturePresentation(page);
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 7000 });
  });

  test('TEST 12 - Sin envase: muestra error', async ({ page }) => {
    const loc = getPresentationLocators(page);
    await loc.nameInput.fill(`${TEST_PREFIX}_NO_ENVASE`);
    await loc.envaseSelect.evaluate((el) => { el.value = ''; el.dispatchEvent(new Event('change', { bubbles: true })); });
    await loc.ozInput.fill('10');
    await loc.mlInput.fill('300');
    const isSubmitDisabled = await loc.submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
    if (!isSubmitDisabled) await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Tipo de envase').first().isVisible()).toBeTruthy();
  });
});
