# Producción

## Propósito del módulo

El módulo de Producción registra y controla el proceso mediante el cual los insumos definidos en una receta se transforman en producto terminado.

Su responsabilidad principal es representar el ciclo completo de una producción:

```text
PLANIFICACIÓN
      ↓
DEFINICIÓN DE CANTIDAD A PRODUCIR
      ↓
OBTENCIÓN DE REQUERIMIENTOS TEÓRICOS
      ↓
PREPARACIÓN / EJECUCIÓN
      ↓
REGISTRO DEL CONSUMO REAL DE INSUMOS
      ↓
REGISTRO DE LA CANTIDAD REAL PRODUCIDA
      ↓
GENERACIÓN DEL PRODUCTO TERMINADO
      ↓
CREACIÓN DEL LOTE
      ↓
ACTUALIZACIÓN DEL INVENTARIO
```

El módulo de Producción es un módulo operativo y no un simple CRUD.

Una producción representa un proceso de negocio que relaciona:

* Producto.
* Receta.
* Insumos.
* Inventario.
* Cantidades teóricas.
* Cantidades reales utilizadas.
* Costos.
* Resultado real de producción.
* Fecha de vencimiento.
* Lote generado.

La estructura original del sistema VBA contempla una tabla principal de producción y una tabla de detalle de producción. 

---

# 1. Responsabilidad del módulo

El módulo de Producción debe administrar exclusivamente el proceso de producción.

Debe permitir:

* Planificar una producción.
* Registrar el producto que se desea producir.
* Definir la cantidad planificada.
* Obtener los insumos requeridos según la receta.
* Calcular las cantidades teóricas necesarias.
* Registrar las cantidades reales utilizadas.
* Registrar diferencias entre lo planificado y lo realmente utilizado.
* Registrar la cantidad realmente producida.
* Registrar la fecha real de producción.
* Registrar la fecha de vencimiento del producto terminado.
* Crear o asociar el lote generado.
* Proporcionar la información necesaria para registrar los movimientos de inventario.
* Conservar el detalle histórico de lo que realmente ocurrió durante la producción.
* Consultar producciones anteriores y su estado.

El módulo no debe convertirse en el responsable directo de toda la lógica de Inventario, Lotes, Costos o Recetas.

Debe coordinar el proceso de producción utilizando las responsabilidades de los demás módulos.

---

# 2. Ubicación dentro del negocio

Dentro del mapa general del sistema, Producción pertenece a las operaciones principales:

```text
MAESTROS
│
├── Presentaciones
├── Insumos
├── Proveedores
├── Productos
└── Clientes

OPERACIONES
│
├── Compras
├── Producción
├── Ventas
├── Pagos
└── Gastos

CONSULTAS Y CONTROL
│
├── Inventario
├── Movimientos
├── Lotes
├── Costos
├── Rentabilidad
└── Dashboard
```

En la interfaz VBA original, Producción fue definida como una operación principal del negocio. 

---

# 3. Problema de negocio que resuelve

El negocio necesita saber con precisión:

* Qué producto se produjo.
* Cuándo se planificó la producción.
* Cuándo se realizó realmente.
* Cuánto se esperaba producir.
* Cuánto se produjo realmente.
* Qué insumos debían utilizarse.
* Cuántos insumos se utilizaron realmente.
* Qué diferencias existieron entre lo teórico y lo real.
* Cuál fue el costo teórico de la producción.
* Cuál fue el costo real.
* Qué lote fue generado.
* Cuándo vence el producto producido.
* Qué impacto tuvo la producción sobre el inventario.

Sin este módulo, el sistema tendría compras e inventario, pero no podría explicar correctamente cómo los insumos se transformaron en productos terminados.

---

# 4. Concepto principal: Producción

Una Producción representa una ejecución, planificada o realizada, para fabricar una cantidad determinada de un producto.

Conceptualmente:

```text
PRODUCCIÓN
│
├── ID
├── Fecha planificada
├── Fecha real de producción
├── Producto
├── Cantidad planificada
├── Cantidad producida real
├── Estado
├── Fecha de vencimiento
├── Lote generado
└── Observaciones
```

Una producción tiene identidad propia.

Una producción no es lo mismo que una receta.

La relación es:

```text
RECETA
   │
   │ define cómo debería producirse
   ▼
PRODUCCIÓN
   │
   │ registra cómo se produjo realmente
   ▼
RESULTADO REAL
```

La receta representa la definición o fórmula.

La producción representa un evento operativo real.

---

# 5. Tabla principal original

En el sistema VBA original, la estructura de producción fue definida mediante `tblProduccion`. 

Su estructura es:

| Campo                   | Significado                                 |
| ----------------------- | ------------------------------------------- |
| ID_Produccion           | Identificador único de la producción        |
| Fecha_Planificada       | Fecha prevista para realizar la producción  |
| Fecha_Produccion        | Fecha real en la que se realizó             |
| ID_Producto             | Producto que se produce                     |
| Cantidad_Planificada    | Cantidad que se esperaba producir           |
| Cantidad_Producida_Real | Cantidad realmente obtenida                 |
| Estado                  | Estado actual de la producción              |
| Fecha_Vencimiento       | Fecha de vencimiento del producto producido |
| ID_Lote                 | Lote generado o asociado                    |
| Observaciones           | Información adicional                       |

Esta estructura será la referencia inicial para reconstruir el modelo de datos.

No debe asumirse todavía que todos estos campos se trasladarán literalmente al modelo final de PostgreSQL sin revisar las relaciones entre módulos.

---

# 6. Detalle de Producción

Una Producción tiene múltiples líneas de detalle.

Cada línea representa un insumo involucrado en el proceso productivo.

Conceptualmente:

```text
PRODUCCIÓN
│
├── Detalle 1 → Insumo A
├── Detalle 2 → Insumo B
├── Detalle 3 → Insumo C
└── Detalle N → Insumo N
```

El detalle permite conservar la diferencia entre:

```text
LO QUE LA RECETA INDICABA
```

y:

```text
LO QUE REALMENTE SE UTILIZÓ
```

Esto es fundamental porque una producción real puede diferir de la formulación teórica.

---

# 7. Tabla de detalle original

En el sistema VBA original, el detalle de producción fue definido mediante `tblDetalleProduccion`. 

Su estructura es:

| Campo                   | Significado                                |
| ----------------------- | ------------------------------------------ |
| ID_Detalle_Produccion   | Identificador único del detalle            |
| ID_Produccion           | Producción a la que pertenece              |
| ID_Insumo               | Insumo utilizado                           |
| Cantidad_Teorica        | Cantidad calculada según la receta         |
| Cantidad_Real_Utilizada | Cantidad realmente utilizada               |
| Diferencia              | Diferencia entre cantidad teórica y real   |
| Unidad                  | Unidad utilizada para el registro          |
| Costo_Teorico           | Costo esperado del insumo en la producción |
| Costo_Real              | Costo real registrado                      |
| Observaciones           | Información adicional                      |

---

# 8. Relación entre Producto, Receta y Producción

La relación principal es:

```text
PRODUCTO
    │
    │ tiene
    ▼
RECETA
    │
    │ define
    ▼
INSUMOS + CANTIDADES BASE
    │
    │ se utilizan para planificar
    ▼
PRODUCCIÓN
    │
    │ registra
    ▼
CONSUMO REAL
```

La receta ya fue definida como una estructura de cabecera y detalle, donde cada receta pertenece a un producto y contiene los insumos requeridos para producirlo. 

Por lo tanto, el módulo de Producción debe consumir la información de Recetas, pero no debe modificar la definición de la receta como consecuencia de una producción.

La regla conceptual es:

```text
RECETA
=
DEFINICIÓN TEÓRICA

PRODUCCIÓN
=
EJECUCIÓN REAL
```

---

# 9. Escalado de cantidades

La receta tiene un rendimiento base.

Por ejemplo:

```text
Receta:

Rendimiento base:
100 unidades

Ingredientes:

Insumo A → 10
Insumo B → 5
Insumo C → 2
```

Si se planifica producir:

```text
200 unidades
```

el sistema debe poder calcular proporcionalmente las cantidades teóricas:

```text
Factor de producción:

Cantidad planificada
─────────────────────
Rendimiento base de receta
```

Por ejemplo:

```text
200
─── = 2
100
```

Entonces:

