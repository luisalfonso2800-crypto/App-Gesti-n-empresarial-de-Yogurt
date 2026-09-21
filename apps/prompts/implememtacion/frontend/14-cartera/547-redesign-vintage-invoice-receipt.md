TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES):
Rediseñar por completo la factura/comprobante de venta en `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx` y su módulo CSS con un acabado artesanal/vintage de alta gama (identidad MANNÁ), incorporando el soporte explícito para descuentos comerciales y productos de obsequio/cortesía ($0).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/sales/components/SaleInvoicePrintModal.jsx`
2. `apps/web/src/app/commercial/sales/components/sale-invoice-print-modal.module.css`
3. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (si requiere asegurar el soporte de descuento/obsequio en el payload)

ESPECIFICACIONES DE LIQUIDACIÓN (DESCUENTOS Y OBSEQUIOS):

1. Tratamiento de Obsequios / Muestras ($0):
   - Si un ítem en la venta tiene `precioUnitario === 0` o `descuento === (precio * cant)`:
     * En la columna de precio y total de la línea no mostrar $0 plano, sino un badge o texto tipográfico vintage: `CORTESÍA / OBSEQUIO`.
     * No suma a la base gravable ni genera cobro al cliente, pero conserva su descuento físico de Cava.
2. Tratamiento de Descuentos:
   - Si la línea tiene descuento aplicado (`descuento > 0`):
     * Mostrar en pequeño el descuento aplicado debajo del precio unitario (`- $ X.XXX desc.`).
     * Reflejar en el bloque de liquidación la línea `Descuentos Comerciales: - $ X.XXX`.

ESPECIFICACIONES DE DISEÑO ARTESANAL / VINTAGE MANNÁ:

1. Contenedor de Papel Recibo:
   - Fondo pergamino texturizado/suave (`background: #FAF8F5`), borde perimetral doble o fino en color bronce cálido (`border: 1px solid #E8DFD1`), con padding amplio y ancho de recibo contenido (~440px - 480px).
2. Cabecera Editorial:
   - Título central **MANNÁ** en serifa clásica (`letter-spacing: 0.15em; color: #182622; font-weight: 700; font-size: 1.5rem`).
   - Lema: *Semilla · Tiempo · Fruto* en cursiva tierra/oliva (`#7D6E5D`, `text-xs`).
   - Divisor clásico doble (`border-bottom: 3px double #D9CBB7`).
   - Metadatos en dos columnas: N° Comprobante, Fecha/Hora, Cliente, Canal y Condición de Pago.
3. Tabla de Productos Detallada:
   - Encabezados en mayúsculas diminutas y fondo cálido neutro (`#F2EBE0`).
   - Columnas tabulares alineadas: `Descripción` (izquierda), `Cant.` (centro), `P. Unit.` (derecha), `Total` (derecha y en negrita).
   - Separadores de fila punteados (`border-b border-dashed border-[#E3D8C8]`).
4. Bloque de Totales y Liquidación:
   - `Subtotal Bruto:` $ XX.XXX
   - Si hubo rebajas: `Descuentos:` - $ XX.XXX (en tono canela/óxido)
   - `Base Gravable:` $ XX.XXX
   - `IVA Liquidado:` $ XX.XXX
   - `TOTAL FACTURA:` Destacado en tamaño mayor con marco doble superior e inferior (`text-lg font-bold text-[#182622]`).
   - Si fue a Crédito: caja distinguida con *Abono Inicial*, *Saldo Pendiente* y *Fecha Límite*.
5. Pie de Factura e Impresión:
   - Frase artesanal centrada: *"Elaborado con tradición y pureza láctea."*
   - Botón `Cerrar` y botón primario `Imprimir Comprobante` (verde bosque institucional con icono).
   - Regla `@media print`: ocultar barra de botones y overlays del navegador para imprimir únicamente el recibo en papel limpio.
6. Restricciones:
   - SRP estricto (< 130 líneas en el componente JSX).
   - Estilos mediante CSS Modules en camelCase (sin inline styles).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La factura luce como un comprobante artesanal elegante y tipográficamente balanceado.
- Los obsequios ($0) se identifican con la distinción de cortesía sin descuadrar totales.
- Los descuentos se discriminan antes del cálculo del IVA y del total final.
- Verificación SRP y build sin errores (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.