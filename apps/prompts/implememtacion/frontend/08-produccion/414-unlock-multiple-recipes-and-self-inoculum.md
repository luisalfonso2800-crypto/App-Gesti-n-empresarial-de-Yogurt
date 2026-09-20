TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1. Desbloquear la selección de productos en el selector superior de "PRODUCTO A FABRICAR" de recetas para permitir múltiples recetas por producto (ej. variante de arranque vs recirculación con inóculo).
2. Permitir que el inóculo propio (`tipoItem === 'INOCULO_WIP'`) sea seleccionable en el BOM de la receta de su propio producto base (resolviendo la exclusión autorreferencial detectada en la auditoría).

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js` (o donde se filtran los productos disponibles para formular)
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `useRecipeForm.js` (o hook que provee los productos para "PRODUCTO A FABRICAR"):
   - Permitir que todos los productos activos (incluidos los que ya tienen alguna receta) estén disponibles en el desplegable superior `PRODUCTO A FABRICAR`.
   - Si existía un filtro como `.filter(p => !p.receta)` o similar, removerlo para habilitar formulaciones alternativas del mismo producto base.

2. En `RecipeStageBomTable.jsx`:
   - Ubicar el filtro de productos intermedios/semielaborados disponibles:
     ```javascript
     const availableWipProducts = products.filter(p => p.id !== currentRecipeProductId);
     ```
   - Reemplazar por:
     ```javascript
     const availableWipProducts = products.filter(p => 
       p.tipoItem === 'INOCULO_WIP' || p.id !== currentRecipeProductId
     );
     ```
   - Asegurar que `<optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">` liste las opciones donde `p.tipoItem === 'INOCULO_WIP'`.
   - Mantener el archivo bajo el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En "Nueva Receta Técnica", se puede seleccionar "YOGURT BASE" en el selector superior.
- En la etapa de Inoculación del BOM, el grupo "🧫 Iniciadores y Cepas (Inóculo WIP)" muestra visiblemente la opción de inóculo en gramos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.