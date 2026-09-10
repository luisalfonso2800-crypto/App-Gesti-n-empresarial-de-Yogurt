TAREA CONTROLADA — RECETAS V2: FASE 1 (BASE DE DATOS Y API CORE)

OBJETIVO
Implementar de extremo a extremo la capa de persistencia y servicios backend para Recetas V2:
1. Actualizar el esquema Prisma con `EtapaReceta` y reestructurar `DetalleReceta`.
2. Ejecutar la migración en PostgreSQL de forma limpia.
3. Actualizar `seed-test-data.js` para sembrar recetas completas por etapas.
4. Rediseñar `RecipesRepository` y `RecipesController` con transacciones profundas (`prisma.$transaction`), sincronización no destructiva (`activo: false`) y endpoint BOM.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/prisma/schema.prisma
- apps/api/prisma/seed-test-data.js
- apps/api/src/recipes/recipes.repository.js
- apps/api/src/recipes/recipes.controller.js

REGLAS TÉCNICAS ESTRICTAS
1. Código backend exclusivamente en JavaScript (.js). PROHIBIDO TypeScript (.ts).
2. NO tocar el frontend (`apps/web`) en esta fase.
3. NO usar DELETE CASCADE para actualizar; usar sincronización (upsert/update y desactivación lógica con `activo: false`).
4. Mantener la configuración de índices en `DetalleReceta`: `@@index([idEtapaReceta])` y `@@index([idInsumo])`.

PASO 1: MODELADO DE DATOS (apps/api/prisma/schema.prisma)
- En `Receta`:
  * Agregar relación `etapas EtapaReceta[]`
- Crear modelo `EtapaReceta`:
  * id String @id @default(uuid()) @map("ID_Etapa_Receta")
  * idReceta String @map("ID_Receta")
  * receta Receta @relation(fields: [idReceta], references: [id])
  * nombre String @map("Nombre_Etapa")
  * orden Int @map("Orden")
  * tiempoMinimoMin Int? @map("Tiempo_Minimo_Min")
  * tiempoEstandarMin Int? @map("Tiempo_Estandar_Min")
  * tiempoMaximoMin Int? @map("Tiempo_Maximo_Min")
  * tempMinimaGrados Decimal? @map("Temp_Minima_Grados")
  * tempMaximaGrados Decimal? @map("Temp_Maxima_Grados")
  * instrucciones String? @map("Instrucciones")
  * detalles DetalleReceta[]
  * activo Boolean @default(true) @map("Activo")
  * @@map("Etapas_Receta")
- Ajustar modelo `DetalleReceta`:
  * Eliminar relación directa con `idReceta`.
  * Agregar `idEtapaReceta String @map("ID_Etapa_Receta")` y `etapa EtapaReceta @relation(fields: [idEtapaReceta], references: [id])`.
  * Mantener: `idInsumo`, `cantidadRequerida`, `unidad`, `mermaPorcentaje`, `activo`, `observaciones`.
  * Agregar: `esOpcional Boolean @default(false) @map("Es_Opcional")`
  * Agregar: `grupoVariante String? @map("Grupo_Variante")`
  * Agregar: `tipoInsumo String @default("BASE") @map("Tipo_Insumo")`
  * Definir índices: `@@index([idEtapaReceta])` y `@@index([idInsumo])`.

PASO 2: MIGRACIÓN Y SEMILLAS
- Ejecutar la migración:
  `pnpm --filter api prisma migrate dev --name recetas_v2_etapas_y_variantes`
- Generar cliente:
  `pnpm --filter api prisma generate`
- Actualizar `apps/api/prisma/seed-test-data.js`:
  * Ajustar la creación de recetas para que anide etapas ("Preparación de Base", "Fermentación", "Empaque") y dentro de ellas inserte sus `DetalleReceta` con los campos nuevos.
  * Ejecutar el seed para verificar integridad referencial en PostgreSQL.

PASO 3: BACKEND API CORE (apps/api/src/recipes/)
- Repositorio (`recipes.repository.js`):
  * Lecturas (`findAll`, `findById`): Incluir siempre la relación anidada completa:
    `include: { etapas: { where: { activo: true }, orderBy: { orden: 'asc' }, include: { detalles: { where: { activo: true }, include: { insumo: true } } } }, producto: true }`
  * Creación (`create`): Transaccional (`prisma.$transaction`). Debe recibir la cabecera junto a su array de `etapas` y sub-array de `detalles`, creándolos de forma anidada.
  * Actualización (`update`): Sincronización lógica sin DELETE CASCADE:
    - Actualizar cabecera de la receta.
    - Iterar etapas: actualizar existentes, crear nuevas y marcar con `activo: false` las que ya no vengan en el payload.
    - Iterar detalles por etapa: actualizar existentes, crear nuevos y marcar con `activo: false` los retirados.
    - Validar que no existan insumos activos duplicados dentro de la misma etapa.
- Controlador (`recipes.controller.js`):
  * Asegurar rutas REST (`GET /recipes`, `GET /recipes/:id`, `POST /recipes`, `PATCH /recipes/:id`).
  * Agregar endpoint `GET /recipes/:id/bom` que retorne la receta desglosada y consolidada por etapas y grupos de variante, lista para consumo analítico.

VALIDACIÓN
1. Ejecución sin errores de `prisma migrate` y `prisma generate`.
2. Ejecución exitosa de `seed-test-data.js`.
3. Arranque limpio de la API (`pnpm --filter api build` o arranque en dev) confirmando que no hay excepciones de sintaxis ni de consultas Prisma.

FORMATO DE CIERRE
Entregar exclusivamente este reporte:

FASE 1 RECETAS V2 (BACKEND Y DB) — CIERRE
• Estado: COMPLETADO / ERROR
• Migración Prisma ejecutada: SÍ / NO
• Seed actualizado y verificado: SÍ / NO
• Consulta anidada implementada: SÍ / NO
• Guardado y sincronización transaccional en Repository: SÍ / NO
• Endpoint BOM disponible: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]