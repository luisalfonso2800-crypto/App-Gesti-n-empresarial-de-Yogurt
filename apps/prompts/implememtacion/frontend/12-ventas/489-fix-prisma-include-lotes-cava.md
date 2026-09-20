TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Subsanar el error de Prisma "Unknown field `lotes` for include statement on model `InventarioProducto`" en `inventory.repository.js` reubicando la relación `lotes` dentro de `producto`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/inventory/inventory.repository.js` alrededor de la línea 35-50 y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Reubicar la relación de Lotes en Prisma:
   - En `findFinishedProducts()`:
     * Mover la inclusión de `lotes` para que cuelgue del include de `producto`:
       ```javascript
       const records = await this.prisma.inventarioProducto.findMany({
         where: {
           producto: {
             categoria: { in: ["LACTEOS", "PRODUCTO_TERMINADO", "BASES_LACTEAS", "PREMEZCLA_PLANTA"] }
           }
         },
         include: {
           producto: {
             include: {
               presentacion: true,
               recetas: { take: 1, select: { unidadRendimiento: true } },
               lotes: {
                 where: {
                   cantidadDisponible: { gt: 0 }
                 }
               }
             }
           }
         },
         orderBy: { fechaActualizacion: "desc" }
       });
       ```
   - Si el formateo posterior del método espera `record.lotes`, mapear en el retorno:
     `lotes: record.producto?.lotes || []` para no romper la compatibilidad con el frontend.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Bitácora de Inventario en la pestaña "Cava (Prod. Terminado)" carga de inmediato sin el mensaje rojo de Prisma.
- Reaparecen los productos y bases lácteas físicas en la tabla.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.