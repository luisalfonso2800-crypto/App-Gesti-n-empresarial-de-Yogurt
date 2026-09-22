# Auditoría Técnica Forense: Módulo 5 - Ventas, Clientes y Cartera

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Clientes` (`Cliente`): Directorio de clientes con clasificación (MAYORISTA/MINORISTA), canal y días de crédito.
  - `Ventas` (`Venta`): Facturas y remisiones de venta comercial con liquidación de saldos y plazos de cartera.
  - `Detalle_Ventas` (`DetalleVenta`): Renglones de venta asociados a productos y lotes, con cálculo de márgenes y utilidad unitaria/total.
  - `Pagos` (`Pago`): Recibos de caja y abonos a cartera vinculados a clientes y facturas.
- **Campos clave y llaves foráneas:**
  - `Venta.idCliente` -> `Cliente.id` (FK directa N:1).
  - `DetalleVenta.idVenta` -> `Venta.id`.
  - `DetalleVenta.idProducto` -> `Producto.id`.
  - `DetalleVenta.idLote` -> `Lote.id` (FK opcional para trazabilidad por lote despachado).
  - `Pago.idCliente` -> `Cliente.id`.
  - `Pago.idVenta` -> `Venta.id`.
- **Índices y Restricciones:**
  - La tabla `Clientes` no tiene restricción `@unique` en `nombre` o documento en el esquema Prisma (se apoya en comprobaciones lógicas).
  - Las llaves foráneas estándar de Prisma indexan las relaciones padre-hijo.
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Días de crédito: `diasCredito` es `Int`.
  - Parámetros tributarios y descuentos: `tarifaIva` es `@db.Decimal(5, 2)`.
  - Valores monetarios: `subtotal`, `descuentoTotal`, `baseImponible`, `ivaTotal`, `totalVenta`, `valorPagado`, `saldoPendiente`, `precioUnitario`, `descuento`, `baseGravable`, `montoIva`, `totalLinea`, `costoUnitario`, `utilidadUnitaria`, `utilidadTotal` están tipados como `@db.Decimal(12, 2)`.
  - Cantidades: `cantidad` tipada en `Decimal`.

---

## 2. Matriz de Endpoints

### 2.1 Clientes (`/clients`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/clients` | Body: `CreateClientDto` (`nombre`, `tipoCliente`, `canal`, `diasCredito`, etc.) | `201 Created` | `400 Bad Request` |
| `GET` | `/clients` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/clients/:id` | Param: `id` | `200 OK` | `404 Not Found` |

### 2.2 Ventas (`/sales`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/sales` | Body: `CreateSaleDto` (cliente, canal, tipoPago, detalles con producto/lote/precio) | `201 Created` | `400 Bad Request` |
| `GET` | `/sales` | Ninguno (historial de ventas con costos y márgenes calculados) | `200 OK` | `500 Internal Error` |
| `GET` | `/sales/:id` | Param: `id` | `200 OK` | `404 Not Found` |

### 2.3 Pagos y Cartera (`/payments`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/payments` | Body: `CreatePaymentDto` (`idCliente`, `idVenta`, `valorPagado`, `metodoPago`, `referencia`) | `201 Created` | `400 Bad Request` |
| `GET` | `/payments` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/payments/receivables` | Query: Opcional filtros de antigüedad de cartera | `200 OK` | `500 Internal Error` |
| `GET` | `/payments/:id` | Param: `id` | `200 OK` | `404 Not Found` |

---

## 3. Validaciones y DTOs
- **Validación de Límites de Cartera:**
  - En `payments.repository.js`, el servicio intercepta y valida que el abono recibido no supere el `saldoPendiente` de la venta (`pagoMonto <= saldoActual`). Si se excede, rechaza la operación inmediatamente.
- **Validación de Canal y Descuentos:**
  - El sistema comprueba si el cliente califica para tarifa mayorista (`tipoCliente === 'MAYORISTA'`) o si la cantidad supera `cantidadMinimaMayorista`.
- **Asignación de Lotes en Venta:**
  - Si la venta especifica `idLote`, se valida que el lote pertenezca al producto vendido y cuente con `cantidadDisponible >= cantidadSolicitada`.

---

## 4. Lógica de Negocio y Transaccionalidad
- **Transaccionalidad en Abonos (`PaymentsRepository.create`):**
  - Utiliza `this.prisma.$transaction(async (tx) => { ... })`:
    1. Verifica la existencia y estado de la factura de venta.
    2. Valida coherencia matemática del abono vs saldo insoluto.
    3. Registra la entidad `Pago`.
    4. Actualiza `Venta.valorPagado` y `Venta.saldoPendiente`.
    5. Actualiza automáticamente el estado de la venta: conmuta a `COMPLETADO` si `nuevoSaldo === 0`, o mantiene `PENDIENTE` en caso de saldo remanente.
- **Salida de Producto Terminado y Kardex en Ventas:**
  - La creación de la venta descuenta las unidades de `Inventario_Productos` o de `Lote.cantidadDisponible` y genera el respectivo `MovimientoInventario` con `tipoMovimiento: SALIDA_VENTA`.
  - Se congelan los costos de venta y utilidades (`utilidadUnitaria = precioUnitario - costoUnitario`) garantizando snapshots inmutables para reportes contables.

---

## 5. Manejo de Errores
- Errores de saldos excedidos o ventas inexistentes arrojan `Error(...)` que son propagados o normalizados a través del `GlobalExceptionFilter`.
- Ausencia de rutas destructivas (`DELETE` directo deshabilitado en `/sales` y `/payments` para proteger la inmutabilidad fiscal del libro diario).

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Falta de Métodos de Actualización/Baja en Clientes:**
   - `ClientsController` solo implementa `POST /clients`, `GET /clients` y `GET /clients/:id`. No expone endpoints `PATCH` o `DELETE` (desactivación lógica) para editar datos de contacto o estado activo de clientes.
2. **Cálculo de Descuento de Lotes Sin Bloqueo Concurrente:**
   - Si dos órdenes de venta se procesan en el mismo instante para las últimas existencias de un lote en cava, existe la posibilidad de sobreventa si no se maneja un bloqueo pesimista o verificación atómica en el `updateMany` con condición `cantidadDisponible: { gte: cantidad }`.
3. **Paginación Ausente en Ventas y Pagos:**
   - `findAll()` en ventas y pagos recupera la totalidad de los registros con sus detalles y relaciones anidadas, lo que causará degradación de memoria a medida que crezca el volumen de transacciones.
