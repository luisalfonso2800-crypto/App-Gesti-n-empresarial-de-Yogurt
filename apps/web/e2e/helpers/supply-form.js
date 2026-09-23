import { safeIsVisible } from './safe-visible.js';

export async function fillBaseFields(locators, timestamp) {
  const name = `E2E_TEST_SUPPLY_${timestamp}`;
  if (await safeIsVisible(locators.nameInput, 300)) {
    await locators.nameInput.clear().catch(() => {});
    await locators.nameInput.pressSequentially(name, { delay: 20 });
  }
  if (await safeIsVisible(locators.brandInput, 300)) {
    await locators.brandInput.clear().catch(() => {});
    await locators.brandInput.pressSequentially('GENERICA', { delay: 20 });
  }
  if (await safeIsVisible(locators.catSelect, 300)) {
    const count = await locators.catSelect.locator('option').count();
    if (count > 1) await locators.catSelect.selectOption({ index: 1 }).catch(() => {});
  }
  if (await safeIsVisible(locators.unitSelect, 300)) {
    await locators.unitSelect.selectOption({ index: 1 }, { timeout: 1500 }).catch(() => {});
  }
  if (await safeIsVisible(locators.stockInput, 300)) {
    await locators.stockInput.clear().catch(() => {});
    await locators.stockInput.pressSequentially('10', { delay: 20 });
  }
  if (await safeIsVisible(locators.densityInput, 300)) {
    await locators.densityInput.clear().catch(() => {});
    await locators.densityInput.pressSequentially('1.0', { delay: 20 });
  }
  if (await safeIsVisible(locators.costInput, 300)) {
    await locators.costInput.clear().catch(() => {});
    await locators.costInput.pressSequentially('1000', { delay: 20 });
  }
  return name;
}

export async function selectSafe(selectLocator, value) {
  await selectLocator.selectOption(value, { timeout: 1500 }).catch(() => {});
}
