# TAREA CONTROLADA — FASE 3C: AGREGAR SEMÁFORO DE ESTADO EN EL LISTADO DE PRODUCTOS

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO TÉCNICO:
1. Agregar una columna "Estado" en el listado de productos con el semáforo de 3 estados (M8):
   - 🟢 LISTO: `activo === true && precioVenta > 0 && idPresentacion`
   - 🟡 INCOMPLETO: `activo === true && (precioVenta === 0 || !idPresentacion)`
   - 🔴 DESACTIVADO: `activo === false`
2. El cálculo es 100% frontend, con campos existentes en el modelo.
3. CERO modificaciones a backend ni schema Prisma.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- apps/web/src/app/catalog/products/components/ProductsTable.jsx (o equivalente: ProductList, ProductsList, etc.)
- apps/web/src/app/catalog/products/page.jsx (para ver cómo se renderiza el listado)
- apps/web/src/app/catalog/products/components/products-table.module.css (o el CSS Module correspondiente)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO modificaciones a backend ni schema.
- CERO modificaciones a tests E2E (los tests se actualizarán en Fase 4).
- Cada componente ≤ 150 líneas.
- Código 100% JavaScript (.jsx), prohibido TypeScript.
- Prohibido estilos inline. Usar CSS Modules.
- Respetar paleta MANNÁ: verde `#166534`, amarillo `#92400e`, rojo `#991b1b`.

ACCIONES A EJECUTAR:

1. **Localizar el componente del listado de productos:**
   - Buscar en `apps/web/src/app/catalog/products/components/` el archivo que renderiza la tabla/listado.
   - Nombres posibles: `ProductsTable.jsx`, `ProductList.jsx`, `ProductsList.jsx`.
   - Si no existe un componente dedicado, es probable que el listado esté en `page.jsx` directamente.

2. **Agregar función auxiliar de cálculo de estado:**

   Dentro del componente o en un util separado (≤ 20 líneas):
   ```javascript
   const getEstadoProducto = (producto) => {
     if (producto.activo === false) {
       return { label: 'DESACTIVADO', variant: 'red' };
     }
     if (Number(producto.precioVenta) > 0 && producto.idPresentacion) {
       return { label: 'LISTO', variant: 'green' };
     }
     return { label: 'INCOMPLETO', variant: 'yellow' };
   };
   ```
