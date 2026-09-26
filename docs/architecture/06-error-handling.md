# Manejo de Errores — V1

## 1. Propósito del documento

Este documento define cómo el backend de **App Gestión Empresarial de Yogurt** debe detectar, clasificar, propagar, registrar y exponer errores.

Su objetivo es garantizar que el sistema:

* responda de forma consistente;
* no exponga detalles internos innecesarios;
* diferencie correctamente errores de validación, negocio, autorización, persistencia e infraestructura;
* preserve la trazabilidad de fallos relevantes;
* permita al frontend interpretar correctamente las respuestas;
* evite que cada módulo implemente su propio formato de errores.

Este documento se aplica al backend ubicado en:

```text
apps/api
```

y complementa:

```text
docs/backend/03-api-design.md
docs/backend/04-persistence-boundaries.md
docs/backend/05-transaction-boundaries.md
```

También debe respetar las reglas documentadas en:

```text
docs/data-model/03-data-integrity-rules.md
docs/data-model/04-history-and-traceability.md
docs/data-model/08-cross-module-rules.md
```

---

# 2. Principio fundamental

Un error debe conservar su significado.

El backend no debe convertir todos los problemas en:

```text
500 Internal Server Error
```

Tampoco debe responder simplemente:

```json
{
  "message": "Error"
}
```

El sistema debe diferenciar:

```text
SOLICITUD INVÁLIDA
        ≠
REGLA DE NEGOCIO INCUMPLIDA
        ≠
RECURSO NO ENCONTRADO
        ≠
ACCESO NO AUTORIZADO
        ≠
CONFLICTO DE ESTADO
        ≠
ERROR DE INFRAESTRUCTURA
        ≠
ERROR INTERNO
```

La clasificación del error debe permitir conocer:

```text
QUÉ OCURRIÓ
        +
POR QUÉ LA OPERACIÓN NO PUDO COMPLETARSE
        +
CÓMO DEBE INTERPRETARLO EL CLIENTE
```

sin exponer detalles internos innecesarios.

---

# 3. Regla general

Toda excepción que llegue a la capa HTTP debe transformarse a un formato estándar de respuesta.

La estructura conceptual será:

```text
ERROR INTERNO
        ↓
CLASIFICACIÓN
        ↓
TRADUCCIÓN A ERROR DE API
        ↓
RESPUESTA ESTANDARIZADA
```

El frontend no debe depender de:

* mensajes arbitrarios;
* excepciones propias de Prisma;
* mensajes internos de NestJS;
* nombres de tablas;
* nombres de columnas;
* trazas internas;
* detalles de infraestructura.

---

# 4. Categorías oficiales de errores

El backend utilizará las siguientes categorías conceptuales.

```text
VALIDATION_ERROR
```

La solicitud contiene información inválida.

```text
NOT_FOUND
```

El recurso solicitado no existe.

```text
BUSINESS_RULE_VIOLATION
```

La solicitud es técnicamente válida, pero viola una regla del negocio.

```text
UNAUTHORIZED
```

El usuario no está autenticado correctamente.

```text
FORBIDDEN
```

El usuario está autenticado, pero no tiene permiso para ejecutar la operación.

```text
CONFLICT
```

La operación entra en conflicto con el estado actual del sistema.

```text
PERSISTENCE_ERROR
```

Existe un problema relacionado con la persistencia que no puede exponerse directamente al cliente.

```text
INFRASTRUCTURE_ERROR
```

Existe un problema en una dependencia técnica o infraestructura.

```text
INTERNAL_ERROR
```

Ocurrió un error inesperado no clasificado.

Estas categorías representan el significado del problema, no necesariamente una clase específica desde el primer día.

La implementación podrá evolucionar según:

```text
docs/architecture/architecture-evolution.md
```

---

# 5. Errores de validación

Un error de validación ocurre cuando la solicitud no cumple los requisitos de entrada definidos.

Ejemplos conceptuales:

```text
campo requerido ausente
```

```text
cantidad con formato inválido
```

```text
fecha inválida
```

```text
valor numérico fuera del formato permitido
```

```text
estructura incorrecta del request
```

Estos errores deben detectarse lo más cerca posible del límite de entrada.

Conceptualmente:

```text
HTTP REQUEST
        ↓
DTO / INPUT VALIDATION
        ↓
VALIDATION ERROR
```

No debe iniciarse una operación de negocio si la solicitud ya es estructuralmente inválida.

---

# 6. Errores de regla de negocio

Una solicitud puede ser válida desde el punto de vista técnico y, aun así, no poder ejecutarse.

Ejemplos conceptuales:

```text
intentar producir sin inventario suficiente
```

```text
intentar vender una cantidad no disponible
```

```text
intentar utilizar una receta no válida para la operación
```

```text
intentar modificar un hecho histórico de una forma no permitida
```

```text
intentar operar sobre un registro que se encuentra en un estado incompatible
```

La diferencia es:

```text
VALIDATION ERROR
```

significa:

```text
LA INFORMACIÓN RECIBIDA ES INVÁLIDA
```

Mientras que:

```text
BUSINESS_RULE_VIOLATION
```

significa:

```text
LA INFORMACIÓN ES VÁLIDA,
PERO LA OPERACIÓN NO ESTÁ PERMITIDA
```

---

# 7. Errores de recurso no encontrado

Se utilizará la categoría:

```text
NOT_FOUND
```

cuando una operación requiera un recurso que no existe.

Ejemplos:

```text
presentationId inexistente
```

```text
supplierId inexistente
```

```text
productId inexistente
```

```text
clientId inexistente
```

La respuesta no debe depender directamente del error generado por la base de datos.

Incorrecto conceptualmente:

```text
Foreign key constraint failed
```

Correcto conceptualmente:

```text
Supplier not found
```

o, en el formato definitivo de la API:

```text
El proveedor solicitado no existe.
```

---

# 8. Errores de autenticación

Se utilizará:

```text
UNAUTHORIZED
```

cuando el sistema no pueda reconocer una identidad válida para ejecutar una operación protegida.

Ejemplos conceptuales:

```text
token ausente
```

```text
token inválido
```

```text
token expirado
```

```text
credenciales inválidas
```

Estos errores pertenecen principalmente al límite de autenticación.

No deben mezclarse con:

```text
FORBIDDEN
```

La diferencia es:

```text
UNAUTHORIZED
```

significa:

```text
NO EXISTE UNA AUTENTICACIÓN VÁLIDA
```

Mientras que:

```text
FORBIDDEN
```

significa:

```text
LA IDENTIDAD ES VÁLIDA,
PERO NO TIENE AUTORIZACIÓN
```

---

# 9. Errores de autorización

Se utilizará:

```text
FORBIDDEN
```

cuando un usuario autenticado intente ejecutar una operación para la cual no tiene permisos.

Ejemplo conceptual:

```text
USER
        ↓
solicita
        ↓
AUTORIZAR AJUSTE DE INVENTARIO
        ↓
PERMISOS INSUFICIENTES
```

La respuesta no debe revelar información innecesaria sobre permisos internos o configuración de roles.

---

# 10. Errores de conflicto

Se utilizará:

```text
CONFLICT
```

cuando la solicitud entre en conflicto con el estado actual del sistema.

Ejemplos conceptuales:

```text
intentar registrar una operación duplicada
```

```text
intentar confirmar dos veces la misma operación
```

```text
intentar crear un registro con un identificador único ya existente
```

```text
intentar modificar un registro cuyo estado ya cambió
```

```text
intentar ejecutar una operación incompatible con el estado actual
```

No todo conflicto debe ser tratado automáticamente como una violación de validación.

La clasificación debe representar correctamente la causa.

---

# 11. Errores de persistencia

Los errores internos generados por la base de datos o por Prisma no deben exponerse directamente al cliente.

Ejemplo incorrecto:

```text
PrismaClientKnownRequestError:
Unique constraint failed on the fields:
(`supplier_id`)
```

El backend debe traducir este error.

Conceptualmente:

