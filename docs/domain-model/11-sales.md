# 11 — MÓDULO DE VENTAS

**Archivo:** `11-sales.md`

````md
# Módulo: Ventas

## 1. Propósito

El módulo de Ventas es responsable de registrar y gestionar las operaciones mediante las cuales la empresa vende productos terminados a sus clientes.

Una venta representa una operación comercial completa y puede contener uno o varios productos.

El módulo debe conservar el historial de cada venta y permitir conocer:

- Cuándo se realizó.
- A qué cliente se realizó.
- Qué productos fueron vendidos.
- Qué cantidad de cada producto fue vendida.
- Desde qué lote provienen los productos.
- Cuál era el precio aplicado en el momento de la venta.
- Cuál fue el valor total de la operación.
- Cuánto dinero ha sido pagado.
- Cuánto dinero permanece pendiente.
- El estado actual de la venta.

Una venta registrada forma parte del historial comercial y financiero del negocio.

Por esta razón, la información histórica de una venta no debe depender de valores actuales que puedan cambiar posteriormente.

---

# 2. Responsabilidad del módulo

El módulo de Ventas es responsable de:

- Registrar ventas.
- Registrar los productos incluidos en una venta.
- Registrar la cantidad vendida de cada producto.
- Asociar productos vendidos con los lotes correspondientes.
- Descontar o solicitar el descuento del inventario vendido.
- Registrar el precio aplicado en el momento de la venta.
- Calcular los valores de cada línea de venta.
- Calcular el total de la venta.
- Mantener el estado de la venta.
- Relacionar la venta con un cliente cuando corresponda.
- Permitir ventas a clientes identificados.
- Permitir, si la operación del negocio lo requiere, ventas sin cliente registrado.
- Proporcionar la información necesaria para el módulo de Pagos.
- Mantener trazabilidad entre venta, producto, lote e inventario.

---

# 3. Qué no pertenece a este módulo

El módulo de Ventas no es responsable de:

- Crear clientes.
- Administrar pagos.
- Crear productos.
- Definir recetas.
- Producir productos.
- Crear lotes.
- Calcular el inventario general.
- Registrar gastos.
- Administrar proveedores.
- Registrar compras.
- Modificar la composición de un lote.
- Recalcular el precio histórico de una venta cuando cambie el precio actual del producto.

Estas responsabilidades pertenecen a otros módulos.

La relación entre módulos debe mantenerse explícita.

---

# 4. Conceptos principales

El módulo trabaja principalmente con los siguientes conceptos:

```text
Venta
Detalle de venta
Producto vendido
Lote
Cliente
Pago
````

La estructura conceptual es:

```text
CLIENTE
   │
   │ realiza
   ▼
VENTA
   │
   ├───────────────┐
   │               │
   ▼               ▼
DETALLE 1       DETALLE 2
   │               │
   ▼               ▼
PRODUCTO        PRODUCTO
   │               │
   ▼               ▼
LOTE            LOTE
```

Una venta puede contener uno o varios detalles.

Cada detalle representa una cantidad específica de un producto vendido.

---

# 5. Venta

Una venta representa la operación comercial principal.

La venta contiene la información general de la transacción.

Conceptualmente:

```text
Venta
│
├── Identificador
├── Fecha
├── Cliente
├── Estado
├── Total
├── Total pagado
├── Saldo pendiente
├── Observación
└── Detalles
```

La venta no debe almacenar únicamente un total.

El total debe estar respaldado por los detalles que componen la operación.

---

# 6. Identificador de la venta

Cada venta debe tener un identificador único e inmutable.

Conceptualmente:

```text
SALE-000001
SALE-000002
SALE-000003
```

El formato definitivo del identificador será definido posteriormente durante la implementación técnica.

La regla principal es:

> El identificador de una venta no cambia después de su creación.

---

# 7. Fecha de venta

Cada venta debe registrar la fecha en la cual se realizó la operación.

Conceptualmente:

```text
Fecha de venta
```

Esta fecha representa el momento comercial de la venta.

Debe mantenerse para:

* Historial.
* Reportes.
* Análisis de ventas.
* Control financiero.
* Trazabilidad.
* Rentabilidad.
* Auditoría.

La fecha registrada históricamente no debe cambiar automáticamente por cambios posteriores en el sistema.

---

# 8. Cliente

Una venta puede estar asociada a un cliente.

La relación conceptual es:

```text
Cliente
    │
    ▼
Venta
```

El cliente permite mantener historial comercial.

Por ejemplo:

```text
Cliente A
│
├── Venta 001
├── Venta 002
└── Venta 003
```

La venta debe conservar la referencia al cliente utilizado en el momento de la operación.

No obstante, una venta no debe depender de que los datos actuales del cliente permanezcan sin cambios.

Si posteriormente se requiere conservar información histórica adicional del cliente dentro de la venta, esta necesidad deberá evaluarse explícitamente.

---

# 9. Venta sin cliente registrado

El sistema debe permitir evaluar la posibilidad de registrar ventas directas o ventas de mostrador.

Conceptualmente:

```text
Venta
│
├── Cliente registrado
│
└── Cliente no identificado
```

Esto permite representar operaciones donde no existe una cuenta comercial asociada a una persona o entidad específica.

La decisión final sobre si todas las ventas requerirán obligatoriamente un cliente será definida como regla de negocio durante la implementación.

El módulo debe estar preparado conceptualmente para ambos escenarios.

---

# 10. Estado de la venta

Una venta debe tener un estado.

Inicialmente se contempla:

```text
BORRADOR
CONFIRMADA
CANCELADA
```

Conceptualmente:

```text
BORRADOR
    │
    ├── modificar
    │
    ├── eliminar detalles
    │
    └── confirmar
            │
            ▼
       CONFIRMADA
            │
            └── cancelar
                    │
                    ▼
                CANCELADA
```

Las reglas definitivas de transición entre estados deberán documentarse durante el desarrollo del módulo.

---

# 11. Venta en borrador

Una venta en estado:

```text
BORRADOR
```

representa una operación que todavía no ha sido confirmada.

Mientras la venta se encuentre en borrador, debe poder construirse o modificarse.

Por ejemplo:

* Agregar productos.
* Modificar cantidades.
* Eliminar productos.
* Cambiar cliente.
* Registrar observaciones.

Una venta en borrador no debe producir definitivamente efectos sobre:

* Inventario.
* Lotes.
* Pagos.
* Rentabilidad.

Los efectos operativos deben producirse cuando la venta sea confirmada.

---

# 12. Confirmación de una venta

Cuando una venta es confirmada:

```text
BORRADOR
    │
    ▼
CONFIRMADA
```

la operación pasa a formar parte del historial comercial.

La confirmación debe validar que la venta sea válida antes de producir efectos operativos.

Entre las validaciones esperadas se encuentran:

* La venta debe contener al menos un detalle.
* Cada detalle debe tener una cantidad válida.
* La cantidad debe ser mayor que cero.
* El producto debe existir.
* El lote seleccionado debe existir cuando la trazabilidad por lote sea requerida.
* Debe existir disponibilidad suficiente.
* La venta no puede confirmarse si ya fue cancelada.

Las reglas exactas podrán ampliarse posteriormente.

---

# 13. Cancelación de una venta

Una venta confirmada puede requerir cancelación.

Conceptualmente:

```text
CONFIRMADA
      │
      ▼
CANCELADA
```

La cancelación no debe eliminar el historial de la operación.

Debe conservarse evidencia de que la venta existió y posteriormente fue cancelada.

Cuando una venta confirmada haya producido movimientos de inventario, la cancelación deberá evaluar y registrar el efecto inverso correspondiente.

La lógica concreta de reversión deberá conservar trazabilidad y no modificar silenciosamente movimientos históricos.

---

# 14. Detalle de venta

Una venta puede contener múltiples detalles.

Ejemplo:

```text
VENTA
│
├── Yogurt Natural 8 oz
│   Cantidad: 10
│
├── Yogurt Fresa 8 oz
│   Cantidad: 5
│
└── Yogurt Mango 16 oz
    Cantidad: 3
