# 10 — CLIENTES

## 1. Propósito del módulo

El módulo **Clientes** administra la información de las personas, negocios o entidades a las que el negocio vende sus productos.

Su función es mantener una fuente única y organizada de información comercial para poder identificar a cada cliente, registrar sus datos de contacto, clasificarlo según su tipo o canal comercial y establecer las condiciones básicas relacionadas con el crédito.

La estructura original del sistema VBA contemplaba la tabla `tblClientes` con los campos:

```text
ID_Cliente
Nombre_Cliente
Tipo_Cliente
Canal
Contacto
Telefono
Direccion
Dias_Credito
Activo
Observaciones
```



---

# 2. Responsabilidad del módulo

El módulo `clients` es responsable de:

* Registrar clientes.
* Mantener la información básica de cada cliente.
* Asignar una identidad única.
* Registrar el nombre del cliente.
* Clasificar el tipo de cliente.
* Registrar el canal comercial asociado.
* Registrar la información de contacto.
* Registrar teléfono y dirección.
* Definir los días de crédito aplicables al cliente.
* Controlar si el cliente se encuentra activo o inactivo.
* Conservar observaciones relevantes.
* Permitir que el módulo de ventas identifique al cliente asociado a una venta.
* Permitir que el módulo de pagos relacione pagos con un cliente.

---

# 3. No responsabilidad del módulo

El módulo `clients` no es responsable de:

* Registrar ventas.
* Registrar el detalle de productos vendidos.
* Calcular el total de una venta.
* Registrar pagos.
* Calcular saldos de ventas.
* Calcular rentabilidad.
* Administrar inventario.
* Administrar lotes.
* Crear productos.
* Definir precios de productos.
* Registrar gastos.
* Decidir la disponibilidad de inventario.
* Gestionar la producción.

El cliente representa una entidad comercial del negocio.

Las operaciones realizadas con ese cliente pertenecen a otros módulos.

---

# 4. Posición del módulo dentro del negocio

El cliente forma parte del ciclo comercial.

```text
CLIENTES
    │
    │ identifica a quién se vende
    ▼
VENTAS
    │
    ├── contado
    │
    └── crédito
            │
            ▼
          PAGOS
```

La relación conceptual principal es:

```text
Client
   │
   │ puede tener
   ▼
Many Sales
   │
   └── pueden generar
           │
           ▼
        Payments
```

Un cliente puede tener:

```text
0 ventas
1 venta
muchas ventas
```

La existencia de un cliente no implica necesariamente que tenga operaciones registradas.

---

# 5. Concepto de cliente

Un cliente representa al destinatario comercial de una venta.

Puede tratarse, por ejemplo, de:

```text
Persona natural
```

```text
Tienda
```

```text
Restaurante
```

```text
Distribuidor
```

```text
Negocio
```

La clasificación exacta se definirá posteriormente dentro de los valores permitidos para `Tipo_Cliente`.

El módulo no debe asumir que todos los clientes son consumidores individuales.

---

# 6. Identidad del cliente

Cada cliente debe tener una identidad única dentro del sistema.

Conceptualmente:

```text
Client
├── id
└── clientCode
```

## `id`

Es el identificador técnico interno del sistema.

## `clientCode`

Es el código identificable del cliente dentro del negocio.

La estrategia definitiva de generación del código será definida durante la implementación.

Ejemplo conceptual:

```text
CLI-001
CLI-002
CLI-003
```

El código no debe depender del nombre del cliente.

---

# 7. Nombre del cliente

El nombre representa la identificación comercial o personal del cliente.

Conceptualmente:

```text
name
```

Ejemplos:

```text
Juan Pérez
```

```text
Tienda La Esperanza
```

```text
Restaurante El Buen Sabor
```

La estructura original utilizaba:

```text
Nombre_Cliente
```



El nombre debe ser obligatorio para crear un cliente.

La política exacta sobre nombres duplicados deberá definirse posteriormente.

No debe asumirse automáticamente que dos clientes con el mismo nombre son necesariamente el mismo cliente.

---

# 8. Tipo de cliente

El tipo de cliente permite clasificar su naturaleza comercial.

Conceptualmente:

```text
clientType
```

La estructura original utilizaba:

```text
Tipo_Cliente
```



Este campo permite distinguir categorías como:

```text
PERSON
```

```text
BUSINESS
```

```text
DISTRIBUTOR
```

Estos valores son conceptuales y no constituyen todavía una lista definitiva.

La lista oficial de tipos deberá definirse antes de implementar las validaciones.

---

# 9. Canal comercial

El cliente puede estar asociado a un canal comercial.

Conceptualmente:

```text
channel
```

La estructura original utilizaba:

```text
Canal
```



Este concepto permite identificar el contexto comercial en el cual opera el cliente.

