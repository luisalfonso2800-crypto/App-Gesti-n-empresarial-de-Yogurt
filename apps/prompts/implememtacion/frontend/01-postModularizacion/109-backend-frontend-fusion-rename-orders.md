TAREA CONTROLADA — EDICIÓN DE NOMBRE DE LISTA Y FUSIÓN DE ÓRDENES (BACKEND & FRONTEND)

OBJETIVO TÉCNICO EXACTO
1. Implementar la edición y persistencia del nombre personalizado de la lista de compra con sincronización en tiempo real hacia el Carrito (`Header.jsx`).
2. Implementar en backend el endpoint real de fusión inteligente de órdenes (`POST /api/v1/purchases/merge`) y conectarlo con la selección de checkboxes del frontend, eliminando las órdenes origen y generando la orden consolidada. Todo bajo AI_PROJECT_OPERATING_MANUAL.md.

ALCANCE DE IMPLEMENTACIÓN

1. EDICIÓN DEL NOMBRE DE LA LISTA:
   - Backend (`apps/api/`):
     * Exponer o habilitar `PATCH /api/v1/purchases/:id` (o `PUT /api/v1/purchases/:id`) que reciba `{ customName }` o `{ name }` y actualice el registro de la orden en la base de datos vía Prisma.
   - Frontend (`CartContext.jsx` y `purchases/page.jsx`):
     * Al pulsar el icono de lápiz (`Pencil`), abrir un modal estilizado (o input en línea) para ingresar el nuevo nombre personalizado.
     * Formato nominal final: `Lista de Compra - [customName] - [Fecha]`.
     * Al confirmar: enviar la petición `PATCH` a la API, actualizar el estado de `CartContext`, disparar `lastUpdated` para que el Carrito en el Header muestre el nuevo nombre de inmediato, y actualizar la tarjeta local.

2. FUSIÓN REAL DE ÓRDENES EN BACKEND:
   - Endpoint Backend: `POST /api/v1/purchases/merge`
     * Body esperado: `{ sourceOrderIds: string[], targetName?: string }`.
     * Lógica de Negocio (Prisma Transaction):
       a. Leer todas las órdenes activas en `sourceOrderIds` junto con sus ítems asociados.
       b. Agrupar los ítems aplicando el criterio canónico: clave única `insumoId + '_' + presentacionId + '_' + proveedorId`.
          - Si coinciden: sumar `cantidadSolicitada`.
          - Si difieren: mantenerlos como renglones separados en la orden resultante.
       c. Crear la nueva orden consolidada con el siguiente consecutivo (`ORD-2026-XXXX`) en estado `PENDIENTE`.
       d. Eliminar las órdenes origen especificadas en `sourceOrderIds` (o marcarlas como fusionadas/canceladas).
       e. Retornar la nueva orden creada y la lista de IDs eliminados.

3. CONEXIÓN EN FRONTEND (MÓDULO DE COMPRAS):
   - Archivo: `apps/web/src/app/operations/purchases/page.jsx`.
   - Flujo de Fusión:
     * Al seleccionar 2 o más checkboxes y presionar "Confirmar Fusión", invocar `POST /api/v1/purchases/merge`.
     * Al recibir respuesta exitosa:
       - Disparar `refreshCart()` / `lastUpdated` en `CartContext`.
       - Recargar la lista de órdenes activas (`fetchActiveOrders`).
       - Desactivar el modo de selección.
       - Emitir toast verde: "Listas fusionadas exitosamente en [Nuevo ORD]".

REGLAS DE ARQUITECTURA (STRICT)
1. Exclusivamente JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript.
2. Uso de iconos de `lucide-react` (Pencil, GitMerge, Check, X).
3. PROHIBIDO el uso de `window.alert` o `window.confirm`.
4. MODO RÁPIDO: PROHIBIDO `pnpm build`. Validar sintaxis con `node --check` en backend y frontend.

FORMATO DE REPORTE
Entregar reporte técnico detallando:
- Endpoint PATCH y POST implementados en Express/Prisma.
- Flujo de reactividad aplicado para el cambio de nombre.
- Comprobación de fusión en base de datos.