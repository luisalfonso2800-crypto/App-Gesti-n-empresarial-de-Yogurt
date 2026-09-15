TAREA:
Añadir badges de conversión en vivo para los rangos de tolerancia (minutos a horas) y temperatura (°C a °F) en RecipeStageEditor.jsx respetando SRP (<150 líneas) y CSS Modules puro.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx` (y archivos co-locados):
1. Integrar badges/pills de conversión de tiempo en vivo para los campos de "RANGO DE TOLERANCIA (MIN - MÁX)":
   - Proyectar para cada valor de minutos su equivalencia en formato horas (`✦ (00:25 h)` y `✦ (00:35 h)`) o una píldora consolidada de rango `✦ (00:25 h - 00:35 h)` junto a los inputs.
2. Integrar conversión de temperatura estándar de mercado (°Fahrenheit):
   - En la sección "TEMPERATURA OPERATIVA (°C)", calcular reactivamente la equivalencia en °F:
     $$°F = \text{round}(°C \times 1.8 + 32)$$
   - Mostrar una cápsula pill alineada a la derecha de los inputs de temperatura:
     `✦ (185°F - 194°F)` (o individual si solo hay un valor definido).
   - Ocultar o mostrar guión (`--`) si los campos están vacíos o incompletos.
3. Extraer las funciones matemáticas puras a `recipeHelpers.js` si es necesario para mantener `RecipeStageEditor.jsx` estrictamente por debajo de 150 líneas.
4. Cero estilos en línea (`style={{}}`): aplicar estilos mediante clases en `recipe-stages.module.css` usando la paleta corporativa MANNÁ (fondo `#F7F4EE`, borde `#CAD5B5`, texto `#065F46`).

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`
- `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`

REGLA DE CONSULTA:
Lee y modifica exclusivamente los componentes co-locados de recetas. Prohibido tocar backend (`apps/api/`) o módulos ajenos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/recipeHelpers.js` (si aplica para helpers matemáticos)
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. HELPERS MATEMÁTICOS (`recipeHelpers.js`):
   - Asegurar o añadir helper `celsiusToFahrenheit(c)`:
     ```javascript
     export const celsiusToFahrenheit = (c) => {
       const num = parseFloat(c);
       if (isNaN(num)) return null;
       return Math.round(num * 1.8 + 32);
     };
     ```
   - Asegurar helper para formateo de minutos a horas (`formatMinutesToHours(min)`).

2. RENDERIZADO EN `RecipeStageEditor.jsx`:
   - En el bloque de **Rango de Tolerancia**, ubicar una cápsula pill (`.telemetryPill` o `.conversionPill`) inline con la equivalencia de horas para el mínimo y el máximo:
     - Ejemplo: `[ 25 ]` `[ 35 ]` `✦ (00:25 h - 00:35 h)`
   - En el bloque de **Temperatura Operativa (°C)**, ubicar la cápsula con la conversión calculada:
     - Si hay mín y máx: `✦ (${tempMinF}°F - ${tempMaxF}°F)`
     - Si solo hay uno: `✦ (${tempF}°F)`
   - Garantizar que si el usuario borra los valores no aparezcan valores `NaN` (usar optional chaining / checks defensivos).

3. REGLAS ARQUITECTÓNICAS Y LÍMITES:
   - Mantener `RecipeStageEditor.jsx` < 150 líneas.
   - Cero objetos `style={{}}`. Todas las clases en `recipe-stages.module.css`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Ambos badges (tolerancia en horas y temperatura en °Fahrenheit) se actualizan en vivo al tipear.
- `verify-srp.js` finaliza con código 0 y 0 infracciones de líneas o estilos.

DETENCIÓN:
Al cumplir las verificaciones, DETENTE.

SALIDA:
- Líneas finales de RecipeStageEditor.jsx:
- Helpers agregados o reutilizados:
- Resultado de verify-srp.js:
- Estado: