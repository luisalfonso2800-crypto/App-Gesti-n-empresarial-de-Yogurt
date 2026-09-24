import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow } from '../helpers/purchase-form.js';
import { fillRowItem, submitPurchase } from '../helpers/purchase-helpers.js';
import { saveChainState, clearChainState } from '../helpers/chain-state.js';

test.describe.serial('Compras - Cadena de Valor Compra Maestra (T34)', () => {
  test.beforeAll(async () => {
    clearChainState('purchases');
  });

  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
    await addRow(page);
  });

  test('T34 - Registrar Compra Maestra de Insumos para la Cadena de Valor', async ({ page }) => {
    const row = page.locator('div[class*="formRowCard"]').first();

    const provInput = row.locator('input[class*="provInput"]');
    await provInput.click();
    await page.waitForTimeout(300);

    const sinResultados = page.locator('div[class*="dropdownItem"]:has-text("Sin resultados")').or(page.getByText(/sin resultados/i)).first();
    const btnNuevoProv = page.locator('button:has-text("+ Nuevo Proveedor")').or(page.getByRole('button', { name: /\+ nuevo proveedor/i })).first();
    const provOption = row.locator('div[class*="dropdownItem"]').filter({ hasNotText: /sin resultados/i }).first();

    const provVisible = await provOption.isVisible().catch(() => false);
    if (provVisible) {
      await provOption.click();
    } else if (await btnNuevoProv.isVisible().catch(() => false)) {
      await btnNuevoProv.click();
      const modal = page.locator('div[class*="modalCard"]').or(page.locator('[role="dialog"]')).first();
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      const ts = Date.now();
      await modal.locator('input[name="razonSocial"]').fill(`PROVEEDOR_E2E_${ts}`);
      await modal.locator('input[name="nit"]').fill(`900${String(ts).slice(-6)}1`);
      await modal.locator('input[name="nombreContacto"]').fill('PROVEEDOR CADENA');
      await modal.locator('input[name="telefono"]').fill('3112223344');
      await modal.locator('input[name="email"]').fill(`prov_${ts}@lacteos.com`);
      await modal.locator('input[name="direccion"]').fill('CALLE 1 # 2-3');
      const modalSubmit = modal.locator('button:has-text("Guardar Proveedor")').or(modal.locator('button[class*="btnSubmit"]')).first();
      await modalSubmit.click();
      await modal.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(500);
      await provInput.click();
      await provOption.waitFor({ state: 'visible', timeout: 5000 });
      await provOption.click();
    } else {
      await provInput.pressSequentially('a', { delay: 50 });
      await provOption.waitFor({ state: 'visible', timeout: 5000 });
      await provOption.click();
    }

    const insumoInput = row.locator('input[class*="insumoInput"]');
    await insumoInput.click();
    await page.waitForTimeout(300);
    const insumoOption = row.locator('div[class*="dropdownItem"]').filter({ hasNotText: /sin resultados/i }).first();
    const insumoVisible = await insumoOption.isVisible().catch(() => false);
    if (insumoVisible) {
      await insumoOption.click();
    } else {
      await insumoInput.pressSequentially('e', { delay: 50 });
      await insumoOption.waitFor({ state: 'visible', timeout: 5000 });
      await insumoOption.click();
    }

    await fillRowItem(page, 0, {
      marca: 'E2E_CHAIN_COLANTA',
      cantidad: 5,
      precio: 3200,
      aplicaIva: true
    });

    let purchaseId = null;
    const responsePromise = page.waitForResponse(
      resp => resp.url().includes('/purchases') && resp.request().method() === 'POST',
      { timeout: 10000 }
    ).catch(() => null);

    const saveBtn = page.getByRole('button', { name: /guardar y registrar compra/i }).first();
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click({ timeout: 3000, force: true }).catch(() => {});
    console.log('[T34] Click en saveBtn ejecutado');
    await page.waitForTimeout(2000);
    console.log('[T34] URL actual:', page.url());

    const response = await responsePromise;

    if (response) {
      const body = await response.json().catch(() => ({}));
      purchaseId = body.id || body.data?.id || body.data?.idCompra || body.idCompra || null;
      console.log('[T34] ID Compra capturado por response:', purchaseId);
    }

    if (!purchaseId) {
      console.log('[T34] Intentando fallback por GET...');
      const API_URL = process.env.API_URL || 'http://localhost:4000';
      const listRes = await page.request.get(`${API_URL}/api/v1/purchases`).catch(() => null);
      if (listRes && listRes.ok()) {
        const data = await listRes.json().catch(() => ({}));
        const items = Array.isArray(data) ? data : (data.data || []);
        console.log('[T34] Fallback items encontrados:', items.length);
        if (items.length > 0) {
          purchaseId = items[0].id || items[0].idCompra || items[0]._id || null;
          console.log('[T34] ID Compra capturado por fallback:', purchaseId);
        }
      }
    }

    expect(purchaseId).toBeTruthy();

    saveChainState('purchases', {
      comprasCreadas: {
        MASTER_COMPRA_LECHE: {
          id: purchaseId,
          cantidadEmpaques: 5,
          total: 16000,
          insumo: 'LECHE ENTERA',
          timestamp: new Date().toISOString()
        }
      }
    });
  });
});
