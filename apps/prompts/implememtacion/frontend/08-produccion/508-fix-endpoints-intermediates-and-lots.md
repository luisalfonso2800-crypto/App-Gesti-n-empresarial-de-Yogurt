TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Asegurar y estabilizar los endpoints backend `GET /products/intermediates` y `GET /lots` con soporte para filtros de consulta, evitando caídas 404 en el editor de recetas y módulo de lotes:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.controller.js` (o `products.routes.js`)
2. `apps/api/src/lots/lots.repository.js` (o `lots.controller.js`)

INSTRUCCIONES TÉCNICAS:

1. Ruta de Intermedios (`products.controller.js`):
   - Garantizar la ruta explícita `GET /intermediates` o filtrar productos por categoría/tipo intermedio:
     ```javascript
     async getIntermediates(req, res) {
       const intermedios = await this.productsRepository.findMany({
         where: {
           OR: [
             { categoria: 'WIP' },
             { categoria: 'PREMEZCLA' },
             { categoria: 'BASE' }
           ],
           activo: true
         },
         include: { presentacion: true, inventario: true }
       });
       return res.json(intermedios);
     }
     ```

2. Filtros Seguros en Lotes (`lots.repository.js`):
   - En el método de consulta de lotes (`findMany` / `findAll`):
     * Aceptar parámetros `productoId` y `estado` / `activo`.
     * Manejar la cláusula `where` condicionalmente para no retornar colecciones vacías por discrepancias de nombre:
       ```javascript
       const whereClause = {};
       if (query.productoId || query.idProducto) {
         whereClause.productoId = query.productoId || query.idProducto;
       }
       if (query.estado) {
         whereClause.estado = query.estado;
       } else if (query.disponible === 'true') {
         whereClause.cantidadDisponible = { gt: 0 };
       }
       ```
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.controller.js`
2. `node --check apps/api/src/lots/lots.repository.js`
3. `pnpm --filter api build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- `GET /api/v1/products/intermediates` responde 200 con la lista de bases intermedias.
- `GET /api/v1/lots?productoId=...` responde 200 sin lanzar 404.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
