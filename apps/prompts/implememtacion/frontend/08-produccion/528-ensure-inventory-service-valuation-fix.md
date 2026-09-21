TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 ARCHIVO - CERO LECTURAS):
Asegurar que la normalización de unidades en `apps/api/src/inventory/inventory.service.js` se aplique de forma incondicional cuando la unidad base del insumo sea masa/volumen menor (G, ML) y el costo registrado sea de orden mayor.

ARCHIVO A MODIFICAR:
`apps/api/src/inventory/inventory.service.js`

INSTRUCCIONES DIRECTAS:
1. En la función donde se enriquece el inventario de bodega (`data.map(item => ...)`):
   - Obtener la unidad base del insumo:
     `const unidadBase = (item.insumo?.unidadBase || item.unidadMedida || '').toUpperCase();`
   - Si `unidadBase` es 'G', 'GRAMO', 'GRAMOS', 'ML', 'MILILITRO' o 'MILILITROS':
     * Verificar la relación: si `costoUnitario > 100` (evidencia clara de que el costo registrado corresponde a 1 Kg o 1 L y no a 1 solo gramo o 1 ml), calcular:
       `const costoPorUnidadBase = costoUnitario / 1000;`
       `const valorTotal = Math.round(stockActual * costoPorUnidadBase);`
     * En caso contrario:
       `const valorTotal = Math.round(stockActual * costoUnitario);`
   - Asignar `costoUnitario: (costoPorUnidadBase !== undefined ? costoPorUnidadBase : costoUnitario)` y `valorTotal` al objeto de retorno.
2. Asegurar que `metadata.valorTotalBodega` sume los `valorTotal` normalizados:
   `valorTotalBodega: enriched.reduce((acc, curr) => acc + curr.valorTotal, 0)`

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.service.js`
2. `pnpm --filter api build`

CRITERIO DE FINALIZACIÓN:
- La valorización de YOGUR GRIEGO se calcula sobre $23.03/g (dando ~$36.925 y no $36.924.768).
- VALOR EN BODEGA desciende de los 6 mil millones a los valores de inventario reales de la planta.

DETENCIÓN:
Al compilar con código 0, DETENTE inmediatamente.
