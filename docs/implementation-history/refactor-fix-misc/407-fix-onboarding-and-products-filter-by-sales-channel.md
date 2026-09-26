TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir la validación de Puesta en Marcha y el filtrado por canal de venta en el catálogo de productos:
1. En el validador de onboarding (`onboarding.service.js` o servicio que evalúa los pasos 4, 5 y 6):
   - Paso 5 ("Fabricar Primer Lote Comercial"): Debe validar que exista al menos un lote de un producto cuyo canal de venta sea comercial (`canalVenta !== 'SOLO_PLANTA'`). Si solo existen lotes de base/tanque de uso interno, el paso no debe marcarse como comercial completo.
   - Paso 6 ("Emitir Primera Venta"): Solo debe considerar ventas de productos comerciales terminados con precio > 0.
2. En la vista de Catálogo de Productos (`apps/web/src/app/catalog/products/page.jsx` o componente de tabla):
   - Agregar filtro o pestañas por Canal de Venta: "Comerciales (Venta)", "Bases de Planta (WIP)" y "Todos".
   - En cada fila, mostrar un badge visible con el Canal de Venta (`Solo Planta`, `Mixto`, `B2B`, `B2C`).

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/onboarding/onboarding.service.js` (o donde se computan los pasos del wizard)
2. `apps/web/src/app/catalog/products/page.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `onboarding.service.js`:
   - Al evaluar el paso `FABRICAR_PRIMER_LOTE_COMERCIAL`:
     * Consultar:
       ```javascript
       const loteComercial = await this.prisma.lote.findFirst({
         where: {
           estado: 'DISPONIBLE',
           producto: {
             canalVenta: { not: 'SOLO_PLANTA' },
             tipo: { not: 'BASE_INTERMEDIA' }
           }
         }
       });
       ```
     * `completado: Boolean(loteComercial)`.

2. En `apps/web/src/app/catalog/products/page.jsx`:
   - Incorporar filtro por canal de venta:
     * Si `filtro === 'COMERCIAL'`, mostrar productos donde `canalVenta !== 'SOLO_PLANTA'`.
     * Si `filtro === 'WIP'`, mostrar productos donde `canalVenta === 'SOLO_PLANTA'`.
   - Renderizar el badge de canal de venta en la tabla con estilos sobrios.
   - Respetar el límite estricto SRP (< 120 líneas para la página).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Puesta en marcha distingue nítidamente entre un lote de base interna y un lote terminado comercial envasado.
- El catálogo permite filtrar y visualizar con claridad el canal de venta de cada producto.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.