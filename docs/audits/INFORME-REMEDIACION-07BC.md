# INFORME DE REMEDIACIÓN — BLOQUE 7BC: CIERRE DE HALLAZGOS MENORES

> **Rama:** `remediation/bloque-7bc-cierre-menores`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — 6 hallazgos abordados (5 resueltos, 1 parcial), 58 tests pasando, 0 regresiones.

---

## 1. Hallazgos Resueltos y Estado

### HAL-F4-02 (CRÍTICO) — Hardcoding a $3,400 COP en costo WIP si `costoUnitario <= 0 || costoUnitario > 50000`
- **Estado:** **RESUELTO**
- **Archivo:** `apps/api/src/production/production.repository.js`
- **Solución implementada:** Se eliminó la asignación arbitraria de `$3,400`. Si `costoUnitario <= 0` o `> 50000`, el repositorio arroja `BadRequestException` impidiendo explosión o costeos ficticios en órdenes de producción.

### HAL-F4-03 (CRÍTICO) — Fallback `|| 1` en `rendimientoBase = 0` genera explosión de materiales
- **Estado:** **RESUELTO**
- **Archivos:** `apps/api/src/production/production.repository.js`, `apps/api/src/recipes/dto/create-recipe.dto.js`
- **Solución implementada:** Validación explícita de `rendimientoBase > 0`. Lanza `BadRequestException` tanto en la explosión de BOM como a nivel de DTO de recetas.

### HAL-F8-02 (ALTO) — Merma sin validación de rango (`0 <= merma < 100`)
- **Estado:** **RESUELTO**
- **Archivos:** `apps/api/src/production/production.repository.js`, `apps/api/src/recipes/dto/create-recipe.dto.js`
- **Solución implementada:** Se valida que el porcentaje de merma esté estrictamente en el rango `[0, 100)`. Cualquier valor negativo o `>= 100` lanza `BadRequestException`.

### HAL-F8-04 (ALTO) — Polimorfismo sin unidad en `cantidadProducidaReal`
- **Estado:** **RESUELTO**
- **Archivos:** `apps/api/prisma/schema.prisma`, `apps/api/src/production/production.repository.js`
- **Solución implementada:** Se añadió la columna `unidadCantidadProducida` (String con default `"UNIDAD"`) en el modelo `Produccion`. El repositorio ahora almacena la unidad explícita al registrar producciones.

### HAL-F6-01 (ALTO) — `Math.ceil` destruye `cantidadTeorica` en formulación
- **Estado:** **RESUELTO**
- **Archivo:** `apps/api/src/production/production.repository.js`
- **Solución implementada:** Se calcula y preserva `cantidadTeoricaOriginal` con precisión decimal antes de aplicar redondeos discretos de planta (`Math.ceil`), garantizando trazabilidad analítica de la receta teórica vs empaques discretos.

### HAL-F6-03 (MEDIO) — Redondeo de filas en dashboards distorsiona agregados
- **Estado:** **PARCIAL** (Implementado en `apps/api/src/dashboard/simulation.engine.service.js`)
- **Solución implementada:** En el motor de simulación se cambió la agregación para acumular valores crudos y aplicar el redondeo una sola vez al final.
- **Deuda técnica documentada:** `apps/api/src/dashboard/dashboard.service.js` queda pendiente de homologación en la próxima iteración.

---

## 2. Tests de Regresión (Bloque 7BC)

- **Archivo de pruebas:** `apps/api/src/common/tests/bloque-7bc.spec.js`
- **Casos cubiertos (6 tests nuevos):**
  1. `TEST-AUD-EMERG-08` (HAL-F4-02): Costo unitario WIP <= 0 o > 50,000 lanza `BadRequestException`.
  2. `TEST-AUD-EMERG-09` (HAL-F4-03): `rendimientoBase = 0` lanza `BadRequestException`.
  3. `TEST-AUD-EMERG-10` (HAL-F8-02): Merma `>= 100%` lanza `BadRequestException`.
  4. `TEST-AUD-EMERG-11` (HAL-F8-04): Persistencia de `unidadCantidadProducida` en el modelo `Produccion`.
  5. `TEST-AUD-EMERG-12` (HAL-F6-01): Preservación de `cantidadTeoricaOriginal` en BOM.
  6. `TEST-AUD-EMERG-13` (HAL-F6-03): Suma cruda previa al redondeo en simulador.
- **Resultados:**
  - Suites ejecutadas: 12/12
  - Tests totales: 58/58 verdes (100% éxito)
  - Regresiones en bloques 1-7A: **0**

---

## 3. Commits del Bloque

1. `fix(production): validate rendimientoBase, merma and costo; preserve cantidadTeoricaOriginal (HAL-F4-02, F4-03, F8-02, F6-01)`
2. `fix(schema): add unidadCantidadProducida to Produccion (HAL-F8-04)`
3. `fix(dashboard): sum raw then round once (HAL-F6-03)`
4. `test(bloque-7bc): add regression tests (HAL-F4-02, F4-03, F8-02, F8-04, F6-01, F6-03)`
5. `docs(remediation): add Bloque 7BC prompt`