```

Cada línea representa una operación específica dentro de la venta.

Conceptualmente:

```text
DetalleVenta
│
├── Identificador
├── Venta
├── Producto
├── Lote
├── Cantidad
├── Precio unitario
├── Subtotal
└── Observación
```

---

# 15. Relación entre Venta y Detalle de Venta

La relación es:

```text
VENTA
   │
   │ 1
   │
   └───────────────┐
                   │
                   │ N
                   ▼
            DETALLE DE VENTA
```

Una venta tiene uno o varios detalles.

Un detalle pertenece únicamente a una venta.

---

# 16. Producto vendido

Cada detalle debe identificar el producto que fue vendido.

Conceptualmente:

```text
DetalleVenta
      │
      ▼
Producto
```

El producto permite identificar qué artículo fue comercializado.

La venta debe conservar la información histórica necesaria para evitar que cambios futuros en el producto modifiquen silenciosamente el significado de una venta pasada.

Por ejemplo, un cambio futuro en:

* Nombre.
* Precio.
* Presentación.

no debe alterar automáticamente la interpretación histórica de una venta realizada anteriormente.

---

# 17. Lote del producto vendido

Debido a que el sistema controla producción y lotes, la venta debe mantener trazabilidad hacia el lote del cual proviene el producto vendido.

Conceptualmente:

```text
PRODUCTO
   │
   ▼
LOTE
   │
   ▼
DETALLE DE VENTA
```

Esto permite responder preguntas como:

```text
¿De qué lote provino este producto vendido?
```

o:

```text
¿A qué clientes se vendieron productos del lote LOT-000123?
```

La trazabilidad debe permitir relacionar:

```text
Producción
    ↓
Lote
    ↓
Inventario
    ↓
Venta
```

---

# 18. Cantidad vendida

Cada detalle debe registrar la cantidad vendida.

Conceptualmente:

```text
Cantidad vendida
```

La cantidad debe cumplir:

```text
Cantidad > 0
```

Una cantidad vendida no puede ser negativa ni igual a cero.

La unidad debe ser coherente con la unidad mediante la cual se controla el producto terminado.

---

# 19. Precio unitario histórico

Cada detalle de venta debe almacenar el precio unitario aplicado en el momento de la venta.

Ejemplo:

```text
Producto:

Yogurt Natural 8 oz

Precio actual:
$4.000
```

Una venta histórica:

```text
Precio aplicado:
$3.500
```

El detalle debe conservar:

```text
$3.500
```

aunque posteriormente el precio actual del producto cambie.

La regla es:

> El precio aplicado a una venta es información histórica.

Nunca debe recalcularse automáticamente utilizando el precio actual del producto.

---

# 20. Subtotal del detalle

Cada detalle debe representar su valor económico.

Conceptualmente:

```text
Subtotal = Cantidad × Precio unitario
```

Ejemplo:

```text
Cantidad:
10

Precio unitario:
$3.500

Subtotal:
$35.000
```

El subtotal debe corresponder a los valores históricos almacenados en el detalle.

---

# 21. Total de la venta

El total de la venta representa la suma de todos sus detalles.

Conceptualmente:

```text
Total venta
=
Σ Subtotal de cada detalle
```

Ejemplo:

```text
Detalle 1:
$35.000

Detalle 2:
$20.000

Detalle 3:
$12.000

----------------

Total:
$67.000
```

El total debe poder ser validado contra los detalles que componen la venta.

---

# 22. Precio y venta

El precio utilizado para realizar una venta pertenece al contexto histórico de esa operación.

Por esta razón:

```text
Precio actual del producto
≠
Precio histórico de una venta
```

El sistema puede tener posteriormente mecanismos para definir precios actuales o listas de precios.

Sin embargo, una vez confirmada una venta:

```text
Precio aplicado
```

debe permanecer asociado a esa operación histórica.

---

# 23. Inventario y venta

Una venta confirmada afecta la disponibilidad del producto terminado.

La relación conceptual es:

```text
VENTA CONFIRMADA
        │
        ▼
DETALLE DE VENTA
        │
        ▼
MOVIMIENTO DE INVENTARIO
        │
        ▼
DISMINUCIÓN DE DISPONIBILIDAD
```

El módulo de Ventas no debe modificar arbitrariamente un valor de stock.

El efecto sobre inventario debe conservar trazabilidad.

Conceptualmente:

```text
No:

Stock = Stock - Cantidad
```

sin historial.

La operación debe poder rastrearse mediante un movimiento relacionado con la venta.

---

# 24. Movimiento generado por una venta

Cuando una venta confirmada disminuye la disponibilidad de productos, debe existir una relación identificable con la operación que produjo dicho movimiento.

Conceptualmente:

```text
Venta SALE-000001
        │
        ▼
Movimiento de Inventario
        │
        ├── Tipo: SALIDA
        ├── Motivo: VENTA
        ├── Cantidad: 10
        └── Referencia: SALE-000001
```

Esto permite mantener trazabilidad entre:

```text
Inventario
        ↕
Venta
```

---

# 25. Regla de disponibilidad

Una venta no debe permitir confirmar cantidades que no estén disponibles según las reglas de inventario aplicables.

Conceptualmente:

```text
Disponible:
10 unidades

Venta:
12 unidades

Resultado:
No permitir confirmación.
```

La validación debe realizarse antes de confirmar la operación.

Las reglas exactas relacionadas con reservas, disponibilidad y concurrencia se definirán durante la implementación.

---

# 26. Venta y lote

Cuando la trazabilidad por lote sea obligatoria, la cantidad vendida debe poder asociarse con el lote correspondiente.

Ejemplo:

```text
Yogurt Natural 8 oz

Lote A:
20 unidades

Lote B:
30 unidades
```

Una venta puede requerir identificar:

```text
5 unidades
→ Lote A
```

y:

```text
10 unidades
→ Lote B
```

Por esta razón, una venta no debe perder la capacidad de representar el origen por lote de los productos vendidos.

La estructura física definitiva deberá garantizar esta trazabilidad.

---

# 27. Vencimiento y venta

Los lotes tienen una fecha de vencimiento.

Por lo tanto, el módulo de Ventas debe respetar las reglas relacionadas con lotes vencidos.

Conceptualmente:

```text
Fecha actual
        │
        ▼
¿Lote vencido?
        │
    ┌───┴────┐
    │        │
   NO       SÍ
    │        │
    ▼        ▼
Permitir   No permitir
venta      venta
```

Un lote vencido no debe utilizarse para confirmar una venta.

---

# 28. Pagos

Una venta y un pago son conceptos diferentes.

La relación conceptual es:

```text
VENTA
   │
   │ puede tener
   ▼
PAGOS
```

Una venta puede:

* No tener pagos todavía.
* Tener un pago completo.
* Tener varios pagos parciales.

Por ejemplo:

```text
Venta:
$100.000

Pago 1:
$40.000

Pago 2:
$30.000

Pago 3:
$30.000
```

El módulo de Ventas debe proporcionar la información necesaria para relacionar una venta con sus pagos.

El registro detallado de los pagos pertenece al módulo:

```text
Payments
```

---

# 29. Total pagado

El total pagado representa la suma de los pagos válidos asociados a una venta.

Conceptualmente:

```text
Total pagado
=
Σ Pagos registrados
```

Este valor permite conocer cuánto dinero ha sido recibido respecto al total de la operación.

---

# 30. Saldo pendiente

El saldo pendiente representa el valor que todavía no ha sido pagado.

Conceptualmente:

```text
Saldo pendiente
=
Total venta
-
Total pagado
```

Ejemplo:

```text
Total venta:
$100.000

Total pagado:
$60.000

Saldo pendiente:
$40.000
```

---

# 31. Estado financiero de la venta

Aunque la venta tiene un estado operativo:

```text
BORRADOR
CONFIRMADA
CANCELADA
```

también puede tener una situación financiera.

Conceptualmente:

```text
PENDIENTE
PARCIAL
PAGADA
```

Ejemplo:

```text
Total:
$100.000

Pagado:
$0

Estado financiero:
PENDIENTE
```

```text
Total:
$100.000

Pagado:
$40.000

Estado financiero:
PARCIAL
```

```text
Total:
$100.000

Pagado:
$100.000

Estado financiero:
PAGADA
```

La implementación deberá evitar mezclar el estado operativo de la venta con su situación de pago.

---

# 32. Cancelación y pagos

La cancelación de una venta que posee pagos requiere una regla explícita.

No debe eliminarse automáticamente la información financiera.

Debe existir trazabilidad sobre:

```text
Venta
→ Pago
→ Cancelación
```

El comportamiento exacto dependerá de las reglas de negocio que se definan para devoluciones, reversos o saldos a favor.

Esta lógica deberá documentarse antes de implementarse.

---

# 33. Observaciones

Una venta puede contener una observación general.

Ejemplos:

```text
Entrega programada para mañana.
```

```text
Venta realizada mediante pedido telefónico.
```

La observación no debe utilizarse para reemplazar datos estructurados que deban existir como campos específicos.

---

# 34. Historial de una venta

Una venta confirmada debe conservar información histórica.

La operación debe poder consultarse posteriormente incluso si cambian datos actuales del sistema.

La información histórica relevante incluye:

```text
Venta
├── Fecha
├── Cliente utilizado
├── Productos vendidos
├── Lotes utilizados
├── Cantidades
├── Precios aplicados
├── Subtotales
├── Total
├── Estado
├── Pagos asociados
└── Saldo pendiente
```

---

# 35. Trazabilidad completa

El módulo debe permitir reconstruir el recorrido del producto.

Conceptualmente:

```text
INSUMOS
   │
   ▼
PRODUCCIÓN
   │
   ▼
LOTE
   │
   ▼
INVENTARIO
   │
   ▼
VENTA
   │
   ▼
CLIENTE
```

Esto permite investigar posteriormente:

```text
¿Qué productos fueron vendidos?
```

```text
¿De qué lote provenían?
```

```text
¿A qué cliente fueron vendidos?
```

```text
¿Cuándo fueron vendidos?
```

---

# 36. Relación con otros módulos

## Clients

```text
Clients
    ↓
Sales
```

Proporciona el cliente asociado a una venta.

El módulo de Ventas no administra clientes.

---

## Products

```text
Products
    ↓
Sales
```

Proporciona los productos que pueden venderse.

El módulo de Ventas no crea productos.

---

## Lots

```text
Lots
    ↓
Sales
```

Proporciona trazabilidad sobre el origen del producto vendido.

---

## Inventory

```text
Sales
    ↓
Inventory
```

Una venta confirmada genera o solicita el registro del efecto correspondiente sobre inventario.

---

## Payments

```text
Sales
    ↔
Payments
```

Los pagos se relacionan con ventas.

Cada módulo conserva su responsabilidad específica.

---

## Costs

```text
Lots / Production
        ↓
      Costs
        ↓
      Sales
```

El módulo de Ventas proporciona información necesaria para análisis posteriores.

La lógica completa de costos y rentabilidad no pertenece directamente al registro básico de la venta.

---

# 37. Datos conceptuales de la venta

Inicialmente, una venta requiere representar:

```text
Venta
├── id
├── saleNumber
├── saleDate
├── clientId
├── status
├── totalAmount
├── paidAmount
├── pendingAmount
├── notes
├── createdAt
└── updatedAt
```

Estos nombres son conceptuales.

No representan todavía el esquema definitivo de PostgreSQL.

---

# 38. Datos conceptuales del detalle de venta

Cada detalle requiere representar:

```text
SaleDetail
├── id
├── saleId
├── productId
├── lotId
├── quantity
├── unitPrice
├── subtotal
├── notes
├── createdAt
└── updatedAt
```

La estructura definitiva podrá evolucionar si la trazabilidad requiere separar una misma línea comercial entre varios lotes.

---

# 39. Posible evolución de la estructura de lotes en ventas

Existe una situación que debe quedar prevista.

Una línea comercial puede representar:

```text
Producto:
Yogurt Natural 8 oz

Cantidad:
15
```

pero esas 15 unidades podrían provenir de:

```text
Lote A:
10 unidades

Lote B:
5 unidades
```

Si esta situación forma parte de la operación real del negocio, un único:

```text
lotId
```

en el detalle podría resultar insuficiente.

En ese caso, la arquitectura podrá evolucionar hacia una estructura como:

```text
SaleDetail
│
└── SaleDetailLot
    ├── saleDetailId
    ├── lotId
    └── quantity
