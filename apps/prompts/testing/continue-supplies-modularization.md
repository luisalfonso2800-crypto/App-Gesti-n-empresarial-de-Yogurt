# CONTINUACIÓN E2E — MODULARIZACIÓN DE INSUMOS (T2 A T5)

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, dev servers, builds o git.
4. PROHIBIDO tocar código de producción en `apps/web/src` o `apps/api/src`.
5. LÍMITES DUROS: Máximo 3 lecturas, máximo 4 archivos editados/creados, 8 llamadas totales.
6. LÍMITE DE TAMAÑO: Ningún archivo `.spec.js` nuevo puede exceder las 150 líneas ni usar bucles `for (const ... of ...)`.
7. Al terminar de escribir los archivos, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 🛠️ TAREAS A COMPLETAR:

### T2. Registrar Script en `apps/web/package.json`
Modificar `apps/web/package.json` para agregar dentro de `"scripts"`:
```json
"test:e2e:lint": "node e2e/helpers/check-e2e-limits.js"




INSTRUCIONES:
División propuesta
Distribución de tests
text
T01-T16  (16 tests) → supplies-basics.spec.js
T17-T24  ( 8 tests) → supplies-advanced.spec.js
T25-T36  (12 tests) → supplies-validations.spec.js
T37-T43  ( 7 tests) → supplies-duplicates.spec.js
T44      ( 1 test ) → supplies-chain.spec.js
Pero cada archivo tiene que ser ≤ 15 tests. Entonces:

text
T01-T14  (14) → supplies-basics.spec.js
T15-T25  (11) → supplies-advanced.spec.js
T26-T36  (11) → supplies-validations.spec.js
T37-T43  ( 7) → supplies-duplicates.spec.js
T44      ( 1) → supplies-chain.spec.js
Total: 5 archivos. Máximo 14 tests por archivo.

📋 T3 — Helpers compartidos (3 archivos)
T3.1 apps/web/e2e/helpers/safe-visible.js (~15 líneas)
javascript
export async function safeIsVisible(locator, timeout = 300) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}
T3.2 apps/web/e2e/helpers/supply-modal.js (~70 líneas)
javascript
import { safeIsVisible } from './safe-visible.js';

export async function openSupplyModal(page) {
  const newBtn = page.getByRole('button', { name: /nuevo registro/i });
  await newBtn.waitFor({ state: 'visible', timeout: 5000 });
  await newBtn.click();
  await page.getByRole('heading', { name: /nuevo insumo/i })
    .waitFor({ state: 'visible', timeout: 3000 });
}

export async function closeSupplyModal(page) {
  const cancelBtn = page.getByRole('button', { name: /cancelar/i });
  if (await safeIsVisible(cancelBtn, 300)) {
    await cancelBtn.click({ timeout: 1500, force: true }).catch(() => {});
  } else {
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(250).catch(() => {});
}

export function getSupplyLocators(page) {
  return {
    nameInput: page.getByPlaceholder(/ej:\s*leche entera/i),
    brandInput: page.getByLabel(/marca/i),
    catSelect: page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione categor/i }) }),
    empaqueSelect: page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione empaque/i }) }),
    unitSelect: page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione unidad/i }) }),
    stockInput: page.getByLabel(/stock m[ií]nimo/i),
    densityInput: page.getByLabel(/densidad/i),
    costInput: page.getByLabel(/costo base referencial/i),
    submitBtn: page.getByRole('button', { name: /guardar insumo/i }).first(),
    cancelBtn: page.getByRole('button', { name: /cancelar/i }),
  };
}
T3.3 apps/web/e2e/helpers/supply-form.js (~50 líneas)
javascript
import { safeIsVisible } from './safe-visible.js';

export async function fillBaseFields(locators, timestamp) {
  const name = `E2E_TEST_SUPPLY_${timestamp}`;
  if (await safeIsVisible(locators.nameInput, 300)) await locators.nameInput.fill(name);
  if (await safeIsVisible(locators.brandInput, 300)) await locators.brandInput.fill('GENERICA');
  if (await safeIsVisible(locators.unitSelect, 300)) {
    await locators.unitSelect.selectOption({ index: 1 }, { timeout: 1500 }).catch(() => {});
  }
  if (await safeIsVisible(locators.stockInput, 300)) await locators.stockInput.fill('10');
  if (await safeIsVisible(locators.densityInput, 300)) await locators.densityInput.fill('1.0');
  if (await safeIsVisible(locators.costInput, 300)) await locators.costInput.fill('1000');
  return name;
}

export async function selectSafe(selectLocator, value) {
  await selectLocator.selectOption(value, { timeout: 1500 }).catch(() => {});
}
📋 T4 — Archivos de test modulares (5 archivos)
Carpeta nueva: apps/web/e2e/supplies/

T4.1 supplies-basics.spec.js (~140 líneas, 14 tests)
Tests: T01-T14

T01: Nombre vacío bloquea submit

T02: Nombre solo espacios bloquea submit

T03: Nombre 500 chars documentado

T04: Nombre con <script> sanitizado

T05: Marca vacía bloquea submit

T06: Marca solo espacios bloquea submit

T07: Marca válida permitida

T08-T14: Empaques UNIDAD, ENVASE, BOLSA, CAJA, BULTO, BOTELLA, BIDÓN

T4.2 supplies-advanced.spec.js (~140 líneas, 11 tests)
Tests: T15-T25

T15: Empaque CANASTILLA

T16: Empaque OTRO

T17: Empaque sin selección

T18-T23: Unidades base (kg, g, l, ml, oz, und)

T24: Unidad base vacía

T25: Stock mínimo negativo

T4.3 supplies-validations.spec.js (~140 líneas, 11 tests)
Tests: T26-T36

T26: Stock mínimo no numérico

T27: Stock mínimo decimal

T28: Densidad negativa

T29: Densidad >5

T30: Densidad decimal 1.03

T31: Costo base negativo

T32: Costo base no numérico

T33: Costo base decimal

T34: Todos los campos vacíos

T35: Solo nombre

T36: Happy path

T4.4 supplies-duplicates.spec.js (~120 líneas, 7 tests)
Tests: T37-T43

T37: Crear Azúcar E2E

T38: Rechazar duplicado exacto

T39: Case insensitive

T40: Sin tildes

T41: Espacios trim

T42: Nombre compuesto permitido

T43: Sufijo distinto permitido

T4.5 supplies-chain.spec.js (~60 líneas, 1 test)
Tests: T44

Crear Insumo Maestro Leche Entera

Capturar ID

Guardar en .test-data/supplies.json

📋 Prompt completo para T3 + T4 + T5
text
# MODULARIZACIÓN E2E — INSUMOS (T3, T4, T5)

## ⚠️ REGLAS
1. Modelo: Gemini Flash (Low).
2. PROHIBIDO subagentes.
3. NO ejecutar Playwright.
4. NO tocar código de producción.
5. LÍMITES: 20 lecturas, 12 ediciones.
6. DETENERSE al terminar.

## Contexto
supplies-validations.spec.js tiene 343 líneas y usa un loop
parametrizado. Hay que modularizar respetando check-e2e-limits.js
(≤ 150 líneas, ≤ 15 tests, sin loops).

## T3 — Helpers compartidos

En apps/web/e2e/helpers/, crear:

### T3.1 safe-visible.js (~15 líneas)
Exportar: safeIsVisible(locator, timeout = 300)

### T3.2 supply-modal.js (~70 líneas)
Exportar:
  openSupplyModal(page)
  closeSupplyModal(page)
  getSupplyLocators(page)
Importa safeIsVisible de ./safe-visible.js

### T3.3 supply-form.js (~50 líneas)
Exportar:
  fillBaseFields(locators, timestamp)
  selectSafe(selectLocator, value)
Importa safeIsVisible de ./safe-visible.js

## T4 — Archivos de test modulares

En apps/web/e2e/supplies/, crear:

### T4.1 supplies-basics.spec.js (~140 líneas, 14 tests)
Tests T01-T14 como tests EXPLÍCITOS (sin loops).
Cada test < 15 líneas.
Importar helpers desde ../helpers/.

Estructura:
  test.describe('Insumos - Validaciones básicas', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/catalog/supplies');
      await openSupplyModal(page);
    });
    test.afterEach(async ({ page }) => {
      await closeSupplyModal(page);
    });

    test('T01 - Nombre vacío bloquea submit', async ({ page }) => {
      const loc = getSupplyLocators(page);
      // No llenar nombre
      if (await safeIsVisible(loc.submitBtn, 500)) {
        await loc.submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
      }
      await page.waitForTimeout(300);
      await expect(page.getByRole('heading', { name: /nuevo insumo/i }))
        .toBeVisible({ timeout: 2000 });
    });

    // ... repetir el patrón para T02-T14
  });

### T4.2 supplies-advanced.spec.js (~140 líneas, 11 tests)
Tests T15-T25.

CRÍTICO: TODOS los selectOption con { timeout: 1500 } y .catch(() => {}).

Ejemplo:
  await loc.empaqueSelect.selectOption('UNIDAD', { timeout: 1500 }).catch(() => {});

### T4.3 supplies-validations.spec.js (~140 líneas, 11 tests)
Tests T26-T36.
Mismo patrón que T4.2.

### T4.4 supplies-duplicates.spec.js (~120 líneas, 7 tests)
Tests T37-T43.

### T4.5 supplies-chain.spec.js (~60 líneas, 1 test)
Test T44.
Capturar ID, guardar en .test-data/supplies.json.

## T5 — Reportar
- Archivos creados con líneas de cada uno.
- Comando para el humano:
  pnpm --filter web exec playwright test supplies/ --reporter=list --timeout=20000
- Verificar con: pnpm test:e2e:lint

## NO commitear

## Entrega
- Archivos creados.
- Reporte.
- NO commitear.
- DETENERSE.
📋 Después del refactor
Verificar estructura
powershell
Get-ChildItem apps\web\e2e\supplies\ | Select-Object Name
Get-ChildItem apps\web\e2e\supplies\*.spec.js | ForEach-Object {
  "$($_.Name): $((Get-Content $_.FullName).Count) líneas"
}
Esperado: cada archivo < 150 líneas.

Correr el guardián
powershell
pnpm test:e2e:lint
Esperado: 0 violaciones.

Correr los tests
powershell
pnpm --filter web exec playwright test supplies/ --reporter=list --timeout=20000
Esperado: ~44 tests pasando en < 5 minutos.