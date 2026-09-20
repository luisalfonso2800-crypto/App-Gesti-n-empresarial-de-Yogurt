TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Implementar la corrección arquitectónica definitiva desacoplando el catálogo maestro de productos de los semielaborados/inóculos consumibles en el módulo de recetas:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 3 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js`
3. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `products.repository.js` (`findIntermediates`):
   - Eliminar estrictamente la condición `p.nombre?.toUpperCase().includes('YOGURT')`.
   - Limitar la generación de `INOCULO_WIP` y `BASE_GRANEL` ÚNICAMENTE a productos que cumplan:
     `p.tipo === 'INTERMEDIO_WIP' || ['BASES_LACTEAS', 'INTERMEDIO_WIP', 'INSUMO_BASE_WIP'].includes(p.categoria) || p.nombre?.toUpperCase().includes('BASE')`
   - Esto erradica el inóculo fantasma de "YOGURT PURO".

2. En `useRecipesData.js`:
   - NO filtrar ni mutar los productos obtenidos de `apiClient.get('/products')`.
   - Guardar los productos maestros limpios en el estado `products` (donde cada producto conserva su `id` UUID original).
   - Guardar o concatenar los semielaborados devueltos por `apiClient.get('/products/intermediates')` asegurando que no sobreescriban ni eliminen del array maestro a `YOGURT BASE`.

3. En `RecipeHeaderFields.jsx`:
   - El `<select name="idProducto">` debe mapear sobre los productos maestros limpios (`products.filter(p => !p.idItem && p.tipoItem !== 'INOCULO_WIP' && p.tipoItem !== 'BASE_GRANEL')`).
   - Usar `key={`header-prod-${p.id}`}` y `value={p.id}`.
   - Con esto, al editar `YOGURT BASE`, el `<select>` hace match exacto con el UUID y nunca se limpia a blanco.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al dar clic en "Editar / Ver BOM" de YOGURT BASE, el producto seleccionado se mantiene visible en la cabecera sin vaciarse.
- En el grupo "Iniciadores y Cepas" del BOM solo aparece "INÓCULO / INICIADOR (YOGURT BASE) - g" (desaparece el inóculo fantasma de Yogurt Puro).
- No hay advertencias de keys duplicadas en la consola de React.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.