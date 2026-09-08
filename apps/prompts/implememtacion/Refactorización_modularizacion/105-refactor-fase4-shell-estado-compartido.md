TAREA CONTROLADA — FASE 4: CENTRALIZACIÓN DE SHELL Y ESTADO COMPARTIDO (CART & NOTIFICATIONS)

OBJETIVO TÉCNICO EXACTO
Eliminar la sincronización dispersa y manual de `sessionStorage` y Custom Events (`window.dispatchEvent`) identificada en el Plan Maestro.
Centralizar el estado transversal del carrito y notificaciones en Custom Hooks/Context globales consumidos de forma unificada por el Layout (`Header.jsx`) y las vistas operativas (`supplier-prices` y `purchases/new`).

ESTRUCTURA DE ARCHIVOS A GENERAR/ACTUALIZAR
Ubicación: `apps/web/src/`

1. Capa de Contexto y Estado Global (`src/context/` o `src/lib/`):
   - `src/context/CartContext.jsx`:
     * Estado reactivo único para el carrito temporal de compras.
     * Métodos expuestos: `cartItems`, `addToCart(item)`, `removeFromCart(id)`, `clearCart()`, `cartCount`, `cartTotal`.
     * Manejo interno y encapsulado de la persistencia (`sessionStorage`) sin exponer lecturas/escrituras crudas a los componentes.
   - `src/context/NotificationContext.jsx` (o unificación de Toasts si aplica):
     * Despacho estandarizado de alertas UI (`success`, `error`, `info`, `warning`).

2. Integración en Shell:
   - `src/components/shell/Header.jsx`:
     * Consumir `useCart()` para renderizar reactivamente el contador de insumos/compras pendientes en la barra superior.
     * Eliminar listeners manuales de `window.addEventListener('storage', ...)`.

3. Reconexión en Módulos Consumidores:
   - `src/app/catalog/supplier-prices/hooks/useCartManager.js`:
     * Conectar con `useCart()` global en lugar de manipular `sessionStorage` manualmente.
   - `src/app/operations/purchases/new/hooks/usePurchaseData.js`:
     * Leer los ítems del carrito centralizado para la orden inicial de compra.

REGLAS DE ARQUITECTURA Y EJECUCIÓN (STRICT)
1. Exclusivamente JavaScript nativo puro (.jsx, .js). PROHIBIDO TypeScript.
2. Usar SIEMPRE alias canónicos `@/*` para imports (`@/context/...`, `@/components/...`, `@/lib/...`). Prohibidas rutas relativas profundas (`../../../../`).
3. Preservar intactos los CSS Modules existentes.
4. Encabezado JSDoc obligatorio en cada archivo creado o modificado con: `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.
5. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build` o purgar `.next`. Validar sintaxis con `node --check`.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `node --check` sobre los contextos y archivos modificados.
- Comprobar que al agregar un ítem al carrito en `/catalog/supplier-prices`, el contador en el `Header` se actualice de inmediato sin recargar la página.

FORMATO DE REPORTE
Entregar reporte técnico resumiendo:
- Archivos creados/modificados.
- Eliminación de accesos directos redundantes a Storage.
- Estado de la validación sintáctica limpia.