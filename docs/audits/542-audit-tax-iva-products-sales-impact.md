TAREA DE AUDITORÍA ARQUITECTURAL Y TRIBUTARIA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 TOOL CALLS DE SOLO LECTURA):
Auditar el impacto técnico y contable de incorporar la configuración tributaria de IVA en el catálogo de Productos y la liquidación flexible (con/sin IVA) en el módulo de Ventas y Facturación, evaluando sus repercusiones en Recetas, Inventario, Lotes y Cartera.

PROHIBICIÓN ESTRICTA:
- CERO modificaciones o escrituras en código fuente (no editar `.jsx`, `.js` ni `.prisma`).
- Solo se permite escribir el reporte consolidado en `docs/audits/`.

RUTAS EXACTAS A INSPECCIONAR (SOLO LECTURA):
1. `docs/audits/AUDIT-CARTERA-VENTAS-PAGOS.md` (Repasar el flujo contable actual de Ventas y Pagos).
2. `apps/api/prisma/schema.prisma` (Revisar modelos `Producto`, `Presentacion`, `Venta`, `DetalleVenta`, `InventarioProducto` y `Insumo`).
3. `apps/api/src/products/` (Revisar cómo se crea/edita un producto y qué campos numéricos y de precio maneja).
4. `apps/api/src/sales/sales.repository.js` (Revisar cómo se liquidan `totalVenta`, `subtotal`, y los detalles en `DetalleVenta`).
5. `apps/web/src/app/commercial/sales/` (Revisar el formulario y modal actual de "Nueva Venta" y cálculo de totales).

OBJETIVOS DE LA INVESTIGACIÓN:
1. **Impacto en Modelo Producto:**
   - ¿Qué campos existen hoy en `Producto` para precio (`precioVenta`, margen, costos)?
   - ¿Cómo incorporar `tarifaIva` (Decimal / Float) y `tipoImpuesto` ('EXENTO', 'EXCLUIDO', 'GRAVADO') sin romper los productos ya creados?
2. **Impacto en Venta y Facturación (Frontend & Backend):**
   - ¿Cómo permitir la opción de *"Venta con IVA / Factura con IVA"* (switch o checkbox) para negocios pequeños o clientes no gravados?
   - ¿Cómo estructurar `DetalleVenta` (`precioUnitario`, `cantidad`, `descuento`, `tarifaIva`, `montoIva`, `subtotalLinea`) y `Venta` (`subtotal`, `descuentos`, `ivaTotal`, `totalVenta`)?
3. **Afectación en Recetas y Producción (BOM):**
   - Confirmar si el costo del producto terminado en recetas/producción se ve afectado por el IVA de venta (Confirmar que el costeo de producción siempre opere sobre base neta).
4. **Afectación en Inventario y Lotes:**
   - Verificar si `InventarioProducto` y `Lote.costoUnitario` manejan costos operativos netos, independientes del IVA comercial.
5. **Afectación en Cartera y Recaudos:**
   - Garantizar que el `Venta.totalVenta` persista el valor final liquidado de la factura (con o sin IVA según se haya emitido), manteniendo la consistencia con `saldoPendiente` y los abonos de cartera implementados en el prompt 539.

SALIDA REQUERIDA:
Generar un informe consolidado y conciso en:
`docs/audits/AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md`

El reporte debe detallar:
- Diagnóstico del esquema actual vs requerimiento fiscal colombiano.
- Propuesta de campos en Prisma (`Producto`, `Venta`, `DetalleVenta`).
- Diagrama de flujo de liquidación en "Nueva Venta" (Subtotal → Descuento → Base Imponible → IVA condicional → Total Factura).
- Plan de implementación ordenado para no desestabilizar la aplicación.

DETENCIÓN:
Al guardar el documento en `docs/audits/`, DETENTE inmediatamente.