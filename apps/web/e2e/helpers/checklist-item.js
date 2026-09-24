/**
 * Administra el cambio de estado de un ítem en el checklist (/operations/purchases/new).
 * @param {import('@playwright/test').Page} page
 * @param {string} itemNombre - Nombre del insumo o producto
 * @param {'CONSEGUIDO'|'NO_CONSEGUIDO'} status - Estado operativo objetivo
 * @param {string} [motivo=''] - Motivo en caso de no ser conseguido
 * @param {boolean} [descartar=false] - true para descartar, false para mantener en lista
 */
export async function markChecklistItemStatus(page, itemNombre, status, motivo = '', descartar = false) {
  const row = page.locator('div[class*="operationalRowWrapper"]').filter({ hasText: itemNombre }).first();
  await row.waitFor({ state: 'visible', timeout: 4000 });

  if (status === 'CONSEGUIDO') {
    const btnConseguido = row.locator('button:has-text("Conseguido")');
    await btnConseguido.click();
    return;
  }

  if (status === 'NO_CONSEGUIDO') {
    // Si no está expandido el menú de detalles, expandirlo
    const btnNoConseguido = row.locator('button:has-text("No Conseguido")');
    if (!(await btnNoConseguido.isVisible().catch(() => false))) {
      const btnExpand = row.locator('button[title*="detalles"], button[title*="opciones"]').first();
      await btnExpand.click();
    }

    await btnNoConseguido.waitFor({ state: 'visible', timeout: 3000 });
    await btnNoConseguido.click();

    if (motivo) {
      const selectMotivo = row.locator('select[class*="motivoSelect"]');
      await selectMotivo.waitFor({ state: 'visible', timeout: 3000 });
      await selectMotivo.selectOption(motivo);

      if (motivo.includes('Otro motivo')) {
        const inputDetalle = row.locator('input[class*="motivoInput"]');
        await inputDetalle.waitFor({ state: 'visible', timeout: 2000 });
        await inputDetalle.fill('Motivo operativo en planta');
      }

      const btnConfirmar = descartar
        ? row.locator('button:has-text("Registrar motivo y descartar")')
        : row.locator('button:has-text("Registrar motivo y mantener en lista")');
      await btnConfirmar.click();
    }
  }
}
