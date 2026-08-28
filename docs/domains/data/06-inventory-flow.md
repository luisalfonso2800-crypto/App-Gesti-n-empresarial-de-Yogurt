# 06 — INVENTORY FLOW

## 1. Propósito del documento

Este documento define el flujo de inventario del sistema de gestión empresarial de yogurt.

Su objetivo es establecer:

* qué operaciones generan movimientos de inventario;
* qué tipo de movimiento produce cada operación;
* qué información debe quedar registrada;
* cuál es el origen de cada movimiento;
* cómo se relacionan compras, producción, lotes y ventas;
* qué responsabilidades corresponden a cada módulo;
* qué reglas deben respetarse para conservar la trazabilidad.

El inventario no se gestiona como una cantidad aislada que puede modificarse libremente.

La lógica base del sistema es:

```text
OPERACIÓN DE NEGOCIO
        ↓
MOVIMIENTO DE INVENTARIO
        ↓
ACTUALIZACIÓN DE EXISTENCIAS
```

Este documento debe leerse junto con:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
05-data-model-decisions.md
```

---

# 2. Principio fundamental

El inventario representa las existencias disponibles de los recursos y productos que forman parte de la operación del negocio.

Las existencias no deben cambiar directamente sin que exista una causa identificable.

Por tanto:

```text
INCORRECTO

Modificar cantidad disponible
        ↓
Sin registrar el motivo
```

La lógica correcta es:

```text
CAUSA DE NEGOCIO
        ↓
REGISTRO DEL MOVIMIENTO
        ↓
ACTUALIZACIÓN DEL INVENTARIO
```

Cada cambio debe poder responder:

```text
¿Qué cambió?

¿Cuánto cambió?

¿Por qué cambió?

¿Cuándo cambió?

¿Qué operación produjo el cambio?
```

---

# 3. Modelo general del flujo

El flujo general del inventario se representa así:

```text
COMPRAS
    │
    ▼
ENTRADA DE INSUMOS
    │
    ▼
INVENTARIO DE INSUMOS
    │
    │
    ▼
PRODUCCIÓN
    │
    ├── Salida de insumos
    │
    └── Generación de producto terminado
                │
                ▼
              LOTE
                │
                ▼
INVENTARIO DE PRODUCTO TERMINADO
                │
                ▼
              VENTA
                │
                ▼
SALIDA DE PRODUCTO TERMINADO
```

Este flujo conecta los módulos:

```text
Purchases
    ↓
Inventory
    ↓
Production
    ↓
Lots
    ↓
Inventory
    ↓
Sales
```

---

# 4. Inventario de insumos

Los insumos son recursos utilizados para elaborar los productos.

Ejemplos conceptuales:

```text
Yogurt

Leche

Frutas

Azúcar

Envases

Tapas

Etiquetas

Otros materiales necesarios
para la producción
```

Cada insumo posee una unidad de control definida en su configuración.

El inventario debe respetar esa unidad.

No se debe registrar una cantidad sin conocer la unidad que representa.

Ejemplo:

```text
Insumo:
Azúcar

Cantidad:
10

Unidad:
Kilogramos
```

La cantidad:

```text
10
```

por sí sola no representa información suficiente.

---

# 5. Entrada de inventario por compras

Una compra representa la adquisición de uno o varios insumos.

La estructura conceptual es:

```text
Compra
    │
    ├── Proveedor
    │
    └── Detalles de compra
            │
            ├── Insumo
            ├── Cantidad
            ├── Unidad
            └── Información económica
```

Cuando una compra se registra como una operación válida dentro del sistema, sus detalles generan entradas de inventario.

El flujo conceptual es:

```text
COMPRA
    ↓
DETALLE DE COMPRA
    ↓
ENTRADA DE INVENTARIO
```

Cada detalle representa una cantidad específica de un insumo.

Por tanto, una compra puede generar:

```text
Compra
    │
    ├── Entrada de Insumo A
    │
    ├── Entrada de Insumo B
    │
    └── Entrada de Insumo C
