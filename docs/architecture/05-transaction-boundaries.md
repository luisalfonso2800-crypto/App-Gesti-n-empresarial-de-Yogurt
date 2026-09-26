# Límites de Transacción — V1

## 1. Propósito del documento

Este documento define los límites transaccionales del backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es determinar cuándo varias operaciones de persistencia deben ejecutarse como una única unidad atómica y cuándo deben mantenerse separadas.

Este documento busca garantizar que una operación crítica del negocio no deje el sistema en un estado parcialmente aplicado.

Se aplica principalmente a las operaciones relacionadas con:

* compras;
* inventario;
* producción;
* lotes;
* ventas;
* pagos;
* gastos;
* cálculos que dependan de hechos históricos.

Este documento complementa:

```text
03-api-design.md
04-persistence-boundaries.md
```

y debe respetar especialmente:

```text
docs/data-model/03-data-integrity-rules.md
docs/data-model/04-history-and-traceability.md
docs/data-model/06-inventory-flow.md
docs/data-model/07-business-processes.md
docs/data-model/08-cross-module-rules.md
docs/data-model/12-vba-fidelity-validation.md
```

---

# 2. Principio fundamental

Una transacción debe representar una unidad coherente de negocio.

La regla general es:

```text
UNA OPERACIÓN DE NEGOCIO
        │
        ├── varios cambios dependientes
        │
        ▼
UNA UNIDAD TRANSACCIONAL
```

Si todos los cambios deben existir juntos para que la operación tenga sentido, entonces deben confirmarse juntos.

No debe ocurrir:

```text
OPERACIÓN PRINCIPAL EXITOSA
        │
        ▼
EFECTO OBLIGATORIO FALLIDO
        │
        ▼
SISTEMA INCONSISTENTE
```

La transacción debe garantizar conceptualmente:

```text
TODO SE APLICA
```

o:

```text
NADA SE APLICA
```

cuando los cambios formen parte de la misma unidad de negocio.

---

# 3. Qué define un límite transaccional

El límite de una transacción no debe definirse simplemente por:

```text
una tabla
```

ni por:

```text
un módulo técnico
```

El límite debe definirse por la operación real del negocio.

Ejemplo:

```text
REGISTRAR COMPRA
```

puede involucrar:

```text
purchase
purchase items
inventory movements
inventory state
```

Aunque existan diferentes entidades y responsabilidades, si la lógica establece que la compra confirmada debe producir el efecto correspondiente en inventario, ambas partes forman una misma operación coherente.

Por lo tanto:

```text
OPERACIÓN DE NEGOCIO
        ↓
DEFINE
        ↓
LÍMITE TRANSACCIONAL
```

No:

```text
TABLA
        ↓
DEFINE
        ↓
TRANSACCIÓN
```

---

# 4. Regla para determinar si se necesita una transacción

Antes de implementar una operación debe responderse:

```text
1. ¿La operación modifica más de un registro?

2. ¿Los cambios dependen unos de otros?

3. ¿Un cambio sin el otro deja el sistema inconsistente?

4. ¿La operación produce un efecto obligatorio en otro módulo?

5. ¿La operación modifica inventario?

6. ¿La operación crea información histórica relacionada?

7. ¿Un error intermedio debe revertir todo lo anterior?
```

Si la respuesta indica que los cambios forman una única operación coherente, deberá utilizarse un límite transaccional.

---

# 5. Transacción no significa transacción global del sistema

El sistema no utilizará una única transacción global para procesos independientes.

Incorrecto:

```text
COMPRAS
        │
        ▼
TRANSACCIÓN GLOBAL
        │
        ├── INVENTARIO
        ├── PRODUCCIÓN
        ├── VENTAS
        ├── PAGOS
        └── GASTOS
```

Las operaciones independientes deben mantener sus propios límites.

Correcto:

```text
COMPRA
    └── TRANSACCIÓN A

PRODUCCIÓN
    └── TRANSACCIÓN B

VENTA
    └── TRANSACCIÓN C

PAGO
    └── TRANSACCIÓN D

GASTO
    └── TRANSACCIÓN E
```

Cada operación debe controlar únicamente los cambios necesarios para completar su propia responsabilidad.

---

# 6. Transacción de compra

La compra representa una operación compuesta.

Conceptualmente:

```text
REGISTRAR / CONFIRMAR COMPRA
        │
        ├── validar proveedor
        │
        ├── validar insumos
        │
        ├── registrar compra
        │
        ├── registrar detalles
        │
        └── registrar efecto correspondiente
            en inventario
```

Cuando la lógica implementada determine que una compra confirmada genera entrada de inventario, la operación deberá completarse de manera consistente.

No debe ocurrir:

```text
COMPRA CONFIRMADA
        │
        X
SIN EFECTO EN INVENTARIO
```

Tampoco:

```text
MOVIMIENTO DE INVENTARIO
        │
        X
COMPRA NO REGISTRADA
```

Cuando ambos efectos formen parte de la misma confirmación.

La unidad transaccional deberá incluir todos los cambios obligatorios de la operación.

---

# 7. Transacción de producción

La ejecución de producción representa una de las operaciones más sensibles del sistema.

Conceptualmente puede involucrar:

```text
PRODUCCIÓN
        │
        ├── validar receta
        │
        ├── validar disponibilidad
        │
        ├── registrar producción
        │
        ├── registrar detalle de producción
        │
        ├── registrar consumo de insumos
        │
        ├── registrar movimientos de inventario
        │
        ├── crear lote
        │
        └── registrar existencia del producto terminado
```

Los elementos concretos dependerán del modelo validado y de las reglas de implementación.

Sin embargo, el principio es:

```text
PRODUCCIÓN EJECUTADA
        │
        ├── consumo registrado
        ├── trazabilidad registrada
        ├── lote creado
        └── resultado inventariable registrado
```

No debe quedar una producción parcialmente ejecutada.

Incorrecto:

```text
PRODUCCIÓN REGISTRADA
        │
        ├── insumos descontados
        │
        X
        └── lote no creado
```

o:

```text
LOTE CREADO
        │
        X
PRODUCTO TERMINADO NO REGISTRADO
```

si ambos resultados son obligatorios dentro del flujo definido.

La ejecución completa debe respetar un límite transaccional coherente.

---

# 8. Transacción de venta

La venta representa una operación histórica que puede producir efectos sobre inventario.

Conceptualmente:

```text
REGISTRAR VENTA
        │
        ├── validar cliente cuando corresponda
        │
        ├── validar productos
        │
        ├── validar disponibilidad
        │
        ├── registrar venta
        │
        ├── registrar detalle
        │
        └── registrar salida correspondiente
            de inventario
```

No debe ocurrir:

```text
VENTA CONFIRMADA
        │
        X
INVENTARIO SIN ACTUALIZAR
```

cuando la venta debe generar una salida.

Tampoco:

```text
INVENTARIO DESCONTADO
        │
        X
VENTA NO REGISTRADA
```

si el movimiento depende exclusivamente de esa venta.

Los cambios obligatorios de una venta confirmada deberán mantenerse dentro de una unidad coherente.

---

# 9. Transacción de pago

El registro de un pago debe mantener consistencia con la información financiera que afecta.

Conceptualmente:

```text
REGISTRAR PAGO
        │
        ├── validar referencia correspondiente
        │
        ├── validar monto
        │
        ├── registrar pago
        │
        └── actualizar información derivada
            cuando corresponda
```

La creación del pago y cualquier actualización obligatoria directamente asociada deben completarse juntas.

No debe ocurrir:

```text
PAGO REGISTRADO
        │
        X
ESTADO FINANCIERO OBLIGATORIO
SIN ACTUALIZAR
```

cuando dicho estado forme parte de la operación.

Sin embargo, los cálculos derivados que puedan reconstruirse a partir del historial no deben necesariamente convertirse en parte de la transacción de pago.

---

# 10. Transacción de gasto

El registro de un gasto representa principalmente un hecho financiero histórico.

Conceptualmente:

```text
REGISTRAR GASTO
        │
        ├── validar información
        │
        └── persistir gasto
```

Si el gasto requiere registros adicionales obligatorios según su modelo definitivo, estos deberán formar parte de la misma transacción.

Los cálculos de:

```text
costs
profitability
dashboard
```

no deben bloquear necesariamente la confirmación del gasto si pueden recalcularse posteriormente a partir del hecho histórico persistido.

La regla es:

```text
HECHO HISTÓRICO
        ↓
DEBE PERSISTIR CORRECTAMENTE
```

Los resultados derivados pueden calcularse posteriormente cuando el modelo así lo permita.

---

# 11. Transacción de movimientos de inventario

Un movimiento de inventario no debe quedar registrado sin una causa válida cuando el modelo exige una operación de origen.

