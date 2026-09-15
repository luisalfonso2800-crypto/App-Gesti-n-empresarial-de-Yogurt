TAREA:
Implementar un configurador modal simple (Packaging Wizard) para "Envasado Comercial" en `RecipeStagesList.jsx`, utilizando únicamente las entidades y datos existentes en el catálogo sin inventar campos ni alterar contratos de API.

OBJETIVO:
1. Crear `PackagingWizardModal.jsx` y su hoja de estilos `packaging-wizard.module.css`:
   - Consumir el listado existente de Presentaciones de la base de datos (hook/servicio ya existente en el catálogo).
   - Filtrar en memoria las presentaciones activas que no sean granel (`envase !== 'TANQUE_GRANEL'` y nombre distinto de `'A GRANEL'`).
   - Permitir al usuario seleccionar la presentación comercial que ya tiene registrada (ej. `ENVASE PLASTICO 16 oz / 500 ml`).
   - Mostrar 3 preguntas básicas Sí/No basadas en operaciones estándar ya contempladas:
     1. "¿Lleva jalea o fruta en el fondo?" (Agrega o no la etapa de dosificación de fruta).
     2. "¿Requiere adición de azúcar/endulzante?" (Agrega o no la etapa de mezcla con azúcar).
     3. "¿Requiere rotulado de lote manual?" (Agrega o no la etapa de rotulado final).
   - Al pulsar `[ Generar Etapas de Envasado ]`, inyectar únicamente las etapas seleccionadas usando el formato de etapa estándar de `RecipeStagesList.jsx`.

2. Restricciones Técnicas:
   - Prohibido agregar campos que no existan en el backend o en el esquema de la base de datos.
   - Respetar el límite de Circuit Breaker (< 135 líneas por archivo).
   - Utilizar CSS Modules puro (cero estilos inline `style={{}}`).
   - Verificar con `verify-srp.js` obteniendo código de salida 0.

FUENTES DE VERDAD:
- Componentes de recetas: `apps/web/src/app/catalog/recipes/components/modal-parts/`
- Entidad de presentaciones: `apps/web/src/app/catalog/presentations/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar exclusivamente archivos dentro de `apps/web/src/app/catalog/recipes/`. Prohibido tocar `apps/api/`.

ALCANCE:

CREAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Modal funcional integrado al botón "Envasado Comercial" que consume presentaciones reales de la base de datos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Presentaciones comerciales vinculadas:
- Resultado de verify-srp.js:
- Estado: