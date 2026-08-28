# Módulo de Dominio: Inventario

## 1. Propósito

El módulo de Inventario es responsable de registrar, consultar y consolidar la información relacionada con las existencias del negocio.

El principio central del sistema es:

> **El inventario no se modifica directamente. El inventario se determina a partir del historial de movimientos registrados.**

El sistema registra cada entrada y salida mediante movimientos de inventario y, a partir de ellos, determina el estado actual de cada insumo o producto. Esta lógica ya estaba definida en el sistema VBA original. 

La relación fundamental es:

```text
MOVIMIENTOS DE INVENTARIO
          ↓
TOTAL DE ENTRADAS
          ↓
TOTAL DE SALIDAS
          ↓
STOCK ACTUAL
          ↓
ESTADO DEL STOCK
          ↓
VALOR DEL INVENTARIO
```

La fórmula conceptual principal es:

```text
Stock Actual = Total Entradas - Total Salidas
```

---

# 2. Responsabilidad del módulo

El módulo de Inventario es responsable de:

* Registrar movimientos que afecten existencias.
* Mantener el historial de entradas y salidas.
* Identificar si un movimiento afecta un insumo o un producto.
* Consultar movimientos individuales.
* Consultar movimientos por insumo.
* Consultar movimientos por producto.
* Calcular las entradas acumuladas.
* Calcular las salidas acumuladas.
* Determinar el stock actual.
* Determinar el estado del stock.
* Exponer el inventario actual de insumos y productos.
* Calcular el costo promedio cuando la lógica de costos correspondiente esté disponible.
* Calcular el valor del inventario.
* Servir como fuente de información para Producción, Lotes, Ventas, Costos, Rentabilidad y Dashboard.

El módulo no debe convertirse en propietario de los procesos que originan los movimientos.

Por ejemplo:

```text
Compra
    ↓
genera movimiento de entrada

Producción
    ↓
genera salida de insumos
    ↓
genera entrada de productos

Venta
    ↓
genera salida de productos
```

La Compra, Producción o Venta siguen perteneciendo a sus respectivos módulos.

Inventario registra y consolida el efecto sobre las existencias.

---

# 3. Principio arquitectónico principal

La fuente histórica del inventario es:

```text
Movimiento de Inventario
```

La representación del inventario actual es:

```text
Inventario Actual
```

Por tanto:

```text
tblMovimientosInventario
        │
        │ historial de operaciones
        ▼
Cálculo de inventario
        │
        ▼
Inventario actual
```

La tabla de movimientos representa los hechos que ocurrieron.

La información de inventario representa el estado resultante de esos hechos.

En la migración desde VBA, este principio debe conservarse. El módulo original definía expresamente que el inventario no debía modificarse directamente y que el stock se determinaba a partir de entradas y salidas. 

---

# 4. Entidades y conceptos principales

El módulo trabaja inicialmente con dos conceptos principales:

```text
InventoryMovement
InventoryItem
```

## 4.1 InventoryMovement

Representa un evento que aumenta o disminuye las existencias.

Ejemplos:

```text
Compra de leche
    ↓
Entrada de insumo

Producción de yogurt
    ↓
Salida de leche
    ↓
Salida de azúcar
    ↓
Entrada de yogurt terminado

Venta de yogurt
    ↓
Salida de producto terminado

Merma
    ↓
Salida de insumo o producto

Ajuste
    ↓
Entrada o salida
```

Un movimiento pertenece al historial del sistema.

No debe tratarse como un registro CRUD convencional.

---

## 4.2 InventoryItem

Representa la visión consolidada de un elemento dentro del inventario.

Un elemento puede representar:

```text
INSUMO
```

o:

```text
PRODUCTO
```

Su información principal incluye:

```text
ID del elemento
Tipo
Nombre
Unidad base
Total de entradas
Total de salidas
Stock actual
Stock mínimo
Estado
Costo promedio
Valor del inventario
```

La estructura original de `tblInventario` contenía exactamente estos conceptos. 

---

# 5. Alcance funcional

El módulo debe permitir responder preguntas como:

```text
¿Cuánto yogurt terminado hay disponible?

¿Cuánta leche hay actualmente?

¿Cuánto azúcar ha entrado?

¿Cuánto material se ha consumido?

¿Cuánto producto se ha vendido?

¿Qué insumos están por debajo del stock mínimo?

¿Cuál es el valor actual del inventario?

¿Cuál fue el historial de movimientos de un producto?

¿Cuál fue el historial de movimientos de un insumo?
```

---

# 6. Tipos de movimiento

El sistema original definió los siguientes tipos de movimiento:

```text
Compra
Producción
Consumo
Venta
Devolución
Merma
Ajuste
Vencimiento
Transferencia
```



Estos tipos representan inicialmente el catálogo funcional del sistema.

Cada tipo debe tener una semántica clara.

## Compra

Representa la entrada de un insumo adquirido.

```text
Compra
    ↓
Movimiento de Entrada
```

Ejemplo:

```text
Compra de 10 litros de leche
```

Resultado:

```text
Cantidad Entrada: 10
Cantidad Salida: 0
Tipo: Compra
```

---

## Producción

Representa movimientos originados por un proceso de producción.

Una producción puede generar:

```text
Salida de insumos
```

y:

```text
Entrada de productos terminados
```

Por ejemplo:

```text
Producción
├── Salida: leche
├── Salida: azúcar
├── Salida: fruta
└── Entrada: yogurt terminado
```

El módulo de Producción será responsable de ejecutar el proceso.

Inventario registra el impacto sobre las existencias.

---

## Consumo

Representa la utilización de un insumo.

Inicialmente este tipo debe utilizarse cuando una salida corresponda a consumo y no exista una clasificación más específica.

---

## Venta

Representa la salida de productos terminados como consecuencia de una venta.

```text
Venta
    ↓
Salida de Inventario
```

El módulo de Ventas genera la operación comercial.

Inventario registra la reducción de existencias.

---

## Devolución

Representa una devolución que afecta las existencias.

La dirección del movimiento dependerá del contexto de la devolución.

Puede existir:

```text
Devolución que aumenta inventario
```

o:

```text
Devolución que reduce inventario
```

La operación concreta deberá conservar su referencia de origen.

---

## Merma

Representa una pérdida de existencias.

Puede afectar:

```text
Insumos
```

o:

```text
Productos
```

Normalmente genera:

```text
Cantidad Salida > 0
```

---

## Ajuste

Representa una corrección controlada de inventario.

Puede ser:

```text
Ajuste positivo
    ↓
Entrada

Ajuste negativo
    ↓
Salida
```

Los ajustes no deben utilizarse como mecanismo para modificar arbitrariamente el stock.

Deben conservar una referencia, motivo u observación que permita explicar la corrección.

---

## Vencimiento

Representa la salida de existencias que ya no pueden utilizarse o comercializarse debido a su vencimiento.

Puede afectar:

```text
Insumos
```

o:

```text
Productos
```

---

## Transferencia

Representa un movimiento entre ubicaciones o destinos internos cuando esta funcionalidad exista.

La estructura original ya contemplaba:

```text
Origen
Destino
```

por lo que el concepto está previsto en el modelo inicial. 

La gestión avanzada de múltiples ubicaciones no forma parte obligatoria de la primera implementación.

---

# 7. Reglas fundamentales de los movimientos

Cada movimiento debe cumplir las siguientes reglas:

## 7.1 Identificador único

Cada movimiento debe tener un identificador único.

```text
ID_Movimiento
```

---

## 7.2 Un movimiento afecta un solo tipo de elemento

Un movimiento puede afectar:

```text
un insumo
```

o:

```text
un producto
```

pero no ambos simultáneamente.

Por tanto:

```text
ID_Insumo ≠ vacío
ID_Producto = vacío
```

o:

```text
ID_Insumo = vacío
ID_Producto ≠ vacío
```

Nunca:

```text
ID_Insumo ≠ vacío
ID_Producto ≠ vacío
```

La regla estaba definida explícitamente en el módulo VBA original. 

---

## 7.3 Debe existir una dirección del movimiento

Un movimiento debe representar:

```text
ENTRADA
```

o:

```text
SALIDA
```

Debe existir una cantidad de entrada o una cantidad de salida.

---

## 7.4 No puede existir entrada y salida simultáneamente

No se permite:

```text
Cantidad_Entrada > 0
Cantidad_Salida > 0
```

dentro del mismo movimiento.

Cada registro representa una sola dirección.

---

## 7.5 Las cantidades no pueden ser negativas

No se permite:

```text
Cantidad_Entrada < 0
```

ni:

```text
Cantidad_Salida < 0
```

La dirección se representa mediante el campo correspondiente.

No mediante números negativos.

---

## 7.6 La unidad es obligatoria

Cada movimiento debe indicar la unidad utilizada.

Ejemplos:

```text
ml
L
g
kg
unidad
vaso
```

La unidad debe ser compatible con la unidad base del elemento afectado.

---

## 7.7 El costo unitario no puede ser negativo

El costo unitario debe ser:

```text
>= 0
```

---

## 7.8 El costo total

El sistema original definía conceptualmente:

```text
Costo Total = Cantidad del Movimiento × Costo Unitario
```



En la nueva arquitectura se deberá definir posteriormente cómo interactúa esta información con el módulo de Costos y el método de valoración de inventario.

---

## 7.9 Los movimientos representan historial

Los movimientos no deben eliminarse libremente.

El historial debe conservar los eventos que afectaron el inventario.

La regla original establece que los movimientos representan historial y no deben eliminarse o modificarse libremente desde el módulo. 

La política exacta de corrección se definirá cuando se implemente la operación de reversión o anulación.

Inicialmente:

> **Una corrección de inventario no debe consistir en modificar silenciosamente un movimiento histórico.**

---

# 8. Estructura histórica de movimientos

En el sistema VBA original existía la tabla:

```text
tblMovimientosInventario
```

con la siguiente estructura. 

| Campo              | Descripción                                         |
| ------------------ | --------------------------------------------------- |
| `ID_Movimiento`    | Identificador único del movimiento                  |
| `Fecha`            | Fecha del movimiento                                |
| `Tipo_Movimiento`  | Tipo funcional del movimiento                       |
| `ID_Insumo`        | Insumo afectado, cuando corresponda                 |
| `ID_Producto`      | Producto afectado, cuando corresponda               |
| `Cantidad_Entrada` | Cantidad que ingresa                                |
| `Cantidad_Salida`  | Cantidad que sale                                   |
| `Unidad`           | Unidad utilizada                                    |
| `Costo_Unitario`   | Costo unitario asociado                             |
| `Costo_Total`      | Costo total del movimiento                          |
| `ID_Referencia`    | Identificador del proceso que originó el movimiento |
| `Origen`           | Origen de la existencia                             |
| `Destino`          | Destino de la existencia                            |
| `Observaciones`    | Información adicional                               |

---

# 9. Referencias entre módulos

El campo:

```text
ID_Referencia
```

permite relacionar el movimiento con la operación que lo originó.

Ejemplos:

```text
COM-001
    ↓
Compra

PROD-001
    ↓
Producción

VEN-001
    ↓
Venta
```

La relación conceptual es:

```text
PURCHASES
    │
    └── genera entrada
            │
            ▼
       INVENTORY
```

```text
PRODUCTION
    │
    ├── genera salida de insumos
    │
    └── genera entrada de productos
            │
            ▼
       INVENTORY
```

```text
SALES
    │
    └── genera salida de productos
            │
            ▼
       INVENTORY
```

Estas relaciones ya estaban previstas en el diseño VBA original. 

---

# 10. Inventario consolidado

El sistema original contemplaba una segunda estructura:

```text
tblInventario
```

Esta estructura representa el estado consolidado de las existencias.

Los campos definidos originalmente fueron: 

| Campo              | Descripción                         |
| ------------------ | ----------------------------------- |
| `ID_Item`          | Identificador del insumo o producto |
| `Tipo_Item`        | Tipo del elemento                   |
| `Nombre_Item`      | Nombre visible                      |
| `Unidad_Base`      | Unidad principal del elemento       |
| `Total_Entradas`   | Suma de entradas                    |
| `Total_Salidas`    | Suma de salidas                     |
| `Stock_Actual`     | Existencia disponible               |
| `Stock_Minimo`     | Nivel mínimo definido               |
| `Estado_Stock`     | Estado actual                       |
| `Costo_Promedio`   | Costo promedio del elemento         |
| `Valor_Inventario` | Valor económico de las existencias  |

---

# 11. Cálculo del stock

La fórmula principal es:

```text
Stock Actual
=
Total Entradas
-
Total Salidas
```

Conceptualmente:

```text
                MOVIMIENTOS
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ENTRADAS                 SALIDAS
         │                       │
         └───────────┬───────────┘
                     ▼
                STOCK ACTUAL
```

El inventario debe calcularse utilizando los movimientos registrados.

No debe existir una operación funcional equivalente a:

```text
ActualizarStockDirectamente()
```

para cambiar arbitrariamente una existencia.

Cualquier cambio debe estar representado por un movimiento.

---

# 12. Estado del stock

El estado del inventario se determina comparando:

```text
Stock Actual
```

con:

```text
Stock Mínimo
```

Inicialmente, el sistema debe soportar como mínimo los siguientes estados conceptuales:

```text
SIN_STOCK
```

Cuando:

```text
Stock Actual <= 0
```

```text
STOCK_BAJO
```

Cuando:

```text
Stock Actual > 0
```

y:

```text
Stock Actual <= Stock Mínimo
```

```text
STOCK_DISPONIBLE
```

Cuando:

```text
Stock Actual > Stock Mínimo
```

La nomenclatura definitiva de los valores técnicos se establecerá durante la implementación.

---

# 13. Stock mínimo

El stock mínimo proviene inicialmente de la configuración del elemento.

Para los insumos, el sistema VBA original ya contemplaba:

```text
Stock_Minimo
```

como parte del maestro de Insumos.

El módulo de Inventario utiliza ese valor para determinar el estado actual de las existencias.

El inventario no es propietario de la configuración maestra del insumo.

La relación es:

```text
SUPPLIES
    │
    └── define Stock Mínimo
            │
            ▼
INVENTORY
    │
    └── calcula Estado del Stock
```

---

# 14. Insumos y productos

El inventario trabaja con dos clases funcionales de elementos:

```text
INSUMO
```

y:

```text
PRODUCTO
```

La estructura original utiliza:

```text
ID_Insumo
ID_Producto
```

en los movimientos, y:

```text
Tipo_Item
```

en el inventario consolidado.  

Esto significa que el inventario no administra dos sistemas independientes.

Existe un único dominio de movimientos con diferentes tipos de elementos.

---

# 15. Flujo: compra

El flujo conceptual será:

```text
Proveedor
    ↓
Compra
    ↓
Detalle de Compra
    ↓
Movimiento de Inventario
    ↓
Entrada de Insumo
    ↓
Actualización del Inventario Consolidado
```

Ejemplo:

```text
Compra COM-001
    │
    └── Leche
            │
            └── 10 L
                    │
                    ▼
Movimiento MOV-001

Tipo: Compra
Entrada: 10 L
Salida: 0
Referencia: COM-001
```

---

# 16. Flujo: producción

La Producción afecta el inventario en dos direcciones.

```text
PRODUCCIÓN
│
├── consume insumos
│       ↓
│    SALIDAS
│
└── genera producto terminado
        ↓
     ENTRADAS
```

Ejemplo:

```text
Producción PROD-001

SALIDAS:
- Leche
- Azúcar
- Fruta

ENTRADA:
- Yogurt terminado
```

El módulo de Producción será responsable de determinar qué se consume y qué se produce.

