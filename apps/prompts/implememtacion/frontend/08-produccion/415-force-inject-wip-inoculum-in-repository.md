TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Asegurar que "YOGURT BASE" retorne siempre su opción de Inóculo e Intermedio en `/products/intermediates` y se renderice en el BOM:
1. En `apps/api/src/products/products.repository.js` (método `findIntermediates`):
   - Consultar los productos activos (`this.prisma.producto.findMany({ where: { activo: true }, include: { presentacion: true } })`).
   - Mapear e incluir para CADA producto cuya categoría sea 'BASES_LACTEAS', 'INTERMEDIO_WIP', o cuyo nombre contenga 'BASE' o 'YOGURT':
     a) Un item de inóculo:
        `{ id: p.id, idItem: `INOCULO:${p.id}`, nombre: `INÓCULO / INICIADOR (${p.nombre})`, unidadMedida: 'g', tipoItem: 'INOCULO_WIP', displayLabel: `INÓCULO / INICIADOR (${p.nombre}) - g` }`
     b) Un item de base a granel:
        `{ id: p.id, idItem: `BASE:${p.id}`, nombre: `${p.nombre} (Base a Granel)`, unidadMedida: 'Litros', tipoItem: 'BASE_GRANEL', displayLabel: `${p.nombre} (Base a Granel - Litros)` }`
2. En `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`:
   - Asegurar que `<optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)">` renderice los elementos filtrando por:
     `availableWipProducts.filter(p => p.tipoItem === 'INOCULO_WIP' || p.displayLabel?.includes('INÓCULO') || p.idItem?.startsWith('INOCULO:'))`
   - Asegurar que la key y value del option usen `p.idItem || p.id`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir el select en la etapa de Inoculación, el grupo "🧫 Iniciadores y Cepas (Inóculo WIP)" muestra obligatoriamente "INÓCULO / INICIADOR (YOGURT BASE) - g".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.