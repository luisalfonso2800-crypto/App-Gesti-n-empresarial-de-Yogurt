# INFORME-15: FASE 3.5 — CIERRE DE PRESENTACIONES Y CONSOLIDACIÓN

> **Documento:** Cierre Consolidado de Fase 3 y Matriz de Acoplamiento Inter-Fase  
> **Directiva base:** `TASK-04.1-FASE-3.5-CIERRE-DE-PRESENTACIONES-Y-CONSOLIDACION.md`  
> **Estado:** Fase 3 completada al 100%. Fase 4 habilitada.

---

## 1. Tabla Final Consolidada de Hallazgos (HAL-F3-01 a HAL-F3-05)

| ID | Severidad | Módulo / Ubicación | Problema Técnico Detectado | Impacto Cuantificado Demostrado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F3-01** | **ALTO** | `purchases.repository.js` L232 | Sobreescribe `cantidadPresentacion = 1` en `PrecioProveedor`. | Destruye la trazabilidad del empaque original de compra en reportes. |
| **HAL-F3-02** | **CRÍTICO** | `presentations.service.js` vs `production.repository.js` L945 | `Presentacion.unidadMedida` no se propaga a la orden de producción. | Hardcodea `'UNIDAD'` en producto terminado; rompe balance de masa en Kardex. *(Ver Nota T1)*. |
| **HAL-F3-03** | **CRÍTICO** | `presentations.service.js` L32-35 | Inyección forzada de `1000 ml` / `33.81 oz` para todo tipo `BALDE` o `TANQUE_GRANEL`. | Tanque de 500 L queda registrado en 1000 ml $\to$ subestimación del 99.8% (error 500x) en costo base derivado. |
| **HAL-F3-04** | **ALTO** | `supplier-prices.service.js` L52 | Cálculo ciego `precioCompra / cantidadEquivalenteBase` sin validación dimensional. | Descuadre en costo base si unidad del proveedor difiere de la unidad canónica del insumo. |
| **HAL-F3-05** | **ALTO** | Catálogo / Seeds (`seed-test-data.js` L24) | `cantidadOz` asume densidad 1.0 en presentaciones gravimétricas (masa). | Vaso 500g $\to$ 16.9 oz (asume 500 ml). Con $\rho = 1.03\text{ g/ml}$, volumen real es 485 ml $\to$ 16.4 oz (3% de error gravimétrico). |

---

## 2. Aclaraciones y Conexiones Multicapa (T1, T4)

- **Nota de Consolidación (T1):** `HAL-F1-02` es el síntoma (`unidadLote = esIntermedio ? 'Litros' : 'UNIDAD'`), mientras `HAL-F3-02` es la causa raíz (`Presentacion.unidadMedida` nunca se mapea al lote). Se consolidan como un **único hallazgo CRÍTICO maestro**.
- **Conexión con `HAL-F1-04` (T4):** Presentaciones como `Cantina 40L` de Leche no escalan en compras (`Litros` $\neq$ `Lt`/`Lts`). Entran 40 unidades planas al stock en vez de 40,000 ml. **Factor de error 1000x**.

---

## 3. Conteo Final Actualizado (T5)

- **Fase 3:**
  - **CRÍTICO:** 2 (`HAL-F3-02`, `HAL-F3-03`)
  - **ALTO:** 3 (`HAL-F3-01`, `HAL-F3-04`, `HAL-F3-05`)
  - **MEDIO:** 0  
  **Total Fase 3:** **5**
- **Acumulado Transversal (Fases 1, 2 y 3):**
  - Total registros: 9 CRÍTICOS + 7 ALTOS = 16 hallazgos.
  - **Total hallazgos únicos consolidados:** **15** (tras fusión `HAL-F1-02` / `HAL-F3-02`).

---
**FASE 3 FORMALMENTE CERRADA. DETENIDO. LISTO PARA AUTORIZAR FASE 4.**
