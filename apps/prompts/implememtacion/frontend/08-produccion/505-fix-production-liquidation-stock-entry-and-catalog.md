TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Corregir la liquidación en `production.repository.js` para que al finalizar un lote en Unidades cree/actualice con `upsert` el registro en `InventarioProducto` (usando el campo real `cantidadActual`) y genere el lote disponible en Cava.
2) Garantizar que el producto envasado ('YOGURT PURO') mantenga consistencia con su presentación y categoría comercial ('LACTEOS') para que ingrese a 'Cava Comercial' y al Catálogo de Ventas con sus existencias reales:

CLÁUSULA DE CONSUMO MÍNIMO Y RESPETO DE CONTRATOS (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.
- PROHIBIDO usar campos inexistentes en Prisma (`costoEstandar`, `stockActual`, `volumenOzMl`). Utilizar exclusivamente las columnas canónicas (`cantidadActual`, `costoPromedio`, `cantidadDisponible`, `cantidadOz`, `cantidadMl`).

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/api/src/products/products.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Liquidación y Entrada a Stock en `production.repository.js`:
   - Al procesar la transacción de liquidación de orden (`liquidarOrdenProduccion` o equivalente):
     * Identificar el `targetProductoId` asociado a la orden (directo o mediante la receta).
     * Crear el lote terminado con sus existencias y trazabilidad:
       ```javascript
       await tx.lote.create({
         data: {
           codigoLote: orden.codigoLote || `LOT-${Date.now()}`,
           productoId: targetProductoId,
           tipoLote: 'PRODUCTO_TERMINADO',
           cantidadInicial: Number(datos.cantidadObtenida),
           cantidadDisponible: Number(datos.cantidadObtenida),
           costoUnitario: Number(datos.costoUnitarioReal || 0),
           fechaVencimiento: new Date(datos.fechaVencimiento),
           activo: true
         }
       });
       ```
     * Actualizar o crear la consolidación en `InventarioProducto` usando `cantidadActual` (nombre canónico de Prisma):
       ```javascript
       await tx.inventarioProducto.upsert({
         where: { productoId: targetProductoId },
         update: {
           cantidadActual: { increment: Number(datos.cantidadObtenida) },
           costoPromedio: Number(datos.costoUnitarioReal || 0),
           fechaActualizacion: new Date()
         },
         create: {
           productoId: targetProductoId,
           cantidadActual: Number(datos.cantidadObtenida),
           costoPromedio: Number(datos.costoUnitarioReal || 0),
           fechaActualizacion: new Date()
         }
       });
       ```

2. Exposición Limpia en Catálogo y Cava (`products.repository.js`):
   - Al listar productos comerciales para venta o en `findFinishedProducts`:
     * Asegurar que el mapeo de retorno exponga el alias compatible `stock: inv.cantidadActual` y `stockCava: inv.cantidadActual` para que el frontend (`SaleCavaCatalogDrawer` y Cava Comercial) lea el número directamente sin generar `undefined`.
     * Conservar estrictamente los `include` existentes de `presentacion` para no desestabilizar la visualización de envases (16 oz / 500 ml).
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/api/src/products/products.repository.js`
3. `pnpm --filter api build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al liquidar la orden de Yogurt Puro por 6 unidades, la tabla `InventarioProducto` incrementa `cantidadActual`.
- En la pestaña 'Cava Comercial' de inventario y en el drawer de selección de Ventas, el producto muestra sus existencias reales listas para despacho.
- No se introducen errores de Prisma por nombres de campos inválidos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
