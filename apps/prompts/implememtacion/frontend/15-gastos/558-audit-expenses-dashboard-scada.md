TAREA DE AUDITORÍA ARQUITECTURAL (PRESUPUESTO ESTRICTO: MÁXIMO 4 TOOL CALLS DE SOLO LECTURA):
Auditar el módulo financiero de Gastos (/commercial/expenses) y la capa analítica/IoT de Dashboard y Alarmas SCADA (/dashboard).

PROHIBICIÓN ESTRICTA:
- CERO escrituras en código fuente (.js, .jsx, .prisma).
- Solo emitir el reporte en docs/audits/.

RUTAS A INSPECCIONAR:
1. `apps/api/prisma/schema.prisma` (Modelos Gasto, Alarma, Telemetría o variables IoT).
2. `apps/api/src/expenses/` y `apps/api/src/dashboard/` (o scada).
3. `apps/web/src/app/commercial/expenses/` y `apps/web/src/app/dashboard/`.

SALIDA REQUERIDA:
Guardar el reporte consolidado en:
`docs/audits/AUDIT-EXPENSES-DASHBOARD-SCADA.md`

DETENCIÓN:
Al guardar el informe, DETENTE inmediatamente.