export async function goToPurchases(page) {
  if (!page.url().includes('/operations/purchases') || page.url().includes('/operations/purchases/new')) {
    await page.goto('/operations/purchases', { waitUntil: 'domcontentloaded' });
  }
  await page.locator('h1:has-text("Compras")').waitFor({ state: 'visible', timeout: 10000 });
}

export async function openPurchaseForm(page) {
  // Si ya estamos en el formulario /new, no hace falta re-navegar
  if (page.url().includes('/operations/purchases/new')) {
    await page.locator('button:has-text("+ Añadir Fila")').waitFor({ state: 'visible', timeout: 10000 });
    return;
  }

  const directBtn = page.getByRole('button', { name: /nueva compra directa/i }).or(page.locator('button:has-text("Nueva Compra Directa")')).first();
  await directBtn.waitFor({ state: 'visible', timeout: 8000 });
  await directBtn.click();
  
  // Esperar a que la URL cambie hacia /purchases/new (con timeout holgado o fallback goto)
  try {
    await page.waitForURL(/\/operations\/purchases\/new/, { timeout: 8000 });
  } catch {
    await page.goto('/operations/purchases/new?mode=direct', { waitUntil: 'domcontentloaded' });
  }
  await page.locator('button:has-text("+ Añadir Fila")').waitFor({ state: 'visible', timeout: 10000 });
}

export async function addRow(page) {
  const addBtn = page.locator('button:has-text("+ Añadir Fila")').first();
  await addBtn.click();
  await page.locator('div[class*="formRowCard"]').first().waitFor({ state: 'visible', timeout: 5000 });
}

export async function fillGlobalFlete(page, monto) {
  const fleteInput = page.locator('input[class*="fleteInput"]').first();
  await fleteInput.fill(String(monto));
}

export function getPurchaseLocators(page) {
  return {
    titleHeader: page.locator('h1:has-text("Compras")'),
    btnNuevaDirecta: page.locator('button:has-text("Nueva Compra Directa")').first(),
    btnGestionarLista: page.locator('button:has-text("Crear / Gestionar Lista")').first(),
    stickyTitle: page.locator('h2[class*="stickyTitle"]'),
    btnAddRow: page.locator('button:has-text("+ Añadir Fila")').first(),
    btnSavePurchase: page.locator('button:has-text("Guardar y Registrar Compra")').first(),
    btnStockDrawer: page.locator('button:has-text("Consultar Stock")').first(),
    btnClearDraft: page.locator('button:has-text("Limpiar Borrador")').first(),
    btnBack: page.locator('button:has-text("Volver a Compras")').first(),
    fleteInput: page.locator('input[class*="fleteInput"]').first(),
    stickyTotalAmount: page.locator('div[class*="stickyTotalAmount"]').first(),
    stickyTotalWords: page.locator('div[class*="stickyTotalInWords"]').first(),
    rowCards: page.locator('div[class*="formRowCard"]'),
  };
}
