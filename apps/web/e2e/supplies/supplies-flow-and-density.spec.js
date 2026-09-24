import { test, expect } from '@playwright/test';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';

test.describe.serial('Insumos - Flujo en Cascada, Pregunta Dinámica y Densidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  // BLOQUE 1: DESBLOQUEO EN CASCADA POKA-YOKE
  test('D01 - Bloqueo inicial estricto de campos posteriores', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await expect(loc.nameInput).toBeEnabled();
    await expect(loc.catSelect).toBeDisabled();
    await expect(loc.brandInput).toBeDisabled();
    await expect(loc.stockInput).toBeDisabled();
  });

  test('D02 - Desbloqueo progresivo 1 a 1', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await loc.nameInput.fill('LECHE ENTERA TEST');
    await expect(loc.catSelect).toBeEnabled();

    await loc.catSelect.selectOption({ index: 1 });
    await expect(loc.subcatSelect).toBeEnabled();

    await loc.subcatSelect.selectOption({ index: 1 });
    await expect(loc.brandInput).toBeEnabled();
    await expect(loc.empaqueSelect).toBeEnabled();

    await loc.empaqueSelect.selectOption('BULTO');
    await expect(loc.unitSelect).toBeEnabled();
  });

  // BLOQUE 2: PREGUNTA DINÁMICA Y FORMATEO DE CONTENIDO
  test('D03 - Etiqueta adaptativa en lenguaje natural con unidad y empaque', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await loc.nameInput.fill('AZUCAR INDUSTRIAL');
    await loc.catSelect.selectOption({ index: 1 });
    await loc.subcatSelect.selectOption({ index: 1 });
    await loc.empaqueSelect.selectOption('BULTO');
    await loc.unitSelect.selectOption('kg');

    const labelPregunta = page.locator('label:has-text("¿Cuántos kilogramos tiene el BULTO?")');
    await expect(labelPregunta).toBeVisible();
  });

  test('D04 - Formateo de miles en vivo y pleca divisoria con unidad', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await loc.nameInput.fill('HARINA ESPECIAL');
    await loc.catSelect.selectOption({ index: 1 });
    await loc.subcatSelect.selectOption({ index: 1 });
    await loc.empaqueSelect.selectOption('BULTO');
    await loc.unitSelect.selectOption('kg');

    await loc.contenidoInput.fill('25000');
    await expect(loc.contenidoInput).toHaveValue('25.000');
    await expect(page.locator('span[class*="unitPlecaBadge"]')).toContainText(/\|\s*kg/i);
  });

  async function unlockDensityFields(page, loc) {
    await loc.nameInput.fill('INSUMO DENSIDAD TEST');
    await loc.catSelect.selectOption({ index: 1 });
    await loc.subcatSelect.selectOption({ index: 1 });
    await loc.empaqueSelect.selectOption('BULTO');
    await loc.unitSelect.selectOption('kg');
    await loc.contenidoInput.fill('10');
  }

  // BLOQUE 3: ASISTENTE Y PRESETS DE DENSIDAD
  test('D05 - Preset rápido asigna densidad y conserva modo readOnly', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await unlockDensityFields(page, loc);

    const lecheChip = page.locator('button, [role="button"]').filter({ hasText: /leche/i }).first();
    await lecheChip.click();
    await expect(loc.densityInput).toHaveValue(/1\.03/);
    await expect(loc.densityInput).toHaveAttribute('readonly', '');
  });

  test('D06 - Asistente de balanza deduce densidad automáticamente', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await unlockDensityFields(page, loc);

    await page.locator('button').filter({ hasText: /balanza/i }).first().click();
    await page.locator('div[class*="densityCalcBox"] select').first().selectOption('500');
    await page.locator('input[placeholder="Ej: 515"]').fill('515');

    await expect(loc.densityInput).toHaveValue('1.03');
    await expect(page.locator('div[class*="densityCalcResult"]')).toContainText(/1\.03\s*g\/ml/i);
  });

  test('D07 - Botón de edición manual abre confirmación del sistema y cancela', async ({ page }) => {
    const loc = getSupplyLocators(page);
    await unlockDensityFields(page, loc);

    await page.locator('button[class*="densityEditBtn"]').click();
    const heading = page.getByRole('heading', { name: /modificar densidad manualmente/i });
    await expect(heading).toBeVisible();

    const cancelBtn = page.locator('div[class*="densityConfirmActions"]').getByRole('button', { name: /cancelar/i }).or(page.locator('button[class*="button_secondary"]').filter({ hasText: /cancelar/i })).first();
    await cancelBtn.click();

    await expect(heading).not.toBeVisible();
    await expect(loc.densityInput).toHaveAttribute('readonly', '');
  });
});
