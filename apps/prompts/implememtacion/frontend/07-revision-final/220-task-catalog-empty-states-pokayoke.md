OBJETIVO: Implementar Empty States Poka-Yoke en las páginas de Productos y Recetas para deshabilitar botones y guiar al usuario cuando falten entidades maestras previas. Prohibido tocar backend, CSS globales o usar TypeScript.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/hooks/useProductsData.js`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductsHeader.jsx`
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipesHeader.jsx`

INSTRUCCIONES:

1. PRODUCTOS (`/catalog/products`):
   - En `useProductsData.js`:
     - Cargar las presentaciones desde el montaje inicial consultando `apiClient.get('/presentations')` y exponer `presentations` (array) y `loadingPresentations`.
   - En `page.jsx` y `ProductsHeader.jsx`:
     - Si `presentations.length === 0`:
       - Deshabilitar el botón `[+ Nuevo Producto]` (`disabled`, `opacity: 0.5`, `cursor: 'not-allowed'`) y agregar atributo `title="Debe registrar al menos una Presentación antes de crear productos"`.
       - Renderizar un banner orientador Poka-Yoke sobre la tabla (#EFF6FF, borde #BFDBFE, texto #1E40AF) indicando: "Para registrar productos terminados debe configurar primero los formatos de envase. [Configurar Presentaciones]" con enlace directo a `/catalog/presentations`.

2. RECETAS (`/catalog/recipes`):
   - En `page.jsx` y `RecipesHeader.jsx` (aprovechando que `useRecipesData` ya expone `products` y `supplies` en memoria):
     - Evaluar si `products.length === 0 || supplies.length === 0`.
     - Si falta alguna entidad:
       - Deshabilitar el botón `[+ Nueva Receta]` (`disabled`, `opacity: 0.5`, `cursor: 'not-allowed'`) con atributo `title` indicando la entidad faltante.
       - Renderizar banner orientador Poka-Yoke indicando qué prerrequisito falta con botón/enlace de redirección:
         * Si no hay productos: "Debe registrar al menos un Producto antes de formular recetas. [Ir a Productos]" (`/catalog/products`).
         * Si no hay insumos: "Debe registrar al menos un Insumo antes de formular recetas. [Ir a Insumos]" (`/catalog/supplies`).

3. PRESERVAR:
   - No alterar el comportamiento existente cuando los arreglos contengan datos.
   - Mantener intactas las tablas, modales y suscripciones reactivas.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/page.jsx --file src/app/catalog/recipes/page.jsx`

SALIDA: Exclusivamente reporte conciso indicando: archivos intervenidos, condiciones Poka-Yoke añadidas y resultado de lint. Sin introducciones ni conclusiones.
```[cite: 1, 2, 4]