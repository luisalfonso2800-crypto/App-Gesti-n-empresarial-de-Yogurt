TAREA:
Implementar la eliminación física segura de productos en backend y frontend, permitida exclusivamente si el registro no cuenta con trazabilidad operativa (sin recetas, lotes de producción, movimientos de inventario ni ventas).

OBJETIVO:
1. En Backend (`apps/api/src/products/`):
   - En el endpoint `DELETE /products/:id` (o método `remove` en `products.service.js`):
     * Auditar relaciones existentes antes de borrar:
       - Recetas técnicas vinculadas (como producto a fabricar o en etapas/BOM).
       - Lotes o bitácoras de producción (`ProductionBatch` / similar).
       - Registros de inventario o movimientos de almacén.
       - Líneas de venta o pedidos comerciales.
     * **Si tiene dependencias históricas:** Responder con error HTTP 409 Conflict o 400 Bad Request con mensaje descriptivo:
       `"No se puede eliminar el producto porque cuenta con historial operativo o recetas asociadas. En su lugar, desactívelo."`
     * **Si está completamente limpio:** Proceder con `prisma.producto.delete({ where: { id } })` y responder 200/204.

2. En Frontend (`apps/web/src/app/catalog/products/`):
   - En `ProductsTable.jsx`:
     * Incorporar la acción `Eliminar` (botón/ícono de papelera) visible preferentemente cuando el producto esté `Inactivo` o sin recetas vinculadas.
     * Al hacer clic, solicitar confirmación explícita mediante modal de advertencia (`ConfirmModal`).
     * Manejar la respuesta del backend: si el servidor rechaza por dependencias, mostrar un toast de alerta amigable explicando por qué no se puede borrar.
   - En el hook de datos (`useProductsData.js`):
     * Agregar la función `deleteProduct(id)` conectada al endpoint de API.

3. Restricciones Técnicas:
   - Cumplir SRP (< 135 líneas por archivo en frontend).
   - Cero estilos en línea (`style={{}}`), usar CSS Modules puro.
   - Prohibido realizar migraciones destructivas de base de datos.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/api/src/products/products.service.js`
- `apps/api/src/products/products.controller.js`
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/hooks/useProductsData.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

ALCANCE:

MODIFICAR:
- `apps/api/src/products/products.service.js`
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/hooks/useProductsData.js`

VERIFICACIÓN:
1. Probar eliminación de un producto sin historial (debe borrarse de la base de datos).
2. Probar intento de borrado de un producto con receta o lote (debe arrojar error controlado sin romper la app).
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Eliminación condicional validada en backend con retroalimentación visual en frontend.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Validaciones de integridad aplicadas en backend:
- Resultado de verify-srp.js:
- Estado: