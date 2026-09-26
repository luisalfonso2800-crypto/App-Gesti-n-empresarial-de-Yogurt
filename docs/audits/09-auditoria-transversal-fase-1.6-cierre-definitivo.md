# FASE 1.6 — CIERRE DEFINITIVO DE HALLAZGOS DE UNIDADES

> **Documento:** Cierre Definitivo de Hallazgos y Formalización de Vulnerabilidades  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/01-FASE-1.6-CIERRE-DEFINITIVO-DE-HALLAZGOS-DE-UNDs.md`  
> **Estado:** Fase 1.6 completada. FASE 2 NO INICIADA.

---

## 1. Tabla de Hallazgos Final (Fase 1 Consolidada)

| ID | Severidad | Módulo | Archivo | Línea | Campo | Problema | Fórmula actual | Comportamiento esperado | Ejemplo numérico | Impacto | Condición que lo dispara |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F1-01** | **CRÍTICO** | Utilidades / Frontend | `unit-converter.js` vs `unitNormalizer.js` | L56 / L13 | Inconsistencia de conversión `oz` | Frontend (`apps/web`) y script de migración consumen activamente `unitNormalizer.js`, mientras el Backend (`apps/api`) consume `UnitConverter`. `unitNormalizer` ignora `oz` devolviendo factor 1. | Frontend: `getUnitConversionFactor('oz', 'ml') => 1`<br>Backend: `UnitConverter.convert(1, 'oz', 'ml') => 29.5735` | Conversión canónica volumétrica uniforme (1 oz = 29.5735 ml) en ambas capas | 10 oz de jarabe formuladas en frontend = 10 ml; al procesar en backend = 295.73 ml. Error: 96.6%. | Desincronización crítica entre validaciones de pantalla y cálculos reales en base de datos. | Uso de `oz` en recetas o insumos desde el frontend. |
| **HAL-F1-02** | **MEDIO** | Producción | `production.repository.js` | L945 | `unidadLote` | Hardcoding de unidad en creación de lote en Kardex. | `esIntermedio ? 'Litros' : 'UNIDAD'` | Heredar la unidad física declarada en la presentación (`presentacion.unidadMedida`). | Producto Vaso 150 g queda en Lote como `UNIDAD`, perdiendo balance de masa en Kardex. | Ambigüedad entre unidades discretas y balance gravimétrico de planta. | Cierre de orden de manufactura (`complete()`). |
| **HAL-F1-03** | **CRÍTICO** | Inventario | `inventory.service.js` | L24-35 | `costoUnitario` / `unidad` | Heurística ad-hoc destructiva de costo unitario. El archivo importa `UnitConverter` (L3) pero jamás lo invoca. Divide arbitrariamente por 1000 si `costoUnitario > 100`. | `if (isSmallUnit && costoUnitario > 100) costoUnitario /= 1000;` | Conversión estricta basada en unidades dimensionales del catálogo, sin condicionales numéricos ciegos. | **Caso A (Estabilizante en Gramos)**: Costo real $120 COP/g. El sistema ve >100 y divide: queda en $0.12 COP/g (-99.9% error).<br>**Caso B (Azúcar en Kilogramos)**: Costo $3,000 COP/kg. Al no ser `isSmallUnit`, se mantiene intacto. | Subvaluación masiva del valor patrimonial de bodega en materias primas de alto valor unitario. | Consulta de inventario valorizado con insumos pequeños de costo unitario > $100 COP. |
| **HAL-F1-04** | **CRÍTICO** | Compras | `purchases.repository.js` | L173-174 | `incrementStock` / `cantidad` | Escalado condicional frágil por coincidencia exacta de texto (case-sensitive) sin normalizar. | `const isLtsOrKgs = ['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase);`<br>`incrementStock = isLtsOrKgs ? cantidadBaseTotal * 1000 : cantidadBaseTotal;` | Normalización canónica dimensional previa antes de aplicar factor multiplicador. | Compra de 5 unidades:<br>- Con `'Kg'`: $5 \times 1000 = 5000$<br>- Con `'kg'`: $5 \times 1 = 5$ (No escala)<br>- Con `'kilo'`: $5 \times 1 = 5$ (No escala)<br>- Con `'L'`: $5 \times 1 = 5$ (No escala, busca `'Lt'`) | El inventario de compras ingresa subdimensionado por un factor de 1000 según cómo se tipeó la unidad base. | Registro de compras donde la unidad base esté en minúsculas (`kg`, `l`) o variantes (`kilo`). |

---

## 2. Consumidores Reales de `unitNormalizer.js` (Verificación T3)
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
- `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/api/scripts/normalizeUnits.js`  
**Conclusión:** `unitNormalizer.js` está **activamente acoplado en el frontend de recetas**. **`HAL-F1-01` se mantiene ratificado en CRÍTICO**.

---

## 3. Cierre de `NO VERIFICADO` (T4)
1. **Unidad `oz` en Catálogo / Schema:**  
   En `schema.prisma`, `cantidadOz` solo existe como campo opcional numérico en `Presentaciones` (`Decimal?`). En `seed-test-data.js`, los empaques se crearon con `unidadBase: 'Unidades'` (ej. "Vaso 3.5 oz", "Cono 2 oz").  
   *Dictamen:* En el código y seeds no hay insumos con `unidadBase = 'oz'` de masa. Se marca como **`REQUIERE CONSULTA A BD DE PRODUCCIÓN`** para descartar insumos legacy creados por usuario.
2. **Heurística `costoUnitario > 100`:** Verificada plenamente en código fuente (`apps/api/src/inventory/inventory.service.js` L30).

---

## 4. Conteo por Severidad
- **CRÍTICO:** 3 (`HAL-F1-01`, `HAL-F1-03`, `HAL-F1-04`)
- **ALTO:** 0
- **MEDIO:** 1 (`HAL-F1-02`)
- **BAJO:** 0  
**Total Hallazgos Fase 1:** **4**
