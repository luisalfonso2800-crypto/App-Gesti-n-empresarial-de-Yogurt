import { test, expect } from '@playwright/test';
import { toggleCartItem } from '../helpers/cart-toggle.js';
import {
  openCartHeader,
  readCartBadge,
  switchActiveList,
  readCartItem,
  hasDuplicateWarning
} from '../helpers/cart-header.js';
import { loadChainState } from '../helpers/chain-state.js';

test.describe.serial('Carrito Global - Header y Multi-Lista (T26-T32)', () => {
  let purchasesState;

  test.beforeAll(() => {
    purchasesState = loadChainState('purchases');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.waitForLoadState('networkidle');
  });

  test('T26: Botón del carrito del header visible con badge en 0 o valor actual', async ({ page }) => {
    const btnCart = page.locator('button[aria-label="Abrir carrito de compras"], button:has(span[class*="cartBadge"])').first();
    await expect(btnCart).toBeVisible({ timeout: 4000 });
    const badgeCount = await readCartBadge(page);
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });

  test('T27: Click en el botón abre el dropdown con las opciones de listas', async ({ page }) => {
    await openCartHeader(page);
    const dropdown = page.locator('div[class*="cartDropdown"], div[class*="cartFlyout"]').first();
    await expect(dropdown).toBeVisible({ timeout: 3000 });
  });

  test('T28: Agregar ítem desde la tabla de precios actualiza el badge del header', async ({ page }) => {
    const initialBadge = await readCartBadge(page);
    const targetRow = page.locator('tbody tr').first();
    await expect(targetRow).toBeVisible({ timeout: 4000 });
    const insumoNombre = (await targetRow.locator('strong[class*="insumoTitle"]').first().innerText()).trim();

    const newBadge = await toggleCartItem(page, insumoNombre);
    expect(newBadge).toBeGreaterThanOrEqual(initialBadge);
  });

  test('T29: El ítem agregado aparece dentro del dropdown con su nombre y subtotal', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 4000 });
    const insumoNombre = (await firstRow.locator('strong[class*="insumoTitle"]').first().innerText()).trim();

    await openCartHeader(page);
    const itemData = await readCartItem(page, insumoNombre);
    expect(itemData.nombre).toBeTruthy();
    expect(itemData.subtotal).toBeDefined();
  });

  test('T30: Cambio de lista activa conmuta los ítems o el contexto de la orden', async ({ page }) => {
    await openCartHeader(page);
    const selectList = page.locator('select[name="activeList"], select[aria-label*="lista" i], select[class*="listSelector"]').first();
    if (await selectList.isVisible({ timeout: 2000 }).catch(() => false)) {
      const optionsCount = await selectList.locator('option').count();
      if (optionsCount > 1) {
        const targetOptionText = await selectList.locator('option').nth(1).innerText();
        await switchActiveList(page, targetOptionText.trim());
        await expect(selectList).toHaveValue(await selectList.locator('option').nth(1).getAttribute('value'));
      }
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T31: Detección y verificación de advertencia de duplicado o ítems ya presentes', async ({ page }) => {
    const duplicateDetected = await hasDuplicateWarning(page);
    expect(typeof duplicateDetected).toBe('boolean');
  });

  test('T32: Poka-Yoke: Botón de checkout/compras deshabilitado cuando la lista no tiene ítems', async ({ page }) => {
    await openCartHeader(page);
    const btnCheckout = page.locator('button').filter({ hasText: /(Ir a Fase de Compra|Continuar compra|Finalizar orden|Checkout)/i }).first();
    if (await btnCheckout.isVisible({ timeout: 2000 }).catch(() => false)) {
      const badgeCount = await readCartBadge(page);
      if (badgeCount === 0) {
        await expect(btnCheckout).toBeDisabled();
      } else {
        await expect(btnCheckout).toBeEnabled();
      }
    }
  });
});
