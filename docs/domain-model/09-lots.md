# 09 — LOTES

## 1. Propósito del módulo

El módulo **Lotes** administra la identificación, existencia, disponibilidad, vencimiento y trazabilidad de los lotes manejados por el sistema.

Un lote representa una cantidad específica de un producto o insumo que debe poder ser identificada y seguida individualmente durante su ciclo de vida.

El módulo permite responder preguntas como:

* ¿Cuándo fue producido este lote?
* ¿Cuándo vence?
* ¿Cuánta cantidad se produjo inicialmente?
* ¿Cuánta cantidad queda disponible?
* ¿Qué producto o insumo representa?
* ¿Cuál es su estado actual?
* ¿Qué ventas utilizaron un lote determinado?
* ¿Qué lote fue utilizado dentro de una operación?

La estructura original del sistema VBA ya contemplaba una tabla específica `tblLotes` con identificación, tipo, producto o insumo asociado, fechas, cantidades, unidad, estado y observaciones. 

---

# 2. Responsabilidad del módulo

El módulo `lots` es responsable de:

* Crear y registrar lotes.
* Identificar cada lote de forma única.
* Asociar un lote con un producto o, cuando corresponda, con un insumo.
* Registrar la fecha real de producción del lote.
* Registrar y conservar la fecha de vencimiento.
* Registrar la cantidad inicial del lote.
* Consultar la cantidad disponible.
* Controlar el estado del lote.
* Mantener la información necesaria para la trazabilidad.
* Permitir que otros módulos referencien un lote.
* Conservar el historial del lote aunque cambien configuraciones posteriores.

---

# 3. No responsabilidad del módulo

El módulo `lots` no es responsable de:

* Definir productos.
* Definir insumos.
* Definir recetas.
* Ejecutar una producción completa.
* Registrar una compra.
* Registrar directamente una venta.
* Calcular el costo general del producto.
* Calcular la rentabilidad.
* Administrar pagos.
* Administrar gastos.
* Calcular el inventario global.
* Decidir automáticamente toda la lógica de movimientos de inventario.

Estas responsabilidades pertenecen a otros módulos.

---

# 4. Posición del módulo dentro del negocio

El módulo de lotes se encuentra principalmente dentro del flujo de trazabilidad del negocio.

```text
INSUMOS
    │
    ▼
COMPRAS
    │
    ▼
INVENTARIO
    │
    ├──────────────────────┐
    │                      │
    ▼                      ▼
PRODUCCIÓN              LOTES DE INSUMOS
    │
    ▼
LOTES DE PRODUCTOS
    │
    ▼
VENTAS
```

Para el producto terminado, el flujo principal será:

```text
RECETA
   │
   ▼
PRODUCCIÓN
   │
   ├── consume insumos
   │
   ├── registra cantidades reales
   │
   └── genera resultado
            │
            ▼
           LOTE
            │
            ├── producto
            ├── fecha de producción
            ├── fecha de vencimiento
            ├── cantidad inicial
            └── cantidad disponible
                    │
                    ▼
                  VENTAS
```

---

# 5. Concepto de lote

Un lote no representa simplemente un producto.

Por ejemplo:

```text
Producto:
Yogurt Natural 1 Litro
```

Puede existir más de un lote del mismo producto:

```text
Lote LOT-001
Producción: 01/09/2026
Vencimiento: 15/09/2026

Lote LOT-002
Producción: 05/09/2026
Vencimiento: 19/09/2026

Lote LOT-003
Producción: 10/09/2026
Vencimiento: 24/09/2026
```

Los tres representan el mismo producto, pero son unidades de trazabilidad diferentes.

Por esa razón:

```text
Producto
    1
    │
    │ puede tener
    ▼
Muchos lotes
```

---

# 6. Identidad del lote

Cada lote debe tener una identidad única dentro del sistema.

Conceptualmente:

```text
Lot
├── id
└── lotCode
```

## `id`

Es el identificador técnico interno del sistema.

## `lotCode`

Es el código identificable del lote.

Este código puede utilizarse posteriormente para:

* Consultas.
* Trazabilidad.
* Etiquetado.
* Identificación manual.
* Relación con ventas.
* Control de vencimientos.

La estrategia exacta para generar el código del lote será definida durante la implementación.

---

# 7. Tipo de lote

La estructura heredada del sistema VBA contempla:

```text
Tipo_Lote
```

Esto permite diferenciar el origen o naturaleza del lote. 

Inicialmente, el sistema debe contemplar conceptualmente:

```text
PRODUCT
```

Para lotes de producto terminado.

Y, cuando el modelo operativo lo requiera:

```text
SUPPLY
```

Para lotes específicos de insumos.

La implementación exacta de los lotes de insumos deberá respetar la lógica definitiva de compras e inventario.

No se debe asumir que cada insumo tendrá obligatoriamente un lote individual hasta definir completamente el flujo de recepción y trazabilidad de compras.

---

# 8. Producto o insumo asociado

Un lote puede estar relacionado conceptualmente con:

```text
Producto
```

o con:

```text
Insumo
```

La estructura original contemplaba:

```text
ID_Producto
ID_Insumo
```

dentro de `tblLotes`. 

La regla conceptual es:

```text
Un lote debe representar un elemento identificable.
```

Para un lote de producto:

```text
lot
└── productId
```

Para un lote de insumo:

```text
lot
└── supplyId
```

Un mismo lote no debe representar simultáneamente un producto terminado y un insumo.

---

# 9. Fechas del lote

Las fechas son información fundamental para la trazabilidad.

El modelo debe diferenciar claramente entre la fecha real del proceso y las fechas técnicas del sistema.

## 9.1 `productionDate`

Representa la fecha real en la que fue producido físicamente el lote.

Ejemplo:

```text
productionDate = 2026-09-10
```

Esta fecha debe reflejar el momento real de producción.

No debe utilizarse simplemente la fecha en la que el usuario registró la información en la aplicación.

---

## 9.2 `expirationDate`

Representa la fecha específica en la que vence ese lote.

Ejemplo:

```text
productionDate = 2026-09-10

expirationDate = 2026-09-25
```

La fecha de vencimiento pertenece al historial propio del lote.

Una vez creado el lote:

> La fecha de vencimiento almacenada debe conservarse como dato histórico.

Esto significa que cambios posteriores en:

* configuración del producto;
* vida útil;
* recetas;
* reglas futuras;

no deben modificar automáticamente la fecha de vencimiento de un lote histórico.

Ejemplo:

```text
Producto
Vida útil inicial: 15 días

Lote LOT-001
Producción: 01/09/2026
Vencimiento: 16/09/2026
```

Posteriormente:

```text
Producto
Nueva vida útil: 20 días
```

El sistema no debe transformar el lote anterior en:

```text
Vencimiento: 21/09/2026
```

El lote conserva:

```text
Vencimiento: 16/09/2026
```

porque esa fue la información vigente y registrada para ese lote específico.

---

## 9.3 `createdAt`

Representa la fecha y hora técnica en la que el registro fue creado dentro del sistema.

No debe confundirse con:

```text
productionDate
```

Ejemplo:

```text
Producción real:
10/09/2026

Registro ingresado al sistema:
11/09/2026
```

Entonces:

```text
productionDate = 2026-09-10

createdAt = 2026-09-11
```

---

## 9.4 `updatedAt`

Representa la última fecha y hora en la que el registro fue modificado.

Esta información es técnica y forma parte de la trazabilidad del registro.

---

# 10. Regla para el cálculo de vencimiento

La fecha de vencimiento puede ser determinada a partir de una regla del producto.

Conceptualmente:

```text
expirationDate
=
productionDate
+
shelfLifeDays
```

Ejemplo:

```text
Vida útil:
15 días

Fecha de producción:
10/09/2026

Fecha de vencimiento:
25/09/2026
```

Sin embargo, el resultado debe guardarse explícitamente en el lote.

La relación correcta es:

```text
Configuración del producto
        │
        │ proporciona la regla inicial
        ▼
Cálculo de vencimiento
        │
        ▼
expirationDate del lote
        │
        ▼
Dato histórico independiente
```

No debe depender permanentemente de un cálculo dinámico.

---

# 11. Cantidades del lote

Cada lote debe registrar su cantidad inicial.

```text
initialQuantity
```

Ejemplo:

```text
Lote LOT-001

Cantidad inicial:
100 unidades
```

También debe ser posible conocer la cantidad actualmente disponible:

```text
availableQuantity
```

Ejemplo:

```text
Cantidad inicial:
100 unidades

Vendidas:
35 unidades

Cantidad disponible:
65 unidades
```

Por tanto:

```text
initialQuantity = 100

availableQuantity = 65
```

La cantidad disponible nunca debe superar la cantidad inicial sin una operación válida que justifique el cambio.

---

# 12. Unidad

Cada lote debe conservar la unidad asociada a sus cantidades.

Ejemplos:

```text
UNITS
KG
G
L
ML
```

La unidad permite interpretar correctamente:

```text
initialQuantity
availableQuantity
```

Ejemplo:

```text
initialQuantity = 50
unit = UNITS
```

No significa lo mismo que:

```text
initialQuantity = 50
unit = KG
```

---

# 13. Estado del lote

Cada lote debe tener un estado que represente su situación actual.

Inicialmente, el modelo conceptual debe permitir estados equivalentes a:

```text
AVAILABLE
```

El lote puede utilizarse normalmente.

```text
DEPLETED
```

El lote ya no tiene cantidad disponible.

```text
EXPIRED
```

La fecha de vencimiento ya fue alcanzada o superada según la regla temporal definida por el sistema.

```text
BLOCKED
```

El lote existe, pero no puede utilizarse.

```text
CANCELLED
```

El lote fue anulado conforme a una operación válida.

La lista definitiva de estados será formalizada durante el diseño del modelo de datos.

No se deben inventar estados adicionales sin una necesidad operativa.

---

# 14. Relación entre lote y producción

Un lote de producto terminado puede originarse como resultado de una producción.

La relación conceptual es:

```text
Production
    │
    └── genera
            │
            ▼
           Lot
```

El sistema VBA ya contemplaba una relación entre producción y lote mediante:

```text
ID_Lote
```

dentro de la estructura de producción. 

El diseño definitivo deberá establecer claramente si:

```text
1 producción
        ↓
1 lote
```

es la regla inicial del sistema.

Para la primera versión, esta será la hipótesis operativa base:

```text
Una ejecución de producción genera un lote principal de producto terminado.
```

Si posteriormente una misma producción necesita generar múltiples lotes, esa evolución deberá ser una decisión explícita de arquitectura y modelo de negocio.

---

# 15. Relación entre lote y ventas

Una venta debe poder identificar el lote específico del cual salió el producto.

La estructura original de `tblDetalleVentas` ya contemplaba:

```text
ID_Lote
```

como parte del detalle de cada línea de venta. 

La relación conceptual es:

```text
Lot
 │
 ├── puede aparecer en
 │
 ▼
SaleItem
 │
 ├── Sale 001
 ├── Sale 002
 └── Sale 003
```

Esto permite reconstruir posteriormente:

```text
LOTE LOT-001
        │
        ├── Producción de origen
        │
        ├── Producto
        │
        ├── Fecha de producción
        │
        ├── Fecha de vencimiento
        │
        └── Ventas donde fue utilizado
```

Esta relación es fundamental para la trazabilidad.

---

# 16. Relación con inventario

Los lotes y el inventario están relacionados, pero no son el mismo concepto.

```text
INVENTARIO
```

responde principalmente:

> ¿Cuánto existe?

```text
LOTES
```

responde:

> ¿Qué cantidad existe y de cuál origen específico?

Ejemplo:

```text
Inventario total

Yogurt Natural 1 Litro:
100 unidades
```

Pero internamente:

```text
LOT-001
40 unidades
Vence: 15/09/2026

LOT-002
60 unidades
Vence: 20/09/2026
```

Entonces:

```text
Inventario global:
100 unidades

Trazabilidad:
LOT-001 → 40
LOT-002 → 60
```

El módulo de lotes no reemplaza al módulo de inventario.

Ambos representan perspectivas diferentes sobre la existencia física.

---

# 17. Cantidad disponible y movimientos

La cantidad disponible de un lote puede cambiar como consecuencia de operaciones válidas.

Conceptualmente:

```text
LOTE
Cantidad inicial: 100
        │
        ▼
OPERACIÓN
        │
        ├── salida de venta
        ├── ajuste autorizado
        ├── pérdida o merma registrada
        └── otra operación válida
                │
                ▼
Cantidad disponible actual
```

La implementación definitiva deberá definir la relación exacta entre:

```text
lots.availableQuantity
```

y:

```text
inventory movements
```

La regla principal será:

> La cantidad disponible de un lote no debe modificarse arbitrariamente desde la interfaz.

Todo cambio debe tener un origen operativo identificable.

---

# 18. Trazabilidad del lote

La trazabilidad mínima de un lote debe permitir reconstruir:

