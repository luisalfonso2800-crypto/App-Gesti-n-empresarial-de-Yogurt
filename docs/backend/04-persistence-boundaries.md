# Límites de Persistencia — V1

## 1. Propósito del documento

Este documento define cómo se relacionan los módulos del backend con la persistencia de datos.

Su objetivo es evitar que la estructura de la base de datos determine incorrectamente la arquitectura del sistema y establecer límites claros sobre:

* qué módulo es propietario de cada conjunto de datos;
* quién puede modificar información;
* cómo se accede a la persistencia;
* cómo se realizan las relaciones entre módulos;
* cómo se protegen los datos históricos;
* cuándo una operación debe realizarse dentro de una transacción;
* qué responsabilidades pertenecen a la capa de persistencia y cuáles no.

Este documento se aplica al backend ubicado en:

```text
apps/api
```

y debe respetar la lógica de negocio ya documentada en:

```text
docs/domains/
docs/data-model/
docs/backend/
```

---

# 2. Principio fundamental

La base de datos no define los módulos.

La existencia de una tabla no implica automáticamente la existencia de:

```text
un módulo
un controlador
un servicio
un repositorio
un endpoint CRUD
```

La relación correcta es:

```text
DOMINIO DEL NEGOCIO
        ↓
MÓDULO RESPONSABLE
        ↓
MODELO DE DATOS
        ↓
PERSISTENCIA
```

No:

```text
TABLA
        ↓
MÓDULO
        ↓
CONTROLADOR CRUD
```

Por ejemplo:

```text
purchases
purchase_items
```

pueden formar parte del mismo módulo:

```text
purchases
```

aunque existan varias entidades o tablas relacionadas.

Lo mismo aplica conceptualmente a:

```text
recipes
recipe_items

production
production_details

sales
sale_items
```

La persistencia representa información necesaria para el sistema, pero los límites arquitectónicos son definidos por las responsabilidades del negocio.

---

# 3. Propiedad de los datos

Cada conjunto de datos debe tener un módulo propietario.

El módulo propietario es responsable de:

* crear los registros;
* modificar los registros cuando esté permitido;
* aplicar las reglas necesarias antes de persistir;
* controlar cambios de estado;
* proteger la integridad de sus datos;
* definir qué información puede exponerse a otros módulos.

Conceptualmente:

```text
ENTITY / DATA
        ↓
OWNER MODULE
        ↓
CONTROLLED ACCESS
```

Ejemplo:

```text
PRESENTATIONS
        ↓
presentations module
```

```text
SUPPLIES
        ↓
supplies module
```

```text
PURCHASES
        ↓
purchases module
```

```text
SALES
        ↓
sales module
```

Otro módulo no debe asumir propiedad sobre datos que pertenecen a una responsabilidad distinta.

---

# 4. Regla de acceso a datos entre módulos

Un módulo no debe modificar directamente las entidades o registros propiedad de otro módulo sin pasar por una capacidad autorizada.

Incorrecto conceptualmente:

```text
PurchasesService
        ↓
Prisma
        ↓
Modificar directamente
tabla propiedad de Inventory
```

Correcto conceptualmente:

```text
Purchases Module
        ↓
Operación de negocio
        ↓
Capacidad autorizada
        ↓
Inventory Module
        ↓
Persistencia controlada
```

La forma técnica concreta podrá evolucionar según las necesidades reales de implementación.

Puede utilizar:

```text
servicio interno
contrato interno
caso de uso
evento
```

según el nivel de desacoplamiento necesario.

Lo importante es preservar la regla:

> Un módulo controla las modificaciones de los datos de los cuales es propietario.

---

# 5. Lectura de datos entre módulos

La lectura de información de otro módulo puede ser necesaria para ejecutar reglas de negocio.

Por ejemplo:

```text
PURCHASES
        ↓
consultar
        ↓
SUPPLIERS
```

o:

```text
SALES
        ↓
consultar disponibilidad
        ↓
INVENTORY
```

Esto no implica que un módulo obtenga acceso ilimitado a toda la infraestructura de persistencia de otro módulo.

El acceso debe realizarse mediante una responsabilidad claramente definida.

Conceptualmente:

```text
MODULE A
        ↓
REQUEST AUTHORIZED DATA
        ↓
MODULE B
        ↓
REPOSITORY / PERSISTENCE
```

No:

```text
MODULE A
        ↓
DIRECT DATABASE ACCESS
        ↓
MODIFY OR DEPEND ON
MODULE B INTERNAL DATA
```

---

# 6. Responsabilidad de los repositorios

Cuando un módulo persista información, su acceso a datos deberá estar encapsulado en una responsabilidad de persistencia.

La estructura inicial podrá ser:

```text
module/
├── module.controller.ts
├── module.service.ts
├── module.repository.ts
├── dto/
└── module.module.ts
```

La responsabilidad del repositorio será:

* consultar información;
* crear registros;
* actualizar registros permitidos;
* eliminar registros únicamente cuando esté permitido;
* ejecutar operaciones necesarias para la persistencia;
* encapsular detalles específicos del ORM o mecanismo de almacenamiento.

El repositorio no debe asumir responsabilidades como:

* definir permisos del usuario;
* ejecutar procesos completos del negocio;
* decidir flujos entre módulos;
* controlar la interfaz HTTP;
* contener lógica de presentación.

La responsabilidad principal es:

```text
SERVICE / APPLICATION
        ↓
decide qué debe ocurrir
        ↓
REPOSITORY
        ↓
ejecuta persistencia
```

---

# 7. Prisma como detalle de persistencia

La implementación inicial utilizará Prisma como mecanismo de acceso a datos.

La arquitectura será conceptualmente:

```text
MODULE
    │
    ├── Controller
    │
    ▼
    Service
    │
    ▼
    Repository
    │
    ▼
    Prisma
    │
    ▼
DATABASE
```

El resto del módulo no debe depender innecesariamente de detalles específicos de Prisma.

Inicialmente no se obliga a crear interfaces separadas para todos los repositorios.

Por ejemplo, esta estructura puede ser suficiente:

```text
products/
├── products.controller.ts
├── products.service.ts
├── products.repository.ts
└── dto/
```

No es obligatorio comenzar con:

```text
domain/
    repositories/
        product-repository.interface.ts

infrastructure/
    persistence/
        prisma-product.repository.ts
```

Esta separación podrá crearse posteriormente si aparece una necesidad arquitectónica real.

---

# 8. Un repositorio no representa necesariamente una tabla

La responsabilidad de un repositorio se define por la necesidad de persistencia del módulo.

No necesariamente por una correspondencia:

```text
1 TABLA
=
1 REPOSITORIO
```

Por ejemplo, una operación de compra puede involucrar conceptualmente:

```text
PURCHASE
        │
        └── PURCHASE ITEMS
```

El módulo:

```text
purchases
```

puede manejar ambas entidades como parte de su persistencia.

No es obligatorio crear:

```text
PurchaseRepository
PurchaseItemRepository
```

si los detalles no tienen una responsabilidad independiente dentro del módulo.

La estructura debe seguir la operación y la agregación real de datos.

---

# 9. Persistencia de operaciones compuestas

Algunas operaciones del negocio requieren crear o modificar varios registros relacionados.

Ejemplo conceptual:

```text
REGISTER PURCHASE
        │
        ├── purchase
        ├── purchase items
        └── inventory effects
```

Estas operaciones deben mantener consistencia.

No debe permitirse un resultado como:

```text
PURCHASE CREATED
        ↓
PURCHASE ITEMS FAILED
```

cuando ambos forman parte de una única operación.

Tampoco:

```text
PURCHASE CONFIRMED
        ↓
NO INVENTORY EFFECT
```

cuando la lógica del negocio establece que la confirmación debe generar ese efecto.

La estrategia de implementación deberá garantizar que el sistema no quede en un estado parcialmente aplicado.

---

# 10. Transacciones

Las transacciones deben utilizarse cuando varias operaciones de persistencia formen una única unidad de negocio.

La regla conceptual es:

```text
UNA OPERACIÓN DE NEGOCIO
        │
        ├── varios cambios dependientes
        │
        ▼
EJECUCIÓN ATÓMICA
```

Ejemplos que deberán evaluarse como operaciones transaccionales:

```text
confirmación de compra
```

cuando implique:

```text
crear o confirmar compra
+
guardar detalles
+
registrar efectos de inventario
```

```text
ejecución de producción
```

cuando implique:

```text
registrar producción
+
registrar consumo de insumos
+
actualizar existencias
+
crear lote
+
registrar producto terminado
```

```text
registro de venta
```

cuando implique:

```text
crear venta
+
registrar detalle
+
descontar inventario
+
registrar efectos relacionados
```

La implementación concreta de las transacciones se definirá durante el desarrollo de cada operación.

No todas las operaciones requieren una transacción compleja.

---

# 11. Inventario como dato derivado y controlado

Las existencias no deben modificarse arbitrariamente.

El inventario debe conservar relación con los movimientos que explican su estado.

Conceptualmente:

```text
MOVIMIENTOS
        ↓
ENTRADAS
SALIDAS
AJUSTES AUTORIZADOS
        ↓
ESTADO DEL INVENTARIO
```

El sistema no debe permitir que cualquier módulo ejecute directamente:

```text
cantidad = 500
```

sin una operación de negocio que justifique el cambio.

Los cambios de inventario deben estar relacionados con una causa identificable.

Entre ellas:

```text
purchase
production
sale
authorized adjustment
```

según las reglas definitivas del flujo de inventario documentadas en:

```text
docs/data-model/06-inventory-flow.md
```

---

# 12. Persistencia de datos maestros

Los datos maestros representan información relativamente estable que sirve como referencia para otras operaciones.

Entre ellos se encuentran conceptualmente:

```text
presentations
supplies
suppliers
products
clients
```

Estos datos pueden permitir actualizaciones controladas.

Sin embargo, la modificación de un dato maestro no debe alterar retroactivamente hechos históricos que dependan de información registrada anteriormente cuando esto afecte:

* trazabilidad;
* costos históricos;
* cantidades históricas;
* precios históricos;
* identificación de una operación pasada.

La estrategia concreta para conservar valores históricos deberá respetar las decisiones documentadas en:

```text
04-history-and-traceability.md
05-data-model-decisions.md
12-vba-fidelity-validation.md
```

---

# 13. Persistencia de hechos históricos

Los siguientes módulos representan operaciones o hechos que pueden requerir conservación histórica:

```text
purchases
inventory
production
lots
sales
payments
expenses
```

Estos datos no deben tratarse automáticamente como registros CRUD ordinarios.

Antes de permitir:

```text
UPDATE
DELETE
```

deberá analizarse el impacto sobre:

* trazabilidad;
* inventario;
* costos;
* rentabilidad;
* reportes;
* relaciones posteriores.

La regla general es:

> Un hecho histórico no debe perderse ni modificarse libremente si representa una operación que ya produjo efectos en el sistema.

Cuando sea necesario, la corrección deberá realizarse mediante mecanismos definidos por el negocio, como:

```text
cancelación
anulación
reversión
ajuste autorizado
cambio de estado
```

La operación concreta dependerá de cada módulo.

---

# 14. Eliminación física

La eliminación física de datos no será el comportamiento predeterminado.

Antes de implementar una eliminación debe responderse:

```text
¿El registro representa un dato maestro
o un hecho histórico?

¿Existen otros registros que dependen de él?

¿Su eliminación afecta trazabilidad?

¿Puede desactivarse en lugar de eliminarse?

¿Existe una operación de corrección definida?
```

Los datos históricos relacionados con operaciones del negocio no deben eliminarse simplemente para corregir errores.

La corrección debe preservar, cuando corresponda, la capacidad de reconstruir lo ocurrido.

---

# 15. Datos derivados

No toda información calculada debe persistirse.

Antes de almacenar un valor derivado debe responderse:

```text
¿Puede calcularse nuevamente?

¿El cálculo depende de datos que pueden cambiar?

¿Necesitamos conservar el resultado histórico?

¿El cálculo es costoso?

¿El valor debe ser auditable?
```

Existen dos posibilidades:

```text
DATO BASE
        ↓
CALCULAR AL CONSULTAR
```

o:

```text
DATO BASE
        ↓
CALCULAR
        ↓
PERSISTIR RESULTADO HISTÓRICO
```

La decisión dependerá de la responsabilidad concreta.

Los módulos:

```text
costs
profitability
dashboard
```

deben respetar las reglas definidas en:

```text
09-calculation-responsibilities.md
```

No se deben persistir cálculos únicamente por comodidad.

---

# 16. Consistencia entre datos relacionados

Las relaciones de persistencia deben proteger las reglas del modelo de datos.

Ejemplo conceptual:

```text
PRODUCT
        ↓
PRESENTATION
```

No debe existir una referencia a una presentación inexistente.

Otro ejemplo:

```text
RECIPE
        ↓
SUPPLIES
```

Los elementos de una receta deben mantener referencias válidas según las reglas del modelo.

La persistencia debe complementar las validaciones de aplicación mediante mecanismos apropiados como:

```text
primary keys
foreign keys
unique constraints
not null
check constraints
transactions
```

cuando corresponda.

Las restricciones concretas se implementarán a partir de:

```text
docs/data-model/03-data-integrity-rules.md
```

---

# 17. Integridad no delegable únicamente al backend

Las reglas críticas no deben depender exclusivamente de que el código de la aplicación funcione correctamente.

Cuando una regla pueda protegerse también desde la base de datos, deberá evaluarse esa protección.

Ejemplo conceptual:

```text
ID único
```

debe tener una protección de unicidad en persistencia.

No debe depender únicamente de:

```text
if exists()
```

en el servicio.

El sistema debe utilizar niveles complementarios de protección:

```text
API VALIDATION
        +
BUSINESS VALIDATION
        +
DATABASE CONSTRAINTS
```

---

# 18. Lecturas para reportes y análisis

Los módulos responsables de:

```text
costs
profitability
dashboard
```

pueden necesitar consultar información procedente de varios módulos.

Esto no significa que se conviertan en propietarios de esos datos.

Conceptualmente:

```text
SOURCE MODULES
        │
        ├── purchases
        ├── inventory
        ├── production
        ├── sales
        └── expenses
                │
                ▼
        CALCULATION / REPORTING
                │
                ▼
     costs / profitability / dashboard
```

Estos módulos consumen información para:

* calcular;
* consolidar;
* analizar;
* presentar.

La propiedad de los datos originales permanece en sus módulos correspondientes.

---

# 19. Consultas transversales

Las consultas que necesitan información de varios módulos deben mantener una responsabilidad clara.

Ejemplo:

```text
DASHBOARD
```

puede requerir información de:

```text
sales
inventory
production
expenses
```

Esto no implica que el módulo dashboard deba modificar esos datos.

Su responsabilidad es:

```text
CONSULTAR
        ↓
CONSOLIDAR
        ↓
CALCULAR
        ↓
EXPONER RESULTADO
```

No:

```text
CONSULTAR
        ↓
MODIFICAR DATOS DE OTROS MÓDULOS
```

---

# 20. Dependencia entre persistencia y dominio

La lógica del negocio no debe depender innecesariamente de la estructura física de las tablas.

Incorrecto conceptualmente:

```text
if purchase_items.price_column > 0
```

como representación directa de la regla de negocio dentro de cualquier capa.

La lógica debe expresar la intención:

```text
if purchase item has a valid acquisition price
```

La implementación de persistencia puede utilizar nombres específicos de columnas, pero las reglas de negocio no deben quedar diseñadas alrededor de detalles físicos.

---

# 21. Migraciones de base de datos

Toda modificación estructural de la persistencia deberá realizarse mediante un mecanismo controlado de migraciones.

No se debe depender de modificaciones manuales directamente sobre una base de datos en ejecución.

Los cambios deberán poder:

* reproducirse;
* versionarse;
* revisarse;
* aplicarse en diferentes entornos.

Conceptualmente:

```text
CAMBIO DEL MODELO
        ↓
VALIDACIÓN
        ↓
MIGRACIÓN VERSIONADA
        ↓
APLICACIÓN CONTROLADA
```

La herramienta concreta estará determinada por la implementación basada en Prisma.

---

# 22. Cambios en el modelo de datos

Un cambio de persistencia no debe realizarse únicamente porque facilite una implementación puntual.

Antes de modificar una entidad, relación o restricción deberá verificarse:

```text
1. ¿Contradice el modelo de negocio?

2. ¿Afecta una regla de integridad?

3. ¿Afecta trazabilidad?

4. ¿Afecta cálculos históricos?

5. ¿Afecta otro módulo?

6. ¿Requiere actualizar documentación?

7. ¿Requiere migración?
```

Los documentos de referencia serán:

```text
docs/domains/
docs/data-model/
docs/backend/
```

Cuando un cambio sea una decisión arquitectónica relevante, deberá registrarse mediante el mecanismo de decisiones del proyecto.

---

# 23. Identificadores y relaciones

Los identificadores utilizados para relacionar información deben mantenerse estables.

Un registro relacionado debe utilizar la referencia definida por el modelo de datos.

No deben utilizarse valores descriptivos como sustituto de relaciones internas.

Incorrecto conceptualmente:

```text
purchase.supplierName
```

como mecanismo para relacionar una compra con un proveedor.

Correcto conceptualmente:

```text
purchase.supplierId
```

La información descriptiva puede existir como dato histórico cuando las reglas de trazabilidad lo requieran, pero no sustituye la relación estructural.

---

# 24. Propagación de cambios

Una modificación en un módulo puede producir efectos sobre información de otros módulos.

Ejemplo conceptual:

```text
PURCHASE CONFIRMED
        │
        ▼
INVENTORY EFFECT
```

