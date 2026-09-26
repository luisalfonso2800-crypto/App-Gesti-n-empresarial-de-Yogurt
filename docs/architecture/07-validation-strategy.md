# Estrategia de Validación — V1

## 1. Propósito del documento

Este documento define cómo se validará la información en el backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es establecer una estrategia uniforme para garantizar que:

* los datos recibidos tengan una estructura válida;
* las reglas del negocio se cumplan;
* los datos persistidos mantengan su integridad;
* las operaciones críticas validen correctamente su estado actual;
* las validaciones no se dupliquen innecesariamente;
* cada capa tenga una responsabilidad clara.

La validación no pertenece a un único lugar del sistema.

El modelo general será:

```text
CLIENTE
   │
   ▼
VALIDACIÓN DE ENTRADA
   │
   ▼
VALIDACIÓN DE CASO DE USO
   │
   ▼
VALIDACIÓN DE REGLAS DE NEGOCIO
   │
   ▼
VALIDACIÓN DE INTEGRIDAD
   │
   ▼
PERSISTENCIA
```

Este documento complementa:

```text
03-api-design.md
04-persistence-boundaries.md
05-transaction-boundaries.md
06-error-handling.md
```

También debe respetar:

```text
docs/data-model/03-data-integrity-rules.md
docs/data-model/04-history-and-traceability.md
docs/data-model/06-inventory-flow.md
docs/data-model/07-business-processes.md
docs/data-model/08-cross-module-rules.md
docs/data-model/09-calculation-responsibilities.md
```

---

# 2. Principio fundamental

Cada validación debe ejecutarse en el nivel donde tiene sentido.

No toda validación pertenece al controlador.

No toda validación pertenece a la base de datos.

No toda validación pertenece al mismo módulo.

La estrategia será:

```text
VALIDAR ESTRUCTURA
        ↓
VALIDAR DATOS
        ↓
VALIDAR REGLAS
        ↓
VALIDAR ESTADO ACTUAL
        ↓
PROTEGER INTEGRIDAD
```

Cada etapa responde a una pregunta diferente.

```text
¿La solicitud tiene la forma correcta?
```

```text
¿Los valores recibidos son válidos?
```

```text
¿La operación está permitida?
```

```text
¿El estado actual permite ejecutarla?
```

```text
¿La base de datos puede mantener la consistencia?
```

---

# 3. Capas de validación

El sistema utilizará cinco niveles conceptuales de validación.

```text
1. VALIDACIÓN DE ESTRUCTURA
```

```text
2. VALIDACIÓN DE DATOS
```

```text
3. VALIDACIÓN DE NEGOCIO
```

```text
4. VALIDACIÓN DE ESTADO E INTEGRIDAD OPERACIONAL
```

```text
5. RESTRICCIONES DE PERSISTENCIA
```

La misma regla no debe repetirse en todas las capas sin necesidad.

---

# 4. Validación de estructura

La validación de estructura verifica que la solicitud recibida tenga el formato esperado.

Ejemplos:

```text
campo requerido presente
```

```text
tipo de dato correcto
```

```text
objeto con estructura válida
```

```text
lista con formato esperado
```

```text
fecha en formato válido
```

```text
valor numérico recibido como número válido
```

Esta validación ocurre en el límite de entrada.

Conceptualmente:

```text
HTTP REQUEST
        │
        ▼
DTO
        │
        ▼
STRUCTURE VALIDATION
```

Si la solicitud no cumple la estructura requerida, la operación no debe continuar.

---

# 5. Validación de datos simples

Los valores individuales deben cumplir las restricciones básicas definidas para cada operación.

Ejemplos:

```text
quantity > 0
```

```text
price >= 0
```

```text
name no vacío
```

```text
fecha válida
```

```text
identificador con formato válido
```

Esta validación responde a:

```text
¿EL VALOR RECIBIDO TIENE SENTIDO POR SÍ MISMO?
```

Ejemplo:

```text
cantidad = -5
```

es inválida independientemente del estado del sistema.

Por lo tanto, no requiere consultar inventario, proveedores ni otras entidades para determinar que es incorrecta.

---

# 6. Validación de relaciones

Cuando una operación referencia otra entidad, debe validarse que la relación requerida exista.

Ejemplo conceptual:

```text
CREATE PRODUCT
        │
        └── presentationId
                │
                ▼
        ¿EXISTE LA PRESENTACIÓN?
```

Otros ejemplos:

```text
purchase → supplier
```

```text
recipe → product
```

```text
recipe detail → supply
```

```text
sale → client
```

La validación debe respetar la obligatoriedad real definida en el modelo.

No debe asumirse que toda relación es obligatoria si la documentación del dominio no lo establece.

---

# 7. Validación de reglas de negocio

Las reglas de negocio determinan si una operación válida puede ejecutarse.

Ejemplo:

```text
REQUEST VÁLIDO
        │
        ▼
¿LA OPERACIÓN ESTÁ PERMITIDA?
```

Ejemplos conceptuales:

```text
producir sin insumos suficientes
```

```text
vender una cantidad superior a la disponible
```

```text
utilizar un lote no disponible
```

```text
registrar una operación incompatible con su estado actual
```

```text
modificar información histórica de una forma no permitida
```

Estas validaciones pertenecen a la lógica del caso de uso y del dominio correspondiente.

No deben implementarse únicamente como validaciones de DTO.

---

# 8. Validación del estado actual

Algunas reglas dependen del estado actual del sistema.

Ejemplo:

```text
¿HAY INVENTARIO SUFICIENTE?
```

La respuesta puede cambiar entre el momento en que llega la solicitud y el momento en que se intenta ejecutar la operación.

Conceptualmente:

```text
SOLICITUD
        │
        ▼
CONSULTAR ESTADO
        │
        ▼
VALIDAR
        │
        ▼
MODIFICAR ESTADO
```

Estas validaciones requieren especial atención en operaciones concurrentes.

No debe asumirse que una validación realizada previamente sigue siendo válida indefinidamente.

---

# 9. Validación y concurrencia

Las validaciones que dependen de información modificable deben protegerse junto con la operación correspondiente.

Ejemplo conceptual:

```text
INVENTARIO = 10
```

Dos operaciones solicitan:

```text
OPERACIÓN A → consumir 7
```

```text
OPERACIÓN B → consumir 7
```

Si ambas validan independientemente:

```text
10 >= 7
```

ambas podrían considerar válida la operación.

Por lo tanto, las validaciones críticas deben ejecutarse dentro de una estrategia que preserve la consistencia.

La regla general es:

```text
VALIDACIÓN CRÍTICA
        +
MODIFICACIÓN DEPENDIENTE
        =
MISMO CONTEXTO DE CONSISTENCIA
```

La implementación concreta deberá respetar los límites definidos en:

```text
05-transaction-boundaries.md
```

---

# 10. Validación en compras

Las operaciones de compras deberán validar, según corresponda:

```text
proveedor válido
```

```text
existencia de los insumos referenciados
```

```text
estructura correcta de los detalles
```

```text
cantidades válidas
```

```text
precios válidos
```

```text
consistencia entre compra y detalles
```

La validación no debe asumir reglas adicionales no documentadas.

El comportamiento debe respetar el modelo definido en:

```text
docs/domains/06-purchases.md
```

y las reglas de integridad correspondientes.

---

# 11. Validación en recetas

Las recetas deberán validar:

```text
producto válido
```

```text
insumos válidos
```

```text
cantidades válidas
```

```text
estructura coherente entre receta y detalle
```

Cuando la documentación del dominio establezca restricciones adicionales sobre recetas activas, modificables o utilizadas históricamente, dichas reglas deberán aplicarse en el caso de uso correspondiente.

La validación debe respetar:

```text
docs/domains/05-recipes.md
```

---

# 12. Validación en producción

La producción requiere validaciones críticas.

Conceptualmente:

```text
PRODUCTION REQUEST
        │
        ├── validar estructura
        │
        ├── validar producción
        │
        ├── validar receta
        │
        ├── validar insumos requeridos
        │
        ├── validar disponibilidad
        │
        └── ejecutar operación
```

Las validaciones deben respetar el flujo real definido para producción.

La producción no debe ejecutarse únicamente porque:

```text
productionId existe
```

Debe validarse que todos los requisitos necesarios para completar el proceso estén satisfechos.

La disponibilidad de inventario representa una validación dependiente del estado actual.

Por lo tanto, debe coordinarse con la operación que consume el inventario.

---

# 13. Validación en inventario

Inventario representa una capacidad transversal.

Las validaciones pueden incluir:

```text
existencia del recurso inventariable
```

```text
cantidad válida
```

```text
tipo de movimiento válido
```

```text
operación origen permitida
```

```text
disponibilidad suficiente cuando exista consumo
```

```text
coherencia entre movimiento y operación origen
```

No debe permitirse modificar el inventario directamente desde cualquier módulo sin respetar sus reglas.

La lógica deberá seguir:

```text
OPERACIÓN AUTORIZADA
        │
        ▼
VALIDACIÓN
        │
        ▼
MOVIMIENTO DE INVENTARIO
        │
        ▼
ESTADO RESULTANTE
```

---

# 14. Validación en lotes

La validación de lotes debe respetar la trazabilidad definida para el sistema.

Deberán validarse, según corresponda:

```text
origen válido
```

```text
fecha de creación válida
```

```text
fecha de vencimiento válida
```

```text
relación válida con la producción correspondiente
```

```text
estado compatible con la operación solicitada
```

No debe permitirse crear información de trazabilidad incoherente.

Ejemplo conceptual:

```text
FECHA DE VENCIMIENTO
        <
FECHA DE CREACIÓN
```

debe ser inválido.

Las reglas concretas deben respetar:

```text
docs/domains/09-lots.md
```

y:

```text
docs/data-model/04-history-and-traceability.md
```

---

# 15. Validación en ventas

Las ventas deberán validar, según corresponda:

```text
estructura válida
```

```text
productos válidos
```

```text
cliente válido cuando la relación sea requerida
```

```text
cantidades válidas
```

```text
precios válidos
```

```text
disponibilidad necesaria
```

```text
estado válido para confirmar la venta
```

La salida de inventario no debe ejecutarse sin que la venta correspondiente cumpla las reglas necesarias.

La validación crítica deberá formar parte de la operación coherente definida para ventas.

---

# 16. Validación en pagos

Los pagos deberán validar:

```text
referencia válida
```

```text
monto válido
```

```text
fecha válida
```

```text
relación válida con la operación correspondiente
```

```text
estado compatible cuando corresponda
```

No se deben asumir reglas adicionales sobre saldos o estados si no están definidas por el modelo y los documentos del dominio.

Cualquier nueva regla deberá documentarse antes de convertirse en comportamiento obligatorio del sistema.

---

# 17. Validación en gastos

Los gastos deberán validar:

```text
estructura válida
```

```text
monto válido
```

```text
fecha válida
```

```text
categoría o referencia válida cuando corresponda
```

```text
información obligatoria definida por el dominio
```

El registro de un gasto no debe depender de cálculos de costos o rentabilidad para considerarse válido.

Primero se valida y persiste el hecho.

Posteriormente, los módulos correspondientes pueden utilizarlo en sus cálculos.

---

# 18. Validación de identificadores

Los identificadores recibidos deben validarse en dos niveles.

Primero:

```text
VALIDACIÓN DE FORMATO
```

Ejemplo:

```text
¿EL IDENTIFICADOR TIENE UNA ESTRUCTURA VÁLIDA?
```

Después:

```text
VALIDACIÓN DE EXISTENCIA
```

Ejemplo:

```text
¿EL RECURSO REFERENCIADO EXISTE?
```

No deben confundirse ambos problemas.

Ejemplo:

```text
ID MAL FORMADO
```

es diferente de:

```text
ID VÁLIDO PERO INEXISTENTE
```

El primero representa un problema de validación.

El segundo representa:

```text
NOT_FOUND
```

---

# 19. Validaciones obligatorias en persistencia

La aplicación no debe confiar únicamente en las validaciones realizadas antes de llegar a la base de datos.

La persistencia debe proteger las reglas estructurales que no pueden violarse.

Ejemplos conceptuales:

```text
identificadores únicos
```

```text
relaciones obligatorias
```

```text
restricciones de clave foránea
```

```text
campos requeridos
```

```text
consistencia definida mediante restricciones persistentes
```

La estrategia será:

```text
APPLICATION VALIDATION
        +
DATABASE CONSTRAINTS
```

No:

