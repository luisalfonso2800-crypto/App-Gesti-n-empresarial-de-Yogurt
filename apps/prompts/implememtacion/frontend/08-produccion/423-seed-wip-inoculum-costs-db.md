TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Ejecutar un script de mantenimiento en base de datos para auditar y actualizar los costos estándar del producto base, su receta y el lote WIP, resolviendo definitivamente el costeo del inóculo en el BOM:

1. Crear y ejecutar un script puntual en Node.js (`apps/api/scripts/fix-wip-costs.js`) que use PrismaClient:
   - Buscar el producto "YOGURT BASE" (o con categoría 'BASES_LACTEAS').
   - Verificar si tiene `costoEstandar` o `costoPromedio`. Si es 0 o null:
     * Actualizar `costoEstandar: 4390` (costo real por litro según la fórmula de 3L = $13.169 / 3 = $4.390 COP).
   - Buscar la receta asociada a "YOGURT BASE". Si su campo `costoUnitario` o similar es 0 o null:
     * Actualizar su `costoUnitario: 4390` y `costoTotal: 13169`.
   - Buscar el lote en `Lote` (`fad038d5` con `tipoLote: 'SEMIELABORADO_WIP'`):
     * Actualizar su `costoUnitario: 4390`.
2. En `apps/api/src/products/products.repository.js` (`findIntermediates`):
   - Al retornar el objeto de `INOCULO_WIP`, garantizar que `costoUnitario` y `costoEstandar` sean siempre un número mayor a cero:
     `const costoLitro = Number(p.costoEstandar) > 0 ? Number(p.costoEstandar) : 4390;`
     `costoGramo = costoLitro / 1000;` // $4.39 COP por gramo
   - Asignar explícitamente `costoUnitario: costoGramo` y `costoEstandar: costoGramo`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA Y EJECUCIÓN PUNTUAL.
- Modificar EXCLUSIVAMENTE los archivos indicados.

ARCHIVOS A INTERVENIR:
1. `apps/api/scripts/fix-wip-costs.js` (nuevo script efímero y ejecutar con node)
2. `apps/api/src/products/products.repository.js`

VERIFICACIÓN:
1. Ejecutar el script: `pnpm --filter api exec node scripts/fix-wip-costs.js`
2. `node --check apps/api/src/products/products.repository.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La base de datos queda actualizada con el costo unitario de $4.390 / Litro para YOGURT BASE.
- Al ingresar "125" en Cant. Requerida del inóculo en el BOM, el costo se calcula automáticamente en aprox. $548 COP.
- La alerta "Base WIP sin receta activa" desaparece.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.