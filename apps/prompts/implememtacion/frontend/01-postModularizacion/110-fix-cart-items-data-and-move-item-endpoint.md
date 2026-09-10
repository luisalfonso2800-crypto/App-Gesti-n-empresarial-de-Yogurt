TAREA CONTROLADA — RESOLUCIÓN DE DATOS REALES EN CARRITO Y TRANSFERENCIA DE ÍTEMS ENTRE ÓRDENES (BACKEND & FRONTEND)

OBJETIVO TÉCNICO EXACTO
1. Corregir el renderizado de insumos en el acordeón del Carrito (`Header.jsx`) para que visualice los datos reales de la orden (nombre del insumo, proveedor, presentación, cantidad y precio) en lugar de placeholders literales ("Insumo", "Proveedor").
2. Erradicar el `window.alert()` del botón "Mover Lista" en el Checklist, desplegar un Modal de selección y crear el endpoint en backend (`POST /api/v1/purchases/items/move`) para transferir el ítem de una orden a otra respetando la integridad referencial. Todo bajo `AI_PROJECT_OPERATING_MANUAL.md`.

ALCANCE DE IMPLEMENTACIÓN

1. CORRECCIÓN DE DATOS EN EL CARRITO (`Header.jsx` / `CartContext.jsx`):
   - Problema: En la lista desplegada se observa repetidamente el texto literal "Insumo" y "Proveedor".
   - Causa: El componente accede a propiedades inexistentes tras la carga de la orden desde el backend.
   - Solución:
     * Inspeccionar la estructura retornada por Prisma para `OrdenCompraItem` / `PurchaseItem`.
     * Mapear de forma segura:
       - Título: `item.insumo?.nombre || item.nombre || 'Insumo sin nombre'`
       - Subtítulo/Proveedor: `item.proveedor?.razonSocial || item.proveedorNombre || item.presentacion?.nombre || ''`
       - Cantidad y Precio: Mostrar la cantidad solicitada/comprada y el valor unitario o subtotal formateado (`$`).
     * Asegurar que al vaciar la lista o eliminar un ítem puntual (`Trash2`), se invoque la mutación real hacia el backend y se actualicen los badges numéricos.

2. ENDPOINT DE TRANSFERENCIA EN BACKEND (`apps/api/`):
   - Implementar: `POST /api/v1/purchases/items/move`
   - Body esperado: `{ itemId: string, fromOrderId: string, toOrderId: string }`
   - Lógica de Negocio (Prisma $transaction):
     * Verificar que existan `fromOrderId` y `toOrderId` en estado `PENDIENTE`.
     * Buscar el ítem en la orden origen.
     * Si en `toOrderId` ya existe un ítem con la misma tupla `(insumoId, presentacionId, proveedorId)`:
       - Sumar la `cantidad` al ítem existente en la orden destino.
       - Eliminar el ítem de la orden origen.
     * Si no existe coincidencia:
       - Actualizar la referencia de la orden en el ítem (`purchaseId = toOrderId` u `ordenCompraId = toOrderId`).
     * Retornar respuesta exitosa con los datos actualizados.

3. MODAL Y FLUJO "MOVER LISTA" EN CHECKLIST (`ChecklistItemRow.jsx` / `new/page.jsx`):
   - Eliminar de raíz el llamado a `alert()` o `confirm()`.
   - Al pulsar "Mover Lista" (`ArrowRightLeft`):
     * Abrir un Modal estilizado con un `<select>` que liste todas las demás órdenes activas/pendientes del sistema (`ORD-2026-XXXX - [Nombre]`).
     * Si no hay otras órdenes activas, mostrar mensaje informativo con opción de "Crear nueva lista".
     * Al confirmar:
       - Enviar petición a `POST /api/v1/purchases/items/move`.
       - Remover de inmediato el ítem de la vista del checklist actual.
       - Disparar `refreshCart()` para que el Carrito refleje la transferencia en tiempo real.
       - Mostrar toast verde: "Ítem transferido exitosamente a [Nombre de la Orden]".

REGLAS DE ARQUITECTURA (STRICT)
1. Exclusivamente JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript.
2. Iconos exclusivos desde `lucide-react`.
3. PROHIBIDO el uso de `window.alert` o `window.confirm`.
4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build`. Comprobar con `node --check` en backend y frontend.

FORMATO DE REPORTE
Entregar reporte técnico resumiendo:
- Estructura de mapeo corregida en el Carrito.
- Endpoint transaccional implementado en Express/Prisma.
- Confirmación de eliminación del alert y funcionamiento del Modal.