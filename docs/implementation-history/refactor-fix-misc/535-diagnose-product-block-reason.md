TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL DE CONSULTA - CERO EDICIONES):
Identificar exactamente qué relación en la base de datos está bloqueando el borrado del producto "Yogur Tradicional Melocotón 1L" en `apps/api/src/products/products.service.js`.

INSTRUCCIÓN:
1. Inspeccionar la función `remove(id)` en `apps/api/src/products/products.service.js` (o repository) para revisar qué tablas consulta en su validación de dependencias.
2. Ejecutar un script rápido de un solo paso o consulta Prisma para el producto con nombre "Yogur Tradicional Melocotón 1L" que imprima el recuento exacto de cada relación:
   - recetasCount
   - ordenesCount
   - lotesCount
   - inventarioProductoCount (Cava)
   - detallesVentaCount
   - presentaciones/preciosCount
3. Detenerse inmediatamente y emitir el desglose exacto:
   "El producto está bloqueado por: [Nombre de la tabla] con [X] registros."

DETENCIÓN:
Al imprimir la tabla causante del bloqueo, DETENTE de inmediato.