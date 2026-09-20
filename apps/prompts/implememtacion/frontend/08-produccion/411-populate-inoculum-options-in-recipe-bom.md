TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Poblar correctamente las opciones dentro de "🧫 Iniciadores y Cepas (Inóculo WIP)" y "🥛 Bases Lácteas a Granel (WIP)" en el diseñador de recetas:
1. En `apps/api/src/products/products.repository.js` (método `findIntermediates`):
   - Flexibilizar el filtro Prisma para que capture inequívocamente a "YOGURT BASE":
     * Condición OR: `categoria: { in: ['BASES_LACTEAS', 'INTERMEDIO_WIP', 'INSUMO_BASE_WIP'] }`, O `nombre: { contains: 'BASE', mode: 'insensitive' }`, O `tipo: 'INTERMEDIO_WIP'`, O tener lotes con `tipoLote: 'SEMIELABORADO_WIP'`.
   - Para cada producto resultante, retornar obligatoriamente ambos objetos:
     a) Variante Base a Granel (`tipoItem: 'BASE_GRANEL'`, unidad: 'Litros').
     b) Variante Inóculo Cepa (`tipoItem: 'INOCULO_WIP'`, unidad: 'g', nombre: `INÓCULO / INICIADOR (${prod.nombre})`).
2. En `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`:
   - Verificar que el mapeo renderice las opciones hijas del <optgroup label="🧫 Iniciadores y Cepas (Inóculo WIP)"> filtrando por `item.tipoItem === 'INOCULO_WIP'`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `products.repository.js` (`findIntermediates`):
   ```javascript
   async findIntermediates() {
     const productos = await this.prisma.producto.findMany({
       where: {
         activo: true,
         OR: [
           { tipo: 'INTERMEDIO_WIP' },
           { categoria: { in: ['BASES_LACTEAS', 'INTERMEDIO_WIP', 'INSUMO_BASE_WIP'] } },
           { nombre: { contains: 'BASE', mode: 'insensitive' } },
           { lotes: { some: { tipoLote: 'SEMIELABORADO_WIP' } } }
         ]
       },
       include: { presentacion: true }
     });

     const resultado = [];
     for (const p of productos) {
       // Opción 1: Inóculo / Cepa
       resultado.push({
         id: p.id,
         nombre: `INÓCULO / INICIADOR (${p.nombre})`,
         unidadMedida: 'g',
         tipoItem: 'INOCULO_WIP',
         costoEstandar: p.costoEstandar || 0
       });
       // Opción 2: Base a Granel
       resultado.push({
         id: p.id,
         nombre: `${p.nombre} (Base a Granel)`,
         unidadMedida: p.unidadMedida || 'Litros',
         tipoItem: 'BASE_GRANEL',
         costoEstandar: p.costoEstandar || 0
       });
       // Si tiene presentación específica envasada
       if (p.presentacion && p.presentacion.nombre !== p.nombre) {
         resultado.push({
           id: p.id,
           nombre: `${p.nombre} (${p.presentacion.nombre})`,
           unidadMedida: 'Litros',
           tipoItem: 'PRODUCTO_ENVASADO',
           costoEstandar: p.costoEstandar || 0
         });
       }
     }
     return resultado;
   }