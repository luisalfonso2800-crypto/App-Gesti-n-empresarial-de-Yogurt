TAREA:
Actualizar `ServerOfflineCanvas.jsx` y `server-offline-canvas.module.css` para incorporar la secuencia de handshake animada en fases antes de desmontar el canvas (reconexión confirmada -> checklist con animación staggered -> desvanecimiento suave hacia el módulo).

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales o releer archivos repetidamente.
- Modularidad estricta y cumplimiento de SRP (< 135 líneas por archivo en frontend).
- CSS Modules puro (cero estilos inline `style={{}}`).

OBJETIVO:
1. En `apps/web/src/components/ui/ServerOfflineCanvas.jsx`:
   - Gestionar un flujo de 3 estados internos: `'offline' | 'handshake' | 'closing'`.
   - **Mecanismo de detección de reconexión:**
     * Al hacer clic en "Reintentar Conexión" (o mediante un health-check de polling opcional): verificar si el servidor responde (ej. `fetch('/api/health')` o ejecución exitosa de `onRetry`).
     * Si la conexión es exitosa, **NO desmontar de inmediato**. Cambiar el estado a `'handshake'`.
   - **Fase 'handshake':**
     * Cambiar el icono a un checkmark verde esmeralda botánico (`#1b4332`).
     * Mostrar secuencialmente 3 mensajes de confirmación de enlace:
       1. `✓ Enlace con Servidor de Planta restablecido`
       2. `✓ Servicios SCADA sincronizados`
       3. `✓ Cargando espacio de trabajo...`
     * Mantener visible durante 700ms - 900ms para permitir lectura y dar sensación de estabilidad.
   - **Fase 'closing':**
     * Aplicar la clase `.fadeOut` con animación suave.
     * Tras 400ms de animación, llamar a la función de reintento/desmontaje final (`onSuccess` o recarga efectiva) para mostrar el módulo activo sin saltos bruscos.

2. En `apps/web/src/components/ui/server-offline-canvas.module.css`:
   - Crear animaciones `@keyframes`:
     * `@keyframes checkPop`: escala suave de entrada para el ícono de confirmación.
     * `@keyframes messageSlideIn`: entrada escalonada (`animation-delay`) para cada mensaje de confirmación.
     * `@keyframes canvasFadeOut`: `opacity: 0; transform: translateY(-4px);` en `0.35s ease-out`.
   - Clases de estado: `.handshakeContainer`, `.stepItem`, `.fadeOut`.

3. Restricciones Técnicas:
   - Mantener `ServerOfflineCanvas.jsx` por debajo de 135 líneas (SRP). Si requiere separar la lista de confirmación, modular en `ReconnectionChecklist.jsx`.
   - 100% CSS Modules.
   - `node .agents/scripts/verify-srp.js` debe arrojar código 0.

FUENTES DE VERDAD:
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/components/ui/server-offline-canvas.module.css`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código en `apps/web/src/components/ui/`. Backend intacto.

ALCANCE:

MODIFICAR:
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/components/ui/server-offline-canvas.module.css`

CREAR (si aplica por SRP):
- `apps/web/src/components/ui/parts/ReconnectionChecklist.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al reconectar, no hay salto repentino al contenido: se visualiza el checklist animado de enlace operativo durante ~800ms.
- El canvas se desvanece suavemente dando paso al módulo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados/creados:
- Duración y secuencia de las fases de transición:
- Resultado de verify-srp.js:
- Estado: