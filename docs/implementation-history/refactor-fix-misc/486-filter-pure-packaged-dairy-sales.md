TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Restringir de forma tajante el catálogo de despacho de Cava para que ÚNICAMENTE liste productos de la categoría 'Lácteos Terminados' con contenedor/envase comercial, excluyendo bases lácteas y graneles:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js` (o endpoint que entrega productos de Cava a la venta)
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx` (y hook `useSaleForm.js`)

INSTRUCCIONES TÉCNICAS:

1. Backend (Filtro en la Fuente):
   - En la consulta que abastece los productos disponibles para despacho en Cava:
     * Filtrar estrictamente por categoría comercial terminada:
       `categoria: { in: ['LACTEOS', 'PRODUCTO_TERMINADO', 'LACTEOS_TERMINADOS'] }`
     * Excluir expresamente categorías intermedias: `BASES_LACTEAS`, `PREMEZCLA_PLANTA`, `WIP`.
     * Excluir presentaciones donde el tipo de envase sea 'BALDE' o el nombre contenga 'GRANEL'.

2. Frontend (`SaleCavaCatalogDrawer.jsx` / `useSaleForm.js`):
   - Blindaje adicional en el catálogo lateral de ventas:
     ```javascript
     const productosComercialesValidos = cavaProducts.filter((p) => {
       const cat = (p.categoria || '').toUpperCase();
       const presNombre = (p.presentacionNombre || p.presentacion?.nombre || '').toUpperCase();
       const tipoEnvase = (p.presentacion?.envase || '').toUpperCase();

       const esLacteoTerminado = cat === 'LACTEOS' || cat === 'LACTEOS_TERMINADOS' || cat === 'PRODUCTO_TERMINADO';
       const esGranel = presNombre.includes('GRANEL') || tipoEnvase === 'BALDE' || tipoEnvase === 'GRANEL';

       return esLacteoTerminado && !esGranel;
     });
     ```
   - Renderizar en el listado del Drawer **única y exclusivamente** los productos que pasen este filtro.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/...`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En el catálogo lateral derecho "Catálogo en Cava" desaparecen todas las tarjetas de "YOGURT A GRANEL" y "Bases Lácteas".
- Únicamente se muestra el producto envasado: "YOGURT BASE CON SEMIELABORADO - CONTENEDOR DE 16 OZ" con sus 25 unidades disponibles.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.