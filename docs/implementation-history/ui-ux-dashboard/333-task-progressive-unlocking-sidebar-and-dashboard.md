TAREA:
Implementar el sistema de desbloqueo progresivo ("Progressive Disclosure / Locked State") tanto en el Sidebar lateral como en las tarjetas rápidas del Dashboard, atenuando con opacidad, cursor bloqueado e ícono de candado las secciones que requieran prerrequisitos de la cadena de valor (Formatos -> Insumos -> Compras -> Recetas -> Producción -> Ventas).

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Edición focalizada en la configuración de navegación del Sidebar y las tarjetas del Dashboard.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. Crear una utilidad centralizada de permisos de navegación:
   - Archivo `apps/web/src/lib/onboarding-unlock-rules.js` (o subcarpeta de shell):
     * Exponer una función helper `isRouteUnlocked(routePath, onboardingStatus)` que evalúe si la ruta está activa o bloqueada según los pasos completados (0 a 6):
       - Rutas libres: `/dashboard`, `/alarms`, `/catalog/presentations`, `/catalog/supplies`, `/catalog/suppliers`, `/commercial/clients`.
       - Requiere Insumos/Proveedores (Paso 2): `/catalog/supplier-prices`, `/operations/purchases`.
       - Requiere Insumos + Presentaciones (Paso 3): `/operations/inventory`, `/catalog/products`, `/catalog/recipes`.
       - Requiere Receta (Paso 4): `/operations/production`, `/operations/lots`.
       - Requiere Producción/Lotes (Paso 5): `/commercial/sales`, `/commercial/payments`, `/commercial/expenses`.
     * Retornar un objeto estructurado: `{ isUnlocked: boolean, requiredStepText: string }`.

2. En el Sidebar (`Sidebar.jsx` o componente que mapea los links):
   - Consumir el estado de onboarding (`useOnboardingStatus`).
   - Para cada enlace que devuelva `isUnlocked === false`:
     * Reemplazar o deshabilitar el `<Link>`/`<a>` (usar `onClick={(e) => e.preventDefault()}` o renderizar `<div>` contenedor).
     * Aplicar la clase CSS `.navItemLocked`:
       - `opacity: 0.38; filter: grayscale(0.6); cursor: not-allowed;`
       - Mantener el espaciado vertical compactado para NO generar scrollbar.
       - Renderizar un micro-ícono de candado sutil al lado derecho del texto o del contenedor flex.
       - Agregar atributo `title={`Bloqueado: Requiere ${requiredStepText}`}` accesible.

3. En el Dashboard (`DashboardView.jsx` o tarjetas de acceso rápido):
   - Aplicar exactamente la misma regla `isRouteUnlocked` a las tarjetas de acceso rápido (Compras, Precios Proveedor, Productos, Pagos y Cobros, Ventas).
   - Aplicar `.cardLocked` con opacidad reducida, cursor bloqueado e ícono de candado discreto en la esquina.

4. En sus respectivos CSS Modules:
   - Estilos limpios y coherentes con la identidad botánica oscura del Sidebar y clara del Dashboard.
   - Transiciones suaves (`transition: opacity 0.3s ease, filter 0.3s ease`) para cuando se desbloqueen en tiempo real.

5. Restricciones Técnicas:
   - Respetar límite de 135 líneas por archivo. Separar lógica si es necesario.
   - Cero estilos en línea (`style={{}}`).
   - Validar sintaxis con `node --check` y `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/Sidebar.jsx`
- `apps/web/src/components/shell/shell.module.css`
- `apps/web/src/hooks/useOnboardingStatus.js`
- Componentes del Dashboard en `apps/web/src/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/lib/onboarding-unlock-rules.js`

MODIFICAR:
- `apps/web/src/components/shell/Sidebar.jsx`
- CSS Module del Sidebar
- Tarjetas de módulos del Dashboard y su CSS Module

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/lib/onboarding-unlock-rules.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con la planta en 0%, únicamente las secciones maestras base están activas; los módulos operativos avanzados aparecen atenuados con candado tanto en el sidebar como en el dashboard.
- Al avanzar en la puesta en marcha, cada módulo se enciende automáticamente.
- Cero scrollbars nuevos en el sidebar.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Tabla de correspondencia de rutas bloqueadas y prerrequisitos:
- Resultado de verify-srp.js:
- Estado: