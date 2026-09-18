TAREA:
Habilitar un sondeo de enlace automático (health check polling) en `ServerOfflineCanvas.jsx` para que detecte por sí solo cuando el backend (puerto 4000) termine de iniciar, active la transición de confirmación ("handshake") y desmonte el canvas suavemente hacia el módulo activo.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales o releer archivos repetidamente.
- Edición focalizada en `ServerOfflineCanvas.jsx` y su CSS Module.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En `apps/web/src/components/ui/ServerOfflineCanvas.jsx`:
   - Incorporar un ciclo de sondeo `setInterval` (cada 2.5 segundos) que consulte el endpoint de salud del sistema (ej. `fetch('http://localhost:4000/api/v1/system')` o `/api/health` mediante `apiClient`):
     ```javascript
     useEffect(() => {
       if (status !== 'offline') return;
       const timer = setInterval(async () => {
         try {
           const res = await fetch('/api/v1/system', { method: 'GET', cache: 'no-store' });
           if (res.ok) {
             clearInterval(timer);
             triggerHandshake();
           }
         } catch {
           // Continúa en espera sin lanzar excepciones
         }
       }, 2500);
       return () => clearInterval(timer);
     }, [status]);
     ```
   - **Función `triggerHandshake()`:**
     * Cambiar estado a `'connected'`.
     * Mostrar checklist animado de enlace operativo:
       - `✓ Enlace con Servidor de Planta restablecido`
       - `✓ Bus SCADA sincronizado`
       - `✓ Cargando catálogo/módulo...`
     * Tras 800ms de confirmación, cambiar a estado `'fading'`.
     * Tras 400ms adicionales de desvanecimiento CSS (`.fadeOut`), ejecutar la recarga o callback `onSuccess()` para restaurar la vista original.

2. En `apps/web/src/components/ui/server-offline-canvas.module.css`:
   - Asegurar las clases de animación:
     * `.badgeConnected`: color verde esmeralda (#1b4332 / #2d6a4f) con pulso suave.
     * `.checklistFadeIn`: animación escalonada para los mensajes de confirmación.
     * `.fadeOut`: `opacity: 0; transform: scale(0.99); transition: opacity 0.4s ease, transform 0.4s ease;`.

3. Restricciones Técnicas:
   - Mantener el componente por debajo de 135 líneas (SRP).
   - Validar sintaxis con `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código 0.

FUENTES DE VERDAD:
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/components/ui/server-offline-canvas.module.css`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/components/ui/`. Backend intacto.

ALCANCE:

MODIFICAR:
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/components/ui/server-offline-canvas.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Estando en la pantalla del canvas con el backend levantando, en cuanto la API responde, el canvas detecta automáticamente la señal sin intervención manual.
- Se reproducen los mensajes de confirmación y el canvas se desvanece fluidamente hacia la página (recetas, compras, dashboard, etc.).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Intervalo y endpoint configurado para el sondeo:
- Resultado de verify-srp.js:
- Estado: