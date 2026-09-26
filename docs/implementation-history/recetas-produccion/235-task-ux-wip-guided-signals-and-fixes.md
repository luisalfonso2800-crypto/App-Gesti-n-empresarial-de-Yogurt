OBJETIVO: Incorporar señales visuales Poka-Yoke de orientación en Productos, Recetas y Producción para guiar intuitivamente al operario en el flujo de Bases y Jaleas (WIP a granel), y corregir el ReferenceError en ProductsPage. Prohibido tocar backend o usar TypeScript.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`
- `apps/web/src/app/operations/production/components/ProductionModal.jsx`

INSTRUCCIONES:

1. CORRECCIÓN DE BUG EN `ProductsPage` (`page.jsx`):
   - En `apps/web/src/app/catalog/products/page.jsx`:
     * Desestructurar `error` de forma segura desde `useProductsData()`:
       `const { items, loading, error, presentations, loadingPresentations } = useProductsData();`
     * En la línea 119 (o donde se evalúe `error`), asegurar acceso defensivo:
       `{Boolean(error) && <div className={styles.errorMessage}>{typeof error === 'string' ? error : error?.message || 'Error al cargar datos'}</div>}`.

2. SEÑAL VISUAL 1 — CATÁLOGO DE PRODUCTOS (`ProductModal.jsx`):
   - Identificar la presentación seleccionada en el formulario (`formData.idPresentacion`).
   - Si la presentación seleccionada corresponde a "A GRANEL" (ej. `selectedPres?.tipoEnvase === 'TANQUE_GRANEL'` o `selectedPres?.nombre?.toUpperCase().includes('GRANEL')`):
     * Renderizar inmediatamente debajo del selector un banner/badge informativo (#EFF6FF, borde #BFDBFE, texto #1E40AF, borderRadius: 6px, padding: 8px 12px, fontSize: 0.78rem):
       "💡 **Producto Semielaborado / Base en Tanque:** Este producto se fabricará por litros/kilos y quedará disponible como base para preparar yogures, jaleas o postres finales."

3. SEÑAL VISUAL 2 — FORMULACIÓN EN RECETAS (`IngredientsFormSection.jsx`):
   - Justo encima del selector unificado de ingredientes o en la cabecera de la lista de ingredientes, agregar un micro-texto de orientación técnica (#6B7280, fontSize: 0.75rem, fontStyle: 'italic', marginBottom: '6px'):
     "💡 Puedes mezclar materias primas de bodega (leche, azúcar, fruta) con bases previamente cocinadas en planta (Base Blanca, Jalea de Frutos)."

4. SEÑAL VISUAL 3 — PRODUCCIÓN Y VINCULACIÓN DE TANQUES (`ProductionModal.jsx`):
   - En la sección "ORIGEN DE MATERIA PRIMA INTERMEDIA (BASE EN TANQUE)", reforzar el micro-texto explicativo para el operario:
     "Indica el lote o tanque de donde se extraerá físicamente la base líquida o jalea elaborada en planta para dosificar en este lote."
   - Asegurar que si el insumo intermedio seleccionado es una jalea o base, el selector muestre con claridad:
     `Lote: {lote.codigoLote} — Saldo en planta: {lote.cantidadDisponible} {lote.unidad}`.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/page.jsx --file src/app/catalog/products/components/ProductModal.jsx --file src/app/catalog/recipes/components/IngredientsFormSection.jsx --file src/app/operations/production/components/ProductionModal.jsx`
`node --check apps/web/src/app/catalog/products/page.jsx`

SALIDA: Reporte breve indicando: error de referencia corregido en ProductsPage, confirmación de las 3 señales visuales integradas y estado del lint con código 0.