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
  const closeSelectors = [
    'button:has-text("Cancelar")',
    'button[aria-label="Cerrar modal"]',
    'button[aria-label="Cerrar"]',
    'button:has-text("✕")',
    'button:has-text("Cerrar")',
  ];
  for (const sel of closeSelectors) {
    const loc = page.locator(sel).first();
    const visible = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!visible) continue;
    const enabled = await loc.isEnabled({ timeout: 500 }).catch(() => false);
    if (!enabled) continue;
    try {
      await loc.click({ timeout: 4000 });
      await page.waitForTimeout(400);
      return;
    } catch { /* Sigue intentando */ }
  }
  await page.waitForTimeout(400);
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
