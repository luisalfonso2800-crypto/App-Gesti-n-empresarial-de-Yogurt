TAREA (AUDITORÍA EXHAUSTIVA DE TRAZABILIDAD - PRESUPUESTO: MÁXIMO 3 TOOL CALLS):
Auditar el flujo exacto de datos de recetas de punta a punta para resolver definitivamente la pérdida de producto en edición y la duplicación de inóculos sintéticos:

1. Inspeccionar `apps/api/src/products/products.repository.js`:
   - Revisar qué hace exactamente `findIntermediates()` y cómo está contaminando los productos base al inyectar strings con prefijos `INOCULO:` y `BASE:`.
2. Inspeccionar `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js` y `useRecipeForm.js`:
   - Rastrear cómo se combinan `/products` y `/products/intermediates`.
   - Verificar cómo inicializa el formulario el valor `idProducto` cuando se presiona "Editar / Ver BOM" (`receta.idProducto`).
3. Inspeccionar `RecipeHeaderFields.jsx` y `RecipeStageBomTable.jsx`:
   - Ver qué elementos exactos recibe la cabecera vs la tabla BOM.
   - Detectar por qué la cabecera descarta a `YOGURT BASE` durante la edición.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO MODIFICAR CÓDIGO FUENTE. Solo lectura y análisis estricto.

ARCHIVOS A INSPECCIONAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
3. `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js`
4. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
5. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

ENTREGABLES:
1. El motivo exacto por el cual `receta.idProducto` no hace match en el `<select>` al editar y se limpia a blanco.
2. La razón por la cual `findIntermediates()` inventa un inóculo de "YOGURT PURO" sin que exista en inventario.
3. La propuesta de corrección arquitectónica definitiva de un solo paso.

DETENCIÓN:
Entrega el diagnóstico completo y DETENTE inmediatamente sin realizar ediciones.