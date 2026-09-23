import { expect } from '@playwright/test';
import { safeIsVisible } from './safe-visible.js';

export async function openPresentationModal(page) {
  const btnNueva = page.locator('button:has-text("Nueva Presentación")').first();
  await btnNueva.waitFor({ state: 'visible', timeout: 5000 });
  await btnNueva.click();
  await page.locator('text=Nueva Presentación Comercial').waitFor({ state: 'visible', timeout: 3000 });
}

export async function closePresentationModal(page) {
  const cancelBtn = page.getByRole('button', { name: /cancelar/i });
  if (await safeIsVisible(cancelBtn, 300)) {
    await cancelBtn.click({ timeout: 1500, force: true }).catch(() => {});
  } else {
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(250).catch(() => {});
}

export function getPresentationLocators(page) {
  return {
    nameInput: page.locator('input[name="nombre"]'),
    envaseSelect: page.locator('select[name="tipoEnvase"]'),
    ozInput: page.locator('input[name="cantidadOz"]'),
    mlInput: page.locator('input[name="cantidadMl"]'),
    obsInput: page.locator('input[name="observaciones"]'),
    submitBtn: page.locator('button:has-text("Crear Presentación")'),
    cancelBtn: page.getByRole('button', { name: /cancelar/i }),
  };
}

export async function submitAndCapturePresentation(page) {
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('/presentation') && (resp.status() === 201 || resp.status() === 200),
      { timeout: 7000 }
    ).catch(() => null),
    page.locator('button:has-text("Crear Presentación")').click({ timeout: 2000, force: true }).catch(() => {}),
  ]);
  let id = null;
  if (response) {
    try {
      const body = await response.json();
      id = body.id || body.data?.id || body.data?.idPresentacion || body.idPresentacion;
    } catch {
      // Ignorar error al parsear json
    }
  }
  return id;
}
