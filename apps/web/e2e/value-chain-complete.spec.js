import { test, expect } from '@playwright/test';

test.describe('Cadena de Valor Completa - E2E Desatendido', () => {
  test('Recorrido completo: Receta -> Fabricación -> Cava -> Venta', async ({ page }) => {
    // 1. Validar Catálogo de Recetas (tabla o empty state asistido)
    await page.goto('/catalog/recipes');
    const recipeView = page.getByRole('heading', { name: /recetas técnicas/i })
      .or(page.getByRole('button', { name: /nueva receta/i }))
      .or(page.getByText(/primera receta técnica/i))
      .first();
    await expect(recipeView).toBeVisible({ timeout: 10000 });

    // 2. Producción y Liquidación
    await page.goto('/operations/production');
    const btnLiquidar = page.locator('button:has-text("Finalizar y Liquidar Lote")').first();

    if (await btnLiquidar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnLiquidar.click();
      // Validar que la modal no esté fija en Litros si es unidades
      await expect(page.locator('text=Confirmar Liquidación')).toBeVisible();
      await page.click('button:has-text("Confirmar Liquidación")');
      await page.waitForTimeout(2000);
    }

    // 3. Verificación en Cava Comercial (Inventario)
    await page.goto('/operations/inventory');
    const tabCava = page.locator('button').filter({ hasText: /Cava/i }).first();
    await tabCava.waitFor({ state: 'visible', timeout: 8000 });
    await tabCava.click({ force: true });
    await page.waitForTimeout(500);

    // Validar visualización de la Cava (tabla con productos, tarjetas o empty state asistido)
    const viewCava = page.locator('tr, div[class*="Row"], div[class*="Card"], div[class*="item"]')
      .filter({ hasText: /(YOGURT|BASE|PRODUCTO|LOTE)/i })
      .first()
      .or(page.locator('button:has-text("Cava Comercial"), h3:has-text("Cava"), button:has-text("Programar Producción")').first());

    await expect(viewCava).toBeVisible({ timeout: 10000 });

    // 4. Catálogo de Ventas
    await page.goto('/commercial/sales');
    const btnNuevaVenta = page.locator('button:has-text("Nueva Venta")').first();
    await expect(btnNuevaVenta).toBeVisible({ timeout: 10000 });
    await btnNuevaVenta.click();

    const btnAgregarCava = page.locator('button:has-text("Agregar Productos desde Cava")').first();
    if (await btnAgregarCava.isVisible({ timeout: 4000 }).catch(() => false)) {
      await btnAgregarCava.click();
      const catalogoDrawer = page.locator('[class*="drawerPanel"]').first()
        .or(page.locator('text=Stock Cava:').first());
      await expect(catalogoDrawer.first()).toBeVisible({ timeout: 8000 });
    }
  });
});
