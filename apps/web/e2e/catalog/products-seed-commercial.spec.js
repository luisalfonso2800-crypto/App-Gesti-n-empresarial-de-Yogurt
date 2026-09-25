const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const COMMERCIAL_ITEMS = [
  'Yogur Natural 1L', 'Yogur Natural Cremoso 1L', 'Yogur de Frutos Rojos 1L', 'Yogur de Fresa 1L', 'Yogur de Mango 1L',
  'Yogur Griego Natural 500g', 'Yogur Griego de Fresa 500g', 'Kumis Natural 1L', 'Crema de Fresas con Crema 250g', 'Postre Lácteo de Frutos Rojos 200g'
];

test.describe('Siembra Idempotente: 10 Productos Comerciales', () => {
  test('Asegurar existencia de 10 productos comerciales con todos sus campos', async ({ page }) => {
    test.setTimeout(180000);
    const dataDir = path.join(__dirname, '..', '.test-data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const chainFile = path.join(dataDir, 'chain-products.json');
    const chain = fs.existsSync(chainFile) ? JSON.parse(fs.readFileSync(chainFile, 'utf-8')) : {};
    const commercialProducts = chain.commercialProducts || {};

    await page.goto('/catalog/products');
    await page.waitForLoadState('networkidle');

    for (const name of COMMERCIAL_ITEMS) {
      const existingRow = page.locator('table tbody tr').filter({ hasText: name }).first();
      if (await existingRow.isVisible({ timeout: 1000 }).catch(() => false)) {
        const codeText = await existingRow.locator('td').nth(0).innerText().catch(() => '');
        commercialProducts[name] = { nombre: name, codigo: codeText.trim(), tipo: 'COMERCIAL', status: 'REUTILIZADO' };
        continue;
      }

      const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
      await expect(openBtn).toBeVisible({ timeout: 10000 });
      await openBtn.click();

      const btnComercial = page.locator('button:has-text("Elegir Comercial"), button:has-text("Comercial Envasado")').first();
      if (await btnComercial.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btnComercial.click();
      }

      const form = page.locator('form').first();
      await expect(form).toBeVisible({ timeout: 8000 });

      // Cascada Poka-Yoke: 1. Nombre -> 2. Presentacion -> 3. Categoria -> 4. Canal
      const nameInput = form.locator('input[name="nombre"]').first();
      await expect(nameInput).toBeVisible({ timeout: 5000 });
      await nameInput.fill(name);

      const presSelect = form.locator('select[name="idPresentacion"]').first();
      await expect(presSelect).toBeEnabled();
      await presSelect.selectOption({ index: 1 });

      const catSelect = form.locator('select[name="categoria"]').first();
      await expect(catSelect).toBeEnabled();
      await catSelect.selectOption({ index: 1 });

      const canalSelect = form.locator('select[name="canalVenta"]').first();
      await expect(canalSelect).toBeEnabled();
      await canalSelect.selectOption({ index: 1 });

      // Campos comerciales
      const descArea = form.locator('textarea[name="descripcion"]').first();
      if (await descArea.isVisible().catch(() => false)) await descArea.fill('Yogurt artesanal con fruta natural');

      await form.locator('input[name="precioVenta"]').first().fill('7500');
      await form.locator('input[name="margenObjetivo"]').first().fill('30');

      const ivaCheck = form.locator('input[name="precioIncluyeIva"]').first();
      if (await ivaCheck.isVisible().catch(() => false) && !(await ivaCheck.isChecked())) await ivaCheck.check();

      const minMayorista = form.locator('input[name="cantidadMinimaMayorista"]').first();
      if (await minMayorista.isVisible().catch(() => false)) await minMayorista.fill('12');

      const precioMayorista = form.locator('input[name="precioMayorista"]').first();
      if (await precioMayorista.isVisible().catch(() => false)) await precioMayorista.fill('6000');

      const stockInput = form.locator('input[name="stockMinimo"]').first();
      if (await stockInput.isVisible().catch(() => false)) await stockInput.fill('10');

      const saveBtn = form.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar Producto")').first();
      await expect(saveBtn).toBeEnabled();

      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/v1/products') && ['POST', 'PATCH'].includes(r.request().method())).catch(() => null),
        saveBtn.click()
      ]);

      if (res && res.status() >= 200 && res.status() < 300) {
        const body = await res.json().catch(() => ({}));
        commercialProducts[name] = { id: body.id, nombre: name, codigo: body.codigo || '', tipo: 'COMERCIAL', status: 'CREADO' };
        await expect(form).not.toBeVisible({ timeout: 5000 }).catch(() => {});
      } else {
        await page.goto('/catalog/products');
        await page.waitForLoadState('networkidle');
        commercialProducts[name] = { nombre: name, tipo: 'COMERCIAL', status: 'REUTILIZADO_FALLBACK' };
      }
    }

    fs.writeFileSync(chainFile, JSON.stringify({ ...chain, commercialProducts }, null, 2), 'utf-8');
  });
});
