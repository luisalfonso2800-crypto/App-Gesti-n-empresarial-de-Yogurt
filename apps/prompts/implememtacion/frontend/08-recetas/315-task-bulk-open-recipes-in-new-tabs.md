TAREA:
Incorporar la acción masiva "Formular Recetas" en la barra de herramientas superior (`ProductBulkActionBar.jsx`), permitiendo abrir el módulo de recetas en pestañas independientes (`_blank`) para cada producto seleccionado que no tenga receta activa.

OBJETIVO:
1. En `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`:
   - Evaluar los productos seleccionados (`selectedIds`) cruzados con las recetas existentes.
   - Filtrar aquellos productos seleccionados que **NO** posean receta técnica asociada (`!hasRecipe`).
   - Si al menos uno de los productos seleccionados no tiene receta:
     * Mostrar el botón de acción masiva: `[ 📖 + Formular Recetas (${count}) ]`.
     * Al hacer clic, ejecutar un handler que abra cada receta en su propia pestaña:
       ```javascript
       productsWithoutRecipe.forEach((prod) => {
         window.open(`/catalog/recipes?action=new&productId=${prod.id}`, '_blank');
       });
       ```
     * Desmarcar los productos procesados o notificar mediante un toast informativo: `"Se abrieron [N] pestañas para formular recetas técnicas."`.

2. En `apps/web/src/app/catalog/products/components/ProductsTable.jsx`:
   - Asegurar que la columna de acciones individuales quede simplificada al máximo (dejando solo `Editar` o menú compacto), delegando la formulación múltiple a la barra superior cuando hay checklist activo.

3. Restricciones Técnicas:
   - Cumplir Circuit Breaker (< 135 líneas por archivo en frontend).
   - Utilizar CSS Modules puro (cero `style={{}}`).
   - Mantener compatibilidad con navegadores modernos sin romper por bloqueo de popups (agrupar aperturas en el evento directo de clic).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/products/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx` (si requiere pasar el catálogo de recetas)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botón masivo para crear recetas visible cuando los elementos seleccionados carecen de fórmula.
- Apertura en pestañas independientes (`_blank`) con los query params correspondientes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Manejo de apertura concurrente validado:
- Resultado de verify-srp.js:
- Estado: