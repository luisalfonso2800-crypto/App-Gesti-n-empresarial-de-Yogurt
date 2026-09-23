text
# MODIFICACIÓN DEL TEST 1 — CAPTURA DE IDs PARA CADENA

## ⚠️ REGLAS ANTI-QUEMA
1. Modelo: Gemini Flash (Low).
2. PROHIBIDO subagentes.
3. LÍMITES: 6 lecturas, 4 ediciones, 15 llamadas.
4. NO tocar código de producción.
5. NO tocar suppliers-complete.spec.js, remediation-poka-yoke.spec.js,
   value-chain-presentation-product.spec.js (si existe).
6. DETENERSE al terminar.

## Contexto
El archivo apps/web/e2e/presentations-validations.spec.js tiene 25
tests que pasan. Necesitamos MODIFICARLO para que capture los IDs
de las presentaciones creadas y los persista en un archivo JSON.

Esto es para que los SIGUIENTES tests (producto, receta,
producción, venta) puedan usar esos IDs y encadenarse.

## Tareas

### T1. Leer el archivo actual
Leer apps/web/e2e/presentations-validations.spec.js (1 lectura).

### T2. Crear helper de persistencia
Crear apps/web/e2e/helpers/chain-state.js con:
- saveChainState(module, data)
- loadChainState(module)
- clearChainState(module)
Guarda en apps/web/e2e/.test-data/<module>.json.

### T3. Modificar el spec para capturar IDs
Modificar apps/web/e2e/presentations-validations.spec.js:

1. Importar el helper.
2. Añadir un objeto CHAIN_STATE al inicio del describe.
3. En los tests que crean presentaciones (05-11, 25), capturar el
   ID vía `page.waitForResponse()`.
4. Guardar el ID en CHAIN_STATE.presentacionesCreadas[tipo].
5. En afterAll: llamar a saveChainState('presentations', CHAIN_STATE)
   ANTES del cleanup.
6. IMPORTANTE: NO borrar las presentaciones creadas con el nombre
   que empieza con E2E_CHAIN_ (esas son para la cadena).
   Solo borrar las que empiezan con E2E_TEST_PRES_.

Ejemplo del cambio en TEST 05:

```javascript
test('TEST 05 - Crear con ENVASE', async ({ page }) => {
  const nombre = `E2E_TEST_PRES_ENVASE_${Date.now()}`;
  
  await page.goto('/catalog/presentations');
  await page.getByRole('button', { name: /nueva presentaci/i }).click();
  await page.getByLabel(/nombre/i).first().fill(nombre);
  await page.getByLabel(/tipo de envase/i).selectOption('ENVASE');
  await page.getByLabel(/cantidad.*ml/i).fill('250');
  await page.getByLabel(/cantidad.*oz/i).fill('8');

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('/presentation') && resp.status() === 201,
      { timeout: 10000 }
    ),
    page.getByRole('button', { name: /crear presentaci/i }).click(),
  ]);
  const body = await response.json();
  const id = body.id || body.data?.id;

  // Guardar para la cadena
  CHAIN_STATE.presentacionesCreadas['ENVASE'] = { id, nombre };

  await expect(page.getByText(nombre)).toBeVisible();
});
Aplicar el mismo patrón a TEST 06-11 y TEST 25.

T4. Añadir un test de creación "maestra" para la cadena
Añadir al final del describe un test "TEST 26 - Crear presentación
maestra BOTELLA 250ml para cadena":

javascript
test('TEST 26 - Crear presentación maestra para cadena', async ({ page }) => {
  const nombre = `E2E_CHAIN_PRES_BOTELLA_250_${Date.now()}`;
  
  await page.goto('/catalog/presentations');
  await page.getByRole('button', { name: /nueva presentaci/i }).click();
  await page.getByLabel(/nombre/i).first().fill(nombre);
  await page.getByLabel(/tipo de envase/i).selectOption('BOTELLA');
  await page.getByLabel(/cantidad.*ml/i).fill('250');
  await page.getByLabel(/cantidad.*oz/i).fill('8');

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('/presentation') && resp.status() === 201,
      { timeout: 10000 }
    ),
    page.getByRole('button', { name: /crear presentaci/i }).click(),
  ]);
  const body = await response.json();
  const id = body.id || body.data?.id;

  CHAIN_STATE.presentacionesCreadas['MASTER_BOTELLA_250'] = { id, nombre };

  await expect(page.getByText(nombre)).toBeVisible();
});
Esta presentación es la que van a usar los tests siguientes.

T5. Modificar el afterAll
javascript
test.afterAll(async ({ request }) => {
  // 1. Guardar el estado para la cadena
  saveChainState('presentations', CHAIN_STATE);
  
  // 2. Cleanup: solo borrar las que empiezan con E2E_TEST_PRES_
  // (NO borrar las E2E_CHAIN_)
  const presentacionesAEliminar = /* ... lógica ... */;
  for (const id of presentacionesAEliminar) {
    await request.delete(`/api/v1/presentations/${id}`).catch(() => {});
  }
});

T6. Correr la suite modificada
pnpm --filter web exec playwright test presentations-validations --reporter=list --timeout=20000

Esperado: 26 passed (25 originales + 1 maestra).

T7. Verificar el JSON
Verificar que apps/web/e2e/.test-data/presentations.json existe y
contiene los IDs capturados.

T8. Documentar
Actualizar apps/prompts/testing/INFORME-E2E-PRESENTACIONES-VALIDATIONS.md con:

Ahora son 26 tests.

Los IDs capturados (JSON).

Persistencia en .test-data/presentations.json.

T9. Commit
git add apps/web/e2e/presentations-validations.spec.js
git add apps/web/e2e/helpers/chain-state.js
git add apps/prompts/testing/INFORME-E2E-PRESENTACIONES-VALIDATIONS.md
git commit -m "test(e2e): capture presentation IDs for value chain (26 tests)"

Entrega
26 tests passing.

JSON con IDs persistidos.

Máximo 1 commit.

DETENERSE.

Notas
Si algún test falla por el cambio, reportar error exacto.

NO modificar la lógica de validación, solo añadir captura de IDs.

Si la respuesta no tiene .id ni .data.id, consultar la API después:
GET /api/v1/presentations?search=${nombre}.

text

## 📋 Pasos antes de lanzar

### 1. Verifica que estás en la rama correcta

```powershell
git status
git branch --show-current
Debe decir test/e2e-by-module o similar.