TAREA:
Corrección Definitiva: Lógica Matemática de Costeo de Receta (BOM), Restauración Visual de Input de Cantidad y Footer Plegable

OBJETIVO:
1. Eliminar condiciones empíricas tipo "costo <= 10" en `recipeHelpers.js` y calcular el costo mediante conversión matemática rigurosa entre la unidad del insumo y la unidad de la receta.
2. Restaurar la clase CSS y ancho completo del campo "CANTIDAD BASE" en `RecipeHeaderFields.jsx`.
3. Garantizar que el botón de plegar del footer colapse realmente el panel a una altura mínima tipo barra flotante.

INSTRUCCIONES TÉCNICAS:

1. Corrección Matemática en `recipeHelpers.js` (`calculateRecipeCosts`):
   - Al calcular el costo de una materia prima:
     * Si la cantidad en el BOM está en 'g' y el costo referencial del insumo está cotizado por 'kg' (o viceversa): aplicar factor de conversión exacto (1 kg = 1000 g).
     * Si el insumo tiene `unidadBase === 'kg'` o `'lt'`, su `costoBase` corresponde a 1000 g / 1000 ml. Por tanto, `costoRealItem = (cantidad_en_g / 1000) * costo_por_kg`.
     * Si `insumo.unidadBase === 'g'` y el costo ya está en gramos, `costoRealItem = cantidad_en_g * costo_por_g`.
     * Eliminar cualquier lógica de umbrales arbitrarios (`<= 10`).
   - Al calcular el Costo Unitario Proyectado:
     * Si el rendimiento de la receta está en Kg o Lt, dividir `costoTotalBatch / cantidadBase`.
     * Si está en g o ml, calcular el costo por unidad de medida consistente.

2. Restaurar Visual de `RecipeHeaderFields.jsx`:
   - El input de `CANTIDAD BASE` debe tener asignada su clase de estilo correspondiente en CSS Modules (ej. `className={styles.input}`) y `width: 100%`, idéntico en altura, fuente y apariencia a los demás inputs ("PRODUCTO A FABRICAR", "NOMBRE TÉCNICO"). Mantener `step={unidad === 'und' ? '1' : '0.1'}`.

3. Footer Plegable en `RecipeBalanceFooter.jsx` y su CSS Module:
   - Cuando `isBalanceCollapsed === true`:
     * El contenedor exterior debe tener `height: auto`, `padding: 0.5rem 1rem`, ocultando completamente el bloque de cabecera (`BALANCE GENERAL DE MATERIALES Y COSTOS`, `Rendimiento`, `Composición`, `Materias primas`).
     * Mostrar únicamente en una sola línea horizontal compacta: el botón de alternancia (Chevron), la etiqueta "COSTO TOTAL BATCH", su valor verde y los botones de acción (`Finalizar y Resumir`).

REGLAS ESTRICTAS:
- SRP: Archivos < 130 líneas.
- Cero estilos en línea (`style={{`). Usar exclusivamente CSS Modules.
- NO EJECUTAR `pnpm --filter web build` desde la herramienta (se correrá manualmente).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`

DETENCIÓN:
Al validar sintaxis y verificar SRP en 0 infracciones, DETENTE inmediatamente.