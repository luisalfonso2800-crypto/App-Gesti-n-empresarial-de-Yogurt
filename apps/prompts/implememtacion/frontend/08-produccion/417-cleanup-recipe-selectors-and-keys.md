TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1. Limpiar el selector superior "PRODUCTO A FABRICAR" (`RecipeHeaderFields.jsx` o modal principal) para que solo liste productos maestros reales del catálogo, excluyendo variantes inyectadas como inóculos o bases intermedias sintéticas.
2. Resolver el error de claves duplicadas de React en el selector BOM (`RecipeStageBomTable.jsx`) asignando `key` estrictamente única a cada `<option>`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeHeaderFields.jsx`:
   - En el `<select>` de "PRODUCTO A FABRICAR":
     * Asegurar que solo liste productos reales donde `!p.tipoItem` o `p.tipoItem === 'PRODUCTO_COMERCIAL'` (o filtrar descartando los que tengan `p.idItem?.startsWith('INOCULO:')` o `p.tipoItem === 'INOCULO_WIP'`).
     * Mostrar la etiqueta limpia: `${p.nombre} (${p.presentacion?.nombre || 'Base'})`.
     * Clave única: `key={`header-prod-${p.id}`}`.

2. En `RecipeStageBomTable.jsx`:
   - En cada grupo del selector de ingredientes del BOM asegurar keys únicas:
     * Grupo Inóculos: `<option key={`inoculo-opt-${p.idItem \vert{}\vert{} p.id}`} value={p.idItem \vert{}\vert{} `INOCULO:${p.id}`}>`
     * Grupo Bases: `<option key={`base-opt-${p.idItem \vert{}\vert{} p.id}`} value={p.idItem \vert{}\vert{} `BASE:${p.id}`}>`
     * Grupo Materias Primas: `<option key={`insumo-opt-${item.id}`} value={item.id}>`
   - Mantener el componente bajo el umbral de 135 líneas SRP.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- "PRODUCTO A FABRICAR" muestra solo "YOGURT BASE" y "YOGURT PURO" de forma limpia.
- El BOM mantiene disponible "INÓCULO / INICIADOR (YOGURT BASE) - g".
- Desaparece la notificación roja de errores en el navegador (`Encountered two children with the same key`).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.