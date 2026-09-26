# 04 — HISTORY AND TRACEABILITY

## 1. Propósito del documento

Este documento define las reglas de **historial, conservación de información y trazabilidad** del sistema de gestión empresarial de yogurt.

Su objetivo es garantizar que el sistema pueda responder, cuando la información exista en los registros, preguntas como:

* ¿Cuándo se creó o registró un dato?
* ¿Qué compra originó una entrada de inventario?
* ¿Qué insumos fueron utilizados en una producción?
* ¿Qué producción originó un lote?
* ¿Cuándo fue creado un lote?
* ¿Cuál es su fecha de vencimiento?
* ¿Cuánto producto se produjo originalmente?
* ¿Cuánto producto queda disponible?
* ¿Qué ventas descontaron unidades de un lote?
* ¿Qué pagos están asociados a una venta?
* ¿Qué gastos fueron registrados en un período?
* ¿Qué costo tenía un producto o una producción en el momento correspondiente?

La trazabilidad no consiste únicamente en almacenar fechas. Consiste en conservar las relaciones necesarias para reconstruir el recorrido de una operación dentro del sistema.

---

# 2. Principio general

La información histórica debe conservarse cuando representa un hecho de negocio ocurrido.

Un hecho registrado no debe desaparecer simplemente porque su estado actual cambió.

Ejemplos:

```text
Una compra registrada
no debe perder su historial
porque posteriormente cambió el precio de un insumo.

Una producción ejecutada
no debe perder la información de los insumos utilizados.

Un lote creado
debe conservar su origen, fecha de creación y fecha de vencimiento.

Una venta registrada
debe conservar su relación con los productos o lotes vendidos.

Un pago registrado
debe conservar su relación con la venta correspondiente.
```

La regla general será:

> **Los cambios posteriores en los datos maestros no deben alterar la interpretación histórica de una operación ya registrada.**

---

# 3. Tipos de información dentro del sistema

Para efectos de historial y trazabilidad, la información se divide en cuatro categorías.

## 3.1 Datos maestros

Son datos que definen elementos reutilizables del negocio.

Ejemplos:

* Presentaciones.
* Insumos.
* Proveedores.
* Productos.
* Clientes.
* Recetas.

Estos datos pueden cambiar con el tiempo.

Sin embargo, un cambio posterior no debe eliminar la posibilidad de identificar los registros históricos que dependieron de ellos.

---

## 3.2 Datos transaccionales

Representan hechos ocurridos dentro del negocio.

Ejemplos:

* Compras.
* Movimientos de inventario.
* Producciones.
* Lotes.
* Ventas.
* Pagos.
* Gastos.

Estos registros forman parte de la historia operativa del sistema.

---

## 3.3 Datos derivados

Son resultados obtenidos a partir de otros datos.

Ejemplos:

* Inventario disponible.
* Costos calculados.
* Rentabilidad.
* Saldos pendientes.
* Cantidades disponibles por lote.

Estos valores pueden recalcularse dependiendo de la responsabilidad definida para cada cálculo.

No todos los valores derivados deben tratarse como registros históricos independientes.

---

## 3.4 Datos históricos de operación

Son datos que deben conservarse porque describen una operación tal como ocurrió.

Ejemplo conceptual:

```text
Compra registrada
    ↓
Proveedor utilizado
    ↓
Insumos comprados
    ↓
Cantidad
    ↓
Precio registrado
    ↓
Fecha
```

Aunque posteriormente cambie el precio actual del insumo, la compra debe conservar el precio con el que fue registrada.

---

# 4. Principio de inmutabilidad histórica

Una vez que una operación representa un hecho confirmado del negocio, su información histórica no debe modificarse de forma que altere la realidad registrada.

Esto no significa que ningún registro pueda corregirse.

Significa que las correcciones deben respetar la trazabilidad.

La regla conceptual será:

```text
Registro operativo
        ↓
Mientras no esté confirmado
        ↓
Puede modificarse

Registro confirmado
        ↓
Representa un hecho histórico
        ↓
No debe alterarse arbitrariamente
```

Cuando una operación confirmada requiera una corrección, el mecanismo dependerá del proceso correspondiente.

No se debe asumir que todos los módulos utilizarán el mismo mecanismo de corrección.

---

# 5. Trazabilidad de compras

Una compra representa la adquisición de uno o varios insumos.

La trazabilidad debe permitir reconstruir:

```text
COMPRA
│
├── Identificador de compra
├── Fecha de compra
├── Proveedor
├── Detalles de compra
│
└── Cada detalle:
    ├── Insumo
    ├── Cantidad
    ├── Precio registrado
    └── Información necesaria para calcular el movimiento correspondiente
```

La relación principal es:

```text
Compra
    ↓
Detalle de compra
    ↓
Insumo
```

La compra también debe poder relacionarse con el impacto que produzca sobre el inventario.

---

# 6. Trazabilidad de inventario

El inventario no debe entenderse únicamente como un número actual.

Debe poder explicarse cómo se llegó a una existencia determinada.

La estructura conceptual es:

```text
OPERACIÓN DE NEGOCIO
        ↓
MOVIMIENTO DE INVENTARIO
        ↓
AFECTACIÓN DE EXISTENCIA
```

Las operaciones que pueden originar movimientos incluyen:

```text
Compra
    ↓
Entrada de insumos

Producción
    ↓
Salida de insumos

Producción
    ↓
Entrada de producto terminado / creación de lote

Venta
    ↓
Salida de producto terminado
```

Por tanto, un movimiento de inventario debe conservar su relación con la operación que lo originó cuando esa relación exista.

El objetivo es poder responder:

```text
¿Por qué entró esta cantidad?

¿Por qué salió esta cantidad?

¿Qué operación originó el movimiento?

¿Cuándo ocurrió?
```

---

# 7. Trazabilidad de producción

Una producción debe permitir reconstruir el proceso realizado.

Conceptualmente:

```text
PRODUCCIÓN
│
├── Identificador
├── Fecha
├── Producto elaborado
├── Información del proceso
│
├── Detalle de producción
│   ├── Insumos utilizados
│   └── Cantidades utilizadas
│
└── Resultado
    └── Lote o lotes generados
```

La trazabilidad mínima debe permitir seguir:

```text
Insumo
    ↓
Movimiento de salida
    ↓
Producción
    ↓
Resultado producido
    ↓
Lote
```

Una producción no debe quedar desconectada de los insumos utilizados cuando el sistema haya registrado dicha información.

---

# 8. Trazabilidad de lotes

El lote es una pieza central de la trazabilidad del producto terminado.

Cada lote debe conservar, como mínimo:

```text
Identificador del lote

Producto asociado

Producción de origen

Fecha de creación del lote

Fecha de vencimiento

Cantidad inicial producida

Cantidad disponible o información suficiente
para determinar su disponibilidad
```

La fecha de creación y la fecha de vencimiento son datos históricos del lote.

No deben calcularse nuevamente utilizando reglas futuras.

Ejemplo:

```text
Lote creado:
10 de agosto

Vencimiento establecido:
20 de agosto
```

Si posteriormente cambia la política de duración del producto, el lote ya creado conserva su fecha de vencimiento original.

La relación de trazabilidad es:

```text
Producción
    ↓
Lote
    ↓
Fecha de creación
    ↓
Fecha de vencimiento
    ↓
Disponibilidad
    ↓
Ventas
```

---

# 9. Fecha de creación del lote

La fecha de creación del lote representa el momento en que el lote queda registrado como resultado del proceso correspondiente.

Esta fecha debe conservarse como dato histórico.

No debe sustituirse automáticamente por:

* Fecha actual.
* Fecha de modificación.
* Fecha de venta.
* Fecha de vencimiento.

Son conceptos diferentes.

```text
Fecha de producción
        ≠
Fecha de creación del lote

Fecha de creación del lote
        ≠
Fecha de vencimiento
```

Cuando, según el proceso implementado, la producción y la creación del lote ocurran como parte de la misma operación, ambas fechas pueden coincidir.

Pero conceptualmente representan datos distintos.

---

# 10. Fecha de vencimiento

La fecha de vencimiento debe quedar registrada directamente en el lote correspondiente.

Su función es preservar la trazabilidad del producto terminado y permitir posteriormente controles como:

* Identificación de lotes vencidos.
* Control de productos próximos a vencer.
* Validación de disponibilidad.
* Análisis de pérdidas o desperdicios.
* Consulta histórica.

La fecha de vencimiento debe pertenecer al lote.

No debe depender únicamente de la configuración actual del producto.

La razón es:

```text
Configuración actual del producto
puede cambiar
        ↓
pero
        ↓
Lote histórico
debe conservar su vencimiento original
```

---

# 11. Trazabilidad entre insumos y producto terminado

El sistema debe conservar la cadena conceptual:

```text
INSUMO
    ↓
COMPRA
    ↓
INVENTARIO
    ↓
PRODUCCIÓN
    ↓
LOTE
    ↓
VENTA
```

No todas las consultas futuras requerirán recorrer toda la cadena.

Sin embargo, la arquitectura de datos debe evitar romper las relaciones necesarias para reconstruirla.

Ejemplo de consulta conceptual:

```text
¿Qué insumos participaron
en la producción del lote X?
```

El recorrido sería:

```text
Lote
    ↓
Producción de origen
    ↓
Detalle de producción
    ↓
Insumos utilizados
```

---

# 12. Trazabilidad de ventas

Una venta representa una salida comercial del negocio.

Debe conservar la información correspondiente al momento de la operación.

Conceptualmente:

```text
VENTA
│
├── Identificador
├── Fecha
├── Cliente
├── Detalle de venta
│
└── Cada detalle:
    ├── Producto vendido
    ├── Cantidad
    └── Información histórica de la operación
```

Cuando la venta afecte lotes específicos, la relación correspondiente debe permitir identificar el origen del producto vendido.

La cadena conceptual será:

```text
Lote
    ↓
Disponibilidad
    ↓
Venta
    ↓
Detalle de venta
```

Esto permite determinar, cuando el modelo de inventario implementado conserve dicha relación:

```text
¿Qué lote fue vendido?

¿Cuándo fue vendido?

En qué venta participó?
```

---

# 13. Trazabilidad de pagos

Un pago debe conservar su relación con la operación financiera que está afectando.

En el contexto actual del negocio:

```text
Venta
    ↓
Pago
```

La trazabilidad debe permitir identificar:

* La venta relacionada.
* La fecha del pago.
* El valor registrado.
* La información necesaria para determinar el saldo correspondiente.

Un pago no debe quedar como un dato financiero aislado sin una referencia clara a la operación que afecta.

---

# 14. Trazabilidad de gastos

Un gasto representa una salida económica registrada dentro del negocio.

Debe conservar su propio historial.

Como mínimo, conceptualmente:

```text
Gasto
├── Identificador
├── Fecha
├── Concepto
├── Valor
└── Información de clasificación definida por el módulo
```

Los gastos deben poder consultarse posteriormente por período.

Los cambios en cálculos posteriores de costos o rentabilidad no deben eliminar el registro original del gasto.

---

# 15. Historial de precios

Los precios utilizados dentro de operaciones históricas deben conservarse en el contexto de la operación correspondiente.

Ejemplo:

```text
Precio actual del insumo:
$10.000
```

No significa que todas las compras anteriores hayan ocurrido con ese valor.

Por tanto:

```text
Compra A
Precio histórico: $8.000

Compra B
Precio histórico: $9.000

Precio actual registrado:
$10.000
```

La modificación del precio actual no debe reescribir automáticamente las operaciones anteriores.

El mismo principio aplica a cualquier valor económico que forme parte de un hecho de negocio confirmado.

---

# 16. Datos maestros y operaciones históricas

Los datos maestros pueden cambiar.

Por ejemplo:

* Nombre de una presentación.
* Información de un proveedor.
* Datos de un cliente.
* Configuración de un producto.
* Precio de referencia de un insumo.

Sin embargo, las relaciones históricas deben permanecer.

El principio será:

```text
DATO MAESTRO
        ↓
Puede actualizarse

OPERACIÓN HISTÓRICA
        ↓
Debe conservar su relación
y los datos económicos o operativos
necesarios para representar el hecho ocurrido
```

No se deben eliminar relaciones históricas simplemente porque un registro maestro cambie posteriormente.

---

# 17. Eliminación y trazabilidad

Los registros que ya participen en operaciones históricas no deben eliminarse de manera que rompan la integridad de esas operaciones.

Ejemplo:

```text
Insumo
    ↓
Fue utilizado en compras
    ↓
Fue utilizado en producción
```

Eliminarlo físicamente sin considerar sus relaciones puede destruir la trazabilidad.

La estrategia específica de eliminación, desactivación o conservación será definida posteriormente por las reglas de cada módulo.

Sin embargo, se establece desde este momento el siguiente principio:

> **Ninguna operación histórica debe quedar sin la información o relación necesaria para comprender el hecho que representa.**

---

# 18. Estados actuales frente a historia

El sistema debe distinguir conceptualmente entre:

```text
ESTADO ACTUAL
```

y:

```text
HECHO HISTÓRICO
```

Ejemplo:

```text
Inventario actual:
50 unidades
```

Este dato describe una situación actual.

Pero el historial debe permitir explicar:

```text
Inventario inicial
+ Entradas
- Salidas
= Existencia actual
```

La existencia actual puede cambiar constantemente.

Los movimientos que explican esos cambios pertenecen al historial operativo.

---

# 19. Trazabilidad mínima obligatoria

El modelo del sistema debe conservar las siguientes cadenas cuando la operación correspondiente exista:

```text
COMPRA
    ↓
DETALLE DE COMPRA
    ↓
INSUMO
    ↓
MOVIMIENTO DE INVENTARIO
```

```text
PRODUCCIÓN
    ↓
DETALLE DE PRODUCCIÓN
    ↓
INSUMOS UTILIZADOS
```

```text
PRODUCCIÓN
    ↓
LOTE
    ↓
FECHA DE CREACIÓN
    ↓
FECHA DE VENCIMIENTO
```

```text
LOTE
    ↓
DISPONIBILIDAD
    ↓
VENTA
```

```text
VENTA
    ↓
PAGO
```

Estas relaciones constituyen la base de la trazabilidad operativa del sistema.

---

# 20. Auditoría técnica y trazabilidad de negocio

La trazabilidad de negocio y la auditoría técnica son conceptos relacionados, pero no son exactamente lo mismo.

## Trazabilidad de negocio

Responde:

```text
¿Qué ocurrió dentro del negocio?
```

Ejemplo:

```text
Esta compra generó esta entrada.

Esta producción utilizó estos insumos.

Esta producción generó este lote.

Este lote tenía esta fecha de vencimiento.

Esta venta redujo la disponibilidad correspondiente.
```

## Auditoría técnica

Responde preguntas como:

```text
¿Cuándo se creó un registro?

¿Cuándo fue modificado?

Qué usuario realizó una acción?
```

La auditoría técnica será definida en la arquitectura general cuando se implemente el sistema de usuarios y control de operaciones.

Este documento establece únicamente que la futura auditoría no debe sustituir las relaciones de negocio necesarias para la trazabilidad.

---

# 21. Reglas generales

Se establecen las siguientes reglas:

### Regla 1

Todo hecho transaccional debe conservar su fecha correspondiente.

### Regla 2

Una operación histórica no debe depender exclusivamente de valores actuales que puedan cambiar.

### Regla 3

Los precios registrados dentro de una operación deben conservarse como parte del contexto histórico de esa operación cuando sean necesarios para representar el hecho ocurrido.

### Regla 4

Todo movimiento de inventario debe poder relacionarse con su operación de origen cuando dicha operación exista.

### Regla 5

Una producción debe poder relacionarse con los insumos utilizados según el detalle registrado.

### Regla 6

Todo lote debe conservar su producción de origen cuando aplique.

### Regla 7

Todo lote debe registrar su fecha de creación.

### Regla 8

Todo lote debe registrar su fecha de vencimiento establecida.

### Regla 9

Un cambio posterior en la configuración de duración o vencimiento de un producto no debe modificar automáticamente la fecha de vencimiento de un lote histórico.

### Regla 10

Una venta debe conservar su información transaccional y las relaciones necesarias para identificar el producto vendido y, cuando corresponda al modelo implementado, el lote de origen.

### Regla 11

Un pago debe conservar su relación con la venta que afecta.

### Regla 12

Un gasto registrado debe conservarse como hecho histórico independientemente de los cálculos posteriores de costo o rentabilidad.

### Regla 13

Los cambios o eliminaciones de datos maestros no deben destruir la interpretación de operaciones históricas.

---

# 22. Principio final

La trazabilidad del sistema se basa en preservar el recorrido real de las operaciones:

```text
DATOS MAESTROS
        ↓
OPERACIONES
        ↓
MOVIMIENTOS
        ↓
PRODUCCIÓN
        ↓
LOTES
        ↓
VENTAS
        ↓
PAGOS
        ↓
ANÁLISIS DE COSTOS Y RENTABILIDAD
```

La información actual permite conocer el estado presente del negocio.

La información histórica permite entender cómo se llegó a ese estado.

Por tanto, el sistema debe construirse de forma que los cambios futuros no destruyan la capacidad de reconstruir los hechos ya registrados.

> **La trazabilidad no se agrega después como una función adicional. Debe conservarse desde el diseño de las relaciones entre las operaciones del negocio.**
