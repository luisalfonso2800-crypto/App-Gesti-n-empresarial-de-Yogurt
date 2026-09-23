import { safeIsVisible } from './safe-visible.js';

export async function fillBaseFields(locators, timestamp) {
  const razonSocial = `E2E_TEST_SUPPLIER_${timestamp}`;
  const rawNit = `900${String(timestamp).slice(-6)}1`;
  
  if (await safeIsVisible(locators.razonSocialInput, 300)) await locators.razonSocialInput.fill(razonSocial);
  if (await safeIsVisible(locators.nitInput, 300)) await locators.nitInput.fill(rawNit);
  if (await safeIsVisible(locators.contactoInput, 300)) await locators.contactoInput.fill('CARLOS PRUEBA');
  if (await safeIsVisible(locators.telefonoInput, 300)) await locators.telefonoInput.fill('3001234567');
  if (await safeIsVisible(locators.direccionInput, 300)) await locators.direccionInput.fill('CALLE PRINCIPAL # 10-20');
  return { razonSocial, nit: rawNit };
}