```

---

# 6. Relación entre compra e inventario

La compra no debe modificar una cantidad de inventario de forma invisible.

Debe existir trazabilidad entre:

```text
Compra
        ↓
Detalle de compra
        ↓
Movimiento de inventario
```

El sistema debe poder responder posteriormente:

```text
¿De dónde provino esta entrada?
```

La respuesta debe poder identificar la operación de compra correspondiente.

La compra es la causa de negocio.

El movimiento es la representación del cambio producido en inventario.

---

# 7. Producción como salida de insumos

La producción utiliza insumos previamente disponibles.

Por tanto, una producción genera salidas de inventario para los recursos realmente consumidos.

El flujo conceptual es:

```text
PRODUCCIÓN
        ↓
DETALLE DE PRODUCCIÓN
        ↓
SALIDA DE INVENTARIO DE INSUMOS
```

Ejemplo conceptual:

```text
Producción

↓ consume

Yogurt:
10 litros

Fruta:
3 kilogramos

Envases:
50 unidades

Tapas:
50 unidades
```

Cada consumo debe producir el cambio correspondiente en las existencias.

---

# 8. La receta no modifica el inventario directamente

La receta representa una definición de composición.

Ejemplo:

```text
Producto A

Para producir determinada cantidad:

Yogurt:
X cantidad

Fruta:
Y cantidad

Azúcar:
Z cantidad
```

La receta por sí sola no representa una salida de inventario.

Por tanto:

```text
RECETA
    ↓
NO GENERA MOVIMIENTO
```

El movimiento ocurre cuando existe una operación real de producción.

La relación correcta es:

```text
RECETA
    ↓
Define la composición esperada

PRODUCCIÓN
    ↓
Registra el proceso realizado
    ↓
Genera movimientos de inventario
```

---

# 9. Producción y detalle de producción

La producción representa la operación principal.

El detalle de producción representa los elementos utilizados o producidos dentro de esa operación.

La estructura conceptual es:

```text
Producción
    │
    ├── Información general del proceso
    │
    └── Detalle de producción
            │
            ├── Insumos utilizados
            └── Cantidades utilizadas
```

Cuando la lógica del proceso confirme el consumo real, el inventario debe reflejar dicho consumo mediante movimientos.

No se debe descontar inventario simplemente porque exista una receta.

El descuento corresponde a la operación de producción efectivamente registrada.

---

# 10. Disponibilidad antes de producir

Antes de confirmar una producción, el sistema debe validar la disponibilidad de los insumos requeridos.

Conceptualmente:

```text
PRODUCCIÓN SOLICITADA
        ↓
IDENTIFICAR INSUMOS NECESARIOS
        ↓
CONSULTAR DISPONIBILIDAD
        │
        ├── Disponible
        │       ↓
        │    Permitir operación
        │
        └── Insuficiente
                ↓
          Aplicar regla del proceso
```

El sistema no debe permitir que una operación produzca resultados incoherentes con las reglas de disponibilidad definidas.

La estrategia exacta para:

```text
inventario insuficiente
```

deberá respetar las reglas del módulo de producción y las restricciones de integridad correspondientes.

---

# 11. Producción como generación de producto terminado

La producción no solamente consume insumos.

También genera producto terminado.

El flujo conceptual completo es:

```text
INVENTARIO DE INSUMOS
        │
        ▼
    PRODUCCIÓN
        │
        ├── Consumo de insumos
        │
        └── Resultado de producción
                    │
                    ▼
                  LOTE
                    │
                    ▼
       PRODUCTO TERMINADO DISPONIBLE
```

La producción transforma recursos disponibles en producto terminado identificable.

---

# 12. El lote como unidad de trazabilidad

El producto terminado generado por una producción debe conservar una identidad trazable mediante el lote.

La relación conceptual es:

```text
PRODUCCIÓN
        ↓
GENERA
        ↓
LOTE
```

El lote permite identificar información específica sobre el resultado producido.

Como mínimo, el flujo debe conservar:

```text
Producción de origen

Producto

Fecha de creación del lote

Fecha de vencimiento

Cantidad inicial

Información necesaria para determinar
su disponibilidad
```

---

# 13. Entrada de producto terminado

Cuando una producción genera un lote válido, se produce una entrada correspondiente de producto terminado.

Conceptualmente:

```text
PRODUCCIÓN
        ↓
LOTE
        ↓
ENTRADA DE PRODUCTO TERMINADO
```

Esta entrada no representa una compra.

Su origen es:

```text
Producción
```

Por tanto, el sistema debe distinguir entre:

```text
Entrada por compra
```

y:

```text
Entrada por producción
```

aunque ambas produzcan un incremento de existencias.

---

# 14. Inventario de producto terminado y lotes

El producto terminado debe conservar su relación con el lote correspondiente.

No debe tratarse únicamente como:

```text
Producto A:
100 unidades
```

si el negocio necesita conocer:

```text
Producto A

Lote 001:
40 unidades

Lote 002:
35 unidades

Lote 003:
25 unidades
```

La disponibilidad debe poder relacionarse con los lotes existentes cuando sea necesario para garantizar:

* trazabilidad;
* control de vencimiento;
* identificación del origen;
* control de existencias;
* seguimiento de ventas.

---

# 15. Fecha de creación del lote

La fecha de creación del lote representa el momento en que el lote fue generado dentro del proceso de producción.

Debe quedar registrada como información histórica.

Conceptualmente:

```text
Producción
        ↓
Genera lote
        ↓
Fecha de creación registrada
```

Esta fecha no debe recalcularse posteriormente.

---

# 16. Fecha de vencimiento del lote

Cada lote debe registrar su fecha de vencimiento.

La fecha de vencimiento representa una propiedad histórica del lote.

Conceptualmente:

```text
LOTE
    │
    ├── Fecha de creación
    │
    └── Fecha de vencimiento
```

La disponibilidad del lote debe poder evaluarse considerando su fecha de vencimiento.

Una modificación posterior de configuraciones generales no debe modificar automáticamente la fecha ya registrada en un lote existente.

---

# 17. Venta como salida de producto terminado

La venta representa la salida comercial del producto terminado.

El flujo conceptual es:

```text
VENTA
        ↓
DETALLE DE VENTA
        ↓
SALIDA DE INVENTARIO
```

Cada detalle de venta representa una cantidad específica de producto vendida.

Cuando la trazabilidad por lote sea requerida para esa salida, la operación debe poder identificar el lote del cual proviene el producto.

---

# 18. La venta no elimina el historial del lote

Cuando un producto de un lote es vendido, la operación no elimina el lote.

El lote conserva su existencia histórica.

Conceptualmente:

```text
LOTE

Cantidad inicial:
100

Ventas:
- 20
- 30

Cantidad restante:
50
```

El lote sigue existiendo como parte de la historia del negocio.

La venta modifica la disponibilidad.

No elimina la trazabilidad.

---

# 19. Validación de disponibilidad antes de vender

Antes de confirmar una venta, el sistema debe verificar la disponibilidad del producto correspondiente.

Cuando la venta se relacione con un lote específico, también debe verificarse:

```text
Disponibilidad del lote

Estado del lote

Fecha de vencimiento
```

El flujo conceptual es:

```text
VENTA SOLICITADA
        ↓
IDENTIFICAR PRODUCTO
        ↓
IDENTIFICAR DISPONIBILIDAD
        ↓
VALIDAR REGLAS
        │
        ├── Válida
        │       ↓
        │    Registrar venta
        │       ↓
        │    Generar salida
        │
        └── Inválida
                ↓
          Rechazar operación
```

---

# 20. Lotes vencidos

Un lote vencido debe conservarse como parte del historial.

No debe desaparecer del sistema.

Conceptualmente:

```text
LOTE
    │
    ├── Disponible
    │
    ├── Agotado
    │
    └── Vencido
```

El tratamiento operativo de un lote vencido deberá respetar las reglas de inventario y trazabilidad definidas por el sistema.

Un lote vencido no debe poder considerarse automáticamente disponible para una venta.

---

# 21. Inventario actual

El inventario actual representa el resultado de las operaciones registradas.

Conceptualmente:

```text
ENTRADAS
        -
SALIDAS
        =
EXISTENCIA RESULTANTE
```

La cantidad visible actualmente debe poder relacionarse con los movimientos que produjeron ese resultado.

Ejemplo:

```text
Entradas:
100

Salidas:
35

Existencia:
65
```

El sistema debe poder reconstruir conceptualmente:

```text
100
-
35
=
65
```

---

# 22. Movimientos de inventario

Cada movimiento debe representar un cambio concreto.

Conceptualmente, un movimiento requiere información equivalente a:

```text
Identificador

Fecha

Elemento afectado

Tipo de movimiento

Cantidad

Unidad correspondiente

Operación de origen

Referencia necesaria para trazabilidad
```

La estructura técnica exacta será definida posteriormente.

Este documento establece únicamente la información funcional que debe poder conservarse.

---

# 23. Tipos conceptuales de movimiento

La lógica actual requiere distinguir, como mínimo:

```text
ENTRADAS

Entrada por compra

Entrada por producción
```

y:

```text
SALIDAS

Salida por consumo en producción

Salida por venta
```

Otros movimientos solo deben agregarse cuando exista una necesidad real del negocio y una decisión documentada.

No se deben crear tipos adicionales únicamente por anticipación.

---

# 24. Flujo completo: compra a producción

El proceso conceptual es:

```text
PROVEEDOR
        ↓
COMPRA
        ↓
DETALLE DE COMPRA
        ↓
ENTRADA DE INVENTARIO
        ↓
INSUMOS DISPONIBLES
        ↓
PRODUCCIÓN
        ↓
CONSUMO DE INSUMOS
        ↓
SALIDA DE INVENTARIO
```

Este flujo debe permitir responder:

```text
¿Qué insumos ingresaron?

¿En qué compra ingresaron?

¿Cuánto estaba disponible?

¿Cuánto fue utilizado?

¿En qué producción fue utilizado?
```

---

# 25. Flujo completo: producción a venta

El flujo conceptual es:

```text
PRODUCCIÓN
        ↓
RESULTADO PRODUCIDO
        ↓
LOTE
        ↓
ENTRADA DE PRODUCTO TERMINADO
        ↓
DISPONIBILIDAD
        ↓
VENTA
        ↓
DETALLE DE VENTA
        ↓
SALIDA DE PRODUCTO TERMINADO
```

Este flujo debe permitir responder:

```text
¿Qué producto fue producido?

¿En qué producción?

¿En qué lote quedó registrado?

¿Cuándo fue creado?

¿Cuándo vence?

¿Cuánto producto había inicialmente?

¿Cuánto producto fue vendido?

¿Cuánto permanece disponible?
```

---

# 26. Responsabilidad de cada módulo

La responsabilidad se distribuye conceptualmente de la siguiente manera:

```text
SUPPLIES
    ↓
Define los insumos y sus propiedades maestras.
```

```text
PURCHASES
    ↓
Registra las compras y sus detalles.
```

```text
INVENTORY
    ↓
Registra y representa los movimientos
y existencias resultantes.
```

```text
RECIPES
    ↓
Define la composición requerida
para elaborar productos.
```

```text
PRODUCTION
    ↓
Registra la transformación de insumos
en producto terminado.
```

```text
LOTS
    ↓
Conserva la identidad y trazabilidad
del producto generado.
```

```text
SALES
    ↓
Registra la salida comercial
del producto vendido.
```

Ningún módulo debe asumir responsabilidades que pertenecen claramente a otro.

---

# 27. Flujo de responsabilidad

La secuencia conceptual es:

```text
PURCHASES
    │
    │ confirma adquisición
    ▼
INVENTORY
    │
    │ registra entrada
    ▼
DISPONIBILIDAD DE INSUMOS
    │
    ▼
PRODUCTION
    │
    │ consume insumos
    ▼
INVENTORY
    │
    │ registra salida
    ▼
PRODUCTION
    │
    │ genera resultado
    ▼
LOTS
    │
    ▼
INVENTORY
    │
    │ registra disponibilidad
    ▼
SALES
    │
    ▼
INVENTORY
    │
    │ registra salida
    ▼
DISPONIBILIDAD RESULTANTE
```

La implementación técnica podrá utilizar servicios, transacciones o mecanismos de coordinación diferentes.

Sin embargo, las responsabilidades funcionales deben mantenerse.

---

# 28. El inventario no decide la lógica de negocio de origen

El módulo de inventario registra y representa cambios de existencias.

No debe convertirse en responsable de decidir:

```text
Qué proveedor utilizar

Qué receta utilizar

Cómo planificar una producción

Qué producto vender

Cómo calcular una venta
```

El módulo de origen es responsable de su propia operación.

Inventario responde al cambio que dicha operación genera.

---

# 29. Una operación debe evitar generar movimientos duplicados

Un mismo evento de negocio no debe producir múltiples movimientos equivalentes por error.

Ejemplo incorrecto:

```text
Registrar compra
        ↓
Entrada +10

Reintentar operación
        ↓
Entrada +10 nuevamente
```

Resultado incorrecto:

```text
Existencia esperada:
10

Existencia registrada:
20
```

La implementación deberá garantizar que la confirmación de una operación no genere movimientos duplicados.

La estrategia técnica específica será definida durante la implementación.

---

# 30. Consistencia entre operación e inventario

Una operación que genera movimientos debe mantener consistencia con dichos movimientos.

Ejemplo conceptual:

```text
Compra confirmada
        ↓
Movimiento de entrada registrado
```

No debe quedar permanentemente una situación como:

```text
Compra confirmada
        ↓
Sin movimiento correspondiente
```

o:

```text
Movimiento registrado
        ↓
Sin operación de origen identificable
```

Las operaciones y sus consecuencias en inventario deben conservar coherencia.

---

# 31. Confirmación de operaciones

Las operaciones que afecten inventario deben distinguir conceptualmente entre:

```text
Información en preparación
```

y:

```text
Operación confirmada
```

No toda información ingresada preliminarmente debe modificar inmediatamente las existencias.

La modificación del inventario debe ocurrir en el momento definido por cada proceso como:

```text
confirmación

registro definitivo

ejecución
```

según corresponda.

La definición concreta de los estados de cada proceso se establecerá en los documentos de proceso correspondientes.

---

# 32. Correcciones y ajustes

No se establece en este documento que una cantidad pueda modificarse directamente para corregir un error.

Una corrección debe preservar la trazabilidad.

El flujo general será:

```text
ERROR IDENTIFICADO
        ↓
IDENTIFICAR OPERACIÓN O MOVIMIENTO
        ↓
APLICAR MECANISMO DE CORRECCIÓN
        ↓
CONSERVAR HISTORIAL
```

Los mecanismos específicos de:

```text
anulación

reversión

ajuste

corrección
```

serán definidos cuando los procesos correspondientes requieran su implementación.

No deben introducirse todavía como estructuras técnicas sin necesidad real.

---

# 33. Relación entre inventario y costos

El inventario participa en la información necesaria para los cálculos de costos.

Sin embargo, el módulo de inventario no debe asumir automáticamente toda la responsabilidad de cálculo económico.

La separación conceptual es:

```text
INVENTORY
    ↓
Conserva cantidades y movimientos

COSTS
    ↓
Utiliza información relevante
para determinar costos
```

La metodología específica para calcular costos será definida en:

```text
09-calculation-responsibilities.md
```

---

# 34. Relación entre inventario y rentabilidad

La disponibilidad física de un producto no representa por sí misma su rentabilidad.

La rentabilidad requiere información adicional relacionada con:

```text
Ventas

Costos

Gastos

Otros valores definidos por las reglas del negocio
```

Por tanto:

```text
INVENTORY
≠
PROFITABILITY
```

Inventario proporciona información sobre existencias y movimientos.

Rentabilidad analiza resultados económicos.

---

# 35. Información que debe permanecer trazable

El flujo completo debe permitir conservar, cuando corresponda, relaciones como:

```text
Proveedor
    ↓
Compra
    ↓
Detalle de compra
    ↓
Movimiento de entrada
    ↓
Disponibilidad de insumo
    ↓
Producción
    ↓
Consumo registrado
    ↓
Lote generado
    ↓
Disponibilidad de producto terminado
    ↓
Venta
    ↓
Salida registrada
```

No todas estas relaciones deben implementarse mediante una única cadena técnica directa.

La implementación física deberá respetar la responsabilidad de cada entidad.

El requisito es que la historia pueda reconstruirse a partir de los registros disponibles.

---

# 36. Reglas fundamentales del flujo

Se consideran reglas base:

```text
1. Ninguna existencia debe cambiar sin una causa identificable.

2. Las compras generan entradas de inventario.

3. Una receta no genera movimientos por sí sola.

4. La producción consume insumos.

5. El consumo de producción genera salidas de inventario.

6. La producción genera producto terminado.

7. El producto terminado debe poder relacionarse
   con su lote cuando corresponda.

8. Cada lote conserva su producción de origen.

9. Cada lote conserva su fecha de creación.

10. Cada lote conserva su fecha de vencimiento.

11. Las ventas generan salidas de producto terminado.

12. Un lote vendido parcialmente conserva
    su historial y trazabilidad.

13. Un lote vencido permanece en el historial.

14. Un lote vencido no debe considerarse disponible
    para una venta.

15. Una operación confirmada no debe generar
    movimientos duplicados.

16. Los movimientos deben poder relacionarse
    con su causa de negocio.

17. Las correcciones no deben destruir
    la trazabilidad histórica.

18. Inventario no reemplaza la responsabilidad
    de los módulos que originan las operaciones.
```

---

# 37. Estado actual de definición

Este documento define el flujo funcional y conceptual del inventario.

Todavía no define:

```text
Estructura exacta de las tablas.

Columnas definitivas.

Tipos de datos.

Enums técnicos.

Foreign keys concretas.

Índices.

Triggers.

Transacciones SQL.

Implementación con Prisma.

Implementación con NestJS.

Mecanismos técnicos de concurrencia.

Estrategia técnica de bloqueo de inventario.

Mecanismos definitivos de reversión o ajuste.
```

Estas decisiones deberán tomarse posteriormente.

Cualquier implementación técnica deberá respetar el flujo y las responsabilidades definidos aquí.

---

# 38. Principio final

El inventario debe poder explicar su propio estado.

La pregunta fundamental es:

```text
¿Por qué existe esta cantidad?
```

El sistema debe poder reconstruir la respuesta mediante operaciones y movimientos.

El principio definitivo es:

```text
OPERACIÓN REAL
        ↓
MOVIMIENTO REGISTRADO
        ↓
CAMBIO TRAZABLE
        ↓
EXISTENCIA RESULTANTE
```

> **El inventario no es una cifra que se modifica. Es el resultado trazable de las operaciones reales del negocio.**
