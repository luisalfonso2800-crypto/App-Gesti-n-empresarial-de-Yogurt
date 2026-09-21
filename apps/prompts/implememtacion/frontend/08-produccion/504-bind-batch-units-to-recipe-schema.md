TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer que toda la trazabilidad de producción (planificación, orden en proceso y modal de liquidación) sea 100% agnóstica y dinámica, usando estrictamente la unidad de medida definida en la receta técnica (Litros, Unidades, Kilos, etc.):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.service.js` (o repository de creación de órdenes)
2. `apps/web/src/app/production/components/ProductionLiquidationModal.jsx` (y/o `ActiveBatchCard.jsx`)

INSTRUCCIONES TÉCNICAS:

1. Backend (`production.service.js`):
   - Al crear una nueva orden de producción:
     * Consultar la receta asociada con su campo de unidad:
       `const unidadReceta = receta.unidadRendimiento || receta.unidad || 'Unidades';`
     * Guardar la orden con esa unidad técnica exacta en `unidadMedida` o `unidadRendimiento`.
     * Al consultar órdenes activas (`findActiveBatches`), incluir la relación con la receta o exponer `unidadMedida: orden.unidadMedida || orden.receta?.unidadRendimiento`.

2. Frontend (`ProductionLiquidationModal.jsx` y `ActiveBatchCard.jsx`):
   - Eliminar cualquier valor hardcodeado ('Litros' o 'Unidades').
   - Resolver la unidad técnica dinámicamente:
     ```javascript
     const unidad = (
       orden?.receta?.unidadRendimiento ||
       orden?.receta?.unidad ||
       orden?.unidadMedida ||
       'Unidades'
     ).trim();
     ```
   - En `ActiveBatchCard.jsx`:
     * Renderizar en la tarjeta:
       `<p className="text-sm font-semibold text-slate-800">{orden.cantidadPlanificada || orden.volumen} {unidad} en proceso</p>`
   - En `ProductionLiquidationModal.jsx`:
     * Renderizar el título del campo:
       `<label className="block text-xs font-semibold text-slate-700 uppercase">CANTIDAD / VOLUMEN OBTENIDO ({unidad})</label>`
     * En el botón o resumen de confirmación:
       `<span>Entrada a Stock: {cantidadObtenida || 0} {unidad}</span>`
   - Respetar el límite de líneas SRP (< 135 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/api/src/production/...`
2. `node --check apps/web/src/app/production/components/ProductionLiquidationModal.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Si la receta está en Unidades, la tarjeta y la modal muestran 'Unidades'.
- Si la receta está en Litros (ej. bases a granel), la tarjeta y la modal muestran 'Litros'.
- Ninguna unidad de medida queda forzada estáticamente en el código.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
