TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Rastrear y conectar de punta a punta la carga de semielaborados en el selector de recetas para habilitar el apartado específico de Inóculos/Bases:
1. Inspeccionar `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js` (o `useRecipeForm.js`) y su controlador en backend (`products.controller.js` o `recipes.controller.js`) para ver exactamente de qué URL obtiene las "Bases y Semielaborados".
2. Conectar el controlador para que devuelva los productos intermedios de `findIntermediates()` (incluyendo `YOGURT BASE` tanto en variante base como en variante inóculo).
3. En `RecipeStageBomTable.jsx`: Crear un grupo específico o listar claramente:
   - <optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">
       <option value="...">INÓCULO / CULTIVO VIVO (YOGURT BASE) - g</option>
   - <optgroup label="🥛 Bases Lácteas a Granel (WIP)">
       <option value="...">YOGURT BASE (A Granel) - Litros</option>

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA PUNTUAL: Lee solo los archivos de la cadena de datos del select.
- Modificar EXCLUSIVAMENTE los archivos de la ruta de datos.

ARCHIVOS A INTERVENIR:
1. `apps/api/src/products/products.controller.js` (o `recipes.controller.js`)
2. `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js` (o `useRecipeForm.js`)
3. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:
- Asegurar que el payload consumido por la pantalla de recetas contenga los items generados por `findIntermediates()`.
- En `RecipeStageBomTable.jsx`, renderizar las opciones permitiendo seleccionar el inóculo en gramos (`g`) y la base en litros (`L`), sin exigir `presentacionId`.
- Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al desplegar el BOM en la etapa de Inoculación, figura la opción seleccionable para inóculo/base de YOGURT BASE.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.