TAREA:
Blindar de manera centralizada y definitiva `apps/web/src/lib/api-client.js` para que NINGÚN módulo (Precios de Proveedor, Carrito, Onboarding, Dashboard, etc.) rompa el runtime de React con `ApiError: Failed to fetch` cuando el backend esté apagado o reconectando.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar búsquedas globales en el proyecto.
- Edición focalizada en el cliente de API y emisión de evento de red.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En `apps/web/src/lib/api-client.js`:
   - En el método central de `fetch` / `request`:
     * Capturar los rechazos de red nativos (`TypeError: Failed to fetch`, `net::ERR_CONNECTION_REFUSED` o status 0).
     * Disparar un evento global en el navegador para que el Shell o Canvas se enteren de inmediato:
       `if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('manna:network-offline'));`
     * **Comportamiento resiliente en lecturas (`GET`):**
       Si la petición es de tipo `GET` y falla por caída del servidor:
       - Registrar únicamente un aviso controlado (`console.warn('[API Client] Servidor no accesible:', url)`).
       - En lugar de propagar un `throw new ApiError` incontrolado que quiebre los `Promise.all` de las páginas, retornar un fallback seguro: `[]` (si el endpoint consulta listas como `/supplier-prices`, `/suppliers`, `/items`) o `{ data: null, isOffline: true }`.
       - Opcionalmente, agregar el método seguro `apiClient.safeGet(url, defaultValue = [])` y usarlo para blindar llamadas paralelas críticas.
     * **Comportamiento en escrituras (`POST`, `PUT`, `DELETE`):**
       Conservar el rechazo de error estructurado para que los formularios sepan que la mutación no se guardó.

2. En la vista de Precios de Proveedor (`apps/web/src/app/.../precios-proveedor/` o su hook de carga):
   - Envolver el `Promise.all` dentro de un bloque `try/catch` para asegurar que, si alguna promesa rechaza, capture el estado amigablemente o renderice `<ServerOfflineCanvas />` sin pantalla roja de error.

3. Restricciones Técnicas:
   - Mantener `api-client.js` menor a 135 líneas (SRP).
   - `node .agents/scripts/verify-srp.js` debe retornar código 0.

FUENTES DE VERDAD:
- `apps/web/src/lib/api-client.js`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/lib/api-client.js`
- Componente/hook de carga de Precios de Proveedor que contiene el `Promise.all`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/lib/api-client.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al navegar por Precios de Proveedor (o cualquier otro módulo) con el backend apagado, no aparece la pantalla roja de Next.js.
- El sistema muestra el estado vacío seguro o el canvas botánico de reconexión.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Estrategia de blindaje centralizada en apiClient:
- Resultado de verify-srp.js:
- Estado: