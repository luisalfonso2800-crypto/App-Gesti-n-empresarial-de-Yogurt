TAREA:
Implementar el cálculo recursivo de costos (Cost Roll-up) en la barra de balance de materiales de recetas (`recipeHelpers.js` y `RecipeBalanceBar.jsx`), integrando el costo unitario de las recetas base (WIP) cuando se incorporan como insumo en el BOM.

OBJETIVO:
1. En `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js` (o lógica de cálculo de costos):
   - En la función que computa el balance general de costos de una receta (`calculateRecipeCosts` o equivalente):
     * Recibir o tener acceso al mapa/catálogo de recetas activas (`recipesList` o `recipesMap`).
     * Al iterar los ítems del BOM en cada etapa:
       - Si el ítem es un insumo directo de bodega (`tipo !== 'WIP'`): calcular `cantidad * precioInsumo * (1 + merma/100)`.
       - Si el ítem es una **Base WIP** (`tipo === 'WIP'` o producto semielaborado):
         1. Buscar la receta técnica activa correspondiente a dicho producto (`r.idProducto === item.idProducto`).
         2. Obtener el `costoUnitario` proyectado de esa receta previa (Costo Total Receta Base / Rendimiento Base).
         3. Multiplicar `cantidadRequerida * costoUnitarioWip * (1 + merma/100)`.
         4. Si la receta base aún no tiene costo o no existe, tomar el costo estimado registrado en el producto o fallback preventivo `$0` con advertencia.
     * Totalizar el Costo Total del Batch y el Costo Unitario Proyectado con la suma consolidada de insumos + bases WIP.

2. En `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeBalanceBar.jsx` (o barra de resumen inferior):
   - Mostrar el desglose reactivo del costo total:
     * Insumos de empaque / materias primas directas.
     * Costo transferido de bases intermedias (WIP).
   - Actualizar el semáforo de margen comercial (Rentable vs Fuera de Tope) considerando el costo real transferido.

3. Restricciones Técnicas:
   - Respetar SRP (< 135 líneas por archivo en frontend).
   - Usar CSS Modules puro (cero estilos inline `style={{}}`).
   - Mantener las funciones puras de cálculo de costos debidamente tipadas y testeables.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- Componentes y hooks de cálculo de balance de recetas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. Validar que al agregar 3 Litros de YOGURT BASE, el Costo Total Batch refleje el costo real acumulado de esa base.
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Las bases intermedias aportan su costo técnico al total del batch comercial.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Fórmula de costeo WIP integrada:
- Resultado de verify-srp.js:
- Estado: