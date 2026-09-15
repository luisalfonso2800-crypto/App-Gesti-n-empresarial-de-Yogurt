TAREA:
Incorporar la plantilla predefinida de 6 etapas para "Elaboración de Jalea / Dulce de Fruta" en el catálogo de recetas técnicas (`recipeHelpers.js` y componentes de etapas).

OBJETIVO:
1. En `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js` (o donde residan las plantillas predefinidas de etapas):
   - Definir la constante/plantilla `PLANTILLA_JALEA_FRUTA` con las 6 etapas industriales estandarizadas:
     * **Etapa 1:** Recepción y selección de fruta (15 min | Tol: 10–25 min | 8–25 °C | 1.000 g fruta).
     * **Etapa 2:** Lavado y preparación de fruta (15 min | Tol: 10–25 min | 10–25 °C | 1.000 g fruta preparada).
     * **Etapa 3:** Trituración y preparación de la mezcla (10 min | Tol: 5–15 min | 10–30 °C | 1.000 g fruta + 300 g Azúcar).
     * **Etapa 4:** Cocción de la jalea (20 min | Tol: 15–30 min | 85–95 °C | Mezcla Etapa 3 + 50 ml Agua).
     * **Etapa 5:** Ajuste y estandarización de la jalea (10 min | Tol: 5–15 min | 80–90 °C | 3 g Ácido Cítrico).
     * **Etapa 6:** Envasado / Conservación de jalea (15 min | Tol: 10–25 min | Procedimiento sanitario).
2. En `RecipeStagesList.jsx` / `RecipeStagesTimeline.jsx`:
   - Añadir el botón rápido de plantilla: `[ 🍓 Cargar Plantilla: Jalea de Fruta ]`.
   - Al presionarlo, cargar en bloque las 6 etapas con sus textos técnicos, parámetros y placeholders de insumos listos para vincular.
3. Respetar estrictamente el umbral preventivo (< 135 líneas por archivo) y CSS Modules puro. Cero estilos inline (`style={{}}`).
4. Ejecutar el guardián de calidad y verificar código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar exclusivamente archivos en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css` (si aplica para el botón)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Declarar la estructura completa de las 6 etapas en las utilidades de recetas.
2. Exponer la acción de inyección en la cabecera/timeline de etapas.
3. Verificar conteo de líneas con el Circuit Breaker.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Plantilla de Jalea de Fruta disponible para cargar en 1 clic.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Plantilla registrada:
- Resultado de verify-srp.js:
- Estado: