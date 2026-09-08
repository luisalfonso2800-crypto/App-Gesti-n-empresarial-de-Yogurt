TAREA CONTROLADA — MODULARIZACIÓN DE CATALOG/RECIPES (FASE 2: CATÁLOGOS)

OBJETIVO TÉCNICO EXACTO
Descomponer `apps/web/src/app/catalog/recipes/page.jsx` (~450 líneas) aplicando el estándar de 3 capas y trazabilidad JSDoc estipulado en `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`.
Reducir el orquestador principal (`page.jsx`) a menos de 100-120 líneas sin alterar la lógica de cálculo de ingredientes, costos ni el CRUD de recetas existente.

ESTRUCTURA DE ARCHIVOS A GENERAR
Ubicación: `apps/web/src/app/catalog/recipes/`

1. hooks/ (Capa de Lógica y Estado)
   - `hooks/useRecipesData.js`: Carga de recetas, productos e insumos mediante `@/lib/api-client`. Manejo de estados asíncronos (`isLoading`, errores, recarga).
   - `hooks/useRecipeForm.js`: Estado y manejo del modal/formulario (cálculo de costos estimados, agregado/eliminación reactiva de ingredientes e insumos por lote, validaciones).

2. components/ (Capa de Presentación Atómica)
   - `components/RecipesHeader.jsx`: Título, buscador/filtros y botón de acción para nueva receta.
   - `components/RecipesList.jsx`: Tabla o tarjetas de visualización de recetas existentes con resumen de rendimiento y costo estimado.
   - `components/RecipeModal.jsx`: Modal principal para crear/editar recetas.
   - `components/IngredientsFormSection.jsx`: Sub-formulario dinámico para agregar insumos, cantidades y unidades a la receta.

3. Orquestador:
   - `page.jsx`: Importa `useRecipesData` y `useRecipeForm`, orquestando los componentes visuales (< 120 líneas).

REGLAS DE ARQUITECTURA (OPERATING MANUAL)
1. Exclusivamente JavaScript nativo puro (.jsx, .js). PROHIBIDO TypeScript.
2. Usar obligatoriamente alias canónicos `@/*` para imports (`@/lib/api-client`, `@/components/ui/icons`). Prohibidas rutas relativas profundas.
3. CSS Modules estricto: Reutilizar el archivo `.module.css` local sin renombrar clases.
4. Encabezado JSDoc obligatorio en cada archivo con: `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.
5. Comentarios línea a línea en funciones de negocio (especialmente cálculos de rendimiento y costos).
6. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o purgar `.next`. Validar sintaxis con `node --check`.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `node --check` sobre los hooks creados.
- Comprobar que no existan variables indefinidas ni desbalances de llaves.

FORMATO DE REPORTE
Entregar reporte técnico detallando:
- Archivos creados y sus líneas de código resultantes.
- Líneas finales en `page.jsx`.
- Estado de validación funcional y sintáctica.