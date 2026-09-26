# INFORME-17: FASE 4.5 — CIERRE DE FÓRMULAS Y CONSOLIDACIÓN

> **Documento:** Cierre Consolidado de Fórmulas Matemáticas, Precisión Numérica y Acoplamiento Financiero  
> **Directiva base:** `TASK-05.1-FASE-4.5-CIERRE-DE-FORMULAS-Y-CONSOLIDACION.md`  
> **Estado:** Fase 4 cerrada formalmente. Fase 5 habilitada.

---

## 1. Tabla Final Consolidada de Hallazgos (HAL-F4-01 a HAL-F4-07)

| ID | Severidad | Archivo / Línea | Problema Técnico Detectado | Impacto Cuantificado Demostrado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F4-01** | **CRÍTICO** | `purchases.repository.js` L176 | Compras incrementa stock pero **no actualiza `costoPromedio`**. | Valuación contable de inventario desfasada respecto a compras reales. |
| **HAL-F4-02** | **CRÍTICO** | `production.repository.js` L251 | Fallback hardcodeado a $3,400 COP si costo de intermedio es $\le 0$ o $>50000$. | Suprime el costo real de manufactura por una constante arbitraria. |
| **HAL-F4-03** | **CRÍTICO** | `production.repository.js` L157 | Fallback `\|\| 1` ante `rendimientoBase = 0` sin lanzar excepción. | Explosión destructiva de materiales por $100\times$ o más en errores de tipeo. |
| **HAL-F4-04** | **ALTO** | `sales.repository.js` L146 | Si omite `baseGravable`, backend asume `cant * precio` ignorando `precioIncluyeIva`. | Venta de 1 und a $10,500 COP (IVA 19% inc.): factura $12,495 en vez de $10,500. **Sobrecobro del 19% ($1,995 COP)**. |
| **HAL-F4-05** | **ALTO** | `supplier-prices.service.js` L52 | Divide `precioTotalConIva / cantidadEquivalenteBase` sin descontar IVA. | Infla el costo unitario de materia prima con IVA no descontado. *(Ver Nota T4)*. |
| **HAL-F4-06** | **MEDIO** | `useSaleForm.js` L120 | Redondeo `Math.round` línea a línea de IVA. *(Nota: asume HAL-F4-04 resuelto; hoy genera 19%)*. | Descuadre recurrente de $\pm \$1\text{ COP}$ entre total y suma de impuestos. |
| **HAL-F4-07** | **CRÍTICO** | Arquitectura Transversal | **Ausencia total de librería decimal** (`decimal.js`/`big.js`). Aritmética en float64. | Imprecisión acumulativa de coma flotante binaria ($0.1 + 0.2 = 0.30000000000000004$). Causa raíz común. |

---

## 2. Nota de Consolidación Maestra (T4)
- **`HAL-F3-04` + `HAL-F4-05`:** Ambos coexisten en `supplier-prices.service.js` L52 como doble falla en una sola línea:
  1. *Falta de validación dimensional* (unidad de empaque vs catálogo).
  2. *Inclusión indebida de IVA* en el cálculo del costo unitario base.
  Se consolidan como **Hallazgo Maestro de Fijación de Tarifas de Proveedor**.

---

## 3. Conteo Final Actualizado (T5)

- **Fase 4:**
  - **CRÍTICO:** 4 (`HAL-F4-01`, `HAL-F4-02`, `HAL-F4-03`, `HAL-F4-07`)
  - **ALTO:** 2 (`HAL-F4-04`, `HAL-F4-05`)
  - **MEDIO:** 1 (`HAL-F4-06`)  
  **Total Fase 4:** **7 hallazgos**
- **Acumulado Transversal (Fases 1 a 4):**
  - Total registros: 13 CRÍTICOS + 9 ALTOS + 1 MEDIO = 23.
  - **Total hallazgos únicos consolidados:** **21** (tras consolidaciones F1-02/F3-02 y F3-04/F4-05).

---
**FASE 4 COMPLETADA Y CONSOLIDADA. DETENIDO. LISTO PARA AUTORIZAR FASE 5.**
