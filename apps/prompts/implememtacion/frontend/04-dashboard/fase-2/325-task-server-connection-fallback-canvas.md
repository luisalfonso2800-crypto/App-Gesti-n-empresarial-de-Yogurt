TAREA:
Implementar un componente Canvas / Pantalla de Estado de Desconexión ("Server Connection Fallback") alineado con la identidad botánica de MANNÁ, para reemplazar los errores crudos "Failed to fetch" en cualquier módulo cuando el servidor esté cargando, reiniciando o sin conexión.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Modularidad estricta y cumplimiento de SRP (< 135 líneas por archivo en frontend).
- CSS Modules puro (cero estilos en línea).

OBJETIVO:
1. Crear el componente reutilizable `ServerOfflineCanvas.jsx` (y su CSS Module `server-offline-canvas.module.css`) en `apps/web/src/components/ui/` (o `components/shell/`):
   - **Diseño e Identidad:**
     * Fondo crema sutil acorde a la paleta del shell (`#f7f4ed` o token de superficie).
     * Isotipo botánico (hoja MANNÁ) centrado con animación CSS suave de pulso/respiración (`pulse`).
     * Título claro: "Sincronizando con Servidor de Planta".
     * Mensaje de tranquilidad: "El enlace operativo se ha pausado temporalmente o el servicio está iniciando. Reintentando enlace automáticamente..."
     * Botón táctico de acción rápida: "Reintentar Conexión" (`onClick` que invoque recarga de datos o `window.location.reload()`).
     * Badge de diagnóstico sutil: "Estado: Reconectando SCADA Bus..."

2. Integrar en la capa de captura de errores o fetch global:
   - Identificar dónde se renderiza el bloque `Error: Failed to fetch` (ej. en `apps/web/src/app/page.jsx`, `ErrorBoundary.jsx`, o el wrapper de datos del Dashboard/Shell).
   - Sustituir el mensaje de texto crudo por `<ServerOfflineCanvas onRetry={...} />`.
   - Asegurar que el layout conserve el Sidebar intacto y este canvas ocupe el área principal de trabajo (`main content`).

3. Restricciones Técnicas:
   - Componentes menores a 135 líneas (SRP).
   - Estilos 100% en CSS Modules.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/components/ui/ServerOfflineCanvas.jsx`
- `apps/web/src/components/ui/server-offline-canvas.module.css`

MODIFICAR:
- Archivo que renderiza el fallback de error actual (`apps/web/src/app/page.jsx` o componente que maneja el error).

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/ServerOfflineCanvas.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al detener el backend o recibir "Failed to fetch", la pantalla muestra el canvas botánico interactivo con animación de reconexión y botón de reintento.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Aspecto y respuesta ante reconexión:
- Resultado de verify-srp.js:
- Estado: