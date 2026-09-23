Los tests a implementar (~25-30)
text
Bloque 1: Nombre (4)
- TEST 01: vacío → error
- TEST 02: solo espacios → error
- TEST 03: 500 chars → documentar
- TEST 04: <script> → no ejecuta

Bloque 2: Marca (3)
- TEST 05: vacío → error
- TEST 06: solo espacios → error
- TEST 07: caracteres válidos → permite

Bloque 3: Empaque (10)
- TEST 08-16: cada opción del select
- TEST 17: sin empaque → documentar

Bloque 4: Unidad Base (7)
- TEST 18-23: cada unidad (kg, g, L, ml, oz, und)
- TEST 24: sin unidad → error

Bloque 5: Stock Mínimo (3)
- TEST 25: negativo → error
- TEST 26: texto → error
- TEST 27: decimal → documentar

Bloque 6: Densidad (3)
- TEST 28: negativo → error
- TEST 29: fuera de rango (> 5) → documentar
- TEST 30: decimal → permite

Bloque 7: Costo Base (3)
- TEST 31: negativo → error
- TEST 32: texto → error
- TEST 33: decimal → permite

Bloque 8: Integridad (3)
- TEST 34: todos vacíos → error
- TEST 35: solo nombre → error
- TEST 36: happy path → crea y guarda

Bloque 9: Captura para cadena (1)
- TEST 37: crear insumo maestro "Leche Entera" con densidad 1.03,
  unidad base L, para usar en recetas de la cadena.
Total: ~37 tests. Es más que presentaciones porque insumo tiene más campos.

📋 Prompt del test 2 (Insumos)
text
# TEST E2E — INSUMOS (VALIDACIÓN DE INPUTS + CAPTURA PARA CADENA)

## ⚠️ REGLAS ANTI-QUEMA
1. Modelo: Gemini Flash (Low).
2. PROHIBIDO subagentes.
3. LÍMITES: 12 lecturas, 3 ediciones, 40 llamadas.
4. NO tocar código de producción.
5. NO tocar presentations-validations.spec.js ni el helper.
6. DETENERSE al terminar.

## Contexto
La BD está levantada.
Test 1 completado: presentations.json tiene IDs persistidos.
Módulo: apps/web/src/components/catalog/SupplyModal.jsx
Formulario: "Nuevo Insumo"
Campos (según captura del usuario):
- Nombre del Insumo (text, required)
- Categoría (select dinámico)
- Subcategoría (select condicional)
- Marca (text, required)
- Empaque (select: UNIDAD, ENVASE, BOLSA, CAJA, BULTO, BOTELLA,
  BIDÓN, CANASTILLA, OTRO)
- Contenido por empaque (number)
- Unidad Base (select: kg, g, L, ml, oz, und)
- Stock Mínimo (number, required, default 0)
- Densidad (number, default 1.0)
- Costo base referencial (number, default 0)
- Observaciones (text, opcional)
- Insumo Activo (checkbox, default true)

Criterio de correcto: al hacer click en "Guardar Insumo", si hay
datos inválidos, el sistema muestra un mensaje de error o bloquea
el submit. El modal permanece abierto.

## Tareas

### T1. Leer patrón
Leer apps/web/e2e/presentations-validations.spec.js (patrón que
funciona con 26 tests).

### T2. Leer helper
Leer apps/web/e2e/helpers/chain-state.js (2 min máximo).

### T3. Leer componente
Leer SOLO:
- apps/web/src/components/catalog/SupplyModal.jsx
- apps/web/src/components/catalog/parts/useSupplyForm.js (si existe)
- apps/web/src/components/catalog/parts/SupplyFormFields.jsx (si existe)

### T4. Crear archivo de tests
apps/web/e2e/supplies-validations.spec.js

Estructura con:
- Prefijo E2E_TEST_SUPPLY_<timestamp> para tests de validación.
- Prefijo E2E_CHAIN_SUPPLY_<timestamp> para el insumo maestro.
- Captura de IDs vía page.waitForResponse().
- Cleanup en afterAll: borrar E2E_TEST_SUPPLY_*, preservar
  E2E_CHAIN_*.
- Guardar estado en .test-data/supplies.json.

### T5. Tests a implementar (37 tests en 9 bloques)

