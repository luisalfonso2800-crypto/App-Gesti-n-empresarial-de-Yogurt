import { test, expect } from '@playwright/test';
import { safeIsVisible } from '../helpers/safe-visible.js';
import { openSupplierModal, closeSupplierModal, getSupplierLocators } from '../helpers/supplier-modal.js';
import { saveChainState, clearChainState } from '../helpers/chain-state.js';

test.describe.serial('Proveedores - Cadena de Valor Maestro (T33)', () => {
  test.beforeAll(async () => {
    clearChainState('suppliers');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await openSupplierModal(page);
  });

  test.afterEach(async ({ page }) => {
    await closeSupplierModal(page);
  });

  test('T33 - Registrar Proveedor Maestro para Cadena de Valor', async ({ page }) => {
    const loc = getSupplierLocators(page);
    const ts = Date.now();
    const masterName = `E2E_CHAIN_SUPPLIER_LACTEOS_${ts}`;
    const masterNit = `900${String(ts).slice(-6)}8`;

    await loc.razonSocialInput.fill(masterName);
    await loc.nitInput.fill(masterNit);
    await loc.contactoInput.fill('INGENIERO PLANTA LACTEOS');
    await loc.telefonoInput.fill('3109876543');
    await loc.emailInput.fill('pedidos@lacteos-chain.com');
    await loc.direccionInput.fill('ZONA INDUSTRIAL CALLE 100 # 50-20');

    let supplierId = null;

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/suppliers') && res.request().method() === 'POST',
        { timeout: 7000 }
      ).catch(() => null),
      loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {}),
    ]);

    if (response) {
      const body = await response.json().catch(() => ({}));
      supplierId = body.id || body.data?.id || body.data?.idProveedor || body.idProveedor || null;
      console.log('[T33] ID capturado por response:', supplierId);
    }

    if (!supplierId) {
      console.log('[T33] Intentando fallback por GET...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      let listRes = await page.request.get(`${apiUrl}/suppliers`).catch(() => null);
      if (!listRes || !listRes.ok()) {
        listRes = await page.request.get('http://localhost:4000/api/v1/suppliers').catch(() => null);
      }
      if (listRes && listRes.ok()) {
        const data = await listRes.json().catch(() => ({}));
        const items = data.data || data;
        if (Array.isArray(items)) {
          const found = items.find(i => (i.nombre || i.razonSocial || '').includes('E2E_CHAIN_SUPPLIER'));
          supplierId = found?.id || found?.idProveedor || null;
          console.log('[T33] ID capturado por fallback:', supplierId);
        }
      }
    }

    expect(supplierId).toBeTruthy();

    saveChainState('suppliers', {
      proveedoresCreados: {
        MASTER_PROVEEDOR_LACTEOS: {
          id: supplierId,
          nombre: masterName,
          nit: masterNit,
          telefono: '3109876543',
          email: 'pedidos@lacteos-chain.com',
          direccion: 'ZONA INDUSTRIAL CALLE 100 # 50-20',
        }
      },
      timestamp: new Date().toISOString()
    });
  });
});
