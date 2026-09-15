TAREA:
Implementar una vista inicial de selección de ruta operativa (Empty State con 3 Cards elegantes) cuando una receta no tiene etapas configuradas, ocultando el formulario complejo de etapa hasta que el usuario elija qué desea fabricar.

OBJETIVO:
1. En `apps/web/src/app/catalog/recipes/components/`:
   - Crear el componente `RecipeRouteSelectorEmptyState.jsx` y su módulo `recipe-route-selector.module.css`:
     * Encabezado centrado:
       - Título: "¿Qué proceso deseas formular en esta receta?"
       - Subtítulo explicativo: "Selecciona una plantilla de proceso estándar para cargar automáticamente las etapas técnicas de planta o comienza desde cero."
     * Contenedor con 3 Cards Interactivas alineadas horizontalmente (o grid 3 columnas centrado):
       1. **🥛 Base Láctea (WIP)**
          - Título: "Base Láctea en Tanque"
          - Descripción: "Proceso de recepción, inoculación, fermentación y cultivo refrigerado."
          - Acción: Aplica la plantilla de tanque.
       2. **📦 Empaque Comercial**
          - Título: "Envasado y Empaque Final"
          - Descripción: "Asistente para dosificación, jalea en fondo, endulzado, tapas y domo de cereal."
          - Acción: Despliega el `PackagingWizardModal`.
       3. **🍓 Cocción de Fruta / Jalea**
          - Título: "Preparación de Fruta"
          - Descripción: "Pesaje, cocción en marmita, concentración y acondicionamiento térmico."
          - Acción: Aplica la plantilla de jaleas.
     * Enlace/botón inferior centrado:
       - `+ Configurar etapas manualmente desde cero` (agrega una primera etapa en blanco).

2. En `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o donde se renderiza el cuerpo de etapas):
   - Evaluar si `stages.length === 0`:
     * **Si es 0:** Renderizar exclusivamente `RecipeRouteSelectorEmptyState` (ocultando `RecipeStagesList`, el editor de etapa, temperaturas y BOM).
     * **Si es > 0:** Renderizar el layout actual de trabajo (timeline lateral + editor de etapa activa + botones de plantilla superiores como accesos rápidos).

3. Restricciones Técnicas:
   - Respetar el límite estricto de SRP (< 135 líneas por archivo).
   - CSS Modules puro (cero estilos inline `style={{}}`).
   - Mantener reactividad y sincronización con `useRecipeForm`.
   - Salida en `node .agents/scripts/verify-srp.js` retornando código 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeRouteSelectorEmptyState.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/recipe-route-selector.module.css`

MODIFICAR:
- Contenedor de formulario de receta (`RecipeModal.jsx` o componente padre de etapas).

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeRouteSelectorEmptyState.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir una receta nueva sin etapas se observan las 3 cards centradas con descripción clara.
- Al pulsar una card se inicializan las etapas y aparece el editor completo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Lógica de alternancia condicional aplicada:
- Resultado de verify-srp.js:
- Estado: