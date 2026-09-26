TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Organizar la Bitácora de Fabricación implementando un filtro de flujo de planta (En Proceso, Listos para Liquidar, Historial Liquidado) para evitar la saturación visual de tarjetas ya concluidas:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el contenedor principal de la vista de producción (`apps/web/src/app/operations/production/page.jsx` o componente que renderiza la grilla de órdenes) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/page.jsx` (o componente contenedor de la lista de órdenes)

INSTRUCCIONES TÉCNICAS:

1. Filtro Superior por Estado de Planta:
   - Añadir una barra de pestañas/pills antes de la grilla de órdenes:
     * `🟡 Activos en Tanque` (órdenes en estado `EN_PROCESO`, `FERMENTACION`, `INCUBACION`).
     * `🟢 Por Liquidar / Envasar` (órdenes finalizadas técnicamente pendientes de cierre).
     * `📁 Histórico Liquidado` (órdenes con `LIQUIDADO` o `CERRADO`).
     * `Ver Todos`.
   - Establecer como pestaña activa inicial `🟡 Activos en Tanque` (o mostrar primero activos y luego en un acordeón/sección inferior los liquidados).

2. Ordenamiento y Contadores:
   - Ordenar las tarjetas por `fechaInicio` descendente (las más recientes primero).
   - Mostrar un badge con el conteo numérico en cada pestaña:
     `Activos (${activosCount})` | `Historial (${liquidadosCount})`.
   - Si no hay lotes en el filtro activo, renderizar un mensaje claro con botón de acción rápida:
     `"No hay tanques en fermentación activa en este momento."`

3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pantalla de producción abre enfocada en lo que está pasando en planta hoy.
- Los lotes liquidados ya no abruman la vista inicial y quedan organizados en su pestaña de archivo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.