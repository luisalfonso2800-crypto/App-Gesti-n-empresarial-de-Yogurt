TAREA CONTROLADA — UNIDADES DE MEDIDA FLEXIBLES EN PRESENTACIONES Y DESBLOQUEO EN RECETAS TÉCNICAS

OBJETIVO TÉCNICO:
1. En `PresentationModal.jsx`: Permitir seleccionar la Unidad de Medida base (L, ml, kg, g, und) para que las presentaciones a granel o semielaboradas no queden atadas ciegamente a "ml / 1000 ml", permitiendo jaleas en kg y cereales en gramos.
2. En `RecipeModal.jsx` / `useRecipeForm.js` (o editor de recetas): Desbloquear el campo "UNIDAD DE MEDIDA" para que deje de ser un texto rígido en "Litros" y se convierta en un selector editable precargado de forma inteligente según la presentación elegida (L, kg, g, ml, Unidades).

FUENTES DE VERDAD:
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/recipes/components/RecipeModal.jsx (o subcomponente de cabecera de receta / RecipeHeaderSection.jsx)
- apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Mantener SRP (< 145 líneas por archivo; desacoplar si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `PresentationModal.jsx`:
   - Incorporar un selector de `unidadMedida` (L, ml, kg, g, und) en el formulario:
     * Si `tipoUso === 'SEMIELABORADO'` o es a granel:
       - Permitir al usuario seleccionar en qué unidad se controla la base:
         `<option value="L">Litros (L) - Bases Líquidas / Tanque</option>`
         `<option value="kg">Kilogramos (kg) - Jaleas / Dulces / Marmita</option>`
         `<option value="g">Gramos (g) - Porcionados / Copitas</option>`
         `<option value="und">Unidades (und) - Piezas / Empaques auxiliares</option>`
       - Guardar dicha unidad en el payload de presentación (campo `unidadMedida` o persistir en `observaciones` como JSON/metadata sin romper Prisma).

2. EN EL FORMULARIO DE RECETAS (`RecipeModal.jsx` o `RecipeHeaderSection.jsx` y `useRecipeForm.js`):
   - Localizar el contenedor donde se renderiza `UNIDAD DE MEDIDA` (actualmente con texto estático "Litros" y label "Definida por la presentación del producto").
   - Reemplazar el input/bloque estático por un selector controlado `<select name="unidadRendimiento">`:
     * Opciones: `Litros (L)`, `Kilogramos (kg)`, `Gramos (g)`, `Mililitros (ml)`, `Unidades (und)`.
   - En `useRecipeForm.js`:
     * Al cambiar el `idProducto`, sincronizar reactivamente la unidad sugerida:
       - Si el producto tiene presentación en Litros o granel líquido $\rightarrow$ sugiere `'Litros'`.
       - Si es jalea o peso $\rightarrow$ sugiere `'Kilogramos'`.
       - Si es producto comercial envasado $\rightarrow$ sugiere `'Unidades'`.
     * **Crucial:** NO deshabilitar el selector (`disabled={false}`). Dejarlo editable para que el maestro quesero o el operario pueda corregir o decidir si rinde en Litros o en Kilos.

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La creación de presentaciones permite definir unidades de masa (kg, g) y volumen (L, ml).
- En Recetas Técnicas, la unidad de medida es un desplegable editable y ya no queda clavada en "Litros".
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Selector de unidad añadido en: PresentationModal.jsx
- Selector de unidad editable en: Recetas
- Resultado verify-srp.js: