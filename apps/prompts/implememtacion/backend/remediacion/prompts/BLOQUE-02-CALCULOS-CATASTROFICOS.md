Prompt del Bloque 2 (Cálculos catastróficos)
text
# BLOQUE 2 DE REMEDIACIÓN — CÁLCULOS CATASTRÓFICOS

## Contexto
Auditoría forense completada (INFORME-36).
Bloque 1 completado (seguridad server-side).
Hallazgos a corregir en este bloque:
- HAL-F8-01 (CRÍTICO): Factor 1000x en costo de WIP consumido en ml
  con costo unitario en L. Ejemplo: 150 ml × $3,400/L = $510,000
  en vez de $510.
- HAL-F4-01 (CRÍTICO): Compras no actualizan costoPromedio en inventario.
- HAL-F9-01 (CRÍTICO): Consulta de campo inexistente cantidadProducida
  en módulo de metas → HTTP 500.

Causa raíz común: fallos en fórmulas de costeo y agregación de datos.

## Alcance
- apps/api/src/production/production.repository.js (HAL-F8-01)
- apps/api/src/purchases/purchases.repository.js (HAL-F4-01)
- apps/api/src/inventory/inventory.repository.js (HAL-F4-01)
- apps/api/src/goals/goals.repository.js (HAL-F9-01)

## Reglas de ejecución
- Cada fix cita su hallazgo origen (HAL-F8-01, HAL-F4-01, HAL-F9-01).
- Cada fix incluye su test de regresión (TEST-AUD-10, TEST-AUD-04,
  TEST-AUD-12).
- Un commit atómico por hallazgo (tres commits mínimo).
- Rama: remediation/bloque-2-calculos.
- NO modificar el informe de auditoría.
- NO modificar los fixes del Bloque 1.
- Si aparece hallazgo nuevo, va a BACKLOG_POST_AUDITORIA.md.
- DETENERSE al terminar. No avanzar a Bloque 3.

## Tareas

### T1. Corregir HAL-F8-01 (factor 1000x en costo WIP)
En production.repository.js L877, L884:
- El problema: `costoTotalLote += qtyReal * costoUnitarioIntermedio`
  donde qtyReal está en ml/g pero costoUnitarioIntermedio está en $/L.
- El fix: normalizar qtyReal a la unidad del costo ANTES de multiplicar.
  - Si qtyReal está en ml y costo en $/L: qtyReal / 1000 × costo.
  - Si qtyReal está en g y costo en $/kg: qtyReal / 1000 × costo.
  - Aplicar la misma lógica que ya existe para `decrementoLts` (L780-785).
- Extraer la lógica a una función helper `normalizeQtyToUnitCost()`.
- Test: TEST-AUD-10 (150 ml de base $3,400/L → $510, no $510,000).

### T2. Corregir HAL-F4-01 (CPP no actualizado en compras)
En purchases.repository.js L171-197:
- Actualmente hace `update: { cantidadActual: { increment: incrementStock } }`
  sin tocar `costoPromedio`.
- El fix: al registrar compra, recalcular CPP:
stockAnterior = Number(inv.cantidadActual)
costoAnterior = Number(inv.costoPromedio)
cantidadComprada = incrementStock
precioCompra = factorReal > 0 ? precioUnitario / factorReal : precioUnitario
stockNuevo = stockAnterior + cantidadComprada
costoNuevo = stockNuevo > 0
? (stockAnterior * costoAnterior + cantidadComprada * precioCompra) / stockNuevo
: precioCompra

text
- Aplicar dentro de una transacción Prisma para atomicidad.
- Considerar HAL-F4-07 (Decimal → Number) al implementar; si hay
oportunidad de usar Prisma.Decimal sin mucho refactor, hacerlo;
si no, dejar Number() con TODO comentado.
- Test: TEST-AUD-04 (10 kg @$10k + 10 kg @$20k → CPP $15,000).

### T3. Corregir HAL-F9-01 (campo inexistente en metas)
En goals.repository.js L160-172:
- Actualmente: `_sum: { cantidadProducida: true }`.
- El schema define: `cantidadProducidaReal`.
- El fix: cambiar a `_sum: { cantidadProducidaReal: true }` y
retornar `Number(result._sum.cantidadProducidaReal || 0)`.
- Test: TEST-AUD-12 (módulo metas consulta sin error 500).

### T4. Tests de regresión (implementar)
TEST-AUD-04: CPP con múltiples compras a precios distintos.
TEST-AUD-10: Costo de WIP consumido en ml → $510, no $510,000.
TEST-AUD-12: Metas de producción no lanzan excepción.

### T5. Smoke test manual
- Crear venta (debe funcionar tras Bloque 1).
- Crear compra y verificar que CPP cambió.
- Crear producción y verificar que costo del WIP es correcto.
- Ver dashboard de metas (debe cargar sin error 500).
Documentar en el informe.

### T6. Verificación final del bloque
- Correr suite completa (4+3 = 7 tests esperados).
- Confirmar que no hay regresiones.
- Documentar cambios en INFORME-REMEDIACION-02.md.

## Formato de entrega
- INFORME-REMEDIACION-02.md con T1-T6.
- Máximo 1500 palabras.
- DETENERSE. No avanzar a Bloque 3.

## Criterios de aceptación
1. HAL-F8-01, HAL-F4-01, HAL-F9-01 marcados como RESUELTOS.
2. TEST-AUD-04, TEST-AUD-10, TEST-AUD-12 pasan.
3. CPP se actualiza tras compra verificable en BD.
4. Costo de WIP con consumo en ml es el correcto.
5. Dashboard de metas carga sin excepción.
6. Ninguna regresión en los tests del Bloque 1.
7. Smoke test manual pasa.