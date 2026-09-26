TAREA:
Corregir el fallo de empaquetado de Webpack (`TypeError: Cannot read properties of undefined (reading 'call')`) en el módulo de Alarmas SCADA, asegurando la directiva de cliente, resolviendo importaciones rotas y conectando el módulo al canvas resiliente cuando el servidor esté desconectado.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales o releer archivos repetidamente.
- Edición focalizada en el archivo de ruta de Alarmas SCADA.
- Límite SRP estricto (< 135 líneas por archivo en frontend).

OBJETIVO:
1. Localizar la página de Alarmas SCADA (`apps/web/src/app/scada-alarms/page.jsx`, `apps/web/src/app/alarms/page.jsx` o similar según la ruta configurada en el sidebar):
   - Verificar que tenga `'use client';` en la primera línea.
   - Auditar todas las sentencias `import`:
     * Validar que ningún componente o hook importado sea `undefined` (verificar rutas relativas y si las exportaciones son por defecto o nominales).
     * Asegurar que las importaciones de `apiClient` o hooks no generen dependencias circulares.
   - En la lógica de carga asíncrona:
     * Envolver las peticiones dentro de un bloque `try/catch` seguro.
     * Si la API está apagada, capturar el evento o establecer un fallback seguro sin romper la inicialización del componente de React.

2. Restricciones Técnicas:
   - Mantener el archivo por debajo de 135 líneas (SRP).
   - Estilos 100% en CSS Modules.
   - Validar con `node --check` y `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- Ruta del sidebar (`sidebar-nav-items.js` o `Sidebar.jsx`) para confirmar la URL exacta de "Alarmas SCADA".
- Página de Alarmas SCADA en `apps/web/src/app/`.
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- Archivo de la página de Alarmas SCADA (`page.jsx` correspondiente).

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-page.jsx-de-alarmas>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El módulo de Alarmas SCADA carga sin excepciones de Webpack (`options.factory`).
- Estando desconectado, muestra el estado seguro o el canvas de reconexión sin pantalla roja de Next.js.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivo corregido:
- Causa identificada del error de Webpack (importación faltante, circular o falta de 'use client'):
- Resultado de verify-srp.js:
- Estado: