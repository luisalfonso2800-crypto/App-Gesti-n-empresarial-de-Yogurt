TAREA CONTROLADA — CORRECCIÓN FUNCIONAL DEL BOTÓN "REINTENTAR CONEXIÓN" EN SERVEROFFLINECANVAS

OBJETIVO TÉCNICO:
Hacer plenamente funcional el botón "Reintentar Conexión" en `ServerOfflineCanvas.jsx` para que, cuando el servidor (NestJS en puerto 4000) esté encendido, una pulsación del usuario compruebe el enlace real, active la animación de handshake/confirmación y desmonte el canvas revelando el módulo de trabajo sin requerir un Ctrl+F5 forzado.

FUENTES DE VERDAD:
- apps/web/src/components/ui/ServerOfflineCanvas.jsx
- apps/web/src/lib/api-client.js
- apps/web/src/components/ui/server-offline-canvas.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Máximo 1 lectura por archivo a modificar. Prohibido ejecutar búsquedas globales (Find/Search).
- Modificar EXCLUSIVAMENTE `apps/web/src/components/ui/ServerOfflineCanvas.jsx` (y su CSS Module si requiere clase para estado de carga).
- Prohibido tocar código de backend (`apps/api/`).
- Cumplimiento de SRP (< 135 líneas en el componente JSX).
- Cero estilos en línea (`style={{}}`).

ACCIONES A EJECUTAR:
1. En `apps/web/src/components/ui/ServerOfflineCanvas.jsx`:
   - Inspeccionar el manejador `handleRetry` del botón "Reintentar Conexión".
   - Al pulsar el botón:
     * Establecer un estado transitorio local (ej. `isChecking: true` y cambiar el texto del botón a "Comprobando enlace...").
     * Realizar la comprobación activa contra la URL base de la API usando `apiClient` o `fetch` al endpoint que expone NestJS (`/api/v1/system/onboarding-status` o `/api/v1/system` o el prop `onRetry`).
     * Si la petición responde con éxito (`res.ok` o respuesta no vacía):
       - Disparar `triggerHandshake()` (animación botánica de confirmación de 800ms).
       - Emitir el evento de red online: `if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('manna:network-online'));`
       - Ejecutar `onSuccess?.()` o `onRetry?.()`. Si no hay prop de recuperación provisto, ejecutar `window.location.reload()`.
     * Si falla:
       - Regresar el botón a su estado normal "Reintentar Conexión" permitiendo volver a pulsar.
2. Asegurar que el polling automático (si existe) no colisione con el clic manual.
3. Ejecutar verificaciones estáticas:
   - `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Al hacer clic en el botón con la API corriendo en el puerto 4000, el canvas se desbloquea y da paso a la aplicación.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Manejador de reintento implementado en: ServerOfflineCanvas.jsx
- Endpoint/estrategia de comprobación:
- Resultado verify-srp.js: