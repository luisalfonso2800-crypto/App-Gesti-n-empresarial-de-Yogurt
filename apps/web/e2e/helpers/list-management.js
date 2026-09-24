import { expect } from '@playwright/test';

/**
 * Crea una nueva lista de compras nombrada desde la interfaz operativa.
 * @param {import('@playwright/test').Page} page
 * @param {string} listName
 */
export async function createNamedList(page, listName) {
  const btnNewList = page.locator('button').filter({ hasText: /(Nueva Lista|\+ Lista|Crear Lista)/i }).first();
  await btnNewList.waitFor({ state: 'visible', timeout: 4000 });
  await btnNewList.click();

  const inputName = page.locator('input[placeholder*="Nombre de lista" i], input[name="listName"]').first();
  await expect(inputName).toBeVisible({ timeout: 3000 });
  await inputName.fill(listName);

  const btnConfirm = page.locator('button').filter({ hasText: /(Guardar|Crear|Aceptar)/i }).first();
  await btnConfirm.click();
  await expect(inputName).not.toBeVisible({ timeout: 4000 });
}

/**
 * Renombra una lista de compras existente.
 * @param {import('@playwright/test').Page} page
 * @param {string} oldName
 * @param {string} newName
 */
export async function renameList(page, oldName, newName) {
  const listCard = page.locator('div[class*="listCard"], tr').filter({ hasText: oldName }).first();
  await listCard.waitFor({ state: 'visible', timeout: 4000 });

  const btnEdit = listCard.locator('button[title*="Editar" i], button[aria-label*="Renombrar" i], button:has-text("Renombrar")').first();
  await btnEdit.click();

  const inputName = page.locator('input[name="listName"], input[value*="' + oldName + '"]').first();
  await expect(inputName).toBeVisible({ timeout: 3000 });
  await inputName.fill(newName);

  const btnSave = page.locator('button').filter({ hasText: /(Guardar|Actualizar)/i }).first();
  await btnSave.click();
  await expect(inputName).not.toBeVisible({ timeout: 4000 });
}

/**
 * Elimina una lista de compras por su nombre.
 * @param {import('@playwright/test').Page} page
 * @param {string} listName
 */
export async function deleteList(page, listName) {
  const listCard = page.locator('div[class*="listCard"], tr').filter({ hasText: listName }).first();
  await listCard.waitFor({ state: 'visible', timeout: 4000 });

  const btnDelete = listCard.locator('button[title*="Eliminar" i], button[aria-label*="Eliminar" i], button:has-text("Eliminar")').first();
  await btnDelete.click();

  const btnConfirmModal = page.locator('button').filter({ hasText: /(Confirmar|Eliminar definitivamente|Aceptar)/i }).first();
  if (await btnConfirmModal.isVisible({ timeout: 2500 }).catch(() => false)) {
    await btnConfirmModal.click();
  }

  await expect(page.locator('div[class*="listCard"], tr').filter({ hasText: listName })).toHaveCount(0, { timeout: 4000 });
}
