TAREA:
Remover los botones redundantes de cada fila en `ProductsTable.jsx` y garantizar que las acciones de activación, desactivación, eliminación y formulación de recetas se ejecuten exclusivamente a través de la barra superior `ProductBulkActionBar.jsx`.

OBJETIVO:
1. En `apps/web/src/app/catalog/products/components/ProductsTable.jsx`:
   - Limpiar la columna `Acciones` (`<td>`):
     * **Eliminar** el botón `+ Receta`.
     * **Eliminar** el botón `Desactivar` / `Activar`.
     * **Eliminar** el botón `Eliminar`.
     * **Conservar únicamente** el botón `Editar` (estilo neutral, compacto).
   - Ajustar el ancho del `<th>` de "Acciones" para que no ocupe espacio desmedido en la tabla.

2. En `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`:
   - Asegurar que la barra sea visible cuando `selectedIds.length > 0` (o anclada en la parte superior sobre la tabla).
   - Verificar la presencia de los botones masivos con íconos:
     * `[ 🟢 Activar ]` (invoca cambio a activo para los IDs seleccionados).
     * `[ 🟡 Desactivar ]` (invoca cambio a inactivo para los IDs seleccionados).
     * `[ 🗑️ Eliminar ]` (abre confirmación modal para borrado seguro).
     * `[ 📖 + Formular Recetas ]` (si hay elementos seleccionados sin receta, abre cada uno en nueva pestaña con `window.open`).
     * `[ ✖ Limpiar Selección ]`.

3. Restricciones Técnicas:
   - Respetar el límite de Circuit Breaker (< 135 líneas por archivo).
   - CSS Modules puro (cero estilos inline `style={{}}`).
   - Salida limpia en `node .agents/scripts/verify-srp.js` (código 0).

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/products/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx` (si requiere ajustes en renderizado)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductsTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Filas de la tabla simplificadas a un único botón `Editar`.
- Operaciones múltiples gobernadas por `ProductBulkActionBar`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Botones retirados de la fila:
- Estado de la barra de acciones:
- Resultado de verify-srp.js:
- Estado: