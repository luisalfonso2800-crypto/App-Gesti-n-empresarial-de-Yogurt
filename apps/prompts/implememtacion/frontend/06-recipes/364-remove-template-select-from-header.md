TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL EN TOTAL):
Remover de forma definitiva el selector redundante "PLANTILLA / TIPO DE RECETA" y su etiqueta en `RecipeHeaderFields.jsx`, reorganizando los campos restantes en un grid 2x2 simétrico junto a la imagen.

CLÁUSULA ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO usar búsquedas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee una sola vez el archivo y edítalo de inmediato.
- Modificar EXCLUSIVAMENTE el archivo indicado.

ARCHIVO A MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`

INSTRUCCIONES TÉCNICAS:
1. Eliminar el bloque JSX que contiene el `<label>` "PLANTILLA / TIPO DE RECETA" y su `<select>` asociado.
2. Organizar la columna de campos técnicos en un grid de 2 filas simétricas (50% / 50% cada una):
   - Fila 1: `PRODUCTO A FABRICAR *` (ancho 50%) + `NOMBRE TÉCNICO DE LA RECETA *` (ancho 50%).
   - Fila 2: `CANTIDAD BASE *` (ancho 50%) + `UNIDAD *` (ancho 50%).
3. Mantener el pie con `[+ Agregar notas u observaciones técnicas]`.
4. Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La cabecera muestra únicamente los 4 campos canónicos en 2 filas limpias y balanceadas junto a la imagen.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.