BLOQUE 6B APROBADO. BLOQUE 7A AUTORIZADO.
Antes de lanzar el 7A, verifica:

Genera la migración formal (si no lo has hecho):

bash
pnpm --filter api exec prisma migrate dev --name fix_cost_precision
Confirma que aparece el archivo en apps/api/prisma/migrations/.

Corre tests baseline:

bash
pnpm --filter api test
Esperado: 10 suites, 48 tests, 0 fallos.

Smoke test rápido de ventas: crear una venta desde la UI y confirmar que funciona (porque HAL-F5-03 tocó el frontend).

Si esos tres puntos están OK, procede con el Bloque 7A.

📋 Prompt del Bloque 7A (HAL-F1-03, HAL-F3-02, HAL-F3-03)
text
# BLOQUE 7A — HEURÍSTICAS Y HARDCODINGS CRÍTICOS

## REGLAS ANTI-QUEMA (obligatorias)
1. PROHIBIDO lanzar subagentes de investigación o de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Usar Gemini Flash (Low).
3. Máximo 15 lecturas de archivo en total.
4. Máximo 8 ediciones en total.
5. NO explorar el repositorio. Ir directo a los archivos listados.
6. Si superas cualquier límite, DETENTE y reporta progreso parcial.
7. Un commit atómico por hallazgo.
8. DETENERSE al terminar. NO avanzar a Bloque 7B.

## Contexto
Auditoría forense (INFORME-36).
Bloques 1-6B completados (29/39 hallazgos resueltos).

Hallazgos a corregir en este bloque:
- HAL-F1-03 (CRÍTICO): Heurística `costoUnitario > 100` divide
  arbitrariamente por 1000 en unidades pequeñas.
  Archivo: apps/api/src/inventory/inventory.service.js L24-35.
- HAL-F3-02 (CRÍTICO): Unidad de lote hardcoded a 'Litros'/'UNIDAD'
  ignorando Presentacion.unidadMedida y receta.unidadRendimiento.
  Archivo: apps/api/src/production/production.repository.js L945.
- HAL-F3-03 (CRÍTICO): Inyección forzada de 1000 ml / 33.81 oz
  para todo tipo BALDE o TANQUE_GRANEL.
  Archivo: apps/api/src/presentations/presentations.service.js L32-35.

## Tareas

### T1. Corregir HAL-F1-03 (heurística costoUnitario > 100)
Leer apps/api/src/inventory/inventory.service.js L24-35.
El código actual hace:
if (isSmallUnit && costoUnitario > 100) costoUnitario /= 1000;

text
Eso es dimensionalmente inválido: el umbral monetario no determina
la unidad. La conversión correcta es por unidad, no por precio.

Fix:
- Eliminar la heurística.
- Usar unit-registry.js (creado en Bloque 3) para convertir costos
  entre unidades.
- Si el costo está en $/kg y se necesita $/g, dividir por 1000
  USANDO getFactor, no un umbral.
- Si el costo está en $/kg y la unidad base es kg, no dividir.
- Cita: HAL-F1-03 (causa raíz: heurística monetaria).

### T2. Corregir HAL-F3-02 (unidad lote hardcoded)
Leer apps/api/src/production/production.repository.js L940-950.
El código actual hace:
unidadLote = esIntermedio ? 'Litros' : 'UNIDAD'

text
Fix:
- Leer `producto.presentacion.unidadMedida` o
  `receta.unidadRendimiento` (el que exista).
- Asignar esa unidad al lote.
- Si no existe, usar `producto.unidadBase` como fallback.
- Cita: HAL-F3-02 (síntoma) + HAL-F1-02 (absorbido) + HAL-F8-03
  (absorbido).

### T3. Corregir HAL-F3-03 (inyección 1000ml en granel)
Leer apps/api/src/presentations/presentations.service.js L28-38.
El código actual hace:
if (isGranel && (!payload.cantidadMl)) {
payload.cantidadMl = 1000;
payload.cantidadOz = payload.cantidadOz || 33.81;
}

text
Fix:
- NO inyectar 1000ml si el usuario no especifica.
- Si es granel y no hay cantidad, lanzar BadRequestException
  pidiendo el volumen real del tanque/balde.
- Mantener la asignación de cantidadOz solo si cantidadMl está
  presente.
- Cita: HAL-F3-03.

### T4. Tests de regresión
TEST-AUD-EMERG-05 (HAL-F1-03): insumo con costo $120/g se persiste
como $120, no como $0.12.
TEST-AUD-EMERG-06 (HAL-F3-02): producto terminado con presentación
en gramos genera lote con unidad 'g', no 'UNIDAD'.
TEST-AUD-EMERG-07 (HAL-F3-03): crear presentación BALDE sin
cantidadMl lanza BadRequestException.

### T5. Verificación y cierre
- Correr suite completa: 48 + 3 = 51 tests esperados.
- Confirmar 0 regresiones.
- Documentar en INFORME-REMEDIACION-07A.md.

## Entrega
- INFORME-REMEDIACION-07A.md.
- Máximo 1200 palabras.
- DETENERSE. NO avanzar a Bloque 7B.

## Criterios de aceptación
1. HAL-F1-03 RESUELTO: heurística `> 100` eliminada; conversión por
   unidad canónica.
2. HAL-F3-02 RESUELTO: unidad de lote hereda de presentación/receta.
3. HAL-F3-03 RESUELTO: granel sin cantidad lanza excepción.
4. 3 tests nuevos (TEST-AUD-EMERG-05/06/07) pasan.
5. 0 regresiones (51 tests verdes).
6. Commits atómicos:
   - fix(inventory): remove heuristic > 100 and use unit-registry (HAL-F1-03)
   - fix(production): inherit lote unit from presentacion/receta (HAL-F3-02)
   - fix(presentations): reject granel without explicit volume (HAL-F3-03)
📋 Instrucciones para ti
1. Cierra el Bloque 6B
bash
# Si no has generado la migración formal:
pnpm --filter api exec prisma migrate dev --name fix_cost_precision

# Commit si quedó algo pendiente
git status
git add -A
git commit -m "chore(bloque-6b): formal migration for cost precision"

# Merge a main
git checkout main
git merge remediation/bloque-6b-frontend-schema
git push origin main

# Tag
git tag -a post-bloque-6b -m "Bloque 6B: casteo frontend + escala decimal (HAL-F5-03, F10-03)"
git push origin post-bloque-6b
2. Crea la rama del Bloque 7A
bash
git checkout -b remediation/bloque-7a-heuristicas
3. Verifica baseline
bash
pnpm --filter api test
Esperado: 10 suites, 48 tests, 0 fallos.