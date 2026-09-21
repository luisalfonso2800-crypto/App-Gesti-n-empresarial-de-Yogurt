TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Implementar selector de rango entre dos fechas (Desde / Hasta) que recalcule las tarjetas y filtre las ventas.
2) Agregar tarjeta con la Ganancia Total Acumulada del Año en curso.
3) Limitar la tabla de ventas a 10 registros por página con controles de paginación (Anterior / Siguiente):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/page.jsx`
2. `apps/web/src/app/commercial/sales/components/SalesDateFilterBar.jsx` (o crear subcomponente si no existe)

INSTRUCCIONES TÉCNICAS:

1. Barra de Rango de Fechas (`SalesDateFilterBar.jsx`):
   - Dos campos tipo fecha: `Desde: <input type="date" value={fechaInicio} />` y `Hasta: <input type="date" value={fechaFin} />`.
   - Botón `Limpiar Rango` para resetear al mes actual o ver todo.
   - Enviar cambios reactivamente hacia `page.jsx`.

2. Dashboard y Tarjeta de Ganancia Anual (`page.jsx`):
   - Calcular en `useMemo`:
     * `gananciaAnio`: Sumatoria de `(total - costoTotal)` de todas las ventas correspondientes al año en curso (ej. 2026), sin verse reducida por el filtro de rango corto.
     * `ventasRango`: Ventas filtradas estrictamente entre `fechaInicio` y `fechaFin`.
     * `ventasDelRangoTotal`, `gananciaRango`, `carteraRango`.
   - Actualizar las 4 tarjetas superiores:
     1. `Ventas del Período` ($ monto del rango).
     2. `Ganancia del Período` ($ ganancia del rango).
     3. `Cartera por Cobrar` (saldo pendiente en rango o global).
     4. `Ganancia Total del Año (${añoActual})` ($ gananciaAnio acumulada anual con icono o badge destacado).

3. Paginación de Tabla (Máximo 10 registros):
   - Estado: `currentPage` (inicia en 1). Si cambia el filtro de fechas, resetear a página 1.
   - Constante `ITEMS_PER_PAGE = 10`.
   - Calcular:
     * `totalPages = Math.ceil(ventasRango.length / ITEMS_PER_PAGE) || 1`.
     * `paginatedVentas = ventasRango.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)`.
   - Renderizar únicamente `paginatedVentas` en el cuerpo de la tabla.
   - En el pie de la tabla:
     * Texto: `Mostrando ${(currentPage - 1) * 10 + 1} - ${Math.min(currentPage * 10, ventasRango.length)} de ${ventasRango.length} ventas`.
     * Botones `[ Anterior ]` (deshabilitado en pág 1) y `[ Siguiente ]` (deshabilitado en última pág).
   - Respetar el límite de líneas SRP (< 120 líneas en `page.jsx`, delegando paginador o tarjetas a subcomponentes si excede).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/SalesDateFilterBar.jsx`
2. `node --check apps/web/src/app/commercial/sales/page.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista permite seleccionar libremente fechas "Desde" y "Hasta", recalculando en vivo las métricas.
- Se visualiza la tarjeta con la ganancia acumulada de todo el año.
- La tabla nunca sobrepasa los 10 ítems por pantalla y permite paginar con "Anterior" y "Siguiente".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
