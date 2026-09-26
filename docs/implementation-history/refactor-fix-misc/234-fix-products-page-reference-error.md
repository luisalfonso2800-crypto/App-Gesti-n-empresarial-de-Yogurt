OBJETIVO: Corregir el ReferenceError: error is not defined en `apps/web/src/app/catalog/products/page.jsx` y asegurar que la gestión de errores de carga sea reactiva y segura. Prohibido tocar backend ni usar TypeScript.

CAUSA RAÍZ:
En `ProductsPage` (línea 119 aprox.) se evalúa `error` sin haberlo desestructurado desde `useProductsData()` o confundiéndolo con `errorMessage`.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/hooks/useProductsData.js` (solo si no expone `error`)

INSTRUCCIONES:

1. REVISIÓN Y DESESTRUCTURACIÓN:
   - En `useProductsData.js`:
     * Asegurar que el hook capture y retorne `error` (o `productsError`) en su retorno: `{ items, loading, error, presentations, loadingPresentations, refetch }`.
   - En `ProductsPage` (`page.jsx`):
     * Desestructurar `error` desde `useProductsData()`:
       `const { items, loading, error, presentations, loadingPresentations } = useProductsData();`
     * En la línea 119 (y cualquier otra ocurrencia), asegurar que la referencia a `error` sea condicional y segura:
       `{error && <div className={styles.errorMessage}>{typeof error === 'string' ? error : error?.message || 'Error al cargar productos'}</div>}`.

2. PRESERVACIÓN:
   - Mantener intactos los estados Poka-Yoke implementados para `presentations.length === 0` y la integración con `useProductForm`.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/page.jsx`
`node --check apps/web/src/app/catalog/products/page.jsx`

SALIDA: Reporte breve con la línea corregida, origen de la variable y confirmación de lint con código 0.