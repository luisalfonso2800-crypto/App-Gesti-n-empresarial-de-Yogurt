import { safeIsVisible } from './safe-visible.js';

export async function fillBaseFields(locators, timestamp) {
  const name = `E2E_TEST_SUPPLY_${timestamp}`;
  // 1. Nombre desbloquea Categoría
  if (await safeIsVisible(locators.nameInput, 300)) {
    await locators.nameInput.clear().catch(() => {});
    await locators.nameInput.pressSequentially(name, { delay: 10 });
  }
  // 2. Categoría desbloquea Subcategoría
  if (await safeIsVisible(locators.catSelect, 300) && await locators.catSelect.isEnabled().catch(() => false)) {
    const count = await locators.catSelect.locator('option').count();
    if (count > 1) await locators.catSelect.selectOption({ index: 1 }).catch(() => {});
  }
  // 3. Subcategoría desbloquea Marca y Empaque
  if (locators.subcatSelect && await safeIsVisible(locators.subcatSelect, 300) && await locators.subcatSelect.isEnabled().catch(() => false)) {
    const count = await locators.subcatSelect.locator('option').count();
    if (count > 1) await locators.subcatSelect.selectOption({ index: 1 }).catch(() => {});
  }
  // 4. Marca
  if (await safeIsVisible(locators.brandInput, 300) && await locators.brandInput.isEnabled().catch(() => false)) {
    await locators.brandInput.clear().catch(() => {});
    await locators.brandInput.pressSequentially('GENERICA', { delay: 10 });
  }
  // 5. Empaque desbloquea Unidad Base
  if (locators.empaqueSelect && await safeIsVisible(locators.empaqueSelect, 300) && await locators.empaqueSelect.isEnabled().catch(() => false)) {
    await locators.empaqueSelect.selectOption('BULTO').catch(() => {});
  }
  // 6. Unidad Base desbloquea Contenido
  if (await safeIsVisible(locators.unitSelect, 300) && await locators.unitSelect.isEnabled().catch(() => false)) {
    await locators.unitSelect.selectOption('kg', { timeout: 1500 }).catch(() => {});
  }
  // 7. Contenido desbloquea Stock Mínimo y Costo
  if (locators.contenidoInput && await safeIsVisible(locators.contenidoInput, 300) && await locators.contenidoInput.isEnabled().catch(() => false)) {
    await locators.contenidoInput.fill('25').catch(() => {});
  }
  // 8. Stock Mínimo y Costo
  if (await safeIsVisible(locators.stockInput, 300) && await locators.stockInput.isEnabled().catch(() => false)) {
    await locators.stockInput.clear().catch(() => {});
    await locators.stockInput.pressSequentially('10', { delay: 10 });
  }
  if (await safeIsVisible(locators.costInput, 300) && await locators.costInput.isEnabled().catch(() => false)) {
    await locators.costInput.clear().catch(() => {});
    await locators.costInput.pressSequentially('1000', { delay: 10 });
  }
  return name;
}

export async function selectSafe(selectLocator, value) {
  await selectLocator.selectOption(value, { timeout: 1500 }).catch(() => {});
}
