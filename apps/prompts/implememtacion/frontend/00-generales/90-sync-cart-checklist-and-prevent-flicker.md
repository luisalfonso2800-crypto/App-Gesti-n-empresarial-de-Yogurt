TAREA CONTROLADA — SINCRONIZACIÓN REACTIVA DEL CARRITO, REMOCIÓN AL ASENTAR Y PREVENCIÓN DE FLICKER

OBJETIVO TÉCNICO EXACTO
Corregir los flujos de navegación, renderizado inicial y consumo del carrito entre catálogo, navbar y compras:
1. Eliminar el parpadeo inicial (flicker): al entrar a `/operations/purchases/new`, resolver el estado inicial `step` de forma síncrona o mediante un estado `isLoading` para que nunca se renderice fugazmente el formulario manual si existen datos de orden de compra.
2. Sincronización bidireccional del Carrito:
   - Al marcar un insumo como "Conseguido" (compra exitosa) o "Descartar", eliminar ese ítem del almacenamiento global del carrito (`selectedForPurchase` / `purchase_cart` o la clave que use el navbar).
   - Disparar el evento de actualización de storage (`window.dispatchEvent(new Event('cartUpdated'))`) para que el badge de la canasta superior decremente automáticamente a tiempo real sin recargar la página.
3. Claridad en el botón "Nueva Compra" de `/operations/purchases`:
   - Si se accede desde "Preparar Orden" o "Continuar Orden de Compra", la vista `/operations/purchases/new` entra limpia y directamente al Checklist (Fase 1).
   - Si se hace clic en "+ Nueva Compra" en la tabla general de compras sin orden previa, debe cargar de inmediato el formulario manual sin consultar checklist residuales vacíos ni mostrar estados rotos.
4. REGLA ESTRICTA: PROHIBIDO ejecutar `pnpm build` o borrar `.next`. Validar únicamente con `node --check`.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/page.jsx
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/components/layout/header.jsx
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Consumo estricto de iconos desde `apps/web/src/components/ui/icons.jsx`.
4. Cero recargas completas (`window.location.reload()`). Reactividad pura.

ESPECIFICACIÓN PUNTUAL DE IMPLEMENTACIÓN

1. Eliminación del Flicker en `purchases/new/page.jsx`:
   - Declarar `isInitializing: true` al montar el componente.
   - En el `useEffect` de montaje:
     * Leer la clave del storage de insumos seleccionados.
     * Si contiene elementos (`items.length > 0`) y no se especificó `?manual=true`, fijar `step = 1`.
     * Si viene con query param `?manual=true` o el storage está vacío, fijar `step = 2`.
     * Finalmente, marcar `setIsInitializing(false)`.
   - Mientras `isInitializing` sea verdadero, renderizar un loader neutro o skeleton, impidiendo que el formulario manual parpadee en pantalla.

2. Remoción Automática del Carrito al Asentar o Descartar:
   - Identificar la clave utilizada por la canasta de compras en el navbar/storage.
   - Al procesar con éxito `handleConseguido(itemId)` o `handleDescartar(itemId)`:
     * Filtrar el ítem fuera de la lista en memoria: `updatedList = checklist.filter(i => i.id !== itemId)`.
     * Actualizar el storage con los ítems restantes.
     * Disparar: `window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedList }))`.
     * El componente del Header debe escuchar `cartUpdated` y refrescar inmediatamente el badge numérico sin recargar la página.

3. Limpieza Total al Concluir la Sesión:
   - Si el checklist queda con 0 ítems tras asentar o descartar todos, vaciar la clave del carrito en storage.
   - Mostrar el Toast de confirmación de sesión completada.

VALIDACIÓN LIGERA (SIN BUILD)
- Verificar sintaxis con `node --check apps/web/src/app/operations/purchases/new/page.jsx`.
- Verificar que al dar clic en "Conseguido" el contador del carrito en el navbar descuente en tiempo real.
- NO ejecutar `pnpm build`.

FORMATO DE REPORTE
Entregar únicamente el reporte estándar indicando erradicación del flicker, lógica de sincronización del storage con el navbar y confirmación sin build.