Prompt del Bloque Front-3.1
text
# REMEDIACIÓN FRONTEND — BLOQUE FRONT-3.1
# ARREGLAR SELECTORES DE TESTS E2E

## ⚠️ REGLAS ANTI-BUCLE
1. PROHIBIDO lanzar subagentes.
2. PROHIBIDO usar Claude. Modelo: Gemini Flash (Low).
3. PROHIBIDO releer un archivo ya leído en esta sesión.
4. LÍMITE DURO: 8 lecturas. LÍMITE DURO: 6 ediciones.
5. LÍMITE DURO: 20 llamadas totales.
6. Al llegar a cualquier límite: DETENTE, commitea, reporta.
7. NO tocar código de producción. Solo el archivo de tests.

## Contexto
Los 4 tests E2E en apps/web/e2e/remediation-poka-yoke.spec.js
fallan por problemas de selectores:

- TEST-E2E-POKA-01: skipped (probablemente por guard).
- TEST-E2E-POKA-02: timeout 5 min buscando elemento inexistente.
- TEST-E2E-POKA-03: skipped (probablemente por guard).
- TEST-E2E-POKA-04: selector CSS inválido
  'table, text=Cuentas por Cobrar, text=Clientes' → error de parseo.

## Tareas

### T1. Leer el archivo de tests
Leer apps/web/e2e/remediation-poka-yoke.spec.js (1 sola lectura).

### T2. Leer el patrón de Playwright correcto
Leer SOLO las primeras 50 líneas de
apps/web/e2e/value-chain-complete.spec.js
para ver cómo el proyecto usa selectores Playwright válidos.

### T3. Corregir TEST-E2E-POKA-04 (selector inválido)
El selector `page.locator('table, text=Cuentas por Cobrar, text=Clientes')`
no es CSS válido.
Reemplazar por uno de estos patrones válidos:
- `page.locator('table').first()`
- `page.getByRole('table').first()`
- `page.getByText('Cuentas por Cobrar').first()`
Elegir según el HTML real. Si no estás seguro, usar el más genérico.

### T4. Corregir TEST-E2E-POKA-02 (timeout)
El test busca un elemento que no existe. Revisar:
- ¿El selector del input de cantidadMl existe?
- ¿El asterisco `*` en el label está bien buscado?
Sugerencia: en lugar de buscar el `*`, verificar:
- El botón submit está `disabled`.
- O el input tiene `aria-required="true"` o `required`.

### T5. Des-skipear POKA-01 y POKA-03 si es posible
Revisar por qué se saltaron. Si el skip es por `if (!data) test.skip`,
mantener. Si el skip es innecesario, quitarlo.

### T6. Correr tests con timeout corto
pnpm --filter web exec playwright test remediation-poka-yoke --reporter=list --timeout=15000

text
Documentar resultado real.

### T7. Si los tests fallan aún
Documentar exactamente:
- Selector que intenta usar.
- Elemento HTML real que existe.
- Motivo del fallo.

### T8. Commit y cierre
- git add apps/web/e2e/remediation-poka-yoke.spec.js
- git commit -m "test(e2e): fix selectors in Poka-Yoke suite (Front-3.1)"
- Actualizar INFORME-REMED-FRONT-3.md con resultados reales.
- DETENERSE.

## Entrega
- Máximo 800 palabras.
- Máximo 1 commit.
- DETENERSE.
📋 Cómo ejecutar
1. Verifica que estás en la rama correcta
powershell
git status
git branch --show-current
Si no estás en remediation/frontend-bloque-3, cambia:

powershell
git checkout remediation/frontend-bloque-3