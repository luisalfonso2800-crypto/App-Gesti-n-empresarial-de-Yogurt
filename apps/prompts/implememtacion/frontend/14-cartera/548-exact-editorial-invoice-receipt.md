TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Construir la plantilla exacta del Comprobante de Venta en `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx` y su módulo CSS replicando la maquetación editorial y artesanal de alta gama (identidad MANNÁ) provista en la referencia visual, incluyendo soporte para impresión limpia (@media print).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx`
2. `apps/web/src/app/commercial/sales/components/sale-invoice-print-modal.module.css` (o archivo CSS del componente)
3. `apps/web/src/app/commercial/sales/components/SaleInvoiceParts.jsx` (Subcomponente auxiliar para respetar SRP < 130 líneas)

ESPECIFICACIONES DE MAQUETACIÓN Y ESTRUCTURA (SEGÚN REFERENCIA):

1. Cabecera Editorial (3 Columnas):
   - Izquierda: Logotipo/Marca **MANNÀ**, lema *Semilla · Tiempo · Fruto*, y viñeta de rombo/hoja.
   - Centro: Texto en cursiva serif: *"Sabor que nace de lo natural. Tradición que mira al futuro."*
   - Derecha: Bloque enmarcado en recuadro sobrio:
     * Título en mayúsculas: `COMPROBANTE DE VENTA`
     * Recuadro N°: `N° [ID_VENTA / CONSECUTIVO]`
     * Fecha de Emisión (ej. `20 de septiembre de 2026`)
     * Sello tipográfico/artesanal: *"ALIMENTOS QUE TRANSFORMAN"*

2. Bloques de Datos a Doble Columna (Fondo suave #FDFCFA o Pergamino sutil con línea vertical divisoria):
   - Columna Izquierda — `DATOS DEL CLIENTE`:
     * Icono + `Cliente:` [Nombre del Cliente]
     * Icono + `Identificación:` [NIT / Cédula]
     * Icono + `Teléfono:` [Teléfono]
     * Icono + `Correo:` [Correo Electrónico]
   - Columna Derecha — `DATOS DE LA VENTA`:
     * Icono + `Fecha:` [Fecha]
     * Icono + `Canal:` [Canal]
     * Icono + `Modalidad:` [CONTADO / CRÉDITO]
     * Icono + `Forma de pago:` [EFECTIVO / TRANSFERENCIA]
     * Icono + `Estado:` [Badge neutral COMPLETADO / PENDIENTE]

3. Tabla de Productos (Líneas finas #D9CBB7 y bordes definidos):
   - Cabecera gris/pergamino neutra: `#` | `Producto` | `Cant.` | `Precio unitario` | `Descuento` | `IVA` | `Total`.
   - Filas con alineación: Producto a la izquierda, Cantidad centrada, importes a la derecha.
   - Si un ítem es obsequio (`precio === 0`): mostrar `CORTESÍA / OBSEQUIO`.

4. Sección Inferior: Observaciones y Resumen Financiero:
   - Izquierda:
     * Bloque `OBSERVACIONES`: Texto con notas de venta o mensaje por defecto.
     * Frase artesanal en cursiva: *"Gracias por ser parte de este propósito."*
   - Derecha — `RESUMEN FINANCIERO`:
     * Subtotal: `$ XX.XXX`
     * Descuentos: `$ XX.XXX`
     * Base gravable: `$ XX.XXX`
     * IVA (19%): `$ XX.XXX` (o 0 si venta no aplicó IVA)
     * Tarjeta destacada `TOTAL FACTURA`: `$ XX.XXX` (negrita sobre fondo cálido)
     * Si contado: `TOTAL PAGADO`: `$ XX.XXX`
     * Si crédito: Desglosar `ABONADO` y `SALDO PENDIENTE`.

5. Pie de Página Corporativo (Footer 3 Bloques):
   - Bloque 1: **MANNÀ** / *Alimentos Naturales S.A.S.*
     * Debajo incluir: `GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.`
     * NIT y Ciudad: Santa Marta / Barranquilla - Colombia
   - Bloque 2: Datos de contacto con iconos (Teléfono, Correo, Web, Red social).
   - Bloque 3: Código QR ilustrativo con texto *"Conoce más sobre nuestro propósito"*.
   - Frase final centrada inferior con espacio entre letras: `S A B O R   Q U E   N A C E   D E   L O   N A T U R A L`.

6. Impresión y Botones:
   - Botón `Cerrar` y botón `Imprimir Comprobante`.
   - Regla `@media print`: ocultar barra de botones, backdrop del modal y elementos de navegación para imprimir en hoja blanca/carta o tirilla con márgenes perfectos.
   - Modularizar subcomponentes para no exceder 130 líneas por archivo (SRP estricto).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- El modal y la salida de impresión coinciden fielmente con la composición gráfica de la imagen de referencia.
- Incluye la razón social del holding en el bloque de pie de página.
- Código 0 en compilación y guardián SRP.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.