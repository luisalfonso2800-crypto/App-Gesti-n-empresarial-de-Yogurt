TAREA:
Refactorizar y pulir visualmente la tabla de productos (`ProductsTable.jsx` y su módulo CSS) para lograr un diseño industrial compacto, elegante y alineado con el Design System MANNÁ.

OBJETIVO:
1. En `apps/web/src/app/catalog/products/components/ProductsTable.jsx` (y archivos relacionados):
   - **Miniatura de Imagen:** Reducir a un avatar compacto de 48x48 px con borde suave (`border-radius: 8px`), `object-fit: cover` y fondo neutro para evitar saltos de altura en las filas.
   - **Nombre y Detalle:** Colocar el nombre del producto en semi-bold (`font-weight: 600`), acompañado debajo por un subtítulo discreto en gris con la presentación (ej. `16 oz / 500 ml` o `A Granel`).
   - **Badges de Categoría:** Reemplazar los textos crudos en mayúsculas (`BASES_LACTEAS`, `INSUMO_BASE_WIP`, etc.) por etiquetas o chips estilizados con nombres legibles y fondo pastel acorde.
   - **Precio de Venta:** Aplicar formateo de moneda (`$12.000`) y si el valor es 0, mostrar `$0 (Costo Interno)` en tipografía atenuada.
   - **Barra de Acciones:**
     * Alinear los botones con padding compacto (`padding: 6px 12px`, `font-size: 13px`).
     * Estilizar el botón `+ Receta` con fondo contrastado sutil, `Editar` en botón outline neutral, `Desactivar/Activar` con color de advertencia controlado y `Eliminar` con estilo de peligro discreto.
     * Añadir efecto hover suave en las filas de la tabla (`tr:hover`).

2. Restricciones Técnicas:
   - Cumplir SRP (< 135 líneas por archivo). Si `ProductsTable.jsx` excede el límite, extraer el renderizado de la fila a `ProductTableRow.jsx`.
   - CSS Modules puro. Veto absoluto a estilos inline (`style={{}}`).
   - Mantener intactas todas las funciones existentes (`onEdit`, `onToggleActive`, `onDelete`, `onAddRecipe`).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/components/products.module.css` (o archivo CSS Module asociado)
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/products/`. Prohibido alterar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- CSS Modules correspondiente en el módulo de productos.

CREAR (si aplica para SRP):
- `apps/web/src/app/catalog/products/components/ProductTableRow.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductsTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Tabla estilizada, compacta y legible visualmente.
- Todas las acciones operativas funcionando.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados/creados:
- Mejoras visuales implementadas:
- Resultado de verify-srp.js:
- Estado: