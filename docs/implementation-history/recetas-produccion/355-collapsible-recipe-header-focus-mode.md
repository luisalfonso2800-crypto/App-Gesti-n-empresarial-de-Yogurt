TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Implementar el colapso/pliegue automático y manual de la cabecera de la receta (`RecipeHeaderFields.jsx`) al interactuar con las etapas, reduciéndola a una barra delgada de contexto con botón para re-desplegar, con el fin de maximizar el área vertical de trabajo.

CLÁUSULA ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO usar `Search`, `Find` o comandos de búsqueda en terminal.
- LECTURA ÚNICA: Queda prohibido leer un archivo más de una vez.
- Modificación directa y exclusiva en los archivos especificados.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`

OBJETIVO TÉCNICO:
1. En `RecipeHeaderFields.jsx`:
   - Incorporar un estado `isCollapsed` (por defecto `false`).
   - Escuchar foco/interacción del área de etapas o proveer toggle:
     * Si `isCollapsed === true`: Renderizar únicamente una barra sutil compacta (~40px) que muestre:
       - Miniatura redonda del producto (28x28px).
       - Texto técnico: `${formData.nombre || 'Receta'} • ${formData.cantidadBase || 0} ${formData.unidadMedida || 'L'}`.
       - Botón a la derecha: `[Editar Datos de Cabecera ▾]`.
     * Si `isCollapsed === false`: Renderizar el Split Header completo actual (grid 2 columnas con imagen y campos) junto a un botón o icono sutil en la esquina: `[Plegar ▴]`.
   - Exponer o conectar evento para que al hacer clic en las etapas (`RecipeStageEditor` o `RecipeStagesTimeline`), si `formData.nombre` tiene valor, se marque `isCollapsed = true`.

2. En `recipe-modal.module.css`:
   - Crear las clases `.headerCollapsedBar` y `.collapseToggleBtn`.
   - Transición visual suave (`transition: max-height 0.25s ease, opacity 0.2s ease`).

3. Restricciones Técnicas:
   - Mantener límite estricto SRP (< 135 líneas por archivo).
   - Validar sintaxis con `node --check`.
   - Ejecutar: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al interactuar con las etapas la cabecera se compacta a una barra delgada de contexto, y vuelve a abrirse al presionar el botón de despliegue.
- `verify-srp.js` arroja código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.