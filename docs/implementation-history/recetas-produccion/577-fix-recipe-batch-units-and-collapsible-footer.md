TAREA:
Normalización de Unidades en Costeo de Batch, Soporte de Decimales y Footer de Balances Colapsable en Recetas (/catalog/recipes)

OBJETIVO:
1. Corregir el cálculo del Costo Total del Batch y Costo Unitario Proyectado en el diseñador de recetas para que normalice consistentemente factores de conversión entre unidades base (g/kg, ml/lt, und), evitando multiplicaciones desfasadas.
2. Permitir decimales (mínimo 1 decimal, ej. 2.5) en los inputs de cantidad base de la receta y dosificación cuando la unidad sea Litros o Kilos (no forzar enteros con parseInt ni step="1"). Si es "und", mantener números enteros.
3. Hacer que el panel "BALANCE GENERAL DE MATERIALES Y COSTOS" sea plegable:
   - Estado colapsado: barra delgada tipo HUD que muestre únicamente el botón de desplegar y el resumen esencial: "COSTO TOTAL BATCH: $ X" (junto al botón de acción o estado).
   - Estado expandido: muestra la información detallada completa tal como está actualmente.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeBalanceFooter.jsx` (o archivo correspondiente al footer y sus estilos `.module.css`)
- `apps/web/src/app/catalog/recipes/hooks/useRecipeEconomics.js` (o hooks de cálculo de costo/batch de recetas)
- Componentes de cabecera e inputs de receta (`RecipeHeaderForm.jsx` / `RecipeStageIngredients.jsx`)

INSTRUCCIONES TÉCNICAS:
1. Normalización de Conversión de Costos:
   - Verificar la función de cálculo de costo por ingrediente:
     * Si la unidad del insumo es 'Kg'/'Kgs'/'Lt'/'Lts' y la receta pide en 'g' o 'ml', aplicar factor / 1000.
     * Si el costo base de catálogo viene expresado por gramo/mililitro, verificar que la multiplicación no duplique el factor.
     * Asegurar que `costoTotalBatch` sea la suma exacta de (costoUnitarioBaseNormalizado * cantidadNeta).
2. Input de Cantidad con Decimales:
   - En el campo `CANTIDAD BASE` y cantidades de BOM:
     * Asignar dinámicamente `step={unidad === 'und' ? '1' : '0.1'}`.
     * Cambiar validaciones y parsers de `parseInt` a `parseFloat(val) || 0`.
3. Footer Colapsable:
   - Crear estado `isBalanceCollapsed` (por defecto `false` o `true` en pantallas bajas).
   - En modo colapsado (`isBalanceCollapsed === true`):
     * Ocultar textos secundarios (Rendimiento, Composición, Etapas activas, desglose materias primas).
     * Mostrar en una sola fila compacta: botón toggle (▲ / ▼), etiqueta "COSTO TOTAL BATCH", el valor en verde y el botón "Finalizar y Resumir".
   - Aplicar transiciones CSS Modules limpias.

REGLAS ESTRICTAS:
- SRP: Archivos < 130 líneas. Si un componente crece, extraer subcomponentes.
- Cero estilos en línea (`style={{`). Usar CSS Modules.
- RESTRICCIÓN DE COMANDO: Ejecutar ESTRICTAMENTE `pnpm --filter web build` (sin palabras añadidas como "running").

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build` no lo ejecutes lo hago yo manualmente 

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.