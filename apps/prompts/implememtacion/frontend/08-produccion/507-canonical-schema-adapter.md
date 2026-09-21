TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Crear un adaptador canónico de datos en frontend (`lib/adapters/schema.adapter.js`) que normalice los campos de Prisma (`cantidadActual`, `cantidadOz`, `cantidadMl`, `unidadBase`) hacia las propiedades consumidas por la interfaz, resolviendo inconsistencias sin alterar contratos:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR / CREAR:
1. `apps/web/src/lib/adapters/schema.adapter.js` (nuevo adaptador central)
2. `apps/web/src/app/operations/inventory/hooks/useInventoryPageData.js`

INSTRUCCIONES TÉCNICAS:

1. Adaptador Canónico Central (`apps/web/src/lib/adapters/schema.adapter.js`):
   - Exportar funciones puras de normalización:
     ```javascript
     export function normalizeProduct(product) {
       if (!product) return null;
       const stockReal = Number(product.inventario?.cantidadActual ?? product.cantidadActual ?? product.stock ?? 0);
       const presentacion = product.presentacion || {};
       const capacidadLitros = presentacion.cantidadMl
         ? presentacion.cantidadMl / 1000
         : (presentacion.cantidadOz ? (presentacion.cantidadOz * 29.5735) / 1000 : 0);

       return {
         ...product,
         stock: stockReal,
         stockActual: stockReal,
         stockCava: stockReal,
         capacidadLitros,
         volumenOzMl: presentacion.nombre || (presentacion.cantidadOz ? `${presentacion.cantidadOz} oz` : `${presentacion.cantidadMl} ml`),
         costoUnitario: Number(product.costoPromedio ?? product.costoUnitario ?? 0)
       };
     }

     export function normalizeSupply(supply) {
       if (!supply) return null;
       const stockReal = Number(supply.inventario?.cantidadActual ?? supply.cantidadActual ?? supply.stock ?? 0);
       return {
         ...supply,
         stock: stockReal,
         stockActual: stockReal,
         unidadMedida: supply.unidadBase || supply.unidadMedida || 'Unidad'
       };
     }
     ```

2. Integración en `useInventoryPageData.js`:
   - Importar `normalizeProduct`.
   - Mapear la respuesta de productos terminados antes de asignarla al estado, garantizando que tanto la Cava Comercial como las alertas de inventario lean valores definidos y consistentes con la base de datos.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/lib/adapters/schema.adapter.js`
2. `node --check apps/web/src/app/operations/inventory/hooks/useInventoryPageData.js`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de inventario muestra existencias reales consumiendo `cantidadActual` normalizada.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
