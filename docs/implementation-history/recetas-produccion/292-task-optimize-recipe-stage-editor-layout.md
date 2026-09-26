TAREA:
Optimizar la distribución visual y ergonomía del editor de etapas de recetas (`RecipeStageEditor.jsx`), agrupando las variables de proceso en una fila y convirtiendo las instrucciones de operación en un textarea expansible de ancho completo.

OBJETIVO:
1. En el componente de edición de etapa de receta (`RecipeStageEditor.jsx` o subcomponentes en `apps/web/src/app/catalog/recipes/components/parts/`):
   - **Reorganización de Parámetros Físicos:**
     * Agrupar en una sola fila (grid de 3 columnas o flex balanceado):
       1. **Tiempo Estándar**
       2. **Rango de Tolerancia (Mín - Máx)**
       3. **Temperatura Operativa (°C)** con su badge de conversión.
   - **Instrucciones de Operación de Ancho Completo:**
     * Mover el campo "Instrucciones de Operación" a su propia fila independiente ubicada debajo de los parámetros métricos y arriba de la sección de BOM.
     * Convertir el input rígido en un elemento `<textarea>` responsivo con altura mínima adecuada (`min-height: 72px` o auto-resize/crecimiento según contenido), permitiendo leer el procedimiento sin texto cortado.
2. Respetar el límite de < 135 líneas por archivo (Protocolo Circuit Breaker) y CSS Modules puro (`recipe-stages.module.css`). Cero estilos inline (`style={{}}`).
3. Ejecutar `verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modifica exclusivamente los componentes y estilos en `apps/web/src/app/catalog/recipes/components/parts/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Reestructurar el JSX en `RecipeStageEditor.jsx` para alinear Temperatura al lado de Tolerancia.
2. Crear clase CSS para el textarea de instrucciones a full-width con auto-expansión o `rows={3}`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Layout de etapa limpio: parámetros numéricos en una línea y área de texto legible para operarios.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Cambios de estructura JSX y CSS:
- Resultado de verify-srp.js:
- Estado: