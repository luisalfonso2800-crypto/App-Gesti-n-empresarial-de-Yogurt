import { test, expect } from '@playwright/test';
import { saveChainState, loadChainState } from '../helpers/chain-state';

const WIP_TARGETS = [
  { nombre: 'CREMA DE LECHE', rendimiento: '5' },
  { nombre: 'JALEA DE FRUTOS ROJOS', rendimiento: '5' }
];

test.describe('Cadena Nivel 1: Siembra Definitiva de Bases WIP Restantes', () => {
  test('Formular deterministamente CREMA DE LECHE y JALEA DE FRUTOS ROJOS', async ({ page }) => {
    test.setTimeout(120000);
    const chainData = loadChainState('wip-recipes.chain') || {};
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');

    for (const item of WIP_TARGETS) {
      const targetBtn = page.locator('button').filter({
        hasText: /\+ Crear Receta/i
      }).and(page.locator(`button[title*="${item.nombre}"]`)).first();

      const btnVisible = await targetBtn.isVisible({ timeout: 2500 }).catch(() => false);
      if (!btnVisible) {
        chainData[item.nombre] = { status: 'ALREADY_FORMULATED_OR_ABSENT' };
        continue;
      }

      await targetBtn.click();
      await expect(page.locator('input[name="rendimientoBase"]')).toBeVisible({ timeout: 6000 });

      const rendInput = page.locator('input[name="rendimientoBase"]');
      await rendInput.fill(item.rendimiento);

      const unitSelect = page.locator('select[name="unidadRendimiento"]');
      if (await unitSelect.isVisible().catch(() => false)) {
        await unitSelect.selectOption({ index: 1 }).catch(() => {});
      }

      // Agregar etapa limpia
      const addStageBtn = page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).first();
      await expect(addStageBtn).toBeVisible({ timeout: 5000 });
      await addStageBtn.click();

      // Agregar fila de insumo a la etapa
      const addInsumoBtn = page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).first();
      await expect(addInsumoBtn).toBeVisible({ timeout: 5000 });
      await addInsumoBtn.click();

      // Seleccionar insumo en la fila BOM
      const bomTable = page.locator('table').filter({ hasText: /Ingrediente/i }).first();
      const itemSelect = bomTable.locator('select').first();
      await expect(itemSelect).toBeVisible({ timeout: 5000 });
      await itemSelect.selectOption({ index: 1 });

      // Llenar explícitamente el input numérico dentro de la celda de Cant. Requerida
      const qtyInput = bomTable.locator('tbody tr').first().locator('input[type="number"]').first();
      await expect(qtyInput).toBeVisible({ timeout: 5000 });
      await qtyInput.fill(item.rendimiento);

      // Finalizar y Resumir
      const finishBtn = page.locator('button').filter({ hasText: /Finalizar y Resumir/i });
      await expect(finishBtn).toBeVisible({ timeout: 6000 });
      await finishBtn.click();

      // Publicar receta
      const publishBtn = page.locator('button').filter({ hasText: /Publicar Receta|Guardar y Publicar/i });
      await expect(publishBtn).toBeVisible({ timeout: 6000 });
      await publishBtn.click();

      // Esperar que el modal cierre limpiamente
      await expect(page.locator('div[role="dialog"]')).toHaveCount(0, { timeout: 8000 });
      await page.waitForLoadState('networkidle').catch(() => {});

      // Aserción dura: la receta debe figurar en la tabla
      const tableRow = page.locator('table, tr').filter({ hasText: new RegExp(item.nombre, 'i') }).first();
      await expect(tableRow).toBeVisible({ timeout: 6000 });

      chainData[item.nombre] = { status: 'FORMULATED', timestamp: new Date().toISOString() };
    }

    saveChainState('wip-recipes.chain', chainData);
  });
});
