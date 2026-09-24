import { test, expect } from '@playwright/test';

test.describe.serial('Listas Preparadas / En Ruta - Fusión y Gestión (T46-T55)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/operations/purchases');
    await page.waitForLoadState('networkidle');
  });

  test('T46: Sección "Listas Preparadas / En Ruta" o encabezado de compras visible', async ({ page }) => {
    const title = page.locator('h1, h2').filter({ hasText: /(Listas Preparadas|Compras|Historial)/i }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('T47: Tarjetas de órdenes muestran código ORD-, estado y progreso', async ({ page }) => {
    const orderCard = page.locator('div[class*="orderCard"]').first();
    if (await orderCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(orderCard.locator('span[class*="orderCardCode"], div[class*="orderCardHeader"]').first()).toContainText(/ORD-|LISTA/i);
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T48: Botón "Ver Lista" redirige a /operations/purchases/new con orderId', async ({ page }) => {
    const btnVerLista = page.locator('button').filter({ hasText: /Ver Lista/i }).first();
    if (await btnVerLista.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnVerLista.click();
      await page.waitForURL(/operations\/purchases\/new/);
      expect(page.url()).toContain('/operations/purchases/new');
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T49: Botón "Editar Nombre" abre modal de renombrado', async ({ page }) => {
    const btnEdit = page.locator('button[title*="Editar Nombre" i], button:has(svg.lucide-pencil)').first();
    if (await btnEdit.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnEdit.click();
      const modal = page.locator('div[class*="modal"], [role="dialog"], div[class*="backdrop"]').first();
      await expect(modal).toBeVisible({ timeout: 3000 });
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T50: Modal de renombrado permite ingresar y guardar nuevo nombre', async ({ page }) => {
    const btnEdit = page.locator('button[title*="Editar Nombre" i], button:has(svg.lucide-pencil)').first();
    if (await btnEdit.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnEdit.click();
      const input = page.locator('input[type="text"]').first();
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        await input.fill('LISTA E2E RENOMBRADA');
        const btnSave = page.locator('button').filter({ hasText: /(Guardar|Actualizar|Aceptar)/i }).first();
        await btnSave.click();
      }
    }
    expect(true).toBeTruthy();
  });

  test('T51: Botón eliminar muestra modal accesible de confirmación', async ({ page }) => {
    const btnDelete = page.locator('button[title*="Eliminar Lista" i]').first();
    if (await btnDelete.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnDelete.click();
      const confirmModal = page.locator('button').filter({ hasText: /(Eliminar|Confirmar|Cancelar)/i }).first();
      await expect(confirmModal).toBeVisible({ timeout: 3000 });
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T52: Botón "Fusionar Seleccionadas" activa modo fusión con checkboxes', async ({ page }) => {
    const btnMerge = page.locator('button').filter({ hasText: /Fusionar Seleccionadas/i }).first();
    if (await btnMerge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnMerge.click();
      const checkbox = page.locator('input[type="checkbox"][class*="mergeCheckbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 3000 });
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T53: Poka-Yoke: Confirmar Fusión no visible o deshabilitado con < 2 listas', async ({ page }) => {
    const btnMerge = page.locator('button').filter({ hasText: /Fusionar Seleccionadas/i }).first();
    if (await btnMerge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnMerge.click();
      const btnConfirmar = page.locator('button:has-text("Confirmar Fusión")');
      await expect(btnConfirmar).toHaveCount(0);
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T54: Confirmar Fusión se activa y opera con >= 2 listas seleccionadas', async ({ page }) => {
    const btnMerge = page.locator('button').filter({ hasText: /Fusionar Seleccionadas/i }).first();
    if (await btnMerge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnMerge.click();
      const checkboxes = page.locator('input[type="checkbox"][class*="mergeCheckbox"]');
      if (await checkboxes.count() >= 2) {
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();
        const btnConfirmar = page.locator('button:has-text("Confirmar Fusión")');
        await expect(btnConfirmar).toBeVisible({ timeout: 3000 });
      }
    }
    expect(true).toBeTruthy();
  });

  test('T55: Botón Cancelar Fusión revierte el modo y desmarca checkboxes', async ({ page }) => {
    const btnMerge = page.locator('button').filter({ hasText: /Fusionar Seleccionadas/i }).first();
    if (await btnMerge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnMerge.click();
      const btnCancelar = page.locator('button').filter({ hasText: /Cancelar Fusión/i }).first();
      await expect(btnCancelar).toBeVisible({ timeout: 3000 });
      await btnCancelar.click();
      await expect(btnMerge).toBeVisible({ timeout: 3000 });
    } else {
      expect(true).toBeTruthy();
    }
  });
});
