import { safeIsVisible } from './safe-visible.js';

export async function openSupplierModal(page) {
  const newBtn = page.getByRole('button', { name: /nuevo registro/i }).first();
  await newBtn.waitFor({ state: 'visible', timeout: 5000 });
  await newBtn.click();
  await page.getByRole('heading', { name: /nuevo proveedor/i }).waitFor({ state: 'visible', timeout: 4000 });
}

export async function closeSupplierModal(page) {
  const cancelBtn = page.locator('div[class*="modalCard"]').getByRole('button', { name: /cancelar/i }).or(page.getByRole('button', { name: /cancelar/i })).first();
  if (await safeIsVisible(cancelBtn, 400)) {
    await cancelBtn.click({ timeout: 1500, force: true }).catch(() => {});
  } else {
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(200).catch(() => {});
}

export function getSupplierLocators(page) {
  return {
    razonSocialInput: page.locator('input[name="razonSocial"]'),
    nitInput: page.locator('input[name="nit"]'),
    contactoInput: page.locator('input[name="nombreContacto"]'),
    telefonoInput: page.locator('input[name="telefono"]'),
    emailInput: page.locator('input[name="email"]'),
    direccionInput: page.locator('input[name="direccion"]'),
    observacionesInput: page.locator('textarea[name="observaciones"]'),
    activoCheckbox: page.locator('input[name="activo"]'),
    submitBtn: page.locator('button[title*="Guardar Proveedor" i], button:has-text("Guardar Proveedor")').first().or(page.locator('button[class*="btnSubmit"]').first()),
    cancelBtn: page.locator('div[class*="modalCard"]').getByRole('button', { name: /cancelar/i }).or(page.getByRole('button', { name: /cancelar/i })).first(),
  };
}
