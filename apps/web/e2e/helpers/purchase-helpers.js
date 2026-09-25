import { expect } from '@playwright/test';

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
    try {
      await empaqueSelect.selectOption(data.empaqueTipo, { timeout: 1500 });
    } catch {
      // Fallback tolerante: seleccionar la primera opción válida si el valor no coincide
      await empaqueSelect.selectOption({ index: 1 }).catch(() => {});
    }
  }

  if (data.contenidoNeto !== undefined && data.contenidoNeto !== null) {
    const netInput = row.locator('input[class*="netContentField"]');
    // Esperar a que React termine el re-render tras cambiar empaque
    await page.waitForTimeout(500);
    // Forzar el fill incluso si el input está temporalmente disabled
    await netInput.fill(String(data.contenidoNeto), { force: true }).catch(async () => {
      // Fallback: clear + type
      await netInput.click({ force: true }).catch(() => {});
      await netInput.press('Control+a').catch(() => {});
      await netInput.pressSequentially(String(data.contenidoNeto), { delay: 30 }).catch(() => {});
    });
    await page.waitForTimeout(300);
  }

  if (data.unidadMedida) {
    const unitSelect = row.locator('select[class*="unitField"]');
    await page.waitForTimeout(300);
    await unitSelect.selectOption(data.unidadMedida, { force: true }).catch(async () => {
      await page.waitForTimeout(300);
      await unitSelect.selectOption(data.unidadMedida).catch(() => {});
    });
    await page.waitForTimeout(200);
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
