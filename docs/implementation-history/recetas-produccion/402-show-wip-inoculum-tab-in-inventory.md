TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Separar el saldo comercial del inóculo y habilitar la visibilidad de semielaborados en el Inventario:
1. En Backend (`inventory.repository.js` y `production.repository.js`):
   - En `completeProduction`: Asegurar que `InventarioProducto` comercial solo incremente la cantidad destinada a envasar (`qtyPrincipal`), evitando inflar el stock comercial con los litros de inóculo reservado.
   - En `inventory.repository.js`: Implementar la consulta `findWipLots()` para retornar todos los lotes con `tipoLote === 'SEMIELABORADO_WIP'` y `cantidadActual > 0`.
2. En Frontend (`InventoryPage.jsx` / `page.jsx` de `/operations/inventory`):
   - Agregar la pestaña o filtro "Semielaborados & Cepas (WIP)" junto a "Bodega (Insumos)" y "Cava (Prod. Terminado)".
   - Renderizar la tabla de inóculos activos: Lote/Cepa, Producto Base, Litros Disponibles, Días de Vida Útil restantes y Lote Origen.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 3 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js`
2. `apps/web/src/app/operations/inventory/page.jsx`
3. `apps/web/src/app/operations/inventory/inventory.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `inventory.repository.js`:
   - Agregar método:
     ```javascript
     async findWipLots() {
       return this.prisma.lote.findMany({
         where: {
           tipoLote: 'SEMIELABORADO_WIP',
           cantidadActual: { gt: 0 }
         },
         include: {
           producto: true,
           lotePadre: true
         },
         orderBy: { fechaVencimiento: 'asc' }
       });
     }
     ```
   - Exponerlo a través del controlador correspondiente (`GET /inventory/wip`).

2. En `page.jsx` de `/operations/inventory`:
   - Añadir la pestaña: `[ Bodega (Insumos) ] [ Cava (Prod. Terminado) ] [ 🧫 Semielaborados & Cepas (WIP) ]`.
   - Cuando la pestaña activa sea WIP:
     * Renderizar tabla con columnas:
       `Lote / Cepa` | `Base / Producto` | `Stock Disponible` | `Caducidad (FEFO)` | `Lote Origen`
     * `Stock Disponible`: formatear `{lote.cantidadActual} Litros` (o gramos).
     * `Caducidad`: badge semáforo FEFO (`X días restantes`).
     * `Lote Origen`: badge referenciando `{lote.lotePadre?.codigoLote || 'N/A'}`.
   - Respetar límite estricto SRP (< 120 líneas para páginas, extraer subcomponente si aplica).

3. En `inventory.module.css`:
   - Añadir estilos limpios para la pestaña y la tabla de semielaborados WIP (`.tabActiveWip`, `.wipBadge`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/inventory/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Cava muestra únicamente el stock comercial real (3 Litros en lugar de 5 o 10 inflados).
- La nueva pestaña lista las cepas de inóculo guardadas con su volumen, vencimiento y lote padre.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.