```

No se implementará esta estructura anticipadamente si el negocio no la necesita.

Pero la posibilidad queda documentada para evitar perder trazabilidad cuando sea requerida.

---

# 40. Reglas de negocio iniciales

Las reglas iniciales identificadas son:

### RN-SAL-001 — Una venta debe tener al menos un detalle para ser confirmada

```text
Detalles >= 1
```

---

### RN-SAL-002 — La cantidad vendida debe ser mayor que cero

```text
Cantidad > 0
```

---

### RN-SAL-003 — El precio aplicado debe ser válido

El precio utilizado en una venta no puede ser negativo.

---

### RN-SAL-004 — El precio de venta debe conservarse históricamente

Una modificación posterior del precio actual del producto no modifica ventas anteriores.

---

### RN-SAL-005 — Una venta confirmada debe tener disponibilidad suficiente

No se puede confirmar una venta por una cantidad superior a la disponible según las reglas de inventario.

---

### RN-SAL-006 — Una venta confirmada debe afectar el inventario mediante trazabilidad

No debe existir una disminución silenciosa del stock.

---

### RN-SAL-007 — Un lote vencido no puede utilizarse para confirmar una venta

La validación debe considerar la fecha de vencimiento del lote.

---

### RN-SAL-008 — Una venta cancelada debe conservar historial

Cancelar no significa eliminar silenciosamente la operación.

---

### RN-SAL-009 — El estado operativo y el estado financiero son conceptos diferentes

Por ejemplo:

```text
CONFIRMADA
+
PARCIAL
```

pueden existir simultáneamente.

---

### RN-SAL-010 — El saldo pendiente no puede ser negativo

Conceptualmente:

```text
Saldo pendiente >= 0
```

Las reglas sobre pagos superiores al total deberán definirse en el módulo Payments.

---

### RN-SAL-011 — Los pagos no pertenecen al detalle de venta

Los pagos pertenecen a la venta como operación comercial.

---

### RN-SAL-012 — Una venta debe mantener trazabilidad hacia el producto vendido

El historial debe permitir identificar qué producto fue vendido.

---

### RN-SAL-013 — Cuando aplique trazabilidad por lote, debe poder identificarse el origen del producto vendido

La arquitectura debe conservar la relación entre venta y lote.

---

# 41. Dependencias conceptuales

El módulo depende conceptualmente de:

```text
Clients
Products
Inventory
Lots
```

Y proporciona información para:

```text
Payments
Costs
Profitability
Dashboard
```

El flujo conceptual es:

```text
Clients
    │
Products
    │
Lots
    │
Inventory
    │
    ▼
  SALES
    │
    ├──────────► Payments
    │
    ├──────────► Costs
    │
    ├──────────► Profitability
    │
    └──────────► Dashboard
```

---

# 42. Límites del módulo

Sales controla:

```text
La operación comercial.
```

Sales no controla directamente:

```text
La producción.
La composición de los productos.
La creación de lotes.
La administración de clientes.
El registro detallado de pagos.
El cálculo completo de costos.
El cálculo completo de rentabilidad.
```

---

# 43. Evolución prevista

Inicialmente, el módulo puede comenzar con:

```text
Registrar venta
Listar ventas
Consultar venta
Confirmar venta
Cancelar venta
```

Posteriormente podría evolucionar para incluir:

```text
Descuentos
Promociones
Listas de precios
Facturación
Devoluciones
Notas crédito
Pedidos
Entregas
Reservas de inventario
Canales de venta
Múltiples formas de pago
```

Estas funcionalidades no deben implementarse anticipadamente.

Cada una requerirá definición explícita de reglas de negocio antes de incorporarse.

---

# 44. Estado actual del diseño

Este documento define el modelo conceptual inicial del módulo Sales.

Actualmente:

```text
Estado:
DOCUMENTACIÓN DEL DOMINIO
```

Todavía no existe:

```text
Modelo definitivo de base de datos.
API.
Controladores.
Servicios.
Repositorios.
Interfaces.
Componentes de frontend.
```

La implementación deberá respetar las responsabilidades y reglas documentadas aquí.

Cualquier cambio significativo en el comportamiento del módulo deberá actualizar este documento antes o junto con la implementación correspondiente.

```
```