El módulo de Inventario será responsable de registrar y reflejar esos efectos.

---

# 17. Flujo: venta

El flujo conceptual será:

```text
Cliente
    ↓
Venta
    ↓
Detalle de Venta
    ↓
Movimiento de Inventario
    ↓
Salida de Producto
```

Ejemplo:

```text
Venta VEN-001
    │
    └── Yogurt 12 oz
            │
            └── 20 unidades
                    │
                    ▼
Movimiento de Salida
```

---

# 18. Flujo: merma

La merma representa una disminución real de existencias.

```text
Detección de merma
        ↓
Identificación del elemento
        ↓
Cantidad perdida
        ↓
Registro del movimiento
        ↓
Salida de inventario
```

El movimiento debe conservar información suficiente para entender la causa.

Como mínimo:

```text
Tipo: Merma
Referencia: según corresponda
Observaciones: motivo
```

---

# 19. Flujo: ajuste

El ajuste debe utilizarse únicamente para corregir diferencias entre la existencia registrada y una existencia física o validada.

```text
Conteo o verificación
        ↓
Diferencia detectada
        ↓
Justificación
        ↓
Ajuste
        ↓
Movimiento de entrada o salida
```

Nunca:

```text
Stock = nuevo valor manual
```

El sistema debe conservar el historial del ajuste.

---

# 20. Flujo: vencimiento

Cuando un insumo o producto ya no pueda utilizarse debido a vencimiento:

```text
Elemento vencido
        ↓
Movimiento
Tipo: Vencimiento
        ↓
Salida de Inventario
```

La integración detallada con Lotes se definirá en el módulo correspondiente.

---

# 21. Consultas principales

El módulo debe permitir las siguientes consultas funcionales.

## Por movimiento

```text
Obtener movimiento por ID
```

## Por insumo

```text
Obtener movimientos de un insumo
```

## Por producto

```text
Obtener movimientos de un producto
```

## Por período

```text
Obtener movimientos entre fechas
```

## Por tipo

```text
Obtener movimientos de Compra
Obtener movimientos de Producción
Obtener movimientos de Venta
Obtener movimientos de Merma
```

## Por referencia

```text
Obtener movimientos generados por una Compra

Obtener movimientos generados por una Producción

Obtener movimientos generados por una Venta
```

---

# 22. Información derivada

La siguiente información es derivada del historial de movimientos:

```text
Total de Entradas
```

```text
Total de Salidas
```

```text
Stock Actual
```

```text
Estado del Stock
```

Y posteriormente:

```text
Costo Promedio
```

```text
Valor del Inventario
```

La regla general es:

> **La información derivada debe poder explicarse a partir de los movimientos y las reglas vigentes del sistema.**

---

# 23. Relación con Costos

El módulo de Inventario conserva información de costo asociada a los movimientos:

```text
Costo_Unitario
Costo_Total
```

La estructura ya existía en el sistema VBA original. 

Sin embargo, Inventario no será responsable de definir por sí solo toda la política financiera de costos.

La responsabilidad debe dividirse conceptualmente así:

```text
INVENTORY
    ↓
Conserva movimientos y existencias

COSTS
    ↓
Define y aplica cálculos de costos

PROFITABILITY
    ↓
Utiliza costos e ingresos
```

El método definitivo de valoración de inventario deberá documentarse cuando se construya el módulo de Costos.

---

# 24. Relación con Lotes

Inventario y Lotes son módulos relacionados pero diferentes.

```text
INVENTORY
    ↓
¿Cuánto existe?

LOTS
    ↓
¿Qué lote existe?
¿Cuándo se produjo?
¿Cuándo vence?
¿Cuánto queda de ese lote?
```

Por tanto:

```text
Inventario
≠
Lotes
```

El inventario representa cantidades agregadas.

Los lotes representan trazabilidad específica.

La integración exacta se definirá en:

```text
09-lots.md
```

---

# 25. Relación con los demás módulos

## Supplies

Define los insumos que pueden existir en el inventario.

```text
SUPPLIES
    ↓
Insumo
    ↓
INVENTORY
```

---

## Products

Define los productos terminados.

```text
PRODUCTS
    ↓
Producto
    ↓
INVENTORY
```

---

## Purchases

Origina entradas de insumos.

```text
PURCHASES
    ↓
INVENTORY
```

---

## Production

Consume insumos y genera productos.

```text
PRODUCTION
    ↓
INVENTORY
```

---

## Lots

Utiliza la información de existencias y trazabilidad.

```text
INVENTORY
↔
LOTS
```

La dirección exacta de dependencia será definida en las reglas de arquitectura e implementación.

---

## Sales

Origina salidas de productos terminados.

```text
SALES
    ↓
INVENTORY
```

---

## Costs

Utiliza información de costos y existencias.

```text
INVENTORY
    ↓
COSTS
```

---

## Profitability

Consume información financiera consolidada.

```text
INVENTORY
    ↓
COSTS
    ↓
PROFITABILITY
```

---

## Dashboard

Consume indicadores derivados del inventario.

Ejemplos:

```text
Productos sin stock
Insumos con stock bajo
Valor total del inventario
Movimientos recientes
Mermas
```

---

# 26. Operaciones funcionales previstas

El módulo debe evolucionar para soportar, como mínimo:

```text
RegistrarMovimiento()
```

```text
ConsultarMovimiento()
```

```text
ConsultarMovimientosPorItem()
```

```text
ConsultarMovimientosPorPeriodo()
```

```text
ConsultarMovimientosPorReferencia()
```

```text
CalcularEntradas()
```

```text
CalcularSalidas()
```

```text
CalcularStockActual()
```

```text
DeterminarEstadoStock()
```

```text
ConsultarInventario()
```

```text
ConsultarInventarioBajo()
```

```text
ConsultarSinStock()
```

Estos nombres son conceptuales.

La implementación final deberá seguir las convenciones oficiales del proyecto.

---

# 27. Operaciones que no pertenecen al módulo

El módulo de Inventario no debe:

* Crear insumos.
* Modificar información maestra de insumos.
* Crear productos.
* Modificar productos.
* Registrar una compra completa.
* Registrar una producción completa.
* Registrar una venta completa.
* Administrar clientes.
* Administrar proveedores.
* Administrar pagos.
* Administrar gastos.
* Definir recetas.
* Modificar directamente el stock.
* Eliminar arbitrariamente movimientos históricos.
* Contener lógica de interfaz de usuario.

Estas separaciones ya estaban presentes en el diseño original del módulo VBA de movimientos de inventario. 

---

# 28. Límites del módulo

La responsabilidad del módulo termina cuando el movimiento de inventario ha sido correctamente registrado y cuando el estado consolidado puede determinarse a partir de los movimientos.

Por ejemplo:

```text
PURCHASES
    │
    │ confirma compra
    ▼
INVENTORY
    │
    │ registra entrada
    ▼
INVENTORY COMPLETADO
```

Inventario no debe asumir responsabilidades adicionales de Compra.

---

# 29. Reglas de integridad

El sistema deberá garantizar como mínimo:

```text
1. ID_Movimiento es único.
```

```text
2. Un movimiento afecta un insumo o un producto.
```

```text
3. No puede afectar ambos simultáneamente.
```

```text
4. Debe existir una entrada o una salida.
```

```text
5. No pueden existir entrada y salida positivas simultáneamente.
```

```text
6. Las cantidades no pueden ser negativas.
```

```text
7. La unidad es obligatoria.
```

```text
8. El costo unitario no puede ser negativo.
```

```text
9. El movimiento debe conservar su fecha.
```

```text
10. Los movimientos históricos no se eliminan libremente.
```

```text
11. El stock no debe modificarse directamente.
```

```text
12. Todo cambio de existencia debe tener un movimiento que lo explique.
```

---

# 30. Decisiones pendientes

Las siguientes decisiones todavía no deben considerarse cerradas:

## Método de valoración de inventario

Debe definirse si el sistema utilizará:

```text
Costo promedio
```

