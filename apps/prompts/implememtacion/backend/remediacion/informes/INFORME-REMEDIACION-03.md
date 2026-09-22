# INFORME-REMEDIACION-03: BLOQUE 3 — UNIDADES Y DIMENSIONES

> **Fecha:** 2026-09-22  
> **Rama:** `remediation/bloque-3-unidades`  
> **Hallazgos cubiertos:** `HAL-F1-01` (CRÍTICO), `HAL-F1-06` (CRÍTICO), `HAL-F2-01` (CRÍTICO), `HAL-F2-04` (CRÍTICO), `HAL-F1-04` (CRÍTICO), `HAL-F1-05` (ALTO), `HAL-F2-03` (ALTO), `HAL-F2-05` (ALTO)  
> **Tests de regresión implementados:** `TEST-AUD-01`, `TEST-AUD-02`, `TEST-AUD-17`, `TEST-AUD-EMERG-01`

---

## 1. Diseño del Clasificador Canónico Único (T1)
Se creó el módulo centralizado [`apps/api/src/common/units/unit-registry.js`](file:///apps/api/src/common/units/unit-registry.js):
- **Magnitudes Físicas Soportadas:** `MASA`, `VOLUMEN`, `CONTEO`.
- **Bases Canónicas:**
  - `MASA`: Gramos (`g` = 1, `kg` = 1000, `mg` = 0.001).
  - `VOLUMEN`: Mililitros (`ml` = 1, `l` = 1000, `oz` = 29.5735 fl oz líquido).
  - `CONTEO`: Unidades (`und` = 1, `paq` = 1).
- **Mapeo de Alias:** Normalización insensible a mayúsculas/minúsculas y plurales para más de 40 variantes (`kilos`, `litros`, `onzas`, `miligramos`, `vaso`, `tapa`, `etiqueta`, `botella`).
- **Funciones Exportadas:** `normalizeUnit`, `getMagnitude`, `getFactor`, `areCompatible`, `convert`, `convertVolumeToMass`.

---

## 2. Unificación de Clasificadores (T2 y T3)
1. **Backend `unit-converter.js`:** Convertido en un wrapper que delega 100% de la normalización y conversiones a `unit-registry.js`, manteniendo intacta su interfaz estática (`UnitConverter.convert`, etc.).
2. **Backend `unitNormalizer.js`:** Actualizado para consumir `normalizeUnit` y `getFactor`.
3. **Frontend `apps/web/src/utils/unitNormalizer.js`:**
   - Se eliminó la divergencia de `oz` (`1x` en web vs `29.57x` en backend).
   - Ahora `oz` en frontend mapea a volumen con factor relativo de `29.5735` respecto a `ml`.
   - Se integró `mg` como categoría de masa.

---

## 3. Resolución de Compatibilidad en Recetas (T4)
- En `apps/api/src/recipes/recipes.service.js`, se refactorizó `areUnitsCompatible(a, b)` delegando directamente en `areCompatible(a, b)` del registro canónico.
- **Resultado:**
  - `areUnitsCompatible('kg', 'g')` $\to$ **`true`** (resuelve `HAL-F2-01`).
  - `areUnitsCompatible('oz', 'ml')` $\to$ **`true`** (resuelve `HAL-F1-06`).
  - `areUnitsCompatible('VASO', 'UND')` $\to$ **`true`** (resuelve `HAL-F2-04`). Empaques primarios ya no son rechazados con falsos positivos.

---

## 4. Escalado Canónico en Compras y Lote Dinámico (T5 y T6)
- **`HAL-F1-04` (Compras):** En `purchases.repository.js`, se reemplazó el array rígido case-sensitive `['Lt','Lts','Kg','Kgs']` por `getFactor(currentInsumo.unidadBase, 'g') || getFactor(currentInsumo.unidadBase, 'ml') || 1`, garantizando escalado correcto para strings como `"Litros"`, `"Kilogramos"` o `"kg"`.
- **`HAL-F2-03` (Densidad):** Se implementó `convertVolumeToMass(qty, density)` requiriendo densidad explícita positiva para conversiones entre masa y volumen. Se registró deuda técnica en `BACKLOG_POST_AUDITORIA.md` respecto a la columna en BD.
- **`HAL-F3-02` (Unidad de Lote Dinámica):** En `production.repository.js`, la unidad del lote liquidado ahora adopta dinámicamente `produccion.receta?.unidadRendimiento` o la presentación comercial del producto, eliminando el hardcode a `"Litros"`.

---

## 5. Batería de Tests y Resultados (T8, T10)
Archivo: `apps/api/src/common/units/tests/unit-registry.spec.js`
- **`TEST-AUD-01` (`HAL-F1-06`, `HAL-F2-01`):** `areCompatible('kg', 'g')` y `areCompatible('oz', 'ml')` retornan `true`; masa vs volumen retorna `false` $\to$ ✅ **PASA**.
- **`TEST-AUD-02` (`HAL-F1-04`, `HAL-F1-05`):** 1 "Litros" a "ml" = 1000; 2.5 "Kilogramos" a "g" = 2500 $\to$ ✅ **PASA**.
- **`TEST-AUD-EMERG-01` (`HAL-F1-01`):** 1 "oz" a "ml" = 29.5735 en backend alineado con web $\to$ ✅ **PASA**.
- **`TEST-AUD-17` (`HAL-F2-04`):** VASO, TAPA, ETIQUETA clasificados como CONTEO y compatibles con UND $\to$ ✅ **PASA**.
- **Suite completa:** `pnpm --filter api test`
  ```text
  PASS src/common/units/tests/unit-registry.spec.js
  PASS src/production/tests/production-wip.spec.js
  PASS src/app.controller.spec.js
  PASS src/goals/tests/goals-production.spec.js
  PASS src/purchases/tests/purchases-cpp.spec.js
  PASS src/sales/sales.controller.spec.js

  Test Suites: 6 passed, 6 total
  Tests:       19 passed, 19 total
  Snapshots:   0 total
  Time:        4.154 s
  ```
- **Regresiones:** **0**. Todos los tests de Bloques 1, 2 y base permanecen 100% verdes.

---

## 6. Estado de los Hallazgos

| ID Hallazgo | Severidad | Estado | Evidencia |
| :--- | :---: | :---: | :--- |
| `HAL-F1-01` | **CRÍTICO** | **RESUELTO** | Factor canónico 29.5735 fl oz unificado en api y web; `TEST-AUD-EMERG-01`. |
| `HAL-F1-06` | **CRÍTICO** | **RESUELTO** | `areCompatible('oz', 'ml')` retorna `true`; `TEST-AUD-01`. |
| `HAL-F2-01` | **CRÍTICO** | **RESUELTO** | `areCompatible('kg', 'g')` retorna `true`; `TEST-AUD-01`. |
| `HAL-F2-04` | **CRÍTICO** | **RESUELTO** | Empaques clasificados en CONTEO; `TEST-AUD-17`. |
| `HAL-F1-04` | **CRÍTICO** | **RESUELTO** | Escalado con `getFactor` canónico en compras; `TEST-AUD-02`. |
| `HAL-F1-05` | **ALTO** | **RESUELTO** | Normalizador regex ad-hoc reemplazado por `normalizeUnit`. |
| `HAL-F2-03` | **ALTO** | **RESUELTO** | Función defensiva `convertVolumeToMass` con densidad explícita. |
| `HAL-F2-05` | **ALTO** | **RESUELTO** | Unidad `mg` integrada en MASA (factor 0.001) en api y web. |

---
**ESTADO: BLOQUE 3 DE REMEDIACIÓN COMPLETADO AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A BLOQUE 4 SIN AUTORIZACIÓN.**
