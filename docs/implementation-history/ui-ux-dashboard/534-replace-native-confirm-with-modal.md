TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 ARCHIVO EDITADO - CERO BUCLES):
Eliminar el uso de `window.confirm()` o `confirm()` nativo del navegador en la acción de eliminar receta técnica (`apps/web/src/app/catalog/recipes/`), sustituyéndolo por el modal de confirmación estándar del sistema (o estado de modal en React) de acuerdo con las reglas de UI de `.agents/`.

CLÁUSULA DE CUMPLIMIENTO `.agents/`:
- Prohibido terminantemente el uso de `alert()`, `confirm()` o `prompt()` nativos del navegador.
- Toda confirmación destructiva debe utilizar un modal corporativo de confirmación (ej. `ConfirmModal`, `ActionModal` o un overlay estilizado con Tailwind consistente con la app) con botones estilizados (Aceptar / Cancelar) y feedback vía Toast.

ARCHIVO A MODIFICAR:
Localizar el componente exacto donde se implementó la acción de eliminar en `apps/web/src/app/catalog/recipes/` (ej. `RecipesTable.jsx`, `RecipeRow.jsx` o dentro de `components/`).

INSTRUCCIONES DIRECTAS:
1. Eliminar la llamada `if (window.confirm(...))` o `confirm(...)`.
2. Integrar el componente de confirmación modal ya existente en el proyecto (revisar `@/components/ui` o `common/ConfirmModal`) o gestionar un estado React simple:
   - `const [recipeToDelete, setRecipeToDelete] = useState(null);`
   - Al pulsar el botón "Eliminar" de la fila: `setRecipeToDelete(receta)`.
   - Renderizar el modal solo cuando `recipeToDelete` no sea nulo, mostrando:
     * Título: "¿Eliminar Receta Técnica?"
     * Mensaje: `¿Estás seguro de eliminar la receta "${recipeToDelete.nombre}"? Esta acción no se puede deshacer.`
     * Botón Cancelar (gris/outline).
     * Botón Confirmar Eliminación (rojo corporativo / destructivo).
3. Mantener el límite SRP (< 130 líneas). Si el modal añade muchas líneas, usar un subcomponente o el modal compartido del repositorio.

VERIFICACIÓN:
1. `node --check <archivo_modificado>`
2. `pnpm --filter web build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Ya no aparece el popup emergente "localhost:3000 dice".
- La confirmación se realiza mediante una ventana modal estilizada con la paleta de la aplicación.
- `verify-srp` retorna 0 infracciones.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.