# TAREA CONTROLADA — FASE 1: MIGRACIÓN PRISMA PARA AGREGAR CAMPOS AL MODELO PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

## OBJETIVO TÉCNICO:
1. Agregar 3 columnas nuevas al modelo `Producto` en `schema.prisma`:
   - `codigo String? @unique` (código corto humano, ej: YOG-FRE-500)
   - `costoEstimado Decimal? @db.Decimal(12, 2)` (costo manual del artesano)
   - `unidadVenta String @default("UND")` (unidad de venta simple)
2. Agregar/Verificar columna en el modelo `InventarioProducto`:
   - `stockMinimo Decimal @default(0) @db.Decimal(12, 2)` (ya existe según auditoría, verificar)
3. Crear la migración Prisma correspondiente.
4. Actualizar seeds si es necesario para no romper tests existentes.
5. CERO modificaciones a código de producción (frontend/backend). Solo schema y migración.

## FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- `apps/api/prisma/schema.prisma` (modelo Producto + InventarioProducto)
- `apps/api/prisma/migrations/**` (última migración para ver el formato)
- `apps/api/prisma/seed*.js` (para actualizar si es necesario)

## REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO modificaciones a frontend (`apps/web/**`).
- CERO modificaciones a backend (`apps/api/src/**`).
- Solo schema + migración.
- NO eliminar columnas existentes.
- NO cambiar tipos de columnas existentes.
- Todas las columnas nuevas deben ser `nullable` u `opcionales con default` para no romper datos existentes.

## ACCIONES A EJECUTAR:

1. **Editar `apps/api/prisma/schema.prisma`:**
   En el modelo `Producto`, agregar las siguientes columnas:
   ```prisma
   model Producto {
     // ... campos existentes ...
     codigo         String?   @unique
     costoEstimado  Decimal?  @db.Decimal(12, 2)
     unidadVenta    String    @default("UND")
     // ... resto de campos ...
   }
   ```
