TAREA CONTROLADA — SOPORTE DE DISCRIMINACIÓN DE IVA EN COMPRAS (BACKEND Y SCHEMA)

OBJETIVO TÉCNICO:
Modificar el esquema de Prisma y el servicio de Compras (`purchases`) para almacenar y liquidar de forma oficial el IVA individual por insumo y los consolidados en la compra (Subtotal sin IVA, Total IVA, Flete y Total Neto Pagado).

FUENTES DE VERDAD:
- apps/api/prisma/schema.prisma
- apps/api/src/purchases/purchases.service.js (o módulo purchases)
- apps/api/src/purchases/purchases.repository.js
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales (`Find`, `Search`).
- Leer únicamente `schema.prisma` y los archivos de `purchases/`.
- No alterar TypeScript: mantener JavaScript nativo en backend (.js).
- Cumplir SRP (< 150 líneas en controladores y repositorios).

ACCIONES A EJECUTAR:
1. En `apps/api/prisma/schema.prisma`:
   - En el modelo `Compra` (o `Purchase`):
     * Agregar `totalSinIva Decimal @default(0) @map("Total_Sin_Iva")`
     * Agregar `totalIva Decimal @default(0) @map("Total_Iva")`
   - En el modelo `DetalleCompra` (o `Detalle_Compras` / `PurchaseItem`):
     * Agregar `tieneIva Boolean @default(true) @map("Tiene_Iva")`
     * Agregar `porcentajeIva Decimal @default(19.0) @map("Porcentaje_Iva")`
     * Agregar `precioIncluyeIva Boolean @default(true) @map("Precio_Incluye_Iva")`
     * Agregar `montoIva Decimal @default(0) @map("Monto_Iva")`
     * Agregar `subtotalSinIva Decimal @default(0) @map("Subtotal_Sin_Iva")`
   - Ejecutar en la terminal del monorepo:
     * `pnpm --filter api exec prisma db push`
     * `pnpm --filter api exec prisma generate`

2. En `apps/api/src/purchases/purchases.service.js` (y `simulate` si aplica):
   - Al procesar cada detalle en `createWithTransaction`:
     * Extraer `tieneIva` (default `true`), `porcentajeIva` (default `19.0`) y `precioIncluyeIva` (default `true`).
     * Si `!tieneIva`:
       - `porcentaje = 0`
       - `montoIva = 0`
       - `subtotalSinIva = precioUnitario * cantidad`
       - `subtotalConIva = subtotalSinIva`
     * Si `tieneIva && precioIncluyeIva`:
       - `subtotalConIva = precioUnitario * cantidad`
       - `subtotalSinIva = subtotalConIva / (1 + (porcentaje / 100))`
       - `montoIva = subtotalConIva - subtotalSinIva`
     * Si `tieneIva && !precioIncluyeIva`:
       - `subtotalSinIva = precioUnitario * cantidad`
       - `montoIva = subtotalSinIva * (porcentaje / 100)`
       - `subtotalConIva = subtotalSinIva + montoIva`
     * Persistir estos campos en cada detalle y acumular `totalSinIva` y `totalIva` en la cabecera de la compra.

3. En `GET /api/v1/purchases` (findAll / findOne):
   - Asegurar que la consulta retorne `totalSinIva`, `totalIva`, y en los detalles `tieneIva`, `porcentajeIva`, `montoIva`, `subtotalSinIva`.

4. Validaciones:
   - `pnpm --filter api build` o `node --check` en los servicios de purchases.

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Base de datos actualizada con las columnas de IVA.
- Transacción de compra persiste subtotales sin IVA y montos de IVA exactos.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Columnas agregadas a schema.prisma:
- Métodos adaptados en purchases:
- Resultado prisma generate y build: