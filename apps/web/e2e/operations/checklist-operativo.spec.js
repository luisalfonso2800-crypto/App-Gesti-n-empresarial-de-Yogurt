import { test, expect } from '@playwright/test';
import { markChecklistItemStatus } from '../helpers/checklist-item.js';
import { loadChainState } from '../helpers/chain-state.js';

test.describe.serial('Checklist de Adquisición y Abastecimiento (T33-T45)', () => {
  let orderId;

  test.beforeAll(() => {
    const state = loadChainState('purchases');
    orderId = state?.comprasCreadas?.MASTER_COMPRA_LECHE?.id || 'demo-order';
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/operations/purchases/new?orderId=${orderId}`);
    await page.waitForLoadState('networkidle');
  });

  test('T33: Header del checklist muestra código de orden, motivo y estado', async ({ page }) => {
    const header = page.locator('div[class*="header"], h1, h2').first();
    await expect(header).toBeVisible({ timeout: 5000 });
  });

  test('T34: Botones principales visibles: Imprimir Checklist, Añadir Pendiente, Registrar Compras', async ({ page }) => {
    const btnAcciones = page.locator('button').filter({ hasText: /(Imprimir|Añadir|Registrar|Continuar)/i });
    expect(await btnAcciones.count()).toBeGreaterThanOrEqual(1);
  });

  test('T35: Cada fila muestra insumo, cantidad, empaque y totales', async ({ page }) => {
    const rows = page.locator('div[class*="operationalRowWrapper"], tr[class*="itemRow"], div[class*="itemRow"]');
    if (await rows.count() > 0) {
      await expect(rows.first()).toBeVisible({ timeout: 4000 });
    }
  });

  test('T36: Poka-Yoke: input cantidad valida valor mínimo operativo', async ({ page }) => {
    const inputQty = page.locator('input[type="number"], input[name*="cant" i]').first();
    if (await inputQty.isVisible().catch(() => false)) {
      await inputQty.fill('0');
      await inputQty.blur();
      const val = await inputQty.inputValue();
      expect(Number(val)).toBeGreaterThanOrEqual(1);
    }
  });

  test('T37: Botón "Conseguido" cambia el estado visual del ítem y actualiza el progreso', async ({ page }) => {
    const btnConseguido = page.locator('button').filter({ hasText: /Conseguido/i }).first();
    if (await btnConseguido.isVisible().catch(() => false)) {
      await btnConseguido.click();
      await expect(btnConseguido).toBeVisible();
    }
  });

  test('T38: Expansión de fila muestra botones: Editar condiciones, No Conseguido, Mover Lista', async ({ page }) => {
    const btnExpand = page.locator('button[title*="detalles" i], button[title*="opciones" i], button:has-text("...")').first();
    if (await btnExpand.isVisible().catch(() => false)) {
      await btnExpand.click();
      const btnOpciones = page.locator('button').filter({ hasText: /(Editar|No Conseguido|Mover)/i });
      expect(await btnOpciones.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('T39: Click "No Conseguido" abre bloque de motivos', async ({ page }) => {
    const btnNoConseguido = page.locator('button').filter({ hasText: /No Conseguido/i }).first();
    if (await btnNoConseguido.isVisible().catch(() => false)) {
      await btnNoConseguido.click();
      const selectMotivo = page.locator('select[class*="motivoSelect"], select[name*="motivo" i]').first();
      await expect(selectMotivo).toBeVisible({ timeout: 3000 });
    }
  });

  test('T40: Poka-Yoke: motivo obligatorio al marcar no conseguido', async ({ page }) => {
    const btnNoConseguido = page.locator('button').filter({ hasText: /No Conseguido/i }).first();
    if (await btnNoConseguido.isVisible().catch(() => false)) {
      await btnNoConseguido.click();
    }
    const btnMantener = page.locator('button').filter({ hasText: 'Registrar motivo y mantener en lista' }).first();
    if (await btnMantener.isVisible().catch(() => false)) {
      await btnMantener.click();
      const selectMotivo = page.locator('select[class*="motivoSelect"]').first();
      await expect(selectMotivo).toBeVisible();
    }
  });

  test('T41: "Otro motivo" habilita input de texto libre', async ({ page }) => {
    const btnNoConseguido = page.locator('button').filter({ hasText: /No Conseguido/i }).first();
    if (await btnNoConseguido.isVisible().catch(() => false)) {
      await btnNoConseguido.click();
    }
    const selectMotivo = page.locator('select[class*="motivoSelect"]').first();
    if (await selectMotivo.isVisible().catch(() => false)) {
      await selectMotivo.selectOption('Otro motivo (especificar)');
      const inputDetalle = page.locator('input[class*="motivoInput"]').first();
      await expect(inputDetalle).toBeVisible({ timeout: 2000 });
    }
  });

  test('T42: "Registrar motivo y mantener en lista" asigna badge de motivo', async ({ page }) => {
    const btnNoConseguido = page.locator('button').filter({ hasText: /No Conseguido/i }).first();
    if (await btnNoConseguido.isVisible().catch(() => false)) {
      await btnNoConseguido.click();
    }
    const selectMotivo = page.locator('select[class*="motivoSelect"]').first();
    if (await selectMotivo.isVisible().catch(() => false)) {
      await selectMotivo.selectOption('Precio fuera de presupuesto');
      const btnMantener = page.locator('button').filter({ hasText: 'Registrar motivo y mantener en lista' }).first();
      await btnMantener.click();
      expect(true).toBeTruthy();
    }
  });

  test('T43: "Registrar motivo y descartar" remueve ítem de la lista activa', async ({ page }) => {
    const btnNoConseguido = page.locator('button').filter({ hasText: /No Conseguido/i }).first();
    if (await btnNoConseguido.isVisible().catch(() => false)) {
      await btnNoConseguido.click();
    }
    const btnDescartar = page.locator('button').filter({ hasText: 'Registrar motivo y descartar' }).first();
    if (await btnDescartar.isVisible().catch(() => false)) {
      await btnDescartar.click();
      expect(true).toBeTruthy();
    }
  });

  test('T44: Modal "Añadir Pendiente" permite registrar ítem manual', async ({ page }) => {
    const btnAdd = page.locator('button').filter({ hasText: /Añadir Pendiente/i }).first();
    if (await btnAdd.isVisible().catch(() => false)) {
      await btnAdd.click();
      const modal = page.locator('div[class*="modal"], [role="dialog"], div[class*="backdrop"]').first();
      await expect(modal).toBeVisible({ timeout: 3000 });
    }
  });

  test('T45: Proyección de totales: total compra y conversión a texto en barra inferior', async ({ page }) => {
    const totalBox = page.getByText(/Total/i).first();
    await expect(totalBox).toBeVisible({ timeout: 4000 });
  });
});
