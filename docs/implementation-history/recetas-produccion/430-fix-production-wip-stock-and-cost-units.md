TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la validación de stock y el cálculo de costo de semielaborados WIP en el modal de planificación/lanzamiento de producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo responsable de calcular la disponibilidad de insumos en producción (ej. `apps/api/src/production/production.service.js` o `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` / `ProductionPlanningModal.jsx`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. Normalización de unidades en validación de stock WIP:
   - Si el insumo del BOM es una Base WIP consumida en gramos (`g` o `ml`) y el lote registrado en inventario está en litros (`L` o `Litros`):
     * Convertir el stock disponible a la unidad requerida: `stockEnGramos = stockEnLitros * 1000`.
     * Los 3 Litros del lote `fad038d5` deben computarse como 3000 g, cubriendo holgadamente los 300 g requeridos.
   - Considerar el stock del lote vigente `fad038d5` (o la sumatoria de lotes `SEMIELABORADO_WIP` activos).

2. Corrección del costo unitario del inóculo en el BOM de Producción:
   - Si la unidad requerida es 'g' o 'ml' y el `costoUnitario` proviene de litros (> 100 COP):
     * Dividir entre 1000: `costoUnitarioReal = costoUnitario / 1000` ($4,39 COP/g).
   - El subtotal para 300 g debe ser $1.317 COP (en lugar de $1.317.000 COP).
   - Con esto, el estado del insumo cambia a "Suficiente", la alerta roja de compra desaparece y se habilita el botón "Iniciar Fabricación Inmediata".
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check <archivo_modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En la tabla BOM de producción, `YOGURT BASE INICIADOR YOGURT COMERCIAL (Base / WIP)` muestra:
  * Req. Teórico: 300.00 g
  * Stock Actual: 3000.00 g (o 3 L)
  * Costo Unit.: $4.39 (o$ 4)
  * Subtotal: $ 1.317 COP
  * Estado: "Suficiente" (en verde).
- Desaparece la alerta "Disparar Lista de Compra".
- Se habilita el botón "Iniciar Fabricación Inmediata".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.