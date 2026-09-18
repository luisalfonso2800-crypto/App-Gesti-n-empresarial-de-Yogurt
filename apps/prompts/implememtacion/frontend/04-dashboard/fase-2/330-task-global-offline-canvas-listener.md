TAREA:
Hacer visible el `ServerOfflineCanvas` en toda la aplicación escuchando el evento de red `manna:network-offline`, asegurando que cuando el servidor no responda se muestre el canvas botánico y, al restablecer conexión, ejecute la transición animada de confirmación (handshake) antes de volver al módulo.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Cumplimiento estricto de SRP (< 135 líneas por archivo).
- CSS Modules puro (cero estilos inline).

OBJETIVO:
1. En `apps/web/src/components/shell/Shell.jsx` (o `AppShell.jsx`):
   - Agregar un estado reactivo global de conexión: `const [isServerOffline, setIsServerOffline] = useState(false)`.
   - Escuchar los eventos del navegador emitidos por `api-client.js`:
     * `window.addEventListener('manna:network-offline', () => setIsServerOffline(true))`
     * `window.addEventListener('manna:network-online', () => ...)`
   - Cuando `isServerOffline` sea true:
     * Renderizar `<ServerOfflineCanvas />` cubriendo el área principal (`main`), conservando visible el Sidebar lateral.
     * Al detectar reconexión o al pulsar "Reintentar Conexión": verificar si la API responde (sondeo a `/api/health` o endpoint base).

2. En `apps/web/src/components/ui/ServerOfflineCanvas.jsx` (Secuencia de 3 Fases):
   - **Fase 1 (offline):** Hoja con pulso botánico y texto "Sincronizando con Servidor de Planta...".
   - **Fase 2 (handshake):** Al confirmar respuesta HTTP 200 del backend, mostrar la lista animada durante 800ms:
     * `✓ Enlace SCADA establecido`
     * `✓ Servicios de planta sincronizados`
     * `✓ Cargando módulo de trabajo...`
   - **Fase 3 (closing):** Desvanecimiento suave con clase CSS `.fadeOut` (350ms) y cambio de `isServerOffline` a `false` para revelar el módulo activo.

3. En `apps/web/src/lib/api-client.js`:
   - Asegurar que cuando un `fetch` falle por error de red o socket (status 0), invoque inmediatamente `window.dispatchEvent(new CustomEvent('manna:network-offline'))`.
   - Cuando una petición sea exitosa tras un fallo previo, emitir `window.dispatchEvent(new CustomEvent('manna:network-online'))`.

4. Restricciones Técnicas:
   - Respetar límite de 135 líneas por archivo.
   - Si `Shell.jsx` o `ServerOfflineCanvas.jsx` superan el límite, desacoplar en subcomponentes (`OfflineOverlay.jsx`, `HandshakeChecklist.jsx`).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/Shell.jsx`
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/lib/api-client.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/components/shell/Shell.jsx`
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/lib/api-client.js`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`
2. `node --check apps/web/src/components/shell/Shell.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al detener el backend o perder enlace, la pantalla muestra de inmediato el canvas botánico interactivo en el área principal de trabajo.
- Al restaurar el servicio, muestra la confirmación de 3 pasos y se desvanece suavemente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Conexión del evento global entre apiClient y Shell:
- Resultado de verify-srp.js:
- Estado: