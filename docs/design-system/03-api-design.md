# Diseño de la API — V1

## 1. Propósito del documento

Este documento define los principios y reglas iniciales para el diseño de la API del backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es establecer una base consistente para:

* organizar los endpoints;
* definir recursos y rutas;
* utilizar métodos HTTP;
* representar solicitudes y respuestas;
* manejar operaciones del negocio;
* separar operaciones de lectura y escritura cuando sea necesario;
* manejar errores de forma consistente;
* mantener la API alineada con los límites de módulos definidos.

Este documento se aplica a la API HTTP que será expuesta por:

```text
apps/api
```

La API será la capa de entrada principal para el cliente desktop y para futuras aplicaciones autorizadas.

Este documento no define todavía:

* todos los endpoints finales;
* DTOs concretos;
* implementación de controladores;
* autenticación específica;
* autorización detallada;
* documentación Swagger;
* versionado final de la API;
* contratos concretos por recurso.

Estos elementos serán definidos progresivamente sin contradecir las reglas establecidas aquí.

---

# 2. Principio general

La API debe representar capacidades del sistema de forma clara y consistente.

La estructura principal será:

```text
CLIENTE
    │
    ▼
HTTP API
    │
    ▼
MÓDULO RESPONSABLE
    │
    ▼
CASO DE USO / OPERACIÓN
    │
    ▼
REGLAS DEL NEGOCIO
```

El controlador HTTP no debe convertirse en el lugar donde se implementa la lógica del negocio.

La responsabilidad del controlador será:

```text
RECIBIR
VALIDAR
DELEGAR
RESPONDER
```

No:

```text
RECIBIR
    ↓
EJECUTAR LÓGICA COMPLETA
    ↓
ACCEDER DIRECTAMENTE A PRISMA
    ↓
MODIFICAR BASE DE DATOS
```

---

# 3. Convención base de rutas

La API utilizará una estructura basada principalmente en recursos.

La forma general será:

```text
/api/<resource>
```

Ejemplos:

```text
/api/presentations
/api/supplies
/api/suppliers
/api/products
/api/recipes
/api/purchases
/api/inventory
/api/production
/api/lots
/api/clients
/api/sales
/api/payments
/api/expenses
```

Los recursos se escribirán en:

```text
kebab-case
plural
```

Ejemplo:

```text
/products
/production-orders
/inventory-movements
```

No:

```text
/Product
/product
/Products
/getProducts
/products_list
```

---

# 4. Versionado de la API

La API utilizará versionado explícito desde su primera versión pública.

La estructura será:

```text
/api/v1/<resource>
```

Ejemplos:

```text
/api/v1/products
/api/v1/supplies
/api/v1/purchases
/api/v1/sales
```

Esto permite que futuras modificaciones incompatibles puedan evolucionar sin romper clientes existentes.

La versión inicial oficial será:

```text
v1
```

Por lo tanto, todos los endpoints definidos inicialmente deberán comenzar conceptualmente con:

```text
/api/v1
```

---

# 5. Recursos principales

Los recursos iniciales corresponden a los módulos de negocio definidos.

```text
/auth
/users

/presentations
/supplies
/suppliers
/products
/recipes

/purchases
/inventory
/production
/lots

/clients
/sales
/payments

/expenses
```

Los módulos:

```text
costs
profitability
dashboard
```

serán tratados principalmente como módulos de consulta, cálculo o consolidación.

Por esta razón, inicialmente no se asume que todos requieran operaciones CRUD.

---

# 6. Uso de métodos HTTP

La API seguirá las convenciones HTTP estándar.

## Crear

```http
POST /api/v1/products
```

Representa la creación de un nuevo recurso.

---

## Consultar colección

```http
GET /api/v1/products
```

Representa la consulta de una colección.

---

## Consultar recurso específico

```http
GET /api/v1/products/{id}
```

Representa la consulta de un recurso identificado.

---

## Actualizar

```http
PATCH /api/v1/products/{id}
```

Representa una actualización parcial permitida.

No se utilizará `PUT` automáticamente para todas las actualizaciones.

`PUT` solo se utilizará cuando exista una necesidad real de reemplazar completamente una representación.

La regla inicial será:

```text
ACTUALIZACIÓN PARCIAL
        ↓
PATCH
```

---

## Eliminar

```http
DELETE /api/v1/products/{id}
```

Solo se utilizará cuando la eliminación física esté permitida por las reglas del dominio.

La existencia del método `DELETE` no implica que todos los recursos puedan eliminarse.

Para información histórica, normalmente deberá evaluarse:

```text
desactivación
cancelación
anulación
cambio de estado
```

antes de permitir una eliminación física.

---

# 7. Operaciones que no representan CRUD simple

No todas las operaciones del negocio deben forzarse dentro de un CRUD tradicional.

Ejemplo incorrecto:

```text
POST /productions/update-status
POST /sales/execute
POST /inventory/do-movement
```

Las operaciones deberán representar claramente la intención del negocio.

Ejemplos conceptuales:

```http
POST /api/v1/productions
POST /api/v1/productions/{id}/execute
POST /api/v1/productions/{id}/cancel

POST /api/v1/purchases
POST /api/v1/purchases/{id}/confirm

POST /api/v1/sales
POST /api/v1/sales/{id}/cancel
```

La ruta debe expresar una capacidad concreta cuando la operación no sea una simple modificación del recurso.

La decisión entre:

```text
PATCH /resource/{id}
```

y:

```text
POST /resource/{id}/action
```

dependerá de la naturaleza real de la operación.

---

# 8. Acciones de negocio

Se utilizarán acciones explícitas cuando una operación:

* represente un cambio significativo de estado;
* ejecute un proceso de negocio;
* genere efectos en otros módulos;
* requiera validaciones específicas;
* no pueda representarse correctamente como una actualización simple.

Ejemplos:

```text
confirm
cancel
execute
complete
close
deactivate
activate
```

La estructura será:

```http
POST /api/v1/<resource>/{id}/<action>
```

Ejemplo:

```http
POST /api/v1/productions/{id}/execute
```

Esto representa una acción de negocio.

No debe utilizarse:

```http
POST /api/v1/executeProduction
```

porque mezcla la acción con la definición de ruta y rompe la convención basada en recursos.

---

# 9. Rutas anidadas

Las rutas anidadas se utilizarán únicamente cuando exista una relación clara y útil para la API.

Ejemplo:

```http
GET /api/v1/recipes/{recipeId}/items
```

Podría representar los componentes de una receta.

Otro ejemplo:

```http
GET /api/v1/purchases/{purchaseId}/items
```

Sin embargo, una ruta anidada no significa automáticamente que el recurso hijo sea inaccesible de otra forma.

La profundidad deberá mantenerse limitada.

Correcto:

```text
/purchases/{id}/items
```

Incorrecto:

```text
/products/{id}/recipes/{recipeId}/items/{itemId}/history
```

Las rutas excesivamente profundas dificultan el uso y mantenimiento de la API.

---

# 10. Recursos principales y detalles

Las estructuras históricas que forman parte de una operación no serán tratadas automáticamente como módulos independientes.

Ejemplo:

```text
PURCHASE
    │
    └── PURCHASE ITEMS
```

La API podrá representar:

```http
POST /api/v1/purchases
```

con un cuerpo que incluya:

```json
{
  "supplierId": "supplier-id",
  "items": []
}
```

La compra y sus detalles representan una única operación de negocio.

Lo mismo aplica conceptualmente a:

```text
RECIPE
    └── RECIPE ITEMS

PRODUCTION
    └── PRODUCTION DETAILS

SALE
    └── SALE ITEMS
```

La decisión concreta dependerá del contrato del recurso.

No se crearán endpoints independientes para cada tabla únicamente porque exista una entidad relacionada en persistencia.

---

# 11. Diseño de solicitudes

Las solicitudes deberán contener únicamente la información necesaria para ejecutar la operación.

Ejemplo conceptual:

```json
{
  "name": "Yogurt Natural 16 oz",
  "presentationId": "presentation-id"
}
```

No debe permitirse que el cliente envíe información calculada o controlada exclusivamente por el backend cuando no corresponda.

Ejemplo incorrecto:

```json
{
  "name": "Yogurt Natural",
  "inventoryQuantity": 999999,
  "calculatedCost": 12000,
  "profitability": 87
}
```

La API debe diferenciar entre:

```text
INPUT DEL USUARIO
```

y:

```text
INFORMACIÓN DERIVADA
```

El cliente envía los datos que tiene autorización para proporcionar.

El backend calcula, valida o genera el resto.

---

# 12. Identificadores

Los recursos utilizarán identificadores internos definidos por el sistema.

Las rutas utilizarán:

```text
{id}
```

Ejemplo:

```http
GET /api/v1/products/{id}
```

No se utilizarán nombres como identificadores de recursos.

Incorrecto:

```http
GET /api/v1/products/yogurt-natural-16oz
```

salvo que posteriormente exista una necesidad explícita de exponer un identificador alternativo, como un `slug`.

Los identificadores serán tratados como valores opacos por el cliente.

El cliente no debe depender de su estructura interna.

---

# 13. Parámetros de consulta

Los parámetros de consulta se utilizarán para:

* filtros;
* paginación;
* ordenamiento;
* búsqueda;
* selección de información permitida.

Ejemplo:

```http
GET /api/v1/products?status=active
```

Ejemplo:

```http
GET /api/v1/purchases?from=2026-01-01&to=2026-01-31
```

Ejemplo:

```http
GET /api/v1/inventory?search=yogurt
```

La convención será:

```text
?filter=value
```

No se utilizarán múltiples rutas diferentes para cada combinación posible de filtros.

Incorrecto:

```text
/products/active
/products/inactive
/products/active/search
```

cuando los filtros pueden resolverse mediante parámetros de consulta.

---

# 14. Paginación

Las colecciones que puedan crecer significativamente deberán soportar paginación.

La forma concreta será definida posteriormente.

La convención conceptual será:

```http
GET /api/v1/products?page=1&limit=20
```

La respuesta deberá permitir identificar:

* datos obtenidos;
* página actual;
* tamaño de página;
* total disponible cuando corresponda.

Ejemplo conceptual:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Los detalles exactos del contrato serán definidos posteriormente.

---

# 15. Ordenamiento

La API podrá permitir ordenamiento mediante parámetros explícitos.

Ejemplo:

```http
GET /api/v1/products?sortBy=name&sortOrder=asc
```

La API deberá validar:

* qué campos pueden utilizarse;
* qué direcciones son permitidas.

No se permitirá que el cliente construya directamente consultas arbitrarias sobre la base de datos.

---

# 16. Búsqueda

Cuando un recurso requiera búsqueda textual, se utilizará un parámetro consistente.

La convención inicial será:

```http
?search=value
```

Ejemplo:

```http
GET /api/v1/clients?search=lucho
```

La definición exacta de los campos buscables pertenece a cada recurso.

---

# 17. Respuestas exitosas

La API utilizará códigos HTTP estándar.

## Creación exitosa

```text
201 Created
```

Ejemplo:

```http
POST /api/v1/products
```

---

## Consulta exitosa

```text
200 OK
```

---

## Actualización exitosa

```text
200 OK
```

o:

```text
204 No Content
```

según el contrato definido.

---

## Operación sin contenido

```text
204 No Content
```

cuando la respuesta no requiera cuerpo.

---

# 18. Estructura general de respuesta

Las respuestas exitosas deberán mantener una estructura consistente.

Para recursos individuales:

```json
{
  "data": {}
}
```

Para colecciones:

```json
{
  "data": [],
  "meta": {}
}
```

La estructura exacta de `meta` dependerá de la operación.

Ejemplo:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

No se agregarán propiedades arbitrarias sin una necesidad definida.

---

# 19. Respuestas de error

Los errores deberán seguir una estructura consistente.

Ejemplo conceptual:

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "The request contains invalid data",
  "details": []
}
```

La estructura definitiva será definida por las reglas globales de manejo de excepciones.

La API deberá diferenciar entre:

* error de validación;
* recurso no encontrado;
* conflicto de negocio;
* falta de autenticación;
* falta de autorización;
* error interno.

---

# 20. Códigos de estado principales

La API utilizará inicialmente los siguientes códigos:

| Código | Uso                                                                         |
| ------ | --------------------------------------------------------------------------- |
| `200`  | Operación exitosa                                                           |
| `201`  | Recurso creado                                                              |
| `204`  | Operación exitosa sin contenido                                             |
| `400`  | Solicitud inválida                                                          |
| `401`  | No autenticado                                                              |
| `403`  | No autorizado                                                               |
| `404`  | Recurso no encontrado                                                       |
| `409`  | Conflicto de negocio o estado                                               |
| `422`  | Información válida sintácticamente pero no aceptable según reglas definidas |
| `500`  | Error interno                                                               |

La clasificación concreta de cada error deberá mantenerse consistente entre módulos.

---

# 21. Errores de validación

Cuando la solicitud contenga información inválida, la API deberá devolver información suficiente para que el cliente pueda identificar el problema.

Ejemplo conceptual:

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

La validación de formato no reemplaza las reglas del negocio.

Existen dos niveles:

```text
VALIDACIÓN DE ENTRADA
        │
        ├── formato
        ├── tipo
        ├── campos requeridos
        │
        ▼
REGLAS DEL NEGOCIO
        │
        ├── estado permitido
        ├── disponibilidad
        ├── consistencia
        └── invariantes
```

---

# 22. Operaciones históricas

Los recursos que representan hechos históricos requieren restricciones especiales.

Entre ellos:

```text
purchases
inventory movements
production
lots
sales
payments
expenses
```

No debe asumirse que estos recursos pueden actualizarse o eliminarse libremente.

Antes de exponer:

```http
PATCH /resource/{id}
```

o:

```http
DELETE /resource/{id}
```

deberá verificarse si la operación contradice:

* trazabilidad;
* integridad histórica;
* cálculos posteriores;
* inventario;
* costos;
* rentabilidad.

Cuando sea necesario, la API deberá representar una acción como:

```text
cancel
void
reverse
deactivate
```

en lugar de eliminar o modificar directamente el hecho histórico.

---

# 23. Operaciones de inventario

El inventario no será tratado como un valor que el cliente puede modificar libremente.

Incorrecto:

```http
PATCH /api/v1/inventory/{id}
```

con:

```json
{
  "quantity": 1000
}
```

cuando el cambio de cantidad requiera un movimiento histórico.

Los cambios de inventario deben estar asociados a una operación identificable.

Conceptualmente:

```text
COMPRA
    │
    ▼
ENTRADA DE INVENTARIO
```

```text
PRODUCCIÓN
    │
    ▼
SALIDA / CONSUMO DE INVENTARIO
```

```text
VENTA
    │
    ▼
SALIDA DE INVENTARIO
```

Por lo tanto, la API deberá evitar endpoints que permitan modificar existencias arbitrariamente.

---

# 24. Operaciones de cálculo

Los módulos:

```text
costs
profitability
dashboard
```

representan principalmente información derivada.

Inicialmente sus endpoints serán predominantemente de consulta.

Ejemplos conceptuales:

```http
GET /api/v1/costs
GET /api/v1/profitability
GET /api/v1/dashboard
```

No se asumirá automáticamente la existencia de:

```http
POST /api/v1/profitability
PATCH /api/v1/dashboard
DELETE /api/v1/costs/{id}
```

La existencia de un módulo no implica que deba exponer un CRUD completo.

---

# 25. Relaciones entre API y módulos

Cada endpoint deberá ser propiedad de un módulo.

Ejemplo:

```text
/api/v1/products
        │
        ▼
products module
```

```text
/api/v1/purchases
        │
        ▼
purchases module
```

No se permitirá que un controlador de un módulo se convierta en propietario de operaciones que pertenecen claramente a otro.

Incorrecto:

```text
PurchasesController
    │
    ├── createPurchase
    ├── createSupplier
    ├── updateInventory
    └── calculateProfitability
```

Correcto:

```text
SuppliersController
    → suppliers

PurchasesController
    → purchases

InventoryController
    → inventory

ProfitabilityController
    → profitability
```

---

# 26. Endpoints entre módulos

Un módulo no debe utilizar sus propios endpoints HTTP para comunicarse internamente con otro módulo del mismo backend.

Incorrecto:

```text
PurchasesService
    │
    ▼
HTTP Request
    │
    ▼
/api/v1/inventory
```

La comunicación HTTP está destinada principalmente a clientes externos.

La coordinación interna deberá utilizar mecanismos definidos posteriormente dentro de la arquitectura backend.

Conceptualmente:

```text
CLIENTE
    │
    ▼
HTTP API
    │
    ▼
MÓDULO
```

Mientras que internamente:

```text
MÓDULO
    │
    ▼
CAPACIDAD AUTORIZADA
DE OTRO MÓDULO
```

---

# 27. Contratos de la API

La API representa un contrato entre:

```text
BACKEND
    │
    ▼
FRONTEND DESKTOP
```

Los contratos compartidos podrán residir conceptualmente en:

```text
packages/contracts
```

Sin embargo, la existencia de un contrato compartido no significa que el frontend pueda depender de implementaciones internas del backend.

El contrato define:

* estructura de solicitudes;
* estructura de respuestas;
* tipos compartidos cuando corresponda;
* identificadores;
* información expuesta.

No debe contener:

* lógica de negocio;
* acceso a Prisma;
* servicios NestJS;
* lógica específica del frontend.

---

# 28. Idempotencia

Las operaciones que puedan generar registros históricos o efectos críticos deberán evaluar su comportamiento frente a solicitudes repetidas.

Esto será especialmente importante para:

```text
purchases
production
sales
payments
inventory operations
```

La implementación concreta de idempotencia no se define todavía.

Antes de implementar una operación crítica deberá analizarse:

```text
¿QUÉ OCURRE SI EL CLIENTE
ENVÍA LA MISMA SOLICITUD DOS VECES?
```

La respuesta debe estar definida antes de implementar la operación.

---

# 29. Operaciones atómicas

Cuando una solicitud represente una única operación de negocio que produce varios cambios relacionados, la API deberá tratarla conceptualmente como una operación coherente.

Ejemplo:

```text
REGISTRAR COMPRA
        │
        ├── crear compra
        ├── crear detalle
        └── generar efecto en inventario
```

No debe quedar el sistema en un estado donde:

```text
COMPRA CREADA
        │
        X
INVENTARIO NO ACTUALIZADO
```

cuando ambos cambios formen parte de una misma operación confirmada.

La estrategia técnica concreta para garantizar esta consistencia será definida durante el diseño de implementación.

---

# 30. Operaciones de lectura y escritura

Inicialmente se distinguirán conceptualmente:

```text
COMMAND
    │
    └── modifica estado
```

y:

```text
QUERY
    │
    └── consulta información
```

Esto no obliga a implementar CQRS completo.

La separación conceptual sirve para evitar que una misma operación:

```text
consulte
modifique
calcule
y ejecute efectos
```

sin una responsabilidad clara.

Una operación podrá ser identificada como:

```text
READ
```

o:

```text
WRITE
```

según su propósito principal.

---

# 31. Seguridad en la API

La API deberá asumir que toda solicitud externa es no confiable.

Por lo tanto:

```text
CLIENTE
    │
    ▼
VALIDACIÓN
    │
    ▼
AUTENTICACIÓN
    │
    ▼
AUTORIZACIÓN
    │
    ▼
OPERACIÓN
```

El cliente no debe ser considerado responsable de garantizar reglas críticas.

Ejemplo:

```text
Frontend dice:
"hay suficiente inventario"
```

Esto no es suficiente.

El backend debe validar nuevamente la condición antes de ejecutar una operación crítica.

Las reglas concretas de seguridad serán definidas en documentación posterior.

---

# 32. Documentación de endpoints

Cada endpoint implementado deberá poder documentarse con información equivalente a:

```text
Método HTTP
Ruta
Propósito
Módulo propietario
Autenticación requerida
Autorización requerida
Datos de entrada
Respuesta exitosa
Errores posibles
Efectos secundarios
```

La documentación técnica concreta podrá generarse posteriormente mediante herramientas compatibles con la implementación.

No se crearán contratos ficticios para endpoints que todavía no existen.

---

# 33. Regla para crear un nuevo endpoint

Antes de crear un endpoint deberá responderse:

```text
1. ¿Qué módulo es propietario?

2. ¿Representa un recurso o una acción?

3. ¿Es lectura o escritura?

4. ¿Qué información recibe?

5. ¿Qué información devuelve?

6. ¿Modifica información histórica?

7. ¿Produce efectos en otros módulos?

8. ¿Requiere una operación atómica?

9. ¿Puede repetirse accidentalmente?

10. ¿Qué reglas de autorización requiere?
```

Si estas preguntas no pueden responderse, el endpoint no debe implementarse todavía.

---

# 34. Prohibiciones iniciales

La API no debe:

* exponer directamente modelos de Prisma;
* permitir modificaciones arbitrarias de inventario;
* permitir eliminar hechos históricos sin una regla explícita;
* convertir cada tabla de la base de datos en un endpoint CRUD;
* utilizar nombres de acciones como sustituto de una arquitectura de recursos;
* permitir acceso directo a módulos internos mediante rutas especiales;
* duplicar la lógica del negocio en los controladores;
* depender de cálculos realizados únicamente por el frontend;
* crear endpoints anticipadamente sin una operación real que los requiera.

---

# 35. Evolución del diseño de la API

La API evolucionará junto con el sistema.

La creación de una nueva ruta deberá seguir:

```text
NECESIDAD DEL NEGOCIO
        │
        ▼
IDENTIFICAR MÓDULO PROPIETARIO
        │
        ▼
IDENTIFICAR OPERACIÓN
        │
        ├── RECURSO
        │
        └── ACCIÓN DE NEGOCIO
                │
                ▼
DEFINIR CONTRATO
        │
        ▼
DEFINIR VALIDACIONES
        │
        ▼
DEFINIR RESPUESTAS Y ERRORES
        │
        ▼
IMPLEMENTAR
```

No se agregará una ruta únicamente porque un CRUD genérico parezca requerirla.

---

# 36. Relación con los documentos existentes

Este documento debe interpretarse junto con:

```text
docs/domains/
```

para comprender las responsabilidades del negocio.

También debe respetar:

```text
01-module-boundaries.md
```

para determinar el módulo propietario de una operación.

Y:

```text
02-module-dependencies.md
```

para determinar qué efectos o consultas pueden involucrar otros módulos.

Las reglas de evolución se encuentran en:

```text
docs/architecture/architecture-evolution.md
```

---

# 37. Estado actual

```text
Documento: 03-api-design.md
Versión: V1
Estado: APROBADO COMO BASE DE DISEÑO DE API
```

Este documento establece las reglas generales para diseñar la API HTTP del sistema.

Los endpoints concretos deberán definirse progresivamente a partir de los módulos y procesos reales del negocio, respetando los límites, dependencias, reglas de integridad y trazabilidad ya documentados.
