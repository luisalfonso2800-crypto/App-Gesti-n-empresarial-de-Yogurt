TAREA:
Expandir y completar el configurador modal de envasado comercial (`PackagingWizardModal.jsx` y `recipeHelpers.js`) para cubrir el flujo de planta completo: tipo de endulzante, toppings/cereal/cuchara, gramaje de jalea y tapado.

OBJETIVO:
1. En `PackagingWizardModal.jsx`:
   - Conservar la selección dinámica de Presentación Comercial (excluyendo a granel).
   - Estructurar el cuestionario con las variables de planta completas:
     1. **🍓 Jalea o Fruta en el fondo:** (Sí / No). Si marca Sí, habilitar campo numérico corto opcional para gramaje por vaso (ej. `30 g`).
     2. **🍬 Endulzado del Yogurt:** (Sí / No). Si marca Sí, mostrar selector con: `Azúcar`, `Stevia / Dietético`, `Miel / Natural`.
     3. **🥣 Domo de Cereal o Cuchara:** (Sí / No) "¿Lleva contenedor superior de cereal o cuchara?"
     4. **🏷️ Rotulado manual de lote:** (Sí / No) "¿Requiere etiquetado/sticker manual o vaso pre-rotulado?"
   - Acciones: `[ Cancelar ]` y `[ Generar Etapas de Envasado ]`.

2. En `recipeHelpers.js` (`generatePackagingStagesFromWizard`):
   - Enlazar la ruta de etapas ordenada cronológicamente según planta:
     * **Etapa 1:** Selección y alistamiento de envases.
     * **Etapa 2 (Si jalea = true):** Dosificación de jalea en fondo (redactando en la instrucción el gramaje por recipiente).
     * **Etapa 3 (Si endulzado = true):** Acondicionamiento y endulzado de base láctea (indicando el tipo de endulzante seleccionado).
     * **Etapa 4:** Dosificación y vertido de yogurt en envases.
     * **Etapa 5:** Colocación de tapas y acople de complementos (mencionando cereal o cucharas si se marcó Sí).
     * **Etapa 6 (Si rotulado = true):** Rotulado de etiqueta y lote manual.
     * **Etapa 7:** Inspección final y traslado a cava de conservación (2 a 4 °C).

3. Restricciones:
   - Respetar SRP (< 135 líneas por archivo). Si el modal crece, separar las opciones en un subcomponente (ej. `PackagingWizardQuestions.jsx`).
   - CSS Modules puro (`packaging-wizard.module.css`).
   - `node .agents/scripts/verify-srp.js` retornando código 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Solo código frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`

CREAR (si se requiere para SRP):
- Subcomponente modular para preguntas o selectores.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Wizard completo con soporte de endulzante, toppings, jalea y empaques.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Nuevas preguntas integradas:
- Resultado de verify-srp.js:
- Estado: