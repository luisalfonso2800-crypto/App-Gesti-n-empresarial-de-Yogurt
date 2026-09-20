TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir el error de ejecución "ReferenceError: validProducts is not defined" en `SaleCavaCatalogDrawer.jsx`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx` y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`

INSTRUCCIONES TÉCNICAS:

1. Subsanar la variable no definida `validProducts`:
   - Revisar las líneas 30 a 50 del componente.
   - Asegurar que la lista base (ej. `cavaProducts` o `products`) se valide como arreglo: `const rawItems = Array.isArray(cavaProducts) ? cavaProducts : [];`.
   - Definir `validProducts` con el filtro comercial (solo lácteos terminados sin granel):
     ```javascript
     const validProducts = useMemo(() => {
       return (Array.isArray(cavaProducts) ? cavaProducts : []).filter((item) => {
         const cat = (item.categoria || item.producto?.categoria || '').toUpperCase();
         const pres = (item.presentacionNombre || item.presentacion?.nombre || '').toUpperCase();
         const esGranel = pres.includes('GRANEL') || (item.producto?.nombre || item.nombre || '').toUpperCase().includes('GRANEL');
         const esComercial = cat === 'LACTEOS' || cat === 'PRODUCTO_TERMINADO' || Boolean(item.presentacionId || item.producto?.presentacionId);
         return esComercial && !esGranel;
       });
     }, [cavaProducts]);
     ```
   - Si existe un segundo `useMemo` para el buscador por texto (`searchTerm`), asegurarse de que consuma `validProducts` ya definido:
     ```javascript
     const filteredProducts = useMemo(() => {
       if (!searchTerm?.trim()) return validProducts;
       const term = searchTerm.toLowerCase();
       return validProducts.filter(p => 
         (p.nombre || p.producto?.nombre || '').toLowerCase().includes(term) ||
         (p.presentacionNombre || p.presentacion?.nombre || '').toLowerCase().includes(term)
       );
     }, [validProducts, searchTerm]);
     ```
   - Comprobar que en el render JSX del catálogo se itere sobre `filteredProducts` o `validProducts` sin dejar identificadores huérfanos.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Ventas y el modal de Despacho abren de inmediato sin arrojar "ReferenceError: validProducts is not defined".
- El buscador y el listado de tarjetas del Drawer funcionan con fluidez.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.