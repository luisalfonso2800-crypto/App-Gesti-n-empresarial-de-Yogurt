TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Subsanar el error de Prisma 'Unknown argument envase' en `inventory.repository.js` eliminando el argumento no válido y filtrando de forma segura los productos terminados en Cava:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/inventory/inventory.repository.js` alrededor de la línea 35-45 y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Corregir la consulta en `findFinishedProducts()`:
   - En el `where` de `this.prisma.inventarioProducto.findMany(...)`:
     * Remover por completo la condición `presentacion: { envase: ... }` que genera el crash.
     * Mantener los filtros seguros:
       ```javascript
       where: {
         producto: {
           categoria: { in: ["LACTEOS", "PRODUCTO_TERMINADO", "LACTEOS_TERMINADOS"] },
           NOT: [
             { categoria: { in: ["BASES_LACTEAS", "PREMEZCLA_PLANTA", "SEMIELABORADOS", "WIP"] } },
             { nombre: { contains: "GRANEL", mode: "insensitive" } },
             { presentacion: { nombre: { contains: "GRANEL", mode: "insensitive" } } }
           ]
         }
       },
       include: {
         producto: {
           include: {
             presentacion: true,
             recetas: { take: 1, select: { unidadRendimiento: true } }
           }
         },
         lotes: {
           where: {
             tipoLote: "PRODUCTO_TERMINADO",
             cantidadDisponible: { gt: 0 }
           }
         }
       },
       orderBy: { fechaActualizacion: "desc" }
       ```
   - Si se requiere verificar algún tipo de empaque adicional, filtrarlo sobre el arreglo resultante `records.filter(...)` en memoria antes de retornar.

2. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pestaña "Cava (Prod. Terminado)" de la Bitácora de Inventario carga limpiamente sin errores rojos de Prisma.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.