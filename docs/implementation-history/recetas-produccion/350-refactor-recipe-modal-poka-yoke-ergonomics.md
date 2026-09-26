TAREA (PRESUPUESTO ESTRICTO: EDICIÓN QUIRÚRGICA CO-LOCADA):
Refactorizar la interfaz y experiencia de usuario en la creación/edición de recetas técnicas (`catalog/recipes`), implementando layout Maestro-Detalle ergonómico, reordenamiento de etapas Poka-Yoke (▲/▼ con límites), tarjetas gemelas de Tiempo/Temperatura validadas en vivo, unidad técnica vinculada en BOM, barra inferior flotante (sticky) y eliminación absoluta de `alert()` / `confirm()` nativos.

FUENTES DE VERDAD:
- Archivos en `apps/web/src/app/catalog/recipes/`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`

REGLAS ANTI-CONSUMO DE CUOTA:
- PROHIBIDO búsquedas globales (`Search`, `Find`).
- Máximo 1 lectura por archivo.
- Límite SRP estricto: Todo componente o hook debe tener < 135 líneas.
- 100% CSS Modules puro (cero inline-styles).

OBJETIVO Y ALCANCE FUNCIONAL:

1. Layout Maestro-Detalle:
   - Columna Izquierda (~320px): Lista vertical de etapas.
     * Tarjeta compacta: Número secuencial, nombre, tiempo, temp y conteo de insumos.
     * Botones interactivos [▲] y [▼]: permutan el orden en el array y conservan el foco activo.
     * Poka-Yoke: [▲] deshabilitado en índice 0; [▼] deshabilitado en última etapa.
     * Botón superior: `+ Añadir Etapa`.
   - Columna Derecha (Editor de Etapa Activa):
     * Tarjetas gemelas: "Tiempo Operativo" (Mín, Obj, Máx en min + conversión tenue a horas) y "Temperatura Operativa" (Mín, Obj, Máx en °C + conversión tenue a °F).
     * Validación Poka-Yoke en vivo: Si min > obj o obj > max, aplicar borde rojo `.inputErrorBorder` (#EF4444) y microtexto de advertencia.
     * Instrucciones de operación compactas.

2. Lista de Materiales (BOM):
   - Tabla limpia sin textos informativos redundantes.
   - Poka-Yoke de Unidades: Al seleccionar el insumo, la unidad de medida (`g`, `ml`, `unidad`) se fija automáticamente en modo solo lectura según `insumo.unidadBase`.
   - Botón `+ Añadir Insumo` y eliminación por fila sin confirmación bloqueante nativa.

3. Barra Inferior Fija (Sticky Cost Bar):
   - `position: sticky; bottom: 0;` con fondo beige/crema institucional y sombra superior tenue.
   - Proyección en tiempo real: Rendimiento base, Costo Unitario ($/L o $/kg) y Costo Total Batch.
   - Acciones: [Cancelar] y [Finalizar y Resumir] (deshabilitado si hay etapas o rangos de tiempo/temp inválidos).

4. Purga de Alertas Nativas:
   - Eliminar definitivamente cualquier llamado a `window.alert()` o `window.confirm()` en `RecipeModal.jsx` y hooks co-locados.

5. Modularización SRP (< 135 líneas):
   - Descomponer la vista en subcomponentes co-locados en `apps/web/src/app/catalog/recipes/components/`:
     * `RecipeStageSidebar.jsx`
     * `RecipeStageDetail.jsx`
     * `RecipeBOMTable.jsx`
     * `RecipeStickyFooter.jsx`
   - Mantener `useRecipeForm.js` con las funciones puras `moverEtapa` y validaciones de rango.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La creación de recetas opera en dos columnas fluidas, con reordenamiento asistido, validación estricta de temperaturas/tiempos y barra de costos fija sin recargar el DOM ni emitir errores.
- `verify-srp.js` arroja código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE inmediatamente.