Prompt del Bloque 8A (migración de flujos financieros residuales)
text
# BLOQUE 8A — CIERRE DE HAL-F4-07 (FLUJOS FINANCIEROS RESIDUALES)

## REGLAS ANTI-QUEMA (obligatorias)
1. PROHIBIDO lanzar subagentes de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Modelo: Gemini Flash (Low).
3. Máximo 20 lecturas de archivo. Máximo 10 ediciones.
4. NO explorar todo el repo. Usar grep acotado a los patrones
   indicados.
5. Si superas cualquier límite, DETENTE y reporta progreso parcial.
6. Un commit atómico por hallazgo o grupo lógico.
7. DETENERSE al terminar. NO avanzar al Bloque 8B sin autorización.

## Contexto
Auditoría forense (INFORME-36) + Remediación (INFORME-FINAL-REMEDIACION).
Bloques 1-7BC completados. 38/39 hallazgos resueltos.
Pendiente único: HAL-F4-07 PARCIAL (5/288 flujos migrados a Decimal.js).

Este bloque migra SOLO los flujos financieros residuales.
NO migra las 283 conversiones restantes (esas van a 8B como deuda
documentada).

## Alcance ACOTADO
Migrar a Decimal.js las conversiones Number() que cumplan AL MENOS
una de estas condiciones:
1. Están dentro de un cálculo que termina en un monto monetario
   (precio, costo, total, subtotal, IVA, utilidad, saldo).
2. Están dentro de un cálculo que termina en una cantidad de stock
   (inventario, kardex, movimiento).
3. Están dentro de un cálculo que termina en una cantidad consumida
   en producción (BOM, merma, consumo real).

NO migrar Number() en:
- Validaciones Zod (entrada).
- Logging y mensajes de error.
- Formateo de presentación.
- Comparaciones de fechas o IDs.
- Cualquier cosa que no termine en cálculo monetario o de cantidad.

## Tareas

### T1. Inventario acotado con grep
Ejecutar UN solo grep para listar las ocurrencias:
findstr /S /I /N "Number(" apps\api\src*.js | findstr /V "node_modules"

text
Clasificar cada ocurrencia en:
- A) Cálculo financiero/stock/producción → MIGRAR.
- B) Validación/entrada → DEJAR.
- C) Log/formato/fecha → DEJAR.

Reportar SOLO las que caen en (A). Objetivo: identificar las
~10-20 residuales.

### T2. Migrar cada ocurrencia categoría A
Para cada archivo/línea identificada en T1 como categoría A:
- Importar desde apps/api/src/common/decimal/decimal-utils.js
  (creado en Bloque 6A): toDecimal, add, sub, mul, div, toNumber.
- Reemplazar Number(x) por toDecimal(x) si el valor va a operar.
- Usar los helpers add/sub/mul/div para las operaciones.
- Usar toNumber() SOLO en el punto de persistencia si Prisma lo
  requiere (aunque Prisma acepta Decimal nativo, verificar).
- Mantener semántica: si el código redondeaba, seguir redondeando
  al mismo punto.

### T3. Verificar los 5 flujos migrados en Bloque 6A
Confirmar que siguen usando Decimal.js. Si algo se mezcló con
Number() en los commits posteriores (Bloques 6B-7BC), corregir.

### T4. Test de regresión
Añadir a apps/api/src/common/decimal/tests/decimal-utils.spec.js:
- TEST-AUD-EMERG-14: verificar que un cálculo de CPP con 20
  iteraciones mantiene precisión completa sin drift float64.
- TEST-AUD-EMERG-15: verificar que un cálculo de costo WIP con
  Decimal no produce drift.

### T5. Verificación y cierre
- pnpm --filter api test → 12 suites / 60 tests esperados.
- Confirmar 0 regresiones.
- Crear INFORME-REMEDIACION-08A.md:
  - Cantidad de conversiones categoría A migradas (N).
  - Cantidad total de Number() clasificadas en categoría B y C.
  - Test de regresión añadidos.
  - Commit atómico con mensaje:
    fix(precision): migrate remaining financial flows to decimal.js (HAL-F4-07)

## Entrega
- INFORME-REMEDIACION-08A.md.
- Máximo 1000 palabras.
- DETENERSE. NO avanzar al Bloque 8B.

## Criterios de aceptación
1. Todas las ocurrencias categoría A migradas a Decimal.js.
2. TEST-AUD-EMERG-14 y 15 pasan.
3. 60 tests verdes (58 + 2 nuevos).
4. 0 regresiones.
5. Commit atómico generado.
📋 Prompt del Bloque 8B (documentación del resto)
Una vez terminado 8A, se lanza 8B:

text
# BLOQUE 8B — CIERRE DEFINITIVO DE HAL-F4-07

## REGLAS ANTI-QUEMA
1. PROHIBIDO subagentes. Prohibido Opus/Sonnet. Gemini Flash (Low).
2. Máximo 5 lecturas. Máximo 3 ediciones.
3. DETENERSE al terminar.

## Contexto
Bloque 8A migró los flujos financieros residuales.
Quedan N conversiones Number() en categorías B y C (validación,
log, formato, fechas) que NO afectan cálculos.

## Tarea ÚNICA
Documentar en BACKLOG_POST_AUDITORIA.md:
- Conteo final de conversiones categoría B y C.
- Justificación de por qué no se migran.
- Recomendación: migración oportunista cuando se toquen esos
  archivos por otras razones.
- Marcar HAL-F4-07 como RESUELTO en el informe final.

Crear INFORME-REMEDIACION-08B.md con:
- Estado final de HAL-F4-07: RESUELTO (100%).
- Conteo: X flujos financieros migrados, Y conversiones cosméticas
  documentadas.
- Justificación técnica.

Actualizar INFORME-FINAL-REMEDIACION.md:
- Cambiar tabla de severidad: 39/39 resueltos.
- Actualizar sección E (deuda técnica): remover HAL-F4-07 como
  parcial; mover a "Deuda aceptada".

Commit: docs(remediation): close HAL-F4-07 as resolved (100%)

## Entrega
- Máximo 500 palabras.
- DETENERSE. Remediación 100%.
📋 Instrucciones para ti antes de lanzar 8A
1. Cierra el Bloque 7BC primero
Antes de lanzar 8A, asegúrate de que el Bloque 7BC está mergeado y taggeado:

powershell
# Verificar que 7BC está limpio
git status
git log --oneline -8

# Push de la rama
git push origin remediation/bloque-7bc-cierre-menores

# Tag
git tag -a post-bloque-7bc -m "Bloque 7BC: 6 hallazgos resueltos"
git push origin post-bloque-7bc

# Merge a main
git checkout main
git pull
git merge remediation/bloque-7bc-cierre-menores
git push origin main
2. Crea la rama del Bloque 8A
powershell
git checkout -b remediation/bloque-8a-decimal-completo
3. Verifica baseline
powershell
pnpm --filter api test
Esperado: 12 suites / 58 tests verdes.