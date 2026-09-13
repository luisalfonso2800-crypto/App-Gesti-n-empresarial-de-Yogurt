TAREA:
Reingeniería Poka-Yoke del formulario de Recetas Técnicas (`useRecipeForm.js`, `RecipeModal.jsx`, `IngredientsFormSection.jsx`): sincronización reactiva según presentación (Granel vs. Comercial), plantillas de etapas de 1 clic, semáforo financiero contra costo máximo y validación visual de empaque primario.

OBJETIVO:
Implementar en la interfaz de usuario de recetas (`apps/web/src/app/catalog/recipes/`) las mejoras funcionales identificadas en la auditoría técnica:
1. Sincronizar reactivamente la `unidadRendimiento` y sugerir el `nombre` técnico de la receta al seleccionar el producto destino.
2. Eliminar ceros iniciales forzados en `rendimientoBase` (iniciar en cadena vacía con placeholder `Ej: 100`).
3. Disponer botones de "Plantilla Rápida de Etapas" (Base en Tanque vs. Envasado Comercial) para estructurar etapas operativas en 1 solo clic.
4. Semáforo Financiero en vivo: contrastar el costo unitario proyectado contra el `costoMaximoPermitido` del producto (`precioVenta * (1 - margenObjetivo / 100)`).
5. Guardia Poka-Yoke de Empaque en UI: si el producto es comercial, validar en tiempo real que exista al menos un insumo de empaque en la receta antes de permitir el guardado, alertando amigablemente si falta.
6. Formato de moneda colombiana en enteros limpios sin decimales (`$ X.XXX`).

FUENTES DE VERDAD:
- `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`
- `apps/web/src/lib/formatters.js`
- `AGENTS.md` (Reglas 0, 2, 7, 13.1, 13.2)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`

INSTRUCCIONES:

1. SINCRONIZACIÓN REACTIVA EN HOOK (`useRecipeForm.js`):
   - En el estado inicial, fijar `rendimientoBase: ''` (no `0`) y `unidadRendimiento: 'Litros'`.
   - Al cambiar `idProducto`:
     * Buscar el objeto producto en la lista disponible.
     * Si el nombre de la receta está vacío o coincide con la plantilla automática previa, autocompletar:
       `nombre: 'Fórmula - ' + producto.nombre`.
     * Evaluar si el producto es a granel (`isGranel = producto.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || producto.presentacion?.nombre?.toUpperCase().includes('GRANEL') || ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(producto.categoria)`):
       - Si `isGranel`: asignar `unidadRendimiento: 'Litros'`.
       - Si es comercial: asignar `unidadRendimiento: 'Unidades'`.
   - Plantillas rápidas de etapas:
     * Implementar función `applyStageTemplate(templateType)`:
       - Si `'BASE_TANQUE'`: inyecta 2 etapas:
         1. `{ nombre: 'Pasteurización y Acondicionamiento', orden: 1, tempMinimaGrados: 85, tempMaximaGrados: 90, tiempoEstandarMin: 30, detalles: [] }`
         2. `{ nombre: 'Inoculación e Incubación', orden: 2, tempMinimaGrados: 42, tempMaximaGrados: 44, tiempoEstandarMin: 480, detalles: [] }`
       - Si `'ENVASADO_COMERCIAL'`: inyecta 2 etapas:
         1. `{ nombre: 'Mezcla y Saborizado', orden: 1, tiempoEstandarMin: 20, detalles: [] }`
         2. `{ nombre: 'Dosificación, Sellado y Rotulado', orden: 2, tiempoEstandarMin: 40, detalles: [] }`

2. ASISTENCIA DE ETAPAS Y SEMÁFORO EN MODAL (`RecipeModal.jsx`):
   - Al lado del botón `+ Agregar Etapa`, agregar los botones de plantilla rápida:
     * `<button type="button" onClick={() => applyStageTemplate('BASE_TANQUE')}>🥛 Cargar Etapas de Tanque</button>`
     * `<button type="button" onClick={() => applyStageTemplate('ENVASADO_COMERCIAL')}>🍓 Cargar Etapas de Envasado</button>`
   - Detección de Empaque Requerido:
     * Si el producto destino es comercial:
       - Evaluar si en alguna etapa hay al menos un ítem con `tipoInsumo === 'EMPAQUE_BASE'` o cuyo insumo asociado sea de categoría empaque/envase.
       - Si no hay empaque, renderizar una alerta en ámbar (#FFFBEB, borde #FCD34D, color #92400E, padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.76rem', marginBottom: '0.75rem'):
         "⚠️ **Atención de Planta:** Este producto requiere al menos un insumo de empaque primario (vaso, botella o tapa) para poder guardarse y descontarse de bodega."
       - Inhabilitar el botón "Guardar Receta" mientras no se agregue el empaque.
   - Semáforo Financiero en Tarjeta de Resumen (`styles.summaryCardPokaYoke`):
     * Obtener del producto maestro `precioVenta` y `margenObjetivo`.
     * Si `precioVenta > 0` y `margenObjetivo > 0`:
       - `costoTopePermitido = Number(precioVenta) * (1 - (Number(margenObjetivo) / 100))`
       - Si `costoUnitarioProyectado <= costoTopePermitido`:
         Mostrar badge verde: "🟢 Rentabilidad Asegurada (Costo unitario dentro del tope de $ [costoTopePermitido])"
       - Si `costoUnitarioProyectado > costoTopePermitido`:
         Mostrar badge rojo/alerta: "🔴 Alerta de Sobrecosto: El costo formulado ($ [costoUnitario]) supera el tope permitido de $ [costoTopePermitido] para garantizar el [margenObjetivo]% de margen."
     * Si `precioVenta === 0` (producto a granel/uso interno):
       Mostrar badge azul: "⚙️ Costo Operativo de Producción Interna (Liquidación por lote en tanque)"
   - Formato Monetario:
     * Asegurar que todo costo unitario y total del batch use enteros colombianos sin decimales redundantes (`$ 1.250` en lugar de `$ 1.250,00`).

3. ENRIQUECIMIENTO EN DETALLES DE INGREDIENTES (`IngredientsFormSection.jsx`):
   - Al seleccionar un insumo de tipo empaque (vaso, botella, tapa), fijar automáticamente `tipoInsumo = 'EMPAQUE_BASE'`.
   - Si es fruta, azúcar o insumo de formulación, fijar `tipoInsumo = 'BASE'`.
   - Mostrar badge o pill sutil junto a la unidad (ej. "Empaque", "Materia Prima", "Base Láctea").

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/recipes/hooks/useRecipeForm.js --file src/app/catalog/recipes/components/RecipeModal.jsx --file src/app/catalog/recipes/components/IngredientsFormSection.jsx`
2. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`

CRITERIO DE FINALIZACIÓN:
- La unidad de rendimiento y nombre se autocompletan al seleccionar el producto.
- Las plantillas de etapas inyectan los pasos operativos con 1 clic.
- La tarjeta de resumen compara el costo de la receta con el tope admisible del producto en tiempo real.
- La UI bloquea el botón de guardar y advierte si falta el empaque primario en productos envasados.
- Lint finaliza con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Reporte conciso con:
- Archivos intervenidos en el frontend.
- Comportamiento reactivo y semáforo financiero implementados.
- Comprobación de ESLint en código 0.
- Estado.