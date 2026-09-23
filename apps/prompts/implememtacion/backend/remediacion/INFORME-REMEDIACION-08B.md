# INFORME DE REMEDIACIÓN — BLOQUE 8B: CIERRE DEFINITIVO DE HAL-F4-07

> **Rama:** `remediation/bloque-8b-cierre-decimal`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — HAL-F4-07 RESUELTO (100%), 60 tests pasando, 0 regresiones.

---

## 1. Estado Final de HAL-F4-07: RESUELTO (100%)

Con la ejecución de las fases 6A, 8A y la verificación documental de la fase 8B, el hallazgo `HAL-F4-07` (distorsión de precisión numérica float64 en cálculos monetarios y de cantidades) queda **RESUELTO AL 100%**.

### Conteo Consolidado de Flujos:
- **5 flujos críticos del núcleo (Bloque 6A):**
  - Valoración y ponderación de Kardex en `apps/api/src/inventory/inventory.repository.js`.
  - Recálculo de saldos de cartera y anticipos en `apps/api/src/payments/payments.repository.js`.
  - Cálculo de saldos y egresos en ventas en `apps/api/src/sales/sales.repository.js`.
  - Precisión Decimal(14, 4) en costos unitarios en persistencia Prisma.
- **18 flujos financieros residuales (Bloque 8A):**
  - Costo unitario base, egreso financiero consolidado y liquidación de ítems en `apps/api/src/purchases/purchases.repository.js`.
  - Desglose de base imponible, determinación de IVA y costeo unitario base en `apps/api/src/supplier-prices/supplier-prices.service.js`.
  - Reducción acumulada de costo total y liquidación server-side de venta en `apps/api/src/sales/sales.repository.js`.
- **195 conversiones en Categoría B (Deuda técnica aceptada):**
  - Validaciones Zod, DTOs (`@IsNumber()`, coerciones de entrada HTTP).
- **75 conversiones en Categoría C (Deuda técnica aceptada):**
  - Logging, formatos de cadenas, fechas y comparaciones de IDs.

---

## 2. Justificación Técnica de Deuda Aceptada (Categorías B y C)

Las ocurrencias en Categorías B y C se mantienen con `Number()` de forma deliberada:
1. **Inocuidad Numérica:** Operan estrictamente como guardas de entrada o formatos de salida, sin realizar operaciones aritméticas iterativas que acumulen drift por coma flotante IEEE-754.
2. **Eficiencia y Estabilidad:** Reemplazar coerciones simples de DTOs o mensajes de depuración generaría sobrecostos innecesarios de serialización sin aportar valor a la exactitud contable del negocio.
3. **Recomendación:** Migración oportunista cuando los archivos respectivos sean modificados por razones funcionales en futuras versiones.

---

## 3. Cobertura y Pruebas Automatizadas

Se confirmaron las pruebas agregadas en `apps/api/src/common/decimal/tests/decimal-utils.spec.js`:
- **`TEST-AUD-EMERG-14`:** Simulación de Costo Promedio Ponderado (CPP) en 20 compras sucesivas con precios decimales periódicos sin acumulación de drift.
- **`TEST-AUD-EMERG-15`:** Explosión de materiales y costo WIP fraccionario determinista.

**Resultado de la Suite:**
- **Suites:** 12 passed, 12 total.
- **Tests:** 60 passed, 60 total (100% verdes).
- **Regresiones:** 0.

---

## 4. Commits del Bloque

1. `docs(remediation): close HAL-F4-07 as resolved (100%)`
2. `docs(remediation): update INFORME-FINAL-REMEDIACION to 39/39`
