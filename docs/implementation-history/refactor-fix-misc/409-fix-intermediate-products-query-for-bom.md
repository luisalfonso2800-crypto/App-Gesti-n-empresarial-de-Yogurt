TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Habilitar en el BOM de Recetas la selección diferenciada de Semielaborados Intermedios:
1. "YOGURT BASE" (Base a granel en Litros) para ser usado como base en las recetas de productos comerciales con fruta/saborizados.
2. "CULTIVO INICIADOR / INÓCULO" (o Yogurt Base como Inóculo en g/ml) para ser usado en la etapa de inoculación/fermentación de nuevas tandas de Yogurt Base recirculado.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `products.repository.js` (método `findIntermediates` o consulta de semielaborados para recetas):
   - Eliminar cualquier restricción que filtre productos por tener presentación obligatoria (`presentacionId` no nulo).
   - Consultar todos los productos con:
     * `tipo === 'INTERMEDIO_WIP'` O `categoria === 'BASES_LACTEAS'` O `canalVenta IN ['SOLO_PLANTA', 'MIXTO']`.
   - Formatear el listado retornado para el selector de recetas incluyendo:
     * El producto base a granel:
       `{ id: prod.id, nombre: `${prod.nombre} (Base a Granel - Litros)`, unidadMedida: prod.unidadMedida || 'Litros', tipoItem: 'BASE_GRANEL' }`
     * La variante de inóculo/semielaborado de cultivo:
       `{ id: prod.id, nombre: `INÓCULO / INICIADOR (${prod.nombre})`, unidadMedida: 'g', tipoItem: 'INOCULO_WIP' }`
   - Si existen otros productos con empaque (como `YOGURT PURO`), mantenerlos también en el listado.

2. En `RecipeStageBomTable.jsx`:
   - En `<optgroup label="Bases y Semielaborados (WIP)">`:
     * Mapear todos los elementos intermedios provistos sin descartar los que tengan presentación `null`.
     * Mostrar con claridad el nombre del semielaborado y su unidad operativa (`Litros` para formulación de sabores, `g/ml` para siembra de inóculo).
   - Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al editar recetas de productos finales, se puede seleccionar "YOGURT BASE (Base a Granel - Litros)".
- Al editar la etapa de inoculación de una nueva base, se puede seleccionar "INÓCULO / INICIADOR" sin requerir compra externa de yogurt griego comercial.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.