# INFORME DE REMEDIACIÓN — BLOQUE 6A: MIGRACIÓN A DECIMAL.JS

> **Rama:** `remediation/bloque-6a-decimaljs`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — Hallazgo HAL-F4-07 remediado en 5 flujos críticos, 0 regresiones.

---

## 1. Hallazgo Resuelto

### HAL-F4-07 (CRÍTICO) — Degradación arquitectónica Decimal -> Number()
- **Estado:** **RESUELTO**
- **Descripción:** Las conversiones forzosas a `Number()` en cálculos aritméticos degradaban tipos Decimal a float64 de doble precisión IEEE-754, introduciendo errores acumulativos por coma flotante en saldos, promedios ponderados y liquidación de inventarios.
- **Solución implementada:** Se integró la librería `decimal.js` configurada a 20 dígitos de precisión y redondeo bancario (`ROUND_HALF_UP`) mediante el helper centralizado `apps/api/src/common/decimal/decimal-utils.js`. Se migraron los 5 flujos operacionales más críticos de la planta y finanzas.

---

## 2. Los 5 Flujos Críticos Migrados

| N° | Flujo / Operación | Archivo y Líneas | Detalle de la Migración |
| :---: | :--- | :--- | :--- |
| **1** | Kardex Insumos (Producción) | `apps/api/src/production/production.repository.js`: L760-766 | Cálculo de `stockFinalDecimal = sub(stockActual, qtyReal)` evitando residuos float64 en el stock final persistido. |
| **2** | CPP / Costo Promedio Ponderado | `apps/api/src/inventory/inventory.repository.js`: L157-171 | Cálculo ponderado exacto: `(mul(stockAnt, costoAnt) + mul(cant, costo)) / stockNuevo` operado íntegramente con `add`, `mul`, `div`. |
| **3** | Kardex Productos Terminados (Ventas) | `apps/api/src/sales/sales.repository.js`: L134-137 | Descuento exacto de stock comercial: `sub(stockAnterior, d.cantidad)` sin imprecisión decimal. |
| **4** | Cálculo de WIP y Lote Principal | `apps/api/src/production/production.repository.js`: L993-997 | Balance exacto de litros para inóculo vs producto principal vía `sub(qtyProducida, cantInoculo)`. |
| **5** | Cartera y Saldos Pendientes (Pagos) | `apps/api/src/payments/payments.repository.js`: L55-63 | Suma de pagos `add(valorPagado, pagoMonto)` y nuevo saldo `sub(totalVenta, nuevoValorPagadoDec)` preservando saldos a favor exactos. |

---

## 3. Suite de Pruebas y Regresión

- **Test implementado:** `TEST-AUD-07` en `apps/api/src/common/decimal/tests/decimal-utils.spec.js`.
- **Validación del test:** Demuestra que sumar 100 veces `0.10 + 0.20` en `Number` produce `30.000000000000004`, mientras que operado con `Decimal` produce exactamente `30.00`.
- **Resultados de ejecución:**
  - Suites ejecutadas: 9/9
  - Tests totales: 47/47 pasados (45 previos + 2 nuevos)
  - Regresiones detectadas: **0**

---

## 4. Conclusión

El Bloque 6A ha quedado completado conforme a las reglas de presupuesto, aislamiento y criterios de aceptación.

**BLOQUE 6A CERRADO. DETENIDO.**
