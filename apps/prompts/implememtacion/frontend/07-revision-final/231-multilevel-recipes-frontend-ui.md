OBJETIVO: Implementar en la UI de recetas (`/catalog/recipes`) el soporte para ingredientes semielaborados (WIP / productos intermedios a granel) con selector agrupado, cálculo dinámico de costo y protección Poka-Yoke anti-recursión. Prohibido tocar backend, ventas o compras.

FUENTES DE VERDAD:
- Arquitectura: `docs/diagnosticos/ARQUITECTURA_RECETAS_MULTINIVEL_WIP.md`
- Frontend: `apps/web/src/app/catalog/recipes/` (`IngredientsFormSection.jsx`, `useRecipeForm.js`, `RecipeModal.jsx`)
- Reglas: AGENTS.md (Reglas 0, 13.1, 16.1, 31, 38)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

INSTRUCCIONES:

1. SELECTOR AGRUPADO Y ANTI-RECURSIÓN (`IngredientsFormSection.jsx`):
   - Sustituir el selector simple por un `<select>` organizado en dos `<optgroup>`:
     * `<optgroup label="Materias Primas y Empaques (Insumos)">`: Mapear `supplies` con valor `INS:${s.id}` y etiqueta `${s.nombre} (${s.unidadBase})`.
     * `<optgroup label="Bases y Semielaborados en Planta (WIP)">`: Mapear productos con valor `PROD:${p.id}` y etiqueta `${p.nombre} (${p.presentacion?.nombre || 'A GRANEL'})`.
   - Regla Poka-Yoke Anti-Recursión: Excluir de la lista de productos aquel cuyo `id` coincida con el producto que se está formulando en la cabecera (`p.id !== currentRecipeProductId`).
   - Sincronización al seleccionar:
     * Si el valor inicia con `INS:`: asignar `idInsumo: id`, `idProductoIntermedio: null` y la `unidad` base del insumo.
     * Si el valor inicia con `PROD:`: asignar `idProductoIntermedio: id`, `idInsumo: null` y la `unidad` predeterminada ('L' o 'KG' según corresponda).

2. BIDIRECCIONALIDAD Y COSTEO DINÁMICO (`useRecipeForm.js`):
   - En la carga de datos para edición: resolver el valor del selector evaluando si el detalle posee `idProductoIntermedio` (`PROD:${det.idProductoIntermedio}`) o `idInsumo` (`INS:${det.idInsumo}`) para que no se pierda al editar.
   - En el cálculo de costo teórico total y unitario:
     * Para `idInsumo`: multiplicar cantidad por `insumo.costoBase || 0`.
     * Para `idProductoIntermedio`: multiplicar cantidad por `producto.costoBase ?? producto.inventarioProducto?.costoPromedio ?? 0`.
   - En el payload de envío (`handleSubmit`): sanitizar para que cada ingrediente viaje con `idInsumo: string | null` e `idProductoIntermedio: string | null`.

3. CÁPSULA RESUMEN POKA-YOKE (`RecipeModal.jsx`):
   - En la tarjeta verde de resumen (#F0FDF4, borde #BBF7D0):
     Indicar el total de materias primas y bases intermedias que componen la receta y el costo teórico proyectado por porción/unidad.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/recipes/components/IngredientsFormSection.jsx --file src/app/catalog/recipes/hooks/useRecipeForm.js --file src/app/catalog/recipes/components/RecipeModal.jsx`

SALIDA: Reporte exclusivo y breve: archivos modificados, confirmación del selector agrupado y resultado del linter. Sin texto adicional.