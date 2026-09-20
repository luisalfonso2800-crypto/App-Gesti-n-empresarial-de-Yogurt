TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Restaurar inmediatamente la aparición de "INÓCULO / INICIADOR (YOGURT BASE) - g" en el selector BOM:
1. En `apps/api/src/products/products.repository.js` (`findIntermediates`):
   - Evitar `include` anidados complejos que provoquen error 500 en Prisma.
   - Usar `findMany({ where: { activo: true }, include: { presentacion: true } })`.
   - Para productos con categoría 'BASES_LACTEAS', 'INTERMEDIO_WIP' o nombre con 'BASE':
     Inyectar `{ id: p.id, idItem: `INOCULO:${p.id}`, nombre: `INÓCULO / INICIADOR (${p.nombre})`, displayLabel: `INÓCULO / INICIADOR (${p.nombre}) - g`, unidadMedida: 'g', tipoItem: 'INOCULO_WIP', costoUnitario: (Number(p.costoEstandar || 4390) / 1000), costoEstandar: (Number(p.costoEstandar || 4390) / 1000) }`.
2. En `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`:
   - Asegurar que `availableWipProducts` no filtre el inóculo aunque `p.id === currentRecipeProductId`:
     `const availableWipProducts = products.filter(p => p.tipoItem === 'INOCULO_WIP' || p.idItem?.startsWith('INOCULO:') || p.id !== currentRecipeProductId);`
   - Renderizar las opciones dentro de <optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El grupo "🧫 Iniciadores y Cepas (Inóculo WIP)" muestra obligatoriamente "INÓCULO / INICIADOR (YOGURT BASE) - g".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.