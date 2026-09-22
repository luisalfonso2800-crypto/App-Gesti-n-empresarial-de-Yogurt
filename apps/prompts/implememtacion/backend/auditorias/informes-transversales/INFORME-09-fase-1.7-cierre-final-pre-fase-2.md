# INFORME-09: FASE 1.7 — CIERRE FINAL PRE-FASE 2

> **Documento:** Auditoría de Frontera y Precondiciones para Fase 2  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/TASK-02.3-FASE-1.7-CIERRE-FINAL-PRE-FASE-2.md`  
> **Estado:** Fase 1.7 completada con éxito. **Habilitada formalmente la Fase 2**.

---

## 1. Matriz de Coherencia de Unidades en Insumos Críticos (T1)

Evaluando los insumos registrados en planta (`seed-test-data.js`) contra el escalado en compras (`HAL-F1-04`) y la división de costo en inventario (`HAL-F1-03`):

| Insumo | Unidad Base | ¿Escala en Compra? (`HAL-F1-04`) | ¿Se divide en Inventario? (`HAL-F1-03`) | Riesgo Neto de Planta |
| :--- | :--- | :--- | :--- | :--- |
| **Leche Entera** | `Litros` | ❌ **NO** (espera `'Lt'`/`'Lts'`, `Litros` no coincide) | ❌ No (`isSmallUnit = false`) | **DESABASTECIMIENTO FANTASMA**: Entra 1 L en lugar de 1000 ml si la fórmula opera en ml. |
| **Cultivo Láctico** | `Gramos` | ❌ No aplica (escala 1x) | ⚠️ **SÍ** si costo > $100 COP/g ($100 COP/g queda en $0.10) | **SUBVALUACIÓN CONTABLE**: Pérdida del 99.9% de valor en balance de inventario. |
| **Azúcar Blanco** | `Kilogramos` | ❌ **NO** (espera `'Kg'`/`'Kgs'`, `Kilogramos` no coincide) | ❌ No (`isSmallUnit = false`) | **DISCORDANCIA x1000**: Si compra 50 Kg ingresan 50 unidades al stock en vez de 50,000 g. |
| **Estabilizante** | `Gramos` | ❌ No aplica (escala 1x) | ⚠️ **SÍ** si costo unitario > $100 COP | **SUBVALUACIÓN PATRIMONIAL CRÍTICA**. |
| **Vaso 3.5 oz / Cúpula**| `Unidades` | ❌ No aplica (escala 1x) | ❌ No | **OK en Inventario**, pero distorsión si se computa volumen en recetas. |

---

## 2. Auditoría de Frontera Frontend ↔ Backend para la Unidad `oz` (T2)

1. **En el Frontend (`apps/web`):**
   - En `UNIT_OPTIONS` (`apps/web/src/utils/unitNormalizer.js`), las únicas opciones seleccionables en cabecera son: `g`, `kg`, `ml`, `l`, `und`.
   - **`oz` NO existe en el selector**.
   - En el BOM de recetas (`IngredientsFormSection.jsx`), la celda muestra `<span className={styles.bomUnitBadge}>{toCanonicalUnit(det.unidad)}</span>`. Si `det.unidad` llega como `'oz'`, `toCanonicalUnit` devuelve `'oz'` sin convertir.
2. **En el Backend (`apps/api`):**
   - En `recipes.service.js` (L35), `extractCanonicalUnit` mapea `ONZA|ONZAS|OZ` $\to$ `'ONZAS'`.
   - Si el insumo en catálogo tiene `unidadBase: 'ml'` y en la receta se envía `unidad: 'oz'`:
     - `extractCanonicalUnit('oz')` da `'ONZAS'`.
     - `extractCanonicalUnit('ml')` da `'MILILITROS'`.
     - `areUnitsCompatible('oz', 'ml')` retorna **`FALSE`**.
   - **Resultado:** El backend **RECHAZA** la receta con `BadRequestException: Inconcordancia de unidades dimensionales...`, imposibilitando guardar fórmulas que contengan onzas frente a bases en mililitros, a pesar de que `UnitConverter` sí cuenta con el factor volumétrico ($29.5735$).

---

## 3. Precondiciones Mandatorias para la Fase 2 (T3)

Para auditar la **Fase 2 (Compatibilidad Dimensional)**, se fijan las siguientes directivas técnicas:
1. **Aislamiento Dimensional Estricto:** MASA ($\text{g}, \text{kg}, \text{mg}$) y VOLUMEN ($\text{ml}, \text{l}, \text{oz}$) son magnitudes físicas distintas. Toda equivalencia directa sin densidad documentada debe ser tipificada como infracción grave.
2. **Auditoría de Densidad Implícita:** Rastrear si en formulación de yogurt, leche cruda o bases lácteas el sistema asume ciegamente $\text{1 litro} = \text{1 kg}$ ($d = 1.0\text{ g/ml}$ cuando la leche oscila en $1.028 - 1.034\text{ g/ml}$).
3. **Erradicación de Heurísticas de Texto:** Reemplazar comparaciones `['Lt','Lts'].includes(...)` por un Enum/Value Object canónico de unidades.

---

## 4. Conteo Final Consolidado de la Fase 1
- **CRÍTICO:** 3 (`HAL-F1-01`, `HAL-F1-03`, `HAL-F1-04`)
- **ALTO:** 0
- **MEDIO:** 1 (`HAL-F1-02`)
- **BAJO:** 0  
**Total Hallazgos Fase 1:** **4**

---

### Veredicto Formal:
**FASE 1 COMPLETAMENTE CERRADA Y CONSOLIDADA. AUTORIZADO EL INICIO DE LA FASE 2.**
