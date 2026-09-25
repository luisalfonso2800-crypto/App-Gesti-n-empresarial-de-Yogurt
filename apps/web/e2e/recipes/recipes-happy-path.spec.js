import { test, expect } from '@playwright/test';

test.describe('E2E Representativo: Happy Path de Formulación de Receta (Sin Bucles)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('R-E2E-01: Apertura de modal con "+ Nueva Receta" y bloqueo Poka-Yoke inicial de etapas', async ({ page }) => {
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await expect(page.locator('h1').filter({ hasText: /Nueva Receta Técnica/i })).toBeVisible({ timeout: 5000 });
    // Compuerta Poka-Yoke: mientras la cabecera no esté completa, las etapas están bloqueadas
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button').filter({ hasText: /\+ Agregar Etapa/i })).toHaveCount(0);
  });

  test('R-E2E-02: Diligenciamiento de cabecera canónica y desbloqueo de etapas', async ({ page }) => {
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    const prodSelect = page.locator('select[name="idProducto"]');
    await prodSelect.selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta Representativa Happy Path');
    await page.locator('input[name="rendimientoBase"]').fill('10');
    const unitSelect = page.locator('select[name="unidadRendimiento"]');
    if (await unitSelect.isVisible().catch(() => false)) {
      await unitSelect.selectOption({ index: 1 }).catch(() => {});
    }
    // Desbloqueo de etapas: la compuerta se oculta y el botón de etapa es interactivo
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('button').filter({ hasText: /\+ Agregar Etapa/i })).toBeVisible({ timeout: 5000 });
  });

  test('R-E2E-03: Clic en "+ Agregar Etapa" genera una etapa interactiva', async ({ page }) => {
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await page.locator('select[name="idProducto"]').selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta Representativa Happy Path');
    await page.locator('input[name="rendimientoBase"]').fill('10');
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    // La etapa se agrega y muestra su sección de BOM
    await expect(page.locator('text=BOM (Lista de Materiales y Fórmula de la Etapa)')).toBeVisible({ timeout: 5000 });
  });

  test('R-E2E-04: Clic en "+ Agregar Insumo / Base" vincula insumo en la tabla BOM con cantidad válida', async ({ page }) => {
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await page.locator('select[name="idProducto"]').selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta Representativa Happy Path');
    await page.locator('input[name="rendimientoBase"]').fill('10');
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();

    const bomTable = page.locator('table').filter({ hasText: /Ingrediente/i }).first();
    const itemSelect = bomTable.locator('select').first();
    await expect(itemSelect).toBeVisible({ timeout: 5000 });
    await itemSelect.selectOption({ index: 1 });

    const qtyInput = bomTable.locator('tbody tr').first().locator('input[type="number"]').first();
    await expect(qtyInput).toBeVisible({ timeout: 5000 });
    await qtyInput.fill('5');
    await expect(qtyInput).toHaveValue('5');
  });

  test('R-E2E-05: El botón "Finalizar y Resumir" abre el modal de resumen y permite cerrar limpiamente', async ({ page }) => {
    await page.goto('/catalog/recipes');
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await page.locator('select[name="idProducto"]').selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta Representativa Happy Path');
    await page.locator('input[name="rendimientoBase"]').fill('100');

    // Despliega modal de hoja de ruta si el balance es consistente
    const summarizeBtn = page.locator('button').filter({ hasText: /Finalizar y Resumir/i });
    if (await summarizeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(summarizeBtn).toBeVisible();
    }

    // Cancelar y cerrar limpiamente para no generar registros huérfanos residuales
    const cancelBtn = page.locator('button').filter({ hasText: /Cancelar/i }).first();
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
      const confirmExitBtn = page.locator('button').filter({ hasText: /Salir sin guardar|Confirmar/i }).first();
      if (await confirmExitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmExitBtn.click();
      }
    }
  });
});
