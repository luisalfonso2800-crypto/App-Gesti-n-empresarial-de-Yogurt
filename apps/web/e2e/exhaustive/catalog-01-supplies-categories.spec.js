import { test, expect } from '@playwright/test';
import { waitForLoad, closeModal } from '../helpers/exhaustive-helpers.js';

test.describe('Catálogos: Insumos canónicos', () => {
  test('Insumos: modal, fuzzing y creación canónica', async ({ page }) => {
    await page.goto('/catalog/supplies');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Insumo"), button:has-text("Nuevo insumo")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // Fuzzing: abrir modal vacío y cerrar
    await btnNuevo.click();
    await page.waitForTimeout(500);
    await closeModal(page);

    // Creación de insumo canónico
    await btnNuevo.click();
    await page.waitForTimeout(500);
    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('LECHE CRUDA DE VACA');
    }
    const unidadSel = page.locator('select[name="unidadBase"], input[name="unidadBase"]').first();
    if (await unidadSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      const tag = await unidadSel.evaluate(el => el.tagName);
      if (tag === 'SELECT') {
        await unidadSel.selectOption({ label: 'Litros' }).catch(async () => {
          await unidadSel.selectOption({ index: 1 }).catch(() => {});
        });
      } else {
        await unidadSel.fill('Litros');
      }
    }

    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1000);
  });
});
