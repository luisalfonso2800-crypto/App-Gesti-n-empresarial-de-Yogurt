# INFORME DE REMEDIACIÓN — BLOQUE 8A: CIERRE DE HAL-F4-07 (FLUJOS FINANCIEROS RESIDUALES)

> **Rama:** `remediation/bloque-8a-decimal-residuales`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — Flujos financieros y de costeos residuales migrados a Decimal.js, 60 tests pasando, 0 regresiones.

---

## 1. Alcance y Clasificación del Inventario `Number()`

Se realizó un escaneo grep exhaustivo de las ocurrencias de `Number()` en el código de producción de `apps/api/src`:

- **Categoría A (Cálculo financiero / stock / costeo / producción):** 18 conversiones migradas integralmente a `Decimal.js` (`toDecimal`, `add`, `sub`, `mul`, `div`).
- **Categoría B (Validaciones Zod, DTOs y guardas de entrada):** ~195 ocurrencias mantenidas intactas (no realizan aritmética financiera ni distorsión float64).
- **Categoría C (Logging, fechas, formateo de cadenas y IDs):** ~75 ocurrencias mantenidas intactas (bajo riesgo analítico, destinadas a deuda técnica documentada en Bloque 8B).

---

## 2. Flujos Financieros Residuales Migrados (Categoría A)

1. **`apps/api/src/purchases/purchases.repository.js`**
   - Costo unitario base (`cUnidad = div(pCompra, contenido)`) con 4 decimales.
   - Egreso consolidado de compra (`totalEgreso = add(totalNetoCompra, flete)`) con 2 decimales.
   - Liquidación de ítems en `calculateSummary` (`subtotalConIva`, `subtotalSinIva`, `montoIva`, `costoBaseUnitario`) y agregación global sin pérdida por redondeo prematuro.

2. **`apps/api/src/supplier-prices/supplier-prices.service.js`**
   - Cálculo de IVA y desglose de base imponible en `_computePriceFields` con `Decimal.js`.
   - Cálculo de `costoUnidadBase = div(costoBaseSinIva, cantidadEquivalenteBase)` preservando 4 decimales exactos.

3. **`apps/api/src/sales/sales.repository.js`**
   - Reducción acumuladora de `costoTotal` en `findAll` y `findById` usando `add(acc, mul(cUnit, cantidad))`.
   - Recálculo server-side de venta: importes brutos, bases gravables por tipo de descuento comercial/financiero, determinación de IVA y liquidación de utilidad por línea y de cabecera.
   - Cálculo exacto de `saldoPendienteCalc = sub(serverTotalVentaFinal, valorPagadoNum)` para soporte de anticipos o saldos a favor.

---

## 3. Tests de Regresión Implementados

En `apps/api/src/common/decimal/tests/decimal-utils.spec.js`:
- **`TEST-AUD-EMERG-14` (HAL-F4-07):** Verifica que el cálculo de Costo Promedio Ponderado (CPP) a lo largo de 20 compras sucesivas no acumula drift float64 IEEE-754.
- **`TEST-AUD-EMERG-15` (HAL-F4-07):** Verifica que la explosión de costo WIP con rendimientos fraccionarios y merma mantiene consistencia matemática determinista.

**Resultados de la Suite:**
- **Suites:** 12 passed, 12 total.
- **Tests:** 60 passed, 60 total (58 previos + 2 nuevos).
- **Regresiones:** **0**.

---

## 4. Próximos Pasos
- Proceder al Bloque 8B para formalizar la documentación de las categorías B y C en `BACKLOG-EMERGENTE.md` / `INFORME-FINAL-REMEDIACION.md`.
