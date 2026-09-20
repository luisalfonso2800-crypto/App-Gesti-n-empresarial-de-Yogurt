TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
1. Limpieza visual en Inventario WIP (`InventoryWipTable.jsx`): Mostrar de forma prominente el código de lote hijo (`lote.codigoLote`, ej: INOC-B7378C) en lugar del UUID primario de base de datos.
2. Consumo de inóculo interno en producción (`production.repository.js` y `ProductionPlanningModal.jsx`):
   - Cuando la receta requiera un insumo intermedio o base láctea, consultar los lotes disponibles en `SEMIELABORADO_WIP`.
   - Permitir seleccionar el lote de inóculo disponible (por FIFO) y reflejar el stock actual en el BOM de la orden en lugar de marcar faltante comercial.
   - En el backend, registrar el descuento con `SALIDA_PRODUCCION_WIP` vinculando `idLotePadre`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 3 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/inventory/components/InventoryWipTable.jsx`
2. `apps/web/src/app/operations/production/components/ProductionPlanningModal.jsx`
3. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `InventoryWipTable.jsx`:
   - En la columna "Lote / Cepa":
     * Mostrar en texto principal destacado: `lote.codigoLote || lote.id.slice(0, 8)`.
     * Mostrar como nota secundaria o tooltip: "Reserva de inóculo / Lote Padre: " + (lote.lotePadre?.codigoLote || 'Inicial').

2. En `ProductionPlanningModal.jsx`:
   - En la lista de insumos/BOM:
     * Si el detalle de receta apunta a un producto intermedio (`idProductoIntermedio`), consultar la existencia de lotes `SEMIELABORADO_WIP`.
     * Mostrar el badge: `🧫 Cepa disponible en cava: X Litros ({codigoLote})`.
     * Marcar el estado como "Suficiente" si la suma de los lotes WIP activos cubre el requerimiento teórico.

3. En `production.repository.js`:
   - Al crear o confirmar la orden de producción que usa inóculo:
     * Validar la deducción del lote WIP seleccionado (FIFO).
     * Disminuir `cantidadActual` del lote de inóculo.
     * Guardar el movimiento `SALIDA_PRODUCCION_WIP`.
     * Asignar `idLotePadre` en la nueva orden para que la nueva tanda conserve la genealogía de la cepa.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/components/InventoryWipTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla de semielaborados muestra claramente `INOC-XXXX`.
- La planificación de una nueva receta de yogurt reconoce el inóculo existente y descuenta de su lote.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.