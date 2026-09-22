TAREA CONTROLADA — PRISMA FASE 4: ENTIDADES MAESTRAS (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Escribir exclusivamente los 5 modelos de Entidades Maestras en apps/api/prisma/schema.prisma:
1. Presentaciones (Presentation)
2. Insumos (Supply / RawMaterial)
3. Proveedores (Supplier)
4. Productos (Product)
5. Clientes (Customer / Client)

REGLAS DE CONSUMO ESTRICTO (AHORRO DE TOKENS)
- Modifica ÚNICAMENTE: apps/api/prisma/schema.prisma
- Lee EXCLUSIVAMENTE: la sección de definición de campos de estas 5 entidades en docs/implementation/05-prisma-implementation-plan.md.
- PROHIBIDO leer otros archivos, documentación externa, manuales o código fuente en apps/api/src/.
- PROHIBIDO crear archivos nuevos o modificar documentación.

LÍMITES ESTRICTOS DE ALCANCE (FASE 4 AISLADA)
- PROHIBIDO agregar campos de relación entre modelos (sin @relation, sin Foreign Keys a otras tablas; eso pertenece a la Fase 5).
- PROHIBIDO definir modelos de fases posteriores (Lotes, Compras, Ventas, Inventario, etc.).
- PROHIBIDO ejecutar migraciones en la base de datos (nada de prisma migrate, no tocar PostgreSQL).
- PROHIBIDO tocar archivos en apps/api/src/, package.json o configuraciones.

VERIFICACIÓN TÉCNICA
1. Formatear y validar el esquema ejecutando únicamente:
   pnpm exec prisma format --schema apps/api/prisma/schema.prisma
2. Validar que no haya errores de sintaxis en el schema.

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

PRISMA FASE 4 — ENTIDADES MAESTRAS
- Presentaciones: IMPLEMENTADA
- Insumos: IMPLEMENTADA
- Proveedores: IMPLEMENTADA
- Productos: IMPLEMENTADA
- Clientes: IMPLEMENTADA
- Archivo modificado: apps/api/prisma/schema.prisma
- Migraciones ejecutadas: NO
- Relaciones de Fase 5 implementadas: NO
- Verificación del schema: [Válido / Formateado con éxito]
- Bloqueos: [NINGUNO / detalle breve]

DETENTE inmediatamente tras el reporte.