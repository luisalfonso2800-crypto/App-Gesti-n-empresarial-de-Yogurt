TAREA:
Implementar el flujo bidireccional asistido entre Productos y Recetas: redirección directa al modal de creación de Producto si falta en catálogo, y botón contextual "Formular Receta" en la tabla de Productos cuando no tenga receta vinculada.

OBJETIVO:
1. En `PackagingWizardModal.jsx` (y `WizardDependencyAlert.jsx`):
   - Al evaluar la dependencia del cereal (WIP):
     * **Caso 1 (El producto no existe en el catálogo):**
       - El botón de redirección debe navegar a `/catalog/products?action=new` abriendo directamente el modal de creación de producto con la categoría sugerida `INSUMO_BASE_WIP` (o categoría técnica adecuada).
     * **Caso 2 (El producto existe pero no tiene receta formulada):**
       - El botón debe navegar a `/catalog/recipes?action=new&productId=[ID]` abriendo el modal de nueva receta con dicho producto preseleccionado en "PRODUCTO A FABRICAR".

2. En el Catálogo de Productos (`apps/web/src/app/catalog/products/`):
   - En la tabla de productos (`ProductsTable.jsx` / fila de producto):
     * Cruzar con el catálogo de recetas existentes para detectar si el producto tiene receta activa.
     * Si el producto **NO** tiene receta técnica asociada:
       - Mostrar en la columna de acciones un botón distintivo: `[ + Receta ]` o `[ Formular Receta ]`.
       - Al hacer clic, redirigir a `/catalog/recipes?action=new&productId=[ID]`.

3. En el Módulo de Recetas (`apps/web/src/app/catalog/recipes/`):
   - Al montar la página o recibir parámetros en URL (`action=new&productId=...`):
     * Abrir automáticamente el modal `RecipeModal` en modo creación.
     * Preseleccionar en el campo `PRODUCTO A FABRICAR` el producto indicado en el query param.

4. Restricciones Técnicas:
   - Cumplir Circuit Breaker (< 135 líneas por archivo en frontend).
   - Utilizar CSS Modules puro (cero estilos inline `style={{}}`).
   - `verify-srp.js` retornando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/RecipeModal.jsx` (o gestor del modal de recetas)
- `apps/web/src/app/catalog/products/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/products/` (tabla/acciones de productos y modal)
- `apps/web/src/app/catalog/recipes/` (manejo de query params para auto-abrir y preseleccionar)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Conectar query params en recetas para desplegar el modal con producto precargado.
2. Añadir botón en catálogo de productos para formular receta en 1 clic.
3. Actualizar el banner del wizard para redirigir según si falta producto o falta receta.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Navegación reactiva fluida: faltante de producto abre modal de producto, faltante de receta abre modal de receta preseleccionada, y tabla de productos ofrece formulación directa.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Parámetros de navegación configurados:
- Resultado de verify-srp.js:
- Estado: