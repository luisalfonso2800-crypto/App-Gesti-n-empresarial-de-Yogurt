TAREA CONTROLADA — FASE 12: VALIDACIÓN INTEGRAL DEL MODELO PRISMA (GATE DE PERSISTENCIA V1)

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells de terminal lentas.
- Inspecciona los archivos mediante la herramienta nativa de lectura directa (Read / readFile).
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format`, `pnpm --filter api exec prisma validate` y `pnpm --filter api exec prisma generate`. NUNCA usar `npx`.

OBJETIVO
Realizar la validación integral del modelo Prisma actualmente implementado.
Esta fase NO debe rediseñar el modelo, agregar funcionalidades nuevas ni iniciar la implementación de módulos de negocio.
Su objetivo es determinar si `apps/api/prisma/schema.prisma` representa fielmente el modelo documentado y si está técnicamente preparado para dar paso a la construcción funcional del backend NestJS.

DOCUMENTACIÓN OBLIGATORIA
Antes de modificar cualquier archivo, consulta de forma directa:
- `AI_PROJECT_OPERATING_MANUAL.md`
- `docs/implementation/05-prisma-implementation-plan.md`
- Documentos relevantes en `docs/data-model/` (especialmente `01-entities.md`, `02-relationships.md`, y `12-vba-fidelity-validation.md` si existe).
- Decisiones ratificadas en `docs/implementation/`.
- `apps/api/prisma/schema.prisma`

ALCANCE DE LA VALIDACIÓN INTEGRAL
Audita sistemáticamente en una sola pasada:
1. ENTIDADES: Presentacion, Insumo, Proveedor, Producto, Receta, DetalleReceta, Compra, DetalleCompra, Inventario, MovimientoInventario, Produccion, DetalleProduccion, Lote, Cliente, Venta, DetalleVenta, PagoCliente, Gasto (y las que el contrato formalice).
2. CAMPOS: Nombres, correspondencia, tipos, nulabilidad, defaults, identificadores funcionales vs técnicos.
3. MAPEOS: Directivas `@map` y `@@map` fieles al diseño relacional / legacy VBA documentado.
4. RELACIONES Y CARDINALIDADES: Verificar contra `02-relationships.md` (respetando cardinalidades canónicas resueltas, ej: `Produccion 1 -> N Lote` con FK en Lote).
5. RESTRICCIONES E ÍNDICES: `@id`, `@unique`, `@@unique`, `@@index` y claves foráneas.
6. DECIMALES Y PRECISIÓN: Tipos `Decimal` estrictos en montos, costos, cantidades y precios (sin `Float` en dinero).
7. FECHAS: Distinción entre fechas funcionales de negocio y auditorías técnicas (`createdAt`, `updatedAt`).
8. TAPILLA Y REGLAS ESPECIALES: Respetar decisiones ratificadas previamente sin reabrirlas sin motivo.
9. ACCIONES REFERENCIALES: Coherencia en `onDelete` / `onUpdate` según reglas documentadas.
10. LÍMITES: Cero migraciones físicas (`prisma migrate` prohibido) y cero código de aplicación NestJS.

REGLA DE DISCREPANCIAS Y AUTOCORRECCIÓN
- Si encuentras un error inequívoco de sintaxis, omisión menor de campo o decorador `@map`: corrígelo directamente en `schema.prisma`.
- Si la discrepancia implica una contradicción de diseño de negocio no resuelta: NO inventes, detén esa sección y repórtala como BLOQUEO documental.

VALIDACIÓN TÉCNICA OBLIGATORIA
Ejecutar en orden:
  pnpm --filter api exec prisma format
  pnpm --filter api exec prisma validate
  pnpm --filter api exec prisma generate

CRITERIO DE CIERRE
Solo se declara COMPLETADA si la validación técnica tiene Exit code 0 Y la autoauditoría de fidelidad documental es 100% satisfactoria. Actualiza `docs/implementation/05-prisma-implementation-plan.md` reflejando el cierre de la Fase 12.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
FASE 12 — CIERRE

• Estado: [COMPLETADA / BLOQUEADA]
• Objetivo: Validación Integral del Modelo Prisma V1
• Entidades verificadas: [Lista o cantidad total]
• Campos: OK
• Tipos: OK
• Nulabilidad: OK
• Defaults: OK
• IDs: OK
• Relaciones: OK
• Cardinalidades: OK
• Foreign Keys: OK
• Restricciones: OK
• Índices: OK
• @map / @@map: OK
• Decimales: OK
• Fechas: OK
• Trazabilidad: OK
• Eliminación / Cascade: OK
• Autoauditoría: OK
• Prisma format: OK
• Prisma validate: OK (Exit code 0)
• Prisma generate: OK (Exit code 0)
• Migraciones: NO (Aplican en gate posterior)
• Archivos modificados: apps/api/prisma/schema.prisma [, docs/implementation/05-prisma-implementation-plan.md]
• Decisiones documentales: [Ninguna / Detalle]
• Discrepancias: NINGUNA
• Bloqueos: NINGUNO
• Preparación para siguiente etapa: PERSISTENCIA V1 APROBADA - LISTO PARA MÓDULOS BACKEND

DETENTE inmediatamente tras el reporte.