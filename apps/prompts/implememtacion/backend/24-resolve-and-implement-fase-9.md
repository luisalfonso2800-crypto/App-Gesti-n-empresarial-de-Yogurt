TAREA CONTROLADA — FASE 9: RESOLUCIÓN DOCUMENTAL, IMPLEMENTACIÓN Y CIERRE (LOTES Y TRAZABILIDAD)

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells largas.
- Usa la herramienta de lectura nativa directa (Read / readFile) para inspeccionar archivos.
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format` y `pnpm --filter api exec prisma validate`. NUNCA usar `npx`.

1. OBJETIVO
Resolver el bloqueo documental detectado en la Fase 9, actualizar la documentación técnica correspondiente e implementar completamente los modelos, campos y relaciones de Lotes y Trazabilidad en `apps/api/prisma/schema.prisma`.

2. RESOLUCIÓN DE LA CONTRADICCIÓN DOCUMENTAL (DECISIÓN CANÓNICA)
- Contradicción identificada: `01-entities.md` planteaba `ID_Lote` en `Produccion`, mientras que `02-relationships.md` (regla 20) define `PRODUCCION 1 ──────── N LOTE`.
- Decisión ratificada: La cardinalidad canónica es `Produccion 1 ──────── N Lote`.
  * Una `Produccion` puede tener muchos `Lotes` (`lotes Lote[]`).
  * Cada `Lote` pertenece a una única `Produccion` (`produccion Produccion @relation(...)`).
  * La FK obligatoria reside en `Lote` como `idProduccion` (o según convención de nombres `@map("id_produccion")`).
  * PROHIBIDO colocar `idLote` en el modelo `Produccion`.

3. ACTUALIZACIÓN DOCUMENTAL OBLIGATORIA
Antes de modificar el esquema:
- Corrige la definición contradictoria en `docs/data-model/01-entities.md` ajustándola a la regla canónica `Produccion 1 ──── N Lote`.
- Si el proyecto mantiene un registro de decisiones en `docs/implementation/`, añade una entrada breve ratificando esta resolución para evitar futuros bloqueos.

4. IMPLEMENTACIÓN EN PRISMA
- Modifica `apps/api/prisma/schema.prisma` agregando los modelos y relaciones correspondientes a Fase 9 (Lotes y Trazabilidad).
- Extiende el modelo `Produccion` existente únicamente para incorporar la relación inversa `lotes Lote[]`.
- Respeta nombres, tipos Prisma, nulabilidad, defaults, `@map`, `@@map`, PKs, FKs y restricciones de integridad.
- PROHIBIDO implementar entidades de ventas, despachos o fases posteriores (Fase 10+).
- PROHIBIDO ejecutar migraciones en base de datos (`prisma migrate` prohibido).
- PROHIBIDO tocar archivos de aplicación en `apps/api/src/`.

5. VALIDACIÓN Y AUTOAUDITORÍA
- Ejecuta los comandos técnicos:
    pnpm --filter api exec prisma format
    pnpm --filter api exec prisma validate
- Realiza autoauditoría contra el contrato actualizado. Si detectas un error sintáctico o discrepancia menor originada en este turno, corrígela directamente y vuelve a validar.
- Actualiza el seguimiento de Fase 9 en `docs/implementation/05-prisma-implementation-plan.md`.

INFORME FINAL OBLIGATORIO
Al terminar, devuelve únicamente el bloque estructurado y DETENTE:

FASE 9 — CIERRE
• Estado: [COMPLETADA / BLOQUEADA]
• Objetivo de la fase: Implementar Lotes y Trazabilidad
• Modelos implementados: [Lista exacta]
• Relaciones implementadas: [Lista exacta]
• Decisión documental resuelta: Produccion 1 -> N Lote (FK en Lote: idProduccion)
• Documentos modificados: [docs/data-model/01-entities.md, docs/implementation/05-prisma-implementation-plan.md, etc.]
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
• Siguiente fase: Fase 10

DETENTE inmediatamente tras el reporte.