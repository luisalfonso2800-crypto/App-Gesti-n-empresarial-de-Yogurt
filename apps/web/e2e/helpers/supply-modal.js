import { safeIsVisible } from './safe-visible.js';

export async function openSupplyModal(page) {
  const newBtn = page.getByRole('button', { name: /nuevo registro/i });
  await newBtn.waitFor({ state: 'visible', timeout: 5000 });
  await newBtn.click();
  await page.getByRole('heading', { name: /nuevo insumo/i }).waitFor({ state: 'visible', timeout: 3000 });
}

export async function closeSupplyModal(page) {
  const cancelBtn = page.getByRole('button', { name: /cancelar/i });
  if (await safeIsVisible(cancelBtn, 300)) {
    await cancelBtn.click({ timeout: 1500, force: true }).catch(() => {});
  } else {
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(250).catch(() => {});
}

export function getSupplyLocators(page) {
  return {
    nameInput: page.locator('input[name="nombre"]'),
    brandInput: page.locator('input[name="marca"]'),
    catSelect: page.locator('select[name="categoria"]'),
    subcatSelect: page.locator('select[name="subcategoria"]'),
    empaqueSelect: page.locator('select[name="empaque"]'),
    contenidoInput: page.locator('input[name="contenidoReferencial"], input[name="contenidoEmpaque"]'),
    unitSelect: page.locator('select[name="unidadBase"]'),
    stockInput: page.locator('input[name="stockMinimo"]'),
    densityInput: page.locator('input[name="densidad"]'),
    costInput: page.locator('input[name="costoBase"]'),
    submitBtn: page.locator('button[title*="Guardar Insumo" i], button:has-text("Guardar Insumo")').first().or(page.locator('button[class*="btnSubmit"]').first()),
    cancelBtn: page.locator('div[class*="modalCard"]').getByRole('button', { name: /cancelar/i }),
  };
}
