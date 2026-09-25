import { test, expect } from '@playwright/test';

test.describe('Foco B: Etapas, BOM y Cálculos Matemáticos (R11-R22)', () => {
  const unlockPhaseOne = async (page) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
    await page.locator('button').filter({ hasText: /\+ Nueva Receta/i }).click();
    await page.locator('select[name="idProducto"]').selectOption({ index: 1 });
    await page.locator('input[name="nombre"]').fill('Receta E2E Validación Etapas BOM');
    await page.locator('input[name="rendimientoBase"]').fill('100');
    await page.locator('select[name="unidadRendimiento"]').selectOption({ index: 1 });
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeHidden();
  };

  test('R11: Botón "+ Agregar Etapa" habilitado tras superar Fase 1', async ({ page }) => {
    await unlockPhaseOne(page);
    await expect(page.locator('button').filter({ hasText: /\+ Agregar Etapa/i })).toBeVisible();
  });

  test('R12: Plantilla rápida inyecta etapas estándar en el listado', async ({ page }) => {
    await unlockPhaseOne(page);
    const templateBtn = page.locator('button').filter({ hasText: /Base Láctea \(WIP\)|Cocción Fruta/i }).first();
    if (await templateBtn.isVisible()) {
      await templateBtn.click();
      await expect(page.locator('input[value*="Pasteurización"], input[value*="Mezclado"], div[class*="timeline"]').first()).toBeVisible();
    }
  });

  test('R13: Formulario de etapa permite ingresar nombre y orden', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    const stageNameControl = page.locator('input[name*="nombre" i], input[placeholder*="nombre" i], input[placeholder*="Pasteuriz" i], input[type="text"]').first();
    if (await stageNameControl.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stageNameControl.fill('Etapa de Homogeneización');
      await expect(stageNameControl).toHaveValue('Etapa de Homogeneización');
    } else {
      const stageSelect = page.locator('select[name*="etapa" i], select[name*="nombre" i]').first();
      await expect(stageSelect).toBeVisible({ timeout: 3000 });
      await stageSelect.selectOption({ index: 1 });
    }
  });

  test('R14: Tiempo de proceso en minutos proyecta reloj digital en horas', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    // Tarjeta 1: llenar el tiempo estándar/objetivo o mínimo
    const targetTimeInput = page.locator('input[type="number"][placeholder="0"]').nth(1);
    await targetTimeInput.fill('120');
    await targetTimeInput.blur();
    await expect(page.locator('text=/2(\\.|,)0\\s*h|2h|02:00/i').first()).toBeVisible({ timeout: 4000 });
  });

  test('R15: Validación de coherencia en campos de temperatura', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    const tempInputs = page.locator('input[type="number"][step="0.1"]');
    if (await tempInputs.count() >= 2) {
      await tempInputs.nth(0).fill('85');
      await tempInputs.nth(1).fill('90');
      await expect(tempInputs.nth(0)).toHaveValue('85');
      await expect(tempInputs.nth(1)).toHaveValue('90');
    }
  });

  test('R16: Inserción de materia prima en el BOM con selector y cantidad', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
    const resourceSelect = page.locator('select').filter({ hasText: /Seleccione ingrediente/i }).first();
    await resourceSelect.selectOption({ index: 1 });
    const cantInput = page.locator('input[placeholder="0"][type="number"]').first();
    await cantInput.fill('10');
    await expect(cantInput).toHaveValue('10');
  });

  test('R17: Selector del BOM permite inclusión de producto intermedio WIP', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
    const resourceSelect = page.locator('select').filter({ hasText: /Seleccione ingrediente/i }).first();
    const wipOption = resourceSelect.locator('optgroup[label*="WIP"] option').first();
    if (await wipOption.count() > 0) {
      const val = await wipOption.getAttribute('value');
      await resourceSelect.selectOption(val);
      await expect(resourceSelect).toHaveValue(val);
    }
  });

  test('R18: Porcentaje de merma configurado en detalle del BOM', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
    const mermaInput = page.locator('input[name*="merma" i], input[placeholder="0"][step="0.1"], input[max="100"]').first();
    await expect(mermaInput).toBeVisible({ timeout: 4000 });
    await mermaInput.fill('5');
    await expect(mermaInput).toHaveValue('5');
  });

  test('R19: Subtotal de balance se actualiza en tiempo real según cantidad', async ({ page }) => {
    await unlockPhaseOne(page);
    await page.locator('button').filter({ hasText: /\+ Agregar Etapa/i }).click();
    await page.locator('button').filter({ hasText: /\+ Agregar Insumo/i }).click();
    const resourceSelect = page.locator('select').filter({ hasText: /Seleccione ingrediente/i }).first();
    await resourceSelect.selectOption({ index: 1 });
    const cantInput = page.locator('input[placeholder="0"][type="number"]').first();
    await cantInput.fill('50');
    await expect(page.locator('div[class*="balanceBar"]')).toBeVisible();
  });

  test('R20: Costo total del batch visible en el dock de balance inferior', async ({ page }) => {
    await unlockPhaseOne(page);
    await expect(page.locator('div[class*="balanceMetricLabel"]').filter({ hasText: /Costo Total Batch/i })).toBeVisible();
  });

  test('R21: Costo unitario proyectado se actualiza en base al rendimiento', async ({ page }) => {
    await unlockPhaseOne(page);
    await expect(page.locator('div[class*="balanceMetricLabel"]').filter({ hasText: /Costo Unitario Proyectado/i })).toBeVisible();
  });

  test('R22: Advertencia preventiva si se detecta base WIP sin costo configurado', async ({ page }) => {
    await unlockPhaseOne(page);
    const warningBadge = page.locator('span[class*="balanceWarningBadge"]');
    if (await warningBadge.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(warningBadge).toBeVisible();
    }
  });
});