```text
PRISMA ERROR
        ↓
TRANSLATION
        ↓
CONFLICT
```

o:

```text
PRISMA ERROR
        ↓
TRANSLATION
        ↓
NOT_FOUND
```

o:

```text
PRISMA ERROR
        ↓
TRANSLATION
        ↓
PERSISTENCE_ERROR
```

según el significado real del problema.

El cliente nunca debe depender de detalles específicos del ORM.

---

# 12. Errores inesperados

Un error no controlado debe terminar en:

```text
INTERNAL_ERROR
```

con una respuesta segura.

Ejemplo conceptual:

```text
UNEXPECTED ERROR
        ↓
LOG INTERNAL DETAILS
        ↓
RETURN SAFE RESPONSE
```

El cliente no debe recibir:

* stack trace;
* nombres internos de archivos;
* consultas SQL;
* credenciales;
* variables de entorno;
* rutas internas del servidor;
* detalles de infraestructura.

---

# 13. Formato estándar de error

Todas las respuestas de error deberán seguir una estructura consistente.

La estructura inicial será:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "La solicitud contiene información inválida.",
  "details": []
}
```

Para errores sin detalles específicos:

```json
{
  "statusCode": 404,
  "code": "NOT_FOUND",
  "message": "El recurso solicitado no existe.",
  "details": []
}
```

Para una regla de negocio:

```json
{
  "statusCode": 422,
  "code": "BUSINESS_RULE_VIOLATION",
  "message": "No hay inventario suficiente para completar la operación.",
  "details": []
}
```

Para un error inesperado:

```json
{
  "statusCode": 500,
  "code": "INTERNAL_ERROR",
  "message": "Ocurrió un error interno. Intente nuevamente.",
  "details": []
}
```

La estructura definitiva deberá mantenerse consistente en todos los módulos.

---

# 14. Campo `statusCode`

El campo:

```text
statusCode
```

representa el código HTTP asociado al resultado.

Ejemplos iniciales:

```text
400 → solicitud inválida
401 → autenticación inválida o ausente
403 → operación no permitida
404 → recurso no encontrado
409 → conflicto
422 → regla de negocio incumplida
500 → error interno
```

La selección final debe respetar el significado real del error.

No debe utilizarse:

```text
400
```

para todos los errores del sistema.

---

# 15. Campo `code`

El campo:

```text
code
```

representa un código estable que puede ser interpretado por el frontend.

Ejemplos:

```text
VALIDATION_ERROR
```

```text
NOT_FOUND
```

```text
BUSINESS_RULE_VIOLATION
```

```text
UNAUTHORIZED
```

```text
FORBIDDEN
```

```text
CONFLICT
```

```text
INTERNAL_ERROR
```

El frontend debe priorizar:

```text
code
```

para determinar el tipo de error.

No debe depender exclusivamente del texto de:

```text
message
```

para implementar lógica.

Incorrecto:

```text
if message === "No hay inventario suficiente"
```

Correcto conceptualmente:

```text
if code === "BUSINESS_RULE_VIOLATION"
```

Cuando en el futuro se necesiten códigos más específicos, podrán evolucionar.

Ejemplo:

```text
INSUFFICIENT_INVENTORY
```

```text
LOT_EXPIRED
```

```text
OPERATION_ALREADY_CONFIRMED
```

No deben crearse códigos excesivamente específicos antes de que exista una necesidad real.

---

# 16. Campo `message`

El campo:

```text
message
```

debe proporcionar una explicación comprensible del problema.

Debe evitar:

```text
Error 23505
```

o:

```text
Prisma exception
```

o:

```text
Cannot read properties of undefined
```

El mensaje debe expresar el problema desde la perspectiva de la operación.

Ejemplo:

```text
No se puede completar la producción porque no existe inventario suficiente.
```

El mensaje puede ser utilizado directamente por el frontend cuando corresponda, pero no debe contener detalles sensibles.

---

# 17. Campo `details`

El campo:

```text
details
```

permitirá incluir información adicional estructurada cuando sea necesario.

Ejemplo conceptual:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "La solicitud contiene errores de validación.",
  "details": [
    {
      "field": "quantity",
      "message": "Debe ser mayor que cero."
    }
  ]
}
```

No debe utilizarse `details` para exponer:

* consultas SQL;
* nombres internos de tablas;
* stack traces;
* errores completos del ORM;
* información sensible.

---

# 18. Relación entre HTTP y errores de negocio

El controlador no debe contener la lógica para decidir manualmente cada respuesta de error.

Incorrecto conceptualmente:

```text
Controller
        ↓
if inventory <= 0
    return response.status(422)
```

La operación debe expresar el error desde su responsabilidad correspondiente.

Conceptualmente:

```text
Controller
        ↓
Application / Service
        ↓
Business Error
        ↓
Global Error Handling
        ↓
HTTP Response
```

Esto evita que cada controlador implemente formatos diferentes.

---

# 19. Manejo global de errores

El backend deberá implementar un mecanismo centralizado para transformar errores en respuestas HTTP consistentes.

Conceptualmente:

```text
REQUEST
        ↓
CONTROLLER
        ↓
SERVICE
        ↓
ERROR
        ↓
GLOBAL EXCEPTION FILTER
        ↓
STANDARD API RESPONSE
```

Este mecanismo será responsable de:

* identificar errores conocidos;
* traducir excepciones;
* asignar el código HTTP correspondiente;
* construir la respuesta estándar;
* registrar información interna cuando corresponda;
* evitar la exposición de detalles técnicos.

Los módulos no deben implementar filtros de errores incompatibles entre sí.

---

# 20. Registro interno de errores

Los errores relevantes deberán poder registrarse internamente para facilitar diagnóstico.

El registro puede incluir, cuando sea seguro:

```text
timestamp
error category
internal message
operation
module
request context
correlation identifier cuando exista
```

No deben registrarse innecesariamente:

* contraseñas;
* tokens completos;
* secretos;
* información sensible que no sea necesaria para diagnóstico.

La estrategia completa de logging podrá definirse en un documento específico si el proyecto lo requiere.

---

# 21. Errores y transacciones

Cuando una operación transaccional falla, el error debe representar el resultado real de la operación.

Conceptualmente:

```text
OPERATION
        ↓
TRANSACTION
        ↓
FAILURE
        ↓
ROLLBACK
        ↓
CLASSIFY ERROR
        ↓
RETURN STANDARD RESPONSE
```

El cliente no debe recibir una respuesta de éxito si la transacción fue revertida.

Tampoco debe recibir información que sugiera que una parte de la operación fue confirmada cuando la unidad transaccional completa no se confirmó.

---

# 22. Errores de concurrencia

Las operaciones críticas pueden fallar porque el estado de los datos cambió mientras se procesaba la solicitud.

Ejemplo conceptual:

```text
REQUEST A
        ↓
LEE INVENTARIO
        ↓
REQUEST B
        ↓
MODIFICA INVENTARIO
        ↓
REQUEST A
        ↓
INTENTA COMPLETAR OPERACIÓN
```

El backend debe detectar y clasificar correctamente el resultado.

Según la operación, puede representar:

```text
CONFLICT
```

o:

```text
BUSINESS_RULE_VIOLATION
```

La clasificación dependerá de la causa concreta.

No debe ocultarse un problema de concurrencia bajo un mensaje genérico cuando pueda identificarse correctamente.

---

# 23. Errores de dependencias externas

Cuando en el futuro una operación dependa de servicios externos, un fallo de dicha dependencia no debe exponerse directamente.

Conceptualmente:

```text
APPLICATION
        ↓
EXTERNAL DEPENDENCY
        ↓
FAILURE
        ↓
INFRASTRUCTURE_ERROR
```

La respuesta debe indicar que la operación no pudo completarse sin revelar:

* credenciales;
* configuración;
* URL internas;
* respuestas completas del proveedor.

No se implementará infraestructura adicional para dependencias externas hasta que exista una necesidad real.

---

# 24. Reintentos

El backend no debe reintentar automáticamente cualquier operación fallida.

Debe diferenciarse entre:

```text
ERROR TRANSITORIO
```

y:

```text
ERROR DE NEGOCIO
```

Ejemplo:

```text
insufficient inventory
```

no debe ser reintentado automáticamente.

En cambio, una futura dependencia externa temporalmente no disponible podría requerir una estrategia específica.

La estrategia de reintentos solo se introducirá cuando exista una necesidad concreta.

---

# 25. Idempotencia y errores

Las operaciones históricas críticas deben poder distinguir entre:

```text
OPERACIÓN NUEVA
```

y:

```text
REINTENTO DE UNA OPERACIÓN ANTERIOR
```

Esto es especialmente importante para:

```text
purchases
production
sales
payments
inventory adjustments
```

Si una operación ya fue confirmada, el sistema no debe duplicar sus efectos.

El resultado puede clasificarse como:

```text
CONFLICT
```

o manejarse mediante una estrategia de idempotencia definida para esa operación.

La decisión concreta se tomará durante la implementación de cada proceso crítico.

---

# 26. Lo que no debe hacerse

No se debe:

```text
devolver siempre 500
```

No se debe:

```text
capturar todos los errores y ocultarlos
```

No se debe:

```text
devolver directamente errores de Prisma
```

No se debe:

```text
usar el texto del mensaje como contrato técnico
```

No se debe:

```text
exponer stack traces
```

No se debe:

```text
registrar secretos innecesariamente
```

No se debe:

```text
crear un sistema complejo de excepciones
sin una necesidad real
```

No se debe:

```text
manejar cada error de forma distinta
en cada módulo
```

---

# 27. Evolución del sistema de errores

La estructura inicial debe ser suficiente para proporcionar respuestas consistentes.

Inicialmente puede utilizarse una clasificación simple:

```text
VALIDATION_ERROR
NOT_FOUND
BUSINESS_RULE_VIOLATION
UNAUTHORIZED
FORBIDDEN
CONFLICT
INTERNAL_ERROR
```

Si durante la implementación aparecen necesidades reales, podrán agregarse códigos específicos.

Ejemplo:

```text
INSUFFICIENT_INVENTORY
```

```text
LOT_EXPIRED
```

```text
INVALID_OPERATION_STATE
```

```text
DUPLICATE_OPERATION
```

La evolución deberá respetar:

```text
docs/architecture/architecture-evolution.md
```

No se creará una jerarquía extensa de excepciones antes de que la complejidad real del sistema lo justifique.

---

# 28. Proceso para agregar un nuevo error

Antes de crear una nueva categoría o código de error deberá responderse:

```text
1. ¿Es un error de validación?

2. ¿Es una regla de negocio?

3. ¿Es un recurso inexistente?

4. ¿Es un problema de autorización?

5. ¿Es un conflicto de estado?

6. ¿Es un problema técnico interno?

7. ¿Existe ya una categoría adecuada?
```

Solo se creará un nuevo código específico cuando aporte una diferencia útil para:

```text
backend
frontend
trazabilidad
operación
```

---

# 29. Responsabilidades

La distribución inicial de responsabilidades será:

```text
DTO / Validation
        ↓
Valida estructura y formato
```

```text
Service / Application
        ↓
Aplica reglas de negocio
```

```text
Repository
        ↓
Ejecuta persistencia
```

```text
Persistence Translation
        ↓
Traduce errores técnicos relevantes
```

```text
Global Error Handling
        ↓
Transforma errores a respuesta HTTP estándar
```

Esta distribución podrá evolucionar, pero ningún módulo debe romper el contrato estándar de errores.

---

# 30. Estado actual

```text
Documento: 06-error-handling.md
Versión: V1
Estado: APROBADO COMO BASE DE MANEJO DE ERRORES
```

Este documento establece un sistema de manejo de errores centralizado y consistente. Cada error debe conservar su significado, los detalles internos deben permanecer protegidos y todas las respuestas del backend deben seguir un contrato uniforme que permita al frontend interpretar correctamente el resultado de cada operación.
