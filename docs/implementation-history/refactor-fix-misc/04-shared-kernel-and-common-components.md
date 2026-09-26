# Shared Kernel y Componentes Comunes — V1

## 1. Propósito del documento

Este documento define qué componentes técnicos pueden ser compartidos entre módulos del backend y cuáles no deben convertirse en dependencias compartidas.

El objetivo es evitar dos problemas opuestos:

1. Duplicar infraestructura común innecesariamente.
2. Crear un `shared` o `common` gigantesco que termine convirtiéndose en una dependencia global sin límites.

El principio será:

```text
COMPARTIR SOLO
LO QUE REALMENTE ES TRANSVERSAL
```

y no:

```text
COLOCAR EN COMMON
TODO LO QUE NO SABEMOS
DÓNDE UBICAR
```

La existencia de un componente compartido no autoriza a los módulos a compartir directamente su lógica de negocio.

---

# 2. Alcance

Este documento define la estructura conceptual del:

```text
Shared Kernel
```

y de los:

```text
Common Components
```

utilizados por el backend.

Aplica principalmente a componentes utilizados por múltiples módulos, tales como:

```text
errores
```

```text
excepciones
```

```text
validaciones transversales
```

```text
tipos comunes
```

```text
utilidades técnicas
```

```text
configuración
```

```text
persistencia transversal
```

```text
auditoría
```

```text
autenticación técnica
```

No redefine las responsabilidades de los módulos de negocio.

---

# 3. Principio principal

El sistema debe diferenciar entre:

```text
LÓGICA COMPARTIDA
```

y:

```text
LÓGICA DE NEGOCIO REUTILIZABLE
```

No toda lógica utilizada por más de un módulo debe moverse automáticamente al `shared kernel`.

Ejemplo:

```text
Products
```

y:

```text
Sales
```

pueden necesitar validar un producto.

Eso no significa que la lógica completa de `Products` deba trasladarse a `shared`.

La regla será:

```text
UN MÓDULO
SIGUE SIENDO PROPIETARIO
DE SU DOMINIO
```

El código compartido únicamente debe contener responsabilidades verdaderamente transversales.

---

# 4. Qué es el Shared Kernel

El `Shared Kernel` representa un conjunto reducido de conceptos y componentes que pueden ser utilizados por múltiples partes del sistema sin pertenecer exclusivamente a un módulo de negocio.

Su responsabilidad principal es proporcionar:

```text
CONTRATOS COMUNES
```

```text
ABSTRACCIONES TÉCNICAS
```

```text
PRIMITIVAS TRANSVERSALES
```

No debe convertirse en un segundo dominio.

Conceptualmente:

```text
                    SHARED KERNEL
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     PRODUCTS         SALES          INVENTORY
        │                │                │
        └────────────────┼────────────────┘
                         │
                  COMPONENTES
                   TRANSVERSALES
```

---

# 5. Qué puede pertenecer al Shared Kernel

Un componente puede considerarse parte del `Shared Kernel` cuando cumple al menos una de las siguientes condiciones:

```text
NO REPRESENTA
UN CONCEPTO PROPIETARIO
DE UN SOLO MÓDULO
```

o:

```text
REPRESENTA UNA ABSTRACCIÓN
UTILIZADA DE FORMA REAL
POR MÚLTIPLES MÓDULOS
```

o:

```text
RESUELVE UNA NECESIDAD
TÉCNICA TRANSVERSAL
```

Ejemplos potenciales:

```text
Result
```

```text
DomainError
```

```text
ApplicationError
```

```text
Pagination
```

```text
Transaction Context
```

```text
Date Utilities
```

```text
Money Utilities
```

```text
Common Identifiers
```

```text
Audit Metadata
```

La inclusión definitiva debe realizarse únicamente cuando exista una necesidad concreta.

---

# 6. Qué no debe pertenecer al Shared Kernel

No deben colocarse en el `Shared Kernel` conceptos como:

