TAREA:
Blindar de forma centralizada y definitiva el cliente de API (`api-client.js`) y los contextos iniciales (`CartContext.jsx`, `useOnboardingBulkCheck.js`) para erradicar las excepciones no controladas de `Failed to fetch` cuando el backend esté caído o iniciando.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales sobre el proyecto.
- Cero ciclos redundantes. Edición focalizada en los archivos asignados.
- Cumplimiento de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En `apps/web/src/lib/api-client.js`:
   - Identificar el manejo de errores en el método central de `fetch`.
   - Cuando la llamada nativa falle por socket/red (`TypeError: Failed to fetch` o status 0):
     * Notificar globalmente la caída mediante evento nativo de navegador:
       `if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('manna:network-offline'));`
     * Para métodos de consulta (`GET` o llamadas seguras configuradas con flag `silentOffline: true`), evitar reventar el runtime con un `throw` incontrolado si el consumidor no lo atrapa; o proveer un método `safeGet(url, defaultValue)` que retorne `{ data: defaultValue, isOffline: true }`.
     * Si mantiene el `throw new ApiError`, proveer un helper estandarizado de fallback.

2. En `apps/web/src/context/CartContext.jsx`:
   - Inspeccionar la llamada asíncrona alrededor de la línea 61.
   - Envolver la carga inicial dentro de un bloque `try/catch`:
     ```javascript
     try {
       const res = await apiClient.get('/cart'); // o endpoint equivalente
       setCart(res || []);
     } catch (err) {
       console.warn('[CartContext] Servidor de planta no disponible, iniciando carrito vacío local.');
       setCart([]);
     }
     ```

3. En `apps/web/src/components/shell/parts/useOnboardingBulkCheck.js`:
   - Envolver la llamada en la línea 25 dentro de `try/catch` retornando un objeto de comprobación neutro/seguro para evitar quebrar la vista de inicio.

4. Restricciones Técnicas:
   - Mantener los archivos bajo el umbral de 135 líneas (SRP).
   - Validar con `node .agents/scripts/verify-srp.js` asegurando código 0.

FUENTES DE VERDAD:
- `apps/web/src/lib/api-client.js`
- `apps/web/src/context/CartContext.jsx`
- `apps/web/src/components/shell/parts/useOnboardingBulkCheck.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/`. Backend intacto.

ALCANCE:

MODIFICAR:
- `apps/web/src/lib/api-client.js`
- `apps/web/src/context/CartContext.jsx`
- `apps/web/src/components/shell/parts/useOnboardingBulkCheck.js`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/lib/api-client.js`
2. `node --check apps/web/src/context/CartContext.jsx`
3. `node --check apps/web/src/components/shell/parts/useOnboardingBulkCheck.js`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Se eliminan por completo los overlays rojos de Next.js (`Failed to fetch`) tanto de `CartContext` como de `useOnboardingBulkCheck`.
- La aplicación carga pacíficamente con datos iniciales seguros o muestra el `ServerOfflineCanvas`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Estrategia de blindaje centralizada aplicada:
- Resultado de verify-srp.js:
- Estado: