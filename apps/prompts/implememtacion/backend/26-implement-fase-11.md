TAREA CONTROLADA — FASE 11: IMPLEMENTACIÓN, VALIDACIÓN Y CIERRE AUTÓNOMO (CONSUMO ULTRA BAJO)

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells largas.
- Usa la herramienta de lectura nativa directa (Read / readFile) para inspeccionar archivos.
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format` y `pnpm --filter api exec prisma validate`. NUNCA usar `npx`.

1. LECTURA OBLIGATORIA
Antes de modificar cualquier archivo, lee:
- AI_PROJECT_OPERATING_MANUAL.md
- docs/implementation/05-prisma-implementation-plan.md (Sección Fase 11)
- Los documentos de docs/data-model/ relacionados con la Fase 11.
- Las decisiones documentadas de las fases anteriores que puedan afectar esta fase.
- apps/api/prisma/schema.prisma

Determina antes de implementar:
- Alcance exacto de la Fase 11.
- Modelos nuevos y modelos existentes a modificar.
- Relaciones nuevas y relaciones a reutilizar de Fases 1–10.
- Elementos pertenecientes a fases posteriores (PROHIBIDO implementarlos).

2. CONTINUIDAD DEL ESQUEMA
apps/api/prisma/schema.prisma representa el estado técnico actual del proyecto.
- NO reconstruyas modelos existentes ni elimines elementos implementados previamente.
- Si una relación existente satisface una dependencia de Fase 11, reutilízala sin duplicar.
- Solo modifica elementos anteriores cuando el contrato vigente de Fase 11 lo exija expresamente.

3. IMPLEMENTACIÓN Y LÍMITES ESTRICTOS
- Implementa exclusivamente el alcance de la Fase 11 respetando tipos, nulabilidad, defaults, IDs, @map, @@map, restricciones y FKs.
- PROHIBIDO agregar campos o relaciones por conveniencia.
- PROHIBIDO crear controladores, servicios, DTOs, módulos, repositorios o código de aplicación.
- PROHIBIDO crear o ejecutar migraciones físicas (`prisma migrate` prohibido).

4. RESOLUCIÓN AUTÓNOMA DE CONTRADICCIONES Y TRAZABILIDAD
Si encuentras una contradicción documental resoluble, aplica la jerarquía:
1. Decisiones previamente ratificadas.
2. Reglas explícitas del dominio y cardinalidades explícitas.
3. Contrato de relaciones y entidades.
4. Plan de implementación.

Si es resoluble: aplica la decisión, implementa, corrige el documento y deja constancia en la documentación de decisiones existente sin crear archivos duplicados. Si no hay decisiones nuevas, indica: `Decisiones documentales: Ninguna`.

5. VALIDACIÓN TÉCNICA Y AUTOAUDITORÍA
- Ejecuta los comandos técnicos:
    pnpm --filter api exec prisma format
    pnpm --filter api exec prisma validate
- Realiza autoauditoría completa contra el contrato: entidades, campos, decoradores Prisma, continuidad Fases 1–10 y ausencia de fases posteriores.
- Actualiza `docs/implementation/05-prisma-implementation-plan.md` con el estado real.

6. CRITERIO DE BLOQUEO
Solo declara BLOQUEADA si existe una decisión de negocio con múltiples interpretaciones técnicas válidas que difieran semánticamente y que no pueda resolverse mediante las fuentes de verdad.

REPORTE FINAL OBLIGATORIO
Al finalizar responde ÚNICAMENTE con este formato y DETENTE:

FASE 11 — CIERRE
• Estado: [COMPLETADA / BLOQUEADA]
• Objetivo de la fase: [Objetivo contractual identificado]
• Modelos implementados: [Lista exacta]
• Modelos modificados: [Lista exacta]
• Relaciones implementadas: [Lista exacta]
• Relaciones reutilizadas: [Lista exacta]
• Decisiones documentales: [Ninguna / Detalle canónico]
• Documentos modificados: [docs/implementation/05-prisma-implementation-plan.md, etc.]
• Archivos modificados: apps/api/prisma/schema.prisma
• Archivos creados: NINGUNO
• Archivos eliminados: NINGUNO
• Prisma format: OK
• Prisma validate: OK (Exit code 0)
• Autoauditoría: OK
• Migraciones: NO
• Fases posteriores implementadas: NO
• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA
• Bloqueos: NINGUNO
• Siguiente fase: [Fase 12 y su objetivo según el plan]

DETENTE inmediatamente tras el reporte.