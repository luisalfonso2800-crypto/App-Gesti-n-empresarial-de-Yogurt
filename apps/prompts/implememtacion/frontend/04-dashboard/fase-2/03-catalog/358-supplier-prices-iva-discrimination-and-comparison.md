TAREA CONTROLADA — DISCRIMINACIÓN DE IVA Y COMPARACIÓN ESTANDARIZADA EN PRECIOS DE PROVEEDORES

OBJETIVO TÉCNICO:
1. Incorporar en el esquema `PrecioProveedor` y en el modal `SupplierPriceModal` el soporte de IVA (tieneIva, porcentajeIva, precioIncluyeIva y desglose base/impuesto).
2. Adaptar la tabla `PricesComparisonTable` y la tarjeta de resumen para mostrar si la cotización incluye IVA o es exenta.
3. Estandarizar la fórmula del badge "★ Más Económico" para que compare los costos reales de manera homologada.

FUENTES DE VERDAD:
- apps/api/prisma/schema.prisma
- apps/api/src/supplier-prices/ (servicio y repositorio)
- apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
- apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
- apps/web/src/app/catalog/supplier-prices/components/SummaryCard.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas ciegas (`Find`, `Search`).
- Leer únicamente los archivos indicados de `supplier-prices`.
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules.
- Respetar SRP estricto (< 145 líneas por archivo; desacoplar en `modal-parts/` si es necesario).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. BASE DE DATOS Y BACKEND:
   - En `apps/api/prisma/schema.prisma` (modelo `PrecioProveedor`):
     * Agregar `tieneIva Boolean @default(true) @map("Tiene_Iva")`
     * Agregar `porcentajeIva Decimal @default(19.0) @map("Porcentaje_Iva") @db.Decimal(5, 2)`
     * Agregar `precioIncluyeIva Boolean @default(true) @map("Precio_Incluye_Iva")`
     * Agregar `costoBaseSinIva Decimal @default(0) @map("Costo_Base_Sin_Iva") @db.Decimal(12, 4)`
   - Ejecutar:
     * `pnpm --filter api exec prisma db push`
     * `pnpm --filter api exec prisma generate`
   - En `supplier-prices.repository.js` y servicio:
     * Calcular `costoBaseSinIva` y `costoUnidadBase` (con IVA) según los flags `tieneIva` y `precioIncluyeIva`.
     * Retornar los campos fiscales en `findAll` y `findOne`.

2. MODAL DE PRECIO DE PROVEEDOR (`SupplierPriceModal.jsx` y submódulos):
   - Agregar bloque de configuración de IVA:
     * Checkbox `[✓] Aplica IVA` (por defecto `true`).
     * Tasa porcentual editable (por defecto `19%`).
     * Selector: `[Precio incluye IVA / IVA adicional]`.
   - Mostrar previsualización reactiva de 3 líneas:
     * `Subtotal Base (Sin IVA): $XX.XXX`
     * `Monto IVA: $YY.YYY`
     * `Costo por Unidad Base Final: $ZZZ / [unidadBase]`

3. COMPARADOR Y TABLA DE TARIFAS (`PricesComparisonTable.jsx` y `SummaryCard.jsx`):
   - En cada fila de la tabla:
     * Visualizar badge fiscal: si tiene IVA mostrar pill neutro `IVA 19%` o `Exento`.
     * Mostrar en columnas separadas o apiladas: `Precio Empaque`, `Base s/IVA` y `Costo Final / Und Base`.
   - Lógica de "★ Más Económico":
     * Evaluar la tarifa mínima comparando el costo efectivo final (`costoUnidadBase`) para que una tarifa sin IVA no aparente falsamente ser más barata.
   - Al presionar "Comprar", transferir los metadatos de IVA (`tieneIva`, `porcentajeIva`, `precioIncluyeIva`) a la orden o carrito de compras.

4. VERIFICACIONES DE CALIDAD:
   - `node .agents/scripts/verify-srp.js`
   - `pnpm --filter api build`
   - `pnpm --filter web build`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Base de datos sincronizada con campos de IVA en cotizaciones.
- Modal y tabla reflejan con exactitud los insumos gravados vs exentos.
- El cálculo del más económico es transparente y fiscalmente exacto.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Campos incorporados a PrecioProveedor:
- Comparación estandarizada en: PricesComparisonTable.jsx
- Resultado verify-srp.js y builds: