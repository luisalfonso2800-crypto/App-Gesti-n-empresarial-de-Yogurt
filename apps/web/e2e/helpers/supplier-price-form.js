import { expect } from '@playwright/test';

/**
 * Rellena un combobox (insumo/proveedor) con estrategia defensiva:
 * intenta tipear el nombre; si no hay match, limpia y selecciona el primero.
 */
async function fillCombobox(page, labelRegex, searchText) {
  const wrap = page.locator('div[class*="comboboxWrapper"]').filter({ hasText: labelRegex });
  const input = wrap.locator('input').first();
  await expect(input).toBeEnabled({ timeout: 4000 });
  await input.click();
  if (searchText) {
    await input.fill(searchText);
  }
  const firstOpt = wrap.locator('div[class*="dropdownItem"]').first();
  const hasMatch = await firstOpt.isVisible({ timeout: 1000 }).catch(() => false);
  if (!hasMatch && searchText) {
    // Fallback: limpiar y mostrar lista completa
    await input.fill('');
    await expect(firstOpt).toBeVisible({ timeout: 3000 });
  }
  await firstOpt.click();
}

/**
 * Llena el formulario de cotización de proveedor respetando la cascada Poka-Yoke 1→6.
 * @param {import('@playwright/test').Page} page
 * @param {Object} data
 */
export async function fillSupplierPriceForm(page, data) {
  // PASO 1: Insumo
  await fillCombobox(page, /1\.\s*Insumo/i, data.insumoNombre);

  // PASO 2: Proveedor
  await fillCombobox(page, /2\.\s*Proveedor/i, data.proveedorNombre);

  // PASO 3: Presentación (se habilita tras seleccionar proveedor)
  const selectPresentacion = page.locator('select[name="presentacionSelect"]').first();
  await expect(selectPresentacion).toBeEnabled({ timeout: 4000 });
  const optCount = data.presentacion
    ? await selectPresentacion.locator('option').filter({ hasText: data.presentacion }).count()
    : 0;
  if (optCount > 0) {
    await selectPresentacion.selectOption({ label: data.presentacion });
  } else {
    await selectPresentacion.selectOption({ index: 1 });
  }

  // PASO 4: Unidad de Medida (se habilita tras presentación)
  const selectUnidad = page.locator('select[name="unidadPresentacion"]').first();
  await expect(selectUnidad).toBeEnabled({ timeout: 4000 });
  await selectUnidad.selectOption(data.unidadMedida);

  // PASO 5: Cantidad (se habilita tras unidad). La pleca debe reflejar la unidad antes del fill.
  const inputCantidad = page.locator('input[name="cantidadPresentacion"]').first();
  await expect(inputCantidad).toBeEnabled({ timeout: 4000 });
  await expect(page.locator('span[class*="plecaBadge"]').first())
    .toContainText(data.unidadMedida, { timeout: 2000 });
  await inputCantidad.fill(String(data.cantidad));

  // PASO 6: Precio (se habilita tras cantidad > 0)
  const inputPrecio = page.locator('input[name="precioCompra"]').first();
  await expect(inputPrecio).toBeEnabled({ timeout: 4000 });
  await inputPrecio.fill(String(data.precio));

  // Condiciones fiscales
  const checkIva = page.locator('label:has-text("Aplica IVA") input[type="checkbox"]');
  const isChecked = await checkIva.isChecked().catch(() => false);
  if (data.aplicaIva && !isChecked) {
    await checkIva.check();
  } else if (!data.aplicaIva && isChecked) {
    await checkIva.uncheck();
  }
  if (data.aplicaIva && data.modalidad) {
    const selectModalidad = page.locator('select:has(option[value="PRECIO_INCLUYE_IVA"])');
    if (await selectModalidad.isVisible().catch(() => false)) {
      await selectModalidad.selectOption(data.modalidad);
    }
  }
}
