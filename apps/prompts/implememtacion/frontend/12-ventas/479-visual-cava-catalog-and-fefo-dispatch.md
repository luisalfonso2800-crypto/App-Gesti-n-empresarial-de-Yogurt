TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Mostrar en `SaleProductsDispatchSection.jsx` el catálogo en Cava con tarjetas grandes (imagen comercial, presentación, ingredientes, stock y precio mayorista).
2) En backend (`sales.repository.js`), ejecutar el descuento real de existencias en Cava lote por lote bajo regla FEFO al confirmar el despacho:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`
2. `apps/api/src/sales/sales.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Frontend (`SaleProductsDispatchSection.jsx`):
   - Arriba de la tabla de despacho, renderizar un carrusel o grid de productos disponibles en Cava (`cavaProducts` o consulta directa):
     * Cada tarjeta de producto:
       - Imagen destacada (`fotoComercialUrl` con altura mínima de 110px o contenedor visual claro).
       - Título y presentación (ej. "Contenedor de 16 oz").
       - Ficha técnica resumida: Ingredientes / notas de producto y peso neto/volumen.
       - Badge de existencias: `<span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Stock: {stock} {unidad}</span>`.
       - Precios: Regular `$ {precioVenta}` y si aplica mayorista: `B2B: $ {precioMayorista} (min {cantMin})`.
     * Al hacer clic en una tarjeta:
       - Abrir selector de cantidad `[-] [cant] [+]` con límite máximo igual al stock disponible.
       - Botón "+ Añadir al Despacho".
   - Al añadirse, la tabla inferior lista los ítems con su subtotal y recalcula el precio mayorista si la cantidad cumple la escala.
   - Respetar el límite de líneas SRP (< 135 líneas).

2. Backend (`sales.repository.js`):
   - En la función que liquida/crea la venta (`createSale` / `despacharVenta`):
     * Para cada ítem despachado:
       - Buscar los lotes del producto en Cava ordenados por fecha de vencimiento ascendente (`orderBy: { fechaVencimiento: 'asc' }`) donde `stockActual > 0`.
       - Descontar la cantidad vendida reduciendo `stockActual` de los lotes correspondientes (lógica FEFO).
       - Registrar el movimiento de salida de inventario en `Kardex` / `MovimientoInventario`.
     * Guardar la venta con su estado `PAGADA` (si fue Contado) o `PENDIENTE_PAGO` con `fechaLimitePago` (si fue Crédito).

VERIFICACIÓN:
1. `node --check apps/api/src/sales/sales.repository.js`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal despliega las tarjetas con fotos grandes, ingredientes y existencias de Cava.
- Al despachar, el stock de los lotes en Cava se descuenta efectivamente en la base de datos respetando FEFO.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.