Bloque 1: Nombre (4 tests)
- TEST 01: Nombre vacío → error.
- TEST 02: Nombre solo espacios → error.
- TEST 03: Nombre 500 chars → documentar.
- TEST 04: Nombre con <script> → no ejecuta.

Bloque 2: Marca (3 tests)
- TEST 05: Marca vacía → error.
- TEST 06: Marca solo espacios → error.
- TEST 07: Marca válida "Colanta" → permite.

Bloque 3: Empaque (10 tests)
- TEST 08-16: crear con cada opción (UNIDAD, ENVASE, BOLSA, CAJA,
  BULTO, BOTELLA, BIDÓN, CANASTILLA, OTRO).
- TEST 17: sin empaque → documentar.

Bloque 4: Unidad Base (7 tests)
- TEST 18-23: crear con cada unidad (kg, g, L, ml, oz, und).
- TEST 24: sin unidad → documentar.

Bloque 5: Stock Mínimo (3 tests)
- TEST 25: stock negativo → error.
- TEST 26: stock texto → error.
- TEST 27: stock decimal → documentar.

Bloque 6: Densidad (3 tests)
- TEST 28: densidad negativa → error.
- TEST 29: densidad > 5 → documentar.
- TEST 30: densidad decimal 1.03 → permite.

Bloque 7: Costo base (3 tests)
- TEST 31: costo negativo → error.
- TEST 32: costo texto → error.
- TEST 33: costo decimal → permite.

Bloque 8: Integridad (3 tests)
- TEST 34: todos vacíos → error.
- TEST 35: solo nombre → error.
- TEST 36: happy path → crea y aparece en tabla.

Bloque 9: Captura para cadena (1 test)
- TEST 37: crear insumo maestro "E2E_CHAIN_SUPPLY_LECHE_ENTERA"
  con:
  - Categoría: (la que corresponda a lácteos)
  - Marca: "Colanta"
  - Empaque: BULTO
  - Contenido: 1000
  - Unidad Base: L
  - Stock mínimo: 10
  - Densidad: 1.03 (leche entera)
  - Costo base: 3200
  - Activo: true
  Capturar ID y guardar en supplies.json con key
  MASTER_LECHE_LITROS.

### T6. Correr los tests
pnpm --filter web exec playwright test supplies-validations --reporter=list --timeout=20000

Esperado: 37 passed. Si alguno falla, documentar.

### T7. Verificar JSON
Leer apps/web/e2e/.test-data/supplies.json y confirmar:
- MASTER_LECHE_LITROS.id existe.
- MASTER_LECHE_LITROS.nombre.
- MASTER_LECHE_LITROS.densidad = 1.03.
- MASTER_LECHE_LITROS.unidadBase = 'L'.

### T8. Documentar
Crear apps/prompts/testing/INFORME-E2E-SUPPLIES-VALIDATIONS.md con:
- 37 tests: passed/failed.
- Comportamiento observado por campo.
- IDs capturados.
- Si algún test falla: hallazgo o problema del test.

### T9. Commit
git add apps/web/e2e/supplies-validations.spec.js
git add apps/prompts/testing/INFORME-E2E-SUPPLIES-VALIDATIONS.md
git commit -m "test(e2e): supplies input validations + chain master (37 tests)"

## Entrega
- INFORME-E2E-SUPPLIES-VALIDATIONS.md
- supplies.json con MASTER_LECHE_LITROS.
- Máximo 1 commit.
- DETENERSE.

## Notas
- Si alguna opción del select no coincide con los strings exactos,
  ajustar los tests al comportamiento real.
- Si algún campo del formulario no tiene label claro, usar el
  placeholder o el aria-label.
- Si la categoría es dinámica y no hay seed, crear una nueva
  categoría "Lácteos" primero (documentar).
- Preservar el insumo maestro en cleanup.
📋 Antes de lanzar
1. Verifica el estado
powershell
git status
git log --oneline -3
Esperado:

Working tree limpio.

Commit f48ff51 visible.

2. Verifica el maestro de presentación
powershell
Get-Content apps/web/e2e/.test-data/presentations.json | ConvertFrom-Json | Select-Object -ExpandProperty presentacionesCreadas | Select-Object MASTER_BOTELLA_250
Debe mostrar el ID 161fb332-....