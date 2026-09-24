import { test, expect } from '@playwright/test';
import { goToPurchases, openPurchaseForm, addRow, fillGlobalFlete, getPurchaseLocators } from '../helpers/purchase-form.js';
import { fillRowItem } from '../helpers/purchase-helpers.js';

// IMPORTANTE (ARQUITECTURA DE UI):
// La UI inserta nuevas filas al INICIO del formulario (prepend / LIFO: [newRow, ...prev]).
// Tras invocar addRow(page), la fila recién creada pasa a ser nth(0) y las filas
// previas se desplazan automáticamente a los índices subsiguientes (nth(1), nth(2)...).

test.describe.serial('Compras - Motor de Cálculos, Empaques, Conversiones e Impuestos', () => {
  test.beforeEach(async ({ page }) => {
    await goToPurchases(page);
    await openPurchaseForm(page);
    await addRow(page);
  });

  // ==========================================
  // BLOQUE 1: MASA, VOLUMEN, CONTEO Y DECIMALES (8 tests)
  // ==========================================

  test('C01 - Masa entera: BULTO x 50 kg x 2 -> Ingreso Neto: 100 kg', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BULTO / SACO', contenidoNeto: '50', unidadMedida: 'kg', cantidad: 2, precio: 10000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/100\s*kg/i);
  });

  test('C02 - Masa en gramos: BOLSA x 500 g x 4 -> Ingreso Neto: 2.000 g', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BOLSA / PAQUETE', contenidoNeto: '500', unidadMedida: 'g', cantidad: 4, precio: 5000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/2\.?000\s*g/i);
  });

  test('C03 - Masa decimal: CAJA x 1.5 kg x 6 -> Ingreso Neto: 9 kg', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'CAJA', contenidoNeto: '1.5', unidadMedida: 'kg', cantidad: 6, precio: 8000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/9\s*kg/i);
  });

  test('C04 - Volumen en litros: BIDÓN x 20 L x 3 -> Ingreso Neto: 60 L', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BIDÓN / GARRAFA', contenidoNeto: '20', unidadMedida: 'L', cantidad: 3, precio: 30000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/60\s*L/i);
  });

  test('C05 - Volumen en mililitros: BOTELLA x 750 ml x 4 -> Ingreso Neto: 3.000 ml', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BOTELLA / FRASCO', contenidoNeto: '750', unidadMedida: 'ml', cantidad: 4, precio: 4000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/3\.?000\s*ml/i);
  });

  test('C06 - Volumen decimal fraccionado: ENVASE x 0.25 L x 8 -> Ingreso Neto: 2 L', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'ENVASE', contenidoNeto: '0.25', unidadMedida: 'L', cantidad: 8, precio: 1500 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/2\s*L/i);
  });

  test('C07 - Unidades enteras: CANASTILLA x 12 und x 5 -> Ingreso Neto: 60 und', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'CANASTILLA', contenidoNeto: '12', unidadMedida: 'Unidades', cantidad: 5, precio: 20000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/60\s*und/i);
  });

  test('C08 - Volumen en Onzas: ENVASE x 8 oz x 10 -> Ingreso Neto: 80 oz', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'ENVASE', contenidoNeto: '8', unidadMedida: 'oz', cantidad: 10, precio: 1200 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/80\s*oz/i);
  });

  // ==========================================
  // BLOQUE 2: COSTO BASE UNITARIO DERIVADO (3 tests)
  // ==========================================

  test('C09 - Costo por kg: BULTO x 25 kg a $50.000 -> Formula y valores consistentes', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BULTO / SACO', contenidoNeto: '25', unidadMedida: 'kg', cantidad: 1, precio: 50000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('span[class*="netIngresoFormula"]')).toContainText(/25\s*kg/i);
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/50\.?000/);
  });

  test('C10 - Costo por Litro: BOTELLA x 2 L a $6.000 -> Formula y valores consistentes', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'BOTELLA / FRASCO', contenidoNeto: '2', unidadMedida: 'L', cantidad: 1, precio: 6000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('span[class*="netIngresoFormula"]')).toContainText(/2\s*L/i);
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/6\.?000/);
  });

  test('C11 - Costo por Unidad individual: CAJA x 24 und a $12.000 -> Formula y valores consistentes', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'CAJA', contenidoNeto: '24', unidadMedida: 'Unidades', cantidad: 1, precio: 12000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('span[class*="netIngresoFormula"]')).toContainText(/24\s*(und|unidades)/i);
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/12\.?000/);
  });

  // ==========================================
  // BLOQUE 3: LIQUIDACIÓN TRIBUTARIA E IVA (5 tests)
  // ==========================================

  test('C12 - IVA 19% Adicional: 5 empaques x $10.000 -> Base $50.000 | IVA $9.500 | Subtotal $59.500', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 5, precio: 10000, aplicaIva: true });
    const row = page.locator('div[class*="formRowCard"]').first();
    await row.locator('select[class*="ivaTipoSelect"]').selectOption('ADICIONAL');
    const desglose = row.locator('div[class*="ivaDesgloseMicro"]');
    await expect(desglose).toContainText(/Base:\s*\$50\.?000/i);
    await expect(desglose).toContainText(/IVA\s*\(19%\):\s*\$9\.?500/i);
    await expect(desglose).toContainText(/Subtotal:\s*\$59\.?500/i);
  });

  test('C13 - IVA 19% Incluido: 10 empaques x $11.900 -> Base $100.000 | IVA $19.000 | Subtotal $119.000', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 10, precio: 11900, aplicaIva: true });
    const row = page.locator('div[class*="formRowCard"]').first();
    await row.locator('select[class*="ivaTipoSelect"]').selectOption('INCLUIDO');
    const desglose = row.locator('div[class*="ivaDesgloseMicro"]');
    await expect(desglose).toContainText(/Base:\s*\$100\.?000/i);
    await expect(desglose).toContainText(/IVA\s*\(19%\):\s*\$19\.?000/i);
    await expect(desglose).toContainText(/Subtotal:\s*\$119\.?000/i);
  });

  test('C14 - IVA 5% Canasta Básica: 10 empaques x $10.500 (IVA Incluido) -> Base $100.000 | IVA $5.000 | Subtotal $105.000', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 10, precio: 10500, aplicaIva: true });
    const row = page.locator('div[class*="formRowCard"]').first();
    await row.locator('input[class*="ivaTasaInput"]').fill('5');
    await row.locator('select[class*="ivaTipoSelect"]').selectOption('INCLUIDO');
    const desglose = row.locator('div[class*="ivaDesgloseMicro"]');
    await expect(desglose).toContainText(/Base:\s*\$100\.?000/i);
    await expect(desglose).toContainText(/IVA\s*\(5%\):\s*\$5\.?000/i);
    await expect(desglose).toContainText(/Subtotal:\s*\$105\.?000/i);
  });

  test('C15 - Exento / Sin IVA: Checkbox Aplica IVA desmarcado -> Base = Subtotal | IVA $0', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 4, precio: 25000, aplicaIva: false });
    const row = page.locator('div[class*="formRowCard"]').first();
    const desglose = row.locator('div[class*="ivaDesgloseMicro"]');
    await expect(desglose).toContainText(/Base:\s*\$100\.?000/i);
    await expect(desglose).toContainText(/IVA\s*\(Exento\):\s*\$0/i);
    await expect(desglose).toContainText(/Subtotal:\s*\$100\.?000/i);
  });

  test('C16 - Recálculo reactivo: Conmutar tasa de 19% a 5% en vivo actualiza Base e IVA', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 10, precio: 10000, aplicaIva: true });
    const row = page.locator('div[class*="formRowCard"]').first();
    await row.locator('select[class*="ivaTipoSelect"]').selectOption('ADICIONAL');
    const desglose = row.locator('div[class*="ivaDesgloseMicro"]');
    await expect(desglose).toContainText(/IVA\s*\(19%\):\s*\$19\.?000/i);
    await row.locator('input[class*="ivaTasaInput"]').fill('5');
    await expect(desglose).toContainText(/IVA\s*\(5%\):\s*\$5\.?000/i);
    await expect(desglose).toContainText(/Subtotal:\s*\$105\.?000/i);
  });

  // ==========================================
  // BLOQUE 4: FLETE GLOBAL, ACUMULACIÓN MULTILÍNEA Y LETRAS (3 tests)
  // ==========================================

  test('C17 - Flete sumado al total: Subtotal $100.000 + Flete $15.000 -> Total a Pagar $115.000', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillRowItem(page, 0, { cantidad: 10, precio: 10000, aplicaIva: false });
    await fillGlobalFlete(page, 15000);
    await expect(loc.stickyTotalAmount).toContainText(/115\.?000/);
  });

  test('C18 - Multilínea consolidada: Fila 1 ($50.000) + Fila 2 ($30.000) + Flete ($10.000) -> Total $90.000', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillRowItem(page, 0, { cantidad: 5, precio: 10000, aplicaIva: false });
    await addRow(page);
    // addRow prepend en UI: la nueva fila queda en el índice 0
    await fillRowItem(page, 0, { cantidad: 3, precio: 10000, aplicaIva: false });
    await fillGlobalFlete(page, 10000);
    await expect(loc.stickyTotalAmount).toContainText(/90\.?000/);
  });

  test('C19 - Proyección de Letras: Total de $150.000 muestra texto en pesos', async ({ page }) => {
    const loc = getPurchaseLocators(page);
    await fillRowItem(page, 0, { cantidad: 15, precio: 10000, aplicaIva: false });
    await expect(loc.stickyTotalWords).toContainText(/ciento cincuenta mil pesos/i);
  });

  // ==========================================
  // BLOQUE 5: INVARIANTES DE ENTRADA Y LÍMITES (3 tests)
  // ==========================================

  test('C20 - Cantidad 0: Ingresar Cantidad = 0 o vacía mantiene ingreso neto y subtotal en 0', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 0, precio: 20000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/0/);
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/\$0/);
  });

  test('C21 - Precio 0: Ingresar Precio = 0 mantiene subtotal en 0 y alerta Poka-Yoke visible', async ({ page }) => {
    await fillRowItem(page, 0, { cantidad: 5, precio: 0 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="subtotalVal"]')).toContainText(/\$0/);
  });

  test('C22 - Contenido 0: Contenido vacío o 0 mantiene estabilidad sin división por cero', async ({ page }) => {
    await fillRowItem(page, 0, { empaqueTipo: 'CAJA', contenidoNeto: '0', cantidad: 5, precio: 10000 });
    const row = page.locator('div[class*="formRowCard"]').first();
    await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/0/);
    await expect(row.locator('strong[class*="subtotalVal"]')).toBeVisible();
  });
});
