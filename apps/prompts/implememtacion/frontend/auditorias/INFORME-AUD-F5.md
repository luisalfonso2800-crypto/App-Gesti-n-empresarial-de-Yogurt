# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F5: UNIDADES DE MEDIDA EN FRONTEND

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Verificación de alineación con el registro canónico de unidades `unitNormalizer.js` vs `unit-registry.js` del backend.  
> **Estado:** ✅ FASE F5 COMPLETADA

---

## 1. Estado de Sincronización de `unitNormalizer.js`

El archivo `apps/web/src/utils/unitNormalizer.js` fue sincronizado en el Bloque 6B:
- Define magnitudes canónicas: `MASA`, `VOLUMEN`, `CONTEO`.
- Soporta unidades extendidas: `mg` (miligramos), `oz` (onzas fluidas = $29.5735\text{ ml}$ alineado con backend), `paq` (paquetes).
- Factor canónico de conversión en `getUnitConversionFactor` con salvaguarda dimensional (evita convertir masa a volumen sin densidad).

---

## 2. Inventario de Usos de Unidades en Componentes UI

| Módulo / Archivo Frontend | Implementación de Unidades | Estado frente a `unitNormalizer` | Riesgo de Divergencia |
| :--- | :--- | :---: | :--- |
| **`RecipeHeaderFields.jsx`** | Importa `UNIT_OPTIONS` y `toCanonicalUnit` desde `@/utils/unitNormalizer`. | ✅ **CANÓNICO** | Cero divergencia. Usa catálogo controlado. |
| **`useRecipeForm.js`** | Importa `toCanonicalUnit`. Normaliza unidades de etapas y detalles. | ✅ **CANÓNICO** | Cero divergencia. |
| **`IngredientsFormSection.jsx`**| Importa `toCanonicalUnit`. | ✅ **CANÓNICO** | Cero divergencia. |
| **`recipeHelpers.js`** | Importa `getUnitConversionFactor`. | ⚠️ **PARCIALMENTE CANÓNICO** | Usa `getUnitConversionFactor`, pero en L584 mantiene chequeo ad-hoc: `['g', 'ml'].includes(insumoRecord?.unidadBase) ? 1000 : 1`. |
| **`RecipeStageBomTable.jsx`** | L99: `step={String(det.unidad).toLowerCase().includes('und') ? '1' : '0.1'}`. | ⚠️ **USO AD-HOC** | No consulta `CANONICAL_UNITS.UNIT` ni `unitNormalizer`. Aunque funciona para `und`/`unidades`, ignora sinónimos como `pza`, `vaso`, `tapa`. |
| **`ProductionOrderCompleteModal.jsx`** | L28: `placeholderVolumen = uMed.toLowerCase().includes('und') ? 'Ej: 6' : '0.0'`. | ⚠️ **USO AD-HOC** | Lógica de presentación ad-hoc sin normalización formal. |
| **`useFormPhaseData.js` (Compras)** | L152: `supply?.unidadBase \|\| supply?.unidadMedida \|\| 'kg'`. | ⚠️ **HARDCODING FALLBACK** | Si no viene unidad, fuerza `'kg'` arbitrariamente sin importar si el insumo es una etiqueta o botella (`und`). |

---

## 3. Puntos Críticos y Usos Ad-Hoc Identificados

1. **Fallback `'kg'` Hardcodeado en Compras (`useFormPhaseData.js`):**
   - Al agregar insumos a una orden de compra sin configuración previa, inyecta `unidadMedida: 'kg'`. Si se agrega una tapa o un envase, el operario debe recordar cambiar manualmente de `kg` a `und` para evitar desastres en Kardex.
2. **Detección de Unidades Discretas Incompleta en BOM:**
   - En `RecipeStageBomTable.jsx`, solo evalúa si el string contiene `'und'` o `'unidades'`. En el backend, `UNIDADES_DISCRETAS` incluye: `['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'PIEZA', 'VASO', 'BOTELLA', 'TAPA', 'ETIQUETA']`. Los empaques con unidad `'tapa'` o `'botella'` permiten ingresar decimales en el step (`step="0.1"`), induciendo a error al operador.
3. **Manejo de Densidad Ausente en Conversión Frontend:**
   - En `recipeHelpers.js`, si una receta formula en gramos un insumo líquido (ej. leche condensada o pulpa), no aplica la densidad específica del insumo (`HAL-F2-03`), asumiendo erróneamente densidad $1.0$.

---

## 4. Conclusiones y Recomendaciones de la Fase F5

1. **Centralizar la comprobación de unidad discreta:** Exportar `isDiscreteUnit(unit)` desde `unitNormalizer.js` incorporando todas las variantes de empaque (`tapa`, `etiqueta`, `vaso`, `botella`) y consumirla en `RecipeStageBomTable.jsx` y `ProductionOrderCompleteModal.jsx`.
2. **Eliminar fallback `'kg'` ciego en Compras:** Asignar la unidad real del insumo `supply.unidadBase` y, de no existir, dejar el campo vacío con obligatoriedad de selección (`Poka-Yoke`).
