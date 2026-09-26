# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F2: CÁLCULOS LOCALES DUPLICADOS (DELTA)

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Detección de lógica de negocio y cálculos aritméticos duplicados en cliente frente a la verdad canónica del backend.  
> **Estado:** ✅ FASE F2 COMPLETADA

---

## 1. Inventario y Clasificación de Cálculos Locales

Tras la remediación total del backend (39/39 hallazgos resueltos, `unit-registry.js` canónico y `Decimal.js` en todas las transacciones), se auditó la presencia de cálculos aritméticos redundantes en el frontend:

| Componente / Hook Frontend | Cálculo Local Detectado | Estado Post-Remediación | Veredicto & Divergencia con Backend |
| :--- | :--- | :--- | :--- |
| **`useSaleForm.js`** | `computeTotals` recalcula `baseGravable`, `ivaTotal`, `descuentoTotal`, `totalVenta` y `saldoPendiente` usando `Math.round`. | **DUPLICACIÓN PARCIAL DE PREVIEW** | **Aceptable como UI Preview, pero con riesgo de divergencia:** El frontend usa `Math.round` entero mientras que el backend calcula con `Decimal.js` exacto a 2 decimales (`HAL-F7-02` / `HAL-F4-07`). Al enviar el POST, el backend recacula y sobreescribe los valores verdaderos. |
| **`purchaseCalculations.js`** | `calculateRowFinancials` y `calculatePurchaseTotals` aplican redondeo `Math.round` en subtotales e IVA de compras y fletes. | **DUPLICACIÓN DE PREVIEW** | En el backend (`purchases.repository.js`), los subtotales se calculan con `toDecimal` y se suman crudos antes de redondear (`Bloque 8A`). El frontend puede presentar una diferencia de $\pm 1$ peso en la previsualización respecto al comprobante final generado. |
| **`recipeHelpers.js`** (L564) | `calculateRecipeCosts`: Asigna fallback hardcodeado `unitCostWip = 4390` (Litro base láctea) si el costo WIP es 0. | **DIVERGENCIA CRÍTICA CON BACKEND** | **REAGRAVADO / INCOMPATIBLE:** En el backend se eliminó el hardcoding a `$3,400` (`HAL-F4-02`), arrojando ahora `BadRequestException`. El frontend aún inventa un costo de `$4.390` en su previsualización de recetas cuando no hay costo real, dando una falsa sensación de margen al usuario. |
| **`recipeHelpers.js`** (L584) | Heurística `['g', 'ml'].includes(...) ? 1000 : 1` para inferir `contenidoReferencial`. | **DIVERGENCIA CON UNIT-REGISTRY** | En el backend se prohibieron heurísticas implícitas (`HAL-F1-03`, `HAL-F3-03`). El frontend debe consultar las conversiones y densidades oficiales de `unit-registry.js`. |
| **`ProductionCreateForm.jsx`** | Validación local de stock WIP y suficiencia de lote padre antes de submit. | **VIGENTE / DESEABLE (POKA-YOKE)** | Opera como guarda preventiva UI. No distorsiona cálculos si valida antes de persistir. |

---

## 2. Impacto de los Cambios del Bloque 6B y 8A

- **Eliminación exitosa en ventas:** `useSaleForm.js` ya no intenta forzar o imponer su saldo al backend en el guardado final; el backend reasigna la cabecera e inyecta la verdad calculada (`HAL-F5-03`).
- **Persistencia de Desfase de Redondeo en Preview:**  
  Tanto `useSaleForm.js` como `purchaseCalculations.js` utilizan `Math.round(...)` truncando decimales en cada fila en vez de acumular flotantes/decimales y redondear al final (principio `HAL-F6-03`).

---

## 3. Matriz de Divergencias Críticas Frontend ↔ Backend

1. **Fallback Falso en Costeo de Recetas (`unitCostWip = 4390`):**
   - **Frontend:** Si el semielaborado no tiene costo, asume $4,390 COP/L silenciosamente.
   - **Backend:** Lanza `BadRequestException` impidiendo transacciones con costos <= 0 (`HAL-F4-02`).
   - **Riesgo:** El operario formula una receta viendo un costo proyectado que la API rechazará al guardar.
2. **Normalización Heurística de Gramos/Mililitros (`1000 : 1`):**
   - **Frontend:** Asume factor 1000 fijo si la unidad es 'g' o 'ml' sin considerar si el costo base ya venía expresado por gramo/mililitro.
   - **Backend:** Gobernado por `unit-registry.js` canónico y validación estricta de `costoUnidadBase`.
3. **Redondeo por Fila vs Redondeo de Cierre:**
   - **Frontend:** Redondea cada ítem a entero en UI.
   - **Backend:** Aplica precisión `Decimal(14,4)` en costos y `Decimal(12,2)` al final del cálculo.

---

## 4. Conclusiones y Recomendaciones de la Fase F2

1. **Erradicar el fallback `$4,390` en `recipeHelpers.js`:** Debe reemplazarse por una alerta preventiva Poka-Yoke ("Insumo WIP sin costo configurado — configure la receta base o el inventario").
2. **Sincronizar `purchaseCalculations.js` y `useSaleForm.js`:** Importar o emular la política de redondeo final (`toDecimal` / suma cruda) para eliminar discrepancias de $\pm 1$ COP en cotizaciones.
