TAREA CONTROLADA — AUDITORÍA FORENSE FULLSTACK: PRECIOS DE PROVEEDORES, CHECKLIST Y LISTAS DE COMPRA (PRE-TEST E2E)

OBJETIVO TÉCNICO:
Levantar el mapa forense de selectores, contratos de datos y endpoints antes de redactar los tests E2E para los 3 flujos interconectados:
1. Catálogo de Precios de Proveedores (`/catalog/supplier-prices`): Comparador, desglose de IVA (gravado vs exento), mejor precio y botón "Comprar" (añadir al carrito/storage).
2. Carrito y Transferencia (`sessionStorage` -> `selectedForPurchase`): Estructura del payload serializado (`cantidadEquivalenteBase`, insumos, proveedores e IVA).
3. Checklist de Adquisición en Campo y Órdenes (`/operations/purchases/new` y `/operations/purchases`):
   - Tarjetas de insumo con estados [✓ Conseguido] / [✕ No Conseguido].
   - Simulación matemática oficial (`POST /api/v1/purchases/simulate`).
   - Asiento final en inventario físico y consolidación multi-proveedor.

RESTRICCIONES ESTRICTAS ANTI-QUEMA DE CUOTA (NIVEL 1 — SOLO LECTURA):
- PROHIBIDO modificar o crear archivos de código (.jsx, .js, .prisma, .css) — 0 ediciones.
- PROHIBIDO ejecutar Playwright, builds, dev servers o migraciones.
- PROHIBIDO lanzar búsquedas globales abiertas (`grep -r`, `find .`, `Get-ChildItem -Recurse` sin filtro).
- LÍMITE DURO: Máximo 7 lecturas directas dirigidas. Escribir ÚNICAMENTE el informe final en Markdown.

FUENTES DE VERDAD A INSPECCIONAR (RUTAS EXACTAS):
1. UI Precios: `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` y `SupplierPriceModal.jsx`.
2. UI Checklist Compras: `apps/web/src/app/operations/purchases/new/components/` (o `page.jsx` si contiene el Checklist).
3. Backend Compras y Simulación: `apps/api/src/purchases/purchases.controller.js` (inspeccionar ruta `/simulate` y creación).
4. Backend Precios: `apps/api/src/supplier-prices/supplier-prices.controller.js` (o service).
5. Base de Datos: `apps/api/prisma/schema.prisma` (Modelos exactos: `PrecioProveedor`, `Compra`, `DetalleCompra`).
6. Helpers E2E existentes: `apps/web/e2e/helpers/` (revisar nombres de helpers disponibles para compras/catálogos).

ACCIONES OBLIGATORIAS DE AUDITORÍA:

1. MAPA DE SELECTORES REALES EN DOM:
   - Para `/catalog/supplier-prices`:
     * Selector del modal de cotización (`heading`, botón de apertura).
     * Selectores de IVA: Checkbox `Aplica IVA`, selector de modalidad fiscal (`precioIncluyeIva`).
     * Selectores de tabla: Botón "Comprar", botón "Editar Tarifa", badges de estado fiscal.
   - Para `/operations/purchases/new` (Checklist):
     * Selector de las tarjetas de checklist.
     * Botones gemelos: [✓ Conseguido] y [✕ No Conseguido].
     * Input de cantidad solicitada (min="1") y precio editable.
     * Botón de confirmación/transferencia final a bodega.

2. CONTRATO DE TRANSFERENCIA Y STORAGE:
   - Extraer la estructura exacta del JSON guardado en `sessionStorage.getItem('selectedForPurchase')`.
   - Verificar si usa `cantidadEquivalenteBase` o `contenidoBase` para calcular el factor de conversión.

3. CONTRATO DE API Y CÁLCULOS MATEMÁTICOS:
   - Endpoint `/purchases/simulate`: payload que espera (`idPrecioProveedor`, `cantidadEmpaques`, `precioEmpaque`) y qué campos devuelve (`subtotal`, `ingresoNetoBodega`, `costoBaseUnitario`).
   - Endpoint de guardado final (`POST /purchases`): validar si la cabecera admite multi-proveedor directo.

4. INVENTARIO DE DATOS SEED / ESTABLES:
   - Identificar proveedores e insumos canónicos ya existentes en la BD para utilizarlos en los tests sin romper la base de datos.

SALIDA REQUERIDA:
Generar el informe consolidado en:  
`apps/prompts/testing/INFORME-AUDITORIA-PRECIOS-Y-CHECKLIST.md`

Estructura obligatoria del reporte:
1. **Mapa de Selectores Listos para Playwright:** Tabla con `Elemento`, `Ubicación`, `Selector Estable Recomendado` (`getByRole`, `getByLabel`, `locator('input[name="..."]')`).
2. **Estructura del Storage `selectedForPurchase`:** JSON real de ejemplo.
3. **Contratos API Verificados:** Métodos, URLs y payloads de `/supplier-prices`, `/purchases/simulate` y `/purchases`.
4. **Campos Fiscales y Conversiones:** Cómo maneja IVA (`tieneIva`, `porcentajeIva`) y equivalencia técnica.
5. **Casos Clave a Cubrir en Tests E2E:**
   - Happy path de cotización con y sin IVA.
   - Envío a carrito y recepción en el checklist.
   - Marcado de "Conseguido" con simulación matemática.
   - Descarte con motivo en "No Conseguido".

DETENCIÓN:
Al guardar el informe Markdown, DETENTE inmediatamente sin realizar ninguna otra acción.