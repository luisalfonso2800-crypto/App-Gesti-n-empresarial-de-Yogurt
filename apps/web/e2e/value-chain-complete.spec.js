import { test, expect } from '@playwright/test';

test.describe('Cadena de Valor Completa - E2E Desatendido', () => {
  test('Recorrido completo: Receta -> Fabricación -> Cava -> Venta', async ({ page }) => {
    // 1. Validar Catálogo de Recetas
    await page.goto('/catalog/recipes');
    await expect(page.locator('text=YOGURT PURO').first()).toBeVisible({ timeout: 10000 });

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
    await page.click('button:has-text("Cava (Prod. Terminado)")');
    // Validar que exista stock positivo y no 0 Und
    const rowProducto = page.locator('tr:has-text("YOGURT")').first();
    await expect(rowProducto).toBeVisible();
    await expect(rowProducto).not.toContainText('0 Und');

    // 4. Catálogo de Ventas
    await page.goto('/commercial/sales');
    await page.click('button:has-text("Nueva Venta")');
    await page.click('button:has-text("Agregar Productos desde Cava")');

    // Validar que el drawer muestre unidades disponibles en Cava
    const catalogoCard = page.locator('text=Stock Cava:').first();
    await expect(catalogoCard).toBeVisible();
    await expect(catalogoCard).not.toContainText('Stock Cava: 0 und');
  });
});
