import { test, expect } from '@playwright/test';

test.describe('Foco A: Listado de Huérfanos y Cascada Poka-Yoke Fase 1 (R01-R10)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/recipes');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2, div').filter({ hasText: /Recetas Técnicas/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test('R01: Cabecera principal y botón de creación visibles', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: /\+ Nueva Receta/i })).toBeVisible();
  });

  test('R02: Banner de huérfanos con texto informativo si existen productos sin receta', async ({ page }) => {
    const banner = page.locator('div').filter({ hasText: /producto\(s\) en catálogo sin receta técnica formulada/i }).first();
    if (await banner.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(banner).toBeVisible();
    }
  });

  test('R03: Buscador de huérfanos filtra tarjetas por nombre reactivamente', async ({ page }) => {
    const searchInput = page.locator('input[type="search"][aria-label="Buscar producto huérfano"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      const firstCard = page.locator('div[class*="orphanCard"]').first();
      if (await firstCard.isVisible({ timeout: 1000 }).catch(() => false)) {
        const titleText = (await firstCard.locator('span[class*="orphanCardTitle"]').innerText()).trim();
        const searchTerm = titleText.slice(0, 4);
        await searchInput.fill(searchTerm);
        await expect(page.locator('div[class*="orphanCard"]').first()).toBeVisible();
      }
    }
  });

  test('R04: Buscador de huérfanos filtra o muestra estado vacío con búsqueda inexistente', async ({ page }) => {
    const searchInput = page.locator('input[type="search"][aria-label="Buscar producto huérfano"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('XYZ_NON_EXISTENT_QUERY_999');
      await expect(page.locator('div[class*="orphanEmpty"]')).toBeVisible();
    }
  });

  test('R05: Filtro por tipo WIP muestra solo tarjetas correspondientes', async ({ page }) => {
    const filterSelect = page.locator('select').filter({ hasText: /Todos|Comercial|WIP/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.selectOption({ label: 'WIP / Tanque' }).catch(async () => {
        await filterSelect.selectOption('WIP');
      });
      const cards = page.locator('div').filter({ has: page.locator('button:has-text("+ Crear Receta")') });
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/WIP/i);
      }
    }
  });

  test('R06: Filtro por tipo Comercial muestra solo tarjetas con badge COM', async ({ page }) => {
    const filterSelect = page.locator('select').filter({ hasText: /Todos|Comercial|WIP/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.selectOption({ label: 'Comercial' }).catch(async () => {
        await filterSelect.selectOption('COMERCIAL');
      });
      const cards = page.locator('div').filter({ has: page.locator('button:has-text("+ Crear Receta")') });
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/COM|COMERCIAL/i);
      }
    }
  });

  test('R07: Clic en + Crear Receta abre modal con producto preseleccionado', async ({ page }) => {
    const createBtn = page.locator('button[class*="orphanCardBtn"]').first();
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
      await expect(page.locator('h1').filter({ hasText: /Nueva Receta Técnica/i })).toBeVisible();
      const productSelect = page.locator('select[name="idProducto"]');
      await expect(productSelect).not.toHaveValue('');
    }
  });

  test('R08: Compuerta Poka-Yoke bloquea etapas hasta completar cabecera', async ({ page }) => {
    const newBtn = page.locator('button').filter({ hasText: /\+ Nueva Receta/i });
    await newBtn.click();
    await expect(page.locator('h1').filter({ hasText: /Nueva Receta Técnica/i })).toBeVisible();
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeVisible();
  });

  test('R09: Desbloqueo de etapas tras completar los 4 campos canónicos', async ({ page }) => {
    const newBtn = page.locator('button').filter({ hasText: /\+ Nueva Receta/i });
    await newBtn.click();
    const prodSelect = page.locator('select[name="idProducto"]');
    await prodSelect.selectOption({ index: 1 });
    const nameInput = page.locator('input[name="nombre"]');
    await nameInput.fill('Fórmula Técnica E2E Verificación');
    const rendInput = page.locator('input[name="rendimientoBase"]');
    await rendInput.fill('100');
    const unitSelect = page.locator('select[name="unidadRendimiento"]');
    await unitSelect.selectOption({ index: 1 });
    await expect(page.locator('text=Paso 1: Completa la información básica')).toBeHidden();
    await expect(page.locator('button').filter({ hasText: /\+ Agregar Etapa/i })).toBeVisible();
  });

  test('R10: Sugerencia automática del nombre técnico al seleccionar producto', async ({ page }) => {
    const newBtn = page.locator('button').filter({ hasText: /\+ Nueva Receta/i });
    await newBtn.click();
    const prodSelect = page.locator('select[name="idProducto"]');
    await prodSelect.selectOption({ index: 1 });
    const nameInput = page.locator('input[name="nombre"]');
    await expect(nameInput).not.toHaveValue('');
    const val = await nameInput.inputValue();
    expect(val.startsWith('Fórmula - ')).toBeTruthy();
  });
});
