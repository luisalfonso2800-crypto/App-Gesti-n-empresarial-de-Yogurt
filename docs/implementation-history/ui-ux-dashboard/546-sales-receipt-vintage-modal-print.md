TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Integrar el despliegue automático del comprobante de factura/venta con diseño vintage artesanal (Design System MANNÁ) inmediatamente después de pulsar "Despachar y Facturar", permitiendo su visualización e impresión directa sin perder trazabilidad.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (Captura de respuesta y estado de venta recién creada)
2. `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx` (CREAR - Modal del comprobante vintage de venta)
3. `apps/web/src/app/commercial/sales/page.jsx` (Montaje y apertura reactiva del modal de comprobante)

INSTRUCCIONES TÉCNICAS:

1. Modificar Hook de Venta (`useSaleForm.js`):
   - Al recibir la respuesta exitosa del backend (`result.data` o venta creada):
     * Guardar la venta recién creada con sus detalles en un estado: `createdSale`.
     * Cerrar el modal de formulario de venta y disparar la apertura de `SaleInvoicePrintModal`.

2. Crear Comprobante Vintage (`SaleInvoicePrintModal.jsx` < 120 líneas):
   - Utilizar el modal base del sistema con contenedor temático:
     * Fondo pergamino texturizado/suave (`#FAF8F5`), bordes suaves color ámbar/dorado (`#D9C3A5`), y tipografía serif elegante para títulos.
   - Estructura del comprobante:
     * Cabecera: *"MANNÁ"* con subtítulo *"Semilla · Tiempo · Fruto"*, Comprobante de Venta N°, Fecha y datos del cliente.
     * Tabla de ítems con líneas sutiles: Producto, Cant., Precio U., Total.
     * Bloque de Totales: Subtotal, IVA (si `venta.aplicaIva`), Total Factura.
     * Si `tipoPago === 'CREDITO'`: mostrar recuadro con *Abono Inicial*, *Saldo Pendiente* y *Fecha Límite*.
     * Pie con mensaje de cortesía: *"Elaborado con tradición y pureza láctea."*
   - Botones de acción:
     * `[ Cerrar ]`
     * `[ Imprimir Comprobante ]` que ejecute `window.print()` con clases `@media print` para imprimir únicamente el recibo en escala limpia.

3. Integración en `sales/page.jsx`:
   - Conectar el estado `createdSale` y renderizar `SaleInvoicePrintModal` de forma no invasiva.
   - Respetar el límite de líneas SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- Al despachar una venta, se abre automáticamente el recibo con diseño vintage MANNÁ.
- Muestra los valores exactos despachados, discriminando IVA y condiciones de crédito.
- El botón de imprimir genera una vista limpia sin elementos de navegación del ERP.
- Verificación SRP y build sin errores (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.