TAREA CONTROLADA — VALIDACIÓN DE CIERRE FASE 5 (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Certificar exclusivamente las relaciones base agregadas en Fase 5 dentro de apps/api/prisma/schema.prisma contra la sección de Fase 5 en docs/implementation/05-prisma-implementation-plan.md.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- Consulta EXCLUSIVAMENTE:
  1. docs/implementation/05-prisma-implementation-plan.md (Sección Fase 5)
  2. apps/api/prisma/schema.prisma
  3. git status -s
- PROHIBIDO auditar entidades de Fase 4 no involucradas, leer carpetas enteras o consultar docs/data-model/.
- PROHIBIDO implementar Fase 6, migraciones (`prisma migrate` prohibido) o refactorizar.
- Si hay un error de sintaxis generado por Fase 5, corrígelo en el schema y revalida. No toques nada más.

VERIFICACIÓN TÉCNICA
Ejecuta exclusivamente:
pnpm exec prisma validate --schema apps/api/prisma/schema.prisma

FORMATO DEL REPORTE FINAL
Emite únicamente una de las dos opciones y DETENTE:

[Si todo coincide y validate = Exit 0]
FASE 5 — VALIDACIÓN DE CIERRE
- Fidelidad de relaciones: EXACTA
- Relaciones faltantes: NINGUNA
- Relaciones fuera de alcance: NINGUNA
- Integridad Prisma: OK (Exit code 0)
- Archivos fuera de alcance: NINGUNO
- Discrepancias: NINGUNA
- Estado: VALIDADA
- Lista para Fase 6

[Si existe discrepancia o bloqueo]
FASE 5 — VALIDACIÓN DE CIERRE
- Estado: BLOQUEADA
- Discrepancia: [descripción exacta]
- Acción requerida: [acción puntual]

DETENTE inmediatamente tras el reporte.