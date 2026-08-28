# 03 — REGLAS DE INTEGRIDAD DE DATOS

## 1. Propósito

Este documento define las reglas que deben garantizar la integridad de los datos del Sistema de Gestión Empresarial de Yogurt.

Su objetivo es evitar que la base de datos contenga:

* registros duplicados;
* referencias a entidades inexistentes;
* cantidades inválidas;
* relaciones inconsistentes;
* saldos imposibles;
* operaciones incompletas;
* pérdida de trazabilidad histórica;
* modificaciones que contradigan operaciones ya registradas.

Estas reglas se reconstruyen a partir de la lógica definida en el sistema original de Excel/VBA y de los documentos de dominio y modelo de datos ya establecidos.

El sistema original utiliza tablas estructuradas, identificadores generados automáticamente y validaciones específicas de cada módulo. Las tablas y sus encabezados forman parte de la estructura oficial del sistema y los módulos de negocio no deben manipular directamente la infraestructura de datos.  

---

# 2. Principio general de integridad

Todo dato almacenado debe cumplir simultáneamente con cuatro niveles de integridad:

```text
INTEGRIDAD
│
├── Identidad
│   └── Cada registro puede identificarse de forma única.
│
├── Referencial
│   └── Ninguna relación puede apuntar a un registro inexistente.
│
├── De dominio
│   └── Cada valor debe cumplir las reglas propias del negocio.
│
└── Histórica
    └── Las operaciones realizadas deben conservar su trazabilidad.
```

Una operación solo debe persistirse cuando todas las reglas aplicables hayan sido satisfechas.

---

# 3. Integridad de identidad

## 3.1 Identificadores únicos

Cada entidad principal debe tener un identificador único generado por el sistema.

El usuario no debe ser responsable de introducir manualmente los identificadores técnicos. Esta regla ya existía explícitamente en la infraestructura VBA original. 

Los siguientes identificadores deben ser únicos dentro de su entidad:

```text
Presentación
ID_Presentacion

Insumo
ID_Insumo

Proveedor
ID_Proveedor

Producto
ID_Producto

Receta
ID_Receta

Detalle de receta
ID_Detalle_Receta

Compra
ID_Compra

Detalle de compra
ID_Detalle_Compra

Movimiento de inventario
ID_Movimiento

Producción
ID_Produccion

Detalle de producción
ID_Detalle_Produccion

Lote
ID_Lote

Cliente
ID_Cliente

Venta
ID_Venta

Detalle de venta
ID_Detalle_Venta

Pago de cliente
ID_Pago

Gasto
ID_Gasto
```

No deben existir dos registros de la misma entidad con el mismo identificador.

---

## 3.2 Los identificadores son internos

Los IDs sirven para mantener relaciones entre entidades.

No deben utilizarse como nombres comerciales ni como datos editables libremente por el usuario.

Por ejemplo:

```text
PRE-001
INS-001
PROD-001
REC-001
COM-001
LOT-001
CLI-001
VEN-001
```

La nomenclatura técnica podrá evolucionar en la implementación, pero la unicidad y generación controlada del identificador son obligatorias.

---

# 4. Integridad referencial

Una relación solo puede existir si la entidad referenciada existe.

La regla general es:

```text
Registro dependiente
        ↓
Debe existir previamente
        ↓
Registro principal
```

Por ejemplo:

```text
Producto
    ↓
Presentación existente
```

No puede existir un producto asociado a una presentación inexistente.

---

# 5. Regla de existencia previa

Antes de crear un registro dependiente, el sistema debe validar la existencia de las entidades requeridas.

Ejemplos:

```text
Para crear un producto:
    Debe existir la presentación.

Para crear una receta:
    Debe existir el producto.

Para agregar un ingrediente:
    Debe existir la receta.
    Debe existir el insumo.

Para registrar un precio de proveedor:
    Debe existir el proveedor.
    Debe existir el insumo.

Para registrar una compra:
    Debe existir el proveedor.

Para registrar un detalle de compra:
    Debe existir la compra.
    Debe existir el insumo.

Para registrar producción:
    Debe existir el producto o receta correspondiente según la operación definida.

Para crear un lote:
    Debe existir la producción que lo origina.

Para registrar una venta:
    Debe existir el cliente cuando la operación requiera asociarlo.
    Debe existir el producto o lote correspondiente según la estructura final de la venta.

Para registrar un pago:
    Debe existir la venta asociada.
```

En la lógica original de recetas, por ejemplo, se valida expresamente que el producto y el insumo existan antes de establecer la relación. 

---

# 6. Integridad de presentaciones

Una presentación representa la forma física o comercial en la cual se maneja un producto.

Las reglas son:

1. Cada presentación debe tener un identificador único.
2. La información obligatoria de la presentación no puede quedar vacía.
3. Las cantidades asociadas a capacidad deben ser válidas.
4. Una presentación utilizada por productos existentes no debe eliminarse físicamente de forma que rompa la relación histórica.
5. La desactivación debe preferirse a la eliminación cuando la presentación ya tenga dependencias operativas.

La presentación forma parte de la identidad comercial del producto.

---

# 7. Integridad de insumos

Las reglas principales son:

1. Cada insumo debe tener un identificador único.
2. Un insumo debe existir antes de utilizarse en:

   * recetas;
   * compras;
   * precios de proveedores;
   * movimientos relacionados con insumos;
   * producción.
3. Los datos de identificación requeridos no pueden estar vacíos.
4. Las cantidades no pueden ser negativas cuando representen existencias o cantidades físicas.
5. Un insumo con historial operativo no debe eliminarse físicamente sin evaluar sus dependencias.
6. La desactivación debe utilizarse cuando sea necesario impedir nuevas operaciones sin destruir el historial.

---

# 8. Integridad de proveedores

Las reglas son:

1. Cada proveedor debe tener identidad única dentro del sistema.
2. Los datos obligatorios definidos por el módulo deben existir.
3. Un proveedor debe existir antes de registrar:

   * precios de proveedor;
   * compras.
4. Un proveedor con compras históricas no debe eliminarse de manera que invalide registros anteriores.
5. La desactivación debe impedir nuevas operaciones cuando corresponda, sin destruir el historial existente.

---

# 9. Integridad de precios de proveedores

Un precio de proveedor representa una relación entre:

```text
PROVEEDOR
    +
INSUMO
    +
PRECIO
```

Por tanto:

1. El proveedor debe existir.
2. El insumo debe existir.
3. El precio debe ser válido.
4. El precio no puede ser negativo.
5. La relación debe conservar la información necesaria para identificar qué proveedor ofrece qué insumo y bajo qué valor.
6. La actualización de un precio no debe reinterpretar automáticamente el valor histórico de compras ya registradas.

Una compra histórica debe conservar el precio utilizado en el momento de la operación, aunque posteriormente cambie el precio registrado para futuras compras.

---

# 10. Integridad de productos

El producto depende de una presentación.

La relación principal es:

```text
PRODUCTO
    │
    └── PRESENTACIÓN
```

Las reglas son:

1. `ID_Producto` debe ser único.
2. La presentación asociada debe existir.
3. No puede existir un producto duplicado bajo la combinación definida por el sistema.

La lógica original establece expresamente como validación principal la combinación:

```text
Nombre_Producto
        +
ID_Presentacion
```

Por tanto:

```text
Yogurt Natural + PRE-001
```

puede coexistir con:

```text
Yogurt Natural + PRE-002
```

pero no pueden existir dos productos con la misma combinación de nombre y presentación. 

La restricción lógica es:

```text
UNIQUE (
    Nombre_Producto,
    ID_Presentacion
)
```

Esta regla debe mantenerse en la nueva implementación.

---

# 11. Integridad de recetas

La receta sigue una estructura formal de:

```text
CABECERA
    │
    └── DETALLE
```

La estructura original define:

```text
RECETA
    │
    ├── PRODUCTO
    │
    └── DETALLES DE RECETA
            │
            └── INSUMO
```

La receta pertenece a un único producto y los ingredientes pertenecen a la receta correspondiente. 

Las reglas son:

1. Cada receta debe tener un identificador único.
2. Cada detalle debe tener un identificador único.
3. Una receta debe existir antes de registrar sus ingredientes.
4. El producto asociado a la receta debe existir.
5. El insumo asociado a cada detalle debe existir.
6. La cantidad requerida debe ser mayor que cero.
7. Un mismo insumo no puede repetirse dentro de la misma receta.
8. La merma debe cumplir el rango definido por la lógica original.

La regla de unicidad del ingrediente dentro de una receta es:

```text
UNIQUE (
    ID_Receta,
    ID_Insumo
)
```

La lógica VBA original establece explícitamente esta restricción. 

---

# 12. Integridad de cantidades en recetas

Para cada ingrediente:

```text
Cantidad_Requerida > 0
```

No son válidos:

```text
0
-1
-10
```

La merma debe mantenerse dentro del rango establecido por la lógica original:

```text
Merma_Porcentaje >= 0
Merma_Porcentaje < 100
```

No son válidos valores negativos ni valores iguales o superiores al 100 %.

Esta regla está expresamente definida en el módulo original de recetas. 

---

# 13. Integridad de compras

Una compra representa una operación compuesta por:

```text
COMPRA
    │
    └── DETALLE DE COMPRA
            │
            └── INSUMO
```

Las reglas son:

1. Cada compra debe tener identidad única.
2. Cada detalle de compra debe tener identidad única.
3. La compra debe existir antes de agregar detalles.
4. El proveedor asociado debe existir.
5. El insumo registrado en cada detalle debe existir.
6. Las cantidades compradas deben ser mayores que cero.
7. Los precios utilizados en la compra deben ser válidos.
8. Los detalles deben pertenecer a una única compra.
9. Una modificación posterior del precio de proveedor no debe modificar el precio histórico registrado en la compra.

---

# 14. Integridad de detalle de compras

Un detalle no puede existir de forma independiente de su compra.

La relación es:

```text
COMPRA
    1
    │
    └──── N
          DETALLE_COMPRA
```

Por tanto:

```text
ID_Compra
```

debe corresponder a una compra existente.

Las cantidades deben cumplir:

```text
Cantidad > 0
```

Los valores monetarios asociados deben cumplir:

```text
Valor >= 0
```

Cuando un campo represente un precio efectivo de compra, debe conservar el valor histórico utilizado en esa operación.

---

# 15. Integridad del inventario

El inventario no debe interpretarse como una fuente independiente de verdad operativa.

La lógica del sistema incluye explícitamente una tabla de movimientos y una tabla de inventario. 

El principio funcional es:

```text
OPERACIÓN
    ↓
MOVIMIENTO DE INVENTARIO
    ↓
ACTUALIZACIÓN DEL ESTADO DE INVENTARIO
```

Las operaciones que afecten existencias deben conservar el movimiento que explica el cambio.

Ejemplos:

```text
Compra
    → entrada de insumos

Producción
    → salida de insumos

Producción finalizada
    → entrada de producto terminado o lote

Venta
    → salida de producto o lote
```

No debe permitirse modificar arbitrariamente una existencia sin una causa o proceso definido.

---

# 16. Regla de no existencia negativa

Cuando el modelo de negocio no permita existencias negativas, una operación no puede dejar una cantidad disponible por debajo de cero.

La validación debe realizarse antes de confirmar operaciones que reduzcan inventario.

Conceptualmente:

```text
Existencia disponible
-
Cantidad solicitada
>= 0
```

Si el resultado es negativo:

```text
Operación rechazada
```

La implementación futura podrá contemplar ajustes de inventario u operaciones excepcionales, pero estas deberán quedar registradas explícitamente y no producirse como una modificación silenciosa del saldo.

---

# 17. Integridad de movimientos de inventario

Cada movimiento debe poder responder:

```text
¿Qué cambió?
¿Por qué cambió?
¿Cuándo cambió?
¿Qué operación lo originó?
¿Qué entidad fue afectada?
```

Por tanto, un movimiento no debe existir sin una causa identificable.

El movimiento debe mantener la relación con la operación que lo originó cuando dicha relación exista.

Ejemplo:

```text
Compra COM-001
        ↓
Movimiento de entrada
        ↓
Inventario de insumo
```

```text
Producción PRO-001
        ↓
Movimiento de salida
        ↓
Consumo de insumos
```

```text
Venta VEN-001
        ↓
Movimiento de salida
        ↓
Inventario de producto o lote
```

---

# 18. Integridad de producción

La producción representa una operación de transformación.

No debe registrarse como un simple cambio manual de cantidades.

La operación debe respetar las relaciones definidas entre:

```text
RECETA
    ↓
INSUMOS
    ↓
PRODUCCIÓN
    ↓
PRODUCTO RESULTANTE
    ↓
LOTE
```

Las reglas principales son:

1. La producción debe tener un identificador único.
2. Los elementos requeridos por la operación deben existir previamente.
3. Las cantidades utilizadas deben ser válidas.
4. No se pueden consumir cantidades inexistentes cuando aplique la regla de no inventario negativo.
5. Los detalles deben pertenecer a una producción existente.
6. Una producción no debe generar registros incompletos o desconectados de su resultado.
7. La ejecución de producción debe conservar suficiente información para explicar el origen del lote resultante.

---

# 19. Integridad de lotes

El lote es una unidad fundamental de trazabilidad.

Debe conservar su vínculo con la producción que le dio origen.

Además, deben quedar registradas explícitamente:

```text
Fecha de creación del lote
Fecha de vencimiento del lote
```

Estas fechas son parte del historial del lote y no deben calcularse retrospectivamente a partir de una configuración actual.

La regla de trazabilidad es:

```text
LOTE
│
├── Origen: producción
├── Fecha de creación
├── Fecha de vencimiento
└── Estado operativo
```

Una venta posterior no debe borrar ni reemplazar esta información.

---

# 20. Integridad temporal de lotes

Las fechas deben mantener coherencia temporal.

Como regla mínima:

```text
Fecha_Vencimiento >= Fecha_Creacion
```

No debe existir un lote cuya fecha de vencimiento sea anterior a su fecha de creación.

Si el negocio define una vida útil determinada, dicha regla podrá utilizarse para calcular inicialmente la fecha de vencimiento, pero una vez creado el lote debe conservarse el valor histórico que quedó registrado.

---

# 21. Integridad de ventas

Una venta representa una operación comercial con una estructura de cabecera y detalle.

Conceptualmente:

```text
VENTA
    │
    ├── CLIENTE
    │
    └── DETALLES DE VENTA
            │
            └── PRODUCTOS / LOTES SEGÚN LA OPERACIÓN
```

Las reglas son:

1. Cada venta debe tener identidad única.
2. Cada detalle debe tener identidad única.
3. Una venta debe existir antes de agregar detalles.
4. Las cantidades vendidas deben ser mayores que cero.
5. Los elementos vendidos deben existir.
6. La venta no debe provocar inventario negativo.
7. El detalle debe pertenecer a una única venta.
8. La información comercial histórica debe conservarse aunque posteriormente cambien precios u otros datos maestros.

---

# 22. Integridad de pagos

Un pago representa un registro financiero asociado al proceso de venta.

Las reglas son:

1. Cada pago debe tener identidad única.
2. La venta asociada debe existir.
3. El valor del pago debe ser válido.
4. Un pago no debe registrarse como una entidad aislada sin relación con la operación correspondiente.
5. Los pagos deben conservar su fecha y valor histórico.
6. La modificación de una venta no debe destruir la trazabilidad de pagos ya registrados.

La relación conceptual es:

```text
VENTA
    1
    │
    └──── N
          PAGOS
```

---

# 23. Integridad de gastos

Cada gasto debe:

1. tener un identificador único;
2. contener la información mínima requerida por el módulo;
3. registrar un valor válido;
4. conservar la fecha correspondiente;
5. permanecer disponible para análisis histórico.

Un gasto registrado no debe desaparecer de los cálculos históricos únicamente porque posteriormente cambie su clasificación.

---

# 24. Integridad de costos

El módulo de costos no debe introducir operaciones físicas independientes si su función consiste en analizar o calcular información derivada de otras operaciones.

Los costos deben basarse en datos procedentes de:

```text
Compras
Producción
Recetas
Insumos
Precios históricos
Gastos cuando corresponda
```

No debe permitirse que un cálculo de costo altere por sí mismo:

```text
Inventario
Compras
Producción
Ventas
```

El cálculo y el registro de operaciones son responsabilidades diferentes.

---

# 25. Integridad de rentabilidad

La rentabilidad debe construirse a partir de información histórica válida.

Conceptualmente:

```text
Ingresos
-
Costos
-
Gastos aplicables
=
Resultado
```

El módulo de rentabilidad no debe convertirse en una fuente independiente que reescriba datos de ventas, costos o gastos.

Su responsabilidad es interpretar y consolidar información, no alterar la operación original.

---

# 26. Integridad del dashboard

El dashboard debe consumir información de los módulos operativos y analíticos.

No debe ser fuente primaria de registros de negocio.

La dirección correcta es:

```text
OPERACIONES
        ↓
DATOS HISTÓRICOS
        ↓
CÁLCULOS Y CONSULTAS
        ↓
DASHBOARD
```

Nunca:

```text
DASHBOARD
        ↓
MODIFICACIÓN DIRECTA
        ↓
DATOS OPERATIVOS
```

salvo que una futura funcionalidad del dashboard ejecute explícitamente un caso de uso definido por el módulo responsable.

---

# 27. Regla de conservación histórica

Los datos maestros pueden cambiar.

Las operaciones históricas no deben reinterpretarse automáticamente como si siempre hubieran utilizado los valores actuales.

Ejemplos:

```text
El precio de un insumo cambia.
```

Esto no debe modificar automáticamente el valor histórico de una compra anterior.

```text
Se modifica el nombre de un proveedor.
```

La operación histórica mantiene su relación con el proveedor correspondiente.

```text
Se desactiva un producto.
```

Las ventas históricas continúan existiendo.

```text
Se modifica una presentación.
```

Los registros históricos asociados no deben perder su trazabilidad.

---

# 28. Regla de desactivación frente a eliminación

El sistema original ya utiliza activación y desactivación en varios módulos y, en el caso de recetas, establece explícitamente que determinados registros se desactivan en lugar de eliminarse físicamente. 

La regla general será:

```text
¿El registro tiene historial o dependencias?
        │
        ├── Sí
        │   └── Evaluar desactivación.
        │
        └── No
            └── La eliminación física puede evaluarse según el caso.
```

No se debe aplicar una política universal de eliminación sin revisar las relaciones existentes.

---

# 29. Regla de atomicidad operativa

Las operaciones compuestas deben tratarse como una unidad lógica.

Ejemplo conceptual:

```text
Registrar compra
    │
    ├── Crear compra
    ├── Crear detalles
    └── Registrar efecto correspondiente en inventario
```

No debe quedar una operación parcialmente registrada.

Ejemplo inválido:

```text
Compra creada
    +
Detalles incompletos
    +
Inventario sin actualizar
```

Cuando la operación requiera múltiples cambios relacionados, todos deben completarse correctamente o la operación debe rechazarse.

---

# 30. Regla de consistencia entre cabecera y detalle

Para todas las estructuras cabecera-detalle:

```text
Receta
    → Detalles de receta

Compra
    → Detalles de compra

Producción
    → Detalles de producción

Venta
    → Detalles de venta
```

deben cumplirse las siguientes reglas:

1. El detalle debe pertenecer a una cabecera existente.
2. El detalle no puede pertenecer simultáneamente a varias cabeceras.
3. La eliminación o modificación de una cabecera debe evaluar primero sus detalles.
4. No deben existir detalles huérfanos.
5. La información derivada de los detalles debe mantenerse consistente con el estado de la operación.

---

# 31. Regla de normalización de datos de entrada

Antes de validar duplicados o relaciones, los valores de entrada deben tratarse de forma consistente.

La lógica original incluye utilidades de normalización de texto y validación de valores vacíos antes de realizar búsquedas o comprobaciones. 

Por tanto, la nueva implementación debe evitar que diferencias triviales produzcan registros duplicados, por ejemplo:

```text
Yogurt Natural
yogurt natural
YOGURT NATURAL
 Yogurt Natural
```

La estrategia técnica exacta se definirá durante la implementación, pero las validaciones de identidad comercial deben realizarse sobre valores tratados de manera consistente.

---

# 32. Regla de validación antes de persistir

La secuencia general debe ser:

```text
Entrada
    ↓
Normalización
    ↓
Validación estructural
    ↓
Validación de reglas de negocio
    ↓
Validación de relaciones
    ↓
Persistencia
```

No debe utilizarse la base de datos como único mecanismo para descubrir errores previsibles de negocio.

Las restricciones de base de datos deben reforzar las reglas críticas, pero la lógica de aplicación debe validar las condiciones antes de confirmar la operación.

---

# 33. Regla de una única responsabilidad sobre los datos

Cada módulo es responsable de sus propias reglas de negocio.

Ejemplo:

```text
Products
    → reglas del producto

Recipes
    → reglas de recetas

Purchases
    → reglas de compras

Inventory
    → reglas de movimientos y existencias

Production
    → reglas de producción

Sales
    → reglas de venta
```

Un módulo no debe modificar directamente los datos internos de otro ignorando sus reglas.

La arquitectura original ya separaba explícitamente la infraestructura técnica de los módulos de negocio y establecía que la lógica de negocio debía permanecer en sus respectivos módulos funcionales. 

---

# 34. Regla de trazabilidad

Toda operación relevante debe poder rastrearse a su origen.

La cadena conceptual del sistema es:

```text
INSUMO
    ↓
PRECIO / COMPRA
    ↓
INVENTARIO
    ↓
RECETA
    ↓
PRODUCCIÓN
    ↓
LOTE
    ↓
VENTA
    ↓
PAGO
```

Los gastos, costos y análisis de rentabilidad se relacionan con esta operación sin sustituir la información original.

La trazabilidad debe permitir comprender posteriormente:

```text
Qué ocurrió.
Cuándo ocurrió.
Qué registros participaron.
Qué operación produjo el cambio.
```

---

# 35. Regla de prohibición de registros huérfanos

No deben existir registros dependientes sin su entidad principal correspondiente.

Está prohibido permitir situaciones como:

```text
Detalle de receta
sin receta
```

```text
Detalle de compra
sin compra
```

```text
Detalle de producción
sin producción
```

```text
Detalle de venta
sin venta
```

```text
Pago
sin venta asociada
```

La base de datos deberá implementar las relaciones necesarias para impedir estas inconsistencias.

---

# 36. Regla de prohibición de duplicados de negocio

La unicidad técnica del ID no es suficiente.

También deben evitarse duplicados que representen el mismo hecho de negocio.

Ejemplo confirmado por la lógica original:

```text
Nombre_Producto + ID_Presentacion
```

debe ser único. 

Ejemplo confirmado para recetas:

```text
ID_Receta + ID_Insumo
```

debe ser único. 

Las demás restricciones de unicidad específicas deberán implementarse únicamente cuando estén definidas por el dominio correspondiente.

---

# 37. Regla de no introducir relaciones nuevas sin validación

Este documento no autoriza la creación automática de nuevas entidades o relaciones simplemente porque sean habituales en sistemas empresariales.

Toda nueva relación debe cumplir:

```text
Necesidad real identificada
        +
Compatibilidad con el mapa del negocio
        +
Actualización del modelo de datos
        +
Actualización de reglas de integridad
```

La fuente reconstruida del sistema original define una estructura concreta de tablas, incluyendo relaciones cabecera-detalle para recetas y las tablas operativas del sistema. 

Por tanto, cualquier ampliación futura deberá documentarse antes de convertirse en una relación persistente.

---

# 38. Responsabilidad de aplicación y base de datos

Las reglas deben distribuirse de la siguiente forma:

## Base de datos

Debe garantizar:

```text
Primary Keys
Foreign Keys
Unique Constraints
Not Null cuando corresponda
Checks de rango cuando corresponda
Integridad transaccional
```

## Aplicación

Debe garantizar:

```text
Reglas de negocio
Validaciones contextuales
Secuencia correcta de operaciones
Autorización
Estados permitidos
Procesos compuestos
```

## Dominio

Cuando exista lógica de dominio extraída, debe proteger:

```text
Invariantes
Reglas independientes de infraestructura
Comportamiento propio del negocio
```

---

# 39. Matriz resumida de reglas críticas

| Área                   | Regla crítica                                                                   |
| ---------------------- | ------------------------------------------------------------------------------- |
| IDs                    | Cada entidad posee identidad única                                              |
| Productos              | Nombre + Presentación no puede duplicarse                                       |
| Recetas                | Un insumo no puede repetirse dentro de una receta                               |
| Recetas                | Cantidad requerida debe ser mayor que cero                                      |
| Recetas                | Merma debe ser mayor o igual a 0 y menor que 100                                |
| Compras                | No puede existir detalle sin compra                                             |
| Inventario             | Los cambios deben tener una causa operativa identificable                       |
| Inventario             | No se debe permitir saldo negativo cuando la regla aplique                      |
| Producción             | No puede consumir información o cantidades inválidas                            |
| Lotes                  | Deben conservar producción de origen y fechas de creación y vencimiento         |
| Lotes                  | Vencimiento no puede ser anterior a la creación                                 |
| Ventas                 | No puede existir detalle sin venta                                              |
| Pagos                  | Deben asociarse a una venta existente                                           |
| Historial              | Los cambios actuales no deben reinterpretar automáticamente operaciones pasadas |
| Eliminación            | Debe evaluarse antes de eliminar registros con dependencias                     |
| Operaciones compuestas | No deben persistirse parcialmente                                               |
| Detalles               | No pueden quedar registros huérfanos                                            |

---

# 40. Estado del documento

Este documento establece las reglas de integridad identificadas hasta este punto de la reconstrucción.

Las reglas procedentes directamente de la lógica VBA, como la generación de IDs, la relación de recetas, la validación de insumos duplicados dentro de una receta, los límites de cantidad y merma, y la combinación única de producto y presentación, deben conservarse en la nueva implementación.  

Las reglas que dependan de detalles aún no formalizados en el modelo físico definitivo deberán incorporarse únicamente después de documentar explícitamente la decisión correspondiente.

Este documento no reemplaza los documentos individuales de cada dominio.

Su función es actuar como el contrato transversal de integridad que deberá respetar la futura implementación de la base de datos, la API y los procesos del sistema.
