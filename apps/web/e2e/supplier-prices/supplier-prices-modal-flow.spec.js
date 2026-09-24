import { test, expect } from '@playwright/test';

test.describe.serial('Precios Proveedores - Cascada y Poka-Yoke (T01-T15)', () => {
  const getInsumo = (page) => page.locator('div[class*="comboboxWrapper"]').filter({ hasText: /1\.\s*Insumo/i }).locator('input').first();
  const getProveedor = (page) => page.locator('div[class*="comboboxWrapper"]').filter({ hasText: /2\.\s*Proveedor/i }).locator('input').first();

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.locator('button').filter({ hasText: /(Nuevo Registro|Nueva Cotización|Nuevo Precio|Asignar Precio)/i }).first().click();
    await getInsumo(page).waitFor({ state: 'visible', timeout: 4000 });
  });

  test('T01: Modal visible con título de cotización', async ({ page }) => {
    await expect(page.locator('h2, div').filter({ hasText: /Nuevo Precio de Proveedor|Nueva Cotización/ }).first()).toBeVisible();
  });
  test('T02: Insumo habilitado y Proveedor deshabilitado al inicio', async ({ page }) => {
    await expect(getInsumo(page)).toBeEnabled();
    await expect(getProveedor(page)).toBeDisabled();
  });
  test('T03: Seleccionar Insumo habilita campo Proveedor', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await expect(getProveedor(page)).toBeEnabled({ timeout: 3000 });
  });

  test('T04: Seleccionar Proveedor habilita Presentación Comercial', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await expect(page.locator('select[name="presentacionSelect"]').first()).toBeEnabled({ timeout: 3000 });
  });
  test('T05: Seleccionar Presentación habilita selector Unidad de Medida', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await expect(page.locator('select[name="unidadPresentacion"]').first()).toBeEnabled({ timeout: 3000 });
  });

  test('T06: Seleccionar Unidad habilita Cantidad y llenar Cantidad habilita Precio', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await page.locator('select[name="unidadPresentacion"]').first().selectOption('kg');
    const inputCant = page.locator('input[name="cantidadPresentacion"]').first();
    await expect(inputCant).toBeEnabled({ timeout: 3000 });
    await inputCant.fill('10');
    await expect(page.locator('input[name="precioCompra"]').first()).toBeEnabled({ timeout: 3000 });
  });
  test('T07: Cambiar Unidad resetea Cantidad y Precio', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    const selUnidad = page.locator('select[name="unidadPresentacion"]').first();
    await selUnidad.selectOption('kg');
    const inputCant = page.locator('input[name="cantidadPresentacion"]').first();
    await inputCant.fill('10');
    await selUnidad.selectOption('');
    await expect(inputCant).toHaveValue('');
  });
  test('T08: Checkbox Aplica IVA desmarcado oculta campos de Tasa y Modalidad', async ({ page }) => {
    const checkIva = page.locator('label:has-text("Aplica IVA") input[type="checkbox"]');
    if (await checkIva.isChecked().catch(() => false)) await checkIva.uncheck();
    await expect(page.locator('label:has-text("TASA IVA"), select:has(option[value="PRECIO_INCLUYE_IVA"])')).toHaveCount(0);
  });
  test('T09: Checkbox Aplica IVA marcado precarga Tasa 19%', async ({ page }) => {
    const checkIva = page.locator('label:has-text("Aplica IVA") input[type="checkbox"]');
    if (!(await checkIva.isChecked().catch(() => false))) await checkIva.check();
    const inputTasa = page.locator('div:has(> label:has-text("Tasa IVA")) input, label:has-text("Tasa") ~ input, input[name="porcentajeIva"]').first();
    await expect(inputTasa).toBeVisible({ timeout: 3000 });
    await expect(inputTasa).toHaveValue(/19/);
  });

  test('T10: Pleca de unidad base refleja la unidad elegida', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await page.locator('select[name="unidadPresentacion"]').first().selectOption('kg');
    const pleca = page.locator('span[class*="plecaBadge"]').first();
    await expect(pleca).toContainText('kg');
  });
  test('T11: Campo Precio de compra muestra texto en letras debajo', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await page.locator('select[name="unidadPresentacion"]').first().selectOption('kg');
    await page.locator('input[name="cantidadPresentacion"]').first().fill('10');
    await page.locator('input[name="precioCompra"]').first().fill('50000');
    await expect(page.locator('div[class*="priceInWords"], span[class*="priceWords"]').first()).toContainText(/CINCUENTA MIL/i);
  });
  test('T12: Botón Guardar deshabilitado si faltan campos obligatorios', async ({ page }) => {
    await expect(page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar Precio")').first()).toBeDisabled();
  });
  test('T13: Botón Guardar se habilita con formulario completo', async ({ page }) => {
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await page.locator('select[name="unidadPresentacion"]').first().selectOption('kg');
    await page.locator('input[name="cantidadPresentacion"]').first().fill('10');
    await page.locator('input[name="precioCompra"]').first().fill('20000');
    await expect(page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar Precio")').first()).toBeEnabled({ timeout: 3000 });
  });

  test('T14: Envío válido cierra modal sin errores en pantalla', async ({ page }) => {
    page.on('response', async (r) => {
      if (r.url().includes('/api/')) {
        console.log('[T14-API]', r.status(), r.request().method(), r.url());
        if (r.status() >= 400) console.log('[T14-ERR]', await r.text());
      }
    });
    page.on('dialog', async (dialog) => { await dialog.dismiss().catch(() => {}); });
    await getInsumo(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await getProveedor(page).click();
    await page.locator('div[class*="dropdownItem"]').first().click();
    await page.locator('select[name="presentacionSelect"]').first().selectOption({ index: 1 });
    await page.locator('select[name="unidadPresentacion"]').first().selectOption('kg');
    await page.locator('input[name="cantidadPresentacion"]').first().fill('5');
    await page.locator('input[name="precioCompra"]').first().fill('15000');
    await page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar Precio")').first().click();
    await expect(page.locator('form')).not.toBeVisible({ timeout: 5000 });
  });

  test('T15: Botón Cancelar cierra modal sin guardar', async ({ page }) => {
    await page.locator('button:has-text("Cancelar"), button[aria-label="Cerrar modal"]').first().click();
    await expect(getInsumo(page)).toHaveCount(0);
  });
});
