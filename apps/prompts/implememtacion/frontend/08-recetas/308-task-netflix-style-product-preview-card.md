TAREA:
Implementar una tarjeta de previsualización lateral interactiva (Hero Card estilo Netflix) en la vista de productos (`/catalog/products`), aprovechando el espacio lateral vacío para mostrar la imagen ampliada y la ficha técnica del producto sobre el que pasa el cursor.

OBJETIVO:
1. En `apps/web/src/app/catalog/products/`:
   - Crear `ProductPreviewCard.jsx` y `product-preview-card.module.css`:
     * **Banner Visual:** Imagen ampliada del producto en alta definición con esquinas redondeadas, relación de aspecto cinematográfica (16:9) y degradado suave hacia abajo.
     * **Insignias de Estado:** Chips superpuestos con el estado (`Activo` / `Inactivo`) y el tipo (`Comercial` vs `WIP`).
     * **Ficha Técnica:**
       - Título con nombre completo del producto y presentación (`ENVASE PLASTICO 16 oz`, `A GRANEL`, etc.).
       - Categoría con su badge de color oficial.
       - Precio de venta formal o `$0 (Costo Interno)`.
       - Margen objetivo y estado de receta técnica (Formulada / Sin Receta).
       - Descripción técnica u observaciones registradas.
     * **Comportamiento por Defecto:** Si el cursor no está sobre ninguna fila, mostrar el primer producto de la lista o el último enfocado.

2. En `ProductsTable.jsx`:
   - Exponer la prop `onHoverProduct(product)`.
   - Disparar `onMouseEnter={() => onHoverProduct(producto)}` en cada fila `<tr>`.
   - Añadir una clase de resaltado suave a la fila actualmente activa.

3. En `page.jsx` (o contenedor de la vista de productos):
   - Mantener el estado `hoveredProduct` inicializado con el primer producto.
   - Reestructurar el layout en grid de 2 columnas: la tabla a la izquierda (flex-grow) y la `ProductPreviewCard` a la derecha con ancho fijo (~340px - 360px) y `position: sticky; top: 1.5rem`.

4. Restricciones Técnicas:
   - Respetar SRP (< 135 líneas por archivo).
   - Usar CSS Modules puro (cero `style={{}}`).
   - Salida limpia en `node .agents/scripts/verify-srp.js` (código 0).

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/products/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/app/catalog/products/components/ProductPreviewCard.jsx`
- `apps/web/src/app/catalog/products/components/product-preview-card.module.css`

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductsTable.jsx`
- `apps/web/src/app/catalog/products/page.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductPreviewCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Layout de 2 columnas con panel lateral reactivo al cursor.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Estructura del layout:
- Resultado de verify-srp.js:
- Estado: