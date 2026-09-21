TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Implementar la funcionalidad de eliminación segura de productos en catálogo, garantizando que el backend bloquee el borrado si el producto tiene historial o trazabilidad en recetas, producción, inventario o ventas.

ARCHIVOS A INTERVENIR:
1. `apps/api/src/products/products.service.js` (o repository correspondiente en API)
2. `apps/web/src/app/catalog/products/components/` (Componente de fila/acciones de la tabla de productos)
3. `apps/web/src/app/catalog/products/` (Hook o función de llamada a la API)

INSTRUCCIONES TÉCNICAS:

1. Backend (`apps/api/src/products/`):
   - Crear endpoint `DELETE /products/:id` (o método `remove(id)` en el servicio).
   - Validar dependencias antes de eliminar:
     * Contar registros asociados en: `Receta`, `OrdenProduccion`, `Lote`, `InventarioProducto` y `DetalleVenta`.
     * Si `recetasCount > 0` o `ordenesCount > 0` o `lotesCount > 0` o `ventasCount > 0`:
       Lanzar excepción `ConflictException` ('No se puede eliminar el producto porque cuenta con historial o trazabilidad activa (producción, recetas o ventas). Desactívelo en su lugar.').
     * Si no tiene dependencias: Ejecutar `prisma.producto.delete({ where: { id } })` y responder `{ success: true }`.

2. Frontend (`apps/web/src/app/catalog/products/`):
   - En la columna "Acciones" de cada fila (junto al botón "Editar"):
     * Agregar un botón "Eliminar" con estilo discreto / botón de basura (rojo sutil o icono trash).
   - Flujo de confirmación:
     * Al hacer clic, solicitar confirmación nativa o modal (`¿Estás seguro de eliminar este producto formulado?`).
     * Si el backend retorna éxito: Notificar con toast y refrescar la tabla de productos.
     * Si el backend retorna conflicto (código 409 o mensaje de error de trazabilidad): Capturar el mensaje y mostrar una alerta explicativa al usuario sin romper la UI.
   - Respetar límite de líneas SRP (< 130 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.service.js`
2. `pnpm --filter api build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- La tabla muestra la opción de eliminar producto.
- Un producto sin uso previo se elimina limpiamente.
- Un producto con lotes, ventas o receta previa es protegido por el backend mostrando la advertencia de trazabilidad.
- Cero errores en `verify:srp`.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.