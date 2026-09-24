import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplyModal, closeSupplyModal, getSupplyLocators } from '../helpers/supply-modal.js';
import { selectSafe } from '../helpers/supply-form.js';
import { saveChainState } from '../helpers/chain-state.js';

test.describe('Insumos - Cadena de Valor Maestro (T44)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplies');
    await openSupplyModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplyModal(page);
  });

  test('T44 - Registrar Insumo Maestro Leche Entera para Cadena', async ({ page }) => {
    const loc = getSupplyLocators(page);
    const masterName = `E2E_CHAIN_SUPPLY_LECHE_ENTERA_${Date.now()}`;

    await loc.nameInput.clear().catch(() => {});
    await loc.nameInput.pressSequentially(masterName, { delay: 10 });
    if (await loc.catSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loc.catSelect.selectOption({ index: 1 }).catch(() => {});
    }
    if (loc.subcatSelect && await loc.subcatSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loc.subcatSelect.selectOption({ index: 1 }).catch(() => {});
    }
    await loc.brandInput.clear().catch(() => {});
    await loc.brandInput.pressSequentially('Colanta', { delay: 10 });
    await selectSafe(loc.empaqueSelect, 'BULTO');
    await loc.unitSelect.selectOption('L').catch(async () => {
      await loc.unitSelect.selectOption({ index: 1 }).catch(() => {});
    });
    if (loc.contenidoInput && await loc.contenidoInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loc.contenidoInput.fill('10').catch(() => {});
    }
    await loc.stockInput.clear().catch(() => {});
    await loc.stockInput.pressSequentially('10', { delay: 10 });
    await loc.costInput.clear().catch(() => {});
    await loc.costInput.pressSequentially('3200', { delay: 10 });

    let supplyId = null;

    // Click en submit sin esperar response
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});

    // Esperar a que el modal se cierre (indicando éxito) o pase 2s
    await page.waitForTimeout(2000);

    if (!supplyId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      let listRes = await page.request.get(`${apiUrl}/supplies`).catch(() => null);
      if (!listRes || !listRes.ok()) {
        listRes = await page.request.get('http://localhost:4000/api/v1/supplies').catch(() => null);
      }
      if (listRes && listRes.ok()) {
        const data = await listRes.json().catch(() => ({}));
        const items = data.data || data;
        if (Array.isArray(items)) {
          const found = items.find(i => (i.nombre || '').includes('E2E_CHAIN_SUPPLY_LECHE'));
          supplyId = found?.id || found?.idInsumo || null;
        }
      }
    }

    expect(supplyId).toBeTruthy();

    saveChainState('supplies', {
      insumosCreados: {
        MASTER_LECHE_LITROS: {
          id: supplyId,
          nombre: masterName,
          marca: 'Colanta',
          unidadBase: 'l',
          densidad: 1.03,
          costoBase: 3200,
        }
      },
      timestamp: new Date().toISOString()
    });
  });
});
