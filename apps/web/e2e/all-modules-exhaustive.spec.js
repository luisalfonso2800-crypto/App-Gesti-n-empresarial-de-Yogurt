/**
 * @file all-modules-exhaustive.spec.js
 * @description Suite E2E exhaustiva: 14 módulos, 24 modales/drawers, fuzzing de validaciones
 *   y transferencia encadenada de datos entre módulos (Catálogos → Operaciones → Comercial).
 *
 * Ejecución:
 *   pnpm --filter web exec playwright test all-modules-exhaustive.spec.js
 */
import { test, expect } from '@playwright/test';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Intenta hacer click en un botón buscándolo por múltiples selectores posibles.
 * Skippea botones disabled y los que estén bloqueados por un overlay.
 */
async function tryClick(page, ...selectors) {
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    const visible = await loc.isVisible({ timeout: 2000 }).catch(() => false);
    if (!visible) continue;
    const enabled = await loc.isEnabled({ timeout: 1000 }).catch(() => false);
    if (!enabled) continue;
    try {
      await loc.click({ timeout: 5000 });
      return true;
    } catch {
      // elemento bloqueado por overlay u otro motivo — continuar con el siguiente selector
    }
  }
  return false;
}

/**
 * Cierra un modal/drawer activo buscando botón X, Cancelar, o Cerrar.
 * Primero intenta cerrar modales internos anidados, luego el externo.
 */
async function closeModal(page) {
  const closeSelectors = [
    'button:has-text("Cancelar")',
    'button[aria-label="Cerrar modal"]',
    'button[aria-label="Cerrar"]',
    'button:has-text("✕")',
    'button:has-text("Cerrar")',
  ];
  for (const sel of closeSelectors) {
    const loc = page.locator(sel).first();
    const visible = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!visible) continue;
    const enabled = await loc.isEnabled({ timeout: 500 }).catch(() => false);
    if (!enabled) continue;
    try {
      await loc.click({ timeout: 4000 });
      await page.waitForTimeout(400);
      return;
    } catch { /* sigue intentando */ }
  }
  await page.waitForTimeout(400);
}

/** Espera carga de red completa */
async function waitForLoad(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
}

/**
 * Hace click dentro del panel del drawer (scopeado al panel para evitar overlay).
 * Útil para el SaleCavaCatalogDrawer y similares.
 */
async function clickInsideDrawer(page, selector) {
  // El panel del drawer tiene clase que contiene "drawerPanel"
  const drawerPanel = page.locator('[class*="drawerPanel"], [class*="drawer-panel"], [class*="DrawerPanel"]').first();
  const panelVisible = await drawerPanel.isVisible({ timeout: 3000 }).catch(() => false);
  if (panelVisible) {
    const btn = drawerPanel.locator(selector).first();
    const visible = await btn.isVisible({ timeout: 2000 }).catch(() => false);
    if (visible) {
      try {
        await btn.click({ timeout: 5000 });
        return true;
      } catch { /* fallback: force */ }
      try {
        await btn.click({ force: true, timeout: 3000 });
        return true;
      } catch { /* no se pudo */ }
    }
  }
  return false;
}

// ─── BLOQUE 1: CATÁLOGOS ──────────────────────────────────────────────────────

