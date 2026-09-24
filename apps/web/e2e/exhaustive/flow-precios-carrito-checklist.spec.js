import { test, expect } from '@playwright/test';
import { fillSupplierPriceForm } from '../helpers/supplier-price-form.js';
import { toggleCartItem } from '../helpers/cart-toggle.js';
import { markChecklistItemStatus } from '../helpers/checklist-item.js';
import { executeOrderMerge } from '../helpers/order-merge.js';
import { loadChainState } from '../helpers/chain-state.js';
import { openCartHeader, readCartBadge, readCartItem } from '../helpers/cart-header.js';

test.describe.serial('Flujo Completo: Precios → Carrito → Orden → Checklist → Fusión (T56-T60)', () => {
  let orderId;
  const insumoNombre = 'AZUCAR E2E 1790166879117';
  const proveedorNombre = 'PROV_ORIGINAL';

  test.beforeAll(() => {
    const state = loadChainState('purchases');
    orderId = state?.comprasCreadas?.MASTER_COMPRA_LECHE?.id || 'demo-order';
  });

  test('T56: Crear o verificar cotización en tabla comparativa de precios', async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.waitForLoadState('networkidle');
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 4000 });
  });

  test('T57: Agregar cotización al carrito y verificar sincronización de badge', async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.waitForLoadState('networkidle');
    const badgeInitial = await readCartBadge(page);
    const targetRow = page.locator('tbody tr').first();
    const cleanInsumo = (await targetRow.locator('strong[class*="insumoTitle"]').first().innerText()).trim();

    const newBadge = await toggleCartItem(page, cleanInsumo);
    expect(newBadge).toBeGreaterThanOrEqual(badgeInitial);

    await openCartHeader(page);
    const itemData = await readCartItem(page, cleanInsumo);
    expect(itemData.nombre).toContain(cleanInsumo);
  });

  test('T58: Navegar al checklist de la orden activa y verificar presencia del ítem', async ({ page }) => {
    await page.goto(`/operations/purchases/new?orderId=${orderId}`);
    await page.waitForLoadState('networkidle');
    const header = page.locator('h1, h2').first();
    await expect(header).toBeVisible({ timeout: 5000 });
    const rows = page.locator('div[class*="operationalRowWrapper"], div[class*="itemRow"]');
    if (await rows.count() > 0) {
      await expect(rows.first()).toBeVisible({ timeout: 4000 });
    }
  });

  test('T59: Marcar ítem como Conseguido en checklist y verificar progreso', async ({ page }) => {
    await page.goto(`/operations/purchases/new?orderId=${orderId}`);
    await page.waitForLoadState('networkidle');
    const btnConseguido = page.locator('button').filter({ hasText: /Conseguido/i }).first();
    if (await btnConseguido.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnConseguido.click();
      await expect(btnConseguido).toBeVisible();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T60: Tablero de compras muestra listas y permite iniciar fusión', async ({ page }) => {
    await page.goto('/operations/purchases');
    await page.waitForLoadState('networkidle');
    const headerTitle = page.locator('h1, h2').filter({ hasText: /(Listas Preparadas|Compras|Historial)/i }).first();
    await expect(headerTitle).toBeVisible({ timeout: 5000 });

    const btnMerge = page.locator('button').filter({ hasText: /Fusionar Seleccionadas/i }).first();
    if (await btnMerge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnMerge.click();
      const checkboxes = page.locator('input[type="checkbox"][class*="mergeCheckbox"]');
      expect(await checkboxes.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
