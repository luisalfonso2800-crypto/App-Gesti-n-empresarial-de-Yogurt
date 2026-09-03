# 09 — CALCULATION RESPONSIBILITIES

## 1. Propósito del documento

Este documento define qué módulo es responsable de cada cálculo dentro del sistema y establece los límites entre:

* datos registrados;
* datos derivados;
* cálculos operativos;
* cálculos económicos;
* indicadores;
* resultados analíticos.

Su objetivo es evitar que una misma fórmula sea implementada de manera diferente en varios módulos y que existan múltiples resultados para un mismo concepto.

La regla general es:

> **Cada cálculo debe tener una responsabilidad funcional claramente definida.**

Este documento define quién es responsable conceptualmente de cada cálculo.

No define todavía:

* fórmulas SQL;
* consultas Prisma;
* servicios de NestJS;
* procedimientos almacenados;
* cálculos específicos del frontend;
* implementación técnica definitiva.

Debe leerse junto con:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
05-data-model-decisions.md
06-inventory-flow.md
07-business-processes.md
08-cross-module-rules.md
```

---

# 2. Principio de responsabilidad única de cálculo

Un cálculo no debe existir simultáneamente como lógica independiente en múltiples módulos.

Incorrecto:

```text
Sales calcula una disponibilidad.

Inventory calcula otra disponibilidad.

Dashboard calcula una tercera disponibilidad.
```

Correcto:

```text
Inventory
        ↓
Fuente responsable
        ↓
Disponibilidad
        ↓
Otros módulos consultan
el resultado o la lógica autorizada.
```

La regla es:

> **El módulo propietario de un concepto es responsable de la lógica principal utilizada para calcular ese concepto.**

Otros módulos pueden consumir el resultado.

No deben reimplementar arbitrariamente la misma lógica.

---

# 3. Clasificación general de cálculos

Los cálculos del sistema se clasifican en cuatro grupos.

```text
1. Cálculos de disponibilidad

2. Cálculos operativos

3. Cálculos económicos

4. Indicadores y análisis
```

La clasificación permite identificar dónde debe vivir cada responsabilidad.

---

# 4. Datos registrados y datos calculados

El sistema debe distinguir claramente entre:

```text
DATO REGISTRADO
```

y:

```text
DATO CALCULADO
```

Ejemplo de dato registrado:

```text
Cantidad comprada
Precio pagado
Cantidad producida
Cantidad vendida
Valor de un gasto
Valor de un pago
Fecha de vencimiento
```

Ejemplo de dato calculado:

```text
Existencia disponible
Saldo pendiente
Costo total
Costo unitario
Ingresos
Margen
Rentabilidad
Indicadores del dashboard
```

La regla general es:

> **Los cálculos deben derivarse de datos registrados o de otros resultados oficialmente definidos.**

No deben convertirse automáticamente en una nueva fuente independiente de verdad.

---

# 5. Responsabilidad del módulo Inventory

El módulo `Inventory` es responsable de los cálculos relacionados con existencias y disponibilidad.

Conceptualmente:

```text
ENTRADAS
        -
SALIDAS
        =
EXISTENCIA RESULTANTE
```

La responsabilidad principal incluye determinar:

```text
Cantidad disponible

Cantidad de entrada

Cantidad de salida

Existencia resultante
```

Cuando corresponda, también debe permitir conocer la disponibilidad relacionada con:

```text
Insumos

Productos terminados

Lotes
```

Otros módulos pueden consultar esta información.

Por ejemplo:

```text
Production
        ↓
Consulta disponibilidad
de insumos
```

```text
Sales
        ↓
Consulta disponibilidad
de producto o lote
```

Production y Sales no deben implementar una segunda lógica independiente para calcular existencias.

---

# 6. Cálculo de disponibilidad de insumos

La disponibilidad de un insumo depende de los movimientos que afecten su existencia.

Conceptualmente:

```text
ENTRADAS DE INSUMOS
        -
SALIDAS DE INSUMOS
        =
DISPONIBILIDAD
```

Las entradas pueden provenir principalmente de:

```text
Compras confirmadas
```

Las salidas pueden provenir principalmente de:

```text
Producción confirmada
```

La disponibilidad debe reflejar las operaciones realmente registradas.

Una receta no debe afectar la disponibilidad porque representa únicamente una definición.

---

# 7. Cálculo de disponibilidad de producto terminado

La disponibilidad de producto terminado depende de las operaciones que produzcan o retiren existencias.

Conceptualmente:

```text
PRODUCTO TERMINADO GENERADO
        -
PRODUCTO TERMINADO RETIRADO
        =
DISPONIBILIDAD
```

Las principales entradas pueden provenir de:

```text
Producción
```

Las principales salidas pueden provenir de:

```text
Ventas
```

Cuando exista control por lote, la disponibilidad debe poder analizarse dentro del contexto del lote correspondiente.

---

# 8. Responsabilidad del módulo Recipes

El módulo `Recipes` es responsable de calcular la composición requerida para una receta.

Conceptualmente:

```text
CANTIDAD OBJETIVO
        ×
CANTIDAD REQUERIDA POR RECETA
        =
REQUERIMIENTO DE INSUMO
```

El módulo debe poder determinar, según la definición de la receta:

```text
Qué insumos se requieren.

Qué cantidad de cada insumo se necesita.

Qué requerimiento resulta para
una cantidad determinada de producción.
```

Este cálculo representa un requerimiento teórico.

No representa necesariamente el consumo real.

Por tanto:

```text
RECETA
        ↓
CÁLCULO TEÓRICO
```

mientras que:

```text
PRODUCCIÓN
        ↓
CONSUMO REAL REGISTRADO
```

Ambos conceptos deben permanecer separados.

---

# 9. Responsabilidad del módulo Production

El módulo `Production` es responsable de los cálculos relacionados con la ejecución de la producción.

Esto puede incluir:

```text
Cantidad planificada

Cantidad requerida de insumos

Cantidad realmente utilizada

Cantidad realmente producida
```

Production puede utilizar la definición de Recipes para obtener una estimación inicial.

Sin embargo, debe conservar la diferencia entre:

```text
REQUERIDO SEGÚN RECETA
```

y:

```text
UTILIZADO EN LA PRODUCCIÓN REAL
```

La producción no debe asumir que ambos valores son siempre iguales.

---

# 10. Cálculo de consumo real

El consumo real se obtiene de los insumos registrados como utilizados durante una producción.

Conceptualmente:

```text
DETALLE DE PRODUCCIÓN
        ↓
INSUMO UTILIZADO
        +
CANTIDAD UTILIZADA
        ↓
CONSUMO REAL
```

Este valor pertenece al contexto histórico de la producción.

Una modificación posterior de la receta no debe modificar automáticamente el consumo real registrado.

---

# 11. Cálculo de rendimiento de producción

El sistema puede calcular el rendimiento comparando:

```text
Cantidad planificada
```

con:

```text
Cantidad realmente producida
```

Conceptualmente:

```text
CANTIDAD REAL PRODUCIDA
        ÷
CANTIDAD PLANIFICADA
        =
INDICADOR DE RENDIMIENTO
```

Este cálculo representa un indicador operativo.

No modifica la producción histórica.

La fórmula exacta y los casos especiales deberán definirse cuando se establezca la lógica detallada de producción.

---

# 12. Responsabilidad del módulo Lots

El módulo `Lots` es responsable de los cálculos y evaluaciones relacionados con la vigencia del lote.

El lote conserva:

```text
Fecha de creación

Fecha de vencimiento
```

A partir de estas fechas puede determinarse:

```text
Estado temporal del lote
```

Conceptualmente:

```text
FECHA ACTUAL
        │
        ├── Antes de vencimiento
        │       ↓
        │   Lote vigente
        │
        └── Fecha igual o posterior
                según regla definitiva
                ↓
            Lote vencido
```

La definición exacta del momento de vencimiento deberá establecerse como una regla específica del módulo Lots.

---

# 13. Cálculo de disponibilidad por lote

Cuando exista control de producto terminado por lote, la disponibilidad del lote debe derivarse de:

```text
Cantidad inicial del lote
        +
Entradas posteriores autorizadas
        -
Salidas registradas
        =
Disponibilidad del lote
```

La responsabilidad de la disponibilidad sigue perteneciendo al módulo `Inventory`.

El módulo `Lots` conserva la identidad y trazabilidad del lote.

Por tanto:

```text
LOTS
        ↓
Identidad y ciclo temporal
```

```text
INVENTORY
        ↓
Disponibilidad
```

No deben existir dos cálculos independientes de cantidad disponible.

---

# 14. Responsabilidad del módulo Sales

El módulo `Sales` es responsable de calcular los valores propios de la operación comercial.

Esto incluye conceptualmente:

```text
Cantidad vendida

Precio unitario registrado

Subtotal de cada detalle

Valor total de la venta
```

La estructura conceptual es:

```text
CANTIDAD
        ×
PRECIO UNITARIO
        =
SUBTOTAL
```

Luego:

```text
SUMA DE SUBTOTALES
        =
VALOR TOTAL DE LA VENTA
```

El precio utilizado en una venta debe representar el valor registrado para esa operación.

Una modificación posterior del precio comercial no debe reinterpretar automáticamente una venta histórica.

---

# 15. Responsabilidad del módulo Payments

El módulo `Payments` es responsable de registrar los valores pagados y permitir determinar el cumplimiento económico asociado a una venta.

Conceptualmente:

```text
VALOR TOTAL DE LA VENTA
        -
SUMA DE PAGOS REGISTRADOS
        =
SALDO PENDIENTE
```

La información necesaria proviene de:

```text
Sales
        +
Payments
```

La regla funcional establece:

```text
Sales
        ↓
Propietario de la venta
```

```text
Payments
        ↓
Propietario de los pagos registrados
```

El saldo es un resultado derivado de ambas responsabilidades.

La ubicación técnica definitiva de este cálculo deberá respetar esa separación.

---

# 16. Estado económico de una venta

A partir de:

```text
Valor total

Pagos registrados

Saldo pendiente
```

puede determinarse un estado económico conceptual.

Por ejemplo:

```text
Sin pagos

Pago parcial

Pago completo
```

Estos estados deben derivarse de la información registrada.

No deben convertirse en una fuente independiente que contradiga los pagos históricos.

La definición técnica de los estados deberá establecerse cuando se diseñe el proceso detallado de ventas y pagos.

---

# 17. Responsabilidad del módulo Purchases

El módulo `Purchases` es responsable de los cálculos económicos propios de una compra.

Cada detalle puede determinar:

```text
Cantidad adquirida

Valor unitario registrado

Valor total del detalle
```

Conceptualmente:

```text
CANTIDAD
        ×
VALOR UNITARIO
        =
VALOR DEL DETALLE
```

Luego:

```text
SUMA DE DETALLES
        =
VALOR TOTAL DE LA COMPRA
```

El precio registrado representa el valor histórico de esa adquisición.

Los cambios posteriores en precios de referencia no deben modificar este cálculo histórico.

---

# 18. Responsabilidad del módulo Costs

El módulo `Costs` es responsable de los cálculos relacionados con el costo de productos y procesos.

Puede utilizar información proveniente de:

```text
Compras

Insumos

Recetas

Producción

Inventario

Productos
```

Sin embargo, la metodología exacta debe respetar una regla fundamental:

> **Un costo calculado debe poder explicar de qué información proviene.**

Por tanto, cualquier cálculo de costo debe mantener una relación conceptual con:

```text
Costo de los insumos

Cantidad utilizada

Producción realizada

Resultado obtenido
```

El módulo Costs no debe modificar los datos originales de compras o producción para obtener un resultado.

---

# 19. Costo de los insumos

El sistema deberá determinar el costo aplicable a los insumos utilizados en los procesos.

La fuente principal de información proviene de las compras históricas y de la metodología de valoración de inventario que se defina oficialmente.

Conceptualmente:

```text
COMPRAS HISTÓRICAS
        ↓
VALORACIÓN DEL INSUMO
        ↓
COSTO APLICABLE
```

Este documento no establece todavía si la valoración será:

```text
Costo promedio

FIFO

Otra metodología
```

La metodología debe definirse explícitamente antes de implementar los cálculos definitivos de costos.

Hasta que esa decisión exista, ningún módulo debe asumir una metodología por defecto.

---

# 20. Costo de producción

El costo de una producción debe derivarse de la información relacionada con los recursos realmente utilizados.

Conceptualmente:

```text
INSUMOS UTILIZADOS
        ↓
COSTO APLICABLE
        ↓
SUMA DE COSTOS
        =
COSTO TOTAL DE PRODUCCIÓN
```

A partir de la cantidad realmente obtenida puede determinarse:

```text
COSTO TOTAL DE PRODUCCIÓN
        ÷
CANTIDAD RESULTANTE
        =
COSTO UNITARIO RESULTANTE
```

La definición exacta de:

```text
Cantidad base

Unidad de cálculo

Redondeos

Pérdidas

Merma
```

deberá establecerse como parte de la lógica detallada del módulo Costs y Production.

---

# 21. Responsabilidad del módulo Expenses

El módulo `Expenses` es responsable de los cálculos propios de cada gasto registrado.

Conceptualmente, un gasto representa:

```text
VALOR ECONÓMICO
        +
FECHA
        +
CLASIFICACIÓN O CONTEXTO
```

El módulo puede permitir:

```text
Total de gastos por período

Total por categoría

Total por criterio de consulta autorizado
```

Los gastos históricos no deben ser recalculados utilizando información ajena que modifique el valor originalmente registrado.

---

# 22. Responsabilidad del módulo Profitability

El módulo `Profitability` es responsable de los cálculos analíticos relacionados con el resultado económico.

Puede utilizar:

```text
Ingresos provenientes de ventas

Costos calculados

Gastos registrados
```

La relación conceptual general es:

```text
INGRESOS
        -
COSTOS
        =
RESULTADO BRUTO
```

Y posteriormente:

```text
RESULTADO BRUTO
        -
GASTOS
        =
RESULTADO NETO
```

A partir de estos valores pueden obtenerse indicadores de análisis.

El módulo Profitability no es propietario de:

```text
Ventas

Compras

Producciones

Pagos

Gastos
```

Es propietario de la lógica de análisis económico que utiliza esos datos.

---

# 23. Margen y rentabilidad

El sistema podrá calcular indicadores como:

```text
Margen bruto

Resultado bruto

Resultado neto

Rentabilidad
```

Sin embargo, estos conceptos no deben implementarse utilizando fórmulas diferentes en distintos lugares.

La fórmula oficial de cada indicador deberá estar definida en una única responsabilidad.

Por ejemplo:

```text
Profitability
        ↓
Define y calcula
los indicadores económicos
```

El Dashboard debe consumir los resultados definidos.

No debe crear fórmulas alternativas para representar el mismo indicador.

---

# 24. Responsabilidad del Dashboard

El módulo `Dashboard` puede mostrar cálculos e indicadores provenientes de otros módulos.

Sin embargo, su responsabilidad principal es:

```text
CONSULTAR
        ↓
AGREGAR
        ↓
PRESENTAR
```

No debe convertirse en el propietario de la lógica principal de:

```text
Inventario

Costos

Rentabilidad

Ventas

Pagos
```

Ejemplo correcto:

```text
Costs
        ↓
Costo calculado
        ↓
Dashboard muestra resultado
```

Ejemplo incorrecto:

```text
Dashboard
        ↓
Reimplementa toda la lógica
de costos únicamente
para mostrar un indicador.
```

---

# 25. Cálculos históricos

Los cálculos relacionados con operaciones históricas deben respetar la información existente en el momento de la operación.

Ejemplo:

```text
COMPRA
        ↓
Precio histórico registrado
```

No debe ser reinterpretada automáticamente utilizando:

```text
Precio actual del proveedor.
```

Otro ejemplo:

```text
VENTA
        ↓
Precio registrado
```

No debe modificarse automáticamente porque el producto cambió de precio posteriormente.

La regla es:

> **Los cambios futuros no deben alterar automáticamente la interpretación económica de un hecho histórico.**

---

# 26. Cálculos en tiempo real

Algunos resultados pueden calcularse utilizando la información disponible en el momento de la consulta.

Ejemplos:

```text
Existencia actual

Saldo pendiente actual

Cantidad disponible

Indicadores del período seleccionado
```

Estos cálculos representan el estado resultante de los datos existentes en ese momento.

Por tanto:

```text
CÁLCULO HISTÓRICO
```

y:

```text
CÁLCULO ACTUAL
```

no deben confundirse.

Un resultado histórico puede requerir información congelada o preservada.

Un resultado actual puede recalcularse utilizando las operaciones existentes.

---

# 27. Cálculos derivados no almacenados prematuramente

Un cálculo no debe almacenarse automáticamente como dato persistente si puede obtenerse de manera confiable a partir de su fuente de verdad.

Antes de almacenar un resultado calculado, debe evaluarse:

```text
¿Se necesita preservar el valor histórico exacto?

¿El cálculo puede cambiar si cambian datos posteriores?

¿Es costoso calcularlo repetidamente?

¿Es necesario para rendimiento?

