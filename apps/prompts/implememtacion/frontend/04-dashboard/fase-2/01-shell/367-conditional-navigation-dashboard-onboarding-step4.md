TAREA CONTROLADA — NAVEGACIÓN CONDICIONAL A MÓDULOS EN EL PASO 4 DEL DASHBOARD

OBJETIVO TÉCNICO:
En las tarjetas de "Cadena de Puesta en Marcha" del Dashboard (`/dashboard`), condicionar la ruta de navegación del botón "[Completar ➔]" del Paso 4 ("Ficha Comercial y Receta Técnica"):
- Si NO existen productos creados en catálogo (productsCount === 0), redirigir a la página `/catalog/products` (módulo de Productos).
- Si YA existen productos creados (productsCount > 0), redirigir a la página `/catalog/recipes` (módulo de Recetas).
NOTA: NO alterar el Header (`OnboardingWizardWidget.jsx`), el cual debe seguir abriendo los modales directos.

FUENTES DE VERDAD:
- apps/web/src/components/dashboard/OnboardingHeroCard.jsx (o componente de tarjetas de puesta en marcha del dashboard)
- apps/web/src/app/dashboard/page.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente el componente de tarjetas de puesta en marcha en el dashboard (máximo 1 lectura).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar SRP (< 145 líneas por componente JSX).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN EL COMPONENTE DE PUESTA EN MARCHA DEL DASHBOARD:
   - Identificar dónde se define la ruta de destino del botón "[Completar ➔]" para el Paso 4:
     ```javascript
     // Obtener conteo de productos desde el diagnóstico de onboarding o props:
     const totalProducts = Number(stepData?.productsCount ?? onboardingStatus?.metrics?.products ?? 0);
     const step4Route = totalProducts > 0 ? '/catalog/recipes' : '/catalog/products';
     ```
   - Asignar `step4Route` como destino de navegación del botón del Paso 4.
   - Si no hay productos, el botón navega a la URL completa `/catalog/products` sin forzar modales flotantes (respetando la experiencia de vista del módulo que solicita el usuario).

2. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/components/dashboard/OnboardingHeroCard.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Desde el Dashboard, hacer clic en "Completar" en el Paso 4 sin productos navega a `/catalog/products`.
- Al existir al menos un producto, el mismo botón navega a `/catalog/recipes`.
- El widget de la barra superior del Header conserva su comportamiento autónomo.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Ruta condicional aplicada en:
- Resultado verify-srp.js: