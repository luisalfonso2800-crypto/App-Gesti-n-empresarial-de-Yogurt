TAREA:
Implementar validación inteligente de dependencias operativas y guía de trabajo interactiva (WIP de cereales, pre-etiquetado y bases) dentro de `PackagingWizardModal.jsx`.

OBJETIVO:
1. En `PackagingWizardModal.jsx`:
   - Conectar con la lista de recetas existentes (`useRecipesData` o hook disponible en el módulo).
   - Añadir la pregunta de empaque avanzado:
     * **🥣 Topping / Copita de cereal:** (Toggle Sí/No).
   - **Lógica Inteligente de Validación:**
     * Si el usuario marca `Sí`, verificar si existe en el catálogo de recetas al menos una receta de tipo base/intermedio que corresponda a cereal o topping (ej. que contenga "CEREAL", "GRANOLA" o categoría similar).
     * **Caso A (Existe):** Mostrar un dropdown selector con las recetas de cereal disponibles para asociarla directamente al ensamble.
     * **Caso B (No existe):** Mostrar un banner de asistencia guiada:
       > "ℹ️ **Ruta de trabajo requerida:** Aún no has formulado la receta de porcionado de cereal (WIP). Puedes desmarcar la opción temporalmente o formular primero el cereal en catálogo."
       > Ofrecer botón de atajo o instrucciones claras de trabajo.
   - Añadir la pregunta de preparación previa de envase:
     * **🏷️ Pre-armado y sellos de seguridad:** "¿Los envases se preparan previamente con etiqueta frontal, sello y adhesivo con logo?" (Sí/No).
       - Si es `Sí`, la Etapa 1 generada se titulará "Alistamiento, Etiquetado y Sellos de Seguridad en Envases".

2. En `recipeHelpers.js` (`generatePackagingStagesFromWizard`):
   - Mapear la secuencia ordenada cronológicamente:
     * **Etapa 1:** Alistamiento y pre-rotulado de envases (con instrucciones para pegar etiquetas y sellos).
     * **Etapa 2 (Condicional):** Dosificación de fruta/jalea pesada en fondo.
     * **Etapa 3 (Condicional):** Acondicionamiento y endulzado del yogurt base.
     * **Etapa 4:** Dosificación y vertido del yogurt en los recipientes preparados.
     * **Etapa 5 (Condicional):** Acople de copita de cereal porcionada (WIP) y tapas.
     * **Etapa 6:** Sellado final de seguridad y traslado a cava refrigerada (2–4 °C).

3. Restricciones estrictas:
   - Dividir `PackagingWizardModal.jsx` en subcomponentes atómicos si supera las 135 líneas (Circuit Breaker).
   - CSS Modules puro (cero estilos inline `style={{}}`).
   - Ejecutar `verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`
- `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente archivos en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`
- `apps/web/src/app/catalog/recipes/utils/recipeHelpers.js`

CREAR (si aplica por SRP):
- Subcomponentes para las preguntas de dependencias guiadas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Modal inteligente que valida existencias de recetas base y guía la ruta de trabajo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados/creados:
- Lógica de detección de dependencias implementada:
- Resultado de verify-srp.js:
- Estado: