TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 ARCHIVOS EN BACKEND - CERO BUCLES):
Implementar el motor de asignación real de fondos para "Rumbo MANNÁ", evitando la duplicidad del dinero entre metas/sueños personales mediante estrategias (CASCADA, PORCENTAJE, MANUAL) y trazabilidad de aportes.

ARCHIVOS A INTERVENIR:
1. `apps/api/prisma/schema.prisma` (Actualizar MetaEmpresarial y agregar modelo AporteMeta)
2. `apps/api/src/goals/goals.repository.js`
3. `apps/api/src/goals/goals.service.js`
4. `apps/api/src/goals/goals.controller.js`
5. `apps/api/src/goals/dto/create-goal.dto.js` (o validación interna)

INSTRUCCIONES TÉCNICAS:

1. Modificaciones en Prisma (`schema.prisma`):
   - En `MetaEmpresarial`:
     * Agregar `estrategiaAsignacion`: String @default("MANUAL") // CASCADA, PORCENTAJE, MANUAL, METRICA_GLOBAL
     * Agregar `porcentajeFlujo`: Decimal? @default(0) @db.Decimal(5, 2)
     * Agregar `ordenPrioridad`: Int? @default(1)
     * Agregar relación `aportes`: AporteMeta[]
   - Crear modelo `AporteMeta`:
     ```prisma
     model AporteMeta {
       id            String          @id @default(uuid()) @map("ID_Aporte")
       metaId        String          @map("Meta_ID")
       meta          MetaEmpresarial @relation(fields: [metaId], references: [id], onDelete: Cascade)
       monto         Decimal         @map("Monto") @db.Decimal(12, 2)
       fecha         DateTime        @default(now()) @map("Fecha")
       nota          String?         @map("Nota")
       creadoEn      DateTime        @default(now()) @map("Creado_En")

       @@map("Aportes_Metas")
     }
     ```
   - Sincronizar con: `pnpm --filter api exec prisma db push && pnpm --filter api exec prisma generate`.

2. Backend (`goals.service.js` y `goals.repository.js`):
   - **Separación de Lógica:**
     * Si `ambito === 'EMPRESARIAL'` y `estrategiaAsignacion === 'METRICA_GLOBAL'`: Lee la suma agregada del ERP (ventas brutas, producción, etc.).
     * Si `ambito === 'PERSONAL_FAMILIAR'`:
       - Estrategia `MANUAL`: `valorActual = SUM(AporteMeta.monto)`.
       - Estrategia `PORCENTAJE`: `valorActual = (RecaudoTotal * porcentajeFlujo) / 100`.
       - Estrategia `CASCADA`: El excedente no utilizado por metas de mayor prioridad (`ordenPrioridad`) llena esta meta hasta su tope.
   - Endpoint `POST /goals/:id/contribute`:
     * Recibe `{ monto, nota }` y crea un registro en `AporteMeta`.
     * Retorna la meta con su nuevo valor actual y estado recalculado.
   - Endpoint `GET /goals/available-funds`:
     * Retorna la utilidad neta disponible del ERP menos la suma de todos los aportes ya reservados en sueños personales.

VERIFICACIÓN:
1. `pnpm --filter api exec prisma db push`
2. `pnpm --filter api build`

DETENCIÓN:
Al compilar limpio el backend, DETENTE inmediatamente.