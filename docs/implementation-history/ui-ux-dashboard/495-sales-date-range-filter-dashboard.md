TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar un filtro interactivo por rango de fechas en la vista de Ventas que recalcule en tiempo real las 4 tarjetas de métricas (Ventas, Ganancias, Cartera y Margen) y filtre la tabla histórica:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/page.jsx`
2. `apps/web/src/app/commercial/sales/components/SalesDateFilterBar.jsx` (nuevo subcomponente modular para la barra de fechas)

INSTRUCCIONES TÉCNICAS:

1. Nuevo Componente de Filtro de Fechas (`SalesDateFilterBar.jsx`):
   - Props: `fechaInicio`, `fechaFin`, `onDateChange(inicio, fin)`, `onReset()`.
   - Botones rápidos:
     * `Hoy`: Desde las 00:00 hasta las 23:59 del día actual.
     * `Esta Semana`: Desde el lunes de la semana actual hasta hoy.
     * `Este Mes`: Desde el día 1 del mes actual hasta fin de mes.
     * `Mes Anterior`: Primer y último día del mes previo.
   - Controles de fecha:
     * `<input type="date" value={fechaInicio} onChange={...} />`
     * `<input type="date" value={fechaFin} onChange={...} />`
     * Botón `Restablecer / Ver Todo`.
   - Estilo limpio integrado: `flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 mb-4 text-xs`.

2. Lógica Reactiva en `sales/page.jsx`:
   - Mantener estado de fechas: `fechaInicio` (default: primer día del mes actual) y `fechaFin` (default: hoy o fin de mes).
   - Filtrar la lista de ventas en un `useMemo`:
     ```javascript
     const ventasFiltradas = useMemo(() => {
       if (!fechaInicio && !fechaFin) return ventas;
       return ventas.filter((v) => {
         const f = new Date(v.fechaVenta).setHours(0, 0, 0, 0);
         const inicio = fechaInicio ? new Date(fechaInicio).setHours(0, 0, 0, 0) : -Infinity;
         const fin = fechaFin ? new Date(fechaFin).setHours(23, 59, 59, 999) : Infinity;
         return f >= inicio && f <= fin;
       });
     }, [ventas, fechaInicio, fechaFin]);
     ```
   - Alimentar el cálculo de las 4 tarjetas de KPIs y la tabla de ventas EXCLUSIVAMENTE con `ventasFiltradas`:
     * Tarjeta 1: Cambiar título a `VENTAS DEL PERÍODO ({ventasFiltradas.length})` con el total sumado de las ventas en rango.
     * Tarjeta 2: Sumatoria de ganancias brutas en rango.
     * Tarjeta 3: Cartera pendiente en rango (`saldo > 0`).
     * Tarjeta 4: Margen promedio ponderado del periodo.
     * Tabla: Renderizar filas de `ventasFiltradas`.
   - Respetar el límite de líneas SRP (< 120 líneas en `page.jsx`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/SalesDateFilterBar.jsx`
2. `node --check apps/web/src/app/commercial/sales/page.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Ventas incluye la barra de filtros por fecha con botones rápidos de periodo.
- Al cambiar el rango o elegir un botón rápido, las 4 tarjetas de métricas y la tabla de ventas actualizan sus cifras inmediatamente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
