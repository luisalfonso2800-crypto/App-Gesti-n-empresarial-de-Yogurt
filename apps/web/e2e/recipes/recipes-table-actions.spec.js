import { test, expect } from '@playwright/test';

test.describe('E2E: Acciones de Tabla y Estados en Recetas (recipes-table-actions)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('R-TAB-01: El banner de huérfanos se encuentra en 0 productos pendientes (o colapsado)', async ({ page }) => {
    // Al estar todos los productos sembrados, el banner no debe contener tarjetas huérfanas activas
    const orphanCard = page.locator('div[class*="orphanCard"]').first();
    const isOrphanVisible = await orphanCard.isVisible({ timeout: 2000 }).catch(() => false);
    expect(isOrphanVisible).toBe(false);
  });

  test('R-TAB-02: La tabla lista las recetas activas con sus columnas estructuradas', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 6000 });

    const rows = table.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    const firstRow = rows.first();
    await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Nombre Receta
    await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Rendimiento
    await expect(firstRow.locator('td').nth(3)).toBeVisible(); // N° Etapas
    await expect(firstRow.locator('td').nth(4)).toBeVisible(); // Estado Badge
  });

  test('R-TAB-03: Clic en el botón "Ver BOM" abre el modal de visualización de fórmula', async ({ page }) => {
    const verBomBtn = page.locator('button').filter({ hasText: /Ver BOM/i }).first();
    await expect(verBomBtn).toBeVisible({ timeout: 6000 });
    await verBomBtn.click();

    // Valida que cargue el editor de receta técnica
    await expect(page.locator('h1').filter({ hasText: /Editar Receta Técnica|Nueva Receta/i })).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=BOM (Lista de Materiales y Fórmula de la Etapa)')).toBeVisible({ timeout: 6000 });
  });

  test('R-TAB-04: Clic en el botón "Cancelar" cierra el modal devolviendo el foco a la tabla', async ({ page }) => {
    const verBomBtn = page.locator('button').filter({ hasText: /Ver BOM/i }).first();
    await verBomBtn.click();
    await expect(page.locator('h1').filter({ hasText: /Editar Receta Técnica/i })).toBeVisible({ timeout: 6000 });

    // Cancelar la visualización
    const cancelBtn = page.locator('button').filter({ hasText: /Cancelar/i }).first();
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();

    // Confirmar en el modal RecipeExitConfirmModal ("Descartar y Salir")
    const discardBtn = page.locator('button').filter({ hasText: /Descartar y Salir/i }).first();
    await expect(discardBtn).toBeVisible({ timeout: 4000 });
    await discardBtn.click();

    // El editor se cierra y la tabla principal vuelve a ser visible
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });
  });

  test('R-TAB-05: Alternancia de estado (Desactivar / Activar) en una receta y validación de badge', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    const toggleBtn = firstRow.locator('button').filter({ hasText: /Desactivar|Activar/i }).first();
    await expect(toggleBtn).toBeVisible({ timeout: 6000 });

    const initialText = await toggleBtn.innerText();
    const isInitiallyActive = initialText.includes('Desactivar');

    // Alternar estado
    await toggleBtn.click();
    await page.waitForLoadState('networkidle').catch(() => {});

    // Validar cambio en botón
    const expectedIntermediate = isInitiallyActive ? /Activar/i : /Desactivar/i;
    await expect(firstRow.locator('button').filter({ hasText: expectedIntermediate })).toBeVisible({ timeout: 6000 });

    // Restaurar estado original para no dejar datos alterados
    const restoreBtn = firstRow.locator('button').filter({ hasText: expectedIntermediate }).first();
    await restoreBtn.click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await expect(firstRow.locator('button').filter({ hasText: new RegExp(initialText, 'i') })).toBeVisible({ timeout: 6000 });
  });
});
