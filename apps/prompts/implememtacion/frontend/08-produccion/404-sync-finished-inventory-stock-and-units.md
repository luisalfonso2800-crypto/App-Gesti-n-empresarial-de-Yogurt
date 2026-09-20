TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Sincronizar el stock de Cava (Inventario de Producto Terminado) con la suma real de sus lotes activos y corregir la unidad de medida:
1. En `inventory.repository.js` (en `findFinishedProducts`): Calcular dinámicamente el `stockActual` sumando la `cantidadActual` de los lotes activos (`tipoLote: 'PRODUCTO_TERMINADO'`, `cantidadActual > 0`), en lugar de devolver un acumulador plano desfasado.
2. Formatear la unidad de medida: Si el producto es a granel o base líquida (como YOGURT BASE), reflejar su unidad en "Litros" (o "L") y nunca en "und".
3. En `InventoryStockTable.jsx` (o componente que renderiza la tabla de Cava): Mostrar la unidad real proveniente del producto/lote (`{stockActual} Litros` o `{stockActual} L`) y calcular la valorización multiplicando el stock real sumado por el costo ponderado.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js`
2. `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `inventory.repository.js` (`findFinishedProducts`):
   - Al consultar los productos para el inventario de Cava:
     * Incluir sus lotes disponibles:
       ```javascript
       lotes: {
         where: {
           tipoLote: 'PRODUCTO_TERMINADO',
           cantidadActual: { gt: 0 }
         }
       }
       ```
     * Calcular para cada producto:
       ```javascript
       const stockRealLotes = item.producto.lotes?.reduce((acc, l) => acc + Number(l.cantidadActual || 0), 0) || 0;
       ```
     * Retornar `cantidadActual: stockRealLotes` (única fuente de verdad) y la unidad de medida adecuada (`item.producto.unidadMedida || 'Litros'`).
     * Calcular `valorizacionTotal`: `stockRealLotes * (item.costoPromedio || item.producto.costoEstandar || 0)`.

2. En `InventoryStockTable.jsx`:
   - En la columna "Stock Actual":
     * Renderizar el valor numérico acompañado de su unidad real: `{item.cantidadActual} {item.producto?.unidadMedida || item.unidadMedida || 'Litros'}` en vez de hardcodear o forzar "und".
   - Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pestaña de Cava muestra el volumen real de lotes activos (ej. 3 Litros en vez de 10 und).
- La unidad de medida para Yogurt Base se visualiza en Litros.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.