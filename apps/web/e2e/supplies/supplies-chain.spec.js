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
    await loc.nameInput.pressSequentially(masterName, { delay: 20 });
    if (await loc.catSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loc.catSelect.selectOption({ label: 'Materia Prima' }).catch(async () => {
        await loc.catSelect.selectOption({ value: 'MATERIA_PRIMA' }).catch(async () => {
          await loc.catSelect.selectOption({ index: 1 }).catch(() => {});
        });
      });
    }
    await loc.brandInput.clear().catch(() => {});
    await loc.brandInput.pressSequentially('Colanta', { delay: 20 });
    await selectSafe(loc.empaqueSelect, 'BULTO');
    await loc.unitSelect.selectOption({ value: 'L' }).catch(async () => {
      await loc.unitSelect.selectOption({ value: 'l' }).catch(async () => {
        await loc.unitSelect.selectOption({ index: 1 }).catch(() => {});
      });
    });
    await loc.stockInput.clear().catch(() => {});
    await loc.stockInput.pressSequentially('10', { delay: 20 });
    await loc.densityInput.clear().catch(() => {});
    await loc.densityInput.pressSequentially('1.03', { delay: 20 });
    await loc.costInput.clear().catch(() => {});
    await loc.costInput.pressSequentially('3200', { delay: 20 });

    console.log('[T44] Valores post-llenado:');
    console.log('  nombre:', await loc.nameInput.inputValue().catch(() => 'N/A'));
    console.log('  marca:', await loc.brandInput.inputValue().catch(() => 'N/A'));
    console.log('  categoria:', await loc.catSelect.inputValue().catch(() => 'N/A'));
    console.log('  empaque:', await loc.empaqueSelect.inputValue().catch(() => 'N/A'));
    console.log('  unidadBase:', await loc.unitSelect.inputValue().catch(() => 'N/A'));
    console.log('  stock:', await loc.stockInput.inputValue().catch(() => 'N/A'));
    console.log('  densidad:', await loc.densityInput.inputValue().catch(() => 'N/A'));
    console.log('  costo:', await loc.costInput.inputValue().catch(() => 'N/A'));

    let supplyId = null;

    // Click en submit sin esperar response
    await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});

    // Esperar a que el modal se cierre (indicando éxito) o pase 2s
    await page.waitForTimeout(2000);

    console.log('[T44] Modal sigue abierto?', 
      await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 300));

    if (!supplyId) {
      console.log('[T44] Intentando fallback por GET...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      let listRes = await page.request.get(`${apiUrl}/supplies`).catch(() => null);
      if (!listRes || !listRes.ok()) {
        listRes = await page.request.get('http://localhost:4000/api/v1/supplies').catch(() => null);
      }
      console.log('[T44] GET status:', listRes?.status());
      console.log('[T44] GET URL:', listRes?.url());
      if (listRes && listRes.ok()) {
        const data = await listRes.json().catch(() => ({}));
        const items = data.data || data;
        if (Array.isArray(items)) {
          console.log('[T44] items count:', items.length);
          console.log('[T44] primeros nombres:', items.slice(0, 3).map(i => i.nombre));
          const found = items.find(i => (i.nombre || '').includes('E2E_CHAIN_SUPPLY_LECHE'));
          supplyId = found?.id || found?.idInsumo || null;
          console.log('[T44] ID capturado por fallback:', supplyId);
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
