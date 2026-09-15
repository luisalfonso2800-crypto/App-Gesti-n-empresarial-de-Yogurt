TAREA:
Incorporar navegación secuencial de etapas ("← Anterior" y "Siguiente →") en la barra de acciones de RecipeStageEditor.jsx, respetando SRP (<150 líneas) y CSS Modules puro.

OBJETIVO:
1. En el pie del banco de trabajo (`RecipeStageEditor.jsx` o componente co-locado `RecipeStageActionBar.jsx`):
   - Reorganizar la botonera inferior en dos zonas claramente diferenciadas:
     * Zona izquierda (Gestión y Riesgo):
       - Botones de orden: `[▲ Subir]` y `[▼ Bajar]`.
       - Duplicado: `[📑 Duplicar Etapa]`.
       - Destructivo separado: `[✕ Eliminar Etapa]` (estilo peligro suave con borde/texto rojizo `#DC2626` y fondo `#FEF2F2`).
     * Zona derecha (Navegación de Flujo):
       - Botón "← Etapa Anterior" (deshabilitado u oculto si es la Etapa 1). Muestra el número o nombre previo: ej. `← 1. Pasteurización`.
       - Botón "Siguiente Etapa →" (estilo corporativo primario MANNÁ `#182622` con texto `#FAF8F5`). Si es la última etapa existente, mostrar `+ Siguiente Etapa` o permitir pasar al final.
2. Al hacer clic en "Anterior" o "Siguiente", cambiar reactivamente la etapa activa seleccionada sin perder datos ingresados.
3. Si `RecipeStageEditor.jsx` excede 140 líneas tras añadir los handlers de navegación, extraer la botonera a `apps/web/src/app/catalog/recipes/components/parts/RecipeStageActionBar.jsx`.
4. Estilos 100% en `recipe-stages.module.css`. Prohibido `style={{}}`.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Lee y modifica exclusivamente los componentes co-locados de etapas en `apps/web/src/app/catalog/recipes/components/parts/`.

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

CREAR (SI ES NECESARIO POR LÍMITES SRP):
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageActionBar.jsx` (< 110 líneas)

NO MODIFICAR:
- ningún archivo fuera del submódulo de recetas ni backend.

INSTRUCCIONES:

1. LÓGICA DE NAVEGACIÓN:
   - Calcular índices:
     * `hasPrev = currentStageIndex > 0`
     * `hasNext = currentStageIndex < stages.length - 1`
     * `prevStageName = hasPrev ? stages[currentStageIndex - 1]?.nombre || 'Etapa ' + currentStageIndex : null`
     * `nextStageName = hasNext ? stages[currentStageIndex + 1]?.nombre || 'Etapa ' + (currentStageIndex + 2) : null`
   - Handlers:
     * `handlePrevStage`: llama `onSelectStage(currentStageIndex - 1)`
     * `handleNextStage`: llama `onSelectStage(currentStageIndex + 1)` (o `onAddStage()` si está en la última y decide agregar).

2. DISTRIBUCIÓN EN CSS MODULES (`recipe-stages.module.css`):
   - Contenedor de acciones:
     ```css
     .actionBar {
       display: flex;
       align-items: center;
       justify-content: space-between;
       gap: 1rem;
       margin-top: 1.5rem;
       padding-top: 1rem;
       border-top: 1px solid #E5DFD5;
     }
     .actionGroupLeft {
       display: flex;
       align-items: center;
       gap: 0.5rem;
     }
     .actionGroupRight {
       display: flex;
       align-items: center;
       gap: 0.5rem;
     }
     .btnNextStage {
       background-color: #182622;
       color: #FAF8F5;
       padding: 0.5rem 1rem;
       border-radius: 6px;
       font-weight: 600;
       border: none;
       cursor: pointer;
       display: inline-flex;
       align-items: center;
       gap: 0.35rem;
       transition: opacity 0.2s;
     }
     .btnNextStage:hover {
       opacity: 0.9;
     }
     .btnPrevStage {
       background-color: #F7F4EE;
       color: #182622;
       border: 1px solid #D6D3D1;
       padding: 0.5rem 0.85rem;
       border-radius: 6px;
       cursor: pointer;
       font-weight: 500;
     }
     .btnDangerDelete {
       background-color: #FEF2F2;
       color: #DC2626;
       border: 1px solid #FCA5A5;
       padding: 0.5rem 0.85rem;
       border-radius: 6px;
       cursor: pointer;
       font-weight: 500;
     }
     ```

3. PREVENCIÓN DE ERRORES (POKA-YOKE):
   - Espacio físico suficiente entre `Eliminar Etapa` y los botones de avance para impedir pulsaciones accidentales.
   - Si no hay etapa previa, el botón `Anterior` queda deshabilitado (`disabled`, opacidad atenuada).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botones de navegación "Anterior" y "Siguiente" visibles y operativos en el editor de etapa.
- Separación visual segura respecto al botón de eliminación.
- `node .agents/scripts/verify-srp.js` retorna código 0 (0 archivos >150 lín., 0 `style={{}}`).

DETENCIÓN:
Al validar la sintaxis y el código 0 del script guardián, DETENTE.

SALIDA:
- Componentes modificados / creados:
- Líneas de código resultantes:
- Resultado de verify-srp.js:
- Estado: