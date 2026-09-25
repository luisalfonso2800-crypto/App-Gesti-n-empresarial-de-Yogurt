import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow } from '../helpers/purchase-form.js';
import { fillRowItem } from '../helpers/purchase-helpers.js';
import { saveChainState, loadChainState } from '../helpers/chain-state.js';

const INSUMOS_CADENA = [
  { nombre: 'LECHE ENTERA', empaqueTipo: 'BOLSA / PAQUETE', contenidoNeto: '1', unidadMedida: 'L', cantidad: 100, precio: 3200, marca: 'COLANTA' },
  { nombre: 'AZÚCAR BLANCA', empaqueTipo: 'BULTO / SACO', contenidoNeto: '25', unidadMedida: 'kg', cantidad: 2, precio: 95000, marca: 'INCAUCA' },
  { nombre: 'CULTIVO YOGURT', empaqueTipo: 'SOBRE', contenidoNeto: '10', unidadMedida: 'g', cantidad: 5, precio: 15000, marca: 'CHRHANSEN' },
  { nombre: 'FRUTA FRESA', empaqueTipo: 'CANASTILLA', contenidoNeto: '10', unidadMedida: 'kg', cantidad: 3, precio: 45000, marca: 'AGROCAMPO' },
  { nombre: 'BOTELLAS 1L', empaqueTipo: 'PAQUETE', contenidoNeto: '50', unidadMedida: 'Unidades', cantidad: 4, precio: 30000, marca: 'PLASTIK' }
];

test.describe.serial('Compras - Abastecimiento Maestro para Recetas (Seed Chain)', () => {
  test('T00 - Abastecer Insumos Maestros con Idempotencia', async ({ page }) => {
    const existingPurchases = loadChainState('purchases');
    if (existingPurchases?.comprasCreadas?.MASTER_CHAIN_COMPRA?.id) {
      await page.goto('/operations/inventory');
      await page.waitForLoadState('networkidle');
      const tableRows = page.locator('table tbody tr');
      if (await tableRows.count() > 0) {
        console.log('[SEED-CHAIN] Stock detectado en inventario. Reutilizando compra maestra.');
        return;
      }
    }

    await goToPurchases(page);
    await openPurchaseForm(page);

    // Selección de Proveedor común para la orden maestra
    await addRow(page);
    const firstRow = page.locator('div[class*="formRowCard"]').first();
    const provInput = firstRow.locator('input[class*="provInput"]');
    await provInput.click();
    const provOption = firstRow.locator('div[class*="dropdownItem"]').filter({ hasNotText: /sin resultados/i }).first();

    if (await provOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await provOption.click();
    } else {
      const btnNuevo = page.locator('button:has-text("+ Nuevo Proveedor")').first();
      if (await btnNuevo.isVisible({ timeout: 2000 }).catch(() => false)) {
        await btnNuevo.click();
        const modal = page.locator('[role="dialog"], div[class*="modalCard"]').first();
        await modal.waitFor({ state: 'visible', timeout: 4000 });
        const ts = Date.now();
        await modal.locator('input[name="razonSocial"]').fill(`PROVEEDOR_E2E_CENTRAL_${ts}`);
        await modal.locator('input[name="nit"]').fill(`900${String(ts).slice(-6)}1`);
        await modal.locator('button:has-text("Guardar Proveedor")').click();
        await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await provInput.click();
        await provOption.click();
      }
    }

    // Diligenciar filas de insumos
    for (let i = 0; i < INSUMOS_CADENA.length; i++) {
      if (i > 0) await addRow(page);
      const item = INSUMOS_CADENA[i];
      // La UI inserta filas al inicio (prepend: índice 0)
      const currentRow = page.locator('div[class*="formRowCard"]').first();
      const insumoInput = currentRow.locator('input[class*="insumoInput"]');
      await insumoInput.click();
      const insumoOpt = currentRow.locator('div[class*="dropdownItem"]').filter({ hasNotText: /sin resultados/i }).first();
      if (await insumoOpt.isVisible({ timeout: 1500 }).catch(() => false)) {
        await insumoOpt.click();
      } else {
        await insumoInput.pressSequentially('a', { delay: 30 });
        await insumoOpt.click();
      }

      await fillRowItem(page, 0, {
        marca: item.marca,
        empaqueTipo: item.empaqueTipo,
        contenidoNeto: item.contenidoNeto,
        unidadMedida: item.unidadMedida,
        cantidad: item.cantidad,
        precio: item.precio,
        aplicaIva: false
      });
    }

    const responsePromise = page.waitForResponse(
      resp => resp.url().includes('/purchases') && resp.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => null);

    const saveBtn = page.getByRole('button', { name: /guardar y registrar compra|guardar compra/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click({ force: true });

    const response = await responsePromise;
    let purchaseId = null;
    if (response) {
      const body = await response.json().catch(() => ({}));
      purchaseId = body.id || body.data?.id || body.data?.idCompra || body.idCompra;
    }

    if (!purchaseId) {
      await page.waitForURL(url => url.pathname.includes('/operations/purchases'), { timeout: 6000 }).catch(() => {});
      const API_URL = process.env.API_URL || 'http://localhost:4000';
      const listRes = await page.request.get(`${API_URL}/api/v1/purchases`).catch(() => null);
      if (listRes?.ok()) {
        const data = await listRes.json().catch(() => ({}));
        const items = Array.isArray(data) ? data : (data.data || []);
        if (items.length > 0) purchaseId = items[0].id || items[0].idCompra;
      }
    }

    expect(purchaseId).toBeTruthy();

    saveChainState('purchases', {
      comprasCreadas: {
        MASTER_CHAIN_COMPRA: {
          id: purchaseId,
          totalInsumos: INSUMOS_CADENA.length,
          insumosAbastecidos: INSUMOS_CADENA.map(x => x.nombre),
          timestamp: new Date().toISOString()
        }
      }
    });
  });
});
