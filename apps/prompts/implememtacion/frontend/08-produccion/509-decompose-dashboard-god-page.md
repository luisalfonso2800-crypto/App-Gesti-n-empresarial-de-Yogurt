TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Descomponer el componente monolítico `apps/web/src/app/dashboard/page.jsx` (1.050 líneas) extrayendo la telemetría SCADA, los simuladores y las alertas a submódulos dedicados:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de `apps/web/src/app/dashboard/page.jsx`.
- Modificar EXCLUSIVAMENTE el archivo principal y crear su submódulo orquestador en `components/`.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/dashboard/page.jsx`
2. `apps/web/src/app/dashboard/components/DashboardOperationalView.jsx` (nuevo orquestador modular)

INSTRUCCIONES TÉCNICAS:

1. Submódulo Operativo (`DashboardOperationalView.jsx`):
   - Trasladar los bloques visuales de telemetría de tanques, monitoreo SCADA y renderizadores de simulación (`renderSimulatorModal`).
   - Mantener el componente desacoplado recibiendo los datos por props (`kpis`, `tanks`, `alerts`, `onSimulateBatch`).

2. Limpieza de `dashboard/page.jsx`:
   - Reducir `page.jsx` a una estructura delgada (< 120 líneas):
     * Consumir hooks de estado de alto nivel (`useDashboardData`, `useOnboardingStatus`).
     * Realizar comprobaciones de estado (ej. redirigir o mostrar vista tradicional).
     * Renderizar el layout base y delegar el cuerpo a `<DashboardOperationalView />`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/dashboard/page.jsx`
2. `node --check apps/web/src/app/dashboard/components/DashboardOperationalView.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- `apps/web/src/app/dashboard/page.jsx` tiene menos de 120 líneas de código.
- Todas las métricas y telemetría operan sin pérdida funcional.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
