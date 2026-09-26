TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la concatenación duplicada del nombre en la tabla de Cava (`InventoryStockTable.jsx`):
Evitar mostrar "YOGURT BASE - YOGURT BASE" cuando la presentación tenga el mismo nombre que el producto o cuando no posea una presentación comercial diferenciada.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `InventoryStockTable.jsx`:
   - Ubicar la columna "Producto Terminado" donde se muestra el título de la fila.
   - Formatear el label evitando duplicidades:
     ```javascript
     const prodNombre = item.producto?.nombre || item.nombre || 'Producto';
     const presNombre = item.presentacion?.nombre || item.presentacionNombre;
     const etiquetaCompleta = presNombre && presNombre.trim().toLowerCase() !== prodNombre.trim().toLowerCase()
       ? `${prodNombre} - ${presNombre}`
       : prodNombre;
     ```
   - Renderizar `etiquetaCompleta`.
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla muestra de forma limpia "YOGURT BASE" sin repetir el texto.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.