```text
Producto
```

```text
Insumo
```

```text
Proveedor
```

```text
Compra
```

```text
Receta
```

```text
Producción
```

```text
Lote
```

```text
Cliente
```

```text
Venta
```

```text
Pago
```

```text
Gasto
```

Estos conceptos pertenecen a módulos específicos.

Incluso si varios módulos necesitan información relacionada con ellos, su lógica continúa siendo propiedad de su módulo.

La regla será:

```text
REUTILIZACIÓN
NO SIGNIFICA
PROPIEDAD COMPARTIDA
```

---

# 7. Estructura conceptual

La estructura inicial recomendada será:

```text
src/
│
├── common/
│   │
│   ├── errors/
│   │
│   ├── filters/
│   │
│   ├── interceptors/
│   │
│   ├── pipes/
│   │
│   ├── decorators/
│   │
│   ├── guards/
│   │
│   ├── types/
│   │
│   ├── constants/
│   │
│   └── utils/
│
├── shared/
│   │
│   ├── domain/
│   │
│   ├── application/
│   │
│   └── infrastructure/
│
├── config/
│
├── database/
│
└── modules/
```

Esta estructura es conceptual.

No obliga a crear todas las carpetas desde el inicio.

Las carpetas deben aparecer cuando exista una responsabilidad real.

---

# 8. Diferencia entre `common` y `shared`

Para evitar confusión, el sistema distinguirá ambos conceptos.

## `common`

Contiene componentes técnicos transversales.

Ejemplos:

```text
Exception Filters
```

```text
Validation Pipes
```

```text
Decorators
```

```text
Guards
```

```text
Interceptors
```

```text
Utilities
```

Su propósito es principalmente técnico.

---

## `shared`

Contiene abstracciones que pueden utilizarse entre diferentes capas o módulos cuando representan conceptos comunes reales.

Ejemplos potenciales:

```text
Result Types
```

```text
Error Contracts
```

```text
Pagination Contracts
```

```text
Value Objects
```

```text
Identifiers
```

La diferencia conceptual será:

```text
COMMON
    ↓
INFRAESTRUCTURA Y UTILIDADES TÉCNICAS
```

```text
SHARED
    ↓
ABSTRACCIONES Y CONTRATOS REUTILIZABLES
```

---

# 9. Common Errors

El sistema debe contar con una estrategia uniforme para representar errores técnicos y de aplicación.

Ejemplos:

```text
ValidationError
```

```text
NotFoundError
```

```text
ConflictError
```

```text
UnauthorizedError
```

```text
ForbiddenError
```

```text
BusinessRuleError
```

La existencia de estas clases no significa que todas las reglas de negocio deban centralizarse.

Ejemplo:

```text
BusinessRuleError
```

puede ser compartido como tipo de error.

Pero:

```text
No se puede vender
más cantidad que la disponible
```

pertenece a la lógica del módulo correspondiente.

La regla será:

```text
TIPO DE ERROR
        ↓
COMPARTIDO
```

```text
REGLA QUE GENERA EL ERROR
        ↓
PROPIEDAD DEL MÓDULO
```

---

# 10. Exception Filters

Los filtros globales de excepciones pertenecen a:

```text
common/filters
```

Su responsabilidad será:

```text
capturar errores
```

```text
normalizar respuestas
```

```text
evitar exposición de información interna
```

```text
transformar errores conocidos
```

No deben contener lógica de negocio.

La estructura conceptual será:

```text
ERROR
   ↓
EXCEPTION FILTER
   ↓
HTTP RESPONSE NORMALIZADA
```

---

# 11. Validation Pipes

Las validaciones técnicas globales pueden pertenecer a:

```text
common/pipes
```

Por ejemplo:

```text
transformación de tipos
```

```text
rechazo de propiedades no permitidas
```

```text
validación estructural de DTOs
```

Sin embargo, una regla como:

```text
un lote no puede utilizarse
si está vencido
```

