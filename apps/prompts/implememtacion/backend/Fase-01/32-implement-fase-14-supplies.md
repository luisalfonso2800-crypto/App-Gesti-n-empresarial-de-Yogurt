TAREA CONTROLADA — FASE 14: IMPLEMENTACIÓN, PRUEBAS Y CIERRE DEL MÓDULO SUPPLIES

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos interactivos o subshells lentas de terminal (`Select-String`, `findstr`, `grep`).
- Inspecciona y escribe archivos exclusivamente mediante las herramientas nativas del entorno (Read / Write / Edit).
- PROHIBIDO ejecutar `prisma migrate reset` o alterar el esquema salvo inconsistencia documental comprobada.
- Comandos CLI permitidos:
  * `pnpm --filter api exec prisma format`
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test` (o script de test del workspace/módulo)
  * `pnpm --filter api build` (si está configurado)
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en terminal o reportes.

OBJETIVO
Implementar el módulo funcional Supplies (Insumos) en `apps/api/src/` respetando el modelo relacional `Insumo` ya migrado en PostgreSQL, la arquitectura establecida en `Presentations` (Module, Controller, Service, Repository, DTOs), validaciones de dominio, pruebas de comportamiento y autoauditoría en un único ciclo.

1. FUENTES DE VERDAD OBLIGATORIAS
Consultar de forma directa:
- `AI_PROJECT_OPERATING_MANUAL.md`
- `docs/implementation/03-module-implementation-order.md`
- `docs/backend/` (convenciones de arquitectura, excepciones y transacciones)
- `docs/domains/` y `docs/data-model/` (entidad `Insumo`, campos, tipos y reglas de unicidad/activación)
- `apps/api/prisma/schema.prisma` (modelo canónico `Insumo`)
- `apps/api/src/` (revisar la convención establecida por `Presentations`)

2. LÍMITES ESTRICTOS (PROHIBICIONES)
- NO implementar módulos posteriores: Suppliers, Products, Recipes, Purchases, Inventory, etc.
- La existencia de claves foráneas o relaciones en `Insumo` NO autoriza implementar controladores ni servicios de entidades foráneas.
- NO alterar campos, tipos ni nulabilidad en `schema.prisma` salvo discrepancia documental justificada.
- NO crear columnas artificiales de soft-delete (`deletedAt`) si el modelo usa la bandera `Activo`.

3. ESTRUCTURA DEL MÓDULO SUPPLIES
- DTOs: `CreateSupplyDto`, `UpdateSupplyDto`, response interfaces con validación estricta de tipos y campos requeridos/opcionales.
- Repository: operaciones de persistencia mediante `PrismaService` (aislando consultas de Prisma sin lógica de negocio).
- Service: reglas de dominio (validación de unicidad de código/nombre según contrato, manejo de activación/desactivación, tratamiento de stock mínimo).
- Controller: endpoints REST respetando nomenclatura, versionado y formatos globales de respuesta.
- Module: registro en `AppModule` sin dependencias circulares.

4. PRUEBAS Y VALIDACIÓN TÉCNICA
- Implementar suite de pruebas del módulo (creación válida, rechazo de datos inválidos, consulta por ID, listado, actualización, manejo de inexistentes).
- Ejecutar:
    pnpm --filter api exec prisma validate
    pnpm --filter api exec prisma generate
    pnpm --filter api test
    pnpm --filter api build (registrar NO CONFIGURADO si no existe script de build)

5. AUTOAUDITORÍA Y DOCUMENTACIÓN
- Contrastar campos, nulabilidades y restricciones implementadas contra `01-entities.md` y `schema.prisma`.
- Actualizar el estado de la Fase 14 en `docs/implementation/05-prisma-implementation-plan.md` o el documento de avance modular vigente.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 14 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• PostgreSQL: OK / ERROR
• Módulo Supplies: OK / ERROR
• Module: OK / ERROR
• Controller: OK / ERROR
• Service: OK / ERROR
• Repository: OK / ERROR / NO APLICA
• DTOs: OK / ERROR
• Validaciones: OK / ERROR
• Pruebas: OK / ERROR / NO CONFIGURADAS
• Persistencia: OK / ERROR
• Prisma format: OK / ERROR
• Prisma validate: OK / ERROR
• Prisma generate: OK / ERROR
• Build: OK / ERROR / NO CONFIGURADO
• Lint: OK / ERROR / NO CONFIGURADO
• Autoauditoría: OK / ERROR
• Migraciones: NO APLICA / APLICADA
• Decisiones documentales: NINGUNA / [detalle]
• Documentos modificados: [lista]
• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]
• Cambios fuera de alcance: NINGUNO / [detalle]
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO / [detalle]
• Siguiente fase: Módulo Suppliers

DETENTE inmediatamente tras el reporte.