u otro método de valoración.

El diseño original contempla:

```text
Costo_Promedio
```

pero la política completa deberá cerrarse junto con el módulo de Costos. 

---

## Stock negativo

Debe definirse explícitamente si el sistema permitirá:

```text
Stock < 0
```

La recomendación para la implementación es no permitir movimientos normales que generen existencias negativas sin una regla explícita de excepción.

Esta regla deberá confirmarse durante el diseño del proceso de Producción y Ventas.

---

## Reversión de movimientos

Debe definirse el mecanismo oficial para corregir un movimiento histórico.

Posibilidades conceptuales:

```text
Anulación mediante movimiento contrario
```

o:

```text
Reversión controlada
```

La solución definitiva debe preservar trazabilidad.

---

## Inventario físico

El proceso completo de conteo físico todavía no está definido.

Posteriormente podrá incluir:

```text
Conteo físico
    ↓
Comparación con sistema
    ↓
Diferencia
    ↓
Ajuste documentado
```

---

## Ubicaciones múltiples

La estructura original contempla:

```text
Origen
Destino
```

pero el sistema inicial no tiene definido todavía un módulo completo de ubicaciones.

La funcionalidad queda prevista, pero no debe implementarse hasta que exista una necesidad real.

---

# 31. Modelo conceptual del módulo

```text
                     SUPPLIES
                        │
                        │
                        ▼
                    INSUMOS
                        │
                        │
                        ├───────────────┐
                        │               │
                        ▼               │
                    PURCHASES           │
                        │               │
                        ▼               │
                INVENTORY MOVEMENTS ◄───┤
                        ▲               │
                        │               │
                    PRODUCTION          │
                        │               │
                        ▼               │
                    PRODUCTS            │
                        │               │
                        ▼               │
                      SALES             │
                                        │
                                        ▼
                                INVENTORY STATE
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
                    STOCK          ALERTS           VALUE
```

---

# 32. Flujo general del inventario

```text
OPERACIÓN DEL NEGOCIO
        │
        ├── Compra
        ├── Producción
        ├── Venta
        ├── Merma
        ├── Ajuste
        ├── Devolución
        └── Vencimiento
                │
                ▼
        MOVIMIENTO DE INVENTARIO
                │
                ▼
        HISTORIAL INMUTABLE
                │
                ▼
        CÁLCULO DE ENTRADAS
                │
                ▼
        CÁLCULO DE SALIDAS
                │
                ▼
        STOCK ACTUAL
                │
                ▼
        ESTADO DEL INVENTARIO
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
     SIN      BAJO   DISPONIBLE
    STOCK     STOCK
```

---

# 33. Estado actual de definición

El dominio de Inventario queda definido inicialmente con los siguientes conceptos confirmados desde el sistema anterior:

```text
Movimiento de inventario como historial.
```

```text
Entrada y salida como mecanismo de modificación.
```

```text
Un movimiento afecta un insumo o un producto.
```

```text
El stock se determina a partir de los movimientos.
```

```text
Inventario consolidado para mostrar existencias.
```

```text
Stock mínimo y estado del stock.
```

```text
Costo unitario y costo total asociados a movimientos.
```

```text
Referencia al proceso que originó el movimiento.
```

```text
Relación con Compras, Producción y Ventas.
```

La estructura histórica original incluía `tblMovimientosInventario` y `tblInventario`, con sus respectivos campos y responsabilidades.  

---

# 34. Fuente de verdad del dominio

A partir de la aprobación de este documento, las decisiones futuras sobre el dominio de Inventario deberán seguir este proceso:

```text
Necesidad detectada
        ↓
Revisión de 07-inventory.md
        ↓
¿La regla ya está definida?
        │
        ├── Sí
        │     ↓
        │  Implementar según documento
        │
        └── No
              ↓
        Definir nueva regla
              ↓
        Actualizar documentación
              ↓
        Implementar
```

Este documento representa la definición funcional actual del módulo de Inventario y deberá evolucionar junto con la implementación real del sistema.
