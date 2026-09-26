TAREA:
Replicar en el catálogo de Presentaciones (`catalog/presentations`) exactamente la misma estructura, tamaño y presentación visual de imagen utilizada en el módulo de Productos (`catalog/products`), asegurando coherencia visual inmediata entre ambos catálogos.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Inspeccionar el componente visual de imagen en `apps/web/src/app/catalog/products/` para extraer sus clases, dimensiones exactas y contenedor.
- Edición focalizada en la vista de Presentaciones.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. Inspeccionar la visualización de imagen en `apps/web/src/app/catalog/products/`:
   - Identificar cómo se renderiza la imagen del producto (dimensiones en px o rem, aspect ratio, bordes redondeados, contenedor de imagen y placeholder cuando está vacía).
2. En `apps/web/src/app/catalog/presentations/`:
   - Integrar la columna o tarjeta de vista previa con exactamente el **mismo tamaño de contenedor y proporciones de imagen que Productos**.
   - Si la presentación cuenta con imagen, mostrarla con el mismo `object-fit` y estilo de marco.
   - Si no cuenta con imagen, usar el mismo placeholder botánico con icono sutil sobre fondo crema.
   - Alinear la fila de la tabla para soportar limpiamente esta altura visual sin desbordar el layout.

3. Restricciones Técnicas:
   - Mantener componentes por debajo de 135 líneas (SRP). Modularizar la celda o componente de imagen si la tabla excede el límite.
   - 100% CSS Modules puro (cero inline styles).
   - Validar sintaxis con `node --check` y `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- Componente de renderizado de imagen en `apps/web/src/app/catalog/products/`
- Componente de tabla/lista en `apps/web/src/app/catalog/presentations/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/presentations/`. Backend intacto.

ALCANCE:

MODIFICAR:
- Componente de la tabla/lista de presentaciones y su respectivo archivo CSS Module.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-componente-modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La imagen de cada envase en Presentaciones se muestra con el mismo tamaño, claridad y presencia visual que en el catálogo de Productos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Dimensiones y clases replicadas desde el módulo de Productos:
- Resultado de verify-srp.js:
- Estado: