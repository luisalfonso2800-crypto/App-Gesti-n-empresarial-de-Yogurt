TAREA:
Incorporar accesos directos de navegación y redirección guiada dentro del banner de ruta de trabajo en `PackagingWizardModal.jsx` hacia el registro de Insumos y Recetas WIP faltantes.

OBJETIVO:
1. En `PackagingWizardModal.jsx` (y subcomponentes de preguntas/banners):
   - En la tarjeta de **Ruta de trabajo requerida**:
     * Mantener el botón de escape `[ Desmarcar opción ]`.
     * Añadir el botón de navegación principal: `[ ↗ Formular Receta de Cereal ]` que abra en nueva pestaña (`window.open('/catalog/recipes', '_blank')`) o use el router con preservación de contexto, permitiendo al usuario crear el producto/receta WIP de inmediato.
   - En la verificación de envases o insumos requeridos:
     * Si se detecta que no existen insumos registrados de tipo empaque o toppings en el catálogo, mostrar un link/botón directo: `[ ↗ Registrar Insumos Faltantes ]` hacia `/catalog/supplies`.
2. Restricciones estrictas:
   - Cumplir SRP (< 135 líneas por archivo). Extraer la tarjeta de alerta a un componente específico `WizardDependencyAlert.jsx` si el modal roza el umbral.
   - CSS Modules puro (`packaging-wizard.module.css`). Cero estilos inline (`style={{}}`).
   - Ejecutar el guardián de calidad `verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Solo archivos frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
- `apps/web/src/app/catalog/recipes/components/modal-parts/packaging-wizard.module.css`

CREAR (si aplica por SRP):
- `apps/web/src/app/catalog/recipes/components/modal-parts/WizardDependencyAlert.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botón de redirección activa disponible en el banner de dependencias faltantes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados/creados:
- Enlaces de redirección configurados:
- Resultado de verify-srp.js:
- Estado: