# INFORME-11: FASE 1.9 — RESTAURACIÓN DE TRAZABILIDAD Y FORMALIZACIÓN FINAL

> **Documento:** Restauración de Trazabilidad Forense y Cierre Consolidado de Fase 1  
> **Directiva base:** `TASK-02.5-FASE-1.9-RESTAURACION-TRAZABILIDAD.md`  
> **Estado:** Fase 1 cerrada formalmente. Fase 2 habilitada.

---

## 1. Justificación Forense de Ubicaciones (T5) y Hallazgos Descartados/Aclarados (T3, T4)

- **HAL-F1-03 (Líneas):** Ubicación exacta en `apps/api/src/inventory/inventory.service.js` L24-35 (la referencia a L340 fue errata del prompt; el archivo solo tiene 83 líneas).
- **HAL-F1-04 (Archivo):** Ubicación en `apps/api/src/purchases/purchases.repository.js` L173-174 (en `purchases.service.js` L166 no existe código; tiene 70 líneas).
- **Sobre T3 (Mapeo 'lt'):** En `unitNormalizer.js` L22, `'lt'` mapea a `CANONICAL_UNITS.VOL_BIG` (`'l'`), no a `'ml'`. Sin embargo, `getUnitConversionFactor` L23 define factor 1000 entre `l` y `ml`. Se tipifica **HAL-F1-07** como **BAJO / NO CONFIRMADO EN CÓDIGO ACTUAL** (sin distorsión de mapeo directo).
- **Sobre T4 (`CACHE` global):** En `unit-converter.js` L24 no existe `CACHE`; es una tabla inmutable de sinónimos (`UNIT_SYNONYMS`). No hay mutación ni leak. Se tipifica **HAL-F1-08** como **INFORMATIVO / DESCARTADO**.

---

## 2. Tabla Final Consolidada de Hallazgos (HAL-F1-01 a HAL-F1-08)

| ID | Archivo / Línea | Severidad | Problema Técnico | Impacto Cuantificado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F1-01** | `unit-converter.js` L56 vs `unitNormalizer.js` L13 | **CRÍTICO** | Inconsistencia de conversión `oz` (Frontend factor 1 vs Backend 29.5735). | Desincronización del 96.6% en insumos de recetas. |
| **HAL-F1-02** | `production.repository.js` L945 | **ALTO** | Hardcoding `'UNIDAD'`/`'Litros'` al generar lotes en Kardex. | Pérdida de balance de masa y trazabilidad física. |
| **HAL-F1-03** | `inventory.service.js` L24-35 | **CRÍTICO** | Heurística `costoUnitario > 100` divide por 1000 en unidades pequeñas. | Subvaluación patrimonial activa del 99.9% en inventario. |
| **HAL-F1-04** | `purchases.repository.js` L173-174 | **CRÍTICO** | Escalado condicionado a `['Lt','Lts','Kg','Kgs']`. Ignora `Litros`/`Kilogramos`. | Compra no escala $\times 1000$; stock subdimensionado $\times 1000$. |
| **HAL-F1-05** | `recipes.service.js` L19-38 | **ALTO** | Tercer normalizador local (`extractCanonicalUnit`) paralelo y desincronizado. | Fragmentación triple de normalización en el backend. |
| **HAL-F1-06** | `recipes.service.js` L46-63 | **CRÍTICO** | `areUnitsCompatible('oz','ml')` retorna `false`. | `BadRequestException`: bloqueo funcional al formular con `oz`. |
| **HAL-F1-07** | `unitNormalizer.js` L22-23 | **BAJO** | Revisión de mapeo y factores en utilidades frontend (evaluado en T3). | Sin error activo de mapeo directo en código fuente. |
| **HAL-F1-08** | `unit-converter.js` L24 | **INFORMATIVO** | Reporte de mutación de CACHE global (evaluado en T4). | Descartado: estructura estática inmutable sin leak. |

---

## 3. Conteo Final Corregido

- **CRÍTICO:** 4 (`HAL-F1-01`, `HAL-F1-03`, `HAL-F1-04`, `HAL-F1-06`)
- **ALTO:** 2 (`HAL-F1-02`, `HAL-F1-05`)
- **BAJO / DESCARTADO:** 2 (`HAL-F1-07`, `HAL-F1-08`)
- **Total Registros Fase 1:** **8**

---

## 4. Precondiciones Mandatorias para Fase 2

1. Aislamiento Dimensional Estricto (Masa vs. Volumen).
2. Detección y auditoría de densidades implícitas ($\text{1 L} \neq \text{1 kg}$).
3. Erradicación de heurísticas de texto plano por enums tipados.
4. Coherencia entre los clasificadores dimensionales del sistema.
5. Resolución de denegación funcional en `areUnitsCompatible`.

---
**FASE 1 CERRADA DEFINITIVAMENTE CON TRAZABILIDAD COMPLETA. LISTO PARA FASE 2.**
