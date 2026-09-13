OBJETIVO:
En `apps/web/src/app/catalog/products/components/ProductModal.jsx`:
1. Extender el micro-texto explicativo de "Semielaborado (WIP)" a ancho completo (`gridColumn: '1 / -1'`) para que abarque desde debajo de CATEGORÍA hasta el final de CANAL DE VENTA.
2. Hacer reactiva la visualización: si el usuario cambia la presentación a cualquier opción distinta de "A GRANEL", restaurar la vista comercial normal (ocultar banners de base a granel/WIP, volver a mostrar los campos comerciales de precio/margen con su proyección financiera).
3. Eliminar el residuo numérico "0" huérfano que se renderiza como texto suelto al pie del formulario.

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

INSTRUCCIONES:

1. DETERMINACIÓN ESTRICTA DE MODO A GRANEL / WIP:
   - Evaluar si la presentación activa es a granel:
     ```javascript
     const isGranel = Boolean(
       selectedPres?.tipoEnvase === 'TANQUE_GRANEL' ||
       selectedPres?.nombre?.toUpperCase().includes('GRANEL')
     );
     ```

2. BANNERS Y TEXTOS PEDAGÓGICOS CONDICIONADOS A `isGranel`:
   - El banner "Paso Clave: Crear Producto Base (A Granel)" debe condicionarse estrictamente a `{isGranel && (...)}`. Si el usuario cambia la presentación a "ENVASE PLÁSTICO", botella o vaso, este banner NO debe renderizarse.
   - El contenedor del texto "¿Qué es un Semielaborado (WIP)?":
     * Extraerlo de la columna individual de Categoría.
     * Ubicarlo inmediatamente debajo de la fila de Categoría y Canal de Venta con ancho completo (`gridColumn: '1 / -1'`).
     * Condicionarlo a `{isGranel && (...)}` (o si la categoría seleccionada es explícitamente WIP). Si la presentación es comercial común, no debe mostrarse para evitar ruido visual.

3. RESTAURACIÓN DE VISTA COMERCIAL NORMAL CUANDO `!isGranel`:
   - Si `!isGranel` (producto comercial terminado):
     * Renderizar con normalidad la fila de `PRECIO DE VENTA ($)` y `MARGEN OBJETIVO (%)` con sus controles de stepping de 5 en 5.
     * Renderizar la tarjeta de proyección financiera a tres columnas (Precio Venta | Costo Máx. Receta | Ganancia Esperada) a ancho completo (`gridColumn: '1 / -1'`).
     * NO mostrar la tarjeta de "Ficha de Costeo por Transformación (Uso Interno)".
   - Si `isGranel` es verdadero:
     * Ocultar los campos comerciales y mostrar la tarjeta de costeo operativo interno.

4. ELIMINACIÓN DEL TEXTO HUÉRFANO "0":
   - Inspeccionar el JSX donde se evalúan expresiones numéricas como `{precioVentaNum && ...}` o `{costoMaximo && ...}`. En React, cuando una variable numérica vale `0`, la expresión `{0 && <Component />}` renderiza el texto `"0"` directamente en el DOM.
   - Reemplazar cualquier evaluación numérica por booleanos explícitos:
     `{Boolean(precioVentaNum > 0) && ...}` o `{precioVentaNum > 0 ? (...) : null}`.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx`
`node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`

SALIDA:
Reporte conciso indicando:
- Reubicación a ancho completo (`gridColumn: '1 / -1'`) del texto pedagógico.
- Comprobación del comportamiento reactivo al alternar entre "A GRANEL" y "ENVASE PLÁSTICO".
- Expresión que causaba el "0" huérfano corregida.
- Confirmación de lint con código 0.