Conceptualmente:

```text
OPERACIÓN ORIGEN
        │
        ▼
MOVIMIENTO DE INVENTARIO
        │
        ▼
ESTADO RESULTANTE
```

Cuando el movimiento y la actualización del estado de inventario sean dependientes, ambos deben mantenerse consistentes.

No debe ocurrir:

```text
MOVIMIENTO REGISTRADO
        │
        X
ESTADO DE INVENTARIO NO ACTUALIZADO
```

ni:

```text
ESTADO MODIFICADO
        │
        X
SIN MOVIMIENTO QUE EXPLIQUE EL CAMBIO
```

cuando el modelo de inventario requiera trazabilidad mediante movimientos.

---

# 12. Inventario y operaciones externas

Los módulos que producen efectos sobre inventario no deben abrir una transacción independiente que pueda confirmar parcialmente el proceso global cuando la operación de origen depende de ese efecto.

Ejemplo conceptual incorrecto:

```text
PURCHASE TRANSACTION
        │
        ├── crear compra
        │
        ▼
COMMIT
        │
        ▼
INVENTORY TRANSACTION
        │
        X
        FAIL
```

Resultado:

```text
COMPRA EXISTE
PERO EL EFECTO OBLIGATORIO FALLÓ
```

Cuando ambos cambios deban existir juntos, el límite transaccional debe abarcar la operación completa.

Conceptualmente:

```text
PURCHASE OPERATION
        │
        ├── purchase
        ├── purchase items
        ├── inventory movement
        └── inventory effect
                │
                ▼
             COMMIT
```

---

# 13. Coordinación entre módulos y transacciones

Los límites de módulos no eliminan la necesidad de coordinar operaciones.

Una operación puede involucrar capacidades de varios módulos.

Ejemplo:

```text
PURCHASES
        │
        ▼
INVENTORY
```

Esto no significa que el módulo `purchases` pueda modificar arbitrariamente cualquier dato interno de `inventory`.

La coordinación debe seguir una capacidad definida.

Conceptualmente:

```text
PURCHASE OPERATION
        │
        ▼
AUTHORIZED INVENTORY CAPABILITY
        │
        ▼
PERSISTENCE
```

Si la operación completa debe ser atómica, la implementación debe permitir que todas las modificaciones necesarias participen en el mismo límite transaccional.

La forma técnica concreta deberá definirse durante la implementación.

---

# 14. Regla de la operación principal

Cada proceso debe tener una operación responsable de coordinar el límite transaccional.

Ejemplo:

```text
CONFIRM PURCHASE
        │
        ▼
Purchases Application Service
        │
        ├── validar
        ├── persistir compra
        └── solicitar efecto inventario
                │
                ▼
             COMMIT
```

Otro ejemplo:

```text
EXECUTE PRODUCTION
        │
        ▼
Production Application Service
        │
        ├── validar
        ├── registrar producción
        ├── registrar consumo
        ├── crear lote
        └── registrar resultado
                │
                ▼
             COMMIT
```

El componente responsable de la operación no se convierte automáticamente en propietario de los datos de otros módulos.

Coordina la operación; cada módulo conserva sus reglas y responsabilidades.

---

# 15. Validaciones antes de iniciar la transacción

Las validaciones que no requieren modificar datos deben realizarse antes de iniciar una transacción cuando sea posible.

Ejemplos:

```text
validar formato
validar campos requeridos
validar existencia inicial
validar estructura de solicitud
```

El objetivo es evitar mantener transacciones abiertas innecesariamente.

Sin embargo, las validaciones críticas que dependen del estado actual de los datos deben seguir estando protegidas dentro del contexto de la operación.

Ejemplo:

```text
VALIDAR INVENTARIO DISPONIBLE
        │
        ▼
CONSUMIR INVENTARIO
```

No debe ocurrir:

```text
VALIDAR
        │
        ▼
ESPERAR
        │
        ▼
OTRA OPERACIÓN MODIFICA EL INVENTARIO
        │
        ▼
CONSUMIR BASÁNDOSE EN INFORMACIÓN ANTIGUA
```

La implementación deberá proteger las condiciones críticas frente a cambios concurrentes.

---

# 16. Validaciones dentro del límite transaccional

Deben realizarse dentro del contexto protegido de la operación las validaciones que dependan de información que pueda cambiar concurrentemente.

Ejemplos:

```text
disponibilidad de inventario
estado actual de una operación
existencia de saldo disponible
duplicación de una confirmación
```

La regla es:

```text
VALIDACIÓN DEPENDIENTE DEL ESTADO ACTUAL
        │
        ▼
PROTEGER JUNTO CON LA MODIFICACIÓN
```

No debe separarse una validación crítica de la modificación que depende de ella cuando eso permita inconsistencias por concurrencia.

---

# 17. Transacciones y cálculos derivados

Los módulos:

```text
costs
profitability
dashboard
```

no deben introducir automáticamente transacciones adicionales sobre cada operación histórica.

Por ejemplo:

```text
REGISTRAR VENTA
        │
        ├── persistir venta
        ├── persistir detalles
        └── aplicar efecto obligatorio
                │
                ▼
             COMMIT
                │
                ▼
        CONSULTAS Y CÁLCULOS DERIVADOS
```

Si un valor puede reconstruirse correctamente a partir de hechos históricos, su cálculo puede mantenerse fuera del límite transaccional principal.

Esto evita convertir una operación simple en:

```text
VENTA
        +
RECALCULAR TODOS LOS COSTOS
        +
RECALCULAR TODA LA RENTABILIDAD
        +
RECALCULAR DASHBOARD
```

como requisito para confirmar una sola venta.

Los cálculos derivados deben seguir las responsabilidades definidas en:

```text
09-calculation-responsibilities.md
```

---

# 18. Fallo de una operación transaccional

Cuando un cambio obligatorio falla, la operación completa debe revertirse.

Conceptualmente:

```text
BEGIN
    │
    ├── cambio A
    ├── cambio B
    ├── cambio C
    │
    X
    fallo
    │
    ▼
ROLLBACK
```

El resultado esperado es:

```text
NO EXISTE
CAMBIO A PARCIAL
CAMBIO B PARCIAL
CAMBIO C PARCIAL
```

La aplicación debe devolver un resultado coherente al cliente.

No debe informar éxito cuando la operación completa no fue confirmada.

---

# 19. Confirmación única

Una operación histórica crítica no debe ejecutarse múltiples veces accidentalmente.

Esto es especialmente relevante para:

```text
purchases
production
sales
payments
inventory effects
```

Debe analizarse el caso:

```text
CLIENTE ENVÍA LA SOLICITUD
        │
        ▼
OPERACIÓN SE EJECUTA
        │
        ▼
RESPUESTA SE PIERDE
        │
        ▼
CLIENTE REINTENTA
```

El sistema no debe asumir automáticamente que una nueva solicitud representa una nueva operación legítima.

La estrategia técnica de idempotencia se definirá durante la implementación de las operaciones críticas.

---

# 20. Operaciones de cancelación y reversión

Una operación histórica confirmada no debe revertirse mediante una simple eliminación cuando ya produjo efectos.

Incorrecto:

```text
DELETE sale
```

si la venta ya produjo una salida de inventario.

La corrección debe mantener coherencia:

```text
CANCELAR / ANULAR OPERACIÓN
        │
        ├── registrar cambio de estado
        ├── revertir efectos permitidos
        └── conservar trazabilidad
```

Cuando una reversión implique varios cambios dependientes, esos cambios deberán ejecutarse dentro de su propio límite transaccional.

Conceptualmente:

```text
CANCEL SALE
        │
        ├── cambiar estado
        ├── revertir efecto permitido
        └── registrar trazabilidad necesaria
                │
                ▼
             COMMIT
```

---

# 21. Transacciones y trazabilidad

La trazabilidad no debe depender de operaciones posteriores independientes.

Si una operación requiere conservar información histórica obligatoria, dicha información debe persistirse junto con el hecho correspondiente.

Ejemplo conceptual:

```text
EXECUTE PRODUCTION
        │
        ├── production
        ├── production details
        ├── lot information
        │
        ▼
      COMMIT
```

No debe ocurrir:

```text
PRODUCCIÓN CONFIRMADA
        │
        X
REGISTRO DE TRAZABILIDAD PENDIENTE
```

cuando la trazabilidad sea parte obligatoria de la operación.

---

# 22. Transacciones pequeñas y explícitas

Las transacciones deben mantenerse tan pequeñas como sea razonablemente posible.

No deben incluir:

* llamadas HTTP externas;
* procesos lentos;
* generación pesada de reportes;
* operaciones de presentación;
* cálculos masivos no obligatorios;
* tareas que puedan ejecutarse posteriormente.

