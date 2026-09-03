# 05 — DATA MODEL DECISIONS

## 1. Propósito del documento

Este documento registra las decisiones estructurales tomadas sobre el modelo de datos del sistema de gestión empresarial de yogurt.

Su función es evitar que, durante la implementación de PostgreSQL, Prisma, NestJS o cualquier otra tecnología, se introduzcan entidades, relaciones o estructuras que contradigan la lógica de negocio ya definida.

Este documento debe leerse junto con:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
```

Los documentos anteriores describen el modelo.

Este documento establece las decisiones que deben guiar su implementación y evolución.

---

# 2. Principio general de decisión

El modelo de datos debe representar la lógica real del negocio.

No debe diseñarse únicamente para que sea:

* más fácil de implementar;
* más rápido de consultar;
* más cómodo para una pantalla;
* similar a una estructura anterior;
* simétrico visualmente;
* compatible con una abstracción arquitectónica innecesaria.

La regla principal es:

> **Una decisión sobre el modelo de datos debe preservar primero la responsabilidad y la relación real entre los conceptos del negocio.**

La tecnología debe adaptarse al modelo de negocio.

No al contrario.

---

# 3. Fuente de verdad del modelo

La lógica del modelo debe construirse a partir de las fuentes documentadas del proyecto.

La jerarquía de referencia es:

```text
DOCUMENTACIÓN DE DOMINIO
        ↓
MODELO DE DATOS
        ↓
REGLAS DE INTEGRIDAD
        ↓
DECISIONES DEL MODELO
        ↓
IMPLEMENTACIÓN
```

El archivo maestro histórico y la lógica previamente documentada sirven como referencia para reconstruir el funcionamiento original del negocio.

La implementación futura no debe introducir relaciones nuevas sin que exista una decisión explícita.

---

# 4. El modelo no se define por pantallas

Una interfaz puede mostrar información de varios módulos al mismo tiempo.

Eso no significa que esos datos pertenezcan a una misma entidad.

Por ejemplo:

```text
Pantalla de producción
```

puede mostrar:

```text
Producto

Receta

Insumos

Inventario disponible

Producción

Lotes resultantes
```

Sin embargo, estos conceptos conservan responsabilidades diferentes.

La regla es:

> **La interfaz de usuario no define las entidades del modelo de datos.**

Las entidades se definen por su significado dentro del negocio.

---

# 5. El modelo no se define por tablas históricas

La estructura anterior del sistema es una fuente importante para recuperar la lógica del negocio.

Sin embargo, no toda tabla histórica debe convertirse automáticamente en un módulo o agregado independiente.

Ejemplo conceptual:

```text
Compra
    ↓
Detalle de compra
```

Esto representa un proceso de negocio compuesto.

No implica necesariamente:

```text
Módulo compras

+

Módulo detalle de compras
```

La misma regla aplica a:

```text
Venta
    ↓
Detalle de venta
```

y:

```text
Producción
    ↓
Detalle de producción
```

La decisión es:

> **Las estructuras de detalle pertenecen al proceso principal que describen, salvo que una futura necesidad de negocio justifique una responsabilidad independiente.**

---

# 6. Separación entre datos maestros y operaciones

El modelo distingue entre:

```text
DATOS MAESTROS
```

y:

```text
DATOS TRANSACCIONALES
```

Los datos maestros representan conceptos reutilizables.

Ejemplos:

```text
Presentación
Insumo
Proveedor
Producto
Cliente
Receta
```

Las operaciones representan hechos ocurridos.

Ejemplos:

```text
Compra
Movimiento de inventario
Producción
Lote
Venta
Pago
Gasto
```

Esta separación debe mantenerse.

No se debe convertir una operación en un dato maestro ni utilizar una entidad maestra para almacenar eventos históricos.

---

# 7. Una entidad no existe únicamente porque tenga una tabla

La existencia de una tabla no determina automáticamente una entidad de dominio independiente.

Una estructura puede existir para:

* representar una relación;
* almacenar un detalle;
* registrar un movimiento;
* preservar información histórica;
* resolver una relación de varios elementos.

Por tanto:

```text
TABLA
≠
MÓDULO

TABLA
≠
ENTIDAD DE DOMINIO

TABLA
≠
RESPONSABILIDAD INDEPENDIENTE
```

La decisión sobre la estructura debe realizarse según la responsabilidad del concepto.

---

# 8. Las relaciones deben representar dependencias reales

Una relación entre entidades debe existir porque representa una dependencia real del negocio.

Ejemplo:

```text
Producto
    ↓
Presentación
```

La relación existe porque la presentación forma parte de la definición del producto.

Otro ejemplo:

```text
Compra
    ↓
Proveedor
```

La relación existe porque una compra se realiza a un proveedor.

No deben crearse relaciones únicamente porque dos entidades puedan aparecer juntas en una consulta o una pantalla.

---

# 9. Los detalles transaccionales pertenecen a su operación

Las operaciones compuestas deben conservar sus detalles.

Se mantiene la estructura conceptual:

```text
Compra
    └── Detalles de compra
```

```text
Producción
    └── Detalles de producción
```

```text
Venta
    └── Detalles de venta
```

Los detalles no representan procesos independientes.

Representan los elementos que componen una operación.

Por tanto, la creación, modificación y validación de los detalles debe estar controlada por las reglas del proceso principal correspondiente.

---

# 10. Inventario basado en movimientos

El inventario no debe entenderse como una cantidad aislada que puede modificarse arbitrariamente.

La lógica base será:

```text
OPERACIÓN
    ↓
MOVIMIENTO
    ↓
CAMBIO DE INVENTARIO
```

Ejemplo:

```text
Compra
    ↓
Entrada
```

```text
Producción
    ↓
Salida de insumos
```

```text
Producción
    ↓
Resultado de producto terminado
```

```text
Venta
    ↓
Salida
```

La existencia actual debe poder explicarse mediante los movimientos registrados.

La decisión es:

> **Los cambios de inventario deben estar vinculados a una causa de negocio identificable.**

No se deben modificar existencias directamente sin una operación o mecanismo explícitamente definido para justificar el cambio.

---

# 11. El movimiento de inventario conserva su origen

Cuando un movimiento sea consecuencia de una operación, debe poder identificarse dicha operación.

Conceptualmente:

```text
Movimiento de inventario
    ↓
Tipo de movimiento
    ↓
Origen
```

El origen puede corresponder a:

```text
Compra
Producción
Venta
Otro proceso explícitamente definido
```

No debe almacenarse un movimiento sin información suficiente para comprender por qué ocurrió.

---

# 12. Producción y lote son conceptos diferentes

Se establece explícitamente que:

```text
Producción
≠
Lote
```

La producción representa un proceso.

El lote representa el resultado identificable y trazable de una producción.

La relación conceptual es:

```text
Producción
    ↓
Genera
    ↓
Lote
```

Esta separación debe mantenerse aunque inicialmente una producción genere un único lote.

No se deben fusionar ambos conceptos únicamente porque en la primera versión del sistema exista una relación frecuente de uno a uno.

---

# 13. El lote conserva su información histórica

Cada lote debe conservar su propia información histórica.

Como mínimo:

```text
Producto

Producción de origen

Fecha de creación

Fecha de vencimiento

Cantidad inicial

Información necesaria para determinar
su disponibilidad
```

La fecha de vencimiento pertenece al lote.

No debe calcularse permanentemente a partir de la configuración actual del producto.

La razón es que un lote representa un hecho histórico.

---

# 14. La fecha de vencimiento es histórica

La decisión es:

> **La fecha de vencimiento se registra en el lote y permanece asociada a ese lote.**

Si posteriormente cambia:

* la duración esperada del producto;
* la configuración del producto;
* una regla de cálculo de vencimiento;

los lotes existentes no deben cambiar automáticamente.

Ejemplo:

```text
Producto A

Configuración original:
10 días

Lote 001
Creado:
1 de agosto

Vencimiento:
11 de agosto
```

Posteriormente:

```text
Nueva configuración:
7 días
```

El lote anterior conserva:

```text
Vencimiento:
11 de agosto
```

---

# 15. Los precios históricos no se sustituyen por precios actuales

Los valores económicos utilizados dentro de operaciones deben conservarse en el contexto histórico correspondiente.

Ejemplo:

```text
Precio actual del insumo:
$12.000
```

Esto no modifica automáticamente:

```text
Compra anterior:
$9.000
```

La compra debe conservar el precio registrado en el momento de la operación.

Esta decisión protege:

* costos históricos;
* análisis posteriores;
* trazabilidad financiera;
* reconstrucción de operaciones.

---

# 16. El producto y su receta son conceptos separados

Un producto representa aquello que el negocio produce o comercializa.

Una receta representa la composición definida para producir un producto.

Por tanto:

```text
Producto
    ↓
Puede tener
    ↓
Receta
```

La receta no debe fusionarse con el producto.

La composición de ingredientes debe conservarse como una estructura propia.

Conceptualmente:

```text
Receta
    ↓
Detalle de receta
    ↓
Insumos y cantidades
```

---

# 17. La receta no sustituye el detalle histórico de producción

Una receta representa una definición.

Una producción representa lo que realmente ocurrió.

Por tanto:

```text
RECETA
        ≠
DETALLE DE PRODUCCIÓN
```

Una receta puede indicar:

```text
Para producir X:
utilizar estas cantidades.
```

El detalle de producción registra:

```text
Para esta producción concreta:
se utilizaron estas cantidades.
```

La producción debe conservar su propio detalle histórico.

No debe depender exclusivamente de consultar la receta actual.

Esto permite preservar diferencias entre:

```text
Cantidad planificada
```

y:

```text
Cantidad realmente utilizada
```

cuando el proceso de negocio requiera registrar dicha diferencia.

---

# 18. Cliente y venta permanecen separados

El cliente representa una entidad reutilizable.

La venta representa una operación.

La relación conceptual es:

```text
Cliente
    ↓
Puede participar en
    ↓
Muchas ventas
```

Una venta no debe convertirse en parte del registro maestro del cliente.

La información transaccional debe permanecer dentro de la operación correspondiente.

---

# 19. Venta y pago permanecen separados

Una venta representa la operación comercial.

Un pago representa un movimiento financiero relacionado con una obligación derivada de una venta.

Por tanto:

```text
Venta
    ↓
Puede tener
    ↓
Uno o varios pagos
```

No se debe asumir que:

```text
Venta
=
Pago
```

Una venta puede:

* pagarse inmediatamente;
* quedar pendiente;
* recibir pagos posteriores;
* recibir más de un pago.

La estructura debe permitir representar estas situaciones sin duplicar ventas.

---

# 20. Los gastos son operaciones independientes

Un gasto no debe confundirse automáticamente con:

* una compra de inventario;
* una venta;
* un pago de cliente;
* un costo de producción.

El gasto representa una salida económica con su propia responsabilidad.

La relación entre gasto, costo y rentabilidad debe resolverse mediante las reglas correspondientes.

No se debe utilizar una sola entidad para representar simultáneamente conceptos económicamente diferentes.

---

# 21. Costos y rentabilidad no deben introducir transacciones ficticias

El costo y la rentabilidad representan análisis derivados de operaciones reales.

Por tanto, no se deben crear transacciones artificiales únicamente para almacenar resultados que pueden derivarse de:

```text
Compras

Producción

Ventas

Gastos

Inventario
```

La decisión sobre qué resultados deben calcularse o conservarse históricamente dependerá de las reglas específicas de cada cálculo.

La existencia de un módulo de costos o rentabilidad no implica necesariamente la existencia de una tabla independiente para cada resultado.

---

# 22. El dashboard no es propietario de datos

El dashboard es un módulo de consulta y visualización.

No debe convertirse en propietario de:

```text
Compras

Inventario

Producción

Ventas

Pagos

Gastos
```

Su función es consumir información producida por los módulos responsables.

La regla es:

> **El dashboard consulta y presenta información; no redefine ni duplica la lógica de origen de los datos.**

---

# 23. Evitar duplicación innecesaria de información

Una relación debe almacenarse una sola vez en el lugar donde corresponda según la responsabilidad del modelo.

No se debe duplicar información para simplificar una pantalla.

Ejemplo conceptual:

Incorrecto:

```text
Venta
    ├── Cliente
    ├── Total
    └── Inventario actualizado manualmente
```

si la actualización de inventario pertenece a un proceso diferente.

La duplicación solo podrá considerarse cuando exista una necesidad concreta de:

* historial;
* rendimiento;
* cálculo;
* consulta;
* integración;

y la decisión deberá quedar documentada.

---

# 24. Las claves técnicas no reemplazan la identidad de negocio

Cada entidad persistente requerirá un identificador técnico adecuado para su implementación.

Sin embargo, cuando el negocio requiera un código o número visible, este debe tratarse como un concepto separado.

Ejemplo conceptual:

```text
Identificador técnico interno
        ≠
Código visible del negocio
```

Esto evita utilizar accidentalmente códigos de negocio como mecanismo único de implementación sin considerar:

* cambios de formato;
* generación;
* validación;
* legibilidad;
* referencias externas.

La estrategia técnica concreta de identificadores será definida durante la implementación del modelo físico.

---

# 25. Las relaciones históricas no deben romperse

No se debe permitir una eliminación que destruya una operación histórica.

Ejemplo:

```text
Proveedor
    ↓
Tiene compras históricas
```

La eliminación física del proveedor podría dejar compras sin referencia válida.

La misma consideración aplica a:

```text
Insumos

Productos

Clientes

Presentaciones

Recetas

Lotes
```

La estrategia de:

```text
eliminación
desactivación
restricción
```

debe definirse según cada entidad.

Pero la decisión general es:

> **La conservación de la integridad histórica tiene prioridad sobre la eliminación física simplificada.**

---

# 26. Las correcciones deben conservar la coherencia histórica

Una corrección no debe consistir automáticamente en modificar cualquier dato registrado.

Primero debe determinarse:

```text
¿El registro todavía representa
una operación editable?
```

o:

```text
¿Ya representa un hecho histórico confirmado?
```

Las operaciones confirmadas requerirán mecanismos de corrección compatibles con la trazabilidad.

No se establece todavía un mecanismo único de reversión para todos los módulos.

Cada proceso deberá definirlo cuando se implemente.

---

# 27. No introducir relaciones polimórficas prematuramente

El movimiento de inventario puede tener diferentes operaciones de origen.

Sin embargo, la implementación no debe adoptar automáticamente una solución compleja únicamente por anticipación.

La necesidad conceptual es:

```text
Movimiento
    ↓
Tiene una causa u origen identificable
```

La implementación física concreta de esa relación deberá decidirse cuando se diseñe el esquema de persistencia.

No se debe imponer desde este documento una estructura técnica específica que todavía no haya sido validada contra todos los casos de uso.

---

# 28. No introducir normalización extrema

El modelo debe evitar tanto:

```text
Duplicación innecesaria
```

como:

```text
Fragmentación excesiva
```

No se debe dividir una entidad en múltiples tablas únicamente para cumplir una interpretación rígida de normalización.

La estructura debe responder a:

* significado de los datos;
* integridad;
* trazabilidad;
* mantenimiento;
* consultas necesarias.

La normalización es una herramienta de diseño, no una obligación de fragmentar todos los conceptos posibles.

---

# 29. No introducir desnormalización prematura

Tampoco se deben duplicar datos para optimizar problemas que todavía no existen.

Ejemplo conceptual:

```text
Tabla de resumen permanente
```

no debe crearse únicamente porque el dashboard probablemente necesitará estadísticas.

Primero debe existir una necesidad real de rendimiento o consulta que justifique dicha estructura.

---

# 30. Evolución del modelo de datos

El modelo de datos puede evolucionar.

Pero una modificación debe responder a una necesidad identificable.

El proceso será:

```text
Nueva necesidad
        ↓
