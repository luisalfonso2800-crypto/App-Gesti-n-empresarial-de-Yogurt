# API Implementation Plan — V1

## 1. Propósito del documento

Este documento define el plan para implementar la capa de API del sistema de gestión empresarial de yogurt.

Su objetivo es traducir los módulos, casos de uso, reglas de validación y fronteras definidas en la documentación existente en endpoints HTTP concretos.

La API no redefine el modelo de negocio.

La API expone las capacidades del sistema de forma controlada.

La regla principal será:

```text
DOCUMENTACIÓN DEL DOMINIO
        ↓
CASOS DE USO
        ↓
SERVICIOS DE APLICACIÓN
        ↓
API
        ↓
CLIENTE
```

No debe ocurrir:

```text
CREAR ENDPOINT
        ↓
INVENTAR COMPORTAMIENTO
        ↓
MODIFICAR EL DOMINIO
```

---

# 2. Fuentes de decisión

La implementación de la API debe respetar la documentación ya definida.

Las principales fuentes serán:

```text
docs/domains/
```

Define:

* responsabilidades funcionales;
* reglas de negocio;
* operaciones del dominio;
* información gestionada por cada módulo.

```text
docs/data-model/
```

Define:

* entidades;
* relaciones;
* reglas de integridad;
* historial;
* trazabilidad;
* responsabilidades de cálculo.

```text
docs/backend/
```

Define:

* límites de módulos;
* dependencias;
* diseño general de API;
* fronteras de persistencia;
* transacciones;
* manejo de errores;
* estrategia de validación.

```text
docs/implementation/
```

Define:

* orden general de implementación;
* bootstrap;
* implementación de base de datos;
* orden de módulos;
* componentes compartidos;
* implementación de Prisma.

La API debe implementar estas decisiones.

No debe convertirse en una nueva fuente de reglas.

---

# 3. Principio de implementación

La API debe ser una capa de entrada al sistema.

Su responsabilidad será:

```text
RECIBIR SOLICITUD
        ↓
VALIDAR ESTRUCTURA
        ↓
AUTENTICAR
        ↓
AUTORIZAR
        ↓
EJECUTAR CASO DE USO
        ↓
DEVOLVER RESPUESTA
```

La API no debe concentrar reglas de negocio complejas.

No debe realizar directamente:

```text
Controller
    ↓
Prisma
```

para operaciones que impliquen reglas del dominio.

La estructura objetivo será:

```text
HTTP REQUEST
     ↓
CONTROLLER
     ↓
APPLICATION SERVICE / USE CASE
     ↓
DOMINIO
     ↓
PERSISTENCIA
```

---

# 4. Base de rutas

La API utilizará una estructura versionada.

La base inicial será:

```text
/api/v1
```

Ejemplo:

```text
GET /api/v1/presentations
```

La versión representa el contrato público de la API.

Los cambios incompatibles no deben introducirse silenciosamente dentro de la misma versión.

---

# 5. Principio de diseño de endpoints

Los endpoints deben representar recursos y capacidades reales del sistema.

La regla general será:

```text
RECURSO
    ↓
OPERACIONES ESTÁNDAR
```

Ejemplo:

```text
GET    /products
POST   /products
GET    /products/:id
PATCH  /products/:id
```

Sin embargo, no todas las operaciones pueden representarse correctamente como CRUD.

Cuando exista un proceso de negocio específico, debe exponerse de acuerdo con su comportamiento.

Ejemplo conceptual:

```text
POST /purchases
```

representa el registro de una compra.

Mientras que:

```text
POST /inventory/movements
```

no debe utilizarse necesariamente como una puerta genérica para permitir cualquier alteración manual del inventario.

La API debe respetar las reglas de cada módulo.

---

# 6. Controladores

Cada módulo será responsable de sus propios controladores.

La estructura conceptual será:

```text
modules/
│
├── presentations/
│   ├── presentations.controller.js
│   └── ...
│
├── products/
│   ├── products.controller.js
│   └── ...
│
└── purchases/
    ├── purchases.controller.js
    └── ...
```

No debe existir un controlador central que concentre todos los endpoints.

Tampoco debe existir un controlador genérico que implemente indiscriminadamente operaciones sobre todas las entidades.

---

# 7. Responsabilidad del Controller

El controller debe encargarse principalmente de:

```text
RECIBIR REQUEST
```

```text
EXTRAER PARÁMETROS
```

```text
RECIBIR DTO
```

```text
INVOCAR CASO DE USO
```

```text
DEVOLVER RESPONSE
```

No debe contener directamente:

```text
REGLAS COMPLEJAS
```

```text
CÁLCULOS DE NEGOCIO
```

```text
TRANSACCIONES
```

```text
CONSULTAS PRISMA DIRECTAS
```

salvo decisiones técnicas muy específicas y justificadas.

---

# 8. DTOs de entrada

Cada operación que reciba información externa debe definir contratos de entrada claros.

Ejemplo conceptual:

```text
CreateProductDto
```

```text
UpdateProductDto
```

```text
CreatePurchaseDto
```

```text
CreateSaleDto
```

Los DTOs representan la estructura esperada por la API.

No deben reutilizarse automáticamente como modelos internos del dominio.

La relación conceptual será:

```text
REQUEST
    ↓
DTO
    ↓
VALIDACIÓN
    ↓
CASO DE USO
```

---

# 9. DTOs de salida

Las respuestas tampoco deben depender directamente de los modelos internos de Prisma.

La API debe controlar qué información expone.

Conceptualmente:

```text
PRISMA MODEL
      ↓
APPLICATION DATA
      ↓
RESPONSE DTO
      ↓
JSON RESPONSE
```

Esto evita que cambios internos de persistencia modifiquen accidentalmente el contrato público.

---

# 10. Validación de entrada

La validación debe seguir la estrategia definida en:

```text
docs/backend/07-validation-strategy.md
```

Debe existir una separación entre:

```text
VALIDACIÓN ESTRUCTURAL
```

y:

```text
VALIDACIÓN DE NEGOCIO
```

Ejemplo:

```text
cantidad debe ser un número válido
```

es validación estructural.

Mientras que:

```text
cantidad disponible debe ser suficiente
```

es una regla de negocio.

La primera puede ocurrir en la entrada.

La segunda debe verificarse dentro del caso de uso correspondiente.

---

# 11. Transformación de datos

La API puede transformar datos externos al formato requerido internamente.

Por ejemplo:

```text
STRING
    ↓
DATE
```

o:

```text
STRING
    ↓
DECIMAL
```

cuando sea necesario.

Sin embargo, no debe ocultar errores de entrada.

Si un dato es inválido:

```text
REQUEST INVÁLIDO
        ↓
ERROR DE VALIDACIÓN
```

No debe convertirse silenciosamente en:

```text
VALOR POR DEFECTO
```

sin una regla explícita.

---

# 12. Endpoints de Presentaciones

El módulo de presentaciones expondrá las operaciones necesarias para gestionar el catálogo de presentaciones.

Estructura inicial:

```text
GET    /api/v1/presentations
POST   /api/v1/presentations

GET    /api/v1/presentations/:id
PATCH  /api/v1/presentations/:id
```

La posibilidad de eliminar una presentación dependerá de las reglas de integridad y relaciones existentes.

No debe añadirse:

```text
DELETE /presentations/:id
```

automáticamente.

Primero debe verificarse si su eliminación puede afectar productos, historial u otras relaciones.

---

# 13. Endpoints de Insumos

Estructura inicial:

```text
GET    /api/v1/supplies
POST   /api/v1/supplies

GET    /api/v1/supplies/:id
PATCH  /api/v1/supplies/:id
```

Las operaciones adicionales deben responder a necesidades reales del módulo.

La API no debe permitir modificar arbitrariamente información que pueda afectar operaciones históricas.

---

# 14. Endpoints de Proveedores

Estructura inicial:

```text
GET    /api/v1/suppliers
POST   /api/v1/suppliers

GET    /api/v1/suppliers/:id
PATCH  /api/v1/suppliers/:id
```

Las relaciones con precios deben implementarse según la frontera definida entre proveedores, insumos y precios.

No deben mezclarse las responsabilidades dentro de un único endpoint ambiguo.

---

# 15. Endpoints de Precios de Proveedores

Cuando el modelo requiera administrar precios de proveedores, la API debe permitir gestionar esa relación.

Conceptualmente:

```text
GET  /api/v1/supplier-prices
POST /api/v1/supplier-prices
```

También pueden existir consultas filtradas por proveedor o insumo.

Por ejemplo:

```text
GET /api/v1/suppliers/:supplierId/prices
```

o:

```text
GET /api/v1/supplies/:supplyId/prices
```

La implementación definitiva debe evitar duplicar rutas que representen exactamente la misma responsabilidad.

---

# 16. Endpoints de Productos

Estructura inicial:

```text
GET    /api/v1/products
POST   /api/v1/products

GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
```

Las consultas pueden permitir filtros definidos por necesidades reales, por ejemplo:

```text
GET /api/v1/products?presentationId=...
```

Los filtros deben ser explícitos y validados.

---

# 17. Endpoints de Recetas

La receta es una estructura compuesta.

Su API debe reflejar esa operación.

Estructura conceptual:

```text
GET    /api/v1/recipes
POST   /api/v1/recipes

GET    /api/v1/recipes/:id
PATCH  /api/v1/recipes/:id
```

La creación o modificación de una receta puede incluir sus detalles como parte de una operación completa.

Conceptualmente:

```text
CREATE RECIPE
        +
CREATE RECIPE DETAILS
```

Si ambas operaciones deben ocurrir juntas, el caso de uso correspondiente debe definir una frontera transaccional.

---

# 18. Endpoints de Compras

Las compras representan una operación de negocio.

La API inicial será:

```text
GET  /api/v1/purchases
POST /api/v1/purchases

GET /api/v1/purchases/:id
```

El registro de una compra puede implicar:

```text
CREAR COMPRA
        ↓
CREAR DETALLES
        ↓
REGISTRAR EFECTO EN INVENTARIO
```

La API expone una única operación.

El caso de uso controla las operaciones internas.

No debe requerirse al cliente realizar múltiples solicitudes para completar una compra que representa una sola operación de negocio.

---

# 19. Endpoints de Inventario

El inventario debe distinguir entre consultas del estado y operaciones que modifican dicho estado.

Para consultas:

```text
GET /api/v1/inventory
```

```text
GET /api/v1/inventory/:id
```

Para movimientos históricos:

```text
GET /api/v1/inventory/movements
```

No debe existir inicialmente una operación genérica:

```text
POST /api/v1/inventory
```

si el inventario se modifica como consecuencia de compras, producción u otras operaciones controladas.

La API debe respetar el flujo de inventario documentado.

---

# 20. Endpoints de Producción

La producción representa un proceso.

Estructura inicial:

```text
GET  /api/v1/production
POST /api/v1/production

GET /api/v1/production/:id
```

El registro de producción puede afectar:

```text
PRODUCCIÓN
        ↓
DETALLES
        ↓
CONSUMO DE INVENTARIO
        ↓
GENERACIÓN DE RESULTADOS
        ↓
CREACIÓN DE LOTES
```

La API debe exponer el proceso como una operación coherente.

La lógica de coordinación pertenece al caso de uso.

---

# 21. Endpoints de Lotes

La API debe permitir consultar los lotes generados.

Estructura inicial:

```text
GET /api/v1/lots
GET /api/v1/lots/:id
```

Las consultas pueden permitir filtros relacionados con:

```text
producto
```

```text
fecha de vencimiento
```

```text
estado
```

cuando estas capacidades estén definidas por el modelo.

La creación directa de un lote no debe exponerse automáticamente.

Si un lote nace como resultado de producción, su creación debe estar controlada por ese proceso.

---

# 22. Endpoints de Clientes

Estructura inicial:

```text
GET    /api/v1/clients
POST   /api/v1/clients

GET    /api/v1/clients/:id
PATCH  /api/v1/clients/:id
```

Las reglas relacionadas con clientes deben permanecer dentro del módulo correspondiente.

---

# 23. Endpoints de Ventas

Las ventas representan una operación de negocio compuesta.

Estructura inicial:

```text
GET  /api/v1/sales
POST /api/v1/sales

GET /api/v1/sales/:id
```

El registro de una venta puede implicar:

```text
CREAR VENTA
        ↓
CREAR DETALLES
        ↓
VALIDAR DISPONIBILIDAD
        ↓
REGISTRAR SALIDA DE INVENTARIO
        ↓
ACTUALIZAR RELACIONES NECESARIAS
```

La API debe recibir una solicitud coherente.

No debe obligar al frontend a coordinar directamente cada modificación interna.

---

# 24. Endpoints de Pagos

Estructura inicial:

```text
GET  /api/v1/payments
POST /api/v1/payments

GET /api/v1/payments/:id
```

Los pagos deben respetar las relaciones y reglas definidas para clientes y ventas.

No debe asumirse una relación simplificada entre pago y venta que contradiga el modelo.

---

# 25. Endpoints de Gastos

Estructura inicial:

```text
GET  /api/v1/expenses
POST /api/v1/expenses

GET    /api/v1/expenses/:id
PATCH  /api/v1/expenses/:id
```

Las restricciones sobre modificación o eliminación deben respetar la trazabilidad definida.

---

# 26. Costos y rentabilidad

Los módulos de costos y rentabilidad pueden requerir principalmente endpoints de consulta.

Ejemplo conceptual:

```text
GET /api/v1/costs/...
```

```text
GET /api/v1/profitability/...
```

No debe crearse automáticamente una estructura CRUD para valores que sean calculados.

La API debe reflejar la responsabilidad real:

```text
CONSULTAR RESULTADO
```

no necesariamente:

```text
CREAR
MODIFICAR
ELIMINAR
```

---

# 27. Dashboard

El dashboard representa información consolidada.

Su API puede exponer consultas orientadas a indicadores.

Ejemplo conceptual:

```text
GET /api/v1/dashboard
```

o endpoints específicos cuando sea necesario:

```text
GET /api/v1/dashboard/summary
```

```text
GET /api/v1/dashboard/inventory
```

```text
GET /api/v1/dashboard/sales
```

El dashboard no debe convertirse en propietario de los datos.

Su responsabilidad es consultar y consolidar información.

---

# 28. Parámetros de ruta

Los identificadores deben recibirse de forma consistente.

Ejemplo:

```text
GET /products/:id
```

La validación del identificador debe ocurrir antes de ejecutar el caso de uso.

No debe asumirse que cualquier valor recibido es válido.

---

# 29. Parámetros de consulta

Los filtros deben utilizar parámetros explícitos.

Ejemplo conceptual:

```text
GET /sales?clientId=...
```

```text
GET /sales?from=...
```

```text
GET /sales?to=...
```

Los parámetros deben:

* validarse;
* tener tipos definidos;
* respetar límites razonables;
* no permitir consultas arbitrarias.

---

# 30. Paginación

Las colecciones potencialmente grandes deben prepararse para paginación.

La estrategia concreta debe mantenerse consistente.

Ejemplo conceptual:

```text
GET /sales?page=1&limit=20
```

La respuesta debe incluir información suficiente para conocer el resultado de la consulta.

Conceptualmente:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0
  }
}
```

La implementación definitiva debe mantener un único contrato consistente para las colecciones paginadas.

---

# 31. Ordenamiento

Cuando una colección permita ordenamiento, los campos disponibles deben ser explícitos.

No debe permitirse que el cliente envíe libremente cualquier nombre de columna.

Ejemplo conceptual:

```text
sortBy=date
sortOrder=desc
```

La aplicación debe validar los campos permitidos.

---

# 32. Respuestas exitosas

La API debe mantener respuestas coherentes.

Ejemplo:

```text
GET
```

devuelve:

```text
200 OK
```

Una creación correcta puede devolver:

```text
201 Created
```

Una operación que no requiere cuerpo de respuesta puede utilizar:

```text
204 No Content
```

La implementación debe mantener consistencia entre módulos.

---

# 33. Recursos no encontrados

Cuando un recurso solicitado no exista:

```text
GET /products/:id
```

debe responder con:

```text
404 Not Found
```

No debe devolver:

```text
200 OK
{}
```

ni:

```text
500 Internal Server Error
```

para una ausencia normal de datos.

---

# 34. Errores de validación

Cuando la estructura de la solicitud sea inválida:

```text
400 Bad Request
```

o el código equivalente definido por la estrategia global.

La respuesta debe proporcionar información suficiente para identificar el problema sin exponer detalles internos.

---

# 35. Conflictos

Cuando una operación viole una restricción lógica o de unicidad aplicable:

```text
409 Conflict
```

puede utilizarse según las decisiones definidas en la estrategia de manejo de errores.

Ejemplo conceptual:

```text
código ya existente
```

La respuesta debe utilizar un formato consistente.

---

# 36. Errores internos

Los errores inesperados deben ser tratados por la capa global de manejo de errores.

No deben exponerse:

```text
stack traces
```

```text
consultas SQL
```

```text
detalles internos de Prisma
```

al cliente.

El error interno debe registrarse adecuadamente según la estrategia del backend.

---

# 37. Formato de errores

El formato debe ser consistente en toda la API.

Conceptualmente:

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "The request contains invalid data"
}
```

Los detalles concretos deben respetar el contrato definido en:

```text
docs/backend/06-error-handling.md
```

No deben existir formatos diferentes por cada módulo sin una razón documentada.

---

# 38. Autenticación

La implementación de endpoints protegidos debe respetar la arquitectura de autenticación definida para el backend.

El flujo conceptual será:

```text
REQUEST
    ↓
AUTH GUARD
    ↓
IDENTIDAD AUTENTICADA
    ↓
CONTROLLER
    ↓
CASO DE USO
```

La autenticación no debe implementarse manualmente dentro de cada controller.

---

# 39. Autorización

Las reglas de acceso deben estar separadas de la autenticación.

Conceptualmente:

```text
¿QUIÉN ES?
    ↓
AUTENTICACIÓN

¿QUÉ PUEDE HACER?
    ↓
AUTORIZACIÓN
```

La implementación debe respetar las decisiones de roles y permisos definidas por el sistema.

No debe añadirse lógica de autorización inconsistente entre módulos.

---

# 40. Endpoints públicos y protegidos

Cada endpoint debe clasificarse explícitamente.

```text
PÚBLICO
```

o:

```text
PROTEGIDO
```

No se debe asumir que un endpoint es público simplemente porque todavía no se ha implementado autenticación.

La protección debe incorporarse como parte del contrato.

---

# 41. Documentación de API

La API debe documentarse progresivamente.

Cada endpoint implementado debe registrar:

* propósito;
* método HTTP;
* ruta;
* parámetros;
* cuerpo de entrada;
* respuesta;
* posibles errores;
* requisitos de autenticación.

La documentación técnica debe mantenerse alineada con la implementación.

---

# 42. Contrato antes de implementación

Antes de implementar un grupo de endpoints debe definirse su contrato.

El proceso será:

```text
MÓDULO
    ↓
CASOS DE USO
    ↓
OPERACIONES EXPUESTAS
    ↓
REQUEST DTO
    ↓
RESPONSE CONTRACT
    ↓
IMPLEMENTACIÓN
```

No se debe implementar primero y definir el contrato después.

---

# 43. Implementación por módulos

La API se implementará siguiendo el orden general de módulos definido en:

```text
03-module-implementation-order.md
```

El principio será:

```text
IMPLEMENTAR
        ↓
PROBAR
        ↓
VALIDAR CONTRATO
        ↓
DOCUMENTAR
        ↓
CONTINUAR
```

No se implementarán todos los controladores vacíos al inicio.

---

# 44. Primer bloque de API

El primer bloque debe centrarse en entidades maestras.

Orden inicial:

```text
1. Presentaciones
2. Insumos
3. Proveedores
4. Precios de proveedores
5. Productos
```

Estas APIs permitirán establecer los datos necesarios para procesos posteriores.

---

# 45. Segundo bloque de API

Después de validar las entidades maestras:

```text
6. Recetas
7. Compras
8. Inventario
```

Este bloque introduce relaciones y operaciones con mayor impacto sobre el sistema.

---

# 46. Tercer bloque de API

Posteriormente:

```text
9. Producción
10. Lotes
```

Este bloque debe implementarse respetando especialmente:

* consumo de insumos;
* movimientos de inventario;
* creación de lotes;
* fechas de creación;
* fechas de vencimiento;
* trazabilidad.

---

# 47. Cuarto bloque de API

Después:

```text
11. Clientes
12. Ventas
13. Pagos
```

Las ventas deben integrarse correctamente con inventario y trazabilidad.

Los pagos deben respetar el modelo financiero documentado.

---

# 48. Quinto bloque de API

Finalmente:

```text
14. Gastos
15. Costos
16. Rentabilidad
17. Dashboard
```

Estos módulos dependen en mayor medida de información generada por operaciones anteriores.

---

# 49. Estrategia de pruebas de API

Cada endpoint debe probarse antes de considerarse terminado.

Como mínimo:

```text
REQUEST VÁLIDO
```

```text
REQUEST INVÁLIDO
```

```text
RECURSO INEXISTENTE
```

```text
VIOLACIÓN DE REGLA DE NEGOCIO
```

```text
ERROR CONTROLADO
```

```text
AUTENTICACIÓN
```

```text
AUTORIZACIÓN
```

cuando corresponda.

---

# 50. Pruebas de integración

Las operaciones que involucren varios componentes deben probarse como flujo.

Ejemplo:

```text
CREAR INSUMO
        ↓
REGISTRAR PROVEEDOR
        ↓
REGISTRAR PRECIO
        ↓
REGISTRAR COMPRA
        ↓
VERIFICAR INVENTARIO
```

El objetivo es validar que los módulos colaboren correctamente.

---

# 51. Operaciones que no deben fragmentarse desde el cliente

Cuando una operación representa un único proceso de negocio, el cliente no debe coordinar manualmente todas sus partes.

Ejemplo incorrecto:

```text
POST /purchases
        ↓
POST /purchase-details
        ↓
POST /inventory/movements
```

si las tres acciones representan internamente una única compra.

La estructura correcta será:

```text
POST /purchases
        ↓
CASO DE USO
        ├── Compra
        ├── Detalles
        └── Inventario
```

Esto reduce inconsistencias y mantiene las reglas dentro del backend.

---

# 52. Idempotencia

Las operaciones que puedan generar duplicados por reintentos deben analizarse específicamente.

Especialmente:

```text
compras
```

```text
ventas
```

```text
pagos
```

La necesidad de mecanismos de idempotencia debe documentarse cuando exista un riesgo real.

No se añadirá infraestructura compleja de idempotencia sin necesidad demostrada.

---

# 53. Operaciones históricas

Las APIs relacionadas con operaciones históricas deben respetar la trazabilidad.

Una actualización no debe permitir alterar silenciosamente hechos históricos.

Antes de exponer:

```text
PATCH /purchases/:id
```

o:

```text
PATCH /sales/:id
```

debe determinarse si esa modificación está permitida por el modelo.

No debe añadirse CRUD completo por defecto.

---

# 54. Eliminación mediante API

La existencia de un endpoint:

```text
DELETE /resource/:id
```

debe estar justificada.

Para cada entidad debe verificarse:

```text
¿PUEDE ELIMINARSE?
```

```text
¿TIENE HISTORIAL?
```

```text
¿TIENE RELACIONES?
```

```text
¿DEBE DESACTIVARSE EN LUGAR DE ELIMINARSE?
```

La API debe reflejar esa decisión.

---

# 55. Convenciones de nombres

Las rutas deben utilizar una convención consistente.

La estructura base utilizará:

```text
kebab-case
```

cuando sea necesario utilizar múltiples palabras.

Ejemplo:

```text
supplier-prices
```

No deben coexistir:

```text
supplierPrices
```

```text
supplier_prices
```

y:

```text
supplier-prices
```

para representar el mismo recurso.

---

# 56. Convenciones de respuestas

Los nombres de campos expuestos por la API deben ser consistentes.

La convención debe decidirse de forma global y mantenerse.

La API no debe cambiar arbitrariamente entre:

```text
created_at
```

y:

```text
createdAt
```

La decisión concreta debe mantenerse en todos los módulos.

---

# 57. Separación entre API interna y modelo de base de datos

La API no debe exponer directamente la estructura de Prisma.

Ejemplo:

```text
CAMBIO EN DATABASE
```

no debe obligar automáticamente a:

```text
CAMBIO EN API
```

si el contrato externo puede mantenerse estable.

La capa de respuesta debe actuar como frontera.

---

# 58. Proceso de implementación de un endpoint

Cada endpoint debe construirse siguiendo este flujo:

```text
1. IDENTIFICAR CASO DE USO
        ↓
2. REVISAR REGLAS DEL DOMINIO
        ↓
3. DEFINIR REQUEST
        ↓
4. DEFINIR VALIDACIÓN
        ↓
5. DEFINIR RESPONSE
        ↓
6. IMPLEMENTAR CASO DE USO
        ↓
7. IMPLEMENTAR CONTROLLER
        ↓
8. PROBAR
        ↓
9. DOCUMENTAR
```

---

# 59. Criterios de finalización

Un bloque de API estará terminado cuando:

```text
1. LOS ENDPOINTS REPRESENTEN
OPERACIONES REALES DEL MÓDULO.
```

```text
2. LOS REQUEST DTO
ESTÉN VALIDADOS.
```

```text
3. LAS REGLAS DE NEGOCIO
NO ESTÉN DUPLICADAS EN CONTROLLERS.
```

```text
4. LAS RESPUESTAS
SIGAN UN CONTRATO CONSISTENTE.
```

```text
5. LOS ERRORES
ESTÉN NORMALIZADOS.
```

```text
6. LA AUTENTICACIÓN Y AUTORIZACIÓN
SE APLIQUEN CUANDO CORRESPONDA.
```

```text
7. LOS ENDPOINTS
ESTÉN PROBADOS.
```

```text
8. LA DOCUMENTACIÓN
ESTÉ ACTUALIZADA.
```

---

# 60. Decisión de implementación

Para V1 se adopta la siguiente estrategia:

```text
API REST
```

```text
VERSIONADA
```

```text
IMPLEMENTADA POR MÓDULOS
```

```text
CON CONTROLLERS DELGADOS
```

```text
CON DTOs DE ENTRADA Y SALIDA
```

```text
CON VALIDACIÓN ESTRUCTURAL
EN LA FRONTERA HTTP
```

```text
CON REGLAS DE NEGOCIO
DENTRO DE LOS CASOS DE USO
```

```text
CON CONTRATOS DEFINIDOS
ANTES DE IMPLEMENTAR
```

```text
SIN CRUD AUTOMÁTICO
PARA OPERACIONES HISTÓRICAS
O PROCESOS COMPLEJOS
```

---

# 61. Restricción fundamental

La API no debe convertirse en el lugar donde se define la lógica del negocio.

La regla definitiva será:

```text
LA API
EXPONE EL SISTEMA

NO DEFINE
EL NEGOCIO
```

Cuando una nueva necesidad aparezca:

```text
NUEVA NECESIDAD
        ↓
REVISAR DOMINIO
        ↓
REVISAR MODELO
        ↓
DEFINIR CASO DE USO
        ↓
DEFINIR CONTRATO API
        ↓
IMPLEMENTAR
```

Nunca:

```text
NUEVO ENDPOINT
        ↓
INVENTAR REGLAS
        ↓
MODIFICAR EL SISTEMA
SIN DOCUMENTACIÓN
```

---

# 62. Estado del documento

```text
Documento:
06-api-implementation-plan.md

Versión:
V1

Estado:
DEFINIDO PARA IMPLEMENTACIÓN

Objetivo:
TRADUCIR LOS CASOS DE USO
Y CAPACIDADES DEL SISTEMA
EN UNA API REST COHERENTE,
VALIDADA Y MODULAR

Principio principal:
LA API EXPONE EL SISTEMA;
NO REDEFINE EL DOMINIO


