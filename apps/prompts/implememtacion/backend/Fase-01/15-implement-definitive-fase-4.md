TAREA CONTROLADA — IMPLEMENTACIÓN DEFINITIVA PRISMA FASE 4 (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Escribir de forma completa los 5 modelos maestros en `apps/api/prisma/schema.prisma` respetando estrictamente el contrato cerrado en `docs/implementation/06-decisiones-fase-4-prisma.md`.
PROHIBIDO TOMAR NUEVAS DECISIONES O INTERPRETAR CAMPOS.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- Archivo editable: ÚNICAMENTE `apps/api/prisma/schema.prisma`.
- Fuente de verdad exclusiva: `docs/implementation/06-decisiones-fase-4-prisma.md`.
- PROHIBIDO modificar `apps/api/src/`, `package.json`, configuraciones o crear migraciones (`prisma migrate` prohibido).
- PROHIBIDO agregar directivas `@relation` o campos de relación foránea (la relación Producto → Presentación y demás corresponden a Fase 5).
- Si encuentras alguna contradicción insalvable, DETÉN la ejecución y repórtala de inmediato sin inventar soluciones.

ESPECIFICACIÓN TÉCNICA OBLIGATORIA
1. Convención: Modelos en PascalCase, atributos en camelCase, mapeo con @@map y @map a los nombres físicos del contrato.
2. Identificadores: String @id @default(uuid()) en cada entidad.
3. Activo: Boolean @default(true) en cada entidad.
4. Decimales: Usar Decimal con la precisión definida (ej. Decimal(12,2) para precioVenta, Decimal(5,2) para margenObjetivo, etc.). Prohibido Float.
5. Tapilla: Atributo String? dentro de Presentacion. Sin entidad independiente.
6. Restricción Producto: @@unique([nombre, idPresentacion]) a nivel de atributos escalares, SIN relación formal `@relation`.
7. Proveedor: nitCedula NO debe ser @unique.

VERIFICACIÓN TÉCNICA
Ejecuta exclusivamente en terminal:
1. pnpm exec prisma format --schema apps/api/prisma/schema.prisma
2. pnpm exec prisma validate --schema apps/api/prisma/schema.prisma

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

PRISMA FASE 4 — IMPLEMENTACIÓN
- Estado: [COMPLETADA / BLOQUEADA]
- Modelos implementados: Presentacion, Insumo, Proveedor, Producto, Cliente
- Archivo modificado: apps/api/prisma/schema.prisma
- Migraciones ejecutadas: NO
- Relaciones Fase 5: NO
- prisma format: [OK / ERROR]
- prisma validate: [Exit code 0 / ERROR]
- Archivos adicionales modificados: [lista / NINGUNO]
- Discrepancias con el contrato: [lista / NINGUNA]
- Bloqueos: [lista / NINGUNO]

DETENTE inmediatamente tras el reporte.