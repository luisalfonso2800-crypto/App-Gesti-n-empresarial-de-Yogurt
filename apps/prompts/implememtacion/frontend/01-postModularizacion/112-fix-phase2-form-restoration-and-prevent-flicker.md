Actúa como desarrollador senior en Next.js/React. Necesitamos solucionar dos problemas críticos en apps/web/src/app/operations/purchases/new/:

1. BUG DE REDIRECCIÓN / REBOTE INMEDIATO AL CHECKLIST:
   - Al pulsar "+ Registrar Ítem en esta Lista" (hook proceedToForm), la pantalla cambia a la Fase 2 pero regresa al Checklist en milisegundos.
   - Causa: El uso de window.history.replaceState para inyectar ?orderId=... o el listener de query params en usePurchaseData re-ejecuta el useEffect de inicialización y resetea 'phase' al checklist.
   - Solución: Asegura que el cambio de URL o la presencia de 'orderId' no fuerce 'phase' hacia atrás si el usuario ya pasó a la fase de formulario. Controla la inicialización con un flag/ref o evita que la mutación del query param reinicie el estado 'phase'.

2. RESTAURACIÓN DEL FORMULARIO COMPLETO EN FormPhase.jsx:
   - Durante la modularización en el commit cb2d4df, la vista de compra quedó reducida a un esqueleto con solo "Cabecera de Compra" y un botón "Finalizar".
   - Tarea: Inspecciona el archivo histórico antes de esa modularización con:
     git show cb2d4df~1:apps/web/src/app/operations/purchases/new/page.jsx
   - Recupera el formulario funcional completo que existía: selector de proveedor con autocompletado/búsqueda, selector de insumo, cantidades, precios unitarios, subtotal/total, tabla de ítems agregados y modales de creación rápida.
   - Monta y conecta ese formulario completo dentro de FormPhase.jsx y PurchaseHeader.jsx, vinculando correctamente las props (proveedoresDB, insumosDB, supplierPrices, activeOrder, checklistMgr).

Entrega el código corregido sin romper la modularización actual y confirma que al hacer clic en "+ Registrar Ítem en esta Lista" permanezca en la Fase 2 con el formulario completo visible.