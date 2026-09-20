TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Extraer el catálogo de productos de Cava a un Drawer lateral derecho desacoplado, dejando en el modal principal un botón "+" y la tabla limpia de despacho:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx` (nuevo componente para el panel lateral)

INSTRUCCIONES TÉCNICAS:

1. Modal Principal (`SaleProductsDispatchSection.jsx`):
   - Eliminar la cuadrícula incrustada que satura el formulario principal.
   - En la cabecera de "Productos a Despachar", incorporar el botón de apertura:
     `<button type="button" onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-700">`
       `<PlusIcon className="w-3.5 h-3.5" /> Agregar Productos desde Cava`
     `</button>`
   - Mantener visible la tabla limpia de ítems agregados con subtotales, precios unitarios y botón de eliminar fila.

2. Drawer Lateral Derecho (`SaleCavaCatalogDrawer.jsx`):
   - Renderizar como panel lateral adherido a la derecha (`fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transition-transform duration-300`):
     * Cabecera con título `🛒 Catálogo en Cava`, buscador rápido de productos y botón de cierre `✕`.
     * Listado con scroll vertical exclusivo de tarjetas amplias:
       - Foto comercial grande y destacada (`fotoComercialUrl` con altura mínima de 120px).
       - Título y presentación del producto.
       - Bloque técnico expandido: Ingredientes, peso neto, lote sugerido FEFO y notas.
       - Badges: `Stock en Cava: X und/L` y escala `B2B: $X (desde Y und)`.
       - Controles integrados de cantidad `[-] [cant] [+]` y botón `+ Añadir a la Venta`.
     * Al agregar un producto, se invoca `onAddProduct(item, cantidad)` que actualiza la lista del modal izquierdo en tiempo real.
   - Respetar el límite de líneas SRP (< 135 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal de venta principal queda limpio y sin doble scroll vertical.
- Al hacer clic en "+", se despliega a la derecha el catálogo visual completo con imágenes grandes y detalles técnicos.
- Los productos seleccionados se transfieren inmediatamente a la tabla de despacho izquierda.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.