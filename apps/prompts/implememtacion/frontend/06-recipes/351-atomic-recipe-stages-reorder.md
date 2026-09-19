TAREA (PRESUPUESTO CERO EXPLORACIÓN: MÁXIMO 3 TOOL CALLS):
Implementar los controles ergonómicos de reordenar etapa [▲] y [▼] directamente en la tarjeta de la columna lateral izquierda (`RecipeTimelineCard.jsx` o `RecipeStagesTimeline.jsx`), con protección Poka-Yoke de límites (deshabilitados en extremos) y renumeración en tiempo real.

REGLAS ESTRICTAS ANTI-QUOTA:
- PROHIBIDO usar `Search` o `Find`.
- PROHIBIDO leer más de 1 vez cada archivo.
- Modificar ÚNICAMENTE los 2 archivos indicados a continuación.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx` (o `RecipeTimelineCard.jsx`)
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageActionBar.jsx` (remover botones viejos del pie)

INSTRUCCIÓN TÉCNICA:
1. En la tarjeta de cada etapa en la lista lateral:
   - Añadir botones compactos [▲] y [▼] junto al número de etapa.
   - Poka-Yoke:
     * Si `index === 0`: botón [▲] `disabled` (opacidad 30%, cursor not-allowed).
     * Si `index === stages.length - 1`: botón [▼] `disabled`.
   - Al pulsar [▲] o [▼]: ejecutar la permutación inmutable del array y actualizar el índice activo para no perder el foco.
2. En `RecipeStageActionBar.jsx`:
   - Eliminar los botones redundantes "Subir" y "Bajar" del pie de página derecho.
3. Respetar SRP (< 135 líneas por archivo).

VERIFICACIÓN:
`node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx`
`node .agents/scripts/verify-srp.js`

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE de inmediato.