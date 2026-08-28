# 12-payments.md

## Módulo: Pagos de Clientes

### 1. Propósito del módulo

El módulo de Pagos registra los pagos realizados por los clientes y los relaciona con las ventas pendientes de pago.

Su objetivo es mantener el control de las cuentas por cobrar y permitir conocer, en todo momento:

* cuánto debe cada cliente;
* cuánto se ha pagado de una venta;
* cuál es el saldo pendiente;
* cuándo se realizó cada pago;
* mediante qué método se recibió;
* qué referencia tiene la transacción.

En el sistema original, esta información estaba representada por la tabla `tblPagosClientes`, compuesta por los campos `ID_Pago`, `Fecha_Pago`, `ID_Cliente`, `ID_Venta`, `Valor_Pagado`, `Metodo_Pago`, `Referencia` y `Observaciones`. 

---

## 2. Responsabilidad del módulo

El módulo de Pagos es responsable de:

* registrar pagos realizados por clientes;
* asociar cada pago con un cliente;
* asociar cada pago con una venta;
* registrar la fecha del pago;
* registrar el valor recibido;
* registrar el método de pago;
* registrar una referencia de pago cuando exista;
* conservar observaciones relacionadas con el pago;
* consultar los pagos registrados;
* consultar los pagos asociados a una venta;
* consultar los pagos realizados por un cliente;
* participar en la actualización del estado financiero de una venta;
* contribuir al cálculo del saldo pendiente de las ventas.

El módulo representa el registro histórico de los pagos realizados.

---

## 3. Lo que este módulo no es responsable de hacer

El módulo de Pagos no es responsable de:

* crear clientes;
* modificar la información maestra de clientes;
* crear ventas;
* modificar el detalle de una venta;
* determinar los productos vendidos;
* descontar inventario;
* administrar lotes;
* registrar gastos;
* calcular el costo de producción;
* definir la rentabilidad general del negocio;
* administrar proveedores;
* registrar compras;
* ejecutar procesos de producción.

Estas responsabilidades pertenecen a sus respectivos módulos.

---

# 4. Ubicación dentro del negocio

El flujo general relacionado con pagos es:

```text
CLIENTE
   │
   ▼
VENTA
   │
   ├── Pago inmediato
   │
   └── Pago pendiente
          │
          ▼
       PAGOS
          │
          ▼
   Actualización del valor pagado
          │
          ▼
   Actualización del saldo pendiente
          │
          ▼
   Actualización del estado de la venta
```

El módulo de Pagos depende conceptualmente de que exista una venta previamente registrada.

Por lo tanto:

```text
CLIENTES
    ↓
VENTAS
    ↓
PAGOS
```

Un pago no debe existir de manera aislada del contexto comercial que representa.

---

# 5. Entidad principal

La entidad principal del módulo es:

```text
PagoCliente
```

Representa un registro histórico de dinero recibido de un cliente como pago de una venta.

Un pago tiene identidad propia y no debe confundirse con la venta.

Una venta puede tener:

```text
0 pagos
1 pago
varios pagos
```

Por ejemplo:

```text
Venta: $100.000

Pago 1: $30.000
Pago 2: $40.000
Pago 3: $30.000
```

Los tres pagos pertenecen a la misma venta.

La venta conserva su identidad y cada pago conserva su propio registro histórico.

---

# 6. Relación con Clientes

Cada pago debe estar asociado a un cliente.

Relación:

```text
Cliente
   │
   └──────< Pagos
```

Un cliente puede realizar múltiples pagos.

Cada pago pertenece a un único cliente.

El campo heredado del sistema original es:

```text
ID_Cliente
```

Este campo permite mantener trazabilidad directa sobre quién realizó el pago.

---

# 7. Relación con Ventas

Cada pago debe estar asociado a una venta.

Relación:

```text
Venta
   │
   └──────< Pagos
```

Una venta puede recibir múltiples pagos.

Cada pago registrado debe identificar la venta a la que corresponde.

El campo heredado es:

```text
ID_Venta
```

Esta relación es fundamental porque permite calcular:

```text
Total de la venta
        -
Total pagado
        =
Saldo pendiente
```

---

# 8. Estructura histórica heredada

La estructura original de `tblPagosClientes` contiene los siguientes campos: 

| Campo           | Propósito                                               |
| --------------- | ------------------------------------------------------- |
| `ID_Pago`       | Identificador único del pago                            |
| `Fecha_Pago`    | Fecha en que se registró o recibió el pago              |
| `ID_Cliente`    | Cliente relacionado con el pago                         |
| `ID_Venta`      | Venta a la que se aplica el pago                        |
| `Valor_Pagado`  | Valor monetario recibido                                |
| `Metodo_Pago`   | Forma o método utilizado para realizar el pago          |
| `Referencia`    | Identificación externa de la transacción, cuando exista |
| `Observaciones` | Información adicional                                   |

Esta estructura constituye la base de migración conceptual desde el sistema VBA.

La implementación final en PostgreSQL podrá incorporar campos técnicos adicionales cuando sean necesarios, pero no debe eliminar la información funcional que representa esta estructura sin una decisión explícita.

---

# 9. Identificador del pago

Cada pago debe tener un identificador único:

```text
ID_Pago
```

El identificador es generado por el sistema.

El usuario no debe introducir manualmente el identificador.

El identificador permite:

* consultar un pago específico;
* mantener trazabilidad;
* relacionar el pago con otros registros futuros;
* identificar movimientos históricos;
* evitar depender de la posición física de un registro.

---

# 10. Fecha del pago

Cada pago debe registrar:

```text
Fecha_Pago
```

Esta fecha representa la fecha asociada al pago recibido.

La fecha del pago es necesaria para:

* historial de pagos;
* análisis de cuentas por cobrar;
* análisis por períodos;
* control financiero;
* seguimiento de pagos realizados por clientes.

El sistema debe conservar esta información incluso cuando el saldo de la venta llegue a cero.

---

# 11. Valor pagado

Cada pago debe registrar:

```text
Valor_Pagado
```

Este valor representa el dinero recibido en esa operación específica.

Debe cumplir:

```text
Valor_Pagado > 0
```

No se deben registrar pagos con:

```text
0
```

ni con valores negativos.

---

# 12. Método de pago

Cada pago debe indicar el método mediante el cual fue recibido.

Campo:

```text
Metodo_Pago
```

El sistema deberá definir posteriormente los métodos de pago permitidos.

Inicialmente el concepto debe permitir registrar valores como:

```text
Efectivo
Transferencia
Pago electrónico
Otro método autorizado
```

La lista definitiva no debe quedar dispersa en diferentes módulos.

Cuando se defina formalmente, deberá centralizarse mediante la configuración o catálogo correspondiente.

---

# 13. Referencia del pago

El campo:

```text
Referencia
```

permite almacenar un identificador externo relacionado con el pago.

Por ejemplo:

```text
Número de transferencia
Código de transacción
Referencia bancaria
Número de comprobante
```

No todos los métodos de pago requieren necesariamente una referencia.

Por ejemplo:

```text
Pago en efectivo
```

puede no tener referencia externa.

Por lo tanto, este campo puede ser opcional dependiendo del método utilizado.

---

# 14. Observaciones

El campo:

```text
Observaciones
```

permite registrar información adicional relacionada con el pago.

No debe utilizarse como sustituto de información estructurada que deba convertirse posteriormente en un campo o entidad propia.

---

# 15. Pagos parciales

El sistema debe permitir pagos parciales.

Ejemplo:

```text
Total de venta: $200.000

Pago 1: $50.000
Saldo: $150.000

Pago 2: $75.000
Saldo: $75.000

Pago 3: $75.000
Saldo: $0
```

Cada pago debe conservarse individualmente.

No se debe reemplazar el valor anterior.

Incorrecto:

```text
Valor pagado anterior = $50.000

Nuevo pago = $75.000

Se reemplaza:

Valor pagado = $125.000
```

Correcto:

```text
PAGO-001 → $50.000
PAGO-002 → $75.000
```

La venta puede calcular o mantener su valor acumulado pagado, pero el historial individual de pagos debe conservarse.

---

# 16. Relación con el saldo pendiente

En la estructura original de Ventas existen los campos:

```text
Total_Venta
Valor_Pagado
Saldo_Pendiente
Estado
```



El módulo de Pagos participa en la actualización de esta información.

Conceptualmente:

```text
Saldo_Pendiente =
Total_Venta
-
Total_Pagado
```

Donde:

```text
Total_Pagado =
SUM(Pagos.Valor_Pagado)
```

El saldo nunca debe ser negativo.

---

# 17. Regla de límite del pago

Un pago no debe superar el saldo pendiente de la venta.

Ejemplo:

```text
Total venta: $100.000
Total pagado: $70.000
Saldo pendiente: $30.000
```

No debe permitirse registrar:

```text
Nuevo pago: $50.000
```

porque produciría:

```text
Total pagado: $120.000
Saldo: -$20.000
```

