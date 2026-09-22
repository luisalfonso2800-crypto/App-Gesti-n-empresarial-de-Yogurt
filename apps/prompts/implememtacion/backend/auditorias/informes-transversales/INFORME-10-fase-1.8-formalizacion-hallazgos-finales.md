# INFORME-10: FASE 1.8 — FORMALIZACIÓN DE HALLAZGOS FINALES Y HABILITACIÓN FASE 2

> **Documento:** Cierre Final y Consolidado de Hallazgos de Fase 1  
> **Directiva base:** `TASK-02.4-FASE-1.8-FORMALIZACION-DE-HALLAGOS-FINALES-Y-HABILITACION-FASE-2.md`  
> **Estado:** Fase 1 concluida al 100%. Fase 2 plenamente habilitada.

---

## 1. Tabla Final Consolidada de Hallazgos (Fase 1)

| ID | Archivo / Ubicación | Severidad | Problema Técnico Detectado | Consecuencia en Planta / Negocio |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F1-01** | `apps/web/src/utils/unitNormalizer.js` L23 | **CRÍTICO** | `toCanonicalUnit` mapea `'lt'` a `'ml'` en lugar de `'l'`. | Distorsión dimensional de factor 1000 en visualización y cálculo de insumos. |
| **HAL-F1-02** | `apps/api/src/common/utils/unitConverter.js` L24 | **ALTO** | `UnitConverter.convert` muta `CACHE` global in-memory sin límite ni desalojo. | Riesgo de memory leak y corrupción de conversiones; afecta Kardex y balance de masa. |
| **HAL-F1-03** | `apps/api/src/inventory/inventory.service.js` L340 | **CRÍTICO** | Heurística `costoUnitario > 100` divide arbitrariamente por 1000 en unidades pequeñas (`g`/`ml`). | Subvaluación patrimonial activa del 99.9% en insumos con costo > $100 COP. |
| **HAL-F1-04** | `apps/api/src/purchases/purchases.service.js` L166 | **CRÍTICO** | Escalado condicionado a `['Lt','Lts','Kg','Kgs']`. No escala insumos con `Litros` o `Kilogramos`. | Error activo: compra de 1 L de Leche o 50 Kg de Azúcar ingresa 1 o 50 al stock en vez de 1,000 o 50,000. |
| **HAL-F1-05** | `apps/api/src/recipes/recipes.service.js` L19-38 | **ALTO** | Tercer normalizador local (`extractCanonicalUnit`) paralelo a `UnitConverter` y `unitNormalizer.js`. | Fragmentación triple de normalización con alias inconsistentes entre capas. |
| **HAL-F1-06** | `recipes.service.js` + `areUnitsCompatible` | **CRÍTICO** | `areUnitsCompatible('oz', 'ml')` devuelve `FALSE` pese a ser ambas de volumen en `UnitConverter`. | Bloqueo funcional: rechaza recetas con `BadRequestException` si mezclan `oz` con base `ml`. |

---

## 2. Conteo Final Corregido

- **CRÍTICO:** 4 (`HAL-F1-01`, `HAL-F1-03`, `HAL-F1-04`, `HAL-F1-06`)
- **ALTO:** 2 (`HAL-F1-02`, `HAL-F1-05`)
- **MEDIO:** 0
- **Total Hallazgos:** **6**

---

## 3. Precondiciones Mandatorias para Fase 2

1. **Aislamiento Dimensional Estricto:** Prohibir conversión directa MASA ↔ VOLUMEN sin densidad explícita.
2. **Auditoría de Densidad Implícita:** Detectar equivalencias ciegas $\text{1 L} = \text{1 kg}$ en formulaciones lácteas.
3. **Erradicación de Heurísticas de Texto:** Reemplazar `['Lt','Lts']` por enums o Value Objects canónicos.
4. **Coherencia entre los Tres Clasificadores Dimensionales:** Unificar criterios de clasificación de magnitud entre frontend y backend.
5. **Auditoría de Denegación Funcional de `areUnitsCompatible`:** Resolver rechazo indebido de combinaciones volumétricas válidas (ej. `oz` vs `ml`).

---
**FASE 1 FORMALMENTE CERRADA. LISTO PARA AUTORIZAR FASE 2.**
