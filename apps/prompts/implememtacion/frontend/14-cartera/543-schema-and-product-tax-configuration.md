TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 4 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Implementar la evolución del esquema Prisma y la configuración tributaria en el catálogo de productos según lo documentado en `docs/audits/AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md`.

ARCHIVOS A INTERVENIR:
1. `apps/api/prisma/schema.prisma`
2. `apps/api/src/products/products.service.js` (o repository)
3. `apps/web/src/app/catalog/products/components/ProductFormModal.jsx` (o modal de crear/editar producto)
4. `apps/web/src/app/catalog/products/hooks/useProductForm.js` (o hook de formulario correspondiente)

INSTRUCCIONES TÉCNICAS:

1. Base de Datos (`schema.prisma`):
   - Modelo `Producto`:
     * Agregar `tipoImpuesto String @default("GRAVADO") @map("Tipo_Impuesto")` ("GRAVADO", "EXENTO", "EXCLUIDO").
     * Agregar `tarifaIva Decimal @default(19.00) @map("Tarifa_Iva") @db.Decimal(5, 2)`.
     * Agregar `precioIncluyeIva Boolean @default(true) @map("Precio_Incluye_Iva")`.
   - Modelo `Venta`:
     * Agregar `aplicaIva Boolean @default(false) @map("Aplica_Iva")`.
     * Agregar `subtotal Decimal @default(0) @map("Subtotal") @db.Decimal(12, 2)`.
     * Agregar `descuentoTotal Decimal @default(0) @map("Descuento_Total") @db.Decimal(12, 2)`.
     * Agregar `baseImponible Decimal @default(0) @map("Base_Imponible") @db.Decimal(12, 2)`.
     * Agregar `ivaTotal Decimal @default(0) @map("Iva_Total") @db.Decimal(12, 2)`.
   - Modelo `DetalleVenta`:
     * Agregar `tarifaIva Decimal @default(0) @map("Tarifa_Iva") @db.Decimal(5, 2)`.
     * Agregar `baseGravable Decimal @default(0) @map("Base_Gravable") @db.Decimal(12, 2)`.
     * Agregar `montoIva Decimal @default(0) @map("Monto_Iva") @db.Decimal(12, 2)`.
   - Ejecutar `pnpm prisma generate` (o script equivalente) para actualizar el cliente Prisma.

2. Backend de Productos (`apps/api/src/products/`):
   - Asegurar que `create` y `update` reciban y persistan `tipoImpuesto`, `tarifaIva` y `precioIncluyeIva`.
   - Si `tipoImpuesto === 'EXCLUIDO'` o `'EXENTO'`, forzar `tarifaIva = 0`.

3. Frontend de Productos (`apps/web/src/app/catalog/products/`):
   - En el formulario de creación y edición de producto:
     * Agregar selector de `Tipo de Impuesto` (`GRAVADO (19%)`, `EXENTO (0%)`, `EXCLUIDO (0%)`).
     * Mostrar input numérico de `Tarifa IVA (%)` editable si es `GRAVADO`.
     * Checkbox o switch: `¿Precio de Venta incluye IVA?`.
   - Mantener el límite SRP (< 130 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.service.js`
2. `pnpm --filter api build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Prisma compila con los nuevos campos sin romper registros previos.
- El catálogo de productos permite definir el tratamiento fiscal de cada referencia.
- Cero infracciones de SRP y código de salida 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.