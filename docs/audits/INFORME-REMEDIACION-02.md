# INFORME-REMEDIACION-02: BLOQUE 2 — CÁLCULOS CATASTRÓFICOS

> **Fecha:** 2026-09-22  
> **Rama:** `remediation/bloque-2-calculos`  
> **Hallazgos cubiertos:** `HAL-F8-01` (CRÍTICO), `HAL-F4-01` (CRÍTICO), `HAL-F9-01` (CRÍTICO)  
> **Tests de regresión implementados:** `TEST-AUD-10`, `TEST-AUD-04`, `TEST-AUD-12`

---

## 1. Corrección de HAL-F8-01: Factor 1000x en Costo WIP (T1)
- **Problema Corregido:** En `production.repository.js`, el consumo de semielaborados WIP (ej. base líquida) medido en ml/g se multiplicaba directamente por el costo unitario expresado en $/L o $/kg, inflando el costo por $1000\times$ ($510,000 COP en lugar de $510 COP).
- **Fix Implementado:** Se introdujo y aplicó la función helper `normalizeQtyToUnitCost(qty, unit)` que detecta magnitudes continuas fraccionarias (`ml`, `g`, `gramos`, `mililitros`) y las escala dividiendo por 1000 antes de costear tanto el detalle como la liquidación total del lote.
- **Test:** `TEST-AUD-10` en `production-wip.spec.js` confirma que 150 ml de base a $3,400/L generan exactamente $510 COP.

---

## 2. Corrección de HAL-F4-01: Costo Promedio Ponderado (CPP) en Compras (T2)
- **Problema Corregido:** En `purchases.repository.js`, la recepción de compras solo incrementaba la columna `cantidadActual`, dejando congelado el `costoPromedio` en el valor histórico de catálogo.
- **Fix Implementado:** En cada ingreso de compra en inventario, se recupera el stock y costo previo del insumo y se recalcula transaccionalmente:
  $$\text{stockNuevo} = \text{stockAnterior} + \text{cantidadComprada}$$
  $$\text{costoNuevo} = \frac{(\text{stockAnterior} \times \text{costoAnterior}) + (\text{cantidadComprada} \times \text{precioUnitarioStock})}{\text{stockNuevo}}$$
- **Test:** `TEST-AUD-04` en `purchases-cpp.spec.js` demuestra que 10 kg previos a $10,000 + 10 kg comprados a $20,000 fijan el nuevo CPP en $15,000 COP.

---

## 3. Corrección de HAL-F9-01: Colapso Runtime en Metas de Producción (T3)
- **Problema Corregido:** En `goals.repository.js`, el método `getSumProduccionLts` invocaba en Prisma `_sum: { cantidadProducida: true }`. Al no existir ese campo en el modelo `Produccion`, Prisma Client lanzaba excepción irrecuperable de validación, quebrando el endpoint con HTTP 500.
- **Fix Implementado:** Se actualizó la agregación al campo real del schema `_sum: { cantidadProducidaReal: true }`.
- **Test:** `TEST-AUD-12` en `goals-production.spec.js` verifica la consulta exitosa sin excepción.

---

## 4. Batería de Tests y Resultados (T4 y T6)
- **Ejecución completa:** `pnpm --filter api test`
  ```text
  PASS src/production/tests/production-wip.spec.js
  PASS src/app.controller.spec.js
  PASS src/goals/tests/goals-production.spec.js
  PASS src/purchases/tests/purchases-cpp.spec.js
  PASS src/sales/sales.controller.spec.js

  Test Suites: 5 passed, 5 total
  Tests:       10 passed, 10 total
  Snapshots:   0 total
  ```
- **Tests Previos:** Todos los tests de Bloque 1 (`TEST-AUD-14`, `TEST-AUD-15`) y base permanecen 100% en verde.
- **Regresiones:** 0 regresiones detectadas.

---

## 5. Smoke Test Funcional Documentado (T5)
1. **Flujo Ventas (Bloque 1):** Sigue validando con schemas Zod estrictos y recalculando totales server-side.
2. **Flujo Compras & CPP (Bloque 2):** Insumo comprado a precio superior actualiza ponderadamente el `costoPromedio` en la tabla `Inventario`.
3. **Flujo Manufactura WIP (Bloque 2):** Consumo fraccionario en mililitros de producto intermedio calcula el costo en pesos reales ($510 COP) sin distorsión 1000x.
4. **Flujo Dashboard Metas (Bloque 2):** Consulta de agregación mensual lee `cantidadProducidaReal` y responde sin lanzar HTTP 500.

---

## 6. Estado de los Hallazgos

| ID Hallazgo | Severidad | Estado | Evidencia |
| :--- | :---: | :---: | :--- |
| `HAL-F8-01` | **CRÍTICO** | **RESUELTO** | `normalizeQtyToUnitCost` activo; `TEST-AUD-10` pasando. |
| `HAL-F4-01` | **CRÍTICO** | **RESUELTO** | Fórmula CPP ponderada activa en `purchases.repository.js`; `TEST-AUD-04` pasando. |
| `HAL-F9-01` | **CRÍTICO** | **RESUELTO** | Agregación corregida a `cantidadProducidaReal`; `TEST-AUD-12` pasando. |

---
**ESTADO: BLOQUE 2 DE REMEDIACIÓN COMPLETADO AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A BLOQUE 3 SIN AUTORIZACIÓN.**
