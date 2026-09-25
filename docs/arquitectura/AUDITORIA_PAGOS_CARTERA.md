# Auditoría Estructural del Módulo de Pagos y Cartera

> **Documento:** Auditoría técnica estática de ciclo de recaudos, cartera y conciliación de ventas  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/api/src/payments/` y `apps/web/src/app/commercial/payments/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Contrato de Endpoints Backend (`POST /api/v1/payments`)

### 1.1 Esquema de Entrada (Zod: `createPaymentSchema.js`)
El endpoint `POST /api/v1/payments` valida estrictamente el payload antes de procesar:
```json
{
  "idVenta": "<UUID_VENTA>",
  "idCliente": "<UUID_CLIENTE>",
  "valorPagado": 15000,
  "fechaPago": "2026-09-25T00:00:00.000Z",
  "metodoPago": "EFECTIVO",
  "referencia": "TRANSF-001",
  "observaciones": "Abono inicial",
  "nuevaFechaLimite": null
}
```
* **Validaciones Poka-Yoke de Entrada:**
  - `idVenta`: `string.min(1)` (Requerido).
  - `idCliente`: `string.min(1)` (Requerido).
  - `valorPagado`: `number.positive('valorPagado debe ser mayor a 0')` (Rechaza `400 Bad Request` si es `<= 0` o NaN).
  - `metodoPago`: Opcional con valor por defecto `'EFECTIVO'`.
  - `.strict()`: Rechaza propiedades no reconocidas en el payload con `400 Bad Request`.

### 1.2 Transaccionalidad y Actualización de Cartera (`PaymentsRepository.create`)
Al registrar el recaudo dentro de `prisma.$transaction`:
1. **Verificación de Factura:** Busca la `Venta` correspondiente. Si no existe, lanza excepción de registro no encontrado.
2. **Creación de Pago:** Inserta en la tabla `Pago` con `valorPagado`, `metodoPago`, `fechaPago`, `referencia` y `observaciones`.
   - Si `pagoMonto > saldoActual`, anexa automáticamente la anotación: `[SALDO A FAVOR: $...]` en las observaciones.
3. **Cálculo Financiero Exacto con `Decimal`:**
   - `nuevoValorPagado = add(venta.valorPagado, pagoMonto)`
   - `nuevoSaldo = sub(venta.totalVenta, nuevoValorPagado)`
4. **Estado de la Venta:**
   - Si `nuevoSaldo <= 0`: `estado: 'COMPLETADA'` (Factura saldada al 100%).
   - Si `nuevoSaldo > 0`: `estado: 'PENDIENTE'` (Abono parcial con saldo remanente).

### 1.3 Consulta de Cuentas por Cobrar (`GET /api/v1/payments/receivables`)
- Consulta facturas donde `saldoPendiente > 0` y `estado != 'ANULADA'`.
- Admite filtros opcionales: `clienteId`, `montoMin`, `montoMax`.
- Retorna las ventas ordenadas por `fechaVenta: 'asc'` con el desglose de pagos previos.

---

## 2. Componentes y Selectores en Frontend (`/commercial/payments`)

### 2.1 Vista Principal (`PaymentsPage`)
- **KPIs de Cartera:** Cartera total, recaudos del mes, cartera vencida y clientes con mora.
- **Filtros:** Buscador por cliente, selector de estado y botón `Restablecer Filtros`.
- **Estado Vacío Asistido:** Renderiza `AssistedEmptyState` con título *"No hay cuentas pendientes por cobrar"* cuando no hay saldos pendientes.

### 2.2 Modal de Abono Parcial (`AbonoModal.jsx`)
- **Botón Disparador:**
  Botón en cada fila de la tabla `ReceivablesTable`:
  `button:has-text("Abonar"), button:has-text("+ Abono")`.
- **Campos del Formulario:**
  - Monto a abonar: `input[type="text"]` o `input[type="number"]` con máscara de moneda COP.
  - Método de pago: `select[name="metodoPago"]` (`EFECTIVO`, `TRANSFERENCIA`, `NEQUI`, etc.).
  - Referencia de pago: `input[name="referencia"]`.
  - Nueva fecha límite: `input[type="date"]`.
- **Botón de Confirmación:**
  `button:has-text("Registrar Abono"), button:has-text("Confirmar Abono")`.

### 2.3 Modal de Saldo Total (`SaldarModal.jsx`)
- **Botón Disparador:**
  Botón de acción rápida en la fila: `button:has-text("Saldar Total")`.
- **Poka-Yoke:** Bloquea el campo de monto para garantizar que el valor a pagar sea exactamente igual al `saldoPendiente`.
- **Botón de Confirmación:**
  `button:has-text("Confirmar Saldo"), button:has-text("Saldar Cuenta")`.

---

## 3. Casos Clave para Pruebas E2E y de Integración API

1. **PAY-API-01: Consulta de Cartera:**
   `GET /api/v1/payments/receivables` retorna listado de facturas con `saldoPendiente > 0`.
2. **PAY-API-02: Poka-Yoke de Monto Inválido:**
   `POST /api/v1/payments` con `valorPagado <= 0` retorna `400 Bad Request`.
3. **PAY-API-03: Abono Parcial:**
   `POST /api/v1/payments` con abono menor al total disminuye `saldoPendiente` y mantiene estado `'PENDIENTE'`.
4. **PAY-API-04: Liquidación Total:**
   `POST /api/v1/payments` por el saldo exacto deja `saldoPendiente = 0` y actualiza la venta a `'COMPLETADA'`.
5. **PAY-E2E-01: Interfaz de Cartera:**
   Apertura del modal de abono desde la tabla y validación del saldo deudor en pantalla.
