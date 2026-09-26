TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Exonerar de la regla obligatoria de empaque primario a las recetas cuyos productos sean a granel, bases lácteas (WIP) o costo interno ($0), y asegurar que cualquier validación rechazada por la API retorne un mensaje legible capturado adecuadamente por el cliente.

CLÁUSULA ANTI-EXPLORACIÓN (REGLA 07):
- PROHIBIDO usar `Search`, `Find` o comandos recursivos.
- LECTURA ÚNICA: Lee una sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos listados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/recipes/recipes.service.js` (o donde reside la validación del empaque)
2. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `recipes.service.js`:
   - Localizar la validación que lanza:
     "Toda receta de producto comercial requiere al menos un insumo de empaque primario (vaso, botella o tapa)"
   - Ajustar la condición:
     * Si el producto asociado tiene presentación `A Granel / Tanque (WIP)`, o pertenece a categoría base WIP (`Bases Lácteas`), o `precioVenta === 0`:
       -> NO exigir insumo de empaque primario (permitir guardar la receta solo con ingredientes/materias primas como leche y cultivo).
     * Si el producto es efectivamente comercial envasado (ej. Contenedor de 16 oz) y carece de vaso/botella/tapa, mantener el error legible.

2. En `RecipeModal.jsx`:
   - Envolver la acción de confirmación de publicación (`handleConfirmPublish`) en un bloque `try / catch`.
   - Al recibir un `ApiError`, almacenar el mensaje en un estado local `publishError` y mostrarlo como una alerta estilizada en el modal en lugar de permitir que rompa el runtime de Next.js.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/recipes/recipes.service.js`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La receta de `YOGURT BASE` (a granel) se guarda y publica con éxito sin exigir vaso o tapa.
- `verify-srp.js` devuelve código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE de inmediato.