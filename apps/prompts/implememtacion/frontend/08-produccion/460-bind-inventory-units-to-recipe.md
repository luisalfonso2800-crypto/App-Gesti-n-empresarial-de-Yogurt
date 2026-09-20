TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Hacer dinámica la unidad de medida en las tablas de inventario/cava para que respete estrictamente la unidad definida en la receta técnica del producto (Litros, Unidades, Kg, etc.) y no aplique textos estáticos forzados:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx` (o componente de tabla de inventario/cava) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Resolución Dinámica de Unidad de Medida:
   - Al renderizar la celda "Stock Actual" en cada fila:
     ```javascript
     // Prioridad: unidad explícita del producto/inventario proveniente de su receta activa
     const rawUnit = item.unidadMedida || item.unidad || item.recetas?.[0]?.unidad || '';
     let displayUnit = rawUnit;
     
     // Normalización amigable según la unidad registrada:
     if (/und|unidad/i.test(rawUnit)) {
       displayUnit = 'Unidades';
     } else if (/^l$|litro/i.test(rawUnit) || (!rawUnit && item.categoria === 'BASES_LACTEAS')) {
       displayUnit = 'Litros';
     } else if (/^kg$|kilo/i.test(rawUnit)) {
       displayUnit = 'Kg';
     } else if (/^g$|gramo/i.test(rawUnit)) {
       displayUnit = 'g';
     } else if (/^ml$|mililitro/i.test(rawUnit)) {
       displayUnit = 'ml';
     } else {
       displayUnit = rawUnit || 'Unidades';
     }
     ```
   - Renderizar el valor formateado:
     `{Number(item.stockActual || 0).toLocaleString()} {displayUnit}`

2. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- `YOGURT BASE CON SEMIELABORADO - CONTENDOR DE 16 OZ` muestra `25 Unidades`.
- `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO - YOGURT A GRANEL` muestra `58.9 Litros` (no unidades).
- Cada fila respeta la dimensión configurada en la receta sin sobreescrituras arbitrarias.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.