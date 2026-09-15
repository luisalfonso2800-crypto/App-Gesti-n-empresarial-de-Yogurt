TAREA:
Hacer reactivo y automático el widget de Onboarding (Puesta en Marcha de Planta) ante mutaciones y cambios de ruta sin requerir clics manuales de revalidación.

OBJETIVO:
1. En `apps/web/src/components/shell/OnboardingWizardWidget.jsx`:
   - Añadir escucha al evento global `onboarding:refresh` para revalidar el diagnóstico automáticamente cuando cualquier entidad clave sea creada o modificada.
   - Escuchar cambios de ruta (`pathname` vía `usePathname()`) para refrescar el estado del asistente al navegar entre pantallas.
   - Conservar el botón manual `↺ Revalidar diagnóstico` únicamente como mecanismo de respaldo.
2. En los modales y hooks que completan los pasos del onboarding (específicamente `RecipeModal.jsx` / `useRecipesPageManager.js`, `ProductModal.jsx`, `ProductionOrderCompleteModal.jsx`):
   - Despachar `window.dispatchEvent(new CustomEvent('onboarding:refresh'))` inmediatamente después de un guardado exitoso en la API.
3. Respetar el límite estricto de < 150 líneas por componente y CSS Modules puro.
4. Salida con código 0 en `node .agents/scripts/verify-srp.js`.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `.agents/rules/03-frontend-architecture.md` (Regla 16.3: Reactividad Transversal)
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Inspecciona exclusivamente `OnboardingWizardWidget.jsx` y los manejadores de éxito en `RecipeModal.jsx` / hooks de recetas. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o su hook de guardado)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. EN `OnboardingWizardWidget.jsx`:
   - Importar `usePathname` de `next/navigation`.
   - Dentro del hook o efecto principal de carga de diagnóstico:
     ```javascript
     useEffect(() => {
       fetchDiagnosis();
       const handleRefresh = () => fetchDiagnosis();
       window.addEventListener('onboarding:refresh', handleRefresh);
       return () => window.removeEventListener('onboarding:refresh', handleRefresh);
     }, [pathname]);
     ```
   - Asegurar que el componente permanezca por debajo de 150 líneas.

2. EN MODAL/HOOK DE RECETAS:
   - Al confirmar respuesta exitosa del guardado de una receta (`res.ok` o `data.success`), invocar:
     ```javascript
     if (typeof window !== 'undefined') {
       window.dispatchEvent(new CustomEvent('onboarding:refresh'));
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/components/shell/OnboardingWizardWidget.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El widget reacciona automáticamente al guardar una receta sin recargar la página.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al completar las verificaciones, DETENTE.

SALIDA:
- Líneas finales de OnboardingWizardWidget.jsx:
- Eventos integrados:
- Resultado de verify-srp.js:
- Estado: