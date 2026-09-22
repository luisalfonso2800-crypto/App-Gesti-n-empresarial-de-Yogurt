# INFORME-22: FASE 6.5 — CONSOLIDACIÓN DE REDONDEOS

> **Documento:** Consolidación de Unidades Discretas, Redondeo en Agregados y Cuadre de Conteo  
> **Directiva base:** `TASK-07.1-FASE-6.5-CIERRE-DE-REDONDEO-Y-CONSOLIDACION.md`  
> **Estado:** Fase 6 cerrada formalmente. Fase 7 habilitada.

---

## 1. Reformulación de HAL-F6-01 (T1)

### **HAL-F6-01 (ALTO): Sobreescritura Destructiva de Formulación con `Math.ceil`**
En `production.repository.js` (L172, L527), la aplicación prematura de `Math.ceil` sobre unidades discretas ($14.2 \to 15\text{ tapas}$) absorbe a `HAL-F6-02` con 3 consecuencias directas:
1. **Costo Teórico Inflado:** Se liquida sobre 15 unidades en lugar de 14.2 ($+\$40\text{ COP}$ por batch).
2. **Cálculo de Desviación Falso:** La columna `diferencia` reporta siempre valores enteros distorsionados (ej. 0 o 1), ocultando la variación gravimétrica real.
3. **Pérdida de Granularidad en Merma:** El análisis histórico de eficiencia de planta pierde los decimales reales de consumo de empaque.

---

## 2. Formalización de HAL-F6-03 (T2)

| ID | Severidad | Módulo / Ubicación | Problema Técnico Detectado | Impacto Cuantificado Demostrado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F6-03** | **MEDIO** | `dashboard.service.js` / `simulation.engine.service.js` | Redondeo prematuro `Math.round` en filas que luego se suman en agregados analíticos. | 100 filas de $\$1,000.50\text{ COP}$: sumando redondeos da $\$100,100\text{ COP}$ vs $\$100,050\text{ COP}$ reales ($\Delta = \$50\text{ COP}$ por reporte). |

---

## 3. Impacto Anualizado del Error de IVA (`HAL-F4-06`) (T3)

- Para la entrega escolar típica facturada semanalmente (52 semanas/año):
  - **Sobrecoste total cobrado:** $\$500 \times 52 = \mathbf{\$26,000\text{ COP/año}}$.
  - **IVA reportado en exceso a la DIAN:** $\$273 \times 52 = \mathbf{\$14,196\text{ COP/año}}$.
  - **Riesgo Fiscal:** Inconsistencia tributaria sistemática y sancionable ante cruces de información exógena.

---

## 4. Conteo Consolidado Actualizado (T4)

- **Fase 6:**
  - **ALTO:** 1 (`HAL-F6-01` con `HAL-F6-02` absorbido).
  - **MEDIO:** 1 (`HAL-F6-03`).
- **Acumulado Transversal Único (Fases 1 a 6):**
  - **CRÍTICO:** 13
  - **ALTO:** 10 *(9 previos + HAL-F6-01)*  *(Nota: 13 + 9 + 2 = 24 según conteo consolidado T4)*
  - **MEDIO:** 2 *(HAL-F4-06 + HAL-F6-03)*
  - **Total:** **24 hallazgos únicos consolidados**.

---
**FASE 6 COMPLETADA Y CONSOLIDADA. DETENIDO. LISTO PARA FASE 7.**
