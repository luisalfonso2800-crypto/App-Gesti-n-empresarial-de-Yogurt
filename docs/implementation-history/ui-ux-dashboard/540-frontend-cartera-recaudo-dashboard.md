TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 5 ARCHIVOS EN FRONTEND - CERO BUCLES):
Construir el nuevo Centro de Cartera y Recaudos en `apps/web/src/app/commercial/payments/` consumiendo el endpoint `GET /payments/receivables` y el backend transaccional `POST /payments`, respetando la identidad visual MANNÀ y la regla SRP (< 130 líneas por componente).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/payments/page.jsx` (Refactor / Orquestador)
2. `apps/web/src/app/commercial/payments/components/ReceivablesKpis.jsx` (CREAR)
3. `apps/web/src/app/commercial/payments/components/ReceivablesFilters.jsx` (CREAR)
4. `apps/web/src/app/commercial/payments/components/ReceivablesTable.jsx` (CREAR)
5. `apps/web/src/app/commercial/payments/components/AbonoModal.jsx` (CREAR)
6. `apps/web/src/app/commercial/payments/components/SaldarModal.jsx` (CREAR)

INSTRUCCIONES TÉCNICAS:

1. `ReceivablesKpis.jsx` (< 100 líneas):
   - Renderizar 4 tarjetas métricas basadas en la respuesta del backend:
     * CARTERA PENDIENTE (`carteraTotal`)
     * RECAUDADO (`totalCobrado`)
     * CLIENTES DEUDORES (`clientesDeudores`)
     * CARTERA VENCIDA (`carteraVencida`)
   - Conservar la estética minimalista y limpia de las tarjetas de MANNÀ.

2. `ReceivablesFilters.jsx` (< 110 líneas):
   - Inputs para filtrar enviando query params al backend o en memoria según el contrato:
     * Búsqueda por cliente.
     * Botones/Tabs rápidos de estado: `[ Todos ]`, `[ Vencidos ]`, `[ Por Vencer ]`, `[ Con Abonos ]`.
     * Rango de saldo: `Monto Mínimo` y `Monto Máximo` (aplicado estrictamente al `saldoPendiente`).
     * Botón `Limpiar Filtros`.

3. `ReceivablesTable.jsx` (< 120 líneas):
   - Columnas: `Cliente`, `Venta (# ID)`, `Fecha Venta`, `Vencimiento (días)`, `Total Original`, `Total Abonado`, `Saldo Pendiente`, `Estado (Badge)`, `Acciones`.
   - Si `saldoPendiente === 0`, el estado es `SALDADO`. Si `fechaLimitePago < hoy`, marcar badge rojo `VENCIDO` con días de retraso.
   - En la columna Acciones:
     * Botón `[ Abonar ]` (Abre `AbonoModal`).
     * Botón `[ Saldar ]` (Abre `SaldarModal`).

4. `AbonoModal.jsx` y `SaldarModal.jsx` (< 120 líneas c/u):
   - Usar el Design System / modal corporativo del proyecto (prohibido `window.alert/confirm`).
   - `AbonoModal`:
     * Muestra Nombre de Cliente, Venta y Saldo Actual.
     * Input `Valor del Abono` (validación de tope: `<= saldoActual`).
     * Input `Nueva Fecha Límite` (opcional, para reprogramación de crédito).
     * Select `Método de Pago` (`EFECTIVO`, `TRANSFERENCIA`, etc.).
     * Input `Observación`.
     * Al confirmar: `POST /payments` { idVenta, idCliente, valorPagado, nuevaFechaLimite, metodoPago, observaciones }.
   - `SaldarModal`:
     * Muestra el saldo exacto pendiente a liquidar.
     * Select `Método de Pago`.
     * Al confirmar: envía automáticamente `valorPagado = saldoPendiente`. La venta pasa a saldo 0 y estado `COMPLETADO`.

5. `page.jsx` (< 120 líneas):
   - Orquestar los estados, hook de datos de `GET /payments/receivables`, recarga tras éxito de abono y renderizado de los componentes.

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/payments/page.jsx`
2. `pnpm run verify:srp`
3. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La vista de Pagos y Cobros se comporta como un centro integral de cartera y recaudo.
- Saldar una deuda actualiza la venta a saldo 0 sin eliminar su trazabilidad histórica.
- Abonos parciales con nueva fecha actualizan la deuda y la fecha límite en BD.
- Cero infracciones en el verificador SRP (< 130 líneas por archivo).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.