no debe implementarse dentro de un `ValidationPipe` global.

Esa regla pertenece al módulo que controla el lote o la operación correspondiente.

La separación será:

```text
PIPE
    ↓
VALIDA ESTRUCTURA
```

```text
MÓDULO
    ↓
VALIDA REGLAS DE NEGOCIO
```

---

# 12. Decorators

Los decoradores reutilizables pueden ubicarse en:

```text
common/decorators
```

Ejemplos potenciales:

```text
CurrentUser
```

```text
Public
```

```text
Roles
```

Estos decoradores deben contener únicamente la responsabilidad necesaria para expresar metadatos o acceder a información transversal del contexto.

No deben contener lógica compleja de negocio.

---

# 13. Guards

Los `Guards` reutilizables pueden ubicarse en:

```text
common/guards
```

Ejemplos:

```text
JwtAuthGuard
```

```text
RolesGuard
```

La autenticación y autorización técnica pueden utilizar componentes compartidos.

Sin embargo, reglas específicas como:

```text
este usuario puede modificar
esta operación específica
```

deben analizarse según la propiedad del recurso y la frontera del módulo.

No toda autorización debe convertirse automáticamente en una regla global.

---

# 14. Interceptors

Los `Interceptors` transversales pueden utilizarse para responsabilidades como:

```text
serialización
```

```text
normalización de respuestas
```

```text
medición técnica
```

```text
correlation context
```

No deben utilizarse para introducir efectos secundarios de negocio ocultos.

Por ejemplo:

```text
crear una auditoría
```

puede requerir un mecanismo transversal.

Pero:

```text
crear automáticamente
una compra adicional
```

no corresponde a un interceptor.

La regla será:

```text
INTERCEPTOR
NO REEMPLAZA
UN CASO DE USO
```

---

# 15. Tipos comunes

Los tipos realmente reutilizados pueden ubicarse en:

```text
common/types
```

Ejemplos:

```text
PaginationQuery
```

```text
PaginatedResult
```

```text
SortDirection
```

```text
DateRange
```

No deben colocarse tipos de entidades de negocio solo para evitar importaciones.

Ejemplo incorrecto:

```text
common/types/Product.js
```

solo porque varios módulos necesitan información de productos.

El contrato debe definirse en la frontera adecuada.

---

# 16. Constantes comunes

Las constantes técnicas globales pueden ubicarse en:

```text
common/constants
```

Ejemplos:

```text
DEFAULT_PAGE_SIZE
```

```text
MAX_PAGE_SIZE
```

```text
DATE_FORMATS
```

No deben utilizarse para esconder reglas de negocio.

Ejemplo:

```text
common/constants/PROFIT_MARGIN.js
```

no debe existir si representa una decisión de negocio específica.

Las reglas y parámetros del negocio deben permanecer documentados en el módulo responsable o en la configuración correspondiente.

---

# 17. Utilidades

Las utilidades pueden ubicarse en:

```text
common/utils
```

Únicamente cuando resuelvan problemas técnicos genéricos.

Ejemplos:

```text
normalización de texto
```

```text
conversión segura de fechas
```

```text
transformación técnica de datos
```

Una utilidad no debe convertirse en una clase genérica de lógica de negocio.

Ejemplo incorrecto:

```text
common/utils/CalculateProductCost.js
```

El cálculo del costo pertenece al contexto funcional correspondiente.

---

# 18. Configuración

La configuración de la aplicación debe centralizarse en:

```text
config/
```

Ejemplos:

```text
database.config
```

```text
application.config
```

```text
auth.config
```

La configuración debe ser validada al inicio de la aplicación.

Conceptualmente:

```text
ENVIRONMENT
        ↓
CONFIGURATION
        ↓
VALIDATION
        ↓
APPLICATION
```

Los módulos no deben acceder directamente a variables de entorno dispersas por el código.

---

# 19. Base de datos

Los componentes técnicos relacionados con persistencia transversal pueden ubicarse en:

```text
database/
```

Ejemplo:

```text
PrismaService
```

```text
DatabaseModule
```

La base de datos proporciona infraestructura de persistencia.

No debe contener reglas de negocio.

La estructura conceptual será:

```text
MODULE
    ↓
APPLICATION LOGIC
    ↓
PERSISTENCE ABSTRACTION
    ↓
DATABASE
```

La implementación concreta debe respetar las decisiones definidas en:

```text
docs/backend/04-persistence-boundaries.md
```

---

# 20. Transacciones

Las transacciones pueden requerir componentes técnicos compartidos.

Por ejemplo:

```text
TransactionManager
```

o un mecanismo equivalente compatible con la estrategia definida para Prisma.

Este componente no debe conocer conceptos como:

```text
Venta
```

```text
Compra
```

```text
Producción
```

Su responsabilidad debe limitarse a proporcionar un contexto transaccional.

Conceptualmente:

```text
CASO DE USO
        ↓
TRANSACTION CONTEXT
        ↓
OPERACIONES
        ↓
COMMIT / ROLLBACK
```

Las operaciones de negocio continúan siendo responsabilidad del módulo.

---

# 21. Identificadores

La generación o representación técnica de identificadores puede ser una responsabilidad compartida.

Sin embargo, deben diferenciarse:

```text
IDENTIFICADOR TÉCNICO
```

de:

```text
CÓDIGO DE NEGOCIO
```

Por ejemplo:

```text
UUID
```

puede ser una decisión técnica común.

Mientras que:

```text
COD-PROD-001
```

si existiera y estuviera definido como código funcional, pertenece a las reglas del módulo correspondiente.

La regla será:

```text
ID TÉCNICO
    ↓
PUEDE SER TRANSVERSAL
```

```text
CÓDIGO FUNCIONAL
    ↓
PERTENECE AL DOMINIO
```

---

# 22. Dinero

Los valores monetarios requieren consistencia transversal.

Sin embargo, la representación técnica de dinero no debe decidir por sí sola cómo se calcula un costo o una rentabilidad.

Un componente compartido puede proporcionar:

```text
representación segura
```

```text
operaciones aritméticas controladas
```

```text
reglas de precisión
```

Pero:

```text
COSTO
```

```text
PRECIO
```

```text
MARGEN
```

continúan siendo conceptos funcionales pertenecientes a sus módulos correspondientes.

La regla será:

```text
ARITMÉTICA
    ↓
PUEDE SER COMPARTIDA
```

```text
SIGNIFICADO DEL VALOR
    ↓
PERTENECE AL DOMINIO
```

---

# 23. Fechas

El sistema puede compartir utilidades técnicas para fechas.

Ejemplos:

```text
normalización UTC
```

```text
comparación
```

```text
rangos
```

Pero el significado funcional de una fecha pertenece al módulo correspondiente.

Por ejemplo:

```text
fecha de compra
```

```text
fecha de producción
```

```text
fecha de creación del lote
```

```text
fecha de vencimiento
```

no deben convertirse en conceptos genéricos.

La utilidad puede ser compartida.

El significado no.

---

# 24. Auditoría

La auditoría es una preocupación transversal.

Sin embargo, debe diferenciarse entre:

```text
INFRAESTRUCTURA DE AUDITORÍA
```

y:

```text
HISTORIAL DEL NEGOCIO
```

Ejemplo:

```text
Usuario modificó un registro
```

puede pertenecer a un mecanismo transversal de auditoría.

Mientras que:

```text
una venta fue registrada
```

es un hecho del negocio.

La regla será:

```text
AUDITORÍA TÉCNICA
        ↓
TRANSVERSAL
```

```text
HISTORIAL DE NEGOCIO
        ↓
MÓDULO RESPONSABLE
```

La implementación deberá respetar las decisiones sobre trazabilidad documentadas en:

```text
docs/data-model/04-history-and-traceability.md
```

---

