import { test, expect } from '@playwright/test';

test.describe('Módulo Proveedores - Cobertura E2E Completa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await expect(page.locator('h1:has-text("Proveedores")')).toBeVisible({ timeout: 10000 });
  });

  test('1. Carga inicial: presencia de encabezado, tabla/estado inicial y botón de acción', async ({ page }) => {
    const btnNuevo = page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Proveedor")').first();
    await expect(btnNuevo).toBeVisible();

    const tableOrEmpty = page.locator('table').or(page.locator('text=Comienza registrando tu primer Proveedor'));
    await expect(tableOrEmpty.first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Happy path: Registro exitoso de proveedor', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-6);
    const uniqueNit = `900${uniqueId}1`;
    const uniqueRazonSocial = `PROVEEDOR TEST E2E ${uniqueId}`;

    const btnNuevo = page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Proveedor")').first();
    await btnNuevo.click();

    await expect(page.locator('text=Nuevo Proveedor').first()).toBeVisible();

    await page.locator('input[name="razonSocial"]').fill(uniqueRazonSocial);
    await page.locator('input[name="nit"]').fill(uniqueNit);
    await page.locator('input[name="nombreContacto"]').fill('CARLOS PRUEBA');
    await page.locator('input[name="telefono"]').fill('3001234567');
    await page.locator('input[name="direccion"]').fill('CALLE 123 # 45-67');

    const submitBtn = page.locator('button:has-text("Guardar Proveedor")').first();
    await submitBtn.click();

    await expect(page.locator(`text=${uniqueRazonSocial}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('3. Validación preventiva: Bloqueo al enviar campos obligatorios vacíos', async ({ page }) => {
    const btnNuevo = page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Proveedor")').first();
    await btnNuevo.click();

    await expect(page.locator('text=Nuevo Proveedor').first()).toBeVisible();

    const submitBtn = page.locator('button:has-text("Guardar Proveedor")').first();
    await submitBtn.click();

    // Modal no se cierra ante campos vacíos obligatorios
    await expect(page.locator('text=Nuevo Proveedor').first()).toBeVisible();
    
    // Verificamos presencia de aviso o error
    const hasErrorAlert = await page.locator('text=requerido').or(page.locator('text=inválidos')).or(page.locator('text=⚠️')).first().isVisible({ timeout: 3000 }).catch(() => false);
    const isRequiredTriggered = await page.locator('input:invalid').first().isVisible({ timeout: 2000 }).catch(() => false);
    expect(hasErrorAlert || isRequiredTriggered).toBeTruthy();
  });

  test('4. Poka-Yoke: Formateo y validación de celular con menos de 10 dígitos', async ({ page }) => {
    const btnNuevo = page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Proveedor")').first();
    await btnNuevo.click();

    await expect(page.locator('text=Nuevo Proveedor').first()).toBeVisible();

    await page.locator('input[name="razonSocial"]').fill('PROVEEDOR FORMATO TEST');
    await page.locator('input[name="nit"]').fill('900111222');
    await page.locator('input[name="direccion"]').fill('AVENIDA 5 # 10-20');
    await page.locator('input[name="telefono"]').fill('300123'); // Sólo 6 dígitos

    const submitBtn = page.locator('button:has-text("Guardar Proveedor")').first();
    await submitBtn.click();

    await expect(page.locator('text=El celular debe tener 10 dígitos').first()).toBeVisible({ timeout: 5000 });
  });

  test('5. Error Handling: Notificación contextual ante error o duplicidad de API', async ({ page }) => {
    await page.route('**/suppliers', async route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Ya existe un proveedor registrado con este NIT / Cédula o Razón Social.' })
        });
      }
      return route.continue();
    });

    const btnNuevo = page.locator('button:has-text("Nuevo Registro"), button:has-text("Nuevo Proveedor")').first();
    await btnNuevo.click();

    await expect(page.locator('text=Nuevo Proveedor').first()).toBeVisible();

    await page.locator('input[name="razonSocial"]').fill('PROVEEDOR DUPLICADO');
    await page.locator('input[name="nit"]').fill('9009998881');
    await page.locator('input[name="direccion"]').fill('CARRERA 15 # 45');
    await page.locator('input[name="telefono"]').fill('3009876543');

    const submitBtn = page.locator('button:has-text("Guardar Proveedor")').first();
    await submitBtn.click();

    const errorContainer = page.locator('text=Ya existe un proveedor registrado con este NIT / Cédula o Razón Social.');
    await expect(errorContainer.first()).toBeVisible({ timeout: 5000 });
  });
});