```text
APPLICATION VALIDATION
        OR
DATABASE CONSTRAINTS
```

Ambas capas cumplen responsabilidades diferentes.

---

# 20. La base de datos no reemplaza las reglas de negocio

Una restricción de base de datos no debe utilizarse como sustituto de toda la lógica de negocio.

Incorrecto conceptualmente:

```text
INTENTAR INSERTAR
        │
        ▼
SI FALLA LA BASE DE DATOS
        │
        ▼
ENTONCES DECIDIR LA REGLA
```

La lógica debe conocer previamente las reglas que está aplicando.

La base de datos representa una última línea de protección para la integridad estructural.

---

# 21. No duplicar validaciones innecesariamente

La misma validación no debe repetirse sin motivo en:

```text
Controller
```

```text
Service
```

```text
Repository
```

Ejemplo:

```text
quantity > 0
```

puede validarse inicialmente en el DTO.

No es necesario replicar exactamente la misma lógica en cada capa salvo que exista una razón técnica o de seguridad.

Sin embargo, una regla crítica de negocio puede requerir protección adicional.

La decisión debe basarse en:

```text
RIESGO
+
RESPONSABILIDAD
+
CONTEXTO
```

---

# 22. Validación de operaciones históricas

Las operaciones históricas requieren validaciones adicionales relacionadas con su ciclo de vida.

Antes de modificar una operación deberá verificarse:

```text
¿LA OPERACIÓN PUEDE MODIFICARSE?
```

```text
¿YA PRODUJO EFECTOS?
```

```text
¿EXISTEN REGISTROS DEPENDIENTES?
```

```text
¿DEBE MODIFICARSE O DEBE REVERSARSE?
```

No debe permitirse alterar directamente un hecho histórico si esto rompe:

```text
inventario
costos
trazabilidad
rentabilidad
historial
```

Cuando una modificación no sea permitida, deberá utilizarse el mecanismo de reversión o anulación definido para esa operación.

---

# 23. Validación de duplicados

Las operaciones críticas deben considerar el riesgo de duplicación.

Especialmente:

```text
purchases
```

```text
production
```

```text
sales
```

```text
payments
```

La validación debe considerar:

```text
¿ESTA OPERACIÓN YA FUE REGISTRADA?
```

y:

```text
¿ESTE REINTENTO REPRESENTA UNA NUEVA OPERACIÓN
O UNA DUPLICACIÓN?
```

Las restricciones de unicidad y la estrategia de idempotencia deberán coordinarse según el caso de uso.

No debe suponerse que todas las operaciones requieren la misma estrategia.

---

# 24. Validación antes y durante una transacción

Las validaciones simples deben realizarse antes de iniciar una transacción cuando sea posible.

Ejemplo:

```text
VALIDAR REQUEST
        │
        ▼
INICIAR OPERACIÓN
```

Las validaciones dependientes del estado actual deben protegerse junto con el cambio correspondiente.

Ejemplo:

```text
INICIAR CONTEXTO TRANSACCIONAL
        │
        ├── consultar estado actual
        ├── validar condición crítica
        └── ejecutar modificación
```

Esto evita que una condición válida se convierta en inválida antes de completar la operación.

---

# 25. Responsabilidad de cada capa

La distribución inicial será:

```text
DTO
```

Responsable de:

```text
estructura
tipos
campos requeridos
formatos
restricciones simples
```

```text
CONTROLLER
```

Responsable de:

```text
recibir solicitud
delegar operación
no implementar reglas de negocio
```

```text
APPLICATION SERVICE
```

Responsable de:

```text
coordinar caso de uso
consultar estado necesario
ejecutar validaciones operacionales
coordinar módulos
```

```text
DOMAIN / BUSINESS LOGIC
```

Responsable de:

```text
reglas del negocio
condiciones permitidas
invariantes cuando corresponda
```

```text
REPOSITORY
```

Responsable de:

```text
persistencia
consultas necesarias
no decidir reglas de negocio arbitrariamente
```

```text
DATABASE
```

Responsable de:

```text
integridad estructural
unicidad
relaciones
restricciones persistentes
```

---

# 26. Orden general de validación

El orden conceptual recomendado será:

