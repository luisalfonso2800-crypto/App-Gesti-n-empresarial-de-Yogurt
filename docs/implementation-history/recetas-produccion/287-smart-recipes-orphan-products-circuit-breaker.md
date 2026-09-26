TAREA:
Implementar el banner de productos huérfanos y la miniatura de imagen en Recetas Técnicas bajo el protocolo estricto de Circuit Breaker (máximo 3 lecturas permitidas, prohibido rastreo recursivo de hooks globales).

OBJETIVO:
1. **Lectura Directa y Limitada:**
   - Queda prohibido leer archivos de hooks globales de onboarding (`useOnboardingBulkCheck.js`, `useOnboardingStatus.js`) para evitar bucles de lectura.
   - Modificar únicamente:
     * `apps/web/src/app/catalog/recipes/page.jsx`
     * `apps/web/src/app/catalog/recipes/components/RecipesList.jsx` (o componente de tabla/renderizado de recetas).
2. **Banner de Productos Huérfanos:**
   - En la página principal de recetas, evaluar cuántos productos existen en el estado y cuántas recetas los referencian.
   - Renderizar un banner informativo si hay productos comerciales sin receta asociada, con un botón directo para crearla.
3. **Miniatura de Imagen:**
   - Mostrar el avatar/imagen del producto asociado en la lista de recetas técnicas usando el componente `ProductAvatar`.
4. **Validación SRP y Circuit Breaker:**
   - Archivos modificados estrictamente < 150 líneas.
   - Cero estilos inline (`style={{}}`).
   - Ejecutar `verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/components/ui/ProductAvatar.jsx`
- `.agents/rules/01-core-rules.md` (Protocolo Circuit Breaker)
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Lee exclusivamente los 2 archivos objetivo. Si se requiere leer más de 3 archivos, DETENTE y reporta.

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/page.jsx`
- Componentes visuales de la lista de recetas en `apps/web/src/app/catalog/recipes/components/`

NO MODIFICAR:
- Hooks globales de shell, ni backend (`apps/api/`).

INSTRUCCIONES:
1. Añadir la lógica del banner de huérfanos y miniatura visual de productos.
2. Comprobar que no se ingresen en bucles de lectura de hooks.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Módulo de recetas inteligente con alerta de productos sin fórmula e imágenes integradas.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0, DETENTE.

SALIDA:
- Archivos modificados:
- Resultado de verify-srp.js:
- Estado: