TAREA:
Blindar el manejo de errores en `src/hooks/useOnboardingStatus.js` y `src/lib/api-client.js` para capturar de forma segura las excepciones `Failed to fetch`, activando el estado `isOffline` o enviando el fallback a `ServerOfflineCanvas` sin quebrar el render de React.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. No ejecutes Search globales ni releas archivos repetidamente.
- Edición focalizada en el hook y el cliente de API.
- Cumplimiento de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En `apps/web/src/hooks/useOnboardingStatus.js`:
   - Envolver las llamadas asíncronas (`api.get(...)`) dentro de un bloque `try/catch` robusto.
   - Si la promesa rechaza con `Failed to fetch` o error de red:
     * No propagar la excepción no controlada hacia React.
     * Establecer un estado `{ isOffline: true, error: err, loading: false }` o devolver un fallback con los pasos en 0% por defecto.
     * Exponer una función `retry()` para que el componente pueda volver a intentar la consulta una vez que el servidor responda.

2. En `apps/web/src/lib/api-client.js` (o en la vista que consume el hook):
   - Asegurar que los errores de red (`TypeError: Failed to fetch`) devuelvan un error estructurado predecible en lugar de romper el hilo de ejecución:
     ```javascript
     try {
       const res = await fetch(url, options);
       return await res.json();
     } catch (error) {
       // Normalizar error de conexión
       throw new Error(error.name === 'TypeError' ? 'Failed to fetch' : error.message);
     }
     ```

3. Integración con el Canvas:
   - Si `useOnboardingStatus` o la página detectan `isOffline: true`, renderizar `<ServerOfflineCanvas onRetry={retry} />` permitiendo el reintento fluido con la transición botánica sin que Next.js lance pantalla roja de desarrollo.

4. Restricciones Técnicas:
   - Mantener archivos por debajo de 135 líneas (SRP).
   - Estilos en CSS Modules.
   - Ejecutar `node .agents/scripts/verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/hooks/useOnboardingStatus.js`
- `apps/web/src/lib/api-client.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/hooks/useOnboardingStatus.js`
- `apps/web/src/lib/api-client.js` (si aplica para estandarizar el error de red)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/hooks/useOnboardingStatus.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con el backend detenido o reiniciando, la aplicación NO crashea con la pantalla roja de Next.js.
- En su lugar, se muestra pacíficamente el `ServerOfflineCanvas` o el estado de carga/espera.
- Al iniciar el backend, el reintento recupera los datos y procede al dashboard.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Manejo de excepción aplicado en useOnboardingStatus:
- Resultado de verify-srp.js:
- Estado: