TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Hacer explícita y transparente la causa exacta de bloqueo por trazabilidad al intentar eliminar un producto, tanto en el mensaje de error del backend como en el modal de confirmación del frontend.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.service.js`
2. `apps/web/src/app/catalog/products/` (Componente del modal de eliminación o fila de producto)

INSTRUCCIONES TÉCNICAS:

1. Backend (`products.service.js`):
   - En la función de eliminación (`remove(id)`):
     * Recopilar detalladamente las dependencias encontradas:
       - Si `lotesCount > 0`: agregar `"${lotesCount} lote(s) registrados en planta/cava"`
       - Si `stockActual > 0`: agregar `"${stockActual} unidades en existencia en Cava"`
       - Si `recetasCount > 0`: agregar `"1 receta técnica asociada"`
       - Si `detalleVentasCount > 0`: agregar `"${detalleVentasCount} venta(s) facturadas"`
       - Si `produccionesCount > 0`: agregar `"${produccionesCount} orden(es) de producción"`
     * Si el arreglo de razones no está vacío:
       Lanzar `ConflictException` con un mensaje estructurado y transparente:
       `No se puede eliminar el producto debido a su trazabilidad activa: ${razones.join(', ')}. Debe descartar o agotar sus existencias antes de purgarlo, o desactivarlo en su lugar.`

2. Frontend (`apps/web/src/app/catalog/products/`):
   - Al capturar el error `409` o respuesta de conflicto en el modal de eliminación:
     * Renderizar el mensaje detallado directamente en la alerta roja del modal para que el usuario sepa exactamente qué lote o stock debe gestionar.
   - Respetar límite arquitectural SRP (< 130 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.service.js`
2. `pnpm --filter api build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Al intentar eliminar "Yogur Tradicional Melocotón 1L", el sistema no muestra un mensaje genérico, sino: *"No se puede eliminar el producto debido a su trazabilidad activa: 1 lote(s) registrados en planta/cava, 95 unidades en existencia en Cava..."*
- `verify:srp` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.