Otro ejemplo:

```text
PRODUCTION EXECUTED
        │
        ├── CONSUME SUPPLIES
        │
        ├── CREATE LOT
        │
        └── REGISTER FINISHED PRODUCT
```

Estos efectos deben ser controlados mediante operaciones explícitas.

No debe existir lógica oculta en la capa de persistencia que produzca cambios de negocio inesperados.

Un repositorio debe persistir.

La coordinación del proceso pertenece a la capa responsable de ejecutar la operación de negocio.

---

# 25. Prohibición de lógica de negocio oculta en la persistencia

No se deben utilizar mecanismos de persistencia como sustituto de procesos explícitos del negocio.

No debe dependerse de:

```text
triggers ocultos
side effects implícitos
actualizaciones automáticas no documentadas
```

para ejecutar reglas centrales del negocio sin que la operación sea visible en la arquitectura.

Ejemplo incorrecto conceptualmente:

```text
INSERT PURCHASE
        ↓
DATABASE TRIGGER
        ↓
MODIFICAR INVENTORY
```

si el flujo de negocio queda oculto y fuera de la responsabilidad del módulo.

La coordinación debe ser explícita:

```text
PURCHASE OPERATION
        ↓
VALIDATE
        ↓
PERSIST PURCHASE
        ↓
EXECUTE INVENTORY EFFECT
        ↓
COMMIT
```

La implementación podrá usar una transacción, pero el flujo debe permanecer visible y controlado por la aplicación.

---

# 26. Proceso para crear nueva persistencia

Antes de crear una nueva entidad o estructura de almacenamiento deberá seguirse este procedimiento:

```text
NUEVA NECESIDAD
        │
        ▼
¿EXISTE UNA RESPONSABILIDAD DE NEGOCIO?
        │
        ├── NO
        │   └── NO CREAR PERSISTENCIA
        │
        └── SÍ
            │
            ▼
¿A QUÉ MÓDULO PERTENECE?
            │
            ▼
¿REPRESENTA UNA ENTIDAD NUEVA
O PARTE DE UNA OPERACIÓN EXISTENTE?
            │
            ▼
¿QUÉ RELACIONES NECESITA?
            │
            ▼
¿QUÉ REGLAS DE INTEGRIDAD APLICA?
            │
            ▼
¿REQUIERE HISTORIAL?
            │
            ▼
¿REQUIERE UNA DECISIÓN DOCUMENTADA?
            │
            ▼
CREAR MODELO Y MIGRACIÓN
```

No se crearán tablas o entidades únicamente porque una estructura futura podría necesitarlas.

---

# 27. Evolución de los límites de persistencia

La estructura inicial debe ser suficiente para implementar las necesidades actuales.

Si posteriormente aparecen nuevas necesidades, podrán evolucionar:

```text
repository
```

hacia:

```text
application/
domain/
infrastructure/
```

cuando existan criterios reales definidos en:

```text
docs/architecture/architecture-evolution.md
```

La persistencia no debe adelantarse a una arquitectura más compleja sin una necesidad concreta.

---

# 28. Relación con el modelo técnico

Este documento no sustituye el modelo de datos.

Las entidades, relaciones y reglas específicas se encuentran documentadas en:

```text
docs/data-model/00-data-model-overview.md
docs/data-model/01-entities.md
docs/data-model/02-relationships.md
docs/data-model/03-data-integrity-rules.md
docs/data-model/04-history-and-traceability.md
docs/data-model/05-data-model-decisions.md
docs/data-model/06-inventory-flow.md
docs/data-model/07-business-processes.md
docs/data-model/08-cross-module-rules.md
docs/data-model/09-calculation-responsibilities.md
docs/data-model/10-technical-implementation-notes.md
docs/data-model/11-model-validation.md
docs/data-model/12-vba-fidelity-validation.md
```

Si existe una contradicción entre una futura decisión de implementación y las reglas documentadas del modelo validado, la contradicción deberá resolverse antes de modificar el código.

---

# 29. Estado actual

```text
Documento: 04-persistence-boundaries.md
Versión: V1
Estado: APROBADO COMO BASE DE LÍMITES DE PERSISTENCIA
```

Este documento establece que la persistencia debe servir al modelo de negocio y a los límites de los módulos, no definirlos.

Cada módulo conserva la responsabilidad sobre los datos que le pertenecen. Las operaciones entre módulos deben respetar esos límites, los hechos históricos deben proteger su trazabilidad y las operaciones compuestas deben mantener consistencia durante su persistencia.
