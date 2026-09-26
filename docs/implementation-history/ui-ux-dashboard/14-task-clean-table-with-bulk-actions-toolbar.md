TAREA:
Reemplazar la repetición de botones en cada fila de `ProductsTable.jsx` por una columna de checkboxes a la izquierda y una barra de herramientas de acciones masivas con íconos en la parte superior.

OBJETIVO:
1. En `apps/web/src/app/catalog/products/components/`:
   - Crear `ProductBulkActionBar.jsx` y su módulo `product-bulk-action-bar.module.css`:
     * Barra de herramientas superior ubicada antes del encabezado de la tabla.
     * Al detectar elementos seleccionados (`selectedIds.length > 0`), desplegar las acciones rápidas con íconos SVG/minimalistas:
       - Indicador numérico: `[N] seleccionados`.
       - Botón Activar Masivo: ícono de check/play verde.
       - Botón Desactivar Masivo: ícono de pausa/candado ámbar.
       - Botón Eliminar Masivo: ícono de papelera rojo (abre confirmación con advertencia de trazabilidad).
       - Botón Cancelar/Deseleccionar: ícono de equis o texto "Limpiar".

2. En `apps/web/src/app/catalog/products/components/ProductsTable.jsx`:
   - Añadir como primera columna los checkboxes:
     * En `thead`: Checkbox maestro con soporte para estados checked / indeterminate.
     * En cada `tr`: Checkbox individual para seleccionar/deseleccionar el producto.
   - Simplificar la columna "Acciones" de cada fila:
     * Eliminar la fila de botones múltiples (`Desactivar`, `Eliminar`, etc.).
     * Conservar únicamente el botón principal `Editar` (y el acceso directo `+ Receta` solo si el producto no tiene fórmula).

3. En el estado y lógica (`useProductsData.js` o hook consumidor):
   - Gestionar el set de IDs seleccionados (`selectedIds`, `handleToggleSelect`, `handleSelectAll`, `clearSelection`).
   - Conectar las funciones de cambio de estado masivo y borrado masivo seguro.

4. Restricciones Técnicas:
   - Cumplir Circuit Breaker (< 135 líneas por archivo en frontend).
   - Estilos exclusivos con CSS Modules (cero `style={{}}`).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/products/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
- `apps/web/src/app/catalog/products/components/product-bulk-action-bar.module.css`

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/page.jsx` (o vista principal de productos)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductBulkActionBar.jsx`
2. `node --check apps/web/src/app/catalog/products/components/ProductsTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Checkbox funcional por fila y selector maestro en cabecera.
- Barra superior de acciones masivas con íconos visible cuando hay selección activa.
- Filas de la tabla simplificadas y limpias.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Componentes de barra de acciones masivas integrados:
- Resultado de verify-srp.js:
- Estado: