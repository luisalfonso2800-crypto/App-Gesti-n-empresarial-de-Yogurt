# INFORME DE REMEDIACIÓN — BLOQUE 6B: CASTEO Y ESCALA DECIMAL

> **Rama:** `remediation/bloque-6b-frontend-schema`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — Hallazgos HAL-F5-03 y HAL-F10-03 resueltos, 48 tests pasando, 0 regresiones.

---

## 1. Hallazgos Resueltos

### HAL-F5-03 (ALTO) — Cuádruple casteo cruzado Frontend ↔ Backend
- **Estado:** **RESUELTO**
- **Archivo:** `apps/web/src/app/commercial/sales/hooks/useSaleForm.js`
- **Problema previo:** El hook tomaba datos de la BD (Decimal → JSON string), los casteaba a `Number()`, calculaba subtotales e impuestos en el cliente con redondeos float64, y los enviaba al backend como `Number()` que volvía a castear a Decimal.
- **Solución implementada:** Se adoptó la Arquitectura Opción B (Backend-First / Server-Side Single Source of Truth). El formulario en frontend envía únicamente cantidades, identificadores y precios base limpios en `detalles`. El backend es el único responsable canónico del recálculo de subtotales, IVA y totales, eliminando discrepancias de redondeo y casteo duplicado.

### HAL-F10-03 (CRÍTICO) — Escala Decimal(12, 2) insuficiente en costos unitarios base
- **Estado:** **RESUELTO**
- **Archivos:** `apps/api/prisma/schema.prisma`, base de datos PostgreSQL.
- **Campos migrados a `@db.Decimal(14, 4)`:**
  1. `Insumo.costoBase`
  2. `PrecioProveedor.costoUnidadBase`
  3. `PrecioProveedor.precioCompra`
- **Impacto y migración:** La migración se sincronizó sin pérdida de datos (`Decimal(14, 4)` es superconjunto exacto de `Decimal(12, 2)`). Permite modelar con precisión micro-costos (ej. cultivos, probióticos, cuajo o enzimas a $18.4523/g).

---

## 2. Test de Regresión

- **Test implementado:** `TEST-AUD-EMERG-04` en `apps/api/src/common/decimal/tests/decimal-precision.spec.js`.
- **Comprobación:** Persiste un micro-ingrediente con `costoBase = 18.4523` y recupera desde la base de datos verificando que el valor preserva los 4 decimales exactos y no fue truncado a 2 decimales (`18.45`).
- **Resultados de ejecución:**
  - Suites ejecutadas: 10/10
  - Tests totales: 48/48 pasados (100% verdes)
  - Regresiones detectadas: **0**

---

## 3. Commits del Bloque

1. `fix(frontend): eliminate quadruple cast in sale form (HAL-F5-03)`
2. `fix(schema): expand cost precision to Decimal(14,4) (HAL-F10-03)`

---

**BLOQUE 6B CERRADO. DETENIDO.**
