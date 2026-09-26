TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Hacer que al presionar el botón de agregar/precio en el catálogo lateral de Cava, si el producto ya está en la lista de despacho, se incremente su cantidad acumulada sin duplicar filas y respetando el stock disponible:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el manejador de adición de productos en `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (o en `SaleProductsDispatchSection.jsx` donde resida `handleAddProduct` / `onAddProduct`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (o `SaleProductsDispatchSection.jsx`)

INSTRUCCIONES TÉCNICAS:

1. Manejo Acumulativo de Ítems (`handleAddProduct(producto, cantidadAgregar = 1)`):
   - Al recibir el producto a despachar:
     ```javascript
     setOrderItems((prevItems) => {
       const existingIndex = prevItems.findIndex((item) => (item.id || item.productoId) === (producto.id || producto.productoId));
       const stockMaximo = Number(producto.stockCava || producto.stockActual || 9999);
       const cantSumar = Number(cantidadAgregar) || 1;

       if (existingIndex !== -1) {
         // El producto ya está en la orden: acumular
         return prevItems.map((item, idx) => {
           if (idx !== existingIndex) return item;

           const nuevaCantidad = Math.min(item.cantidad + cantSumar, stockMaximo);
           const aplicaMayorista = producto.precioMayorista > 0 &&
             nuevaCantidad >= (producto.cantidadMinimaMayorista || 12);
           const precioUnit = aplicaMayorista ? Number(producto.precioMayorista) : Number(producto.precioVenta);

           return {
             ...item,
             cantidad: nuevaCantidad,
             precioUnitario: precioUnit,
             subtotal: nuevaCantidad * precioUnit,
             esMayorista: aplicaMayorista
           };
         });
       }

       // Nuevo producto en la orden
       const cantInicial = Math.min(cantSumar, stockMaximo);
       const aplicaMayorista = producto.precioMayorista > 0 &&
         cantInicial >= (producto.cantidadMinimaMayorista || 12);
       const precioUnit = aplicaMayorista ? Number(producto.precioMayorista) : Number(producto.precioVenta);

       return [
         ...prevItems,
         {
           ...producto,
           cantidad: cantInicial,
           precioUnitario: precioUnit,
           subtotal: cantInicial * precioUnit,
           esMayorista: aplicaMayorista
         }
       ];
     });
     ```

2. Integración en el Botón del Drawer (`SaleCavaCatalogDrawer.jsx` o Card):
   - El botón principal de precio (`+ $ 12.000`) o acción de añadir debe enviar la cantidad seleccionada en el contador (`quantity`) y restablecer el contador a `1` tras añadir para que cada clic posterior continúe sumando limpiamente.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al hacer clic en el botón de precio de un producto que ya figura en la tabla, la fila no se duplica: el contador pasa de 1 a 2 (o suma la cantidad indicada).
- Si alcanza las 12 unidades requeridas, el precio cambia en tiempo real a la tarifa B2B ($10.800).
- La cantidad acumulada nunca sobrepasa las 25 unidades disponibles en Cava.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
