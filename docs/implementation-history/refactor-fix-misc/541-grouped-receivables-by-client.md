TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES):
Reorganizar la vista de Cartera en `apps/web/src/app/commercial/payments/` para agrupar las deudas por Cliente (vista Master-Detail desplegable) y añadir el modal de inspección/reimpresión de factura, respetando el límite SRP (< 130 líneas por componente).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/payments/components/ReceivablesTable.jsx` (EDITAR)
2. `apps/web/src/app/commercial/payments/components/ReceivableClientRow.jsx` (CREAR - Subcomponente de fila agrupada)
3. `apps/web/src/app/commercial/payments/components/InvoiceDetailModal.jsx` (CREAR - Modal de detalle e impresión)

INSTRUCCIONES TÉCNICAS:

1. Agrupación por Cliente (`ReceivablesTable.jsx` y `ReceivableClientRow.jsx`):
   - En `ReceivablesTable`, tomar la lista plana que entrega el backend y agrupar por `idCliente`:
     * Calcular por cada cliente: `saldoTotalCliente`, `totalFacturadoCliente`, `totalAbonadoCliente`, `facturasList: []`.
   - Renderizar una fila maestra por cliente que muestre:
     * Nombre del cliente y documento.
     * Cantidad de cuentas/facturas activas.
     * Saldo General Consolidado (destacado en negrita/dorado).
     * Chevron/Icono de expansión interactivo (`useState(isExpanded)`).
   - Al expandir, desplegar la subtabla con las facturas individuales del cliente:
     * Columnas: `ID Venta`, `Fecha`, `Vencimiento`, `Total`, `Abonado`, `Saldo`, `Estado`, `Acciones`.
     * Acciones individuales:
       - Botón `Abonar` (dispara modal existente).
       - Botón `Saldar` (dispara modal existente).
       - Botón Icono `Ver / Imprimir` (ojo o impresora).

2. Modal de Detalle y Reimpresión (`InvoiceDetailModal.jsx` < 120 líneas):
   - Abre al hacer clic en `Ver / Imprimir` de una factura.
   - Consulta los detalles de la venta (o los toma si ya vienen incluidos en la tupla `detalles: [...]` del endpoint).
   - Renderiza un comprobante estilizado con la identidad MANNÁ:
     * Encabezado: Logo / Razón Social, Factura N°, Fecha, Cliente.
     * Tabla de ítems: Producto, Cantidad, Unidad, Precio Unitario, Subtotal.
     * Resumen financiero: Total Factura, Pagado / Abonos, Saldo Pendiente.
     * Botones: `Cerrar` e `Imprimir` (`window.print()` con soporte de estilos `@media print`).

3. Control SRP:
   - Dividir obligatoriamente la fila desplegable en `ReceivableClientRow.jsx` para no superar las 130 líneas en `ReceivablesTable.jsx`.

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La tabla de cartera se muestra agrupada por cliente con su saldo general visible.
- Al hacer clic en un cliente se despliegan sus facturas con saldos discriminados.
- Cada factura permite abonar, saldar y ver/reimprimir su desglose de productos.
- Compilación y verificación SRP en código 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.