```text
Insumo A
10 × 2 = 20

Insumo B
5 × 2 = 10

Insumo C
2 × 2 = 4
```

La producción debe registrar el resultado teórico obtenido a partir de la receta aplicable.

Posteriormente se registra el consumo real.

---

# 10. Cantidad teórica y cantidad real

El sistema debe distinguir claramente entre ambas.

```text
CANTIDAD TEÓRICA
```

Es la cantidad calculada a partir de:

* Receta.
* Rendimiento base.
* Cantidad planificada.

```text
CANTIDAD REAL UTILIZADA
```

Es la cantidad que realmente se consumió durante la producción.

Ejemplo:

| Insumo  | Teórico |   Real | Diferencia |
| ------- | ------: | -----: | ---------: |
| Leche   |    20 L |   21 L |       +1 L |
| Azúcar  |    5 kg | 4.8 kg |    -0.2 kg |
| Cultivo |    2 kg |   2 kg |          0 |

La diferencia debe conservarse como parte del historial de producción.

Conceptualmente:

```text
Diferencia =
Cantidad Real Utilizada
-
Cantidad Teórica
```

La definición exacta del signo y su representación debe mantenerse consistente en toda la aplicación.

---

# 11. Producción planificada

Una producción puede existir antes de ser ejecutada.

Por ejemplo:

```text
Producto:
Yogurt Natural 200 ml

Cantidad planificada:
500 unidades

Fecha planificada:
10 de septiembre de 2026

Estado:
PLANIFICADA
```

En este punto:

* La producción existe.
* El producto está definido.
* La cantidad planificada está definida.
* Los requerimientos teóricos pueden calcularse.
* La producción todavía no representa consumo real.
* No debe considerarse producto terminado disponible.

La planificación no debe confundirse con una producción completada.

---

# 12. Ejecución de producción

Cuando la producción se realiza, deben registrarse los datos reales.

Conceptualmente:

```text
PLANIFICADA
    │
    ▼
EN EJECUCIÓN
    │
    ├── Registrar consumo real
    │
    ├── Registrar cantidad producida
    │
    ├── Registrar fecha de producción
    │
    └── Registrar fecha de vencimiento
    │
    ▼
COMPLETADA
```

El conjunto exacto de estados debe ser definido posteriormente como parte del contrato operativo del módulo.

La estructura original contiene un campo `Estado`, pero el VBA disponible no define todavía un catálogo oficial completo de estados para Producción. 

Por lo tanto, este documento no debe inventar todavía estados adicionales como si fueran una decisión ya tomada.

---

# 13. Resultado real de producción

Una producción no debe asumir automáticamente que:

```text
Cantidad producida real
=
Cantidad planificada
```

Ejemplo:

```text
Planificado:
500 unidades

Producido realmente:
480 unidades
```

La diferencia entre lo planificado y lo producido es información importante para el análisis posterior.

Puede indicar:

* Merma.
* Pérdida.
* Problemas durante la producción.
* Diferencias de rendimiento.
* Errores en la receta.
* Variaciones operativas.

El módulo debe conservar ambas cantidades.

---

# 14. Producción y consumo de insumos

Cuando una producción se complete, existe un efecto operativo sobre los insumos utilizados.

Conceptualmente:

```text
INSUMOS EN INVENTARIO
        │
        │ consumo real
        ▼
PRODUCCIÓN
        │
        │ resultado
        ▼
PRODUCTO TERMINADO
```

El módulo de Producción debe proporcionar la información necesaria para que el módulo de Inventario registre:

```text
SALIDA DE INSUMOS
```

basada en las cantidades realmente utilizadas.

El historial original de Inventario está preparado para registrar:

* Tipo de movimiento.
* Insumo o producto.
* Cantidad de entrada.
* Cantidad de salida.
* Unidad.
* Costo unitario.
* Costo total.
* Referencia.
* Origen.
* Destino.
* Observaciones. 

Una producción completada debe poder identificarse como referencia del movimiento generado.

La relación conceptual será:

```text
PRODUCCIÓN
    │
    ├── consume insumos
    │       │
    │       ▼
    │   MOVIMIENTOS DE SALIDA
    │
    └── genera producto terminado
            │
            ▼
        MOVIMIENTO DE ENTRADA
```

La implementación exacta de estos movimientos pertenece al contrato del módulo de Inventario.

---

# 15. Producción y producto terminado

La producción genera una entrada de producto terminado.

Ejemplo:

```text
Producción:

Producto:
Yogurt de Fresa 200 ml

Cantidad producida:
480 unidades
```

El resultado debe convertirse conceptualmente en:

```text
ENTRADA DE INVENTARIO
```

para ese producto.

La cantidad que entra al inventario debe corresponder a la cantidad realmente producida, no simplemente a la cantidad inicialmente planificada.

---

# 16. Producción y lotes

El modelo original asocia cada producción con un `ID_Lote`. 

Además, la estructura original de Lotes contempla:

* ID del lote.
* Tipo de lote.
* Producto o insumo asociado.
* Fecha de producción.
* Fecha de vencimiento.
* Cantidad inicial.
* Cantidad disponible.
* Unidad.
* Estado.
* Observaciones. 

La relación conceptual es:

```text
PRODUCCIÓN COMPLETADA
        │
        ▼
GENERACIÓN DE LOTE
        │
        ├── Producto
        ├── Fecha de producción
        ├── Fecha de vencimiento
        ├── Cantidad inicial
        └── Cantidad disponible
```

La Producción genera el hecho operativo.

El módulo de Lotes administra la identidad y trazabilidad del lote.

Por tanto:

```text
Producción
≠
Lote
```

pero ambos están directamente relacionados.

---

# 17. Producción y fecha de vencimiento

El registro original de Producción contiene `Fecha_Vencimiento`. 

Esta fecha debe quedar asociada al resultado de la producción y ser consistente con el lote generado.

No debe permitirse que una misma producción termine generando información contradictoria entre:

```text
PRODUCCIÓN
```

y:

```text
LOTE
```

La fuente exacta para calcular o ingresar la fecha de vencimiento deberá definirse cuando se reconstruya el contrato completo de Lotes y las reglas de vida útil de los productos.

Por ahora queda establecido:

> Una producción completada debe conservar la fecha de vencimiento asociada al producto resultante cuando esta sea aplicable.

---

# 18. Producción y costos

La estructura original contempla:

```text
Costo_Teorico
```

y:

```text
Costo_Real
```

en cada detalle de producción. 

Por tanto, el módulo debe conservar la información necesaria para diferenciar:

```text
COSTO ESPERADO
```

de:

```text
COSTO REAL DEL CONSUMO
```

Conceptualmente:

```text
COSTO TEÓRICO
=
Cantidad Teórica
×
Costo de referencia del insumo
```

```text
COSTO REAL
=
Cantidad Real Utilizada
×
Costo aplicable al consumo
```

La forma definitiva de determinar el costo aplicable dependerá del contrato de Costos e Inventario.

Producción no debe definir de manera aislada una política de valoración de inventario.

Debe utilizar la política oficial del sistema cuando esta sea definida.

---

# 19. Responsabilidades del módulo

El módulo de Producción es responsable de:

```text
✓ Crear producciones.

✓ Planificar cantidades.

✓ Asociar la producción a un producto.

✓ Obtener la receta aplicable.

✓ Calcular requerimientos teóricos.

✓ Crear el detalle inicial de producción.

✓ Registrar cantidades reales utilizadas.

✓ Registrar diferencias.

✓ Registrar cantidad producida real.

✓ Registrar fecha real de producción.

✓ Registrar fecha de vencimiento.

✓ Controlar el estado operativo de la producción.

✓ Mantener la relación con el lote generado.

✓ Proporcionar información para los movimientos de inventario.

✓ Mantener el historial real del proceso productivo.
```

---

# 20. No responsabilidades del módulo

Producción no debe:

```text
✗ Administrar productos.

✗ Administrar presentaciones.

✗ Administrar insumos.

✗ Modificar la definición de una receta.

✗ Administrar proveedores.

✗ Registrar compras.

✗ Administrar directamente el inventario general.

✗ Ser la fuente de verdad del saldo actual de inventario.

✗ Administrar directamente la disponibilidad de los lotes.

✗ Registrar ventas.

✗ Administrar clientes.

✗ Registrar pagos.

✗ Administrar gastos generales.

✗ Calcular por sí sola toda la rentabilidad del negocio.

✗ Contener lógica de interfaz de usuario.
```

La separación conceptual es:

```text
RECETAS
→ Definen cómo debería producirse.

PRODUCCIÓN
→ Registra cómo se produjo.

INVENTARIO
→ Registra y controla existencias y movimientos.

LOTES
→ Controlan trazabilidad y disponibilidad por lote.

COSTOS
→ Define y centraliza las reglas de valoración.

RENTABILIDAD
→ Analiza los resultados económicos.
```

---

# 21. Flujo general del proceso

El flujo objetivo del módulo es:

```text
1. Seleccionar producto
        │
        ▼
2. Verificar que existe una receta utilizable
        │
        ▼
3. Definir cantidad planificada
        │
        ▼
4. Calcular factor respecto al rendimiento base
        │
        ▼
5. Generar cantidades teóricas de insumos
        │
        ▼
6. Crear producción
        │
        ▼
7. Registrar ejecución real
        │
        ├── Cantidades reales utilizadas
        ├── Fecha de producción
        ├── Cantidad realmente obtenida
        └── Observaciones
        │
        ▼
8. Registrar resultado de producción
        │
        ▼
9. Generar o asociar lote
        │
        ▼
10. Registrar efectos sobre inventario
        │
        ├── Salida de insumos
        └── Entrada de producto terminado
        │
        ▼
11. Producción completada
```

La atomicidad exacta de este proceso deberá definirse durante la implementación del backend para evitar que una producción quede parcialmente aplicada.

---

# 22. Relación con Recetas

El módulo depende funcionalmente de Recetas.

Una producción requiere conocer:

```text
ID_Producto
```

y la receta asociada.

La receta proporciona:

```text
Rendimiento base
        │
        ▼
Factor de escalado
        │
        ▼
Detalle de insumos
        │
        ▼
Cantidad teórica requerida
```

El módulo de Recetas ya contempla que:

* Una receta pertenece a un producto.
* Una receta tiene un rendimiento base.
* Una receta contiene múltiples ingredientes.
* Cada ingrediente tiene cantidad requerida, unidad y merma. 

Producción utiliza esa información como base.

Una vez creada la producción, el detalle generado debe conservar el contexto necesario para representar la producción real.

---

# 23. Relación con Insumos

Producción utiliza los insumos definidos en la receta.

Para cada insumo se requiere conocer, según corresponda:

* Identidad.
* Unidad.
* Cantidad teórica.
* Cantidad real utilizada.
* Diferencia.
* Información de costo aplicable.

El módulo no administra el maestro de Insumos.

Solo consume insumos existentes.

---

# 24. Relación con Inventario

Producción genera efectos sobre Inventario.

El principio general es:

```text
ANTES DE PRODUCIR

INVENTARIO DE INSUMOS
        │
        ▼
CONSUMO REAL
        │
        ▼
SALIDA DE INVENTARIO
```

Después:

```text
RESULTADO REAL
        │
        ▼
PRODUCTO TERMINADO
        │
        ▼
ENTRADA DE INVENTARIO
```

La Producción debe identificarse como la operación de origen de ambos movimientos.

Conceptualmente:

```text
ID_Produccion
        │
        ├── Movimiento salida de insumos
        │
        └── Movimiento entrada producto terminado
```

---

# 25. Relación con Lotes

Una producción completada puede generar un lote de producto terminado.

La relación inicial es:

```text
PRODUCCIÓN
    │
    └── ID_Lote
            │
            ▼
          LOTE
```

La información compartida conceptualmente incluye:

* Producto.
* Fecha de producción.
* Fecha de vencimiento.
* Cantidad inicial.
* Unidad.

La gestión posterior de la cantidad disponible y del estado del lote pertenece al módulo de Lotes.

---

# 26. Estados de Producción

El sistema original contiene un campo `Estado`, pero no existe en la fuente consultada una definición completa y oficial de todos los valores permitidos. 

Por tanto, los estados definitivos quedan pendientes de especificación.

Como referencia del flujo operativo, el módulo necesita distinguir al menos entre una producción:

```text
NO EJECUTADA
```

y una producción:

```text
COMPLETADA
```

No se debe congelar todavía una enumeración definitiva hasta definir:

* Cancelación.
* Producción parcial.
* Reversión.
* Corrección.
* Fallos durante el proceso.
* Inventario insuficiente.
* Producciones incompletas.

Estas reglas deberán definirse antes de implementar la máquina de estados.

---

# 27. Reglas de negocio identificadas

## 27.1 El producto debe existir

No puede existir una producción para un producto inexistente.

---

## 27.2 El producto debe estar disponible para producción

La definición exacta de disponibilidad dependerá de las reglas del módulo de Productos.

---

## 27.3 Debe existir una receta aplicable

No debe iniciarse una producción basada únicamente en cantidades manuales cuando el flujo normal del sistema requiere una receta.

La excepción a esta regla, si se permite producción manual o ajustes especiales, debe definirse explícitamente.

---

## 27.4 La cantidad planificada debe ser mayor que cero

No tiene sentido crear una producción con:

```text
Cantidad_Planificada <= 0
```

---

## 27.5 Las cantidades teóricas deben derivarse de la receta

Las cantidades teóricas deben poder reconstruirse a partir de:

```text
Receta
+
Rendimiento base
+
Cantidad planificada
```

---

## 27.6 La cantidad real utilizada debe ser válida

Las cantidades reales utilizadas no deben ser negativas.

La posibilidad de registrar cero debe depender del estado de la producción y del significado operativo de cada línea.

---

## 27.7 La cantidad producida real debe reflejar el resultado

La cantidad realmente obtenida debe registrarse independientemente de la cantidad planificada.

---

## 27.8 El detalle debe pertenecer a una única producción

Cada registro de detalle debe estar asociado a un `ID_Produccion`.

---

## 27.9 La producción debe conservar su historial

Una producción completada representa un hecho histórico.

Las modificaciones posteriores no deben alterar silenciosamente:

* El consumo real registrado.
* La cantidad realmente producida.
* Los costos históricos.
* La fecha de producción.
* El lote generado.

Las correcciones deberán seguir un mecanismo controlado cuando se defina.

---

## 27.10 Los movimientos derivados deben mantener referencia

Los movimientos de inventario derivados de una producción deben poder relacionarse con ella mediante una referencia.

La estructura original de movimientos incluye `ID_Referencia`, que permite esta relación. 

---

# 28. Entidades conceptuales del módulo

Actualmente se identifican dos conceptos principales:

```text
Production
```

Representa el proceso principal.

```text
ProductionDetail
```

Representa cada insumo involucrado en una producción.

Conceptualmente:

```text
Production
│
├── id
├── plannedDate
├── productionDate
├── productId
├── plannedQuantity
├── actualProducedQuantity
├── status
├── expirationDate
├── lotId
├── observations
└── details[]

ProductionDetail
│
├── id
├── productionId
├── supplyId
├── theoreticalQuantity
├── actualQuantityUsed
├── difference
├── unit
├── theoreticalCost
├── actualCost
└── observations
```

Estos nombres son conceptuales y no representan todavía el contrato definitivo de código o base de datos.

---

# 29. Relaciones principales

```text
PRODUCT
   │
   ├──────────► RECIPE
   │                │
   │                ▼
   │            RECIPE DETAILS
   │                │
   │                ▼
   └──────────► PRODUCTION
                    │
                    ├── PRODUCTION DETAILS
                    │         │
                    │         ▼
                    │       SUPPLIES
                    │
                    ├── INVENTORY MOVEMENTS
                    │
                    └── LOT
```

---

# 30. Dependencias funcionales

El módulo de Producción depende conceptualmente de:

```text
Products
    → Identifica el producto que será producido.

Recipes
    → Define rendimiento e insumos teóricos.

Supplies
    → Identifica los insumos utilizados.

Inventory
    → Registra el efecto de consumo y entrada.

Lots
    → Registra la trazabilidad del producto terminado.

Costs
    → Define la política de valoración aplicable.
```

No todas estas dependencias implican necesariamente una dependencia directa entre módulos en código.

La implementación deberá respetar las reglas de dependencia definidas por la arquitectura general.

---

# 31. Datos que deben conservarse históricamente

Una producción debe conservar, como mínimo:

```text
IDENTIDAD
- ID de producción.

PLANIFICACIÓN
- Fecha planificada.
- Producto.
- Cantidad planificada.

EJECUCIÓN
- Fecha real.
- Cantidad producida real.
- Estado.
- Observaciones.

DETALLE REAL
- Insumo.
- Cantidad teórica.
- Cantidad real utilizada.
- Diferencia.
- Unidad.

COSTOS
- Costo teórico.
- Costo real.

TRAZABILIDAD
- Fecha de vencimiento.
- Lote generado.
```

La información histórica de una producción no debe depender exclusivamente de que la receta actual permanezca sin cambios.

---

# 32. Operaciones esperadas

El módulo deberá evolucionar para soportar operaciones equivalentes a:

```text
CrearProduccion
```

Crea un registro inicial de producción.

```text
PlanificarProduccion
```

Define producto, fecha y cantidad planificada.

```text
CalcularRequerimientosProduccion
```

Obtiene y escala los requerimientos de la receta.

```text
ObtenerProduccion
```

Consulta la información general.

```text
ObtenerDetalleProduccion
```

Consulta los insumos y cantidades asociadas.

```text
RegistrarCantidadRealUtilizada
```

Registra el consumo real de cada insumo.

```text
RegistrarResultadoProduccion
```

Registra la cantidad realmente obtenida y la información de ejecución.

```text
CompletarProduccion
```

Finaliza el proceso operativo.

```text
ConsultarProducciones
```

Permite consultar el historial.

Estas operaciones son responsabilidades funcionales esperadas. No implican que todas deban convertirse desde el inicio en servicios, clases o archivos independientes.

---

# 33. Límites del módulo

El módulo comienza cuando existe una intención de producir un producto.

Termina conceptualmente cuando la producción ha dejado registrados sus efectos operativos:

```text
PRODUCCIÓN
        │
        ├── Consumo de insumos
        │
        ├── Resultado real
        │
        ├── Lote
        │
        └── Información para inventario
```

Después de esto:

```text
LOTES
```

continúa con la trazabilidad.

```text
INVENTARIO
```

continúa con el control de existencias.

```text
VENTAS
```

utilizará posteriormente el producto disponible.

---

# 34. Escenarios que requieren definición posterior

Antes de implementar el módulo, deben definirse explícitamente los siguientes casos:

1. Si un producto puede tener más de una receta activa.
2. Cómo se selecciona la receta utilizada en una producción.
3. Si la producción conserva una referencia a la receta utilizada.
4. Si una receta puede cambiar después de que una producción haya sido completada.
5. Cómo se determina el costo real del insumo consumido.
6. Qué ocurre si no existe inventario suficiente.
7. Si una producción puede completarse parcialmente.
8. Si una producción puede cancelarse.
9. Cómo se corrige una producción ya completada.
10. Si una producción puede generar más de un lote.
11. Cómo se genera el identificador del lote.
12. Cómo se determina la fecha de vencimiento.
13. Si la fecha de vencimiento depende del producto, de la receta o de una configuración.
14. Cómo se manejan las mermas reales.
15. Qué movimientos exactos se generan en Inventario.
16. Si los movimientos y el lote deben crearse dentro de una misma transacción.
17. Cuáles son los estados oficiales de Producción.

Estos puntos no deben resolverse inventando comportamiento durante la implementación.

Deben convertirse en decisiones explícitas del dominio.

---

# 35. Fuente de verdad de este documento

Este documento reconstruye el dominio de Producción utilizando como fuente principal la estructura existente del sistema VBA.

La estructura original contempla:

```text
tblProduccion
```

como cabecera del proceso de producción y:

```text
tblDetalleProduccion
```

como detalle de los insumos, cantidades y costos involucrados. 

La producción también está relacionada estructuralmente con:

```text
tblMovimientosInventario
tblInventario
tblLotes
```

dentro del modelo original del sistema. 

Este documento es una reconstrucción del dominio y debe actualizarse cuando se tomen nuevas decisiones oficiales sobre:

* Estados.
* Inventario.
* Lotes.
* Costos.
* Correcciones.
* Cancelaciones.
* Trazabilidad.
* Reglas de ejecución.

La implementación futura deberá respetar este documento o modificarlo explícitamente antes de introducir cambios en la lógica del negocio.
