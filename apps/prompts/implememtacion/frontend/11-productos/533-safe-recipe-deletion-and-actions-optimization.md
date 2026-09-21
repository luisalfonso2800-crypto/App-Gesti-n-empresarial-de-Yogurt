TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Implementar la eliminación física segura de Recetas Técnicas protegiendo la trazabilidad productiva en el backend, y rediseñar/optimizar visualmente los botones de la columna "Acciones" en la tabla de recetas para que sean compactos, armónicos y funcionales.

ARCHIVOS A INTERVENIR:
1. `apps/api/src/recipes/recipes.service.js` (o controller/repository correspondiente)
2. `apps/web/src/app/catalog/recipes/components/` (Componente de fila o tabla de recetas donde se renderizan las acciones)
3. `apps/web/src/app/catalog/recipes/` (Hook o cliente HTTP de recetas)

INSTRUCCIONES TÉCNICAS:

1. Backend (`apps/api/src/recipes/`):
   - Endpoint `DELETE /recipes/:id` (o método `remove(id)`):
     * Verificar dependencias en `OrdenProduccion` (contar órdenes vinculadas a `idReceta`).
     * Verificar si el producto obtenido se usa como semielaborado/ingrediente en `DetalleReceta` de otras recetas.
     * Si cuenta con órdenes o dependencias históricas:
       Lanzar `ConflictException` ('No se puede eliminar la receta técnica porque cuenta con órdenes de producción o lotes fabricados asociados. Desactívela para archivarla.').
     * Si no tiene dependencias:
       Eliminar en transacción o en cascada sus ingredientes (`DetalleReceta`), etapas (`EtapaReceta`) y el registro maestro de `Receta`.
       Retornar `{ success: true, message: 'Receta eliminada correctamente' }`.

2. Optimización y Rediseño de Botones de Acciones (Frontend):
   - Rediseñar la columna "Acciones" para eliminar los botones anchos desproporcionados y adoptar un layout compacto:
     * Botón Principal / Edición: Reducir el texto a "Ver BOM" o "Editar" con un icono claro (`Eye` o `Pencil`), estilizado con borde neutro sutil y padding equilibrado (`px-2.5 py-1 text-xs font-medium`).
     * Botón Estado / Desactivar: Reemplazar el botón rojo rígido por un control compacto de estado (toggle o botón outline sutil que cambie entre "Desactivar" / "Activar" según `receta.activo`).
     * Botón Eliminar: Agregar botón compacto con icono de papelera (`Trash2` o similar) en tono rojo suave/hover (`text-rose-600 hover:bg-rose-50 p-1.5 rounded-md`).
     * Agrupación visual: Disponer los 3 botones en una fila horizontal alineada (`flex items-center justify-end gap-1.5`) para evitar saltos de línea innecesarios o desbordamientos en la tabla.
   - Confirmación y Gestión de Respuestas:
     * Confirmar antes de borrar (`¿Estás seguro de eliminar esta receta técnica?`).
     * Si el backend retorna conflicto (código 409): mostrar toast/alerta explicativa indicando que no puede borrarse por tener lotes fabricados y sugiriendo desactivarla.
     * Si el borrado es exitoso: mostrar toast de éxito y actualizar la tabla.
   - Mantener el límite arquitectural SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node --check apps/api/src/recipes/recipes.service.js`
2. `pnpm --filter api build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- La columna de acciones luce limpia, equilibrada y sin textos excesivamente largos.
- Se incorporan los botones de Ver BOM, Cambiar Estado y Eliminar en un solo grupo armónico.
- El backend bloquea el borrado si la receta tiene historial productivo y la elimina limpiamente si es una fórmula sin uso.
- `verify-srp` y compilación retornan código 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.