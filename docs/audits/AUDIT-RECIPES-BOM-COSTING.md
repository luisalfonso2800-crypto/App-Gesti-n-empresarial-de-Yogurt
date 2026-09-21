# REPORTE DE AUDITORÍA: RECETAS, BOM Y COSTEO DE PRODUCCIÓN

> **Fecha:** 2026-09-21
> **ID Auditoría:** AUDIT-RECIPES-BOM-COSTING
> **Ámbito:** Módulo de Recetas (`/catalog/recipes`), Estructura Técnica BOM (Bill of Materials), Factores de Conversión de Ingredientes, Formulación Multinivel (WIP/Semielaborados) e Integración con el Costeo de Producción.

---

## 1. RESUMEN EJECUTIVO Y DIAGNÓSTICO

| Componente Auditado | Ubicación / Archivo | Estado | Evaluación y Diagnóstico Técnico |
| :--- | :--- | :--- | :--- |
| **Modelos de Datos BOM** | `schema.prisma` (`Receta`, `EtapaReceta`, `DetalleReceta`, `Producto`, `Insumo`) | **EXCELENTE** | Soporta formulación multinivel nativa mediante campos mutuamente excluyentes: `idInsumo` (insumo externo comprado) y `idProductoIntermedio` (WIP/semielaborado). Cuenta con `mermaPorcentaje`, tiempos estándar y rangos de temperatura por etapa. |
| **Validación Backend (Poka-Yoke)** | `recipes.service.js` (`validateRecipeIntegrity`) | **EXCELENTE** | Impone guardas estrictas: exclusividad `idInsumo` vs `idProductoIntermedio`, validación de empaque primario obligatorio para productos comerciales y compatibilidad dimensional de unidades. |
| **Costeo Recursivo (Cost Roll-Up)** | `recipeHelpers.js` (`calculateRecipeCosts`) | **ROBUSTO Y MULTINIVEL** | Realiza explosión recursiva: calcula el costo unitario de las recetas base intermedias y lo transfiere a la receta terminada ponderando factores de conversión (`g -> kg`, `ml -> lt`) y el porcentaje de merma (`mermaPorcentaje`). Incluye fallback con costo de inventario. |
| **Arquitectura Frontend (SRP)** | `apps/web/src/app/catalog/recipes/` | **CONFORME** | `page.jsx` en 114 líneas (< 120). Modales y editores desacoplados en subcomponentes (`RecipeStageEditor`, `RecipeStageBomTable`, `RecipeOperationalSummaryModal`, `PackagingWizardModal`). |

---

## 2. AUDITORÍA TÉCNICA DETALLADA

### 2.1 Formulación Multinivel (WIP / Semielaborados vs. Insumos Base)
* **Modelado en Base de Datos ([schema.prisma](file:///apps/api/prisma/schema.prisma#L252-L272)):**
  ```prisma
  model DetalleReceta {
    id                   String       @id @default(uuid()) @map("ID_Detalle_Receta")
    idEtapaReceta        String       @map("ID_Etapa_Receta")
    idInsumo             String?      @map("ID_Insumo")
    insumo               Insumo?      @relation(fields: [idInsumo], references: [id])
    idProductoIntermedio String?      @map("ID_Producto_Intermedio")
    productoIntermedio   Producto?    @relation("ProductoConsumidoReceta", fields: [idProductoIntermedio], references: [id])
    cantidadRequerida    Decimal      @map("Cantidad_Requerida")
    unidad               String       @map("Unidad")
    mermaPorcentaje      Decimal      @map("Merma_Porcentaje")
    tipoInsumo           String       @default("BASE") @map("Tipo_Insumo")
    ...
  }
  ```
* **Aislamiento y Regla de Exclusividad en Backend:**
  - En `RecipesService.validateRecipeIntegrity`:
    ```js
    const hasInsumo = Boolean(det.idInsumo);
    const hasWip = Boolean(det.idProductoIntermedio);
    if ((hasInsumo && hasWip) || (!hasInsumo && !hasWip)) {
      throw new BadRequestException(
        'Cada detalle de receta debe especificar un insumo comprado o un producto intermedio de planta, no ambos'
      );
    }
    ```
  - Permite que productos semielaborados como **Base Láctea Blanca** o **Dulce/Jalea a Granel** cuenten con su propia receta base (rendimiento en Litros o Kg), y luego sean consumidos como un ingrediente en la receta del producto final comercial (yogurt saborizado en envase de 1000 ml).

---

### 2.2 Factores de Conversión de Unidades
* **Compatibilidad Dimensional:**
  - El backend implementa `extractCanonicalUnit` y `areUnitsCompatible` normalizando familias:
    - **Volumen:** `LITROS` (L, Lt, Lts) $\leftrightarrow$ `MILILITROS` (ml).
    - **Masa:** `KILOGRAMOS` (Kg, Kgs) $\leftrightarrow$ `GRAMOS` (g, gr).
    - **Conteo Discreto:** `UNIDADES` (und, pza).
* **Conversión en Costeo:**
  - En `calculateRecipeCosts` ([recipeHelpers.js](file:///apps/web/src/app/catalog/recipes/components/recipeHelpers.js#L530-L545)):
    - Si el insumo está cotizado en Kg o Lt y la receta dosifica en `g` o `ml`, se aplica automáticamente el factor $1/1000 = 0.001$.
    - Para empaques unitarios (`und`), el factor se mantiene en $1.0$.

---

### 2.3 Cálculo de Costo Teórico y Mermas
* **Fórmula de Explosión de Costos (Cost Roll-up):**
  $$\text{Cantidad Bruta} = \text{Cantidad Requerida} \times \left(1 + \frac{\text{mermaPorcentaje}}{100}\right)$$
  $$\text{Costo Total} = \sum (\text{Cantidad Bruta} \times \text{Factor Unidad} \times \text{Costo Unitario})$$
  $$\text{Costo Unitario Proyectado} = \frac{\text{Costo Total}}{\text{Rendimiento Base}}$$
* **Desglose en 2 Niveles:**
  1. **Insumos Directos (`costRawSupplies`):** Evalúa el precio más reciente de compra desde `PrecioProveedor` o el `costoBase` del catálogo de insumos.
  2. **Bases Semielaboradas (`costWipBases`):** Resuelve recursivamente `calculateRecipeCosts(baseRecipe)` para obtener `costPerUnit` de la receta del semielaborado. Si la receta base aún no está formulada, recurre defensivamente a `costoPromedio` del inventario o al costo de referencia estándar ($4.390 COP/Litro para base láctea).

---

### 2.4 Poka-Yoke de Planta Láctea
* **Empaque Primario Obligatorio:**
  - Para productos finales comerciales (no clasificados como granel/WIP), `validateRecipeIntegrity` exige al menos un insumo categorizado como `EMPAQUE_BASE` o perteneciente a la categoría `EMPAQUES` / `ENVASES` / `BOTELLAS`.
* **Límite Físico del Envase:**
  - La función `getPackagingPhysicalLimit` valida que la suma de volumen de líquidos dosificados en la receta no exceda la capacidad geométrica del contenedor comercial (evitando formulaciones físicamente inviables).

---

### 2.5 Cumplimiento Arquitectural Frontend (SRP)
* `catalog/recipes/page.jsx`: **114 líneas** ✅ (< 120 líneas).
* `RecipeModal.jsx`: **148 líneas** ✅ (< 150 líneas).
* Desglose modular de componentes:
  - `RecipeStageEditor.jsx`: 80 líneas.
  - `RecipeStageBomTable.jsx`: 126 líneas.
  - `RecipeStagesTimeline.jsx`: 121 líneas.
  - `RecipeOperationalSummaryModal.jsx`: 147 líneas.
  - `PackagingWizardModal.jsx`: 122 líneas.
* **Deuda Técnica Acotada:**
  - `recipeHelpers.js` (702 líneas) y `useRecipeForm.js` (454 líneas) concentran la lógica analítica y los asistentes de formulación asistida. Funcionan de forma estable y no violan SRP en vistas visuales, pero son candidatos ideales para partición en submódulos de utilidades (`recipeCosting.js`, `recipeNarrative.js`, `recipeValidations.js`).

---

## 3. CONCLUSIÓN

El módulo de Recetas y BOM cumple con los más altos estándares de ingeniería de manufactura láctea:
1. Permite encadenamiento multinivel entre subprocesos (bases/WIP) y empaque final.
2. Contempla mermas porcentuales por etapa y normalización de unidades de dosificación.
3. El backend bloquea inconsistencias dimensionales y recetas comerciales sin empaque.
