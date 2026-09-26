TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir la unidad de medida visual en Cava para productos comerciales envasados (Unidades vs Litros) y ocultar el bloque de reserva de inóculo en la liquidación de productos terminados comerciales:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/inventory/components/CavaInventoryTable.jsx` (o componente de la pestaña Cava)
2. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`

INSTRUCCIONES TÉCNICAS:

1. Corrección de Unidades en Cava (`CavaInventoryTable.jsx`):
   - En la columna "Stock Actual" de la tabla de Cava:
     * Evaluar la categoría o presentación del ítem:
       ```javascript
       const esComercialEnvasado = item.categoria === 'LACTEOS' || item.categoria === 'PRODUCTO_TERMINADO' || Boolean(item.presentacionId);
       const textoUnidad = esComercialEnvasado ? 'Unidades' : 'Litros';
       ```
     * Renderizar: `${item.stockActual} ${textoUnidad}`.
     * En el caso de `YOGURT BASE CON SEMIELABORADO - CONTENEDOR DE 16 OZ`, debe mostrar `25 Unidades` en lugar de `25 Litros`.

2. Ocultar Reserva de Inóculo en Productos Terminados (`ProductionOrderCompleteModal.jsx`):
   - Verificar la clasificación del producto que se está liquidando en la orden:
     * Solo renderizar el contenedor `<div className="..."> <input type="checkbox" ... /> Reservar fracción para próximo cultivo iniciador... </div>`:
       Si el producto pertenece a `BASES_LACTEAS` o `INTERMEDIO_WIP` (es decir, producto base en tanque).
     * Si el producto es comercial terminado (`LACTEOS`, producto envasado con contenedor):
       - NO mostrar la casilla ni los inputs de litros a reservar ni la caducidad del inóculo.
       - La orden se liquida al 100% como stock comercial terminado en unidades para Cava.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/inventory/components/...`
2. `node --check apps/web/src/app/operations/production/components/...`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- `YOGURT BASE CON SEMIELABORADO - CONTENEDOR DE 16 OZ` muestra "25 Unidades" en la Cava.
- Al liquidar una orden de producto comercial terminado, no aparece la opción de reservar inóculo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.