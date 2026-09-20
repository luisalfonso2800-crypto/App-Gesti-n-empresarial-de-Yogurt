TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Restaurar en `inventory.repository.js` la consulta de Cava para que la Bitácora de Inventario vuelva a listar todos los productos y bases lácteas sin exclusiones.
2) Confinar el filtro de productos comerciales envasados exclusivamente al Drawer lateral de Ventas (`SaleCavaCatalogDrawer.jsx`):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js`
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`

INSTRUCCIONES TÉCNICAS:

1. Restaurar Consulta de Inventario General (`inventory.repository.js`):
   - En el método `findFinishedProducts()`:
     * Remover las restricciones `NOT` de graneles y categorías `BASES_LACTEAS`.
     * La Bitácora de Inventario debe recibir todo lo almacenado en Cava (categorías comerciales y bases lácteas físicas en tanque/cava):
       ```javascript
       where: {
         producto: {
           categoria: { in: ["LACTEOS", "PRODUCTO_TERMINADO", "BASES_LACTEAS", "PREMEZCLA_PLANTA"] }
         }
       },
       include: {
         producto: {
           include: {
             presentacion: true,
             recetas: { take: 1, select: { unidadRendimiento: true } }
           }
         },
         lotes: {
           where: {
             cantidadDisponible: { gt: 0 }
           }
         }
       },
       orderBy: { fechaActualizacion: "desc" }
       ```

2. Aislar el Filtro Comercial en Ventas (`SaleCavaCatalogDrawer.jsx`):
   - En el Drawer lateral derecho de despacho, filtrar en memoria la lista de productos recibidos:
     ```javascript
     const productosParaVenta = (cavaProducts || []).filter(item => {
       const cat = (item.categoria || item.producto?.categoria || '').toUpperCase();
       const pres = (item.presentacionNombre || item.presentacion?.nombre || '').toUpperCase();
       const esGranel = pres.includes('GRANEL') || (item.producto?.nombre || '').toUpperCase().includes('GRANEL');
       const esComercial = cat === 'LACTEOS' || cat === 'PRODUCTO_TERMINADO' || Boolean(item.presentacionId || item.producto?.presentacionId);
       
       return esComercial && !esGranel;
     });
     ```
   - Renderizar las tarjetas del catálogo utilizando únicamente `productosParaVenta`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La Bitácora de Inventario muestra nuevamente todas las existencias de Cava (incluyendo bases lácteas y graneles).
- El Drawer lateral de Nueva Venta solo ofrece el producto envasado terminado (Contenedor de 16 oz).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.