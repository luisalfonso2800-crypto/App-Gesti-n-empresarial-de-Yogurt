TAREA:
Integrar la columna de vista previa de imagen/miniatura en la tabla del catálogo de Presentaciones (`catalog/presentations`), vinculando visualmente el campo cargado en el formulario modal para dar coherencia a la interfaz.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido búsquedas globales.
- Edición focalizada en la tabla de Presentaciones y su CSS Module.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En la tabla de Presentaciones (`PresentationsTable.jsx` o dentro de `catalog/presentations/page.jsx`):
   - Agregar una columna previa a "Nombre":
     * Cabecera: vacía o etiqueta "Envase / Vista".
     * Celda: Contenedor miniatura (`38x38 px` o `42x42 px`) con bordes redondeados (`border-radius: 8px`), borde sutil y fondo crema.
     * Si el registro cuenta con `imageUrl` / `image`: renderizar la imagen con `object-fit: contain` o `cover`.
     * Si no tiene imagen: renderizar un icono botánico sutil (Leaf o Box/Package) con opacidad tenue.
   - Ajustar el ancho de las demás columnas para mantener balance visual y legibilidad en resoluciones de planta.

2. En su CSS Module:
   - Clases `.thumbnailCell`, `.thumbImage`, `.placeholderThumb`.
   - Efecto sutil de zoom o realce al pasar el cursor (`hover`).

3. Restricciones Técnicas:
   - Mantener el componente por debajo de 135 líneas (SRP).
   - 100% CSS Modules puro.
   - `node .agents/scripts/verify-srp.js` debe arrojar código 0.

FUENTES DE VERDAD:
- Archivos en `apps/web/src/app/catalog/presentations/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/presentations/`. Backend intacto.

ALCANCE:

MODIFICAR:
- Componente de la tabla de presentaciones y su archivo de estilos.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-archivo-modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla de presentaciones muestra la miniatura del envase registrado.
- La subida de imagen del formulario cobra utilidad directa e intuitiva.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Estructura de la columna añadida:
- Resultado de verify-srp.js:
- Estado: