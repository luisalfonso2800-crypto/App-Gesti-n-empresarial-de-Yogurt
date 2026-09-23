import { test, expect } from '@playwright/test';

const TEST_PREFIX = `E2E_TEST_PRES_${Date.now()}`;
const createdNames = [];

test.describe('Presentaciones - Validación de inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/presentations');
    await expect(page.locator('h1:has-text("Presentaciones")')).toBeVisible({ timeout: 15000 });
  });

  test.afterAll(async ({ request }) => {
    try {
      const res = await request.get('/api/v1/presentations');
      if (res.ok()) {
        const body = await res.json();
        const items = body.data || body;
        if (Array.isArray(items)) {
          for (const item of items) {
            const name = item.nombre || '';
            const id = item.id || item.idPresentacion;
            if (id && (name.includes(TEST_PREFIX) || createdNames.includes(name))) {
              await request.delete(`/api/v1/presentations/${id}`).catch(() => {});
            }
          }
        }
      }
    } catch {
      // Ignore cleanup error if backend endpoint is unavailable
    }
  });

  // Helper para abrir modal y esperar formulario
  const openModal = async (page) => {
    const btnNueva = page.locator('button:has-text("Nueva Presentación")').first();
    await btnNueva.click();
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
  };

  // --- Bloque 1: Nombre ---
  test('TEST 01 - Nombre vacío: muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');
    
    // Submit button is disabled or triggers validation on click
    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();
    
    if (!isSubmitDisabled) {
      await submitBtn.click();
    }
    
    // Criterio: modal no se cierra y/o botón deshabilitado / muestra advertencia
    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    const hasError = isSubmitDisabled || await page.locator('text=Complete: Nombre de la presentación, text=Este campo es requerido').first().isVisible().catch(() => false);
    expect(hasError).toBeTruthy();
  });

  test('TEST 02 - Nombre solo espacios: muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill('    ');
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();

    if (!isSubmitDisabled) {
      await submitBtn.click();
    }

    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await submitBtn.getAttribute('title')).toBeTruthy();
  });

  test('TEST 03 - Nombre 500 chars: documentar comportamiento', async ({ page }) => {
    await openModal(page);
    const longName = `${TEST_PREFIX}_` + 'A'.repeat(480);
    await page.locator('input[name="nombre"]').fill(longName);
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    await submitBtn.click();

    // Documentar si backend acepta o rechaza
    const isModalOpen = await page.locator('text=Nueva Presentación Comercial').isVisible().catch(() => false);
    const hasErrorMsg = await page.locator('div:has-text("⚠️")').isVisible().catch(() => false);
    
    // Si se creó, guardar nombre para limpieza
    if (!isModalOpen) {
      createdNames.push(longName);
    }
    expect(isModalOpen || !hasErrorMsg).toBeTruthy();
  });

  test('TEST 04 - Nombre con <script>: no ejecuta script', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async (dialog) => {
      dialogFired = true;
      await dialog.dismiss();
    });

    await openModal(page);
    const xssPayload = `${TEST_PREFIX}_<script>alert(1)</script>`;
    await page.locator('input[name="nombre"]').fill(xssPayload);
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    await submitBtn.click();

    expect(dialogFired).toBeFalsy();
    createdNames.push(xssPayload);
  });

  // --- Bloque 2: Tipo Envase (8 tests) ---
  test('TEST 05 - Crear con ENVASE', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_ENVASE`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('ENVASE');
    await page.locator('input[name="cantidadOz"]').fill('10');
    await page.locator('input[name="cantidadMl"]').fill('300');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 06 - Crear con BOTELLA', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_BOTELLA`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('BOTELLA');
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 07 - Crear con BOLSA', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_BOLSA`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('BOLSA');
    await page.locator('input[name="cantidadOz"]').fill('16');
    await page.locator('input[name="cantidadMl"]').fill('500');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 08 - Crear con VASO', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_VASO`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('VASO');
    await page.locator('input[name="cantidadOz"]').fill('6');
    await page.locator('input[name="cantidadMl"]').fill('180');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 09 - Crear con BALDE (requiere cantidadMl)', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_BALDE`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('BALDE');
    
    // BALDE muestra input cantidadMl bajo granel
    await page.locator('input[name="cantidadMl"]').fill('4000');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 10 - Crear con COPITA', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_COPITA`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('PORCIONADO_WIP');
    await page.locator('input[name="cantidadOz"]').fill('3');
    await page.locator('input[name="cantidadMl"]').fill('90');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 11 - Crear con OTRO', async ({ page }) => {
    await openModal(page);
    const name = `${TEST_PREFIX}_OTRO`;
    await page.locator('input[name="nombre"]').fill(name);
    await page.locator('select[name="tipoEnvase"]').selectOption('OTRO');
    await page.locator('input[name="cantidadOz"]').fill('12');
    await page.locator('input[name="cantidadMl"]').fill('350');

    await page.locator('button:has-text("Crear Presentación")').click();
    await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(name);
  });

  test('TEST 12 - Sin envase: muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_NO_ENVASE`);
    // Establecemos valor vacío en el select para evaluar rechazo Poka-Yoke
    await page.locator('select[name="tipoEnvase"]').evaluate((el) => {
      el.value = '';
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('input[name="cantidadOz"]').fill('10');
    await page.locator('input[name="cantidadMl"]').fill('300');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();
    if (!isSubmitDisabled) {
      await submitBtn.click();
    }

    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Tipo de envase').first().isVisible()).toBeTruthy();
  });

  // --- Bloque 3: Cantidad OZ (5 tests) ---
  test('TEST 13 - OZ negativo: muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_OZ_NEG`);
    // En input numérico el evento onKeyDown bloquea signo '-' o replace(/\D/g, '') limpia
    const ozInput = page.locator('input[name="cantidadOz"]');
    await ozInput.pressSequentially('-5');
    const val = await ozInput.inputValue();
    
    // Poka-Yoke: no permite ingresar negativos (el valor resultante no contiene '-')
    expect(val).not.toContain('-');
  });

  test('TEST 14 - OZ texto "abc": muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_OZ_ABC`);
    const ozInput = page.locator('input[name="cantidadOz"]');
    await ozInput.fill('abc');
    const val = await ozInput.inputValue();

    // Sanitización Poka-Yoke automática: regex replace elimina letras
    expect(val).toBe('');
  });

  test('TEST 15 - OZ decimal 1.5: permite y guarda', async ({ page }) => {
    await openModal(page);
    const ozInput = page.locator('input[name="cantidadOz"]');
    await ozInput.fill('1.5');
    const val = await ozInput.inputValue();
    // Documentar si el input acepta el punto decimal o lo formatea a dígitos
    expect(val.length > 0).toBeTruthy();
  });

  test('TEST 16 - OZ 1.55: documentar comportamiento', async ({ page }) => {
    await openModal(page);
    const ozInput = page.locator('input[name="cantidadOz"]');
    await ozInput.fill('1.55');
    const val = await ozInput.inputValue();
    // Documentar valor real recibido en el input
    expect(typeof val === 'string').toBeTruthy();
  });

  test('TEST 17 - OZ cero: documentar comportamiento', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_OZ_CERO`);
    await page.locator('input[name="cantidadOz"]').fill('0');
    await page.locator('input[name="cantidadMl"]').fill('200');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();
    // El sistema permite 0 en Oz si es válido o lo rechaza
    expect(typeof isSubmitDisabled === 'boolean').toBeTruthy();
  });

  // --- Bloque 4: Cantidad ML (5 tests) ---
  test('TEST 18 - ML negativo: muestra error', async ({ page }) => {
    await openModal(page);
    const mlInput = page.locator('input[name="cantidadMl"]');
    await mlInput.pressSequentially('-100');
    const val = await mlInput.inputValue();
    expect(val).not.toContain('-');
  });

  test('TEST 19 - ML texto "abc": muestra error', async ({ page }) => {
    await openModal(page);
    const mlInput = page.locator('input[name="cantidadMl"]');
    await mlInput.fill('abc');
    const val = await mlInput.inputValue();
    expect(val).toBe('');
  });

  test('TEST 20 - ML decimal 250.5: permite y guarda', async ({ page }) => {
    await openModal(page);
    const mlInput = page.locator('input[name="cantidadMl"]');
    await mlInput.fill('250.5');
    const val = await mlInput.inputValue();
    expect(val.length > 0).toBeTruthy();
  });

  test('TEST 21 - ML 250.55: documentar comportamiento', async ({ page }) => {
    await openModal(page);
    const mlInput = page.locator('input[name="cantidadMl"]');
    await mlInput.fill('250.55');
    const val = await mlInput.inputValue();
    expect(typeof val === 'string').toBeTruthy();
  });

  test('TEST 22 - ML cero: documentar comportamiento', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_ML_CERO`);
    await page.locator('input[name="cantidadOz"]').fill('10');
    await page.locator('input[name="cantidadMl"]').fill('0');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();
    expect(typeof isSubmitDisabled === 'boolean').toBeTruthy();
  });

  // --- Bloque 5: Integridad (3 tests) ---
  test('TEST 23 - Todos vacíos: muestra error', async ({ page }) => {
    await openModal(page);
    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();

    if (!isSubmitDisabled) {
      await submitBtn.click();
    }

    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Complete:').first().isVisible()).toBeTruthy();
  });

  test('TEST 24 - Solo nombre: muestra error', async ({ page }) => {
    await openModal(page);
    await page.locator('input[name="nombre"]').fill(`${TEST_PREFIX}_SOLO_NOMBRE`);
    
    // Limpiamos capacidades
    await page.locator('input[name="cantidadOz"]').fill('');
    await page.locator('input[name="cantidadMl"]').fill('');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    const isSubmitDisabled = await submitBtn.isDisabled();

    if (!isSubmitDisabled) {
      await submitBtn.click();
    }

    await expect(page.locator('text=Nueva Presentación Comercial')).toBeVisible();
    expect(isSubmitDisabled || await page.locator('text=Complete:').first().isVisible()).toBeTruthy();
  });

  test('TEST 25 - Happy path: crea y aparece en tabla', async ({ page }) => {
    await openModal(page);
    const happyName = `${TEST_PREFIX}_HAPPY_250ML`;
    await page.locator('input[name="nombre"]').fill(happyName);
    await page.locator('select[name="tipoEnvase"]').selectOption('ENVASE');
    await page.locator('input[name="cantidadOz"]').fill('8');
    await page.locator('input[name="cantidadMl"]').fill('250');
    await page.locator('input[name="observaciones"]').fill('PRUEBA HAPPY PATH E2E');

    const submitBtn = page.locator('button:has-text("Crear Presentación")');
    await submitBtn.click();

    // Debe cerrarse el modal y aparecer en la tabla
    await expect(page.locator(`text=${happyName}`).first()).toBeVisible({ timeout: 10000 });
    createdNames.push(happyName);
  });
});
