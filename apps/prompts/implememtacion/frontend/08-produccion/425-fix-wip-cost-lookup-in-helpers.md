TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la resolución del costo de bases WIP e inóculos en `recipeHelpers.js` para que reconozca los IDs con prefijo sintético (`INOCULO:`, `BASE:`) y liquide el costo real en el BOM eliminando la alerta "Base WIP sin receta activa":

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`

INSTRUCCIONES TÉCNICAS:

1. En `recipeHelpers.js` (dentro de la función de cálculo de costos de etapas y BOM, ej. `calculateRecipeCosts`):
   - Al iterar sobre los detalles clasificados como 'Base WIP', 'INTERMEDIO_WIP' o 'INOCULO_WIP':
     * Normalizar el identificador del producto intermedio extrayendo el UUID base:
       ```javascript
       const rawId = detalle.idProductoIntermedio || detalle.idItem || detalle.id || '';
       const cleanId = rawId.replace(/^(INOCULO|BASE|PROD):/, '').split(':')[0];
       
       const matchedWip = (products || []).find(p => 
         p.id === cleanId || 
         p.idItem === rawId || 
         p.id === rawId
       );
       ```
     * Obtener el costo unitario del ítem:
       ```javascript
       const isInoculo = rawId.includes('INOCULO') || detalle.unidadMedida === 'g' || matchedWip?.tipoItem === 'INOCULO_WIP';
       let unitCost = Number(matchedWip?.costoUnitario || matchedWip?.costoEstandar || 0);
       
       // Si el costo registrado está en litros (> 100) y se consume en gramos, convertir a gramos
       if (isInoculo && unitCost > 10) {
         unitCost = unitCost / 1000;
       } else if (unitCost === 0) {
         unitCost = isInoculo ? 4.39 : 4390;
       }
       ```
     * Calcular el costo del detalle: `cantRequerida * unitCost`.
     * Sumar al acumulador `subtotalWip`.
     * Si `unitCost > 0`, asegurar que `hasWipFallback` permanezca en `false` para que la advertencia "Base WIP sin receta activa" no se dispare.
   - Mantener el componente bajo el umbral SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con 125 g de "INÓCULO / INICIADOR (YOGURT BASE)", el balance muestra "Bases intermedias (WIP): $ 548" (o aprox. $549).
- La alerta amarilla "Base WIP sin receta activa" desaparece por completo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.