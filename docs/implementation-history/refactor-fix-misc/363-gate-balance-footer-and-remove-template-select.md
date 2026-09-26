TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1. Remover el selector redundante "PLANTILLA / TIPO DE RECETA" de la cabecera (`RecipeHeaderFields.jsx`), dejando únicamente los 4 campos canónicos (Producto a Fabricar, Nombre Técnico, Cantidad Base y Unidad de Medida) en un layout 2x2 balanceado junto a la foto.
2. Aplicar compuerta Poka-Yoke al dock inferior de balance (`RecipeBalanceFooter.jsx` o render en `RecipeModal.jsx`): NO debe renderizarse ni mostrarse si la cabecera no tiene definidos sus datos obligatorios (`idProducto`, `nombre`, `cantidadBase > 0` y `unidadMedida`).

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar `Search`, `Find`, `Grep` o comandos de exploración.
- LECTURA ÚNICA: Lee cada archivo exactamente 1 sola vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeHeaderFields.jsx`:
   - Eliminar el campo `<select>` y etiqueta de "PLANTILLA / TIPO DE RECETA" (la selección de plantilla ya reside en la barra lateral izquierda).
   - Reorganizar el grid de la columna izquierda de datos en 2 filas limpias:
     * Fila 1: `PRODUCTO A FABRICAR *` (50%) + `NOMBRE TÉCNICO DE LA RECETA *` (50%).
     * Fila 2: `CANTIDAD BASE *` (50%) + `UNIDAD *` (50%).
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `RecipeModal.jsx`:
   - Definir condición de completitud de cabecera:
     ```javascript
     const isHeaderComplete = Boolean(
       (formData.idProducto || formData.productoId) &&
       formData.nombre?.trim() &&
       Number(formData.cantidadBase) > 0 &&
       formData.unidadMedida?.trim()
     );
     ```
   - Condicionar la renderización de `<RecipeBalanceFooter ... />`: solo renderizar el dock inferior si `isHeaderComplete === true`.
   - Si `isHeaderComplete === false`, el dock inferior permanece oculto, guiando al usuario a centrarse primero en definir la base del producto.
   - Respetar SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La cabecera ya no tiene el dropdown redundante de tipo/plantilla.
- La barra flotante inferior de balance y costos NO aparece en pantalla mientras falten los datos clave de la cabecera.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.