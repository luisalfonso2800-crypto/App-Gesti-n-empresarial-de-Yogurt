TAREA CONTROLADA — FASE 5: IMPLEMENTACIÓN DE RELACIONES BASE (EJECUCIÓN AUTÓNOMA)

OBJETIVO ÚNICO
Implementar y cerrar de forma autónoma la FASE 5 (Relaciones Base) en `apps/api/prisma/schema.prisma`, partiendo de los 5 maestros existentes (Presentacion, Insumo, Proveedor, Producto, Cliente) y respetando las decisiones ya ratificadas.

1. FUENTES DE VERDAD EXCLUSIVAS
- `docs/implementation/05-prisma-implementation-plan.md` (Sección Fase 5)
- `docs/data-model/02-relationships.md` (Definición de cardinalidades y FKs)
- `docs/implementation/06-decisiones-fase-4-prisma.md` (Contrato de nombres y tipos)
- `apps/api/prisma/schema.prisma` (Estado actual)
PROHIBIDO leer documentación ajena a la persistencia o archivos de `apps/api/src/`.

2. ESTADO DE PARTIDA Y ALCANCE PERMITIDO
- Las Fases 1 a 4 están cerradas y auditadas. NO rediseñes campos existentes de Fase 4.
- Identifica e implementa ÚNICAMENTE las relaciones base asignadas a Fase 5 (por ejemplo: `Producto` ↔ `Presentacion`, y las relaciones directas documentadas entre los maestros existentes).
- Archivo editable: ÚNICAMENTE `apps/api/prisma/schema.prisma`.
- Si el plan exige marcar el checkbox de la Fase 5, puedes editar `docs/implementation/05-prisma-implementation-plan.md` al finalizar la validación.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- PROHIBIDO implementar entidades de compras, inventario, ventas o fases 6+.
- PROHIBIDO ejecutar migraciones en la base de datos (`prisma migrate` prohibido).
- PROHIBIDO modificar `apps/api/src/`, crear módulos NestJS, DTOs, servicios o endpoints.
- PROHIBIDO detenerse a pedir confirmación para cada relación individual.

4. EJECUCIÓN AUTÓNOMA Y VALIDACIÓN
1. Lee la sección de Fase 5 en el plan y el archivo de relaciones.
2. Agrega los campos `@relation`, foreign keys correspondientes y relaciones inversas necesarias en `schema.prisma`.
3. Ejecuta en terminal:
   pnpm exec prisma format --schema apps/api/prisma/schema.prisma
   pnpm exec prisma validate --schema apps/api/prisma/schema.prisma
4. Si `prisma validate` arroja errores sintácticos de relación (nombres opuestos, onDelete, etc.), corrígelos dentro del ciclo hasta obtener Exit 0.

5. CRITERIOS DE DETENCIÓN
Detén la ejecución e informa de inmediato SOLO si:
- Existe una contradicción documental irreconciliable sobre una relación base.
- Se requiere una entidad de fases 6+ para poder definir una relación obligatoria de esta fase.

FORMATO DEL REPORTE FINAL
Emite exclusivamente el siguiente bloque estructurado y DETENTE:

FASE 5 — IMPLEMENTACIÓN

- Estado: [COMPLETADA / BLOQUEADA]
- Relaciones implementadas: [Lista de relaciones agregadas, ej. Producto -> Presentacion]
- Archivos modificados: apps/api/prisma/schema.prisma [, docs/implementation/05-prisma-implementation-plan.md]
- Archivos creados: NINGUNO
- Validaciones ejecutadas: prisma format, prisma validate
- Resultado técnico: Exit code 0 (Schema válido y consistente)
- Fases posteriores implementadas: NO
- Cambios fuera de alcance: NINGUNO
- Discrepancias / Bloqueos: [NINGUNO / Detalle breve]

DETENTE inmediatamente tras el reporte.