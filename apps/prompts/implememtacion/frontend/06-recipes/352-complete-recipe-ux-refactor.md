TAREA DE TRANSFORMACIÓN UI/UX INTEGRAL (RECETAS TÉCNICAS):
Ejecutar la reestructuración completa de la interfaz de creación/edición de recetas técnicas (`catalog/recipes`), implementando layout Maestro-Detalle, tarjetas gemelas de parámetros críticos (Tiempo y Temperatura), autoselección estricta de unidad en BOM, dock inferior flotante (sticky) y eliminación de alertas nativas (`alert`/`confirm`), respetando contratos de API y límite SRP (< 135 líneas).

REGLAS DE EFICIENCIA DE TOKENS (CERO EXPLORACIÓN):
- PROHIBIDO usar `Search`, `Find` o búsquedas globales.
- Trabajar directamente sobre los archivos co-locados en `apps/web/src/app/catalog/recipes/`.
- No modificar endpoints, contratos de payload ni esquemas de backend.

ALCANCE DE CAMBIOS POR COMPONENTE:

1. Tarjetas Gemelas de Parámetros Críticos (`RecipeStageEditor.jsx` / `RecipeStageTelemetryCard.jsx`):
   - Reemplazar las tres cajas dispersas por 2 tarjetas gemelas:
     * **Tiempo Operativo:** Mínimo | Objetivo (campo primario) | Máximo (en min). Debajo, microtexto sutil: `≈ X horas`.
     * **Temperatura Operativa:** Mínimo | Objetivo | Máximo (en °C). Debajo, microtexto sutil: `≈ X °F`.
   - **Validación Poka-Yoke en vivo:** Si `min > obj` o `obj > max`, aplicar clase `.inputErrorBorder` (`border: 1px solid #EF4444; background: #FEF2F2`) y mostrar microtexto inferior: *"El valor mínimo no puede superar el objetivo ni el máximo"*.
   - Inhabilitar el botón de envío si existen rangos incoherentes.

2. Lista de Materiales y Fórmula BOM (`RecipeStageBomTable.jsx`):
   - Eliminar el texto explicativo redundante (*"Mezcla materias primas..."*).
   - **Poka-Yoke de Unidad:** Al seleccionar el insumo, leer `unidadBase` y mostrarla como etiqueta fija de solo lectura (g, ml, unidad), impidiendo alteración manual.
   - Acciones de fila compactas: botón de eliminar sutil con hover rojo.

3. Limpieza de Cabecera y Ruido Visual (`RecipeModal.jsx` / `RecipeHeaderFields.jsx`):
   - Eliminar el banner azul estático de "Concepto Técnico".
   - Miniatura de imagen de producto compacta (`width: 56px; height: 56px; object-fit: cover; border-radius: 8px`).

4. Dock Inferior Flotante Sticky (`RecipeStickyFooter.jsx` / `RecipeBalanceFooter.jsx`):
   - Configurar contenedor con `position: sticky; bottom: 0; z-index: 20;` con sombra superior tenue y fondo crema/blanco institucional.
   - Proyección en tiempo real: Rendimiento base, Costo Unitario (`$/L`) y Costo Total del Batch.
   - Botones de acción alineados a la derecha: `[Cancelar]` y `[Finalizar y Resumir]`.

5. Erradicación de Alertas Nativas (`RecipeModal.jsx` / `useRecipeForm.js`):
   - Eliminar definitivamente todo `window.alert()` y `window.confirm()`.
   - La eliminación o descarte de cambios debe resolverse mediante doble clic de confirmación en el botón o flags reactivos internos.

6. Gobernanza SRP:
   - Todo componente o subcomponente debe mantenerse bajo el límite (< 135 líneas).
   - Estilos 100% en CSS Modules (sin estilos inline).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pantalla de Recetas refleja el diseño limpio de dos columnas, tarjetas gemelas con validación en vivo, BOM con unidad fija y balance sticky permanente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.