import { expect } from '@playwright/test';

/**
 * Controla el modo de fusión de órdenes de compra en /operations/purchases.
 * @param {import('@playwright/test').Page} page
 * @param {string[]} orderCodes - Arreglo con al menos 2 códigos o identificadores de orden
 */
export async function executeOrderMerge(page, orderCodes) {
  if (!orderCodes || orderCodes.length < 2) {
    throw new Error('La fusión requiere al menos 2 listas');
  }

  const btnInitMerge = page.locator('button:has-text("Fusionar Seleccionadas")');
  await btnInitMerge.waitFor({ state: 'visible', timeout: 3000 });
  await btnInitMerge.click();

  for (const code of orderCodes) {
    const card = page.locator('div[class*="orderCard"]').filter({ hasText: code }).first();
    await card.waitFor({ state: 'visible', timeout: 3000 });
    const checkbox = card.locator('input[type="checkbox"]');
    await checkbox.check();
  }

  const btnConfirmMerge = page.locator('button:has-text("Confirmar Fusión")');
  await expect(btnConfirmMerge).toBeVisible({ timeout: 3000 });
  await expect(btnConfirmMerge).toBeEnabled({ timeout: 3000 });
  await btnConfirmMerge.click();

  // Esperar confirmación de la fusión
  const modalConfirm = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar")');
  if (await modalConfirm.isVisible().catch(() => false)) {
    await modalConfirm.click();
  }
}
