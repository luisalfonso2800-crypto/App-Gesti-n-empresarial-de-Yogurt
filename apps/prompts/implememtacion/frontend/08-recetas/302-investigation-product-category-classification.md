TAREA:
Auditar la definición de categorías en el modelo `Producto` (backend y frontend) para incorporar formalmente la clasificación estructurada de `TOPPING_CEREAL` (semielaborado WIP) y eliminar la dependencia de filtros basados en nombres de texto.

OBJETIVO:
1. **Auditoría Backend (`apps/api/prisma/schema.prisma` y controladores de productos):**
   - Verificar cómo está tipado el campo `categoria` en el modelo `Producto` (¿es `String` libre o `enum CategoriaProducto`?).
   - Determinar si agregar el valor `'TOPPING_CEREAL'` o `'CEREAL_WIP'` requiere migración de Prisma o si ya es compatible como string/enum.
2. **Auditoría Frontend (`apps/web/src/app/catalog/products/`):**
   - Inspeccionar las opciones del dropdown de categoría en el modal de Nuevo Producto.
   - Proponer la inclusión obligatoria de la opción técnica `Topping / Cereal Porcionado (WIP)` con su valor normalizado.
3. **Ajuste en Recetas (`apps/web/src/app/catalog/recipes/`):**
   - Actualizar `PackagingWizardModal.jsx` para que filtre estrictamente por `p.categoria === 'TOPPING_CEREAL'` en lugar de evaluar strings como `'CEREAL'` o `'GRANOLA'`.

FUENTES DE VERDAD:
- `apps/api/prisma/schema.prisma`
- `apps/api/src/products/`
- `apps/web/src/app/catalog/products/`
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`

REGLA DE CONSULTA OBLIGATORIA:
Fase de diagnóstico y reporte técnico. Prohibido ejecutar `prisma migrate reset` o cambios destructivos en base de datos.

SALIDA:
- Tipo de dato actual de `categoria` en Prisma:
- Opciones de categoría actuales en Frontend:
- Propuesta de migración / adición segura:
- Estado: