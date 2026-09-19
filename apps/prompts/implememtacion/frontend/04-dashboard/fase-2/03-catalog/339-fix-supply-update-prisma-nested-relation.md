TAREA:
Corregir el error de Prisma `Argument precios: Invalid value provided` al actualizar un insumo en `supplies.repository.js`, saneando el objeto `data` para omitir campos inmutables y relaciones anidadas (`id`, `precios`, timestamps).

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Edición focalizada en el repositorio/servicio de insumos del backend y el payload de edición en frontend.

OBJETIVO:
1. En el backend (`apps/api/src/supplies/supplies.repository.ts` o `.js`):
   - Localizar el método `update(id, data)` (alrededor de la línea 51).
   - Sanear `data` antes de llamar a `this.prisma.insumo.update`:
     ```typescript
     const { id: _id, precios, createdAt, updatedAt, ...cleanData } = data;
     return this.prisma.insumo.update({
       where: { id },
       data: cleanData,
     });
     ```
2. En el frontend (`SupplyModal.jsx` o hook de guardado de Insumos):
   - Asegurar que al hacer `PUT` o `PATCH` no se adjunten propiedades relacionales de solo lectura (`precios`, `proveedores`, `lotes`).

3. Restricciones Técnicas:
   - Respetar los límites de SRP del proyecto.
   - Validar sintaxis con `node --check` o `pnpm build` según corresponda.

FUENTES DE VERDAD:
- `apps/api/src/supplies/supplies.repository.ts` (o `.js`)
- `apps/api/src/supplies/supplies.service.ts`
- Componente modal de edición de insumos en `apps/web/src/app/catalog/supplies/`

ALCANCE:

MODIFICAR:
- `apps/api/src/supplies/supplies.repository.ts` (o `.js`)
- (Opcional) Hook/modal de insumo en frontend para sanitizar el payload saliente.

VERIFICACIÓN:
1. Probar la actualización guardando los cambios de "FRESA COGELADA".
2. Confirmar que Prisma responda `200 OK` sin arrojar error de validación de argumentos.

CRITERIO DE FINALIZACIÓN:
- La edición del insumo persiste correctamente en la base de datos sin alertas rojas de Prisma.

DETENCIÓN:
Al validar sintaxis y verificar persistencia limpia, DETENTE.

SALIDA:
- Archivos modificados:
- Causa resuelta:
- Estado: