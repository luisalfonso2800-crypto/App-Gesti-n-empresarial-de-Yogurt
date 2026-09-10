TAREA CONTROLADA — CORRECCIÓN DE PAYLOAD Y CREACIÓN EN POST /purchases/orders

OBJETIVO TÉCNICO EXACTO
Resolver el error `ConsoleError: Failed to create order` en `proceedToPurchase` al presionar "Preparar Orden":
1. En `apps/api/src/purchases/purchases.repository.js` y `purchases.service.js`:
   - Auditar el método de creación de la orden (`createOrder` / `POST /purchases/orders`).
   - Mapear de forma segura cada ítem del array recibido con los atributos exactos de `OrdenCompraItem` en `schema.prisma`:
     * `insumoId`: String (UUID)
     * `proveedorId`: String (UUID)
     * `presentacionId`: String (UUID) o null
     * `cantidad`: Float / Int (default 1 si viene vacío o NaN)
     * `precioEstimado`: Float (default 0 si viene vacío o NaN)
     * `estadoItem`: 'PENDIENTE'
   - Generación robusta del consecutivo: Si no existe orden previa en el año, usar `ORD-2026-0001`. Si falla la secuencia, calcular conteo `+ 1` formateado con padding de 4 dígitos.
2. En `apps/web/src/components/shell/Header.jsx` y `apps/web/src/app/catalog/supplier-prices/page.jsx`:
   - En `proceedToPurchase`, sanitizar el payload antes del `apiClient.post('/purchases/orders', ...)`:
     * Asegurarse de enviar `{ nombre: 'Lista de Compras #' + fecha, items: sanitizedItems }`.
     * Cada ítem debe contener IDs limpios extraídos del carrito (`item.insumoId || item.idInsumo`, `item.proveedorId`, etc.).
   - Al responder 201/200 con la orden creada:
     * Limpiar el storage del carrito (`localStorage`/`sessionStorage`).
     * Emitir el evento de carrito limpio (`cartUpdated`).
     * Redirigir limpiamente a `/operations/purchases/new?orderId=${data.id}`.
3. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o purgar `.next`. Validar con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/api/prisma/schema.prisma (modelos OrdenCompra y OrdenCompraItem)
- apps/api/src/purchases/purchases.repository.js
- apps/api/src/purchases/purchases.service.js
- apps/api/src/purchases/purchases.controller.js
- apps/web/src/components/shell/Header.jsx
- apps/web/src/app/catalog/supplier-prices/page.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. Manejo controlado de excepciones: si ocurre un error en el backend, devolver el mensaje específico en JSON (`BadRequestException` o similar) para no ocultar la causa en la consola.
3. Cero bloqueos nativos `alert()`. Usar toasts o notificaciones suaves si el carrito está vacío.

VALIDACIÓN LIGERA (SIN BUILD)
- Validar sintaxis con `node --check` en los archivos intervenidos.
- Comprobar que al hacer clic en "Preparar Orden" se cree la orden exitosamente en base de datos y redirija a `/operations/purchases/new?orderId=...` sin errores en la consola.

FORMATO DE REPORTE
Entregar reporte técnico puntual detallando el mapeo de campos corregido, la generación del consecutivo y la confirmación de sintaxis limpia.