Ejemplos conceptuales:

```text
DIRECT
```

```text
RETAIL
```

```text
DISTRIBUTION
```

```text
RESTAURANT
```

La definición final de los canales deberá realizarse junto con el módulo `sales`.

No se deben crear valores definitivos sin establecer previamente cómo serán utilizados en las operaciones de venta.

---

# 10. Persona de contacto

El campo de contacto permite registrar la persona con la que el negocio se comunica cuando el cliente es una organización o negocio.

Conceptualmente:

```text
contact
```

La estructura original utilizaba:

```text
Contacto
```



Ejemplo:

```text
Cliente:
Tienda La Esperanza

Contacto:
María Rodríguez
```

Este campo puede ser opcional dependiendo del tipo de cliente.

Para una persona natural, el contacto puede coincidir con el propio cliente o no ser necesario.

---

# 11. Teléfono

El cliente puede tener un número telefónico asociado.

Conceptualmente:

```text
phone
```

La estructura original utilizaba:

```text
Telefono
```



El teléfono permite facilitar:

* Comunicación comercial.
* Seguimiento de ventas.
* Cobros.
* Contacto posterior.

La validación exacta del formato telefónico deberá considerar el contexto del negocio y no asumir formatos internacionales rígidos sin necesidad.

---

# 12. Dirección

El cliente puede tener una dirección registrada.

Conceptualmente:

```text
address
```

La estructura original utilizaba:

```text
Direccion
```



La dirección puede utilizarse posteriormente para:

* Identificar ubicación comercial.
* Organizar entregas.
* Consultar información del cliente.
* Analizar clientes por zona.

El sistema no debe convertir inicialmente la dirección en un módulo geográfico complejo.

En la primera versión puede mantenerse como información descriptiva.

---

# 13. Días de crédito

El cliente puede tener una cantidad definida de días de crédito.

Conceptualmente:

```text
creditDays
```

La estructura original utilizaba:

```text
Dias_Credito
```



Este valor representa el plazo comercial que puede utilizarse para determinar una fecha límite de pago.

Ejemplo:

```text
Cliente:
Tienda La Esperanza

Días de crédito:
15
```

Si se registra una venta a crédito el:

```text
10/09/2026
```

la fecha límite conceptual sería:

```text
25/09/2026
```

La relación sería:

```text
Fecha de venta
        +
Días de crédito del cliente
        =
Fecha límite de pago
```

Sin embargo, existe una regla importante:

> Los días de crédito del cliente representan una configuración comercial. La condición aplicada a una venta debe quedar conservada históricamente dentro de la venta correspondiente.

Si posteriormente se cambia:

```text
creditDays = 15
```

a:

```text
creditDays = 30
```

las ventas históricas no deben modificar automáticamente su fecha límite de pago.

El módulo de ventas conserva su propia información histórica.

---

# 14. Estado del cliente

La estructura original utilizaba:

```text
Activo
```



En el nuevo sistema este concepto debe representar el estado operativo del cliente.

Conceptualmente:

```text
ACTIVE
```

El cliente puede utilizarse normalmente en nuevas operaciones.

```text
INACTIVE
```

El cliente permanece en el historial, pero no debe estar disponible para nuevas operaciones normales.

La desactivación no debe eliminar:

* Ventas históricas.
* Pagos.
* Saldos.
* Información relacionada.

Por tanto:

> Un cliente utilizado históricamente no debe eliminarse físicamente si existen operaciones asociadas.

La operación correcta será, en la mayoría de los casos:

```text
ACTIVE
        ↓
INACTIVE
```

en lugar de:

```text
DELETE
```

---

# 15. Observaciones

El módulo permite conservar información adicional relacionada con el cliente.

Conceptualmente:

```text
notes
```

La estructura original utilizaba:

```text
Observaciones
```



Este campo no debe utilizarse para almacenar información estructurada que posteriormente requiera consultas o cálculos específicos.

Por ejemplo, si en el futuro se necesita administrar:

```text
Múltiples teléfonos
```

no se debe resolver colocando todos los teléfonos dentro de observaciones.

La información que requiera estructura propia deberá evolucionar explícitamente.

---

# 16. Relación con ventas

El cliente es una referencia principal dentro de una venta.

La estructura original de `tblVentas` contemplaba:

```text
ID_Cliente
```



La relación conceptual es:

```text
CLIENT
   1
   │
   │ puede realizar
   ▼
MANY SALES
```

Ejemplo:

```text
Cliente CLI-001
    │
    ├── Venta VEN-001
    ├── Venta VEN-002
    └── Venta VEN-003
```

Una venta debe conservar la referencia al cliente utilizado en el momento de la operación.

---

# 17. Relación con pagos

La estructura original de `tblPagosClientes` contemplaba:

```text
ID_Cliente
ID_Venta
```



Esto permite conceptualmente:

```text
CLIENT
   │
   ├── SALE
   │
   └── PAYMENT
```

Un cliente puede tener múltiples pagos registrados a lo largo del tiempo.

El módulo `clients` no registra ni calcula los pagos.

Su función es proporcionar la identidad del cliente que será utilizada por el módulo `payments`.

---

# 18. Relación entre cliente, venta y crédito

El flujo conceptual es:

```text
CLIENT
    │
    │ configuración comercial
    │
    ├── creditDays
    │
    ▼
SALE
    │
    ├── fecha de venta
    ├── tipo de pago
    ├── fecha límite de pago
    ├── total
    ├── valor pagado
    └── saldo pendiente
            │
            ▼
         PAYMENTS
```

La estructura original de ventas ya contemplaba:

```text
Fecha_Venta
ID_Cliente
Canal_Venta
Tipo_Pago
Fecha_Limite_Pago
Total_Venta
Valor_Pagado
Saldo_Pendiente
Estado
Observaciones
```



Esto confirma que el cliente forma parte de una cadena comercial que continúa en ventas y pagos.

---

# 19. Información conceptual del cliente

El modelo conceptual inicial será:

```text
Client
│
├── id
├── clientCode
│
├── name
├── clientType
├── channel
│
├── contact
├── phone
├── address
│
├── creditDays
│
├── status
├── notes
│
├── createdAt
└── updatedAt
```

La correspondencia conceptual con la estructura VBA es:

| Sistema VBA      | Nuevo modelo conceptual |
| ---------------- | ----------------------- |
| `ID_Cliente`     | `id` / `clientCode`     |
| `Nombre_Cliente` | `name`                  |
| `Tipo_Cliente`   | `clientType`            |
| `Canal`          | `channel`               |
| `Contacto`       | `contact`               |
| `Telefono`       | `phone`                 |
| `Direccion`      | `address`               |
| `Dias_Credito`   | `creditDays`            |
| `Activo`         | `status`                |
| `Observaciones`  | `notes`                 |

Los campos:

```text
createdAt
updatedAt
```

corresponden a información técnica de auditoría del nuevo sistema.

---

# 20. Reglas de negocio iniciales

## Regla 1

Todo cliente debe tener una identidad única.

---

## Regla 2

Todo cliente debe tener un nombre.

```text
name ≠ vacío
```

---

## Regla 3

Todo cliente debe tener un tipo definido cuando la clasificación sea obligatoria para el flujo comercial.

---

## Regla 4

Los días de crédito no pueden ser negativos.

```text
creditDays >= 0
```

---

## Regla 5

Un cliente con:

```text
creditDays = 0
```

no tiene automáticamente una operación de crédito.

El tipo de pago de cada venta debe determinarse dentro del módulo `sales`.

---

## Regla 6

Los cambios posteriores en los días de crédito de un cliente no deben modificar automáticamente las ventas históricas.

---

## Regla 7

Un cliente inactivo no debe estar disponible para nuevas operaciones normales.

---

## Regla 8

Un cliente con operaciones históricas no debe eliminarse físicamente sin evaluar las relaciones existentes.

La preservación del historial tiene prioridad sobre la eliminación.

---

## Regla 9

El módulo de clientes no debe almacenar información financiera calculada como:

```text
Total comprado
Saldo total
Deuda histórica
Rentabilidad
```

Estos valores pertenecen a módulos operativos o analíticos y deben calcularse a partir de las operaciones correspondientes.

---

# 21. Casos que este módulo debe soportar

Inicialmente, el módulo debe permitir:

```text
1. Registrar un cliente.

2. Consultar un cliente.

3. Listar clientes.

4. Buscar clientes.

5. Actualizar información básica.

6. Actualizar condiciones de crédito.

7. Activar un cliente.

8. Desactivar un cliente.

9. Consultar los datos necesarios para registrar una venta.

10. Consultar los datos necesarios para registrar un pago.
```

---

# 22. Consultas futuras

El módulo puede evolucionar para soportar consultas como:

```text
Clientes activos.
```

```text
Clientes inactivos.
```

```text
Clientes por tipo.
```

```text
Clientes por canal.
```

```text
Clientes con ventas pendientes de pago.
```

```text
Historial comercial de un cliente.
```

```text
Ventas realizadas por cliente.
```

```text
Pagos registrados por cliente.
```

Estas consultas pueden requerir información proveniente de otros módulos.

El módulo `clients` no debe duplicar permanentemente esa información.

---

# 23. Dependencias del módulo

El módulo `clients` es principalmente un módulo maestro.

Su funcionamiento básico no depende de:

```text
inventory
```

```text
production
```

```text
lots
```

```text
recipes
```

Sin embargo, puede necesitar configuraciones generales del sistema para valores permitidos o convenciones.

---

# 24. Módulos que dependen de clientes

Los principales módulos que utilizan clientes son:

```text
sales
```

Para identificar al comprador de una venta.

```text
payments
```

Para relacionar pagos con un cliente y, cuando corresponda, con una venta.

```text
dashboard
```

Para indicadores comerciales.

```text
profitability
```

Para análisis posteriores cuando sea necesario.

---

# 25. Lo que no debe ocurrir

No se debe:

* Eliminar un cliente con operaciones históricas sin preservar las relaciones.
* Modificar retroactivamente las condiciones aplicadas a ventas anteriores.
* Usar el módulo de clientes para registrar ventas.
* Usar observaciones como sustituto de información estructurada.
* Almacenar saldos calculados permanentemente sin una necesidad arquitectónica definida.
* Permitir días de crédito negativos.
* Permitir nuevas operaciones normales con clientes inactivos.
* Duplicar dentro del cliente información que pertenece a ventas o pagos.

---

# 26. Relación con el modelo original de VBA

El sistema original definía:

```text
tblClientes
```

con la siguiente estructura:

```text
ID_Cliente
Nombre_Cliente
Tipo_Cliente
Canal
Contacto
Telefono
Direccion
Dias_Credito
Activo
Observaciones
```



El nuevo sistema conserva estos conceptos funcionales y evoluciona el modelo para incorporar:

```text
id
clientCode
status
createdAt
updatedAt
```

La migración conceptual no debe eliminar información funcional existente sin una decisión explícita.

---

# 27. Estado actual del módulo

Estado documental:

```text
DEFINIDO CONCEPTUALMENTE
```

El módulo tiene definidos:

* Su propósito.
* Sus responsabilidades.
* Sus límites.
* El concepto de cliente.
* Su identidad.
* Su clasificación.
* Su canal comercial.
* Su información de contacto.
* La lógica conceptual de días de crédito.
* El estado activo e inactivo.
* Su relación con ventas.
* Su relación con pagos.
* Sus reglas iniciales.
* La preservación histórica de condiciones comerciales.

Todavía no se ha definido:

* El esquema definitivo de PostgreSQL.
* La estrategia definitiva de generación de `clientCode`.
* La lista oficial de tipos de cliente.
* La lista oficial de canales comerciales.
* Las reglas exactas para clientes duplicados.
* Si un cliente podrá tener múltiples teléfonos.
* Si un cliente podrá tener múltiples direcciones.
* La estructura definitiva para entregas.
* La implementación backend.
* La implementación frontend.

---

# 28. Decisiones pendientes

Antes de implementar el módulo se deberán resolver explícitamente las siguientes decisiones.

## 28.1 Tipos oficiales de cliente

Definir los valores oficiales permitidos para:

```text
clientType
```

---

## 28.2 Canales comerciales

Definir los valores oficiales para:

```text
channel
```

y establecer claramente su relación con:

```text
sales.channel
```

---

## 28.3 Identificación adicional

Definir si el negocio necesita registrar información adicional de identificación, como documentos comerciales o tributarios.

Esta información no formaba parte de la estructura original de `tblClientes`, por lo que no debe añadirse automáticamente sin necesidad real.

---

## 28.4 Múltiples contactos

Definir si un cliente podrá tener:

```text
más de un teléfono
más de una persona de contacto
más de una dirección
```

Si esta necesidad aparece, no se debe resolver acumulando múltiples valores dentro de un solo campo.

Deberá evaluarse una evolución explícita del modelo.

---

## 28.5 Política de duplicados

Definir si el sistema permitirá múltiples clientes con el mismo nombre o si existirá una combinación de datos para detectar posibles duplicados.

---

## 28.6 Crédito máximo

El sistema original contempla:

```text
Dias_Credito
```

pero no define un límite monetario de crédito.

Por tanto, inicialmente:

> No se debe introducir una regla de `creditLimit` hasta que exista una necesidad de negocio explícita.

---

# 29. Resumen conceptual

El módulo `clients` administra la identidad y configuración comercial básica de quienes compran productos del negocio.

```text
CLIENT
│
├── Identidad
├── Nombre
├── Tipo
├── Canal
│
├── Contacto
├── Teléfono
├── Dirección
│
├── Días de crédito
├── Estado
└── Observaciones
        │
        ├──────────────► SALES
        │                    │
        │                    ▼
        └──────────────► PAYMENTS
```

La regla central del módulo es:

> **El cliente es la fuente de información comercial básica. Las operaciones realizadas con ese cliente —ventas, saldos y pagos— pertenecen a sus respectivos módulos y deben conservar su propio historial.**
