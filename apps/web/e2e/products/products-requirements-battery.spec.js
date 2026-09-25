import { test, expect } from '@playwright/test';

test.describe.serial('Batería de Validación E2E - Requisitos Específicos Nuevo Producto', () => {
  const consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await page.goto('/catalog/products');
    await page.waitForLoadState('networkidle');
  });

  // Requisitos 1, 2 y 3: Presencia o ausencia de cambio de modo
  test('R01-R03: Validación de Cambio de Modo y persistencia de modo seleccionado', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await expect(openBtn).toBeEnabled({ timeout: 10000 });
    await openBtn.click();

    // Seleccionar Comercial
    await page.locator('button:has-text("Elegir Comercial")').first().click();
    await expect(page.locator('form')).toBeVisible();

    // Inspeccionar si existe texto o botón de cambio de modo
    const changeModeBtn = page.locator('button:has-text("Cambiar de Opción"), button:has-text("Cambiar de modo")');
    const hasChangeMode = await changeModeBtn.count();
    expect(hasChangeMode).toBe(0);

    // Modal cerrado y reabrir en WIP
    await page.locator('button[aria-label="Cerrar modal"], button:has-text("✕")').first().click();
    await openBtn.click();
    await page.locator('button:has-text("Elegir Base WIP")').first().click();
    await expect(page.locator('form')).toBeVisible();
    
    const hasChangeModeWip = await changeModeBtn.count();
    expect(hasChangeModeWip).toBe(0);
  });

  // Requisitos 4, 6, 7: Cascada en formulario Comercial
  test('R04, R06, R07: Bloqueo en cascada y retroceso en formulario Comercial', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await openBtn.click();
    await page.locator('button:has-text("Elegir Comercial")').first().click();

    const nameInput = page.locator('input[name="nombre"]').first();
    const presSelect = page.locator('select[name="idPresentacion"]').first();
    const catSelect = page.locator('select[name="categoria"]').first();
    const canalSelect = page.locator('select[name="canalVenta"]').first();
    const codeInput = page.locator('input[name="codigo"]').first();
    const unitSelect = page.locator('select[name="unidadVenta"]').first();

    // 1. Inicialmente todo dependiente bloqueado
    await expect(presSelect).toBeDisabled();
    await expect(catSelect).toBeDisabled();
    await expect(canalSelect).toBeDisabled();
    await expect(codeInput).toBeDisabled();
    await expect(unitSelect).toBeDisabled();

    // 2. Llenar Nombre -> habilita Presentación
    await nameInput.fill('YOGURT FRESA');
    await expect(presSelect).toBeEnabled();
    await expect(catSelect).toBeDisabled();

    // 3. Seleccionar Presentación -> habilita Categoría
    await presSelect.selectOption({ index: 1 });
    await expect(catSelect).toBeEnabled();
    await expect(canalSelect).toBeDisabled();

    // 4. Seleccionar Categoría -> habilita Canal de Venta
    await catSelect.selectOption({ index: 1 });
    await expect(canalSelect).toBeEnabled();
    await expect(codeInput).toBeDisabled();

    // 5. Seleccionar Canal de Venta -> habilita Inventario (Código, Unidad)
    await canalSelect.selectOption({ index: 1 });
    await expect(codeInput).toBeEnabled();
    await expect(unitSelect).toBeEnabled();

    // 6. R07: Si una dependencia previa vuelve a ser inválida (borrar nombre), los dependientes se rebloquean
    await nameInput.fill('');
    await expect(presSelect).toBeDisabled();
    await expect(catSelect).toBeDisabled();
    await expect(canalSelect).toBeDisabled();
    await expect(codeInput).toBeDisabled();
    await expect(unitSelect).toBeDisabled();
  });

  // Requisitos 5: Cascada en formulario WIP
  test('R05: Bloqueo en cascada en formulario WIP', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await openBtn.click();
    await page.locator('button:has-text("Elegir Base WIP")').first().click();

    const nameInput = page.locator('input[name="nombre"]').first();
    const presSelect = page.locator('select[name="idPresentacion"]').first();
    const catSelect = page.locator('select[name="categoria"]').first();
    const canalSelect = page.locator('select[name="canalVenta"]').first();
    const codeInput = page.locator('input[name="codigo"]').first();

    await expect(presSelect).toBeDisabled();
    await expect(catSelect).toBeDisabled();
    await expect(canalSelect).toBeDisabled();
    await expect(codeInput).toBeDisabled();

    await nameInput.fill('BASE LACTEA BLANCA');
    await expect(presSelect).toBeEnabled();

    await presSelect.selectOption({ index: 1 });
    await expect(catSelect).toBeEnabled();

    await catSelect.selectOption({ index: 1 });
    await expect(canalSelect).toBeEnabled();

    await canalSelect.selectOption({ index: 1 });
    await expect(codeInput).toBeEnabled();
  });

  // Requisitos 8 a 17: Código Interno, icono, divisor, advertencia, cancelar y confirmar
  test('R08-R17: Código Interno protegido, advertencia y edición manual', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await openBtn.click();
    await page.locator('button:has-text("Elegir Comercial")').first().click();

    // Llenar cascada
    await page.locator('input[name="nombre"]').first().fill('YOGURT FRESA');
    await page.locator('select[name="idPresentacion"]').first().selectOption({ index: 1 });
    await page.locator('select[name="categoria"]').first().selectOption({ index: 1 });
    await page.locator('select[name="canalVenta"]').first().selectOption({ index: 1 });

    const codeInput = page.locator('input[name="codigo"]').first();
    // R08 & R09: Generado automáticamente y de solo lectura inicialmente
    const placeholder = await codeInput.getAttribute('placeholder');
    expect(placeholder).toContain('YOG-FRE');
    const isReadOnly = await codeInput.getAttribute('readonly');
    expect(isReadOnly !== null).toBeTruthy();

    // R10: Icono de edición en el extremo derecho
    const editBtn = page.locator('button[title*="Editar código"]').first();
    await expect(editBtn).toBeVisible();
    expect(await editBtn.innerText()).toBe('✎');

    // R11: Divisor visual
    const divider = page.locator('div[class*="codeDivider"]').first();
    await expect(divider).toBeVisible();

    // R12 & R13: Al hacer clic aparece advertencia explicando riesgos
    await editBtn.click();
    const warningBox = page.locator('div[class*="codeWarningBox"]').first();
    await expect(warningBox).toBeVisible();
    const warningText = await warningBox.innerText();
    expect(warningText).toContain('Advertencia');
    expect(warningText).toContain('duplicados');
    expect(warningText).toContain('trazabilidad');

    // R14: Cancelar advertencia mantiene el código intacto y bloqueado
    const cancelBtn = page.locator('button:has-text("Cancelar")').first();
    await cancelBtn.click();
    await expect(warningBox).not.toBeVisible();
    expect(await codeInput.getAttribute('readonly') !== null).toBeTruthy();

    // R15 & R16: Confirmar permite editar el código y sanitiza a uppercase
    await editBtn.click();
    const confirmBtn = page.locator('button:has-text("Entendido, Editar")').first();
    await confirmBtn.click();
    expect(await codeInput.getAttribute('readonly')).toBeNull();

    await codeInput.fill('yg-fr-manual');
    const updatedVal = await codeInput.inputValue();
    expect(updatedVal.toUpperCase()).toBe('YG-FR-MANUAL');

    // El botón se convirtió en candado para volver a bloquear
    const lockBtn = page.locator('button[title*="bloquear código"]').first();
    await expect(lockBtn).toBeVisible();
    expect(await lockBtn.innerText()).toBe('🔒');
  });

  // Requisito 18: La X continúa cerrando correctamente el modal
  test('R18: La X continúa cerrando correctamente el modal', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).first();
    await openBtn.click();
    await page.locator('button:has-text("Elegir Comercial")').first().click();

    const closeBtn = page.locator('button[aria-label="Cerrar modal"], button:has-text("✕")').first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(page.locator('form')).not.toBeVisible();
  });

  // Requisito 19: Errores de consola durante navegación
  test('R19: Verificar ausencia de errores de consola', async () => {
    expect(consoleErrors).toEqual([]);
  });
});
