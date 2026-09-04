TAREA CONTROLADA — FASE 13: DESPLIEGUE DE PERSISTENCIA Y MÓDULO PRESENTATIONS

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos interactivos o subshells de terminal lentas (`Select-String`, `findstr`, `grep`).
- Inspecciona y escribe archivos exclusivamente mediante las herramientas nativas del entorno (Read / Write / Edit).
- PROHIBIDO ejecutar `prisma migrate dev` sin parámetro de nombre. Usar OBLIGATORIAMENTE `--name init_database_v1`.
- PROHIBIDO ejecutar `prisma migrate reset` o comandos destructivos.
- Comandos CLI permitidos:
  * `pnpm --filter api exec prisma migrate status`
  * `pnpm --filter api exec prisma migrate dev --name init_database_v1`
  * `pnpm --filter api exec prisma format`
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test` o script de pruebas existente
  * `pnpm --filter api build`
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en la terminal, reportes o Git.

OBJETIVO
1. Sincronizar de forma no destructiva el schema Prisma validado con PostgreSQL mediante `prisma migrate dev --name init_database_v1`.
2. Implementar el módulo funcional Presentations respetando la arquitectura documentada (Controller, Service, Repository, DTOs, Module).
3. Validar, probar, autoauditar contra la documentación de dominio/contrato y cerrar la fase en un solo ciclo.

1. FUENTES DE VERDAD
Consultar de forma directa:
- `AI_PROJECT_OPERATING_MANUAL.md`
- `docs/implementation/05-prisma-implementation-plan.md`
- `docs/implementation/03-module-implementation-order.md`
- Documentación de arquitectura en `docs/backend/`
- Modelo y entidades en `docs/data-model/` (entidad `Presentacion`)
- `apps/api/prisma/schema.prisma`

2. ALCANCE ESTRICTO
- A. Migración e inicialización de persistencia física en PostgreSQL (`yogurt_dev`).
- B. Módulo `Presentations`: DTOs (Create/Update/Response), Repository, Service, Controller y registro en `AppModule` (o módulo raíz correspondiente).
- C. Pruebas unitarias o de integración para el módulo Presentations.
- D. Actualización del plan en `docs/implementation/05-prisma-implementation-plan.md`.
- PROHIBIDO adelantar lógica o módulos de fases posteriores (Insumos, Proveedores, Productos, etc.).

3. PROTECCIÓN Y EJECUCIÓN DE MIGRACIÓN
- Inspeccionar `apps/api/prisma/migrations/` y el estado físico antes de migrar.
- Ejecutar `prisma migrate status`.
- Si no existen migraciones previas, ejecutar `prisma migrate dev --name init_database_v1`.
- Si ya existe una migración equivalente aplicada, no forzar ni resetear; continuar a la validación física.
- Confirmar que las tablas físicas existan y reflejen el schema aprobado.

4. IMPLEMENTACIÓN DEL MÓDULO PRESENTATIONS
- Repository: aislamiento de persistencia mediante `PrismaService`.
- Service: reglas de negocio documentadas (manejo de activo/inactivo, campos funcionales, restricciones).
- Controller: endpoints REST conformes a convenciones API del proyecto.
- DTOs: validación estricta de entradas (class-validator si está configurado en el proyecto).
- Manejo de excepciones alineado a la infraestructura existente.

5. PRUEBAS Y VALIDACIÓN TÉCNICA
- Ejecutar validaciones técnicas:
    pnpm --filter api exec prisma validate
    pnpm --filter api exec prisma generate
- Ejecutar suite de pruebas del módulo Presentations.
- Ejecutar build (`pnpm --filter api build`) si está configurado para certificar cero errores de tipado TypeScript.
- Autoauditar contra el contrato: verificar que ningún cambio fuera de alcance haya sido introducido.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con la siguiente estructura:

FASE 13 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• PostgreSQL: OK / ERROR
• Migración Prisma: OK / ERROR
• Persistencia física: OK / ERROR
• Módulo Presentations: OK / ERROR
• Module: OK / ERROR
• Controller: OK / ERROR
• Service: OK / ERROR
• Repository: OK / ERROR
• DTOs: OK / ERROR
• Validaciones: OK / ERROR
• Pruebas: OK / ERROR / NO CONFIGURADAS
• Prisma format: OK / ERROR
• Prisma validate: OK / ERROR
• Prisma generate: OK / ERROR
• Build: OK / ERROR / NO CONFIGURADO
• Autoauditoría: OK / ERROR
• Migraciones: APLICADA / PREVIA DETECTADA
• Decisiones documentales: NINGUNA / [detalle]
• Documentos modificados: [lista]
• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]
• Cambios fuera de alcance: NINGUNO / [detalle]
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO / [detalle]
• Siguiente fase: Módulo Supplies

DETENTE inmediatamente tras el reporte.