La estructura deseada es:

```text
PREPARAR
    │
    ▼
VALIDAR
    │
    ▼
INICIAR TRANSACCIÓN
    │
    ├── cambios obligatorios
    │
    ▼
COMMIT
    │
    ▼
OPERACIONES NO CRÍTICAS
```

Esto reduce el tiempo durante el cual los datos permanecen bloqueados o sujetos a coordinación transaccional.

---

# 23. No crear transacciones por defecto

No toda escritura requiere una transacción explícita de múltiples pasos.

Ejemplo simple:

```text
CREAR PRESENTACIÓN
```

puede requerir únicamente:

```text
validar
+
crear registro
```

No es necesario diseñar una transacción compleja únicamente porque la operación escribe información.

La complejidad transaccional debe responder a una necesidad real.

---

# 24. Operaciones que inicialmente requieren revisión transaccional

Antes de su implementación deberán revisarse explícitamente los límites transaccionales de:

```text
create / confirm purchase

execute production

create / confirm sale

register payment

cancel or reverse historical operation

authorized inventory adjustment
```

Estas operaciones afectan directamente uno o varios de los siguientes elementos:

```text
inventory
history
cost
traceability
financial state
```

Por esta razón, no deben implementarse como simples operaciones CRUD sin definir previamente su unidad de consistencia.

---

# 25. Responsabilidad de la capa de aplicación

La capa responsable de ejecutar el caso de uso debe definir el flujo completo de la operación.

Conceptualmente:

```text
APPLICATION SERVICE
        │
        ├── validar reglas
        ├── coordinar capacidades
        ├── definir operación
        └── controlar resultado
```

La persistencia ejecuta los cambios necesarios.

Los repositorios no deben decidir por sí mismos:

```text
cuándo iniciar un proceso de negocio
qué módulo coordinar
qué operación cancelar
qué efectos producir
```

La coordinación pertenece al caso de uso que representa la operación del negocio.

---

# 26. Regla para crear un nuevo límite transaccional

Antes de implementar una nueva operación compuesta debe responderse:

```text
1. ¿Cuál es el hecho principal?

2. ¿Qué cambios son obligatorios?

3. ¿Qué cambios son derivados?

4. ¿Qué cambios pueden ejecutarse después?

5. ¿Qué ocurre si falla cada paso?

6. ¿Qué información histórica debe persistirse?

7. ¿Qué módulos participan?

8. ¿Quién coordina la operación?

9. ¿Cuál es el punto exacto de confirmación?

10. ¿Puede ejecutarse dos veces accidentalmente?
```

Después de responder estas preguntas se podrá definir:

```text
TRANSACTION BOUNDARY
```

No debe crearse una transacción compleja antes de conocer el flujo real.

---

# 27. Relación con Prisma

La implementación inicial utilizará el mecanismo transaccional proporcionado por Prisma cuando una operación requiera atomicidad entre múltiples cambios de persistencia.

La tecnología no define el límite.

La relación correcta es:

```text
REGLA DEL NEGOCIO
        ↓
LÍMITE TRANSACCIONAL
        ↓
IMPLEMENTACIÓN
        ↓
PRISMA TRANSACTION
```

No:

```text
PRISMA TRANSACTION
        ↓
DECIDE
        ↓
REGLA DEL NEGOCIO
```

La implementación concreta deberá adaptarse a la arquitectura real del módulo sin introducir transacciones innecesarias.

---

# 28. Evolución futura

Inicialmente el sistema funciona como un backend único con una base de datos central.

Por esta razón, las operaciones críticas pueden coordinarse mediante transacciones locales de base de datos.

Si en el futuro la arquitectura evoluciona hacia:

```text
múltiples bases de datos
servicios separados
procesamiento asíncrono
integraciones externas
```

los límites transaccionales deberán revisarse.

La arquitectura futura no debe anticiparse antes de existir una necesidad real.

Cualquier cambio deberá respetar:

```text
docs/architecture/architecture-evolution.md
```

---

# 29. Estado actual

```text
Documento: 05-transaction-boundaries.md
Versión: V1
Estado: APROBADO COMO BASE DE LÍMITES TRANSACCIONALES
```

Este documento establece que las transacciones deben representar unidades reales de negocio. Las operaciones críticas deben confirmar todos sus cambios obligatorios de forma coherente o revertirse completamente, preservando la integridad, el inventario y la trazabilidad del sistema.
