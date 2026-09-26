TAREA (PRESUPUESTO ULTRA-BAJO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Capturar de forma resiliente la excepción `ApiError` al publicar una receta en `RecipeModal.jsx` y `useRecipeForm.js`, mostrando el mensaje de validación del backend ("Toda receta de producto comercial requiere al menos un insumo de empaque primario...") directamente en la interfaz sin que reviente el runtime de Next.js.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar `Search`, `Find`, `Grep` o comandos de exploración.
- LECTURA ÚNICA: Lee cada archivo 1 sola vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeModal.jsx` (alrededor de la línea 109 `handleConfirmPublish`):
   - Envolver la ejecución de `handleSubmit` dentro de un bloque `try / catch`:
     ```javascript
     const handleConfirmPublish = async () => {
       try {
         setIsPublishing(true);
         await handleSubmit();
       } catch (err) {
         // Capturar el mensaje devuelto por ApiError o fallback
         const userMsg = err?.message || 'Error al guardar la receta técnica';
         setSubmitError(userMsg);
         // Mantener o reabrir la vista de edición para corregir el BOM faltante
       } finally {
         setIsPublishing(false);
       }
     };
     ```
   - Si existe un estado de error, mostrarlo como un banner de advertencia visual claro (borde rojo `#EF4444`, fondo `#FEF2F2`) dentro del modal de confirmación o en el editor.
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En `useRecipeForm.js` (alrededor de la línea 432 `handleSubmit`):
   - Asegurarse de que `handleSubmit` propague el error o devuelva `{ success: false, error: err.message }` sin dejar promesas rechazadas sin capturar.
   - Mantener bajo 135 líneas.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al recibir el error del backend, la interfaz no rompe con pantalla roja de Next.js.
- El usuario recibe un mensaje claro de que debe añadir un insumo de empaque primario.
- `verify-srp.js` arroja código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.