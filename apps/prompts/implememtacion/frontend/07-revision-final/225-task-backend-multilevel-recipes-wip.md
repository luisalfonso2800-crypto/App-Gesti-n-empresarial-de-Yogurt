OBJETIVO: Implementar la Fase 1 de Recetas Multinivel y Productos Intermedios (WIP a granel) en el backend: actualizar el esquema de datos Prisma, sincronizar base de datos, y adaptar el motor de recetas y producción para consumir tanto materias primas como bases semielaboradas con trazabilidad de lotes.

FUENTES DE VERDAD:
- Diseño de Arquitectura: `docs/diagnosticos/ARQUITECTURA_RECETAS_MULTINIVEL_WIP.md`
- Backend: `apps/api/prisma/schema.prisma`
- Repositorios: `apps/api/src/recipes/recipes.repository.js`, `apps/api/src/production/production.repository.js`
- DTOs: `apps/api/src/recipes/dto/`, `apps/api/src/production/dto/`
- Reglas: AGENTS.md (Reglas 1, 2, 9.1, 10, 15)

INSTRUCCIONES:

1. ESQUEMA DE DATOS (`apps/api/prisma/schema.prisma`):
   - En `DetalleReceta`:
     * Hacer opcional `idInsumo String? @map("ID_Insumo")` y su relación `insumo Insumo?`.
     * Agregar `idProductoIntermedio String? @map("ID_Producto_Intermedio")` con relación `productoIntermedio Producto? @relation("ProductoConsumidoReceta", fields: [idProductoIntermedio], references: [id])`.
     * Agregar índice `@@index([idProductoIntermedio])`.
   - En `Producto`:
     * Agregar la relación inversa `recetasConsumo DetalleReceta[] @relation("ProductoConsumidoReceta")`.
     * Agregar relación inversa si aplica en `DetalleProduccion`.
   - En `DetalleProduccion`:
     * Hacer opcional `idInsumo String? @map("ID_Insumo")` y su relación `insumo Insumo?`.
     * Agregar `idProductoIntermedio String? @map("ID_Producto_Intermedio")` con relación a `Producto`.
   - En `Lote`:
     * Agregar autorreferencia `idLotePadre String? @map("ID_Lote_Padre")`.
     * Agregar `lotePadre Lote? @relation("GenealogiaLotes", fields: [idLotePadre], references: [id])` y `lotesHijos Lote[] @relation("GenealogiaLotes")`.

2. SINCRONIZACIÓN Y PRESENTACIÓN ESTÁNDAR:
   - Ejecutar la sincronización del esquema:
     `pnpm --filter api exec prisma db push`
     `pnpm --filter api exec prisma generate`
   - Verificar si existe la presentación `A GRANEL` en la base de datos; si no existe, crearla programáticamente en la base de datos o script de inicialización con:
     `nombre: 'A GRANEL'`, `cantidadMl: 1000`, `cantidadOz: 33.81`, `tipoEnvase: 'TANQUE_GRANEL'`, `activo: true`.

3. REPOSITORIO DE RECETAS Y DTOs (`apps/api/src/recipes/`):
   - En DTOs (`create-recipe.dto.js`, `update-recipe.dto.js`):
     * Permitir recibir `idProductoIntermedio` opcional en cada ítem de ingredientes.
     * Validar que cada ingrediente tenga obligatoriamente o bien `idInsumo` o bien `idProductoIntermedio`.
   - En `recipes.repository.js`:
     * Incluir `productoIntermedio` en las consultas `findUnique` y `findAll` de recetas para retornar nombre, costoPromedio y unidad.

4. MOTOR DE PRODUCCIÓN DUAL (`apps/api/src/production/production.repository.js`):
   - En `getRecipeBom()`:
     * Para cada ingrediente: si tiene `idInsumo`, consultar stock en `prisma.inventario`; si tiene `idProductoIntermedio`, consultar stock disponible en `prisma.inventarioProducto` y `prisma.lote`.
   - En `completeProduction()` ($transaction):
     * Descuento de stock:
       - Si el detalle corresponde a `idInsumo`: descontar de `Inventario` y registrar `MovimientoInventario` (como hasta ahora).
       - Si el detalle corresponde a `idProductoIntermedio`: descontar de `InventarioProducto` (`cantidadActual: { decrement: qtyReal }`), registrar `MovimientoInventario` sobre el producto intermedio y deducir de `cantidadDisponible` del lote padre correspondiente.
     * Generación del nuevo Lote terminado:
       - Si la producción consumió un lote de base semielaborada, registrar `idLotePadre` en el nuevo registro de `Lote`.

VERIFICACIÓN:
1. `pnpm --filter api exec prisma generate` (código de salida 0).
2. Validar sintaxis con Babel/Node de:
   - `apps/api/src/recipes/recipes.repository.js`
   - `apps/api/src/production/production.repository.js`

SALIDA: Exclusivamente reporte conciso indicando: cambios aplicados en Prisma, resultado de db push/generate, métodos adaptados en repositorios y confirmación de verificación sintáctica. Sin texto de relleno.
```[cite: 1, 2, 3]