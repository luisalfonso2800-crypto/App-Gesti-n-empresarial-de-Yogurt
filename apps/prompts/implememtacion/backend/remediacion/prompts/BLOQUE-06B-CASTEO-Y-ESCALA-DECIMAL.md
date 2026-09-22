# BLOQUE 6B — FRONTEND/BACKEND CASTEO Y ESCALA DECIMAL

## REGLAS ANTI-QUEMA (obligatorias)
1. PROHIBIDO lanzar subagentes de investigación o de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Usar Gemini Flash (Low).
3. Máximo 15 lecturas de archivo en total.
4. Máximo 8 ediciones en total.
5. NO explorar el repositorio. Ir directo a los archivos listados.
6. Si superas cualquier límite, DETENTE y reporta progreso parcial.
7. Un commit atómico por hallazgo.
8. DETENERSE al terminar. NO avanzar a Bloque 7A.

## Contexto
Auditoría forense (INFORME-36).
Bloques 1-5 completados. Bloque 6A completado (Decimal.js en 5 flujos).
HAL-F4-07 quedó PARCIAL (5/288 flujos migrados; el resto va a backlog).

Hallazgos a corregir en este bloque:
- HAL-F5-03 (ALTO): Cuádruple casteo cruzado Frontend ↔ Backend.
  Cadena: BD Decimal → JSON string → Web Number → Backend Number.
- HAL-F10-03 (CRÍTICO): Escala @db.Decimal(12, 2) insuficiente en
  costos unitarios de micro-ingredientes (ej. $18.4523/g).

## Alcance ACOTADO
1. HAL-F5-03: apps/web/src/app/.../useSaleForm.js + services de API.
2. HAL-F10-03: apps/api/prisma/schema.prisma (campos específicos).

## Tareas

### T1. Inventario acotado del cuádruple casteo (HAL-F5-03)
- Leer apps/web/src/app/catalog/recipes/hooks/useSaleForm.js
  (solo las funciones de cálculo de totales y desglose).
- Leer apps/web/src/services/api-client.js (o equivalente).
- Identificar los 4 puntos donde se castea:
  1. Backend Prisma Decimal → JSON string.
  2. JSON string → Number en el cliente.
  3. Cálculo en Number en el frontend.
  4. Envío de Number al backend (que lo vuelve a castear).

### T2. Corregir el casteo en frontend (HAL-F5-03)
- Opción A (simple): que el frontend envíe los valores tal cual
  los recibe del backend (strings) sin convertirlos a Number para
  operar. Los cálculos del frontend se hacen con los strings
  como Decimal (usando decimal.js en el frontend también).
- Opción B (recomendada si el frontend no tiene decimal.js):
  El frontend deja de calcular. Envía solo cantidades y deja que
  el backend calcule los totales. Eso elimina la duplicación.
- Decidir según lo que ya exista en el proyecto. Documentar.
- Si es Opción B: remover los cálculos de subtotal/IVA/total en
  useSaleForm.js y mostrar los valores que devuelve el backend.

### T3. Instalar decimal.js en frontend (si aplica Opción A)
- pnpm --filter web add decimal.js
- Reusar el mismo patrón que backend.

### T4. Corregir escala Decimal en schema (HAL-F10-03)
En schema.prisma, buscar los campos:
- Insumos.costoBase: actualmente @db.Decimal(12, 2).
- Precios_Proveedores.costoUnidadBase: actualmente @db.Decimal(12, 2).
- Precios_Proveedores.precioCompra: @db.Decimal(12, 2).
Cambiar SOLO los campos de costo unitario de insumos a
@db.Decimal(14, 4). NO cambiar precioVenta ni totales (esos
manejan montos grandes, no costos unitarios).

Migración:
- npx prisma migrate dev --name fix_cost_precision
- Verificar que la migración aplica sin pérdida de datos
  (Decimal(14,4) es superconjunto de Decimal(12,2)).

### T5. Verificar impacto en datos existentes
- Ejecutar un SELECT para verificar cuántos insumos tienen
  costoBase con decimales truncados (ej. $3.25 cuando debería
  ser $3.2548).
- Documentar como deuda técnica si no se puede backfill
  automáticamente.

### T6. Test de regresión (HAL-F10-03)
TEST-AUD-EMERG-04 en apps/api/src/common/decimal/tests/:
- Crear insumo con costoBase = 18.4523 (4 decimales).
- Guardar en BD.
- Leer y verificar que sigue siendo 18.4523 (no 18.45).

### T7. Verificación y cierre
- Correr suite completa: 47 + 1 = 48 tests esperados.
- Confirmar 0 regresiones en Bloques 1-5.
- Documentar en INFORME-REMEDIACION-06B.md.

## Entrega
- INFORME-REMEDIACION-06B.md.
- Máximo 1200 palabras.
- DETENERSE. NO avanzar a Bloque 7A.

## Criterios de aceptación
1. HAL-F5-03 RESUELTO: la cadena de casteo se reduce a 1 conversión
   en lugar de 4.
2. HAL-F10-03 RESUELTO: campo costoBase (y equivalentes) migrado a
   Decimal(14,4).
3. Test TEST-AUD-EMERG-04 pasa.
4. 0 regresiones (48 tests verdes).
5. Commit atómico por hallazgo:
   - fix(frontend): eliminate quadruple cast in sale form (HAL-F5-03)
   - fix(schema): expand cost precision to Decimal(14,4) (HAL-F10-03)
📋 Instrucciones para ti
1. Crea la rama del Bloque 6B
bash
git checkout remediation/bloque-6a-decimaljs
git add -A
git commit -m "cierre bloque 6a" # si hay algo pendiente
git checkout main
git merge remediation/bloque-6a-decimaljs
git push origin main
git tag -a post-bloque-6a -m "Bloque 6A completado (HAL-F4-07 parcial)"
git push origin post-bloque-6a
git checkout -b remediation/bloque-6b-frontend-schema
2. Verifica baseline
bash
pnpm --filter api test
Esperado: 9 suites, 47 tests, 0 fallos.