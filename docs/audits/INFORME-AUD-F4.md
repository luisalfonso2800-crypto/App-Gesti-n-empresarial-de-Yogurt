# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F4: VALIDACIONES PREVENTIVAS (POKA-YOKE)

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Análisis de robustez preventiva y guardas Poka-Yoke antes de invocar los endpoints remediados del backend.  
> **Estado:** ✅ FASE F4 COMPLETADA

---

## 1. Inventario de Validaciones Preventivas Existentes vs Nuevas Reglas

| Formulario / Modal | Validación Existente en Frontend | Nueva Regla Backend (Remediación) | Brecha Preventiva (Faltante) |
| :--- | :--- | :--- | :--- |
| **`RecipeModal.jsx` / `RecipeStageBomTable.jsx`** | - `isButtonReady`: exige `idProducto` y `rendimientoBase > 0`.<br>- Valida límite de capacidad geométrica del contenedor (`isOverCapacity`).<br>- Empaque obligatorio en productos comerciales. | `HAL-F8-02`: merma estrictamente en `[0, 100)`. `merma >= 100` lanza `BadRequestException`. | ⚠️ `RecipeStageBomTable.jsx` L109 define `max="100"`. Permite ingresar `100%`, lo cual detona una excepción `BadRequestException` en el backend. Debe limitarse a `max="99.9"` o validar `< 100`. |
| **`ProductionCreateForm.jsx`** | - Valida fechas (`vencimiento > produccion`).<br>- Verifica suficiencia de stock en lote padre WIP seleccionado.<br>- Bloquea botón si hay faltantes (`hasShortage`). | `HAL-F4-03`: `rendimientoBase > 0` en receta al calcular BOM.<br>`HAL-F4-02`: Costo WIP debe ser `> 0` y `<= 50000`. | ⚠️ El formulario no valida preventivamente si la receta seleccionada tiene rendimiento 0 o si el lote WIP padre tiene costo 0 antes de solicitar la orden. |
| **`useSaleForm.js`** | - Bloquea submit si no hay cliente o si la lista de detalles está vacía.<br>- Valida que `valorPagado >= 0`. | `HAL-F10-01` / `HAL-F10-02`: Validación server-side de descuentos y precios unitarios coherentes. | ✅ Conforme en UX básica; el backend ahora recalcula de forma hermética. Falta validar en tiempo real si el descuento supera el subtotal de la línea. |
| **`PresentationModal.jsx`** | - Exige nombre y unidad de medida. | `HAL-F3-03`: En envases a granel (`BALDE`, `TANQUE_GRANEL`), `cantidadMl` es estrictamente obligatoria. | ❌ **FALTANTE CRÍTICO:** El formulario de presentaciones permite guardar un tipo granel sin especificar volumen, lo que resulta en un error 400 del backend. |
| **`useFormPhaseData.js` (Compras)** | - Autocompleta precios y factores de empaque.<br>- Exige proveedor e insumos válidos. | Esquema Zod estricto de compras y consistencia dimensional. | ⚠️ Permite valores negativos si el usuario escribe signos menos manualmente en el campo `empaques`. |

---

## 2. Puntos Críticos de Fuga Poka-Yoke Identificados

### 1. Inconsistencia de Merma en Recetas (`max="100"`):
- En `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx` línea 109:
  ```jsx
  <input ... min="0" max="100" value={det.mermaPorcentaje} ... />
  ```
- **Problema:** En el backend, `HAL-F8-02` impone: `if (merma < 0 || merma >= 100) throw BadRequestException`.
- **Riesgo:** Un operario puede tipear `100%` legítimamente en UI creyendo que es válido, pero el guardado reventará con error 400.

### 2. Guardado de Presentaciones a Granel sin Volumen:
- En `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`:
- **Problema:** No hay guarda condicional que marque como requerido el campo `cantidadMl` cuando el select de tipo de envase es `BALDE` o `TANQUE_GRANEL`.
- **Riesgo:** Choca directamente con la excepción `BadRequestException` de `presentations.service.js:35`.

### 3. Recetas con Semielaborados en Cero Costo:
- Si el usuario añade una Base Láctea que no tiene costo en inventario ni receta técnica con rendimiento, `recipeHelpers.js` le muestra un costo artificial ($4,390), ocultando que al crear la orden de producción el backend rechazará la operación con:
  `"Costo unitario inválido ($0) para el producto intermedio... Configure un costo válido en el lote o inventario"` (`HAL-F4-02`).

---

## 3. Conclusiones y Recomendaciones de la Fase F4

1. **Ajustar el control de merma en `RecipeStageBomTable.jsx`:** Cambiar a `max="99.9"` y añadir aviso visual si el valor ingresado es $\ge 100$.
2. **Blindar `PresentationModal.jsx`:** Hacer que el campo `cantidadMl` sea visualmente obligatorio con asterisco y validación `> 0` cuando el tipo de envase sea granel (`BALDE` / `TANQUE_GRANEL`).
3. **Indicador visual de costo WIP inválido en el editor de recetas:** Si un producto intermedio tiene costo unitario $0$, mostrar badge rojo: `⚠️ Insumo WIP sin costo — Requerido para costeo real`.
