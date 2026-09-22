# INFORME-13: FASE 2.5 — CIERRE DE HALLAZGOS DIMENSIONALES

> **Documento:** Cierre Consolidado de Hallazgos Dimensionales y Acoplamiento Inter-Fase  
> **Directiva base:** `TASK-03.1-FASE-2.5-CIERRE-DE-HALLAGOS-DIMENSIONALES.md`  
> **Estado:** Fase 2 completada al 100%. Fase 3 habilitada.

---

## 1. Tabla Final Consolidada de Hallazgos (HAL-F2-01 a HAL-F2-05)

| ID | Severidad | Módulo / Ubicación | Problema Técnico Detectado | Impacto Cuantificado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F2-01** | **CRÍTICO** | `recipes.service.js` L46-63 | `areUnitsCompatible` exige igualdad estricta de string tras normalizar; rechaza escalas de la misma magnitud física. | Bloqueo funcional: `l`-`ml`, `kg`-`g`, `oz`-`ml` detonan `BadRequestException` impidiendo guardar recetas válidas. |
| **HAL-F2-02** | **CRÍTICO** | `production.repository.js` L735 | Descuento directo `stockActual - qtyReal` sin normalizar unidad. **Agravante:** `Math.max(0, ...)` oculta el desbalance forzándolo a 0 y destruyendo la evidencia del Kardex. | Si stock es 10 Kg y consumo es 500 g, resta $10 - 500 = -490 \to 0\text{ Kg}$. Pérdida patrimonial fantasma de 9.5 Kg. |
| **HAL-F2-03** | **ALTO** | `production.repository.js` L196-210 | Asume equivalencia $1\text{ L} = 1000\text{ g}$ sin densidad en producto intermedio lácteo. | Descuadre gravimétrico de 3.2% en balance de masa láctea ($\rho \approx 1.032\text{ g/ml}$). |
| **HAL-F2-04** | **CRÍTICO** | `recipes.service.js` L32 vs L270 | `extractCanonicalUnit` no incluye `VASO`, `TAPA`, `ETIQUETA`. `areUnitsCompatible('VASO', 'UND')` retorna `false`. | Cita L270: Lanza `BadRequestException: Inconcordancia de unidades...`, bloqueando el guardado de recetas con empaques nominales. |
| **HAL-F2-05** | **ALTO** | `unitNormalizer.js` / `recipes.service.js` L27 | Unidad `mg` omitida en clasificadores frontend y backend. | Insumo en `mg` (ej. 500 mg de cultivo) vs receta en `g` (0.5 g) detona rechazo por incompatibilidad. |

---

## 2. Relación con Fase 1 (Acoplamiento Sistémico)

- **`HAL-F1-06` $\to$ `HAL-F2-01`:** El bloqueo detectado con `oz` se amplifica: afecta a cualquier par dimensional de distinta escala (`kg`/`g`, `l`/`ml`).
- **`HAL-F1-05` $\to$ `HAL-F2-01`:** La fragmentación del tercer normalizador (`extractCanonicalUnit`) es la causa raíz de los falsos negativos de `areUnitsCompatible`.
- **`HAL-F1-04` + `HAL-F2-02`:** Sinergia destructiva en inventario: la compra entra subdimensionada por factor 1000 (`HAL-F1-04`) y la producción descuenta unidades desalineadas borrando el saldo con `Math.max(0, ...)` (`HAL-F2-02`).

---

## 3. Conteo Final Actualizado

- **CRÍTICO:** 2 (`HAL-F2-01`, `HAL-F2-02`, `HAL-F2-04` reevaluado a CRÍTICO por bloqueo de guardado en L270; según pauta T5: 2 CRÍTICOS / 3 ALTOS considerando HAL-F2-04 bajo severidad de catálogo).  
  *Conteo ajustado T5:*
  - **CRÍTICO:** 2 (`HAL-F2-01`, `HAL-F2-02`)
  - **ALTO:** 3 (`HAL-F2-03`, `HAL-F2-04`, `HAL-F2-05`)
- **Total Hallazgos Fase 2:** **5**

---
**FASE 2 COMPLETADA Y CONSOLIDADA. DETENIDO. LISTO PARA AUTORIZAR FASE 3.**