```text
1. RECIBIR SOLICITUD
        │
        ▼
2. VALIDAR ESTRUCTURA
        │
        ▼
3. VALIDAR DATOS SIMPLES
        │
        ▼
4. VALIDAR REFERENCIAS NECESARIAS
        │
        ▼
5. VALIDAR REGLAS DEL NEGOCIO
        │
        ▼
6. VALIDAR ESTADO ACTUAL
        │
        ▼
7. EJECUTAR OPERACIÓN
        │
        ▼
8. PROTEGER INTEGRIDAD EN PERSISTENCIA
```

No todas las operaciones requerirán todas las etapas.

Una operación simple puede detenerse en:

```text
VALIDAR
        ↓
PERSISTIR
```

Una operación crítica puede requerir:

```text
VALIDAR
        ↓
CONSULTAR ESTADO
        ↓
VALIDAR REGLAS
        ↓
TRANSACCIÓN
        ↓
PERSISTIR EFECTOS
```

---

# 27. Relación con el manejo de errores

Cada tipo de validación debe generar un error coherente.

```text
ESTRUCTURA INVÁLIDA
        ↓
VALIDATION_ERROR
```

```text
VALOR SIMPLE INVÁLIDO
        ↓
VALIDATION_ERROR
```

```text
RECURSO INEXISTENTE
        ↓
NOT_FOUND
```

```text
REGLA DE NEGOCIO INCUMPLIDA
        ↓
BUSINESS_RULE_VIOLATION
```

```text
ESTADO CONFLICTIVO
        ↓
CONFLICT
```

El formato final de respuesta debe respetar:

```text
06-error-handling.md
```

Las validaciones no deben construir respuestas HTTP directamente desde cada módulo.

---

# 28. Incorporación de nuevas reglas

Antes de agregar una nueva validación debe responderse:

```text
1. ¿Qué dato o comportamiento se está validando?

2. ¿Es una validación estructural o una regla de negocio?

3. ¿En qué módulo pertenece?

4. ¿Depende del estado actual?

5. ¿Debe ejecutarse dentro de una transacción?

6. ¿Existe ya una regla equivalente?

7. ¿Debe protegerse también mediante persistencia?

8. ¿Qué error debe producir?
```

Si la regla representa una nueva condición del negocio, deberá documentarse antes de convertirse en comportamiento obligatorio del sistema.

No deben agregarse reglas arbitrarias únicamente durante la implementación.

---

# 29. Lo que no debe hacerse

No se debe:

```text
poner toda la validación en controllers
```

No se debe:

```text
usar DTOs para implementar toda la lógica de negocio
```

No se debe:

```text
confiar únicamente en el frontend
```

No se debe:

```text
confiar únicamente en restricciones de base de datos
```

No se debe:

```text
duplicar la misma regla en todas las capas
```

No se debe:

```text
validar inventario fuera del contexto
de la operación crítica
```

No se debe:

```text
permitir modificar hechos históricos
sin validar sus efectos
```

No se debe:

```text
convertir cualquier fallo en VALIDATION_ERROR
```

No se debe:

```text
crear reglas nuevas no documentadas
```

---

# 30. Evolución futura

La estrategia inicial utilizará mecanismos estándar del backend para validar solicitudes y aplicar reglas del negocio.

No se creará inicialmente:

```text
un motor genérico de reglas
```

```text
un framework propio de validaciones
```

```text
un sistema complejo de pipelines
```

```text
una jerarquía extensa de validadores
```

La arquitectura evolucionará únicamente cuando la complejidad real del sistema lo requiera.

Cualquier evolución deberá mantener:

```text
UNA RESPONSABILIDAD CLARA
```

y:

```text
UNA ÚNICA FUENTE DE VERDAD
PARA CADA REGLA DE NEGOCIO
```

---

# 31. Estado actual

```text
Documento: 07-validation-strategy.md
Versión: V1
Estado: APROBADO COMO BASE DE ESTRATEGIA DE VALIDACIÓN
```

Este documento establece que la validación debe distribuirse según la responsabilidad de cada capa. La estructura de las solicitudes se valida en el límite de entrada, las reglas del negocio se validan dentro de los casos de uso y la lógica correspondiente, las condiciones dependientes del estado actual se protegen junto con la operación crítica y la base de datos actúa como protección final de la integridad persistente.
