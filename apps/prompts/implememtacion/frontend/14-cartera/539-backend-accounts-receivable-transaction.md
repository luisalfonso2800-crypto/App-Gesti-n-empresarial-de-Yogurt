TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 ARCHIVOS - CERO BUCLES DE LECTURA):
Implementar la consistencia transaccional en el módulo de pagos y crear el endpoint consolidado de cartera en la API según los hallazgos de la auditoría 538.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/payments/payments.repository.js` (o service)
2. `apps/api/src/sales/sales.repository.js` (o service)
3. `apps/api/src/payments/payments.controller.js` (o nuevo controller de cartera)

INSTRUCCIONES TÉCNICAS:

1. Transaccionalidad en Pagos (`payments.repository.js`):
   - Al registrar un pago (`create`):
     * Envolver la operación en `this.prisma.$transaction(async (tx) => { ... })`.
     * Consultar la venta (`tx.venta.findUnique({ where: { id: data.idVenta } })`).
     * Validar que el monto pagado no exceda el `saldoPendiente` de la venta.
     * Crear el registro en `tx.pago.create({ data: ... })`.
     * Calcular `nuevoValorPagado = Number(venta.valorPagado) + Number(data.valorPagado)` y `nuevoSaldo = Math.max(0, Number(venta.totalVenta) - nuevoValorPagado)`.
     * Actualizar la venta atómicamente:
       `saldoPendiente: nuevoSaldo`,
       `valorPagado: nuevoValorPagado`,
       `estado: nuevoSaldo === 0 ? 'COMPLETADO' : 'PENDIENTE'`.
       Si el payload incluye `nuevaFechaLimite`, actualizar también `fechaLimitePago: new Date(data.nuevaFechaLimite)`.
     * Retornar el pago enriquecido.

2. Registro de Abono Inicial en Ventas (`sales.repository.js`):
   - Al crear una venta a crédito con abono inicial (`valorPagado > 0`):
     * Dentro del `createWithTransaction`, insertar simultáneamente el primer abono en la tabla `tx.pago.create` con `metodoPago: 'EFECTIVO'` (o el seleccionado) y referencia `'Abono Inicial Venta'`.

3. Endpoint Consolidado de Cartera (`GET /commercial/receivables` o `GET /payments/receivables`):
   - Consultar ventas con `saldoPendiente > 0` y estado distinto de `'ANULADA'`.
   - Calcular métricas de resumen (KPIs):
     * `carteraTotal`: Suma de todos los saldos pendientes.
     * `totalCobrado`: Suma histórica de pagos del período.
     * `clientesDeudores`: Conteo de clientes únicos con saldo pendiente > 0.
     * `carteraVencida`: Suma de saldos pendientes donde `fechaLimitePago < now()`.
     * `carteraPorVencer`: Suma de saldos pendientes con fecha futura.
   - Soportar query params de filtrado:
     * `clienteId`, `estado` ('VENCIDO', 'POR_VENCER', 'CON_ABONOS', 'TODOS'), `montoMin`, `montoMax`.
   - Retornar el listado estructurado por venta con días de vencimiento calculados en servidor.

VERIFICACIÓN:
1. `node --check apps/api/src/payments/payments.repository.js`
2. `node --check apps/api/src/sales/sales.repository.js`
3. `pnpm --filter api build`

CRITERIO DE FINALIZACIÓN:
- Compilación limpia con código de salida 0.
- Todo abono nuevo descuenta inmediatamente el saldo de la venta en la base de datos.
- Endpoint de cartera disponible y tipado.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.