TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Integrar un botón/icono compacto de eliminación [🗑] directamente en cada tarjeta de etapa de la barra lateral izquierda (`RecipeTimelineCard.jsx` o `RecipeStagesTimeline.jsx`), con protección Poka-Yoke (deshabilitado si solo hay 1 etapa o confirmación en dos toques si tiene insumos), y eliminar la necesidad de scroll.

CLÁUSULA ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO usar `Search`, `Find`, `Grep` o comandos de exploración.
- LECTURA ÚNICA: Lee cada archivo exactamente 1 vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeTimelineCard.jsx` (o donde se renderiza la tarjeta lateral)
2. `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

OBJETIVO TÉCNICO:

1. En `RecipeTimelineCard.jsx`:
   - Al lado del grupo de botones [▲] y [▼], agregar un botón compacto de eliminación con icono de papelera o [✕].
   - Pasar/conectar el manejador `onDeleteEtapa(idx)` con `e.stopPropagation()` para que al borrar no se active el foco de la etapa.
   - Regla Poka-Yoke de límites:
     * Si `totalStages <= 1`: botón `disabled` (`opacity: 0.3; cursor: not-allowed; title="La receta debe tener al menos una etapa"`).
   - Reacción inmediata: Al presionar, elimina la etapa del array y actualiza el índice activo de forma segura para no desbordar.
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `recipe-stages.module.css`:
   - Diseñar la clase `.stageDeleteCardBtn`:
     * Tamaño idéntico a los botones `▲` / `▼` (aprox. 24x24px).
     * Color neutro gris `#9CA3AF`, con hover en fondo rojo tenue `#FEE2E2` y texto/icono rojo `#EF4444`.
     * Transición suave (`transition: background 0.15s, color 0.15s`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeTimelineCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Cada tarjeta lateral muestra su propio botón de eliminación junto a las flechas de orden.
- El operario puede depurar etapas incompletas en un solo clic sin cambiar de panel ni hacer scroll.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.