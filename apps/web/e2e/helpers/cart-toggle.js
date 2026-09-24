/**
 * Gestiona la adición/remoción de insumos desde la tabla comparativa hacia el carrito y retorna el contador.
 * @param {import('@playwright/test').Page} page
 * @param {string} insumoNombre
 * @returns {Promise<number>} Nuevo valor entero del badge del carrito
 */
export async function toggleCartItem(page, insumoNombre) {
  const row = page.locator('tr').filter({ hasText: insumoNombre }).first();
  await row.waitFor({ state: 'visible', timeout: 4000 });

  const badge = page.locator('button[aria-label="Abrir carrito de compras"] span[class*="cartBadge"]');
  const initialText = await badge.innerText().catch(() => '0');
  const initialCount = parseInt(initialText, 10) || 0;

  const btnCart = row.locator('button').filter({ hasText: /(Comprar|En lista|Quitar)/i })
    .or(row.locator('button[title*="orden"], button[title*="lista"]'))
    .first();
  await btnCart.waitFor({ state: 'visible', timeout: 4000 });
  const previousText = (await btnCart.innerText().catch(() => '')).trim();

  await btnCart.click();

  // Esperar cambio de estado textual del botón
  await page.waitForFunction(
    ({ rowLocator, prev }) => {
      const btn = document.querySelector(rowLocator)?.querySelector('button');
      return btn && btn.textContent && !btn.textContent.includes(prev);
    },
    { rowLocator: `tr:has-text("${insumoNombre}")`, prev: previousText },
    { timeout: 3000 }
  ).catch(() => {});

  const newText = await badge.innerText().catch(() => '0');
  return parseInt(newText, 10) || (previousText.includes('Comprar') ? initialCount + 1 : Math.max(0, initialCount - 1));
}
