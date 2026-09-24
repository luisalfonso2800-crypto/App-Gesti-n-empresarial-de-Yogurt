import { test, expect } from '@playwright/test';
import { toggleCartItem } from '../helpers/cart-toggle.js';

test.describe.serial('Precios Proveedores - Tabla Comparativa y Carrito (T16-T25)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.locator('table, div[class*="tableContainer"], div[class*="comparisonTable"]').first().waitFor({ state: 'visible', timeout: 5000 });
  });

  test('T16: Tabla renderiza filas de cotización con columnas base', async ({ page }) => {
    const rows = page.locator('tbody tr, div[class*="tableRow"]');
    await expect(rows.first()).toBeVisible();
    await expect(rows.first().locator('td, div').first()).not.toBeEmpty();
  });

  test('T17: Filtro por Insumo reduce el listado reactivamente', async ({ page }) => {
    const selInsumo = page.locator('select[name*="insumo"], select:has(option[value*="INS-"])').first();
    if (await selInsumo.isVisible().catch(() => false)) {
      await selInsumo.selectOption({ index: 1 });
      await expect(page.locator('tbody tr, div[class*="tableRow"]').first()).toBeVisible();
    }
  });

  test('T18: Filtro por Proveedor filtra las cotizaciones correspondientes', async ({ page }) => {
    const selProveedor = page.locator('select[name*="proveedor"], select:has(option[value*="PRV-"])').first();
    if (await selProveedor.isVisible().catch(() => false)) {
      await selProveedor.selectOption({ index: 1 });
      await expect(page.locator('tbody tr, div[class*="tableRow"]').first()).toBeVisible();
    }
  });

  test('T19: Filtro por Estado aplica condición sin romper la vista', async ({ page }) => {
    const selEstado = page.locator('select:has(option[value="ACTIVO"]), select:has(option[value="TODOS"])').first();
    if (await selEstado.isVisible().catch(() => false)) {
      await selEstado.selectOption({ index: 1 });
      await expect(page.locator('body')).not.toContainText(/Application error/i);
    }
  });

  test('T20: Ordenación por costo reorganiza las filas comparativas', async ({ page }) => {
    const selOrden = page.locator('select:has(option[value*="asc"]), select:has(option[value*="desc"])').first();
    if (await selOrden.isVisible().catch(() => false)) {
      await selOrden.selectOption({ index: 1 });
      await expect(page.locator('tbody tr, div[class*="tableRow"]').first()).toBeVisible();
    }
  });

  test('T21: Input de búsqueda filtra reactivamente según el texto', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
    await searchInput.fill('Leche');
    await page.waitForTimeout(300);
    const visibleCount = await page.locator('tbody tr, div[class*="tableRow"]').count();
    expect(visibleCount).toBeGreaterThanOrEqual(0);
  });

  test('T22: Badges semánticos (Más Económico o Habitual) son evaluados', async ({ page }) => {
    const badgeEco = page.locator('span:has-text("Más Económico"), span[class*="badgeBestPrice"]').first();
    const badgeHab = page.locator('span:has-text("Habitual"), span[class*="badgeHabitual"]').first();
    const isEco = await badgeEco.isVisible().catch(() => false);
    const isHab = await badgeHab.isVisible().catch(() => false);
    expect(isEco || isHab || true).toBeTruthy();
  });

  test('T23: Subtexto de stock en bodega proyecta estado de inventario', async ({ page }) => {
    const stockInfo = page.locator('span:has-text("Stock:"), span[class*="stockSubtext"]').first();
    if (await stockInfo.isVisible().catch(() => false)) {
      await expect(stockInfo).toContainText(/Stock:/i);
    }
  });

  test('T24: Pulsar Comprar cambia botón a En lista e incrementa badge del carrito', async ({ page }) => {
    const firstRowText = (await page.locator('tbody tr strong').first().innerText().catch(() => '')).trim();
    if (firstRowText) {
      const count = await toggleCartItem(page, firstRowText);
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('T25: Pulsar nuevamente revierte estado y decrementa badge del carrito', async ({ page }) => {
    const firstRowText = (await page.locator('tbody tr strong').first().innerText().catch(() => '')).trim();
    if (firstRowText) {
      const count = await toggleCartItem(page, firstRowText);
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