```text
¿QUÉ?
    Producto o insumo.

¿CUÁL?
    Código e identificación del lote.

¿CUÁNDO SE PRODUJO?
    productionDate.

¿CUÁNDO VENCE?
    expirationDate.

¿CUÁNTO SE CREÓ?
    initialQuantity.

¿CUÁNTO QUEDA?
    availableQuantity.

¿QUÉ ESTADO TIENE?
    status.

¿CUÁNDO FUE REGISTRADO?
    createdAt.

¿CUÁNDO FUE MODIFICADO?
    updatedAt.
```

Cuando el sistema evolucione con las relaciones correspondientes, también deberá permitir identificar:

```text
Origen
    ↓
Producción

Destino
    ↓
Ventas u otras operaciones autorizadas
```

---

# 19. Información conceptual del lote

El modelo conceptual inicial del lote será:

```text
Lot
│
├── id
├── lotCode
│
├── type
│
├── productId
├── supplyId
│
├── productionId
│
├── productionDate
├── expirationDate
│
├── initialQuantity
├── availableQuantity
├── unit
│
├── status
├── observations
│
├── createdAt
└── updatedAt
```

No todos los campos serán necesariamente obligatorios para todos los tipos de lote.

Por ejemplo:

```text
PRODUCT LOT
```

requiere conceptualmente:

```text
productId
```

mientras que:

```text
SUPPLY LOT
```

requiere:

```text
supplyId
```

La implementación de restricciones definitivas será establecida en la arquitectura de datos.

---

# 20. Reglas de negocio iniciales

## Regla 1

Todo lote debe tener una identidad única.

---

## Regla 2

Todo lote debe tener un tipo definido.

---

## Regla 3

Un lote debe estar asociado a un producto o a un insumo según su tipo.

---

## Regla 4

Un mismo lote no debe representar simultáneamente un producto y un insumo.

---

## Regla 5

La cantidad inicial debe ser mayor que cero.

```text
initialQuantity > 0
```

---

## Regla 6

La cantidad disponible no puede ser negativa.

```text
availableQuantity >= 0
```

---

## Regla 7

La cantidad disponible no debe superar la cantidad inicial sin una operación válida que modifique formalmente la cantidad del lote.

---

## Regla 8

Para un lote de producto terminado debe existir una fecha real de producción.

---

## Regla 9

Todo lote sujeto a vencimiento debe tener una fecha de vencimiento registrada.

---

## Regla 10

La fecha de vencimiento debe ser posterior a la fecha de producción cuando ambas fechas sean aplicables.

---

## Regla 11

La fecha de vencimiento almacenada en un lote es información histórica.

Cambios posteriores en la vida útil configurada no deben modificar automáticamente los lotes existentes.

---

## Regla 12

`createdAt` no sustituye a `productionDate`.

Son conceptos diferentes.

```text
productionDate
=
fecha real del proceso físico

createdAt
=
fecha técnica de creación del registro
```

---

## Regla 13

La cantidad disponible no debe modificarse manualmente sin una operación que permita justificar el cambio.

---

## Regla 14

Un lote vencido no debe utilizarse para nuevas operaciones que estén prohibidas por las reglas operativas del sistema.

La definición exacta de las operaciones afectadas se establecerá junto con los módulos de ventas e inventario.

---

# 21. Casos que este módulo debe soportar

Inicialmente, el diseño debe permitir soportar:

```text
1. Registrar un lote generado por producción.

2. Consultar un lote.

3. Consultar todos los lotes de un producto.

4. Consultar lotes disponibles.

5. Consultar lotes próximos a vencer.

6. Consultar lotes vencidos.

7. Consultar la cantidad disponible de un lote.

8. Consultar la trazabilidad básica de un lote.

9. Consultar las operaciones posteriores relacionadas con el lote.
```

---

# 22. Consultas futuras

El módulo debe permitir evolucionar hacia consultas como:

```text
Lotes próximos a vencer.
```

```text
Lotes vencidos.
```

```text
Lotes disponibles por producto.
```

```text
Historial completo de un lote.
```

```text
Ventas realizadas desde un lote específico.
```

```text
Producción de origen de un lote.
```

```text
Cantidad disponible agrupada por lote.
```

Estas consultas pertenecen conceptualmente al dominio de lotes, aunque algunas puedan utilizar información proveniente de otros módulos.

---

# 23. Dependencias del módulo

El módulo `lots` depende conceptualmente de información proveniente de:

```text
products
```

Para identificar el producto asociado.

```text
supplies
```

Cuando exista trazabilidad de lotes de insumos.

```text
production
```

Para identificar el origen de los lotes de producto terminado.

```text
inventory
```

Para mantener coherencia con la existencia física y los movimientos.

