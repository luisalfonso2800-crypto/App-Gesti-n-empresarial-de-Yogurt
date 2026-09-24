import { expect } from '@playwright/test';

/**
 * Abre el dropdown del carrito global desde el header si no está abierto.
 * @param {import('@playwright/test').Page} page
 */
export async function openCartHeader(page) {
  const btnCart = page.locator('button[aria-label="Abrir carrito de compras"], button:has(span[class*="cartBadge"])').first();
  await btnCart.waitFor({ state: 'visible', timeout: 4000 });
  const dropdown = page.locator('div[class*="cartDropdown"], div[class*="cartFlyout"]').first();
  if (!(await dropdown.isVisible().catch(() => false))) {
    await btnCart.click();
    await expect(dropdown).toBeVisible({ timeout: 4000 });
  }
}

/**
 * Lee el valor numérico actual del badge del carrito del header.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
export async function readCartBadge(page) {
  const badge = page.locator('button[aria-label="Abrir carrito de compras"] span[class*="cartBadge"], span[class*="cartBadge"]').first();
  const text = await badge.innerText({ timeout: 3000 }).catch(() => '0');
  const count = parseInt(text.trim(), 10);
  return Number.isNaN(count) ? 0 : count;
}

/**
 * Cambia la lista activa del carrito por nombre desde el selector del header/dropdown.
 * @param {import('@playwright/test').Page} page
 * @param {string} listName
 */
export async function switchActiveList(page, listName) {
  await openCartHeader(page);
  const selectList = page.locator('select[name="activeList"], select[aria-label*="lista" i], select[class*="listSelector"]').first();
  if (await selectList.isVisible({ timeout: 2000 }).catch(() => false)) {
    await selectList.selectOption({ label: listName }).catch(async () => {
      await selectList.selectOption(listName);
    });
  } else {
    const listBtn = page.locator('button, div[role="button"]').filter({ hasText: listName }).first();
    await listBtn.click();
  }
}

/**
 * Verifica que un insumo aparezca en el dropdown del carrito con su subtotal.
 * @param {import('@playwright/test').Page} page
 * @param {string} itemName
 * @returns {Promise<{ nombre: string, subtotal: string }>}
 */
export async function readCartItem(page, itemName) {
  await openCartHeader(page);
  const itemRow = page.locator('li, div[role="listitem"], div[class*="item"]').filter({ hasText: itemName }).first();
  await expect(itemRow).toBeVisible({ timeout: 4000 });
  const rowText = await itemRow.innerText().catch(() => '');
  return {
    nombre: itemName,
    subtotal: rowText.trim()
  };
}

/**
 * Verifica si existe una advertencia de duplicado en el carrito.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function hasDuplicateWarning(page) {
  await openCartHeader(page);
  const warning = page.locator('div[class*="warning"], span[class*="duplicate"], div[class*="duplicateAlert"]').filter({
    hasText: /(duplicad|ya está en la lista|repetid)/i
  }).first();
  return warning.isVisible({ timeout: 1500 }).catch(() => false);
}
