TAREA:
Actualizar el vocabulario de las plantillas predefinidas de etapas en el módulo de recetas (`RecipeStagesList.jsx` y constantes asociadas) para reemplazar términos confusos como "Tanque" y "Envasado" por lenguaje operativo intuitivo.

OBJETIVO:
1. En `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx` (y archivos de plantillas/helpers):
   - Renombrar las etiquetas y tooltips de los botones de plantilla:
     * De `🥛 Tanque` a **`🥛 Base Láctea (WIP)`** (Tooltip: "Ruta de fermentación y cultivo en tanque refrigerado").
     * De `🍓 Envasado` a **`📦 Empaque Comercial`** (Tooltip: "Asistente guiado para dosificación, jalea y sellado en envases").
     * De `🍯 Jalea Fruta` a **`🍓 Cocción de Fruta / Jalea`** (Tooltip: "Ruta estándar para preparación de fruta y jaleas en marmita").
   - Ajustar los títulos generados por omisión de las etapas si aún mencionaban "(Tanque)" por nombres funcionales claros (ej. "Recepción y Verificación de Yogurt Base").

2. Restricciones Técnicas:
   - Respetar SRP (< 135 líneas por archivo en frontend).
   - CSS Modules puro (cero inline styles `style={{}}`).
   - `node .agents/scripts/verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botones de plantilla con vocabulario intuitivo y claro para el operario de planta.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Nuevos nombres de plantillas aplicados:
- Resultado de verify-srp.js:
- Estado: