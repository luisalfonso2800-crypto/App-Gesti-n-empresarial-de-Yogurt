TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Evitar la creación automática de etapas por defecto al ingresar la cantidad base o seleccionar un producto en el formulario de recetas, permitiendo que la secuencia inicie vacía hasta que el usuario elija una plantilla o agregue una etapa manualmente:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente del formulario de recetas (`RecipeForm.jsx` o hook de estado `useRecipeForm.js`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/recipes/components/RecipeForm.jsx` (o hook donde se inicializan las etapas)

INSTRUCCIONES TÉCNICAS:

1. Limpieza de Inicialización Automática:
   - Localizar cualquier `useEffect` o bloque donde se inserte automáticamente una etapa por defecto (ej. `setEtapas([defaultStage])` o similar al cambiar `cantidadBase` o `productoId`).
   - Eliminar dicha inyección automática.
   - El estado inicial de etapas para una nueva receta debe ser estrictamente `[]` (arreglo vacío).

2. Manejo de Estado Vacío (Empty State):
   - Cuando `etapas.length === 0`:
     * La columna izquierda "Secuencia de Etapas" muestra la lista vacía con el botón `+ Agregar Etapa`.
     * El panel central/derecho muestra un mensaje amigable:
       `"👋 Comienza tu receta: Selecciona una de las Plantillas Rápidas arriba o pulsa '+ Agregar Etapa' para definir los parámetros del proceso."`
     * No renderizar el formulario detallado de etapa (nombre, tiempo, temperaturas, BOM) hasta que exista al menos 1 etapa seleccionada.

3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/recipes/components/RecipeForm.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir una nueva receta e ingresar la cantidad base, no aparece ninguna etapa creada automáticamente.
- Las etapas se crean únicamente al hacer clic en una Plantilla Rápida o en "+ Agregar Etapa".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.