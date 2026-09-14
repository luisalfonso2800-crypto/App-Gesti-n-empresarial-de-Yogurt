# 02. BACKEND, BASE DE DATOS E INTEGRIDAD (BACKEND & DATABASE)

> **NOTA:** Este módulo define la arquitectura del backend, el manejo de base de datos con Prisma, la prevención de colisiones en Express y la integridad de datos transaccionales.

---

### 2. ARQUITECTURA Y EJECUCIÓN (BACKEND)

* El código backend reside en `apps/api/`. El schema está en `apps/api/prisma/schema.prisma`.
* No modificar `apps/api/src/` **fuera del alcance** de la fase o tarea actual.
* Si la tarea requiere explícitamente modificar backend para completar la funcionalidad, la modificación está permitida siempre que:
  1. Sea necesaria para cumplir el objetivo técnico de la tarea.
  2. Respete la arquitectura existente (Controller → Service → Repository).
  3. No rompa contratos existentes.
  4. Sea validada funcionalmente.
* Prohibido introducir entidades o funcionalidades ajenas al objetivo de la fase.
* Las tareas deben ejecutarse como bloques completos sin detenerse por confirmaciones intermedias, salvo bloqueos reales de diseño o seguridad.

---

### 2.1. PREVENCIÓN DE CONFLICTOS DE ENRUTAMIENTO EN EXPRESS

* **Jerarquía Estricta de Rutas:** Toda ruta fija, de acción masiva o sub-recurso (ej. `/orders/merge`, `/active`, `/items/move`) DEBE declararse en el router de Express OBLIGATORIAMENTE **antes** de cualquier ruta parametrizada dinámica (ej. `/:id` o `/orders/:id`).
* Nunca expongas parámetros comodín por encima de rutas específicas para evitar que Express capture palabras reservadas como si fueran IDs/UUIDs.

---

### 2.2. ATOMICIDAD TRANSACCIONAL OBLIGATORIA (`prisma.$transaction`)

* Toda mutación que afecte más de un registro o actualice kardex/inventario (compras, producción, recetas, ventas) DEBE ejecutarse mediante `prisma.$transaction`.
* Quedan estrictamente prohibidas las escrituras encadenadas con `await` independientes que dejen la base de datos en un estado inconsistente o con fallos parciales ante errores en mitad del flujo.

---

### 9. COMUNICACIÓN HTTP Y RED

* Toda llamada a la API debe realizarse mediante la instancia centralizada del cliente (`@/lib/api-client` o `@/lib/api`).
* Resuelve siempre contra las rutas canónicas versionadas del backend (`/api/v1/...`).

---

### 9.1. VERIFICACIÓN ESTRATÉGICA BACKEND-FIRST (DATOS REALES Y CONTROL DE CUOTA)

* **Prohibido asumir que el backend soporta una acción solo porque el frontend la requiere.**
* Toda acción de frontend que implique mutación de datos (crear, editar, eliminar, transferir, fusionar) DEBE verificar primero la existencia y el contrato real del endpoint en `apps/api/src/routes/` y sus controladores antes de tocar frontend.
* **Protocolo de Verificación sin Exceso de Cuota:**
  1. No leas todo el backend ni hagas búsquedas globales ciegas. Inspecciona directamente el archivo de rutas del submódulo correspondiente (ej. `apps/api/src/routes/purchase.routes.js` o `purchases/`).
  2. Si el endpoint no existe o le faltan campos, **debes crearlo o completarlo en el backend antes de conectar el frontend**, respetando el patrón Controller → Service → Repository.
  3. Prohibidos stubs temporales o datos simulados en memoria del cliente cuando la acción deba persistir en base de datos.
  4. La implementación en el backend debe ser acotada y validar con Prisma.

---

### 9.2. CONTRATO ESTÁNDAR DE RESPUESTA Y ERRORES POKA-YOKE

* Formato predecible y consistente en todas las respuestas JSON:
  * Éxito: `{ success: true, data }`
  * Error: `{ success: false, error: "Mensaje comprensible" }`
* Prohibido retornar stack traces crudos o errores internos de Prisma (`P2002`, `P2003`, `P2025`).
* Los errores deben traducirse en el controlador o capa de filtro/middleware a lenguaje de negocio claro (duplicados, llaves foráneas inexistentes, elementos no encontrados o restricciones violadas).

---

### 10. FUENTE DE VERDAD DEL PROYECTO

* La aplicación existente es la fuente de verdad funcional del sistema.
* Antes de diseñar o modificar un módulo existente, la IA DEBE inspeccionar:
  1. El modelo de datos actualmente utilizado (`schema.prisma`).
  2. Los endpoints actualmente disponibles en el backend.
  3. El cliente API existente y sus contratos.
  4. La implementación frontend existente.
  5. Las relaciones reales entre módulos.
* NO debe asumir que una funcionalidad existe porque aparezca mencionada en documentación antigua, prompts, planes anteriores o especificaciones históricas.
* Si existe contradicción entre documentación antigua y código funcional actual, prevalece el código y la estructura actualmente ejecutada.
* La documentación solo puede utilizarse como contexto adicional, nunca como sustituto de la realidad del proyecto.
* Antes de proponer una modificación estructural, la IA DEBE identificar qué módulos existentes dependen de ella.

---

### 11. VALIDACIÓN REAL — NO CONFUNDIR BUILD CON FUNCIONALIDAD

* Que el proyecto compile NO significa que la funcionalidad esté terminada.
* Toda tarea DEBE validarse en tres niveles cuando corresponda:
  1. Sintaxis/código.
  2. Integración frontend ↔ API ↔ base de datos.
  3. Comportamiento funcional esperado.
* La IA NO puede reportar una funcionalidad como "OK" si únicamente verificó que el archivo compila.
* Si una validación funcional no puede ejecutarse, debe reportarse explícitamente como "NO VERIFICADA".
* Está PROHIBIDO declarar "COMPLETADA", "FUNCIONAL", "OK" o "LISTO PARA PRODUCCIÓN" basándose únicamente en un build exitoso o sintaxis limpia.

---

### 12. INTEGRIDAD Y DUPLICACIÓN DE DATOS

* Ningún seed, script de prueba o proceso de inicialización puede insertar datos duplicados accidentalmente.
* Antes de modificar un seed, la IA DEBE determinar si su ejecución es: idempotente, acumulativa intencionalmente o destructiva.
* Los seeds de prueba DEBEN ser idempotentes o limpiar explícitamente los datos que ellos mismos generan.
* NUNCA debe eliminar datos existentes de una base de datos sin identificar previamente el alcance y finalidad de dicha eliminación.
* Cuando exista riesgo de duplicación, la IA DEBE verificar la existencia previa mediante identificadores o claves únicas antes de insertar.
* Las relaciones entre entidades deben utilizar siempre los identificadores reales provenientes de la base de datos.
* NUNCA se deben inventar IDs, UUIDs o relaciones únicamente para hacer funcionar la interfaz.

---

### 12.1. MAPEO Y NOMBRES EXACTOS DE CAMPOS EN PRISMA

* **Cero Asunciones en Nombres de Columnas:** Al realizar consultas, agregaciones o inserciones en Prisma (`create`, `update`, `deleteMany`), la IA DEBE consultar el nombre exacto de las propiedades en `schema.prisma`.
* Queda terminantemente prohibido adivinar campos (ej. usar `cantidadSolicitada` en lugar de `cantidad`, o `ordenId` en lugar de `purchaseId`). La discrepancia de un solo nombre provoca un `PrismaClientValidationError` y error 500 en cadena.
* En operaciones destructivas (`delete`, `deleteMany`), purga siempre los hijos/ítems dependientes antes de destruir el registro padre para no violar restricciones de clave foránea (`Foreign Key Constraint`).

---

### 12.2. SANITIZACIÓN Y NORMALIZACIÓN DEFENSIVA EN PERSISTENCIA

* Aplicar `.trim()` y `UPPERCASE` a textos libres en el Service antes de persistir en base de datos.
* Validar que cantidades y costos cumplan siempre con la regla defensiva `min: 0`.

---

### 12.3. INTEGRIDAD DE INVENTARIO Y SALDOS NEGATIVOS

* Bloqueo estricto de existencias negativas.
* Validar exhaustivamente el stock disponible antes de persistir salidas en el Kardex o movimientos de inventario.

---

### 14. ANÁLISIS DE IMPACTO OBLIGATORIO

* Antes de modificar una entidad, tabla, endpoint o estructura utilizada por otros módulos, la IA DEBE identificar sus dependencias.
* Como mínimo debe revisar: Base de datos, Backend, Frontend, Cliente API, Seeds, Módulos consumidores y relaciones transversales.
* Ningún cambio estructural debe implementarse de forma aislada si afecta un flujo existente.
* Si un cambio rompe una dependencia existente, la IA DEBE corregir la dependencia dentro de la misma fase cuando esté dentro de su alcance.
* No se permite dejar deliberadamente una estructura nueva incompatible con el módulo que actualmente la consume.

---

### 15. VALIDACIÓN DE FLUJOS DE NEGOCIO COMPLETOS

* Las funcionalidades que formen parte de un flujo empresarial deben validarse de extremo a extremo:
  * `Compra → Inventario`
  * `Receta → Producción → Inventario → Lote`
  * `Venta → Inventario → Lote`
  * `Venta → Pago`
  * `Producto → Receta → Producción`
* No se considera terminada una funcionalidad si únicamente funciona su pantalla aislada pero no su flujo empresarial.
* Cuando una fase modifique un flujo existente, la IA DEBE verificar que las operaciones anteriores continúen funcionando.

---

### 23. DATOS DE PRUEBA Y SEEDS

* Los datos de prueba deben representar escenarios reales del negocio y permitir comprobar relaciones entre módulos.
* Los seeds deben ser idempotentes para poder ejecutarse repetidamente sin generar duplicaciones accidentales.
