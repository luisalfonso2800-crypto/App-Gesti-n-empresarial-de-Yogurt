TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar consultas y endpoints segregados de solo lectura (`/products/selector`) para modales y drawers (Hotspots 1 y 2), evitando la sobrecarga de consultas y desacoplando el selector de ventas del panel maestro de inventario:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`

INSTRUCCIONES TÉCNICAS:

1. Repositorio Backend (`products.repository.js`):
   - Agregar método ligero exclusivo para selectores y drawers:
     ```javascript
     async findForSaleSelector() {
       return await this.prisma.producto.findMany({
         where: { activo: true },
         select: {
           id: true,
           nombre: true,
           precioVenta: true,
           precioMayorista: true,
           cantidadMinimaMayorista: true,
           imageUrl: true,
           presentacion: { select: { id: true, nombre: true, cantidadOz: true, cantidadMl: true } },
           inventario: { select: { cantidadActual: true } }
         },
         orderBy: { nombre: 'asc' }
       });
     }
     ```
   - Exponerlo en el controlador/ruta correspondiente (`GET /products/selector` o filtro `?mode=selector`).

2. Frontend Drawer (`SaleCavaCatalogDrawer.jsx`):
   - Cambiar la invocación de datos hacia el nuevo endpoint optimizado (`/api/v1/products/selector` o `?mode=selector`).
   - Mapear el stock disponible usando `p.inventario?.cantidadActual || 0`.
   - Con esto, cualquier cambio futuro en los `include` pesados del panel administrativo de inventario no afectará la venta rápida.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal/drawer de catálogo en Cava carga de forma instantánea usando el selector segregado.
- El panel de inventario y el drawer de ventas quedan completamente desacoplados.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