Revisión del modelo actual
        ↓
Verificación contra documentación de dominio
        ↓
Identificación de impacto
        ↓
Decisión explícita
        ↓
Actualización documental
        ↓
Modificación del modelo
        ↓
Migración correspondiente
```

No se deben agregar columnas, relaciones o tablas únicamente porque:

```text
"podrían servir después"
```

---

# 31. Decisiones que requieren documentación explícita

Las siguientes modificaciones deben documentarse antes de implementarse cuando alteren la lógica definida:

* Crear una nueva entidad.
* Eliminar una entidad existente.
* Cambiar una relación principal.
* Convertir una relación de uno a uno en uno a muchos.
* Cambiar la responsabilidad de un módulo.
* Introducir duplicación histórica.
* Cambiar el mecanismo de inventario.
* Modificar la trazabilidad entre producción y lote.
* Modificar la relación entre venta y pago.
* Introducir una nueva fuente de movimientos de inventario.

Cuando corresponda, la decisión deberá reflejarse en:

```text
docs/domains/
```

y, si representa una decisión arquitectónica relevante:

```text
docs/decisions/
```

---

# 32. Decisiones actuales congeladas

A la fecha de esta documentación, se consideran decisiones base del modelo:

```text
1. Los módulos representan responsabilidades de negocio,
   no simplemente tablas.

2. Los detalles de compra, producción y venta
   pertenecen a sus operaciones principales.

3. El inventario se explica mediante movimientos.

4. Todo movimiento debe tener una causa identificable.

5. Producción y lote son conceptos separados.

6. El lote conserva su producción de origen.

7. El lote registra su fecha de creación.

8. El lote registra y conserva su fecha de vencimiento.

9. Las configuraciones actuales no deben modificar
   automáticamente datos históricos.

10. Los precios históricos se conservan
    dentro del contexto de la operación correspondiente.

11. La receta representa una definición;
    el detalle de producción representa lo ocurrido.

12. Cliente y venta son conceptos separados.

13. Venta y pago son conceptos separados.

14. Los gastos son operaciones independientes.

15. Costos y rentabilidad derivan de información real
    y no deben generar transacciones ficticias.

16. El dashboard no es propietario de datos.

17. Las relaciones históricas no deben romperse
    por cambios o eliminaciones simplificadas.

18. Las nuevas entidades o relaciones que alteren
    la lógica actual requieren una decisión explícita.
```

---

# 33. Estado de implementación

Este documento define decisiones del modelo conceptual y lógico.

Todavía no define:

```text
Tipos concretos de PostgreSQL.

Tipos de columnas.

Claves primarias específicas.

Claves foráneas específicas.

Índices.

Restricciones SQL.

Enums técnicos.

Estrategias de Prisma.

Migraciones.
```

Estas decisiones deberán tomarse posteriormente durante el diseño del modelo físico.

La implementación física debe respetar las decisiones establecidas en este documento y en los documentos de dominio.

---

# 34. Principio final

El modelo de datos debe evolucionar de forma controlada.

La regla definitiva es:

```text
NECESIDAD REAL
        ↓
REVISIÓN DEL DOMINIO
        ↓
VALIDACIÓN CONTRA EL MODELO
        ↓
DECISIÓN DOCUMENTADA
        ↓
IMPLEMENTACIÓN
```

No se agregan entidades por anticipación.

No se eliminan relaciones por comodidad técnica.

No se duplican datos para resolver problemas hipotéticos.

No se modifica la historia para adaptarla al estado actual.

> **El modelo de datos debe representar el negocio, preservar su historia y evolucionar únicamente mediante decisiones explícitas y documentadas.**