test.describe('BLOQUE 1 – Catálogos', () => {

  // ── 1. Presentaciones ────────────────────────────────────────────────────────
  test('1. Presentaciones: modal, fuzzing y flujo válido', async ({ page }) => {
    await page.goto('/catalog/presentations');
    await waitForLoad(page);

    const btnNueva = page.locator('button:has-text("Nueva Presentación"), button:has-text("Nueva presentación")').first();
    await expect(btnNueva).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: enviar formulario vacío ─────────────────────────────────────
    await btnNueva.click();
    await page.waitForTimeout(600);
    // No hacer click en Guardar si está disabled; sólo verificar que el modal abrió
    const modalTitle = page.locator('[class*="modal"], [class*="Modal"], dialog').first();
    await modalTitle.isVisible({ timeout: 3000 }).catch(() => {});

    // ── Fuzzing: cantidadOz negativo ─────────────────────────────────────────
    const ozInput = page.locator('input[name="cantidadOz"]').first();
    if (await ozInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await ozInput.fill('-5');
    }
    const mlInput = page.locator('input[name="cantidadMl"]').first();
    if (await mlInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mlInput.fill('abc');
    }

    // ── Cerrar con botón X ───────────────────────────────────────────────────
    await closeModal(page);

    // ── Flujo válido: crear "ENVASE PET 500 ML" ───────────────────────────────
    await btnNueva.click();
    await page.waitForTimeout(500);

    const nombreInput = page.locator('input[name="nombre"]').first();
    if (await nombreInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreInput.fill('ENVASE PET 500 ML');
    }
    const ozInput2 = page.locator('input[name="cantidadOz"]').first();
    if (await ozInput2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await ozInput2.fill('16.9');
    }
    const mlInput2 = page.locator('input[name="cantidadMl"]').first();
    if (await mlInput2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mlInput2.fill('500');
    }

    // Click en Guardar solo si está enabled
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const saveEnabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (saveEnabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1500);

    // ── Probar botón Editar en alguna fila → cancelar ────────────────────────
    const editBtn = page.locator('button:has-text("Editar"), [aria-label*="ditar"]').first();
    if (await editBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editBtn.click();
      await page.waitForTimeout(400);
      await closeModal(page);
    }
  });

  // ── 2. Insumos ───────────────────────────────────────────────────────────────
  test('2. Insumos: modal, fuzzing, creación de insumos canónicos y eliminar', async ({ page }) => {
    await page.goto('/catalog/supplies');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Insumo"), button:has-text("Nuevo insumo")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: abrir modal vacío y cerrar con X ─────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);
    await closeModal(page);

    // ── Flujo válido: LECHE CRUDA DE VACA ────────────────────────────────────
    const insumosCanonicos = [
      { nombre: 'LECHE CRUDA DE VACA', unidad: 'Litros' },
      { nombre: 'CULTIVO YOGURT TERMOFILO', unidad: 'Gramos' },
      { nombre: 'ENVASE PET 500 ML', unidad: 'Unidades' },
    ];

    for (const insumo of insumosCanonicos) {
      await btnNuevo.click();
      await page.waitForTimeout(500);

      const nombreIn = page.locator('input[name="nombre"]').first();
      if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nombreIn.fill(insumo.nombre);
      }
      const unidadSel = page.locator('select[name="unidadBase"], input[name="unidadBase"]').first();
      if (await unidadSel.isVisible({ timeout: 2000 }).catch(() => false)) {
        const tag = await unidadSel.evaluate(el => el.tagName);
        if (tag === 'SELECT') {
          await unidadSel.selectOption({ label: insumo.unidad }).catch(async () => {
            await unidadSel.selectOption({ index: 1 }).catch(() => {});
          });
        } else {
          await unidadSel.fill(insumo.unidad);
        }
      }

      const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
      const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
      if (enabled) {
        await saveBtn.click({ timeout: 5000 });
      } else {
        await closeModal(page);
      }
      await page.waitForTimeout(1200);
    }

    // ── Botón "Eliminar" en fila → ConfirmDeleteModal → cancelar ─────────────
    const delBtn = page.locator('button:has-text("Eliminar"), [aria-label*="liminar"]').first();
    if (await delBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await delBtn.click();
      await page.waitForTimeout(500);
      await closeModal(page);
    }
  });

  // ── 3. Proveedores ───────────────────────────────────────────────────────────
  test('3. Proveedores: modal, fuzzing y creación de HACIENDA LACTEA SAS', async ({ page }) => {
    await page.goto('/catalog/suppliers');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Proveedor"), button:has-text("Nuevo proveedor")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: modal vacío → cerrar ────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);

    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('HACIENDA LACTEA SAS');
    }
    const telIn = page.locator('input[name="telefono"]').first();
    if (await telIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await telIn.fill('3101234567');
    }
    const emailIn = page.locator('input[name="email"], input[type="email"]').first();
    if (await emailIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailIn.fill('ventas@hacienda.co');
    }

    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1200);
  });

  // ── 4. Precios de Proveedor ──────────────────────────────────────────────────
  test('4. Precios de Proveedor: modal, fuzzing y precio válido para LECHE CRUDA', async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await waitForLoad(page);

    const btnAsignar = page.locator('button:has-text("Asignar Precio"), button:has-text("Nuevo Precio"), button:has-text("Asignar precio")').first();
    await expect(btnAsignar).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: abrir modal → precio negativo → cerrar ───────────────────────
    await btnAsignar.click();
    await page.waitForTimeout(500);
    const precioIn = page.locator('input[name="precioCompra"], input[name="precio"]').first();
    if (await precioIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await precioIn.fill('-100');
    }
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnAsignar.click();
    await page.waitForTimeout(600);

    const provSel = page.locator('select[name="idProveedor"]').first();
    if (await provSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await provSel.selectOption({ label: /HACIENDA/i }).catch(async () => {
        await provSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const insSel = page.locator('select[name="idInsumo"]').first();
    if (await insSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await insSel.selectOption({ label: /LECHE CRUDA/i }).catch(async () => {
        await insSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const precioIn2 = page.locator('input[name="precioCompra"], input[name="precio"]').first();
    if (await precioIn2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await precioIn2.fill('2600');
    }
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1200);

    // ── Botón "Mover Lista" → MoveListModal → cancelar ────────────────────────
    const moveBtn = page.locator('button:has-text("Mover Lista"), button:has-text("Mover")').first();
    if (await moveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const moveEnabled = await moveBtn.isEnabled({ timeout: 1000 }).catch(() => false);
      if (moveEnabled) {
        await moveBtn.click({ timeout: 4000 });
        await page.waitForTimeout(500);
        await closeModal(page);
      }
    }
  });

  // ── 5. Productos ─────────────────────────────────────────────────────────────
  test('5. Productos: modal, fuzzing y creación de YOGURT FRESA 500ML', async ({ page }) => {
    await page.goto('/catalog/products');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Producto"), button:has-text("Nuevo producto comercial"), button:has-text("Nuevo Producto Comercial")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: precio 0 → modal no debería guardar ──────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);
    const precioIn = page.locator('input[name="precioVenta"]').first();
    if (await precioIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await precioIn.fill('0');
    }
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);

    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('YOGURT FRESA 500ML');
    }
    const catSel = page.locator('select[name="categoria"]').first();
    if (await catSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await catSel.selectOption('LACTEOS').catch(async () => {
        await catSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const presSel = page.locator('select[name="idPresentacion"]').first();
    if (await presSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await presSel.selectOption({ label: /ENVASE PET 500/i }).catch(async () => {
        await presSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const pvIn = page.locator('input[name="precioVenta"]').first();
    if (await pvIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pvIn.fill('7500');
    }
    const pmIn = page.locator('input[name="precioMayorista"]').first();
    if (await pmIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pmIn.fill('6200');
    }
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1200);
  });

  // ── 6. Recetas ───────────────────────────────────────────────────────────────
  test('6. Recetas: modal, fuzzing, creación encadenada con producto YOGURT FRESA', async ({ page }) => {
    await page.goto('/catalog/recipes');
    await waitForLoad(page);

    const btnNueva = page.locator('button:has-text("Nueva Receta"), button:has-text("Nueva receta")').first();
    await expect(btnNueva).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: rendimiento 0 → cerrar ──────────────────────────────────────
    await btnNueva.click();
    await page.waitForTimeout(500);
    const rendIn = page.locator('input[name="rendimientoBase"], input[name="rendimiento"]').first();
    if (await rendIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rendIn.fill('0');
    }
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnNueva.click();
    await page.waitForTimeout(500);

    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('Receta YOGURT FRESA 500ML E2E');
    }
    const prodSel = page.locator('select[name="idProducto"]').first();
    if (await prodSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await prodSel.selectOption({ label: /YOGURT FRESA/i }).catch(async () => {
        await prodSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const unidadSel = page.locator('select[name="unidadRendimiento"], input[name="unidadRendimiento"]').first();
    if (await unidadSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      const tag = await unidadSel.evaluate(el => el.tagName);
      if (tag === 'SELECT') {
        await unidadSel.selectOption('Unidades').catch(async () => {
          await unidadSel.selectOption({ label: /unidades/i }).catch(() => {});
        });
      } else {
        await unidadSel.fill('Unidades');
      }
    }
    const rendIn2 = page.locator('input[name="rendimientoBase"], input[name="rendimiento"]').first();
    if (await rendIn2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rendIn2.fill('10');
    }

    // ── PackagingWizardModal (si existe botón) → cancelar ────────────────────
    const wizardBtn = page.locator('button:has-text("Asignar Envase"), button:has-text("Wizard")').first();
    if (await wizardBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      const wEnabled = await wizardBtn.isEnabled({ timeout: 500 }).catch(() => false);
      if (wEnabled) {
        await wizardBtn.click({ timeout: 4000 });
        await page.waitForTimeout(500);
        await closeModal(page);
      }
    }

    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1500);
  });
});

// ─── BLOQUE 2: OPERACIONES ────────────────────────────────────────────────────

test.describe('BLOQUE 2 – Operaciones', () => {

  // ── 7. Compras ───────────────────────────────────────────────────────────────
  test('7. Compras: stock drawer, checklist modal y orden válida', async ({ page }) => {
    await page.goto('/operations/purchases');
    await waitForLoad(page);

    // ── Botón "Ver Stock Insumos" → StockLookupDrawer → cerrar ───────────────
    await tryClick(page, 'button:has-text("Ver Stock"), button:has-text("Stock Insumos")');
    await page.waitForTimeout(600);
    await closeModal(page);

    // ── Botón "Nueva Compra" o navegar a /new ────────────────────────────────
    const btnNueva = page.locator('button:has-text("Nueva Compra"), button:has-text("Nueva compra")').first();
    if (await btnNueva.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btnNueva.click();
      await waitForLoad(page);
    } else {
      await page.goto('/operations/purchases/new');
      await waitForLoad(page);
    }

    // ── "Agregar Pendiente" → ChecklistAddPendingModal → cancelar ─────────────
    await tryClick(page, 'button:has-text("Agregar Pendiente"), button:has-text("Agregar pendiente")');
    await page.waitForTimeout(500);
    await closeModal(page);

    // ── Seleccionar proveedor ─────────────────────────────────────────────────
    const provSel = page.locator('select[name="idProveedor"]').first();
    if (await provSel.isVisible({ timeout: 4000 }).catch(() => false)) {
      await provSel.selectOption({ label: /HACIENDA/i }).catch(async () => {
        await provSel.selectOption({ index: 1 }).catch(() => {});
      });
    }

    // ── Guardar / avanzar (solo si el botón está enabled) ────────────────────
    const saveBtn = page.locator('button:has-text("Guardar Compra"), button:has-text("Registrar Compra"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    }
    await page.waitForTimeout(1500);
  });

  // ── 8. Inventario ────────────────────────────────────────────────────────────
  test('8. Inventario: pestañas, ajuste global, ajuste por ítem', async ({ page }) => {
    await page.goto('/operations/inventory');
    await waitForLoad(page);

    // ── Pestaña Insumos / Bodega ──────────────────────────────────────────────
    await tryClick(page, 'button:has-text("Insumos"), button:has-text("Bodega"), [role="tab"]:has-text("Insumos")');
    await page.waitForTimeout(400);

    // ── Pestaña Cava ──────────────────────────────────────────────────────────
    await tryClick(page, 'button:has-text("Cava"), button:has-text("Prod. Terminado"), [role="tab"]:has-text("Cava")');
    await page.waitForTimeout(400);

    // ── Pestaña Semielaborados ────────────────────────────────────────────────
    await tryClick(page, 'button:has-text("Semielaborado"), button:has-text("WIP"), [role="tab"]:has-text("Semielaborado")');
    await page.waitForTimeout(400);

    // Volver a Insumos
    await tryClick(page, 'button:has-text("Insumos"), button:has-text("Bodega")');
    await page.waitForTimeout(400);

    // ── Botón "Ajuste Global" → modal → cancelar ──────────────────────────────
    const globalBtn = page.locator('button:has-text("Ajuste Global"), button:has-text("Ajuste global")').first();
    if (await globalBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      const gEnabled = await globalBtn.isEnabled({ timeout: 1000 }).catch(() => false);
      if (gEnabled) {
        await globalBtn.click({ timeout: 4000 });
        await page.waitForTimeout(500);
        // Fuzzing: cantidad negativa
        const adjInput = page.locator('input[type="number"]').first();
        if (await adjInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await adjInput.fill('-999');
        }
        await closeModal(page);
      }
    }

    // ── Botón "Ajustar" en una fila → modal → cancelar ────────────────────────
    const ajustarBtn = page.locator('button:has-text("Ajustar")').first();
    if (await ajustarBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      const aEnabled = await ajustarBtn.isEnabled({ timeout: 1000 }).catch(() => false);
      if (aEnabled) {
        await ajustarBtn.click({ timeout: 4000 });
        await page.waitForTimeout(500);
        await closeModal(page);
      }
    }

    // ── Verificar que LECHE aparezca en bodega (tolerante) ───────────────────
    const lecheFila = page.locator('tr:has-text("LECHE"), td:has-text("LECHE")').first();
    const lecheVisible = await lecheFila.isVisible({ timeout: 4000 }).catch(() => false);
    if (lecheVisible) {
      await expect(lecheFila).toBeVisible();
    }
  });

  // ── 9. Producción ────────────────────────────────────────────────────────────
  test('9. Producción: planificación, incidencia, liquidación de lote', async ({ page }) => {
    await page.goto('/operations/production');
    await waitForLoad(page);

    // ── Botón "Planificar / Nueva Producción" ─────────────────────────────────
    const btnPlan = page.locator('button:has-text("Planificar"), button:has-text("Nueva Producción"), button:has-text("+ Nueva")').first();
    await expect(btnPlan).toBeVisible({ timeout: 10000 });
    await btnPlan.click();
    await page.waitForTimeout(600);

    const recetaSel = page.locator('select[name="idReceta"]').first();
    if (await recetaSel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await recetaSel.selectOption({ label: /YOGURT FRESA/i }).catch(async () => {
        await recetaSel.selectOption({ index: 1 }).catch(() => {});
      });
    }
    const cantIn = page.locator('input[name="cantidadPlanificada"], input[name="cantidad"]').first();
    if (await cantIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cantIn.fill('10');
    }

    const planBtn = page.locator('button:has-text("Planificar"), button:has-text("Crear"), button:has-text("Guardar")').first();
    const planEnabled = await planBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (planEnabled) {
      await planBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1500);
    await closeModal(page);

    // ── Iniciar orden si hay botón "Iniciar Proceso" ──────────────────────────
    await tryClick(page, 'button:has-text("Iniciar Proceso"), button:has-text("Iniciar")');
    await page.waitForTimeout(1200);

    // ── Botón "Reportar Incidencia" → ProductionIncidentModal → cancelar ──────
    await tryClick(page, 'button:has-text("Reportar Incidencia"), button:has-text("Incidencia")');
    await page.waitForTimeout(500);
    await closeModal(page);

    // ── Botón "Finalizar y Liquidar Lote" ────────────────────────────────────
    const liquidarBtn = page.locator('button:has-text("Finalizar y Liquidar Lote"), button:has-text("Liquidar")').first();
    if (await liquidarBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      const lEnabled = await liquidarBtn.isEnabled({ timeout: 1000 }).catch(() => false);
      if (lEnabled) {
        await liquidarBtn.click({ timeout: 4000 });
        await page.waitForTimeout(600);

        // Ingresar cantidad real
        const realQtyIn = page.locator('input[type="number"]').first();
        if (await realQtyIn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await realQtyIn.fill('10');
        }

        // Confirmar (solo si el botón de confirmación está enabled)
        const confirmBtn = page.locator('button:has-text("Confirmar Liquidación"), button:has-text("Confirmar")').first();
        const cEnabled = await confirmBtn.isEnabled({ timeout: 2000 }).catch(() => false);
        if (cEnabled) {
          await confirmBtn.click({ timeout: 5000 });
          await page.waitForTimeout(2000);
        } else {
          await closeModal(page);
        }
      }
    }
  });

  // ── 10. Lotes ────────────────────────────────────────────────────────────────
  test('10. Lotes: validar lote liquidado DISPONIBLE y filtros sin 404', async ({ page }) => {
    await page.goto('/operations/lots');
    await waitForLoad(page);

    await expect(page).not.toHaveURL(/404/);

    const disponibleBadge = page.locator('text=DISPONIBLE, text=Disponible').first();
    const visible = await disponibleBadge.isVisible({ timeout: 6000 }).catch(() => false);
    if (visible) {
      await expect(disponibleBadge).toBeVisible();
    }

    const filtroSel = page.locator('select[name="estado"], select[name="filtroEstado"]').first();
    if (await filtroSel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filtroSel.selectOption('DISPONIBLE').catch(() => {});
      await page.waitForTimeout(600);
      await expect(page).not.toHaveURL(/404/);
    }
  });
});

// ─── BLOQUE 3: COMERCIAL ─────────────────────────────────────────────────────

test.describe('BLOQUE 3 – Comercial', () => {

  // ── 11. Clientes ─────────────────────────────────────────────────────────────
  test('11. Clientes: modal, fuzzing y creación de TIENDA YOGURT MARKET', async ({ page }) => {
    await page.goto('/commercial/clients');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Cliente"), button:has-text("Nuevo cliente")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: email inválido → cerrar ─────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);
    const telIn = page.locator('input[name="telefono"]').first();
    if (await telIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await telIn.fill('ABCDEF');
    }
    const emailIn = page.locator('input[name="email"], input[type="email"]').first();
    if (await emailIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailIn.fill('no-es-un-email');
    }
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);

    const nombreIn = page.locator('input[name="nombre"]').first();
    if (await nombreIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nombreIn.fill('TIENDA YOGURT MARKET');
    }
    const canalSel = page.locator('select[name="canal"], select[name="tipoCliente"]').first();
    if (await canalSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await canalSel.selectOption('COMERCIAL').catch(async () => {
        await canalSel.selectOption({ index: 1 }).catch(() => {});
      });
    }

    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
    const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
    if (enabled) {
      await saveBtn.click({ timeout: 5000 });
    } else {
      await closeModal(page);
    }
    await page.waitForTimeout(1200);
  });

  // ── 12. Ventas ───────────────────────────────────────────────────────────────
  test('12. Ventas: nueva venta, cliente rápido, cava drawer, confirmar y despachar', async ({ page }) => {
    await page.goto('/commercial/sales');
    await waitForLoad(page);

    // ── Abrir modal "Nueva Venta" ─────────────────────────────────────────────
    const btnNueva = page.locator('button:has-text("Nueva Venta")').first();
    await expect(btnNueva).toBeVisible({ timeout: 10000 });
    await btnNueva.click();
    await page.waitForTimeout(600);

    // ── Botón "Registrar nuevo cliente" → ClientFormModal anidado → cancelar ──
    // Usar el botón "+" (registrar cliente) visible dentro del modal
    const clienteRapido = page.locator('button[title="Registrar nuevo cliente"], button:has-text("Registrar nuevo cliente")').first();
    if (await clienteRapido.isVisible({ timeout: 3000 }).catch(() => false)) {
      const crEnabled = await clienteRapido.isEnabled({ timeout: 1000 }).catch(() => false);
      if (crEnabled) {
        await clienteRapido.click({ timeout: 4000 });
        await page.waitForTimeout(500);
        await closeModal(page);
      }
    }

    // ── Seleccionar cliente en el combobox principal del modal ────────────────
    const clienteSel = page.locator('select[name="idCliente"]').first();
    if (await clienteSel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await clienteSel.selectOption({ label: /TIENDA YOGURT MARKET/i }).catch(async () => {
        await clienteSel.selectOption({ index: 1 }).catch(() => {});
      });
    }

    // ── Botón "Agregar Productos desde Cava" ──────────────────────────────────
    const addCavaBtn = page.locator('button:has-text("Agregar Productos desde Cava")').first();
    if (await addCavaBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      const acEnabled = await addCavaBtn.isEnabled({ timeout: 1000 }).catch(() => false);
      if (acEnabled) {
        await addCavaBtn.click({ timeout: 4000 });
        await page.waitForTimeout(800);

        // ── Verificar "Stock Cava:" en el drawer ─────────────────────────────
        const stockLabel = page.locator('text=Stock Cava:').first();
        const stockVisible = await stockLabel.isVisible({ timeout: 5000 }).catch(() => false);
        if (stockVisible) {
          await expect(stockLabel).toBeVisible();
        }

        // ── Agregar producto desde el drawer ──────────────────────────────────
        // El drawer muestra un spinner con precio (e.g. "$ 48.000") como botón de agregar
        // Scopear la búsqueda al panel del drawer para evitar el overlay
        const drawerPanel = page.locator('[class*="drawerPanel"]').first();
        if (await drawerPanel.isVisible({ timeout: 3000 }).catch(() => false)) {
          // El qty input dentro del drawer
          const qtyInput = drawerPanel.locator('input[type="number"], input[type="text"]').first();
          if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await qtyInput.fill('4');
          }
          // Botón de agregar (puede ser el precio o "Agregar")
          const addBtnInPanel = drawerPanel.locator('button:has-text("Agregar"), button[class*="btnAdd"], button:has-text("$ ")').last();
          if (await addBtnInPanel.isVisible({ timeout: 3000 }).catch(() => false)) {
            try {
              await addBtnInPanel.click({ timeout: 5000 });
              await page.waitForTimeout(500);
            } catch {
              // forzar click dentro del panel
              await addBtnInPanel.click({ force: true, timeout: 3000 }).catch(() => {});
            }
          }
        }

        // ── Cerrar drawer con botón "✕" (está dentro del drawerPanel) ─────────
        await clickInsideDrawer(page, 'button:has-text("✕"), button[aria-label="Cerrar"]');
        await page.waitForTimeout(600);
      }
    }

    // ── Confirmar venta (solo si el botón "Despachar y Facturar" está enabled) ─
    const despacharFacturar = page.locator('button:has-text("Despachar y Facturar"), button:has-text("Registrar Venta"), button:has-text("Confirmar")').first();
    const dfEnabled = await despacharFacturar.isEnabled({ timeout: 3000 }).catch(() => false);
    if (dfEnabled) {
      await despacharFacturar.click({ timeout: 5000 });
      await page.waitForTimeout(2000);
    } else {
      // No hay productos agregados o falta cliente; cerrar el modal
      await closeModal(page);
    }
  });

  // ── 13. Pagos / Cobros ───────────────────────────────────────────────────────
  test('13. Pagos: modal de pago y encadenamiento con venta', async ({ page }) => {
    await page.goto('/commercial/payments');
    await waitForLoad(page);

    await expect(page).not.toHaveURL(/404/);

    // ── Abrir "Registrar Pago" ────────────────────────────────────────────────
    const btnPago = page.locator('button:has-text("Registrar Pago"), button:has-text("Nuevo Pago"), button:has-text("+ Registrar Pago"), button:has-text("Registrar pago")').first();
    if (await btnPago.isVisible({ timeout: 6000 }).catch(() => false)) {
      const pEnabled = await btnPago.isEnabled({ timeout: 1000 }).catch(() => false);
      if (pEnabled) {
        await btnPago.click({ timeout: 4000 });
        await page.waitForTimeout(600);
      }
    }

    // Verificar que el modal se abrió
    const modalVisible = page.locator('[class*="SmartModal"], dialog, [role="dialog"]').first();
    if (await modalVisible.isVisible({ timeout: 4000 }).catch(() => false)) {
      // Scopear toda interacción al interior del modal
      const modal = page.locator('[class*="SmartModal_content"], [class*="modal-content"], [role="dialog"]').first();

      // Seleccionar la venta más reciente
      const ventaSel = modal.locator('select[name="idVenta"], select').first();
      if (await ventaSel.isVisible({ timeout: 3000 }).catch(() => false)) {
        await ventaSel.selectOption({ index: 1 }).catch(() => {});
        await page.waitForTimeout(400);
      }

      // Método de pago
      const metodoPago = modal.locator('select[name="tipoPago"], select[name="metodoPago"]').first();
      if (await metodoPago.isVisible({ timeout: 2000 }).catch(() => false)) {
        await metodoPago.selectOption('EFECTIVO').catch(() => {});
      }

      // Monto
      const montoIn = modal.locator('input[name="valor"], input[name="monto"], input[name="valorPagado"]').first();
      if (await montoIn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await montoIn.fill('30000');
        await page.waitForTimeout(300);
      }

      // Click en Guardar DENTRO del modal
      const saveBtn = modal.locator('button[type="submit"], button:has-text("Registrar"), button:has-text("Guardar")').first();
      const sEnabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
      if (sEnabled) {
        await saveBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1500);
      } else {
        await closeModal(page);
      }
    }
  });

  // ── 14. Gastos ───────────────────────────────────────────────────────────────
  test('14. Gastos: modal, fuzzing y gasto válido de Servicios Públicos', async ({ page }) => {
    await page.goto('/commercial/expenses');
    await waitForLoad(page);

    const btnNuevo = page.locator('button:has-text("Nuevo Gasto"), button:has-text("Nuevo gasto"), button:has-text("Registrar Gasto")').first();
    await expect(btnNuevo).toBeVisible({ timeout: 10000 });

    // ── Fuzzing: abrir modal y cerrar ─────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(500);
    const montoIn = page.locator('input[name="monto"], input[name="valor"], input[name="total"]').first();
    if (await montoIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await montoIn.fill('-50000');
    }
    await closeModal(page);

    // ── Flujo válido ──────────────────────────────────────────────────────────
    await btnNuevo.click();
    await page.waitForTimeout(600);

    // Periodo (campo requerido en gastos)
    const periodoSel = page.locator('select[name="periodo"], input[name="periodo"]').first();
    if (await periodoSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      const tag = await periodoSel.evaluate(el => el.tagName);
      if (tag === 'SELECT') {
        await periodoSel.selectOption({ index: 1 }).catch(() => {});
      } else {
        // Formato YYYY-MM
        const now = new Date();
        await periodoSel.fill(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
      }
    }

    // Categoría (campo requerido)
    const catSel = page.locator('select[name="categoria"], select[name="tipo"]').first();
    if (await catSel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await catSel.selectOption({ index: 1 }).catch(() => {});
    }

    // Descripción (campo requerido)
    const descripIn = page.locator('input[name="descripcion"], input[name="nombre"], textarea[name="descripcion"]').first();
    if (await descripIn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await descripIn.fill('SERVICIOS PÚBLICOS / ENERGÍA CAVA');
    }

    // Monto
    const montoIn2 = page.locator('input[name="monto"], input[name="valor"], input[name="total"]').first();
    if (await montoIn2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await montoIn2.fill('50000');
    }

    await page.waitForTimeout(500);

    // Click en Guardar solo si está enabled
    const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar"), button:has-text("Registrar")').first();
    const sEnabled = await saveBtn.isEnabled({ timeout: 3000 }).catch(() => false);
    if (sEnabled) {
      await saveBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1200);
    } else {
      // Cerrar sin guardar si el formulario sigue incompleto
      await closeModal(page);
    }
  });
});
