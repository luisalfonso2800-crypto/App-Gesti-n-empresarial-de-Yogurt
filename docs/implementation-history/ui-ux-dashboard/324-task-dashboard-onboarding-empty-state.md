TAREA:
Transformar la pantalla principal del Dashboard cuando el sistema se encuentre en estado inicial (0% o puesta en marcha incompleta), reemplazando los gráficos vacíos por un "Centro de Puesta en Marcha Interactivo" (Empty State Onboarding) que guíe al usuario paso a paso.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Edición focalizada en el Dashboard y sus componentes de estado vacío.
- Límite SRP estricto (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En `apps/web/src/app/page.jsx` (o componente principal del Dashboard `DashboardView.jsx`):
   - Consumir el estado actual del asistente de puesta en marcha (ej. hook `useOnboardingStatus` o datos de progreso de los 6 pasos).
   - Condición de visualización: Si el progreso de puesta en marcha no está completo (o ventas = 0 e inventario = 0):
     * Renderizar el componente `OnboardingHeroState.jsx` en lugar de las gráficas vacías de flujo de caja y cartera.
     * Permitir mediante un switch sutil alternar entre: `[Modo Asistente]` y `[Modo Dashboard Tradicional]`.

2. Crear componente `OnboardingHeroState.jsx` (y sus estilos CSS Modules):
   - **Banner Principal de Bienvenida:**
     * Encabezado botánico cálido: "Configuración Inicial de Planta MANNÁ".
     * Explicación breve: "Para habilitar la telemetría, balance financiero y monitoreo de silos, completemos los pasos básicos de configuración."
     * Progreso visual claro (barra de porcentaje y contador "X de 6 pasos").
   - **Paso Activo Destacado (Call to Action):**
     * Destacar en grande el siguiente paso a completar con botón directo de navegación (ej. si falta el paso 1, botón primario verde: "Paso 1: Configurar Formatos y Envases ➔").
   - **Ruta de Pasos en Tarjetas Compactas:**
     * Renderizar los 6 pasos en tarjetas horizontales limpias con su estado (Pendiente, En curso, Completado) y botón "Completar / Ir".

3. Restricciones Técnicas:
   - Modularizar subcomponentes para respetar el límite de 135 líneas (SRP).
   - Estilos CSS Modules puros (cero inline styles `style={{}}`).
   - Mantener el Sidebar, Topbar y el widget superior intactos.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/page.jsx`
- Componentes existentes del onboarding / puesta en marcha en `apps/web/src/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/components/dashboard/OnboardingHeroState.jsx`
- `apps/web/src/components/dashboard/onboarding-hero.module.css`

MODIFICAR:
- Componente principal del Dashboard (`apps/web/src/app/page.jsx` o vista del dashboard).

NO MODIFICAR:
- `apps/api/` (backend intacto).

VERIFICACIÓN:
1. `node --check apps/web/src/components/dashboard/OnboardingHeroState.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al entrar con datos en cero, el Dashboard guía al usuario de forma clara con el paso 1 visible y accesible directamente en el centro de la pantalla.
- Opción de alternar a la vista normal si se desea.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Comportamiento del Onboarding en pantalla central:
- Resultado de verify-srp.js:
- Estado: