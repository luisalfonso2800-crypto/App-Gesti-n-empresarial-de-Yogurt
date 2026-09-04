TAREA CONTROLADA — FASE 10: IMPLEMENTACIÓN, VALIDACIÓN Y CIERRE AUTÓNOMO

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells largas.
- Inspecciona archivos exclusivamente mediante la herramienta nativa de lectura directa (Read / readFile).
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format` y `pnpm --filter api exec prisma validate`. NUNCA usar `npx`.

1. DOCUMENTACIÓN OBLIGATORIA
Antes de modificar cualquier archivo, lee de forma directa:
- AI_PROJECT_OPERATING_MANUAL.md
- docs/implementation/05-prisma-implementation-plan.md (Sección Fase 10)
- Los documentos de docs/data-model/ relacionados con la Fase 10.
- Decisiones documentadas previas en docs/implementation/.
- apps/api/prisma/schema.prisma

No comiences la implementación hasta comprender el alcance exacto de Fase 10 y qué relaciones de Fases 1–9 ya existen.

2. REGLA DE CONTINUIDAD DEL ESQUEMA Y DEPENDENCIAS
El schema.prisma actual es la fuente del estado técnico implementado.
- NO reconstruyas modelos existentes desde cero.
- Antes de modificar un modelo, identifica sus campos, relaciones y restricciones actuales.
- Determina qué relaciones ya existen para reutilizarlas sin duplicar.
- Identifica modelos nuevos, claves foráneas y dependencias evitando regresiones.

3. IMPLEMENTACIÓN
Implementa únicamente el alcance definido para la Fase 10 en `apps/api/prisma/schema.prisma`.
- Respeta nombres, tipos Prisma, nulabilidad, defaults, IDs, `@map`, `@@map`, restricciones, FKs y cardinalidades.
- PROHIBIDO inventar reglas de negocio o campos fuera de contrato.
- PROHIBIDO crear controladores, servicios, DTOs, módulos, repositorios, endpoints o código de aplicación.
- PROHIBIDO ejecutar o crear migraciones (`prisma migrate` prohibido).

4. RESOLUCIÓN AUTÓNOMA Y TRAZABILIDAD DE CONTRADICCIONES
Si encuentras una contradicción documental, resuélvela mediante la jerarquía:
1. Decisiones previamente ratificadas.
2. Reglas explícitas del dominio y cardinalidades explícitas.
3. Contrato de relaciones y entidades.
4. Plan de implementación.

Si es resoluble: toma la decisión canónica, implementa, corrige el documento contradictorio y registra brevemente la decisión en la documentación existente sin crear duplicados.

5. VALIDACIÓN TÉCNICA Y AUTOAUDITORÍA
- Ejecuta los comandos técnicos:
    pnpm --filter api exec prisma format
    pnpm --filter api exec prisma validate
- Realiza autoauditoría completa contra la documentación: modelos, campos, tipos, nulabilidad, defaults, decoradores, continuidad de Fases 1–9 y ausencia de fases posteriores.
- Actualiza `docs/implementation/05-prisma-implementation-plan.md` con el estado real.

6. CRITERIO DE BLOQUEO
Declara BLOQUEADA únicamente si existe una decisión de negocio ambigua que no pueda inferirse del contrato ni de las reglas de precedencia. No bloquees por contradicciones menores resolubles.

REPORTE FINAL OBLIGATORIO
Al finalizar, responde únicamente con este formato y DETENTE:

FASE 10 — CIERRE
• Estado: [COMPLETADA / BLOQUEADA]
• Objetivo de la fase: [Breve descripción contractual]
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
• Siguiente fase: Fase 11

DETENTE inmediatamente tras el reporte.