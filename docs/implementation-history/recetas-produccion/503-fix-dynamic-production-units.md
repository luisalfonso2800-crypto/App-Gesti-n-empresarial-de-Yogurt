TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer que tanto la orden de fabricación como su tarjeta activa y modal de liquidación respeten dinámicamente la unidad de medida de la receta (Unidades, Litros, Kilos) en lugar de hardcodear 'Litros':

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/ActiveBatchCard.jsx` (o componente que renderiza la tarjeta 'VOLUMEN / CANTIDAD')
2. `apps/web/src/app/production/components/ProductionLiquidationModal.jsx` (o modal de liquidación de lote)

INSTRUCCIONES TÉCNICAS:

1. Tarjeta de Lote Activo (`ActiveBatchCard.jsx`):
   - Extraer la unidad técnica de la orden:
     ```javascript
     const unidad = orden.receta?.unidadRendimiento || orden.unidadMedida || orden.producto?.presentacion?.unidad || 'Unidades';
     ```
   - En el bloque 'VOLUMEN / CANTIDAD', reemplazar el texto hardcodeado `Litros en proceso`:
     `<p className="font-semibold text-slate-800">{orden.cantidadPlanificada || orden.volumen} {unidad} en proceso</p>`

2. Modal de Liquidación (`ProductionLiquidationModal.jsx`):
   - Obtener la misma variable dinámica:
     ```javascript
     const unidad = orden?.receta?.unidadRendimiento || orden?.unidadMedida || 'Unidades';
     ```
   - Cambiar la etiqueta del campo de entrada superior:
     * Si `unidad.toLowerCase().includes('und')`: Mostrar `CANTIDAD OBTENIDA (UNIDADES)` y placeholder `Ej: 6`.
     * Si `unidad.toLowerCase().includes('litro')`: Mostrar `VOLUMEN OBTENIDO (LITROS)`.
     * En el texto de reserva para inóculo/cepa o producto final, respetar `{cantidadFinal} {unidad} para Entrada a Stock`.
   - Respetar el límite de líneas SRP (< 135 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ActiveBatchCard.jsx`
2. `node --check apps/web/src/app/production/components/ProductionLiquidationModal.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta en proceso de "YOGURT PURO" muestra "6 Unidades en proceso" en lugar de "6 Litros en proceso".
- Al pulsar "Finalizar y Liquidar Lote", el formulario solicita "Unidades obtenidas" y no "Litros obtenidos".
- Si la receta es de Base Láctea a granel, sigue mostrando Litros correspondientemente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
