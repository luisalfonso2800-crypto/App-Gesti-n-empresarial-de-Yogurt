TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Restringir el catálogo de ventas en Cava exclusivamente a productos cuya receta/unidad técnica sea 'Unidades' (und), excluyendo graneles en litros.
2) Mostrar el nombre del contenedor/presentación y contenido neto en las tarjetas del catálogo y en la tabla de productos a despachar:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (o servicio de consulta de productos para venta)
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx` (y/o `SaleCavaCatalogDrawer.jsx`)

INSTRUCCIONES TÉCNICAS:

1. Filtro Estricto por Unidades Comerciales (`useSaleForm.js`):
   - Al cargar o filtrar la lista de productos de Cava (`cavaProducts`):
     * Excluir productos cuya unidad de medida base sea exclusivamente 'Litros', 'L' o 'Litro' sin presentación envasada.
     * Permitir únicamente productos donde:
       `const esUnidad = (p.unidadMedida || p.receta?.unidad || p.unidad || '').toLowerCase().includes('und') || Boolean(p.presentacionId) || p.categoria === 'LACTEOS';`
     * Los graneles puros de planta (ej. 'YOGURT A GRANEL' con 11 Litros o 58.9 Litros) NO deben listarse en el catálogo de ventas.

2. Detalle de Contenedor y Contenido Neto:
   - En el Drawer del Catálogo (`SaleCavaCatalogDrawer.jsx`):
     * Mostrar claramente la etiqueta del envase y contenido:
       `<span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{p.presentacionNombre || p.presentacion?.nombre || 'Contenedor 16 oz'} • {p.contenidoNeto || '473 ml'}</span>`
   - En la Tabla de Despacho (`SaleProductsTable.jsx`):
     * En la celda del producto, mostrar el título en negrita y en la línea inferior:
       `<div className="text-xs text-slate-500 font-normal">{item.presentacionNombre || item.presentacion} {item.contenidoNeto ? `• ${item.contenidoNeto}` : ''}</div>`
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/hooks/useSaleForm.js`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En el catálogo de ventas solo aparece el producto comercial envasado (YOGURT BASE CON SEMIELABORADO - 16 OZ) con sus 25 unidades.
- Las bases intermedias a granel en litros quedan excluidas del catálogo de venta al público.
- En la tabla de despacho se visualiza el tipo de contenedor y el contenido neto de cada producto agregado.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.