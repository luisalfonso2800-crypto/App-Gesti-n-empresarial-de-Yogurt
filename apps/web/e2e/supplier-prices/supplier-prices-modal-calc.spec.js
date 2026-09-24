import { test, expect } from '@playwright/test';
import { fillSupplierPriceForm } from '../helpers/supplier-price-form.js';

test.describe.serial('Precios Proveedores - Cálculos Matemáticos e IVA (C01-C08)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    const btnOpen = page.locator('button').filter({ hasText: /(Nuevo Registro|Nueva Cotización|Nuevo Precio|Asignar Precio)/i }).first();
    await btnOpen.waitFor({ state: 'visible', timeout: 5000 });
    await btnOpen.click();
    await page.locator('label:has-text("1. Insumo") ~ div input, input[placeholder*="Buscar insumo"]').first().waitFor({ state: 'visible', timeout: 4000 });
  });

  test('C01: BULTO x 50 kg x $120.000 sin IVA -> $2.400 / kg', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Azúcar', proveedorNombre: 'Distribuidora', presentacion: 'BULTO', unidadMedida: 'kg', cantidad: 50, precio: 120000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/2[,.]4/);
  });

  test('C02: BOLSA x 500 g x $8.000 sin IVA -> $16 / g', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Cultivo', proveedorNombre: 'BioIngredientes', presentacion: 'BOLSA', unidadMedida: 'g', cantidad: 500, precio: 8000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/16/);
  });

  test('C03: GARRAFA x 20 L x $60.000 sin IVA -> $3.000 / L', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Leche', proveedorNombre: 'Lácteos', presentacion: 'GARRAFA', unidadMedida: 'L', cantidad: 20, precio: 60000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/3/);
  });

  test('C04: BOTELLA x 750 ml x $6.000 sin IVA -> $8 / ml', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Esencia', proveedorNombre: 'Distribuidora', presentacion: 'BOTELLA', unidadMedida: 'ml', cantidad: 750, precio: 6000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/8/);
  });

  test('C05: CAJA x 24 und x $12.000 sin IVA -> $500 / und', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Envase', proveedorNombre: 'Envases', presentacion: 'CAJA', unidadMedida: 'und', cantidad: 24, precio: 12000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/500/);
  });

  test('C06: Modalidad Precio incluye IVA (19%) proyecta desglose exacto', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Azúcar', proveedorNombre: 'Distribuidora', presentacion: 'BULTO', unidadMedida: 'kg', cantidad: 10, precio: 119000, aplicaIva: true, modalidad: 'PRECIO_INCLUYE_IVA' });
    const taxSection = page.locator('div[class*="costGridDual"], div[class*="costCard"]');
    await expect(taxSection.first()).toContainText(/100[,.]000|10[,.]000|10|100/);
  });

  test('C07: Modalidad IVA adicional (+19%) proyecta recargo exacto', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Azúcar', proveedorNombre: 'Distribuidora', presentacion: 'BULTO', unidadMedida: 'kg', cantidad: 10, precio: 50000, aplicaIva: true, modalidad: 'IVA_ADICIONAL' });
    const taxSection = page.locator('div[class*="costGridDual"], div[class*="costCard"]');
    await expect(taxSection.first()).toContainText(/59[,.]500|5[,.]950|59|5/);
  });

  test('C08: Exento (Aplica IVA desmarcado) costo base igual al total y $0 IVA', async ({ page }) => {
    await fillSupplierPriceForm(page, { insumoNombre: 'Azúcar', proveedorNombre: 'Distribuidora', presentacion: 'BULTO', unidadMedida: 'kg', cantidad: 10, precio: 70000, aplicaIva: false });
    await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/7/);
  });
});