# 25. Eventos internos

Si el sistema utiliza eventos internos, la infraestructura necesaria puede ser compartida.

Ejemplo conceptual:

```text
EVENT BUS
```

```text
EVENT INTERFACE
```

```text
EVENT HANDLER CONTRACT
```

Pero los eventos concretos pertenecen al módulo que los produce.

Ejemplo:

```text
PurchaseRegistered
```

pertenece al contexto de compras.

```text
ProductionCompleted
```

pertenece al contexto de producción.

La infraestructura puede ser:

```text
shared
```

El evento no necesariamente.

---

# 26. Contratos compartidos

Los contratos compartidos deben ser mínimos.

Un contrato puede ser compartido cuando representa una abstracción estable.

Ejemplo:

```text
PaginatedResult<T>
```

puede ser compartido.

Sin embargo:

```text
ProductResponse
```

no debe moverse a `shared` simplemente porque varios módulos necesitan mostrar información del producto.

En esos casos debe definirse una frontera explícita entre módulos.

La regla será:

```text
CONTRATO GENÉRICO Y ESTABLE
        ↓
COMPARTIBLE CON SHARED
```

```text
CONTRATO ESPECÍFICO DE NEGOCIO
        ↓
PROPIEDAD DEL MÓDULO
```

---

# 27. Dependencias permitidas

La dirección general de dependencias será:

```text
MODULE
    ↓
SHARED / COMMON
```

pero debe evitarse:

```text
SHARED / COMMON
    ↓
MODULE
```

Un componente compartido no debe depender directamente de:

```text
ProductsModule
```

```text
SalesModule
```

```text
InventoryModule
```

u otro módulo funcional.

La dependencia debe mantenerse en una dirección controlada.

---

# 28. Dependencias entre módulos

Un componente compartido no debe utilizarse como mecanismo para ocultar dependencias circulares.

Ejemplo incorrecto:

```text
Products
    ↓
shared/ProductService
    ↓
Inventory
```

Esto solo disfraza una dependencia entre módulos.

Si existe una dependencia real, debe declararse y gestionarse según:

```text
docs/backend/02-module-dependencies.md
```

La regla será:

```text
SHARED
NO ES
UN ATAJO PARA EVITAR
DISEÑAR FRONTERAS
```

---

# 29. Criterio para crear un componente compartido

Antes de crear un elemento dentro de:

```text
common/
```

o:

```text
shared/
```

deben responderse estas preguntas:

```text
¿PERTENECE A UN MÓDULO ESPECÍFICO?
```

Si la respuesta es:

```text
SÍ
```

debe permanecer en el módulo.

Si la respuesta es:

```text
NO
```

debe evaluarse:

```text
¿ES REALMENTE TRANSVERSAL?
```

Si todavía no es utilizado por múltiples partes del sistema, no debe crearse anticipadamente solo por previsión.

La regla será:

```text
NECESIDAD REAL
ANTES QUE
ABSTRACCIÓN ANTICIPADA
```

---

# 30. Regla de extracción

Cuando una funcionalidad aparece inicialmente dentro de un módulo, debe permanecer allí.

Solo debe extraerse cuando exista evidencia de reutilización real.

Conceptualmente:

```text
PRIMER USO
    ↓
PERMANECE LOCAL
```

```text
SEGUNDO USO
    ↓
ANALIZAR SIMILITUD
```

```text
TERCER USO O
ABSTRACCIÓN CLARAMENTE ESTABLE
    ↓
EVALUAR EXTRACCIÓN
```

Esto evita crear infraestructura compartida innecesaria.

---

# 31. Componentes que se crearán desde el inicio

Solo deben existir desde el inicio los componentes necesarios para el funcionamiento de la aplicación.

Inicialmente pueden existir:

```text
config/
```

```text
database/
```

```text
common/errors/
```

```text
common/filters/
```

```text
common/pipes/
```

```text
common/types/
```

La estructura inicial debe mantenerse pequeña.

