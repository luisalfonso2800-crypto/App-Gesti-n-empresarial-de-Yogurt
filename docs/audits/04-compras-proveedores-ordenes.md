# Auditoría Técnica Forense: Módulo 4 - Abastecimiento y Compras

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Proveedores` (`Proveedor`): Directorio de proveedores con NIT/Cédula y condiciones de contacto.
  - `Compras` (`Compra`): Registro contable de compras consolidadas (soporta mono y multi-proveedor).
  - `Detalle_Compras` (`DetalleCompra`): Renglones de insumos adquiridos con discriminación tributaria de IVA.
  - `Ordenes_Compra` (`OrdenCompra`): Órdenes de requisición y compras planificadas o sugeridas por faltantes.
  - `Orden_Compra_Items` (`OrdenCompraItem`): Líneas de ítems asociados a la orden con precios estimados.
- **Campos clave y llaves foráneas:**
  - `Proveedores.nitCedula` y `Proveedores.nombre`: Ambas poseen restricción `@unique`.
  - `Compra.idProveedor` -> `Proveedor.id` (FK opcional, admite compras mixtas donde cada renglón tiene proveedor específico).
  - `Compra.idOrden` -> `OrdenCompra.id` (Vínculo de trazabilidad orden -> factura de compra).
  - `DetalleCompra.idCompra` -> `Compra.id`.
  - `DetalleCompra.idInsumo` -> `Insumo.id`.
  - `DetalleCompra.idProveedor` -> `Proveedor.id` (Opcional, trazabilidad por renglón).
  - `OrdenCompraItem`: Enlaza `idOrden`, y de forma opcional `idInsumo`, `idProveedor`, `idPresentacion`.
- **Índices y Restricciones:**
  - `OrdenCompra.codigo`: `@unique` (ej. `OC-2026-0001`).
  - Restricciones `@unique` en `Proveedor`: `nombre` y `nitCedula`.
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Totales e impuestos: `total`, `totalSinIva`, `totalIva`, `precioUnitario`, `subtotal`, `montoIva`, `subtotalSinIva`, `precioEstimado` se encuentran parametrizados en `@db.Decimal(12, 2)`.
  - Porcentaje de IVA: `porcentajeIva` tipado como `@db.Decimal(5, 2)`.
  - Cantidades: `cantidad` tipado en `Decimal`.

---

## 2. Matriz de Endpoints

### 2.1 Proveedores (`/suppliers`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/suppliers` | Body: `CreateSupplierDto` | `201 Created` | `400 Bad Request`, `409 Conflict` (P2002 NIT/Nombre) |
| `GET` | `/suppliers` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/suppliers/active` | Ninguno (`activo: true`) | `200 OK` | `500 Internal Error` |
| `GET` | `/suppliers/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `PATCH` | `/suppliers/:id` | Param: `id`, Body: `UpdateSupplierDto` | `200 OK` | `400 / 404 / 409` |
| `DELETE` | `/suppliers/:id` | Param: `id` | `200 OK` | `400 / 404` |