```text
sales
```

Para conocer la salida de productos por lote.

---

# 24. Módulos que dependen de lotes

Otros módulos pueden necesitar consultar información del módulo `lots`.

Principalmente:

```text
inventory
```

```text
sales
```

```text
production
```

```text
costs
```

```text
profitability
```

```text
dashboard
```

Cada dependencia deberá respetar las reglas oficiales de dependencia arquitectónica.

---

# 25. Lo que no debe ocurrir

No se debe:

* Modificar arbitrariamente la fecha histórica de vencimiento.
* Confundir la fecha de producción con la fecha técnica de creación del registro.
* Eliminar un lote utilizado en operaciones históricas.
* Cambiar cantidades sin una operación justificable.
* Permitir cantidades negativas.
* Utilizar un lote vencido ignorando las reglas operativas.
* Crear lotes sin una identidad clara.
* Usar el módulo de lotes como sustituto del inventario global.
* Duplicar en otros módulos la información histórica propia del lote.

---

# 26. Relación con el modelo original de VBA

El sistema original definía la tabla:

```text
tblLotes
```

con los siguientes campos:

```text
ID_Lote
Tipo_Lote
ID_Producto
ID_Insumo
Fecha_Produccion
Fecha_Vencimiento
Cantidad_Inicial
Cantidad_Disponible
Unidad
Estado
Observaciones
```

Esta estructura constituye la base histórica del módulo y confirma que el modelo original ya separaba explícitamente la fecha de producción, la fecha de vencimiento, las cantidades inicial y disponible y el estado del lote. 

El sistema JavaScript evolucionará esta estructura para incorporar también los campos técnicos de auditoría:

```text
id
createdAt
updatedAt
```

sin eliminar los conceptos funcionales ya definidos.

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
* Su posición dentro del negocio.
* El concepto de lote.
* La relación con productos e insumos.
* La relación con producción.
* La relación con ventas.
* La relación con inventario.
* Las fechas fundamentales.
* La regla de conservación histórica de vencimiento.
* Las cantidades.
* Los estados conceptuales.
* Las reglas iniciales.
* La trazabilidad mínima.

Todavía no se ha definido:

* El esquema definitivo de PostgreSQL.
* Las relaciones exactas de base de datos.
* Los índices.
* La estrategia definitiva de generación del código de lote.
* El mecanismo exacto de actualización de `availableQuantity`.
* La estrategia definitiva para lotes de insumos.
* La política definitiva de selección de lotes para una venta.
* Las reglas exactas de bloqueo de lotes vencidos.
* La implementación en backend.
* La implementación en frontend.

---

# 28. Decisiones pendientes

Antes de implementar el módulo se deberán resolver explícitamente las siguientes decisiones:

## 28.1 Un lote por producción

Confirmar formalmente si:

```text
1 Production
        ↓
1 Lot
```

será la regla inicial obligatoria.

---

## 28.2 Lotes de insumos

Definir si todos los insumos tendrán trazabilidad por lote o únicamente aquellos que lo requieran.

---

## 28.3 Selección de lote en ventas

Definir si el sistema utilizará:

```text
Selección manual
```

o una regla automática como:

```text
FEFO
First Expired, First Out
```

priorizando la salida del lote con vencimiento más próximo.

---

## 28.4 Actualización de cantidad disponible

Definir si:

```text
availableQuantity
```

será:

```text
A. un valor almacenado y actualizado por operaciones
```

o:

```text
B. un valor calculado desde los movimientos asociados
```

Esta decisión deberá tomarse junto con el diseño definitivo del módulo `inventory`.

---

## 28.5 Estados definitivos

Formalizar los estados oficiales permitidos y sus transiciones.

---

# 29. Resumen conceptual

El módulo `lots` representa la unidad principal de trazabilidad individual del sistema.

```text
PRODUCCIÓN
      │
      ▼
     LOTE
      │
      ├── Identidad
      ├── Producto o insumo
      ├── Fecha real de producción
      ├── Fecha de vencimiento histórica
      ├── Cantidad inicial
      ├── Cantidad disponible
      ├── Unidad
      ├── Estado
      └── Trazabilidad
              │
              ▼
       INVENTARIO / VENTAS
```

La regla central del módulo es:

> **Cada lote conserva su propia identidad e historia. La fecha de producción, la fecha de vencimiento y las cantidades registradas para un lote específico deben poder consultarse posteriormente sin ser alteradas por cambios posteriores en la configuración general del producto.**