---

# 32. Componentes que no deben crearse todavía

No deben crearse anticipadamente:

```text
shared/domain/
```

```text
shared/application/
```

```text
shared/infrastructure/
```

si todavía no contienen responsabilidades reales.

Tampoco deben crearse:

```text
BaseRepository
```

```text
BaseService
```

```text
GenericCrudService
```

```text
UniversalEntity
```

solo por anticipación.

La abstracción genérica debe justificarse mediante uso real.

---

# 33. Base Repository

No se establecerá un:

```text
BaseRepository
```

por defecto.

Los patrones de persistencia deben surgir de las necesidades reales de los módulos.

Un repositorio genérico puede parecer conveniente inicialmente, pero puede terminar forzando operaciones de negocio diferentes dentro de una abstracción artificial.

La regla será:

```text
PERSISTENCIA SIMILAR
NO IMPLICA
MISMA ABSTRACCIÓN
```

---

# 34. Base Service

No se establecerá un:

```text
BaseService
```

global.

Los servicios de aplicación deben representar casos de uso o responsabilidades concretas.

Ejemplo:

```text
CreatePresentationService
```

tiene una responsabilidad diferente de:

```text
RegisterPurchaseService
```

Aunque ambos interactúen con persistencia, no necesariamente comparten una abstracción útil.

---

# 35. Generic CRUD

No se implementará un sistema genérico que genere automáticamente:

```text
Create
```

```text
Read
```

```text
Update
```

```text
Delete
```

para todos los módulos.

Algunos módulos pueden requerir CRUD simple.

Otros requieren operaciones transaccionales complejas.

Forzar todos los módulos dentro de una abstracción CRUD puede ocultar las diferencias reales del negocio.

La regla será:

```text
EL NEGOCIO DEFINE
LA OPERACIÓN
```

no:

```text
EL CRUD DEFINE
EL NEGOCIO
```

---

# 36. Componentes comunes y pruebas

Los componentes compartidos deben tener pruebas propias cuando contengan comportamiento.

Ejemplo:

```text
Money
```

debe probar:

```text
precisión
```

```text
operaciones
```

```text
comparaciones
```

Un `ExceptionFilter` debe probar:

```text
normalización
```

```text
errores conocidos
```

```text
errores inesperados
```

Los módulos no deben depender de comportamiento compartido que no haya sido verificado.

---

# 37. Versionado de contratos compartidos

Un cambio en un contrato utilizado por múltiples módulos puede producir efectos amplios.

Por esta razón, cualquier modificación de:

```text
shared
```

debe analizarse antes de realizarse.

El procedimiento será:

```text
CAMBIO PROPUESTO
        ↓
IDENTIFICAR CONSUMIDORES
        ↓
EVALUAR IMPACTO
        ↓
ACTUALIZAR PRUEBAS
        ↓
IMPLEMENTAR
```

No deben modificarse contratos compartidos sin conocer qué módulos los utilizan.

---

# 38. Criterio de estabilidad

Un componente compartido debe ser más estable que los módulos que lo consumen.

Por esta razón, un componente experimental no debe colocarse rápidamente en:

```text
shared/
```

La regla será:

```text
MÁS COMPARTIDO
        ↓
MÁS ESTABLE DEBE SER
```

Si una funcionalidad cambia frecuentemente porque todavía está siendo descubierta, debe permanecer cerca del módulo propietario.

---

# 39. Arquitectura inicial recomendada

La estructura inicial será:

```text
src/
│
├── main.js
├── app.module.js
│
├── config/
│   ├── app.config.js
│   ├── database.config.js
│   └── env.validation.js
│
├── database/
│   ├── database.module.js
│   └── prisma.service.js
│
├── common/
│   ├── errors/
│   ├── filters/
│   ├── pipes/
│   ├── decorators/
│   ├── guards/
│   ├── types/
│   └── utils/
│
└── modules/
    ├── presentations/
    ├── supplies/
    ├── suppliers/
    └── ...
```

