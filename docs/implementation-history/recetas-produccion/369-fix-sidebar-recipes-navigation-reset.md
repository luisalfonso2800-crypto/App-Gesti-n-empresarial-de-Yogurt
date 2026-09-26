TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir la navegación del menú lateral en el ítem "Recetas" para que, si el usuario se encuentra dentro de la vista/modal de "Nueva Receta", al hacer clic en "Recetas" cierre el formulario de creación y regrese a la vista principal del catálogo de recetas.

CLÁUSULA ANTI-EXPLORACIÓN (REGLA 07):
- PROHIBIDO usar búsquedas globales (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee una sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/page.jsx` (o `useRecipesPageManager.js`)
2. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o el Sidebar de navegación si intercepta el click)

INSTRUCCIONES TÉCNICAS:
1. En la página o hook de recetas (`page.jsx` / `useRecipesPageManager.js`):
   - Escuchar los cambios de ruta o implementar un handler de reseteo: si el usuario ya está en `/catalog/recipes` y pulsa "Recetas" en el menú, asegurar que el estado que controla la visibilidad del modal/formulario de creación (`isCreateOpen`, `isModalOpen` o `showRecipeModal`) se establezca en `false`.
   - Limpiar cualquier query parameter activo (ej: remover `?new=true` o `?action=create`) ejecutando un `router.replace('/catalog/recipes')` o cerrando el modal de inmediato.
2. En `RecipeModal.jsx`:
   - Asegurar que el modal responda adecuadamente a la señal de cierre cuando se desmonta o cuando la prop de visibilidad pasa a `false`.
3. Respetar el límite de líneas SRP (< 135 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Estando en el formulario de nueva receta técnica, hacer clic en "Recetas" en el menú lateral izquierdo cierra el formulario y muestra la tabla/catálogo principal de recetas.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE de inmediato.