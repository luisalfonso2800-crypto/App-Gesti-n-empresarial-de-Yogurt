TAREA DE AUDITORÍA Y CORRECCIÓN — RESOLUCIÓN DE 404 EN POST /purchases/orders Y UNIFICACIÓN DE PREFIJO /api/v1

EVIDENCIA DIAGNÓSTICA CONFIRMADA
En las herramientas de desarrollo (Network), la petición falla con:
- Request URL: http://localhost:3001/api/purchases/orders
- Request Method: POST
- Status Code: 404 Not Found
Causa directa: Discrepancia en el prefijo de la API. NestJS opera bajo el prefijo `/api/v1/`, mientras que la llamada despachada en frontend omitió el `/v1`, o en `purchases.controller.js` el routing no está acoplado con la versión global. Al responder 404, el wrapper de fetch no parsea el error y arroja `ConsoleError: Failed to create order {}`.

OBJETIVO TÉCNICO EXACTO
1. Revisar `docs/` para contrastar diagnósticos y arquitectura previa del módulo de compras y actualizar la documentación con este flujo.
2. Estandarizar la URL base y endpoint en Frontend:
   - En `apps/web/src/lib/api.js` (o cliente centralizado de axios/fetch), verificar que la URL base apunte a `/api/v1`.
   - En `apps/web/src/components/shell/Header.jsx` y `apps/web/src/app/catalog/supplier-prices/page.jsx`:
     Asegurar que la llamada a `proceedToPurchase` use la ruta canónica `/purchases/orders` bajo el cliente que ya incluye `/api/v1` (o llamar explícitamente a `/api/v1/purchases/orders`).
3. Verificar en Backend (`apps/api/src/purchases/purchases.controller.js` y `main.js`):
   - Confirmar que `setGlobalPrefix('api/v1')` aplique al controlador `@Controller('purchases')`.
   - Confirmar que `@Post('orders')` registre exactamente la ruta:
     `[POST] /api/v1/purchases/orders`.
4. Serialización y Visibilidad de Errores:
   - En `apps/web/src/lib/api.js` (o en el `catch` de `proceedToPurchase`), asegurarse de imprimir `error.message` y `error.response?.data` en lugar de loguear un objeto plano cerrado `console.error('...', error)`.
5. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o purgar `.next`. Validar únicamente con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- docs/ (documentos de diagnóstico y arquitectura de compras)
- apps/api/src/main.js
- apps/api/src/purchases/purchases.controller.js
- apps/api/src/purchases/purchases.service.js
- apps/api/src/purchases/purchases.repository.js
- apps/web/src/components/shell/Header.jsx
- apps/web/src/app/catalog/supplier-prices/page.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.
2. Consistencia REST: Todas las peticiones deben resolver contra `/api/v1/...`.
3. Manejo de errores claro: Mostrar Toast amigable en caso de rechazo del servidor.

VALIDACIÓN LIGERA (SIN BUILD PESADO)
- Verificar sintaxis con `node --check` sobre los archivos modificados.
- Confirmar que en la consola de arranque de NestJS figure la ruta mapeada:
  `Mapped {/api/v1/purchases/orders, POST}`.
- Comprobar que en Network la petición `POST /api/v1/purchases/orders` retorne HTTP 201 Created y redirija de inmediato al checklist.

FORMATO DE REPORTE
Entregar reporte técnico detallando la corrección del prefijo `/api/v1/`, el estado de la ruta en NestJS y la confirmación de la prueba funcional.