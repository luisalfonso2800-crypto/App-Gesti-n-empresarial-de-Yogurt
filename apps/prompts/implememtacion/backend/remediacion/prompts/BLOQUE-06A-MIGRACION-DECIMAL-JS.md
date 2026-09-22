# BLOQUE 6A — MIGRACIÓN A DECIMAL.JS (HAL-F4-07)

## REGLAS ANTI-QUEMA (leer primero, obligatorias)
1. PROHIBIDO lanzar subagentes de investigación o de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Usar Gemini Flash (Low).
3. Máximo 15 lecturas de archivo en total.
4. Máximo 8 ediciones en total.
5. NO explorar el repositorio. Ir directo a los archivos listados.
6. Si superas cualquier límite, DETENTE y reporta progreso parcial.
7. Un commit atómico por hallazgo.
8. DETENERSE al terminar. NO avanzar a Bloque 6B.

## Contexto
Auditoría forense (INFORME-36).
Bloques 1-5 completados. HAL-F8-02 y HAL-F8-04 quedaron pendientes
(se resolverán en Bloque 7B, no tocar aquí).

Hallazgo a corregir:
- HAL-F4-07 (CRÍTICO): 288 conversiones Number() degradan Decimal
  a float64 antes de operar, causando errores acumulativos.

## Alcance ACOTADO (solo 5 flujos críticos)
NO migrar las 288 ocurrencias. Solo:
1. production.repository.js L732-739 (Kardex insumos)
2. inventory.repository.js L150-164 (CPP)
3. sales.repository.js L127-132 (Kardex terminados)
4. production.repository.js L1027-1039 (WIP)
5. payments.repository.js L54-59 (cartera)

## Tareas (ejecutar en orden, sin desviarse)

### T1. Instalar decimal.js
- Ejecutar: pnpm --filter api add decimal.js
- Verificar en apps/api/package.json.

### T2. Crear helper
Crear archivo: apps/api/src/common/decimal/decimal-utils.js
Contenido:
```javascript
const Decimal = require('decimal.js');
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const toDecimal = (v) => {
  if (v === null || v === undefined) return new Decimal(0);
  return new Decimal(v.toString());
};
const toNumber = (d) => Number(d.toString());
const add = (a, b) => toDecimal(a).plus(toDecimal(b));
const sub = (a, b) => toDecimal(a).minus(toDecimal(b));
const mul = (a, b) => toDecimal(a).times(toDecimal(b));
const div = (a, b) => toDecimal(a).dividedBy(toDecimal(b));

module.exports = { Decimal, toDecimal, toNumber, add, sub, mul, div };
T3. Migrar flujo 1 — production.repository.js L732-739
Leer SOLO esas líneas.
Reemplazar Number() por toDecimal.
Operar con .plus/.minus.
Persistir Decimal directamente en Prisma.

T4. Migrar flujo 2 — inventory.repository.js L150-164
Leer SOLO esas líneas.
Migrar la fórmula CPP:
nuevoCosto = (stockAnt × costoAnt + cantCompra × precioCompra) / stockNuevo
usando Decimal.

T5. Migrar flujo 3 — sales.repository.js L127-132
Leer SOLO esas líneas.
Migrar descuento de stock.

T6. Migrar flujo 4 — production.repository.js L1027-1039
Leer SOLO esas líneas.
Migrar cálculo de WIP.

T7. Migrar flujo 5 — payments.repository.js L54-59
Leer SOLO esas líneas.
Migrar cálculo de saldo.

T8. Test de regresión
Crear: apps/api/src/common/decimal/tests/decimal-utils.spec.js
Test TEST-AUD-07:

Sumar 100 veces 0.10 + 0.20 usando Decimal.

Assert resultado === 30.00 exacto.

Comparar contra Number (que da 30.000000000000004).

T9. Smoke test rápido
Correr: pnpm --filter api test

Confirmar 45 + 1 = 46 tests verdes.

Reportar regresiones (esperado: 0).

T10. Cierre y documentación
Crear: apps/prompts/implememtacion/backend/remediacion/INFORME-REMEDIACION-06A.md
Contenido mínimo:

Hallazgo HAL-F4-07 marcado RESUELTO.

5 flujos migrados (cita archivo:línea de cada uno).

Test TEST-AUD-07 pasando.

0 regresiones.

Commit atómico con mensaje:
fix(precision): migrate 5 critical flows to decimal.js (HAL-F4-07)

Entrega
Máximo 1200 palabras en el informe.

NO explicar código, solo resultado.

DETENERSE. NO avanzar a Bloque 6B.

text

## 📋 Instrucciones para ti (antes de lanzar)

### 1. Mergea el Bloque 5 a main

```bash
git checkout main
git pull
git merge remediation/bloque-5-kardex-finanzas
git push origin main
2. Crea la rama del Bloque 6A
bash
git checkout -b remediation/bloque-6a-decimaljs
3. Corre los tests antes de lanzar (baseline)
bash
pnpm --filter api test
Esperado: 8 suites, 45 tests, 0 fallos.