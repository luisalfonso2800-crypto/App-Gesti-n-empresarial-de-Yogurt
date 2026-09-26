TAREA CONTROLADA — FASE 7: IMPLEMENTACIÓN DEL PLAN (CONSUMO ULTRA BAJO)

OBJETIVO
Identificar y ejecutar completamente la Fase 7 definida en `docs/implementation/05-prisma-implementation-plan.md`, continuando desde el estado dejado por la Fase 6. 
Trabaja de forma autónoma sin micro-detenciones y sin usar comandos de búsqueda en subshell.

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o pipelines largos en bash/terminal.
- Lee el archivo `docs/implementation/05-prisma-implementation-plan.md` directamente mediante la herramienta de lectura de archivos (Read/readFile).
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma validate` y `pnpm --filter api exec prisma format`.

FUENTES DE VERDAD EXCLUSIVAS
- `docs/implementation/05-prisma-implementation-plan.md` (Sección Fase 7)
- `apps/api/prisma/schema.prisma`
PROHIBIDO leer documentación conceptual general, manuales o auditar Fases 1 a 6 ya cerradas.

LÍMITES ESTRICTOS
- PROHIBIDO implementar entidades o lógica de Fase 8 o posteriores.
- PROHIBIDO ejecutar `prisma migrate` o alterar la base de datos física.
- Resuelve cualquier error sintáctico introducido de forma autónoma dentro del ciclo.

INFORME FINAL OBLIGATORIO
Al terminar, devuelve únicamente el bloque estructurado y DETENTE:

FASE 7 — CIERRE
- Estado: [COMPLETADA / BLOQUEADA / PARCIAL]
- Objetivo de la fase: [Breve descripción contractual]
- Elementos implementados: [Lista de componentes o modelos]
- Archivos creados: [Lista o NINGUNO]
- Archivos modificados: [Lista]
- Archivos eliminados: [Lista o NINGUNO]
- Validaciones ejecutadas: [Lista de comandos ejecutados]
- Resultado de validaciones: OK (Exit code 0)
- Prisma modificado: [SÍ / NO]
- Migraciones ejecutadas: NO
- Fases posteriores implementadas: NO
- Cambios fuera de alcance: NINGUNO
- Discrepancias: [NINGUNA / Detalle]
- Bloqueos: [NINGUNO / Detalle]
- Siguiente fase: [Nombre de Fase 8 y objetivo]

DETENTE inmediatamente tras el reporte.