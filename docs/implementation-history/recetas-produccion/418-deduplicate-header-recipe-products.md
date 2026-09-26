TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Desduplicar las opciones del selector superior "PRODUCTO A FABRICAR" en `RecipeHeaderFields.jsx` para erradicar el error de consola de keys duplicadas (`header-prod-f4a36a2d-a62d-41df-8e82-d11bf8a50268`):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeHeaderFields.jsx`:
   - En el filtrado de productos antes del render del `<select name="idProducto">`:
     * Desduplicar la lista por `p.id` garantizando que cada ID aparezca exactamente una vez.
     * Descartar cualquier variante sintética (ignorar si tiene `p.idItem` o si `p.tipoItem === 'INOCULO_WIP'` o `p.tipoItem === 'BASE_GRANEL'`).
     ```javascript
     const uniqueProducts = Array.from(
       new Map(
         products
           .filter(p => !p.tipoItem || p.tipoItem === 'PRODUCTO_COMERCIAL')
           .map(p => [p.id, p])
       ).values()
     );
     ```
   - Renderizar el mapeo sobre `uniqueProducts`:
     ```jsx
     {uniqueProducts.map((p) => {
       const presLabel = p.presentacion?.nombre ? ` (${p.presentacion.nombre})` : '';
       return (
         <option key={`header-prod-${p.id}`} value={p.id}>
           {p.nombre}{presLabel}
         </option>
       );
     })}
     ```
   - Mantener el componente bajo el umbral SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En "PRODUCTO A FABRICAR" solo aparecen 2 opciones limpias (sin duplicados ni textos anidados repetidos).
- Desaparece el error de consola de React por keys duplicadas.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.