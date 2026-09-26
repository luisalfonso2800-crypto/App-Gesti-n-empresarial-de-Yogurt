TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 4 ARCHIVOS EN FRONTEND - CERO BUCLES):
Evolucionar la pantalla de Gastos en `apps/web/src/app/commercial/expenses/` (o ruta correspondiente de gastos) incorporando tarjetas métricas superiores (KPIs de egresos consolidados), filtros avanzados por período/categoría y diseño alineado al Design System MANNÁ, respetando SRP (< 130 líneas por componente).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/expenses/page.jsx` (Refactor / Orquestador)
2. `apps/web/src/app/commercial/expenses/components/ExpensesKpis.jsx` (CREAR - Tarjetas métricas superiores)
3. `apps/web/src/app/commercial/expenses/components/ExpensesFilters.jsx` (CREAR - Barra de filtros)
4. `apps/web/src/app/commercial/expenses/expenses.module.css` (Ajustes de maquetación y estilos)

INSTRUCCIONES TÉCNICAS:

1. Tarjetas Métricas Superiores (`ExpensesKpis.jsx` < 90 líneas):
   - Renderizar 4 tarjetas de resumen calculadas a partir de la lista consolidada:
     * TOTAL EGRESOS (Suma total de gastos + compras del período filtrado).
     * EGRESOS COMPRAS / INSUMOS (Total imputado a adquisiciones de materia prima).
     * GASTOS OPERATIVOS Y SERVICIOS (Total de erogaciones directas: luz, arriendo, nómina, etc.).
     * GASTOS ADMINISTRATIVOS / OTROS (Erogaciones administrativas, ventas y financieras).
   - Utilizar el diseño visual de tarjetas del sistema MANNÁ (fondo blanco/pergamino suave, tipografía clara y bordes sobrios).

2. Barra de Filtros (`ExpensesFilters.jsx` < 110 líneas):
   - Búsqueda por descripción o comprobante.
   - Pestañas/botones rápidos de categoría: `[ Todos ]`, `[ Compras ]`, `[ Servicios Públicos ]`, `[ Nómina ]`, `[ Mantenimiento ]`, `[ Otros ]`.
   - Selector o botones de rango temporal (Hoy, Esta Semana, Este Mes, Mes Anterior).
   - Botón `Limpiar Filtros`.

3. Orquestador (`page.jsx` < 120 líneas):
   - Integrar `ExpensesKpis`, `ExpensesFilters`, la tabla existente y el modal `Nuevo Gasto`.
   - Manejar el estado de filtros en memoria o sincronizado con el hook de datos existente.
   - Preservar la regla de responsabilidad única (SRP < 130 líneas).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La vista de Gastos exhibe los KPIs superiores con el balance discriminado de egresos.
- Los filtros permiten segmentar compras de insumos frente a gastos fijos y operativos.
- Cero infracciones de SRP y build sin errores (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.