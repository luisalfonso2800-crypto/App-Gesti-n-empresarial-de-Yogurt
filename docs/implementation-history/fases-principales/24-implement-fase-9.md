TAREA CONTROLADA — FASE 9: IMPLEMENTACIÓN, VALIDACIÓN Y AUTOAUDITORÍA (CONSUMO ULTRA BAJO)

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos interactivos o subshells de búsqueda (`Select-String`, `findstr`, `grep`).
- Inspecciona archivos exclusivamente mediante la herramienta nativa de lectura directa (Read / readFile).
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format` y `pnpm --filter api exec prisma validate`. NUNCA usar `npx`.

1. OBJETIVO
Implementar completamente la Fase 9 en `apps/api/prisma/schema.prisma` según el plan de implementación y los contratos documentales existentes.
La ejecución debe ser autónoma dentro del alcance definido: análisis → implementación → autoauditoría → validación técnica → corrección → cierre.
No solicites confirmación para decisiones que ya estén determinadas por la documentación.

2. FUENTES DE VERDAD EXCLUSIVAS
- `AI_PROJECT_OPERATING_MANUAL.md`
- `docs/implementation/05-prisma-implementation-plan.md` (Sección Fase 9)
- Documentación específica de Fase 9 en `docs/data-model/`
- Estado actual de `apps/api/prisma/schema.prisma`
PROHIBIDO leer documentación no relacionada o auditar exhaustivamente Fases 1 a 8 ya cerradas.

3. INSPECCIÓN PREVIA E IMPLEMENTACIÓN
- Identifica qué elementos de la Fase 9 faltan y qué relaciones existentes deben extenderse.
- Respeta nombres, tipos Prisma, nulabilidad, defaults, `@map`, `@@map`, PKs, FKs, restricciones y cardinalidades según contrato.
- PROHIBIDO implementar entidades o relaciones de Fase 10 o posteriores.
- PROHIBIDO crear migraciones físicas (`prisma migrate` prohibido).
- PROHIBIDO modificar controladores, servicios, módulos NestJS o frontend.

4. AUTOAUDITORÍA Y REGLA DE AUTOCORRECCIÓN
- Tras agregar los modelos, ejecuta:
    pnpm --filter api exec prisma format
    pnpm --filter api exec prisma validate
- Compara el resultado final con la documentación contractual.
- Si detectas una discrepancia o error que pueda resolverse con la documentación: CORRÍGELA DIRECTAMENTE, VUELVE A VALIDAR Y CONTINÚA.
- Detén la ejecución como BLOQUEADA únicamente si existe una contradicción documental irresoluble que requiera decisión humana.

5. CONTROL DE ALCANCE Y CIERRE
- Verifica que solo se hayan modificado los archivos estrictamente necesarios.
- Actualiza el checkbox de Fase 9 en `docs/implementation/05-prisma-implementation-plan.md` si aplica.

REPORTE FINAL OBLIGATORIO
Al finalizar responde ÚNICAMENTE con este formato y DETENTE:

FASE 9 — CIERRE
• Estado: [COMPLETADA / BLOQUEADA]
• Objetivo de la fase: [Objetivo contractual]
• Elementos implementados: [Lista exacta de modelos]
• Relaciones implementadas: [Lista exacta de relaciones]
• Archivos modificados: apps/api/prisma/schema.prisma [, docs/implementation/05-prisma-implementation-plan.md]
• Archivos creados: NINGUNO
• Prisma format: OK
• Prisma validate: OK (Exit code 0)
• Autoauditoría: OK
• Migraciones: NO
• Fases posteriores implementadas: NO
• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA
• Bloqueos: NINGUNO
• Siguiente fase: Fase 10

DETENTE inmediatamente tras el reporte.