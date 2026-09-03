TAREA CONTROLADA — FASE 15: CONSOLIDACIÓN DEL PATRÓN Y BLOQUE DE MAESTROS

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos interactivos o subshells de terminal lentas (`Select-String`, `findstr`, `grep`).
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
Consolidar el patrón arquitectónico demostrado por `Presentations` y `Supplies` (documentándolo en `docs/implementation/06-approved-module-pattern.md` si no existe) e implementar en un único ciclo el Bloque de Maestros:
1. Suppliers (Proveedores)
2. Supplier Prices (Precios de Proveedor / Insumo)
3. Products (Productos)
4. Recipes (Recetas y DetalleReceta)
Respetando el esquema Prisma migrado en PostgreSQL, ejecutando pruebas unitarias/integración de los 4 módulos y realizando una autoauditoría integral del bloque.

1. FUENTES DE VERDAD OBLIGATORIAS
Consultar de forma directa:
- `AI_PROJECT_OPERATING_MANUAL.md`
- `docs/implementation/03-module-implementation-order.md`
- `docs/backend/` (convenciones de arquitectura, excepciones y transacciones)
- `docs/domains/` y `docs/data-model/` (entidades `Proveedor`, `Producto`, `Receta`, `DetalleReceta`, etc.)
- `apps/api/prisma/schema.prisma`
- `apps/api/src/presentations/` y `apps/api/src/supplies/` (referencia del patrón)

2. LÍMITES ESTRICTOS (PROHIBICIONES)
- NO implementar módulos posteriores: Purchases, Inventory, Production, Lots, Sales, Payments, Expenses.
- La existencia de relaciones en Prisma con tablas operativas NO autoriza a implementar lógica o controladores de esas tablas.
- NO alterar campos, tipos ni nulabilidad en `schema.prisma` salvo discrepancia documental justificada.
- PROHIBIDO sobrearquitecturar con generic repositories, bases abstractas prematuras, CQRS o event buses.

3. CONSOLIDACIÓN Y ALCANCE POR MÓDULO
- Patrón común: Module, Controller, Service, Repository, DTOs (Create/Update/Response), registro en `AppModule`.
- Suppliers: Gestión de proveedores, datos fiscales/contacto, estados y validaciones.
- Supplier Prices: Historial/precios por proveedor e insumo respetando unicidad y vigencia documental.
- Products: Relación canónica con `Presentacion`, restricciones y campos funcionales.
- Recipes: Estructura relacional con `DetalleReceta`, cantidades, unidades, relación Producto/Insumo. No usar JSON serializado si el modelo relacional ya existe.

4. PRUEBAS Y VALIDACIÓN TÉCNICA
- Implementar suite de pruebas para cada uno de los 4 módulos (crear, consultar, actualizar, validar restricciones de relación).
- Ejecutar:
    pnpm --filter api exec prisma validate
    pnpm --filter api exec prisma generate
    pnpm --filter api test
    pnpm --filter api build (registrar NO CONFIGURADO si no existe script de build)

5. AUTOAUDITORÍA DEL BLOQUE Y DOCUMENTACIÓN
- Si se documenta el patrón, registrarlo en `docs/implementation/06-approved-module-pattern.md`.
- Actualizar el estado del plan en `docs/implementation/05-prisma-implementation-plan.md` o el documento de avance modular vigente.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 15 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]

• Patrón de módulo: OK / ERROR

• Suppliers:
  Module: OK / ERROR
  Controller: OK / ERROR
  Service: OK / ERROR
  Repository: OK / ERROR
  DTOs: OK / ERROR
  Validaciones: OK / ERROR
  Pruebas: OK / ERROR

• Supplier Prices:
  Module: OK / ERROR
  Controller: OK / ERROR
  Service: OK / ERROR
  Repository: OK / ERROR
  DTOs: OK / ERROR
  Validaciones: OK / ERROR
  Pruebas: OK / ERROR

• Products:
  Module: OK / ERROR
  Controller: OK / ERROR
  Service: OK / ERROR
  Repository: OK / ERROR
  DTOs: OK / ERROR
  Validaciones: OK / ERROR
  Pruebas: OK / ERROR

• Recipes:
  Module: OK / ERROR
  Controller: OK / ERROR
  Service: OK / ERROR
  Repository: OK / ERROR
  DTOs: OK / ERROR
  Validaciones: OK / ERROR
  Pruebas: OK / ERROR

• Relaciones: OK / ERROR
• Persistencia: OK / ERROR
• Prisma format: OK / ERROR
• Prisma validate: OK / ERROR
• Prisma generate: OK / ERROR
• Build: OK / ERROR / NO CONFIGURADO
• Lint: OK / ERROR / NO CONFIGURADO
• Autoauditoría: OK / ERROR
• Migraciones: NO APLICA / APLICADA / ERROR

• Decisiones documentales: NINGUNA / [detalle]

• Documentos modificados: [lista]
• Archivos creados: [lista]
• Archivos modificados: [lista]
• Archivos eliminados: [lista]

• Cambios fuera de alcance: NINGUNO / [detalle]
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO / [detalle]

• Siguiente fase: Bloque Abastecimiento

DETENTE inmediatamente tras el reporte.