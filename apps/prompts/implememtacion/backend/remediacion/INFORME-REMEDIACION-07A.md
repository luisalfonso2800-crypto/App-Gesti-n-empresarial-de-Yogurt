# INFORME DE REMEDIACIÓN — BLOQUE 7A: HEURÍSTICAS Y HARDCODINGS CRÍTICOS

> **Rama:** `remediation/bloque-7a-heuristicas`  
> **Fecha:** 2026-09-22  
> **Estado:** ✅ COMPLETADO — Hallazgos HAL-F1-03, HAL-F3-02 y HAL-F3-03 resueltos, 52 tests pasando, 0 regresiones.

---

## 1. Hallazgos Resueltos

### HAL-F1-03 (CRÍTICO) — Heurística monetaria `costoUnitario > 100` en unidades pequeñas
- **Estado:** **RESUELTO**
- **Archivo:** `apps/api/src/inventory/inventory.service.js`
- **Problema previo:** Si el insumo tenía unidad pequeña ('g', 'ml') y su costo unitario superaba 100, el sistema asumía erróneamente que estaba expresado en kg/l y dividía entre 1000 arbitrariamente, distorsionando micro-ingredientes costosos (ej. cultivos de $120/g pasaban a $0.12/g).
- **Solución implementada:** Se eliminó por completo la heurística monetaria. La valoración de inventario opera directamente sobre la unidad base canónica del insumo, integrando `unit-registry.js`.

### HAL-F3-02 (CRÍTICO) — Unidad de lote de producción hardcoded a 'Litros' / 'UNIDAD'
- **Estado:** **RESUELTO**
- **Archivo:** `apps/api/src/production/production.repository.js`
- **Problema previo:** Al completar una orden de producción, la unidad del lote generado forzaba 'Litros' para intermedios o 'UNIDAD' para terminados, ignorando la unidad real de la presentación del producto o el rendimiento de la receta.
- **Solución implementada:** Se incluyó `receta` en la consulta y se asigna dinámicamente la unidad del lote tomando `receta.unidadRendimiento` o `producto.presentacion.unidadMedida`, preservando unidades como gramos, kilogramos o mililitros.

### HAL-F3-03 (CRÍTICO) — Inyección forzada de 1000 ml / 33.81 oz en envases BALDE / TANQUE_GRANEL
- **Estado:** **RESUELTO**
- **Archivo:** `apps/api/src/presentations/presentations.service.js`
- **Problema previo:** Si no se enviaba `cantidadMl` en presentaciones a granel, el servicio inyectaba silenciosamente 1000 ml y 33.81 oz, provocando órdenes de producción e inventarios con volúmenes irreales.
- **Solución implementada:** Se reemplazó el fallback silencioso por una validación estricta que lanza `BadRequestException` exigiendo el volumen real del tanque/balde. Si se especifica `cantidadMl`, se calculan sus onzas líquidas de forma determinista.

---

## 2. Tests de Regresión

- **Archivo de pruebas:** `apps/api/src/common/units/tests/bloque-7a-heuristics.spec.js`
- **Casos cubiertos:**
  1. `TEST-AUD-EMERG-05` (HAL-F1-03): Insumo en gramos con costo $120/g se preserva como $120 y calcula valor de inventario exacto ($1,200).
  2. `TEST-AUD-EMERG-06` (HAL-F3-02): Producto terminado con presentación en gramos asigna unidad 'g' al lote en lugar de 'UNIDAD'.
  3. `TEST-AUD-EMERG-07` (HAL-F3-03): Creación de presentación BALDE sin `cantidadMl` lanza `BadRequestException`; con `cantidadMl` calcula `cantidadOz` proporcional.
- **Resultados:**
  - Suites ejecutadas: 11/11
  - Tests totales: 52/52 pasados (100% verdes)
  - Regresiones detectadas: **0**

---

## 3. Commits del Bloque

1. `fix(inventory): remove heuristic > 100 and use unit-registry (HAL-F1-03)`
2. `fix(production): inherit lote unit from presentacion/receta (HAL-F3-02)`
3. `fix(presentations): reject granel without explicit volume (HAL-F3-03)`

---

**BLOQUE 7A CERRADO. DETENIDO.**
