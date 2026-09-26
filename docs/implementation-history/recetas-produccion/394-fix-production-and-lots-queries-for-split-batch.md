TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Resolver la visibilidad del Split Batch (inóculo vs envasado) en backend y frontend:
1. En `production.repository.js`: En las funciones `findAll` y `findById`, incluir obligatoriamente en el query de Prisma la relación de lotes generados y lotes hijos (`include: { lotes: { include: { lotesHijos: true } } }`) para que el frontend reciba el desglose de inóculo guardado.
2. En `lots.repository.js`: Permitir que `findAll` retorne tanto `PRODUCTO_TERMINADO` como `SEMIELABORADO_WIP`, asegurando que la unidad de medida no sea "UNIDAD" sino la unidad real del lote/producto ('Litros' o 'ml').
3. En `ProductionOrderCard.jsx`: Asegurar que renderice el desglose si `order.lotes?.[0]?.lotesHijos?.length > 0` o si la orden tiene guardada la división.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `production.repository.js`:
   - En las consultas `prisma.produccion.findMany` y `findUnique`:
     * Agregar en el `include`:
       ```javascript
       lotes: {
         include: {
           lotesHijos: true
         }
       }
       ```
   - Si la orden guardó la división, asegurar que los datos del sub-lote hijo (`SEMIELABORADO_WIP`) y el lote padre viajen en la respuesta JSON.

2. En `ProductionOrderCard.jsx`:
   - Extraer la información de división desde `order.lotes`:
     ```javascript
     const lotePrincipal = order.lotes?.[0];
     const loteHijoInoculo = lotePrincipal?.lotesHijos?.[0];
     const tieneInoculo = Boolean(loteHijoInoculo || order.reservaInoculo?.cantidad > 0);
     const cantInoculo = loteHijoInoculo?.cantidadInicial || order.reservaInoculo?.cantidad || 0;
     const cantEnvasar = (order.cantidadReal || lotePrincipal?.cantidadInicial || 0) - (loteHijoInoculo ? 0 : cantInoculo);
     ```
   - Si `tieneInoculo`:
     * Mostrar en el grid de volumen:
       - `🥛 DISPONIBLE PARA ENVASAR`: `{cantEnvasar} Litros`
       - `🧫 INICIADOR GUARDADO`: `{cantInoculo} Litros ({loteHijoInoculo?.codigoLote || 'INOC'})`
     * Añadir el enlace directo a cada lote en cava/trazabilidad.
   - Si no tiene inóculo: mostrar el bloque clásico `{order.cantidadReal} Litros obtenidos`.
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El endpoint de producción entrega la estructura genealógica de los lotes.
- La Bitácora renderiza las dos pastillas operativas en cuanto existe una reserva de inóculo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.