¿Existe riesgo de inconsistencias?
```

Solo después de esta evaluación puede justificarse almacenar un resultado derivado.

La existencia de una fórmula no es suficiente motivo para crear una nueva fuente de datos persistente.

---

# 28. Cálculos y redondeos

Los cálculos económicos y de cantidades pueden requerir reglas de precisión y redondeo.

Estas reglas no deben definirse de forma diferente dentro de cada módulo.

Antes de implementar cálculos monetarios definitivos se deberá establecer:

```text
Precisión monetaria

Precisión de cantidades

Reglas de redondeo

Momento del redondeo

Unidad base de cálculo
```

Estas decisiones deberán convertirse en reglas técnicas compartidas únicamente cuando exista una necesidad real de reutilización.

---

# 29. Orden de responsabilidad de cálculo

El flujo conceptual de responsabilidades es:

```text
DATOS MAESTROS
        ↓
Definen conceptos
```

```text
OPERACIONES
        ↓
Registran hechos
```

```text
INVENTARIO
        ↓
Determina disponibilidad
```

```text
COSTOS
        ↓
Determina valores económicos
de producción y recursos
```

```text
SALES
        ↓
Determina ingresos comerciales
```

```text
PAYMENTS
        ↓
Registra cumplimiento económico
```

```text
EXPENSES
        ↓
Registra gastos
```

```text
PROFITABILITY
        ↓
Analiza resultados económicos
```

```text
DASHBOARD
        ↓
Presenta indicadores
```

---

# 30. Matriz de responsabilidades

| Concepto calculado               | Módulo responsable                     |
| -------------------------------- | -------------------------------------- |
| Existencia de insumos            | Inventory                              |
| Existencia de producto terminado | Inventory                              |
| Disponibilidad por lote          | Inventory                              |
| Requerimiento teórico de insumos | Recipes                                |
| Cantidad planificada             | Production                             |
| Consumo real de insumos          | Production                             |
| Cantidad producida               | Production                             |
| Rendimiento de producción        | Production                             |
| Vigencia del lote                | Lots                                   |
| Subtotal de compra               | Purchases                              |
| Total de compra                  | Purchases                              |
| Subtotal de venta                | Sales                                  |
| Total de venta                   | Sales                                  |
| Pagos registrados                | Payments                               |
| Saldo pendiente                  | Derivado de Sales y Payments           |
| Costo aplicable de insumos       | Costs                                  |
| Costo total de producción        | Costs                                  |
| Costo unitario de producción     | Costs                                  |
| Total de gastos                  | Expenses                               |
| Ingresos                         | Sales                                  |
| Resultado bruto                  | Profitability                          |
| Resultado neto                   | Profitability                          |
| Margen y rentabilidad            | Profitability                          |
| Indicadores visuales             | Dashboard consume resultados oficiales |

---

# 31. Regla de evolución de nuevos cálculos

Cuando aparezca un nuevo cálculo, no debe implementarse inmediatamente en el primer módulo que lo necesite.

Debe seguirse este proceso:

```text
NUEVO CÁLCULO
        ↓
¿QUÉ CONCEPTO REPRESENTA?
        ↓
¿EXISTE UN MÓDULO PROPIETARIO?
        │
        ├── SÍ
        │       ↓
        │   Evaluar si pertenece
        │   a ese módulo
        │
        └── NO
                ↓
        Evaluar nueva responsabilidad
```

Después:

```text
¿EL RESULTADO ES UN HECHO
O UN DATO DERIVADO?
        │
        ├── HECHO
        │       ↓
        │   Debe registrarse
        │
        └── DERIVADO
                ↓
        Definir si se calcula
        en tiempo real o si debe
        preservarse explícitamente
```

Finalmente:

```text
DEFINIR RESPONSABLE
        ↓
DOCUMENTAR
        ↓
IMPLEMENTAR
```

---

# 32. Regla final

La responsabilidad de cálculo dentro del sistema debe seguir esta secuencia:

```text
HECHO REGISTRADO
        ↓
FUENTE DE VERDAD
        ↓
MÓDULO RESPONSABLE
        ↓
CÁLCULO OFICIAL
        ↓
OTROS MÓDULOS CONSUMEN
EL RESULTADO
```

En consecuencia:

> **Ningún módulo debe crear una segunda versión de un cálculo cuyo concepto ya tiene un responsable definido. Los datos operativos registran hechos; los módulos responsables generan los cálculos oficiales; los módulos analíticos y de presentación consumen esos resultados sin duplicar la lógica de negocio.**
