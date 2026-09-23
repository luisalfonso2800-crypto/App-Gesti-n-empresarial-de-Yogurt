# TEST E2E — PRESENTACIONES — VALIDACIÓN DE INPUTS

## ⚠️ REGLAS ANTI-QUEMA
1. Modelo: Gemini Flash (Low).
2. PROHIBIDO subagentes.
3. LÍMITES: 8 lecturas, 2 ediciones, 25 llamadas.
4. NO tocar código de producción.
5. Los tests crean datos con prefijo E2E_TEST_PRES_<timestamp>
   y los limpian en afterAll.
6. NO tocar apps/web/e2e/remediation-poka-yoke.spec.js ni
   apps/web/e2e/suppliers-complete.spec.js.
7. DETENERSE al terminar.

## Contexto
La BD está levantada. Los tests meten datos REALES y los limpian.
Módulo: apps/web/src/app/catalog/presentations/
Formulario: "Nueva Presentación Comercial"
Campos: nombre, tipoEnvase, cantidadOz, cantidadMl, imagen,
        observaciones, activa.
Objetivo: validar que cada input rechaza datos inválidos.

## Criterio de "correcto" cuando el sistema rechaza
El test pasa si AL HACER CLICK EN "Crear Presentación" se cumple
AL MENOS UNO de estos:
1. La presentación NO se crea (no aparece en la tabla).
2. Aparece un mensaje de error visible indicando el motivo.
3. El modal NO se cierra.

El criterio más fuerte es el #2 (mensaje de error visible).

## Comportamiento esperado por campo

### Nombre
- Vacío "" → Muestra mensaje de "requerido".
- Solo espacios "   " → Muestra mensaje (probablemente "requerido").
- 500 chars → Documentar comportamiento real (trunca o rechaza).
- `<script>alert(1)</script>` → El script NO se ejecuta (crítico).

### Cantidad OZ / ML
- Negativo "-5" → Rechaza con mensaje.
- Cero "0" → Documentar comportamiento real (permite o rechaza).
- Texto "abc" → Rechaza con mensaje.
- Decimal "1.5" → Permite.
- Decimal "1.55" → Documentar comportamiento real (redondea, rechaza
  o trunca).

### Tipo Envase
- Cada opción (ENVASE, BOTELLA, BOLSA, VASO, BALDE, COPITA, OTRO) →
  Guarda correctamente.
- Sin seleccionar → Rechaza con mensaje.
- BALDE sin cantidadMl → Rechaza (Poka-Yoke HAL-F4-02).

## Tareas

### T1. Leer patrón
Leer apps/web/e2e/suppliers-complete.spec.js (patrón que funciona).

### T2. Leer componente
Leer SOLO:
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/presentations/components/modal-parts/PresentationCapacityFields.jsx

### T3. Crear archivo de tests
apps/web/e2e/presentations-validations.spec.js

Estructura:
```javascript
import { test, expect } from '@playwright/test';

const TEST_PREFIX = `E2E_TEST_PRES_${Date.now()}`;
const createdIds = [];

test.describe('Presentaciones - Validación de inputs', () => {
  test.afterAll(async () => {
    // cleanup: eliminar presentaciones creadas con TEST_PREFIX
  });

  // Bloque 1: Nombre
  test('TEST 01 - Nombre vacío: muestra error', async ({ page }) => { ... });
  test('TEST 02 - Nombre solo espacios: muestra error', async ({ page }) => { ... });
  test('TEST 03 - Nombre 500 chars: documentar comportamiento', async ({ page }) => { ... });
  test('TEST 04 - Nombre con <script>: no ejecuta script', async ({ page }) => { ... });

  // Bloque 2: Tipo Envase (8 tests)
  test('TEST 05 - Crear con ENVASE', async ({ page }) => { ... });
  test('TEST 06 - Crear con BOTELLA', async ({ page }) => { ... });
  test('TEST 07 - Crear con BOLSA', async ({ page }) => { ... });
  test('TEST 08 - Crear con VASO', async ({ page }) => { ... });
  test('TEST 09 - Crear con BALDE (requiere cantidadMl)', async ({ page }) => { ... });
  test('TEST 10 - Crear con COPITA', async ({ page }) => { ... });
  test('TEST 11 - Crear con OTRO', async ({ page }) => { ... });
  test('TEST 12 - Sin envase: muestra error', async ({ page }) => { ... });

  // Bloque 3: Cantidad OZ (5 tests)
  test('TEST 13 - OZ negativo: muestra error', async ({ page }) => { ... });
  test('TEST 14 - OZ texto "abc": muestra error', async ({ page }) => { ... });
  test('TEST 15 - OZ decimal 1.5: permite y guarda', async ({ page }) => { ... });
  test('TEST 16 - OZ 1.55: documentar comportamiento', async ({ page }) => { ... });
  test('TEST 17 - OZ cero: documentar comportamiento', async ({ page }) => { ... });

  // Bloque 4: Cantidad ML (5 tests)
  test('TEST 18 - ML negativo: muestra error', async ({ page }) => { ... });
  test('TEST 19 - ML texto "abc": muestra error', async ({ page }) => { ... });
  test('TEST 20 - ML decimal 250.5: permite y guarda', async ({ page }) => { ... });
  test('TEST 21 - ML 250.55: documentar comportamiento', async ({ page }) => { ... });
  test('TEST 22 - ML cero: documentar comportamiento', async ({ page }) => { ... });

  // Bloque 5: Integridad (3 tests)
  test('TEST 23 - Todos vacíos: muestra error', async ({ page }) => { ... });
  test('TEST 24 - Solo nombre: muestra error', async ({ page }) => { ... });
  test('TEST 25 - Happy path: crea y aparece en tabla', async ({ page }) => { ... });
});
T4. Selectores Playwright
Usar SOLO selectores válidos:

page.getByLabel('Nombre de la Presentación')

page.getByRole('button', { name: 'Crear Presentación' })

page.getByRole('combobox', { name: 'Tipo de Envase' })

page.getByPlaceholder('EJ: BOTELLA VIDRIO 250ML')

page.locator('[data-testid="..."]') si existen testids.

NO combinar CSS + text en el mismo locator.

T5. Correr los tests
pnpm --filter web exec playwright test presentations-validations --reporter=list --timeout=20000

T6. Documentar cada test
Crear apps/prompts/testing/INFORME-E2E-PRESENTACIONES-VALIDATIONS.md con:

Tabla: TEST | Estado | Comportamiento observado.

Si falla: hallazgo (bug de producción) o problema del test.

Especialmente para los tests "documentar comportamiento":
describir qué hace el sistema realmente.

T7. Commit
Solo si todos pasan o si los fallos son hallazgos documentados.
git add apps/web/e2e/presentations-validations.spec.js
git add apps/prompts/testing/INFORME-E2E-PRESENTACIONES-VALIDATIONS.md
git commit -m "test(e2e): presentations input validations (25 tests)"

Entrega
INFORME-E2E-PRESENTACIONES-VALIDATIONS.md

Máximo 1 commit.

DETENERSE.