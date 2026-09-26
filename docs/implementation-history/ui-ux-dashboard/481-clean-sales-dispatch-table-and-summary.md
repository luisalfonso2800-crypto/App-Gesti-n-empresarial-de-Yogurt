TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la alineación de columnas de la tabla de productos a despachar (evitando solapamiento de Cantidad, Precio y Subtotal) y modernizar la tarjeta de resumen financiero:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx` (o `SaleProductsDispatchSection.jsx` donde resida la tabla y balance) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx` (o componente correspondiente)

INSTRUCCIONES TÉCNICAS:

1. Estructura de la Tabla de Productos:
   - Usar `<table>` semántico con anchos definidos o grid flexbox ordenado:
     * Columna Producto (`w-auto flex-1 min-w-[180px]`): Nombre del producto en negrita y presentación en gris claro.
     * Columna Cantidad (`w-28 text-center`): Selector compacto `[-] [cant] [+]` para ajustar cantidades directamente en la tabla.
     * Columna Precio Unitario (`w-24 text-right font-mono`): Formateado `$ {precio}`.
     * Columna Subtotal (`w-28 text-right font-mono font-semibold`): Formateado `$ {subtotal}`.
     * Columna Acción (`w-10 text-center`): Botón discreto para eliminar fila con hover rojizo.
   - Separar limpiamente los encabezados `<th>` con alineaciones correspondientes a sus columnas (`text-left`, `text-center`, `text-right`).

2. Rediseño del Balance / Resumen Financiero:
   - Reemplazar la caja punteada monoespaciada por una tarjeta moderna y limpia MANNÁ:
     * Contenedor con fondo suave (`bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 mt-4`).
     * Cabecera sutil: `Resumen de Liquidación` con icono de factura o tarjeta.
     * Filas alineadas con `flex justify-between text-xs text-slate-600`:
       - `Subtotal (${totalItems} ítems)` -> `$ {subtotalVenta}`
       - Si aplica descuento mayorista: `Ahorro Mayorista Aplicado` -> `-$ {descuentoTotal}` (en verde esmeralda).
     * Divisor tenue (`border-t border-slate-200 my-2`).
     * Fila Total destacado:
       - `Total a Despachar / Cobrar` -> `<span className="text-base font-bold text-slate-900 font-mono">$ {totalFinal}</span>`
     * Badge discreto inferior para el margen:
       `<span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">✦ Margen Bruto Proyectado: $ {margenBruto}</span>`

3. Respetar el límite de líneas SRP (< 135 líneas). Utilizar estilos modulares o Tailwind limpios.

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/modal-parts/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Las columnas de Producto, Cantidad, Precio Unitario y Subtotal no se sobreponen y quedan perfectamente alineadas.
- La caja de balance tiene un acabado moderno integrado al diseño del ERP MANNÁ.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.