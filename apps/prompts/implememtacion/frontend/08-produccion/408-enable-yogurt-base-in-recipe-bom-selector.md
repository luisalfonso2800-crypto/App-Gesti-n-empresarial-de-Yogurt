TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Habilitar que "YOGURT BASE" aparezca disponible en el selector de "Bases y Semielaborados (WIP)" dentro del diseñador de recetas:
1. En el endpoint o hook que provee los semielaborados al editor de recetas (`useRecipePageData.js` / `recipes.service.js` / `products.repository.js`): Asegurar que todos los productos marcados como base de planta o semielaborados (tipo 'INTERMEDIO_WIP', canalVenta 'SOLO_PLANTA' o categoría 'BASES_LACTEAS') se incluyan en las opciones seleccionables del BOM, incluso si no tienen presentación comercial asociada.
2. En el componente de formulario del BOM (`RecipeStageForm.jsx` o `RecipeBomEditor.jsx`): Renderizar el nombre del producto base con su unidad nativa (g / ml / Litros) dentro del grupo "Bases y Semielaborados (WIP)".

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js` (o servicio de productos para recetas)
2. `apps/web/src/app/catalog/recipes/components/RecipeStageModal.jsx` (o componente donde reside el <select> de ingredientes)

INSTRUCCIONES TÉCNICAS:

1. En el repositorio de productos:
   - En la función que lista los productos para uso como ingredientes/semielaborados (ej. `findIntermediates` o query con `tipo: 'INTERMEDIO_WIP'`):
     * Retornar los productos cuyo `tipo === 'INTERMEDIO_WIP'` o `categoria === 'BASES_LACTEAS'` o `canalVenta === 'SOLO_PLANTA'`, permitiendo `presentacion: null`.
     * Formatear el label como: `${producto.nombre} (Base a Granel)` si no posee presentación.

2. En el selector del BOM en frontend:
   - Asegurar que el `<optgroup label="Bases y Semielaborados (WIP)">` mapee tanto los productos con presentación como los semielaborados a granel sin empaque.
   - Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeStageModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir el desplegable de ingredientes en la etapa de Inoculación, aparece la opción "YOGURT BASE".
- Se puede guardar la receta utilizando este semielaborado como cultivo iniciador.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.