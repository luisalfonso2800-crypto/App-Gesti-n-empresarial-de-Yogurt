TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 ARCHIVOS - CERO BUCLES DE LECTURA):
Actualizar el comprobante de factura de Cartera (Pagos y Cobros) en `apps/web/src/app/commercial/payments/components/InvoiceDetailModal.jsx` para homologarlo con la plantilla editorial vintage oficial (idéntica a la referencia gráfica de Ventas), consumiendo dinámicamente la configuración corporativa de la empresa.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/payments/components/InvoiceDetailModal.jsx`
2. `apps/web/src/app/commercial/payments/components/invoice-detail-modal.module.css` (o reutilizar los componentes/estilos editoriales compartidos)

INSTRUCCIONES TÉCNICAS:

1. Homologación Visual Editorial:
   - Reemplazar el layout simple actual por la estructura editorial completa:
     * Cabecera triple: Marca **MANNÀ**, lema *Semilla · Tiempo · Fruto*, cita central *"Sabor que nace de lo natural. Tradición que mira al futuro."*, y caja formal `COMPROBANTE DE VENTA` con N° de Factura, fecha de emisión y sello tipográfico *"ALIMENTOS QUE TRANSFORMAN"*.
     * Doble columna: Datos del Cliente (Cliente, Identificación, Teléfono, Correo) y Datos de la Venta (Fecha, Canal, Modalidad, Vencimiento, Estado).
     * Tabla de Productos con tipografía formal, líneas finas y alineación tabular: `#`, `Producto`, `Cant.`, `Precio unitario`, `Descuento`, `IVA`, `Total`. (Soporte para badge `CORTESÍA / OBSEQUIO` si precio es 0).
     * Sección inferior dividida: Observaciones con mensaje artesanal a la izquierda; y a la derecha el Resumen Financiero desglosado (Subtotal, Descuentos, Base gravable, IVA, Total Factura, y el recuadro destacado de Abonos / Saldo Pendiente).
     * Footer corporativo formal: Nombre de la empresa, Razón Social, Holding (`GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.`), NIT, Ciudad, contacto, redes y código QR.

2. Consumo de Configuración Dinámica:
   - Inyectar los datos provenientes de `useInvoiceConfig` o de la API de configuración de empresa para evitar textos hardcodeados.

3. Impresión (@media print):
   - Asegurar que al pulsar `Imprimir Comprobante` se imprima únicamente el cuerpo del comprobante en fondo limpio sin botones ni fondo oscuro de la interfaz.

4. Restricción SRP:
   - Mantener el componente modularizado (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- Al dar clic en "Ver / Imprimir" desde la tabla de Cartera y Recaudos, la factura se muestra con el mismo diseño editorial de alta gama.
- Refleja el total original, lo abonado y el saldo pendiente exacto de la cuenta por cobrar.
- Código 0 en SRP y compilación limpia.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.