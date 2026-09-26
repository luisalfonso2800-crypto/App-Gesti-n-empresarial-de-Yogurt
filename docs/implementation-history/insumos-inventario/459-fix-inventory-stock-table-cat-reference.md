TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir el ReferenceError: cat is not defined en la línea 155 de `InventoryStockTable.jsx`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `InventoryStockTable.jsx` alrededor de la línea 150-160 y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx` (o la ruta equivalente bajo `src/app/...`)

INSTRUCCIONES TÉCNICAS:

1. Localizar la referencia `cat` en la línea 155:
   - Identificar el objeto del elemento de la iteración actual (ej. `item`, `row`, `producto`).
   - Corregir el acceso a la categoría:
     * Si se usó `cat === ...`, cambiarlo a `item.categoria === ...` o declarar previamente `const cat = item?.categoria || '';`.
     * Asegurar que no existan variables huérfanas en la evaluación de unidades (`Unidades` vs `Litros`).
   - Mantener intacta la lógica de visualización de unidades y categorías.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx` (o validación sintáctica de React/JSX según el pipeline)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pestaña de Cava/Inventario renderiza sin lanzar `ReferenceError: cat is not defined`.
- Se muestra la tabla de existencias normalmente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.