### 2.2 Compras y Órdenes (`/purchases`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/purchases/simulate` | Body: Parámetros de simulación de costos | `200 OK` | `400 Bad Request` |
| `GET` | `/purchases` | Ninguno (histórico de facturas de compra) | `200 OK` | `500 Internal Error` |
| `GET` | `/purchases/orders/active`| Ninguno (órdenes en estado PENDIENTE / EN_PROCESO) | `200 OK` | `500 Internal Error` |
| `POST` | `/purchases/items/move` | Body: `{ itemId, fromOrderId, toOrderId }` | `200 OK` | `400 Bad Request` |
| `POST` | `/purchases/orders/merge`| Body: `{ sourceOrderIds: string[], targetName? }` | `200 OK` | `400 Bad Request` |
| `POST` | `/purchases/orders` | Body: `CreateOrderDto` (`nombre`, `items: []`) | `201 Created` | `400 Bad Request` |
| `GET` | `/purchases/orders/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `POST` | `/purchases/orders/:id/items` | Param: `id`, Body: ítem a anexar | `201 Created` | `400 Bad Request` |
| `PATCH` | `/purchases/orders/:id` | Param: `id`, Body: `{ nombre?, estado? }` | `200 OK` | `400 / 404` |
| `PATCH` | `/purchases/orders/:id/items/:itemId` | Param: `id`, `itemId`, Body: estado/cantidad | `200 OK` | `400 / 404` |
| `DELETE` | `/purchases/orders/:id` | Param: `id` | `200 OK` | `400 / 404` |
| `POST` | `/purchases` | Body: Registro de compra (`createWithTransaction`) | `201 Created` | `400 Bad Request` |
| `GET` | `/purchases/:id` | Param: `id` | `200 OK` | `404 Not Found` |

---

## 3. Validaciones y DTOs
- **Validación Estricta de Orden de Compra:**
  - `PurchasesController` valida que toda orden entrante contenga obligatoriamente la propiedad `nombre`.
  - En fusiones (`orders/merge`), valida que existan como mínimo dos órdenes seleccionadas (`sourceOrderIds.length >= 2`).
  - En transferencias de ítems (`items/move`), requiere la presencia simultánea de `itemId`, `fromOrderId` y `toOrderId`.
- **Discriminación de IVA:**
  - El sistema calcula y valida en backend:
    - Si `precioIncluyeIva: true`: Desglosa la base gravable dividiendo por `(1 + tarifa)` y determina el `montoIva`.
    - Si `precioIncluyeIva: false`: Aplica la tarifa directa sobre el subtotal.
  - El payload valida que los montos declarados coincidan con la sumatoria de sus detalles.

---

## 4. Lógica de Negocio y Transaccionalidad
- **Transacción Atómica Completa de Compra (`createWithTransaction`):**
  - Todo registro de compra ejecuta una transacción global en Prisma:
    1. **Alta Dinámica de Proveedor:** Si se suministra la bandera `esNuevoProveedor`, crea el proveedor al vuelo en la misma transacción y reutiliza su `id`.
    2. **Generación de Consecutivo:** Formula un código correlativo `CMP-YYYY-XXXX`.
    3. **Impacto en Inventario de Insumos:**
       - Para cada insumo en `detalles`, consulta el inventario actual.
       - Incrementa la existencia física (`cantidadActual = cantidadActual + cantidadComprada`).
       - Recalcula el **Costo Promedio Ponderado**:
         $$\text{Nuevo Costo} = \frac{(\text{Stock Actual} \times \text{Costo Actual}) + (\text{Cantidad Comprada} \times \text{Precio Unitario})}{\text{Stock Actual} + \text{Cantidad Comprada}}$$
       - Asienta el movimiento en `Movimientos_Inventario` con `tipoMovimiento: ENTRADA_COMPRA`.
    4. **Actualización del Catálogo de Precios:**
       - Actualiza o inserta el valor de compra en `Precios_Proveedores`, actualizando la fecha de última adquisición (`fechaUltimaCompra`).
    5. **Transición de Estado de Orden:** Si la compra provino de una orden de compra, conmuta el estado de la orden a `COMPLETADA`.

---

## 5. Manejo de Errores
- Errores de clave duplicada en NIT/Cédula (`P2002`) son traducidos por el filtro global a mensajes amigables para el usuario.
- En caso de fallo durante el cálculo o actualización de inventario en `createWithTransaction`, toda la transacción revierte automáticamente evitando compras huérfanas o stock desfasado.

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Riesgo de Condición de Carrera en el Consecutivo de Compra:**
   - La generación del código `CMP-YYYY-XXXX` utiliza `await prisma.compra.count()`. Dos compras concurrentes podrían obtener el mismo count y generar el mismo identificador o colisionar en caso de agregarse un índice único.
2. **Orden de Declaración de Rutas en Controller:**
   - Aunque las rutas estáticas (`orders/active`, `items/move`) se encuentran ubicadas antes de `orders/:id`, la ruta `/purchases/:id` está declarada al final. Cualquier ruta estática adicional agregada posteriormente debajo de `/purchases/:id` será interceptada erróneamente como parámetro.
3. **Persistencia de Precios Proveedor sin Historial:**
   - La actualización de precios sobrescribe o desactiva registros anteriores de forma simplificada, lo que puede limitar la auditoría histórica de variaciones de precios a lo largo de varios años fiscales.
