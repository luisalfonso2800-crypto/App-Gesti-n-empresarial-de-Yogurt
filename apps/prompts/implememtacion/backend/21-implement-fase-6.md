TAREA CONTROLADA — FASE 6: IMPLEMENTACIÓN AUTÓNOMA

OBJETIVO
Ejecutar y cerrar completamente la Fase 6 según lo estipulado en `docs/implementation/05-prisma-implementation-plan.md` (y la documentación de dominio referenciada para dicha fase).
La unidad de trabajo es la fase completa. Trabaja sobre el estado real actual del proyecto y conserva intacto todo lo implementado y ratificado en las Fases 1 a 5.

1. ESTADO DE PARTIDA
- Fases 1 a 5 cerradas y validadas.
- No reauditar exhaustivamente ni rediseñar campos de Fase 4 o relaciones de Fase 5.
- Utilízalas exclusivamente como base y dependencia técnica.

2. FUENTES DE VERDAD EXCLUSIVAS
- `docs/implementation/05-prisma-implementation-plan.md` (Sección Fase 6)
- Documentación de dominio en `docs/data-model/` estrictamente vinculada a los modelos de Fase 6.
- `apps/api/prisma/schema.prisma` (Estado actual)
PROHIBIDO leer documentación no relacionada o archivos en `apps/api/src/`.

3. CONTROL DE ALCANCE Y LÍMITES
- Determina los modelos, campos y relaciones que pertenecen a Fase 6.
- Implementa TODO lo requerido por Fase 6 en un mismo ciclo continuo.
- PROHIBIDO implementar entidades o relaciones de Fase 7 o posteriores.
- PROHIBIDO ejecutar migraciones en base de datos (`prisma migrate` prohibido).
- PROHIBIDO modificar `apps/api/src/` o crear código NestJS/TypeScript.
- PROHIBIDO detenerse a pedir confirmación para cada entidad o relación individual.

4. EJECUCIÓN Y VALIDACIÓN TÉCNICA
1. Inspecciona el estado actual de `apps/api/prisma/schema.prisma`.
2. Escribe los modelos y relaciones correspondientes a Fase 6.
3. Ejecuta la validación técnica mediante el comando seguro del monorepo:
   pnpm --filter api exec prisma format
   pnpm --filter api exec prisma validate
4. Si la validación arroja errores sintácticos propios de Fase 6, corrígelos de forma autónoma dentro del ciclo hasta obtener Exit code 0.

5. CIERRE Y REPORTE
Una vez validado el schema:
- Actualiza el checkbox de Fase 6 en `docs/implementation/05-prisma-implementation-plan.md`.
- Emite ÚNICAMENTE el bloque correspondiente y DETENTE:

[Si la fase queda completada y validada]
FASE 6 — IMPLEMENTACIÓN

- Estado: COMPLETADA
- Elementos implementados: [Lista de modelos/relaciones de Fase 6]
- Archivos creados: NINGUNO
- Archivos modificados: apps/api/prisma/schema.prisma [, docs/implementation/05-prisma-implementation-plan.md]
- Archivos eliminados: NINGUNO
- Validaciones ejecutadas: prisma format, prisma validate
- Resultado de validaciones: OK (Exit code 0)
- Migraciones: NO
- Fases posteriores implementadas: NO
- Cambios fuera de alcance: NINGUNO
- Discrepancias: NINGUNA
- Bloqueos: NINGUNO
- Siguiente fase: Fase 7

[Si existe un bloqueo real]
FASE 6 — IMPLEMENTACIÓN

- Estado: BLOQUEADA
- Implementado: [Lista parcial]
- Bloqueo: [Descripción exacta]
- Decisión requerida: [Detalle]
- Archivos afectados: [Lista]
- Fases posteriores implementadas: NO

DETENTE inmediatamente tras el reporte.