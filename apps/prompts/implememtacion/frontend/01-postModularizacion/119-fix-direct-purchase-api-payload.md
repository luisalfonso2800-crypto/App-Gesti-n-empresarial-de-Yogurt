> Corrige el error en la petición de "Nueva Compra Directa" al ejecutar handleConfirmar:

1. DIAGNÓSTICO:
   - Al pulsar "Guardar y Registrar Compra" en modo directo (`mode=direct`), el cliente lanza:
     `ApiError: Error en la petición at async handleConfirmar at async Promise.all (index 0)`.
   - Causa probable:
     a) El endpoint `POST /purchases` (o `/purchases/direct`) en NestJS requiere un `ordenId` / `orderId` obligatorio en su DTO y falla porque en compra directa no existía una lista previa.
     b) O la estructura del payload construida en `handleConfirmar` dentro de `FormPhase.jsx` no coincide con el DTO que espera el backend (nombres de campos como `idProveedor` vs `supplierId`, `idInsumo` vs `supplyId`, formatos de fecha, o campos numéricos enviados como string).

2. INSPECCIÓN EN BACKEND (apps/api):
   - Revisa `apps/api/src/modules/purchases/purchases.controller.ts` y sus DTOs asociados (`CreatePurchaseDto`).
   - Verifica si existe o si se debe contemplar la creación de compra directa sin orden previa, o si el endpoint crea internamente una orden con estado "COMPLETADA" / "RECIBIDA".
   - Confirma los nombres y tipos exactos de los campos que espera el backend para registrar la compra.

3. ACCIÓN EN apps/web/src/app/operations/purchases/new/components/FormPhase.jsx:
   - Si el backend requiere que exista una orden:
     * Antes de enviar el `POST /purchases`, crea una orden directa automática (ej: `POST /purchases/orders` con nombre `Compra Directa - [Fecha]` y estado correspondiente), o envía la bandera requerida por el backend para compras directas en el mismo payload.
   - Alinea estrictamente los campos del body en `handleConfirmar` con el DTO del backend:
     * IDs numéricos convertidos con `Number(...)` si el DTO no acepta strings.
     * Cantidades y precios formateados como números válidos (`parseFloat`).
   - Agrega manejo de error detallado con `console.error('Error detallado del backend:', error)` para imprimir el mensaje exacto que devuelve la API en la consola del navegador en caso de rechazo de validación.

4. VALIDACIÓN:
   - Ingresa por "Nueva Compra Directa" desde `/operations/purchases`.
   - Agrega una o más filas (con proveedor, insumo, cantidad y costo).
   - Presiona "Guardar y Registrar Compra": debe responder HTTP 201/200, guardar la compra y redirigir limpiamente a `/operations/purchases` mostrando la compra registrada en el listado.
   - Verifica que no arroje errores de sintaxis:
     node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx