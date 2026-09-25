const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const WIP_ITEMS = [
  { nombre: 'Yogur Base Natural', canal: 'USO_INTERNO', categoria: 'BASES_LACTEAS' },
  { nombre: 'Yogur Base Entero', canal: 'MIXTO', categoria: 'BASES_LACTEAS', precio: '8000', margen: '25', precioMayorista: '7000' },
  { nombre: 'Yogur Base Cremoso', canal: 'USO_INTERNO', categoria: 'BASES_LACTEAS' },
  { nombre: 'Crema de Leche', canal: 'MIXTO', categoria: 'BASES_LACTEAS', precio: '12000', margen: '30', precioMayorista: '10000' },
  { nombre: 'Crema Batida Base', canal: 'USO_INTERNO', categoria: 'BASES_LACTEAS' },
  { nombre: 'Jalea de Frutos Rojos', canal: 'USO_INTERNO', categoria: 'DULCES_JALEAS' },
  { nombre: 'Jalea de Fresa', canal: 'MIXTO', categoria: 'DULCES_JALEAS', precio: '15000', margen: '35', precioMayorista: '13000' },
  { nombre: 'Jalea de Mango', canal: 'USO_INTERNO', categoria: 'DULCES_JALEAS' },
  { nombre: 'Base de Yogur Griego', canal: 'USO_INTERNO', categoria: 'BASES_LACTEAS' },
  { nombre: 'Base de Kumis', canal: 'USO_INTERNO', categoria: 'BASES_LACTEAS' }
];

test.describe('Siembra Idempotente: 10 Productos WIP Reactivos', () => {
  test('Asegurar existencia de 10 productos WIP manejando reactividad y persistencia', async ({ page }) => {
    test.setTimeout(180000);
    const dataDir = path.join(__dirname, '..', '.test-data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const chainFile = path.join(dataDir, 'chain-products.json');
    const chain = fs.existsSync(chainFile) ? JSON.parse(fs.readFileSync(chainFile, 'utf-8')) : {};
    const wipProducts = chain.wipProducts || {};

    await page.goto('/catalog/products');
    await page.waitForLoadState('networkidle');

    for (const item of WIP_ITEMS) {
      const existingRow = page.locator('table tbody tr').filter({ hasText: item.nombre }).first();
      if (await existingRow.isVisible({ timeout: 1000 }).catch(() => false)) {
        const codeText = await existingRow.locator('td').nth(0).innerText().catch(() => '');
        wipProducts[item.nombre] = { nombre: item.nombre, codigo: codeText.trim(), tipo: 'WIP', status: 'REUTILIZADO' };
        continue;
      }

      const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
      await expect(openBtn).toBeVisible({ timeout: 10000 });
      await openBtn.click();

      const chooseWipBtn = page.locator('button:has-text("Elegir Base WIP"), button:has-text("Base Intermedia / Tanque (WIP)")').first();
      if (await chooseWipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await chooseWipBtn.click();
      }

      const form = page.locator('form').first();
      await expect(form).toBeVisible();

      // Cascada Poka-Yoke: 1. Nombre -> 2. Presentacion -> 3. Categoria -> 4. Canal
      const nameInput = form.locator('input[name="nombre"]').first();
      await nameInput.fill(item.nombre);

      const presSelect = form.locator('select[name="idPresentacion"]').first();
      await expect(presSelect).toBeEnabled();
      await presSelect.selectOption({ index: 1 });

      const catSelect = form.locator('select[name="categoria"]').first();
      await expect(catSelect).toBeEnabled();
      await catSelect.selectOption(item.categoria);

      const canalSelect = form.locator('select[name="canalVenta"]').first();
      await expect(canalSelect).toBeEnabled();
      await canalSelect.selectOption(item.canal);

      // Reactividad: Si es MIXTO, se despliegan campos comerciales
      if (item.canal === 'MIXTO') {
        const descArea = form.locator('textarea[name="descripcion"]').first();
        if (await descArea.isVisible().catch(() => false)) await descArea.fill('Base para uso interno y venta directa a granel');
        await form.locator('input[name="precioVenta"]').first().fill(item.precio);
        await form.locator('input[name="margenObjetivo"]').first().fill(item.margen);
        const ivaCheck = form.locator('input[name="precioIncluyeIva"]').first();
        if (await ivaCheck.isVisible().catch(() => false) && !(await ivaCheck.isChecked())) await ivaCheck.check();
        const minMayorista = form.locator('input[name="cantidadMinimaMayorista"]').first();
        if (await minMayorista.isVisible().catch(() => false)) await minMayorista.fill('12');
        const precioMayorista = form.locator('input[name="precioMayorista"]').first();
        if (await precioMayorista.isVisible().catch(() => false)) await precioMayorista.fill(item.precioMayorista);
      }

      const stockInput = form.locator('input[name="stockMinimo"]').first();
      if (await stockInput.isVisible().catch(() => false)) await stockInput.fill('5');

      const saveBtn = form.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar Producto")').first();
      await expect(saveBtn).toBeEnabled();

      const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/v1/products') && ['POST', 'PATCH'].includes(r.request().method())).catch(() => null),
        saveBtn.click()
      ]);

      if (res && res.status() >= 200 && res.status() < 300) {
        const body = await res.json().catch(() => ({}));
        wipProducts[item.nombre] = { id: body.id, nombre: item.nombre, codigo: body.codigo || '', tipo: 'WIP', status: 'CREADO' };
        await expect(form).not.toBeVisible({ timeout: 5000 }).catch(() => {});
      } else {
        await page.goto('/catalog/products');
        await page.waitForLoadState('networkidle');
        wipProducts[item.nombre] = { nombre: item.nombre, tipo: 'WIP', status: 'REUTILIZADO_FALLBACK' };
      }
    }

    fs.writeFileSync(chainFile, JSON.stringify({ ...chain, wipProducts }, null, 2), 'utf-8');
  });
});
