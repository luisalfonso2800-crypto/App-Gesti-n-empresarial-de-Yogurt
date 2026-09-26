# INFORME DE REMEDIACIÓN — BLOQUE 5: KARDEX, VENTAS Y FINANZAS

> **Rama:** `remediation/bloque-5-kardex-finanzas`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — 6 hallazgos remediados, 20 tests nuevos, 0 regresiones.

---

## 1. Hallazgos Corregidos

### HAL-F4-08 (ALTO) — Antipatrón `Math.max(0, ...)` en mutaciones de stock
- **Archivo(s):** `production.repository.js` (L762, L817, L859, L891), `inventory.repository.js` (L62)
- **Corrección:** Eliminado el truncamiento a 0 en 5 puntos críticos de mutación de stock. El saldo real (incluso negativo) ahora se preserva para evidenciar desajustes físicos en planta.
- **Nota:** Se mantuvieron los `Math.max(0, ...)` en cálculos de planificación/estimación (L264, L265, L323, L324, L425, L472, L989) donde el acotamiento es lógicamente correcto.
- **Commit:** `c50dce0`

### HAL-F9-03 (ALTO) — Trazabilidad fiscal en Kardex
- **Archivo(s):** `purchases.repository.js` (L211-220), `production.repository.js` (L1036-1045)
- **Corrección:** Agregado `stockAnterior`, `stockNuevo` y `costoUnitario` en movimientos `ENTRADA_COMPRA` y `ENTRADA_RECIRCULACION_INOCULO` que antes persistían con estos campos como `NULL`.
- **Commit:** `710c672`

### HAL-F2-02 (CRÍTICO) — Descuento de stock sin normalizar unidad
- **Archivo(s):** `inventory.repository.js` (L118-193)
- **Corrección:** `adjustInventory` ahora acepta `unidadMovimiento` opcional. Si es distinta a la `unidadBase` del insumo, convierte automáticamente vía `unit-registry.convert()`. Si las magnitudes son incompatibles (ej. kg vs litros), lanza error descriptivo.
- **Commit:** `85cff81`

### HAL-F9-04 (ALTO) — Bloqueo de cobros mayores al saldo
- **Archivo(s):** `payments.repository.js` (L34-73), `sales.repository.js` (L225), `sales.controller.spec.js` (L60)
- **Corrección:** Eliminado el `throw Error` que bloqueaba pagos > saldo. Ahora: (1) el pago se registra, (2) `saldoPendiente` puede ser negativo (saldo a favor), (3) se anota `[SALDO A FAVOR: $X]` en observaciones, (4) estado unificado a `COMPLETADA` (femenino).
- **Commit:** `5fab440`

### HAL-F7-03 (ALTO) — Validación de descuento máximo
- **Archivo(s):** `sales/schemas/create-sale.schema.js`
- **Corrección:** Agregado `.refine()` de Zod que valida que el descuento por línea no exceda el 50% del valor bruto (`cantidad * precioUnitario`). Constante configurable `MAX_DESCUENTO_PORCENTAJE`.
- **Commit:** `5fab440`

### HAL-F9-02 (CRÍTICO) — Utilidad devengada computada como liquidez
- **Archivo(s):** `dashboard.service.js` (L41-73, L188-197)
- **Corrección:** Segregado en 3 métricas: (1) `utilidadDevengada` = baseImponible sin IVA - gastos, (2) `flujoCajaReal` = cobros efectivos del mes - gastos, (3) `cashReceivedCurrentMonth`. La métrica `netProfitCurrentMonth` ahora apunta a `utilidadDevengada` por retrocompatibilidad.
- **Commit:** `59befe3`

---

## 2. Suite de Tests

| Test ID | Descripción | Hallazgo |
| :--- | :--- | :--- |
| `TEST-AUD-22` | Stock negativo preservado, saldo real sin truncar | HAL-F4-08 |
| `TEST-AUD-23` | Consistencia acumulativa stockAnterior/stockNuevo | HAL-F9-03 |
| `TEST-AUD-24` | Conversión kg→g, ml→l, rechazo magnitudes incompatibles | HAL-F2-02 |
| `TEST-AUD-25` | Pagos parciales, exactos y sobrepagos con saldo a favor | HAL-F9-04 |
| `TEST-AUD-26` | Descuento ≤50% válido, >50% rechazado, 100% rechazado | HAL-F7-03 |
| `TEST-AUD-27` | Utilidad sin IVA, flujo de caja vs devengado, flujo negativo | HAL-F9-02 |

**Totales:** 8 suites / 45 tests / 0 fallos / 0 regresiones.

---

## 3. Commits del Bloque

```
0f13244 test(bloque-5): add kardex-sales-finance test suite (TEST-AUD-22 to TEST-AUD-27)
59befe3 fix(dashboard): segregate utilidadDevengada vs flujoCajaReal (HAL-F9-02)
5fab440 fix(payments, sales): allow overpayments and validate max 50% discount (HAL-F9-04, HAL-F7-03)
85cff81 fix(inventory): normalize unit dimensions in Kardex adjustments (HAL-F2-02)
710c672 fix(kardex): persist stockAnterior/stockNuevo in ENTRADA_COMPRA and ENTRADA_RECIRCULACION_INOCULO (HAL-F9-03)
c50dce0 fix(stock): remove Math.max(0,...) antipattern in stock mutations (HAL-F4-08)
```

---

## 4. Hallazgos Emergentes Registrados en Backlog

Durante la investigación del Bloque 5 se detectaron brechas adicionales que **no fueron intervenidas** para no desviar el alcance:

- **G-02:** `utilidadTotal` en `DetalleVenta` incluye IVA en el cálculo (totalLinea - costo).
- **G-04:** Inconsistencia residual de género en estados (`COMPLETADA` vs `COMPLETADO` en datos históricos).
- **G-05:** `payments.repository.js` no valida correspondencia `venta.idCliente === data.idCliente`.
- **G-06:** Se pueden registrar pagos sobre ventas con estado `ANULADA`.
- **G-07:** KPI `totalCobrado` en receivables es global sin respetar filtros de fecha/cliente.

---

**BLOQUE 5 CERRADO. DETENIDO.**
