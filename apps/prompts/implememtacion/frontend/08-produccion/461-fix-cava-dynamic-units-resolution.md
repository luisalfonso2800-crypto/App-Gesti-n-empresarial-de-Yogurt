TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer que la tabla de Cava respete la unidad de medida definida por la receta técnica y la presentación del producto (Unidades para envasados, Litros para bases a granel):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js` (o servicio que provee los items de cava)
2. `apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Backend (`inventory.repository.js`):
   - Al consultar los productos o inventario para la vista de Cava (`BASES_LACTEAS`, `PRODUCTO_TERMINADO`, `LACTEOS`):
     * Incluir `presentacion: true` y `recetas: { take: 1, select: { unidad: true } }`.
     * Asignar en cada item la propiedad:
       ```javascript
       const unidadReceta = prod.recetas?.[0]?.unidad;
       const esEnvasado = Boolean(prod.presentacionId || prod.categoria === 'LACTEOS');
       item.unidadMedida = unidadReceta || (esEnvasado ? 'Unidades' : 'Litros');
       ```

2. Frontend (`InventoryStockTable.jsx`):
   - En el formateador de stock de la fila:
     ```javascript
     const getUnitText = (item) => {
       const u = (item.unidadMedida || item.unidad || '').toLowerCase();
       if (u.includes('und') || u.includes('unidad') || item.categoria === 'LACTEOS' || item.presentacionId) {
         return 'Unidades';
       }
       if (u.includes('kg') || u.includes('kilo')) return 'Kg';
       if (u.includes('g') || u.includes('gramo')) return 'g';
       if (u.includes('ml')) return 'ml';
       return 'Litros';
     };
     ```
   - Renderizar: `${item.stockActual} ${getUnitText(item)}`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `node --check apps/web/src/app/operations/inventory/components/InventoryStockTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- `YOGURT BASE CON SEMIELABORADO - CONTENDOR DE 16 OZ` muestra `25 Unidades`.
- `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO - YOGURT A GRANEL` muestra `58,917 Litros`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.