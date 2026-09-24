export async function fillRowItem(page, rowIndex = 0, data = {}) {
  const row = page.locator('div[class*="formRowCard"]').nth(rowIndex);
  await row.waitFor({ state: 'visible', timeout: 5000 });

  if (data.proveedor) {
    const provInput = row.locator('input[class*="provInput"]');
    await provInput.fill(data.proveedor);
    const dropItem = row.locator('div[class*="dropdownItem"]').filter({ hasText: data.proveedor }).first();
    await dropItem.waitFor({ state: 'visible', timeout: 4000 });
    await dropItem.click();
  }

  if (data.insumo) {
    const insumoInput = row.locator('input[class*="insumoInput"]');
    await insumoInput.fill(data.insumo);
    const dropItem = row.locator('div[class*="dropdownItem"]').filter({ hasText: data.insumo }).first();
    await dropItem.waitFor({ state: 'visible', timeout: 4000 });
    await dropItem.click();
  }

  if (data.marca !== undefined) {
    const marcaInput = row.locator('input[class*="marcaInput"]');
    await marcaInput.fill(data.marca);
  }

  if (data.empaqueTipo) {
    const empaqueSelect = row.locator('select[class*="empaqueSelect"]');
    await empaqueSelect.selectOption(data.empaqueTipo);
  }

  if (data.contenidoNeto && (await row.locator('input[class*="netContentField"]').isEnabled().catch(() => false))) {
    const netInput = row.locator('input[class*="netContentField"]');
    await netInput.fill(String(data.contenidoNeto));
  }

  if (data.unidadMedida && (await row.locator('select[class*="unitField"]').isEnabled().catch(() => false))) {
    const unitSelect = row.locator('select[class*="unitField"]');
    await unitSelect.selectOption(data.unidadMedida);
  }

  if (data.cantidad !== undefined) {
    const empaquesInput = row.locator('input[class*="empaquesInput"]');
    await empaquesInput.fill(String(data.cantidad));
  }

  if (data.precio !== undefined) {
    const priceInput = row.locator('input[class*="unitPriceInput"]');
    await priceInput.fill(String(data.precio));
  }

  if (data.aplicaIva !== undefined) {
    const ivaCheck = row.locator('input[class*="ivaCheckbox"]');
    if ((await ivaCheck.isChecked()) !== data.aplicaIva) {
      await ivaCheck.click();
    }
  }
}

export async function submitPurchase(page) {
  const saveBtn = page.locator('button:has-text("Guardar y Registrar Compra")').first();
  const [response] = await Promise.all([
    page.waitForResponse(
      resp => resp.url().includes('/purchases') && resp.request().method() === 'POST',
      { timeout: 9000 }
    ).catch(() => null),
    saveBtn.click({ timeout: 3000, force: true }).catch(() => {})
  ]);
  return response;
}
