/**
 * @file exhaustive-helpers.js
 * @description Helpers compartidos para suites E2E del flujo exhaustivo.
 */
export async function tryClick(page, ...selectors) {
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    const visible = await loc.isVisible({ timeout: 2000 }).catch(() => false);
    if (!visible) continue;
    const enabled = await loc.isEnabled({ timeout: 1000 }).catch(() => false);
    if (!enabled) continue;
    try {
      await loc.click({ timeout: 5000 });
      return true;
    } catch {
      // Elemento bloqueado por overlay u otro motivo
    }
  }
  return false;
}

export async function closeModal(page) {
  try {
    const modalHeading = page.getByRole('heading', { name: /nuevo insumo/i });
    const isOpen = await modalHeading.isVisible({ timeout: 500 }).catch(() => false);
    if (!isOpen) return;

    const closeBtn = page.getByRole('button', { name: /(cancelar|cerrar)/i })
      .or(page.locator('button[aria-label*="cerrar"], button[class*="close"]'))
      .first();

    if (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await closeBtn.click({ timeout: 1000, force: true }).catch(() => {});
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
  } catch {
    // Ignorar errores si el modal ya cerró
  }
  await page.waitForTimeout(150).catch(() => {});
}

export async function waitForLoad(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
}

export async function clickInsideDrawer(page, selector) {
  const drawerPanel = page.locator('[class*="drawerPanel"], [class*="drawer-panel"], [class*="DrawerPanel"]').first();
  const panelVisible = await drawerPanel.isVisible({ timeout: 3000 }).catch(() => false);
  if (panelVisible) {
    const btn = drawerPanel.locator(selector).first();
    const visible = await btn.isVisible({ timeout: 2000 }).catch(() => false);
    if (visible) {
      try {
        await btn.click({ timeout: 5000 });
        return true;
      } catch { /* Fallback force */ }
      try {
        await btn.click({ force: true, timeout: 3000 });
        return true;
      } catch { /* No se pudo */ }
    }
  }
  return false;
}