No es obligatorio crear todas las subcarpetas de `common` desde el primer commit.

La estructura debe crecer según necesidades reales.

---

# 40. Evolución futura

A medida que avance el sistema pueden aparecer conceptos compartidos legítimos.

Cuando esto ocurra, debe seguirse el proceso:

```text
1. IDENTIFICAR DUPLICACIÓN REAL
```

```text
2. CONFIRMAR QUE REPRESENTA
UNA MISMA ABSTRACCIÓN
```

```text
3. IDENTIFICAR TODOS
LOS CONSUMIDORES
```

```text
4. DEFINIR EL CONTRATO MÍNIMO
```

```text
5. EXTRAER LA RESPONSABILIDAD
```

```text
6. CREAR PRUEBAS PROPIAS
```

```text
7. DOCUMENTAR LA DECISIÓN
```

---

# 41. Relación con los módulos

La arquitectura general será:

```text
                         CONFIG
                           │
                           ↓
                       DATABASE
                           │
                           ↓
        ┌───────────────────────────────────┐
        │              COMMON               │
        │                                   │
        │  Errors │ Filters │ Pipes │ Types │
        └───────────────────────────────────┘
                           ↑
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
 PRESENTATIONS          PRODUCTS           SALES
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                         SHARED
                    SOLO SI EXISTE
                  UNA ABSTRACCIÓN REAL
```

Los módulos son propietarios de su lógica.

`common` y `shared` existen para reducir duplicación técnica y permitir contratos reutilizables, no para centralizar el negocio.

---

# 42. Reglas obligatorias

Las siguientes reglas deben respetarse durante la implementación:

```text
1. NO CREAR UN SHARED GIGANTE.
```

```text
2. NO MOVER LÓGICA DE NEGOCIO
FUERA DEL MÓDULO PROPIETARIO
SIN UNA RAZÓN DOCUMENTADA.
```

```text
3. COMMON NO PUEDE DEPENDER
DE MÓDULOS DE NEGOCIO.
```

```text
4. NO CREAR BASE SERVICES
POR DEFECTO.
```

```text
5. NO CREAR BASE REPOSITORIES
POR DEFECTO.
```

```text
6. NO CREAR GENERIC CRUD
COMO ABSTRACCIÓN UNIVERSAL.
```

```text
7. NO EXTRAER CÓDIGO
ANTES DE EXISTIR
UNA NECESIDAD REAL.
```

```text
8. LOS CONTRATOS COMPARTIDOS
DEBEN SER MÍNIMOS Y ESTABLES.
```

```text
9. LAS REGLAS DE NEGOCIO
PERMANECEN EN SUS MÓDULOS.
```

```text
10. SHARED NO DEBE UTILIZARSE
PARA OCULTAR DEPENDENCIAS
CIRCULARES.
```

---

# 43. Decisión arquitectónica

La decisión para V1 será:

```text
COMMON PEQUEÑO
```

```text
SHARED KERNEL MÍNIMO
```

```text
MÓDULOS AUTÓNOMOS
```

```text
EXTRACCIÓN BASADA
EN NECESIDAD REAL
```

El sistema no comenzará con una arquitectura compleja de componentes compartidos.

La reutilización será introducida progresivamente y únicamente cuando exista una responsabilidad transversal estable.

---

# 44. Estado del documento

```text
Documento:
04-shared-kernel-and-common-components.md

Versión:
V1

Estado:
DEFINIDO PARA IMPLEMENTACIÓN

Objetivo:
CONTROLAR LA CREACIÓN Y EVOLUCIÓN
DE COMPONENTES TRANSVERSALES

Principio principal:
COMPARTIR SOLO LO QUE ES
REALMENTE COMPARTIDO

Restricción principal:
LA LÓGICA DE NEGOCIO
PERMANECE EN EL MÓDULO
QUE ES PROPIETARIO DE ELLA
```