El sistema debe validar el saldo disponible antes de confirmar el pago.

---

# 18. Estado financiero de la venta

El módulo de Pagos afecta conceptualmente el estado de la venta.

La venta puede encontrarse en situaciones como:

```text
PENDIENTE
PARCIALMENTE_PAGADA
PAGADA
```

La nomenclatura definitiva de los estados será definida en el contrato de estados del sistema.

La lógica conceptual es:

```text
Total pagado = 0
        ↓
PENDIENTE
```

```text
0 < Total pagado < Total venta
        ↓
PARCIALMENTE PAGADA
```

```text
Total pagado = Total venta
        ↓
PAGADA
```

El módulo de Pagos no define por sí solo toda la estructura de estados de Ventas, pero debe proporcionar la información necesaria para que la venta refleje su situación financiera real.

---

# 19. Tipos de pago según la venta

Una venta puede haberse registrado originalmente con un tipo de pago.

El sistema heredado contempla:

```text
Tipo_Pago
```

dentro de la venta. 

Este campo describe la condición comercial inicial de la venta.

Sin embargo, los registros individuales de pago pertenecen al módulo de Pagos.

Por ejemplo:

```text
VENTA

Tipo_Pago: Crédito
Total: $300.000
```

Posteriormente:

```text
PAGO-001 → $100.000
PAGO-002 → $100.000
PAGO-003 → $100.000
```

Por tanto:

```text
Tipo_Pago
```

y:

```text
PagoCliente
```

no representan exactamente lo mismo.

Uno describe la condición comercial de la venta.

El otro representa una transacción de pago concreta.

---

# 20. Relación con la fecha límite de pago

Las ventas pueden contener:

```text
Fecha_Limite_Pago
```



Esta fecha pertenece principalmente al contexto de la venta y de las cuentas por cobrar.

El módulo de Pagos utiliza esta información para permitir consultas como:

```text
Ventas vencidas
Pagos atrasados
Clientes con saldo pendiente
Cuentas por cobrar próximas a vencer
```

El pago individual registra:

```text
Fecha_Pago
```

La fecha límite pertenece a la obligación comercial.

La fecha de pago pertenece a la transacción realizada.

---

# 21. Trazabilidad

Los pagos deben conservarse como registros históricos.

El sistema debe permitir reconstruir:

```text
CLIENTE
   │
   ▼
VENTA
   │
   ├── PAGO 1
   │      ├── Fecha
   │      ├── Valor
   │      ├── Método
   │      └── Referencia
   │
   ├── PAGO 2
   │      ├── Fecha
   │      ├── Valor
   │      ├── Método
   │      └── Referencia
   │
   └── PAGO N
```

No se debe perder el historial de pagos simplemente porque una venta haya sido completamente pagada.

---

# 22. Eliminación y corrección de pagos

Este punto requiere una regla explícita para proteger la trazabilidad.

Un pago registrado no debe eliminarse físicamente de manera informal.

Si en el futuro es necesario corregir un pago registrado, deberá definirse un mecanismo controlado.

Inicialmente, el sistema deberá evitar:

```text
DELETE pago
```

sin validación ni trazabilidad.

La estrategia definitiva de reversión, anulación o corrección deberá documentarse antes de implementar operaciones destructivas.

Hasta que exista esa definición, no se debe asumir que un pago puede simplemente editarse o eliminarse sin consecuencias sobre:

* saldo de la venta;
* estado de la venta;
* cuentas por cobrar;
* reportes financieros;
* rentabilidad;
* trazabilidad histórica.

---

# 23. Reglas de negocio identificadas

El módulo debe respetar las siguientes reglas iniciales:

1. Un pago debe tener un identificador único.

2. Un pago debe estar asociado a un cliente válido.

3. Un pago debe estar asociado a una venta válida.

4. El cliente asociado al pago debe corresponder al cliente de la venta.

5. La fecha del pago es obligatoria.

6. El valor pagado debe ser mayor que cero.

7. El pago no puede superar el saldo pendiente de la venta.

8. Una venta puede recibir múltiples pagos.

9. Los pagos parciales están permitidos.

10. Cada pago debe conservarse como un registro individual.

11. El historial de pagos no debe reemplazarse por un único valor acumulado.

12. El registro de un pago debe actualizar la información financiera correspondiente de la venta.

13. El saldo pendiente no puede ser negativo.

14. Cuando el saldo pendiente llega a cero, la venta debe reflejar que ha sido pagada.

15. La eliminación o modificación de pagos requiere una política de trazabilidad definida.

---

# 24. Flujo básico de registro

El flujo conceptual es:

```text
1. Seleccionar cliente
        ↓
2. Consultar ventas con saldo pendiente
        ↓
3. Seleccionar venta
        ↓
4. Consultar saldo actual
        ↓
5. Ingresar valor del pago
        ↓
6. Validar que el valor sea válido
        ↓
7. Registrar método de pago
        ↓
8. Registrar referencia si corresponde
        ↓
9. Confirmar pago
        ↓
10. Guardar registro histórico
        ↓
11. Actualizar total pagado de la venta
        ↓
12. Actualizar saldo pendiente
        ↓
13. Actualizar estado financiero
```

---

# 25. Dependencias del módulo

El módulo de Pagos depende conceptualmente de:

```text
clients
sales
```

Relación:

```text
CLIENTS
    │
    ▼
SALES
    │
    ▼
PAYMENTS
```

El módulo puede proporcionar información posteriormente a:

```text
profitability
dashboard
```

y a cualquier módulo de análisis financiero.

---

# 26. Módulos relacionados

| Módulo        | Relación                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| Clients       | Identifica quién realiza el pago                                          |
| Sales         | Define la obligación y el saldo                                           |
| Payments      | Registra los pagos individuales                                           |
| Profitability | Puede utilizar información financiera consolidada                         |
| Dashboard     | Puede mostrar cuentas por cobrar y pagos                                  |
| Expenses      | Pertenece al flujo financiero general, pero no registra pagos de clientes |

---

# 27. Límites arquitectónicos

El módulo `payments` debe ser dueño de:

```text
Registro de pagos
Historial de pagos
Datos de cada transacción de pago
```

El módulo `sales` debe ser dueño de:

```text
Venta
Total de venta
Condición comercial
Estado comercial
```

La coordinación entre ambos debe respetar sus responsabilidades.

Conceptualmente:

```text
PAYMENT REGISTRADO
        │
        ▼
SALE RECALCULA
        │
        ├── Total pagado
        ├── Saldo pendiente
        └── Estado financiero
```

La implementación técnica de esta coordinación se definirá cuando se construyan los módulos, siguiendo las reglas de evolución arquitectónica del proyecto.

---

# 28. Modelo conceptual inicial

```text
┌─────────────────────┐
│       CLIENTE       │
├─────────────────────┤
│ ID_Cliente          │
│ Nombre              │
│ ...                 │
└──────────┬──────────┘
           │
           │ 1
           │
           ▼ N
┌─────────────────────┐
│        VENTA        │
├─────────────────────┤
│ ID_Venta            │
│ ID_Cliente          │
│ Total_Venta         │
│ Valor_Pagado        │
│ Saldo_Pendiente     │
│ Estado              │
└──────────┬──────────┘
           │
           │ 1
           │
           ▼ N
┌─────────────────────┐
│        PAGO         │
├─────────────────────┤
│ ID_Pago             │
│ Fecha_Pago          │
│ ID_Cliente          │
│ ID_Venta            │
│ Valor_Pagado        │
│ Metodo_Pago         │
│ Referencia          │
│ Observaciones       │
└─────────────────────┘
```

---

# 29. Evolución prevista

El módulo comienza conceptualmente con el registro y consulta de pagos.

Podrá evolucionar posteriormente para incorporar, cuando exista una necesidad real:

* anulación controlada de pagos;
* reversión de pagos;
* comprobantes de pago;
* conciliación de pagos;
* múltiples medios de pago;
* aplicación de un pago a múltiples ventas;
* pagos anticipados;
* saldo a favor del cliente;
* cuentas por cobrar;
* alertas de vencimiento;
* reportes de cartera;
* integración con medios de pago externos.

Estas capacidades no forman parte de la implementación inicial hasta que sean formalmente definidas.

---

# 30. Fuente histórica

La estructura funcional de este módulo proviene del sistema anterior basado en Excel y VBA, donde existía la tabla:

```text
tblPagosClientes
```

con los campos:

```text
ID_Pago
Fecha_Pago
ID_Cliente
ID_Venta
Valor_Pagado
Metodo_Pago
Referencia
Observaciones
```



En la navegación principal del sistema anterior, Pagos estaba definido como una operación independiente junto con Compras, Producción, Ventas y Gastos. 

Este documento reconstruye ese módulo como parte del nuevo sistema en JavaScript, manteniendo la intención funcional del sistema original y estableciendo sus límites de responsabilidad para la nueva arquitectura.
