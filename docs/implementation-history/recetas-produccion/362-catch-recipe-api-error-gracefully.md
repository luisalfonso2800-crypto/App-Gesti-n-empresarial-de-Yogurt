TAREA (PRESUPUESTO ULTRA-BAJO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Capturar de forma segura las excepciones de la API (`ApiError`) en `useRecipeForm.js` / `RecipeModal.jsx` al intentar publicar una receta, evitando que Next.js lance un "Unhandled Runtime Error" y mostrando el mensaje del backend en el modal o toast accesible.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar `Search`, `Find` o exploraciones globales.
- LECTURA ÚNICA: Lee cada archivo 1 sola vez y edita directamente.
- Modificar EXCLUSIVAMENTE los archivos indicados.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
2. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

INSTRUCCIONES TÉCNICAS:
1. En `useRecipeForm.js` (o en la función `handleConfirmPublish` / `handleSubmit`):
   - Envolver la llamada al endpoint dentro de un bloque `try / catch`.
   - Si `error instanceof ApiError` o contiene `error.message`:
     * Capturar el mensaje (ej: "Toda receta de producto comercial requiere al menos un insumo de empaque primario").
     * Guardar el mensaje en el estado `errorMessage` y evitar que la excepción explote en la raíz de Next.js.
     * Si está abierto el modal de Hoja de Ruta (`RecipeOperationalSummaryModal`), mantenerlo cerrado o devolver el foco al editor para que el usuario pueda agregar el insumo faltante.
2. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Si el backend rechaza la receta por falta de empaque o cualquier otra validación, la interfaz muestra el mensaje de error de forma controlada sin pantalla roja de Next.js.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.