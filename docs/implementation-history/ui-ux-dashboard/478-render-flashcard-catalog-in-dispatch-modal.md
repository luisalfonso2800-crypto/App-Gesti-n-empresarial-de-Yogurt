TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer visible y funcional el catálogo de productos estilo flash-cards con imágenes, ficha rápida y stock de cava dentro del modal "Nueva Venta (Despacho desde Cava)":

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (asegurar carga de productos con stock en Cava)
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`

INSTRUCCIONES TÉCNICAS:

1. Proveer Productos en el Hook (`useSaleForm.js`):
   - Asegurar que la consulta de productos para la venta obtenga los productos comerciales activos y su stock actual en Cava (`/api/inventory/cava` o `/api/products?comercial=true`):
     * Cada ítem debe contener: `id`, `nombre`, `presentacion`, `fotoComercialUrl`, `precioVenta`, `precioMayorista`, `cantidadMinimaMayorista`, `stockCava` (o `stockActual`).
     * Exponer este arreglo como `cavaProducts` o `productosDisponibles`.

2. Renderizado Visual en Flash-Cards (`SaleProductsDispatchSection.jsx`):
   - Ubicar la cuadrícula de flash-cards directamente arriba de la tabla de resumen:
     * Contenedor con scroll horizontal o grid (`grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto mb-3 p-2 bg-slate-50 rounded-xl border border-slate-200`).
     * Cada Flash-Card debe mostrar:
       - Miniatura / Foto comercial (`fotoComercialUrl` o tarro Manna por defecto).
       - Nombre del producto y presentación (ej. `CONTENEDOR DE 16 OZ`).
       - Badge de existencias: `<span className="badge">Stock: {stock} {und}</span>`.
       - Precio unitario (`$ 12.000`) y si tiene escala mayorista: `<span className="text-[10px] text-emerald-700">Mayorista: ${precioMayorista} (min {cantMin})</span>`.
       - Al hacer clic sobre la tarjeta: se marca como seleccionada y se activa el selector inferior.
   - Selector interactivo inferior (`SaleSelectedProductBar` o controles directos):
     * Selector de cantidad con botones `[-]` `[input numérico]` `[+]`.
     * Botón: `+ Agregar al Despacho`.
     * Poka-Yoke: No permitir despachar más unidades de las disponibles en `stockCava`.
   - Cuando se agregue el producto, se inserta en la tabla inferior `Productos a Despachar` calculando subtotales y precio mayorista automático si la cantidad >= `cantidadMinimaMayorista`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/hooks/useSaleForm.js`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir "Nueva Venta", se visualizan de inmediato las tarjetas con foto y stock de los productos disponibles.
- Se puede seleccionar un producto, definir cantidad con los botones +/- y agregarlo a la tabla de despacho.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.