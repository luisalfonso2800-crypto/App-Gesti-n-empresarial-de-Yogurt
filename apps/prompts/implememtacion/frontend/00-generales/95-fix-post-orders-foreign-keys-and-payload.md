TAREA CONTROLADA — DIAGNÓSTICO Y CORRECCIÓN INTEGRAL DE POST /purchases/orders Y MAPEO DE CLAVES FORÁNEAS

OBJETIVO TÉCNICO EXACTO
Resolver definitivamente el error `Failed to create order` en `proceedToPurchase` al convertir los ítems del carrito en una `OrdenCompra`:
1. Diagnosticar `apps/api/src/purchases/purchases.repository.js` (método `createOrder`):
   - Inspeccionar los nombres exactos de campos en `schema.prisma` para `OrdenCompraItem` (verificar si son `idInsumo`/`idProveedor`/`idPresentacion` o `insumoId`/`proveedorId`/`presentacionId`).
   - Normalizar de forma defensiva:
     * `insumoId`: extraer con fallback `item.insumoId || item.idInsumo || item.id`.
     * `proveedorId`: extraer con fallback `item.proveedorId || item.idProveedor`.
     * `presentacionId`: si viene vacío, `undefined` o `"undefined"`, enviar estrictamente `null` para no romper la foreign key en PostgreSQL.
     * `cantidad`: asegurar `Number(item.cantidad || item.cantidadSolicitada || 1)`.
     * `precioEstimado`: asegurar `Number(item.precioEstimado || item.precioEmpaque || item.precio || 0)`.
2. Logging y Respuesta de Error en NestJS (`purchases.controller.js` y `purchases.service.js`):
   - Envolver el método `POST orders` en un bloque `try/catch` con `console.error('[CreateOrder Error Detail]:', error)` para que cualquier error de Prisma se imprima en la consola de la API con su mensaje completo en vez de un objeto vacío `{}`.
   - Devolver `BadRequestException(error.message)` si faltan campos obligatorios.
3. En Frontend (`apps/web/src/components/shell/Header.jsx` y `apps/web/src/app/catalog/supplier-prices/page.jsx`):
   - Asegurar que `proceedToPurchase` arme el payload plano y limpio:
     ```javascript
     const payload = {
       nombre: `Lista de Compra - ${new Date().toLocaleDateString('es-CO')}`,
       items: cart.map(item => ({
         insumoId: item.insumoId || item.idInsumo || item.id,
         proveedorId: item.proveedorId || item.idProveedor,
         presentacionId: item.presentacionId || item.idPresentacion || null,
         cantidad: Number(item.cantidad || 1),
         precioEstimado: Number(item.precioEmpaque || item.precio || 0)
       }))
     };
     ```
4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o borrar `.next`. Validar con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/api/prisma/schema.prisma (modelos OrdenCompra y OrdenCompraItem)
- apps/api/src/purchases/purchases.repository.js
- apps/api/src/purchases/purchases.controller.js
- apps/api/src/purchases/purchases.service.js
- apps/web/src/components/shell/Header.jsx
- apps/web/src/app/catalog/supplier-prices/page.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.
2. Manejo de claves foráneas seguro: nunca enviar strings vacíos `""` en campos UUID opcionales de Prisma; deben enviarse como `null`.
3. Notificación limpia en UI: si falla la creación, emitir el Toast con el motivo exacto devuelto por la API.

VALIDACIÓN LIGERA (SIN BUILD)
- Validar sintaxis con `node --check` sobre los archivos modificados.
- Confirmar que al dar clic en "Preparar Orden" en la barra del carrito se cree el registro en la base de datos y retorne código HTTP 201/200 con el objeto de la orden creada.

FORMATO DE REPORTE
Entregar reporte técnico puntual indicando nombres de campos unificados según schema.prisma, protección contra foreign keys nulas y validación de sintaxis.