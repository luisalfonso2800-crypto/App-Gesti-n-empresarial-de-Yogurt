TAREA:
1. Actualizar AGENTS.md con la regla estricta de Responsabilidad Única para Modales (< 150 líneas) y veto absoluto a estilos en línea (`style={{}}`).
2. Descomponer el modal monolítico `RecipeModal.jsx` extrayendo estilos a `recipe-modal.module.css` y dividiendo su JSX en subcomponentes atómicos co-locados.

OBJETIVO:
Detener el gasto excesivo de cuota/tokens erradicando archivos gigantes y estilos en línea:
1. Registrar en `AGENTS.md` que la Regla 6 (SRP y límite de líneas) y la Regla 8 (CSS Modules exclusivo) aplican con igual rigor a los modales (`*Modal.jsx`). Queda estrictamente PROHIBIDO el uso de `style={{ ... }}` en el JSX.
2. Refactorizar `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`:
   - Migrar el 100% de los estilos inline hacia `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`.
   - Extraer las sub-secciones a componentes independientes dentro de `components/modal-parts/` (Cabecera, Acordeón de Etapas, Insignia de Reloj, Modal de Hoja de Ruta de Planta).
   - Dejar `RecipeModal.jsx` como orquestador limpio de menos de 120 líneas.

FUENTES DE VERDAD:
- `AGENTS.md` (Reglas 6, 7, 8, 35, 36)
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css`

REGLA DE CONSULTA:
Lee únicamente `AGENTS.md` y `RecipeModal.jsx`. Prohibido explorar backend (`apps/api/`) o rutas ajenas a recetas.

ALCANCE:

LEER:
- `AGENTS.md`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

CREAR:
- `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx`

MODIFICAR:
- `AGENTS.md`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. ACTUALIZACIÓN NORMATIVA EN `AGENTS.md`:
   - En la sección de Frontend (Reglas 6 y 8), agregar:
     * **Regla 6.1: Modales Atómicos y Límite de Líneas (< 150 líneas):** Ningún archivo modal (`*Modal.jsx`) puede superar las 150 líneas de código. Todo modal que contenga múltiples secciones o formularios complejos debe fragmentarse obligatoriamente en subcomponentes declarativos alojados en una subcarpeta `modal-parts/` o en `components/`.
     * **Regla 8.1: Prohibición Estricta de Inline Styles (`style={{ ... }}`):** Queda terminantemente vetado incrustar objetos de estilo inline en el JSX. Todos los márgenes, colores, tipografías, bordes, flexbox y grids DEBEN residir exclusivamente en su correspondiente archivo `.module.css`.

2. CREACIÓN DE `recipe-modal.module.css`:
   - Centralizar todas las clases CSS del modal con la paleta oficial MANNÁ:
     * `.modalContainer`, `.headerBar`, `.title`, `.subtitle`, `.headerGrid`
     * `.inputGroup`, `.label`, `.input`, `.readOnlyBadge`
     * `.emptyStateBox`, `.templateBtn`, `.stageCard`, `.stageCollapsed`
     * `.clockBadge`, `.plantFeedbackBox`, `.summaryBanner`, `.costCard`
     * `.btnCancel`, `.btnSubmit`, `.btnDiscard`, `.actionButtonsRow`

3. DESCOMPOSICIÓN DE `RecipeModal.jsx`:
   - **`RecipeHeaderFields.jsx`:** Contiene la selección del producto, nombre automático, cantidad y unidad de medida bloqueada.
   - **`RecipeStagesList.jsx`:** Contiene el acordeón de etapas, empty state asistido, inputs de tiempos con su insignia reloj (`⏱️ HH:MM`), temperaturas, instrucciones y tabla BOM.
   - **`RecipeOperationalSummaryModal.jsx`:** Contiene el modal SmartModal de confirmación de 2 pasos ("Hoja de Ruta Operativa de Planta") con las 3 acciones finales (Guardar y Publicar, Seguir Editando, Descartar).
   - **`RecipeModal.jsx` (Orquestador Principal):**
     * Importa los hooks necesarios.
     * Ensambla `RecipeHeaderFields`, `RecipeStagesList` y `RecipeOperationalSummaryModal`.
     * CERO estilos en línea. Tamaño final menor a 120 líneas.

VERIFICACIÓN:
1. Inspeccionar que no queden estilos inline en los componentes creados:
   `git grep "style={{" apps/web/src/app/catalog/recipes/components/`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
3. `pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx`

CRITERIO DE FINALIZACIÓN:
- `AGENTS.md` incluye formalmente las reglas 6.1 y 8.1.
- No queda un solo `style={{ ... }}` en `RecipeModal.jsx` ni en sus submódulos.
- `RecipeModal.jsx` no supera las 120 líneas.
- La funcionalidad (acordeón, insignias reloj, guardado de 2 pasos) opera idéntica a la aprobada.
- Lint y verificación de sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Reglas añadidas a AGENTS.md:
- Archivos creados y líneas resultantes de RecipeModal.jsx:
- Verificación de ausencia de inline styles:
- Comprobación sintáctica:
- Estado: