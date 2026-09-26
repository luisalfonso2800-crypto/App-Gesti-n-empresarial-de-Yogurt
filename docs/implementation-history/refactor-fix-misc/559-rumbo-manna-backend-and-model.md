TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 ARCHIVOS INTERVENIDOS - CERO BUCLES):
Implementar el modelo relacional y la capa backend para el nuevo módulo "Rumbo MANNÁ" (Metas, Sueños y Propósito), conectando el cálculo reactivo de métricas reales del ERP y agregando el acceso en el Sidebar.

ARCHIVOS A INTERVENIR:
1. `apps/api/prisma/schema.prisma` (Agregar enum CategoriaSueno, TipoAmbito y modelo MetaEmpresarial)
2. `apps/api/src/goals/` (CREAR goals.module.js, goals.controller.js, goals.service.js, goals.repository.js)
3. `apps/api/src/app.module.js` (Registrar GoalsModule)
4. `apps/web/src/components/layout/Sidebar.jsx` (Agregar enlace "/commercial/goals" - Rumbo MANNÁ con icono Sprout o Target)

INSTRUCCIONES TÉCNICAS:

1. Modelo Prisma:
   - Crear `MetaEmpresarial` con soporte para `titulo`, `descripcion`, `ambito` (PERSONAL_FAMILIAR, EMPRESARIAL), `categoriaSueno`, `tipoMetrica`, `valorObjetivo`, `horizonte`, `fechaInicio`, `fechaFin`, y jerarquía `metaPadreId`.
   - Ejecutar `prisma db push` y `prisma generate`.

2. Backend (`goals`):
   - `GET /goals`: Retorna la lista de metas calculando en tiempo real:
     * `valorActual`: Evaluado dinámicamente sumando ventas completadas, recaudos reales, producción o gastos según `tipoMetrica` en el rango de fechas.
     * `progresoPorcentaje`: Min 0, Max 100.
     * `tiempoTranscurridoPorcentaje`: Cálculo temporal exacto.
     * `estadoRitmo`: ADELANTADA, EN_RITMO, EN_RIESGO, ATRASADA, CUMPLIDA.
     * `estadoBotanico`: SEMILLA (0-25%), EN_CRECIMIENTO (26-70%), FLORACION (71-99%), COSECHADA (>=100%).
   - `POST /goals`: Crear nuevo objetivo/sueño.
   - `DELETE /goals/:id`: Eliminar meta.

3. Sidebar (`Sidebar.jsx`):
   - Agregar el enlace en el grupo COMERCIAL inmediatamente después de Gastos:
     * Etiqueta: `Rumbo MANNÁ`
     * Ruta: `/commercial/goals`
     * Icono: `Sprout` o `Target` de Lucide.
   - Cumplir SRP (< 130 líneas).

VERIFICACIÓN:
1. `pnpm --filter api exec prisma db push`
2. `pnpm --filter api build`
3. `node .agents/scripts/verify-srp.js`
4. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La tabla de metas existe en PostgreSQL.
- La API calcula reactivamente el avance contra las ventas/recaudos reales.
- El Sidebar muestra el acceso a "Rumbo MANNÁ".
- Código 0 en SRP y builds limpios.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.