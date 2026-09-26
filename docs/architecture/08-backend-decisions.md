# Decisiones del Backend — V1

## 1. Propósito del documento

Este documento registra las decisiones técnicas principales adoptadas para el backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es evitar que decisiones fundamentales se tomen nuevamente de forma improvisada durante la implementación.

Este documento no define todavía el código del backend ni reemplaza los ADR generales del proyecto.

Su función es establecer las decisiones específicas que servirán como base para construir:

```text
apps/api
```

Las decisiones registradas aquí deben ser coherentes con:

```text
docs/architecture/
```

```text
docs/data-model/
```

```text
docs/domains/
```

y con los documentos del backend:

```text
00-backend-overview.md
01-module-boundaries.md
02-module-dependencies.md
03-api-design.md
04-persistence-boundaries.md
05-transaction-boundaries.md
06-error-handling.md
07-validation-strategy.md
```

---

# 2. Principio de decisión

El backend no debe construirse a partir de preferencias técnicas aisladas.

Cada decisión debe responder a una necesidad real del sistema.

La regla general será:

```text
NECESIDAD DEL NEGOCIO
        ↓
RESPONSABILIDAD DEL SISTEMA
        ↓
DECISIÓN TÉCNICA
        ↓
IMPLEMENTACIÓN
```

No:

```text
TECNOLOGÍA
        ↓
FORZAR EL NEGOCIO
A ADAPTARSE A LA TECNOLOGÍA
```

La lógica del negocio documentada es la referencia principal.

La implementación técnica debe respetarla.

---

# 3. Decisión 01 — Backend como aplicación separada

## Decisión

El backend existirá como una aplicación independiente dentro del monorepo.

Ubicación:

```text
apps/api
```

## Motivo

El sistema tendrá una aplicación cliente independiente y una capa backend responsable de:

* exponer la API;
* aplicar reglas de negocio;
* coordinar operaciones;
* gestionar persistencia;
* controlar autenticación y autorización cuando corresponda;
* proteger la integridad del sistema.

La separación será:

```text
apps/
│
├── api/
│
└── desktop/
```

## Consecuencia

La aplicación desktop no debe contener la lógica central del negocio que corresponde al backend.

El cliente solicita operaciones.

El backend decide si esas operaciones pueden ejecutarse.

---

# 4. Decisión 02 — Arquitectura modular

## Decisión

El backend se organizará por módulos funcionales.

La organización debe seguir las fronteras definidas en:

```text
01-module-boundaries.md
```

Los módulos representan responsabilidades del negocio, por ejemplo:

```text
presentations
supplies
suppliers
products
recipes
purchases
inventory
production
lots
clients
sales
payments
expenses
costs
profitability
dashboard
```

## Motivo

La documentación del negocio ya establece responsabilidades diferenciadas.

La estructura del backend debe respetar estas fronteras en lugar de organizar todo únicamente por tipo técnico.

Incorrecto conceptualmente:

```text
controllers/
services/
repositories/
models/
```

como única estructura global sin considerar el dominio.

La dirección será:

```text
MODULE
│
├── interface
├── application
├── domain
└── infrastructure
```

Esta estructura es conceptual.

No obliga a crear desde el inicio todas las carpetas o capas si el módulo todavía no necesita esa complejidad.

## Consecuencia

Un módulo no debe acceder arbitrariamente a la persistencia interna de otro módulo.

Las interacciones entre módulos deben respetar las dependencias documentadas.

---

# 5. Decisión 03 — Modularidad progresiva

## Decisión

No se implementará una arquitectura excesivamente compleja desde el inicio.

La estructura interna de cada módulo podrá comenzar de forma simple y evolucionar cuando exista una necesidad real.

## Motivo

El sistema se encuentra en una fase de construcción progresiva.

Crear desde el inicio:

```text
commands
queries
handlers
aggregates
factories
domain events
value objects
mappers
repositories
ports
adapters
```

para todos los módulos sería sobrearquitectura.

## Consecuencia

La complejidad técnica debe justificarse.

La regla será:

```text
SIMPLE PRIMERO
        ↓
MEDIR COMPLEJIDAD REAL
        ↓
EXTRAER RESPONSABILIDADES
CUANDO SEA NECESARIO
```

La evolución deberá respetar:

```text
docs/architecture/architecture-evolution.md
```

---

# 6. Decisión 04 — Módulos como frontera de responsabilidad

## Decisión

Cada módulo será responsable de su propia lógica funcional.

Ejemplo conceptual:

```text
PRODUCTS
```

es responsable de las operaciones relacionadas con productos.

```text
RECIPES
```

es responsable de las operaciones relacionadas con recetas.

```text
INVENTORY
```

es responsable de los movimientos y disponibilidad de inventario.

## Consecuencia

No debe aparecer una clase central del tipo:

```text
BusinessService
```

responsable de:

```text
compras
producción
ventas
inventario
costos
rentabilidad
```

porque destruiría las fronteras funcionales.

---

# 7. Decisión 05 — Inventory como capacidad transversal

## Decisión

El módulo:

```text
inventory
```

será la capacidad responsable de representar y controlar los efectos de inventario definidos por las operaciones del negocio.

Las operaciones de:

```text
purchases
production
sales
```

pueden originar movimientos de inventario según las reglas documentadas.

## Motivo

El inventario no debe convertirse en un conjunto de valores modificados manualmente desde cualquier módulo.

El flujo conceptual es:

```text
OPERACIÓN DE NEGOCIO
        ↓
VALIDACIÓN
        ↓
MOVIMIENTO DE INVENTARIO
        ↓
ESTADO RESULTANTE
```

## Consecuencia

Las modificaciones críticas del inventario deben pasar por una operación controlada.

Los módulos externos no deben alterar directamente cantidades persistidas sin respetar las reglas del módulo Inventory.

---

# 8. Decisión 06 — Persistencia detrás de fronteras técnicas

## Decisión

Los detalles de Prisma y de la base de datos no deben propagarse libremente por todo el backend.

El acceso a datos debe permanecer dentro de las fronteras definidas por:

```text
04-persistence-boundaries.md
```

## Motivo

El negocio no debe depender directamente de:

```text
PrismaClient
```

en cada parte del sistema.

Esto permite mantener separadas:

```text
REGLAS DEL NEGOCIO
```

y:

```text
DETALLES DE PERSISTENCIA
```

## Consecuencia

Los controladores no deben ejecutar consultas directas.

La lógica del negocio tampoco debe quedar distribuida arbitrariamente dentro de consultas del ORM.

---

# 9. Decisión 07 — Prisma como mecanismo de persistencia

## Decisión

La implementación inicial utilizará Prisma como mecanismo de acceso a la base de datos.

## Motivo

La arquitectura general del proyecto ya contempla:

```text
PostgreSQL
+
Prisma
```

Prisma será responsable principalmente de:

* consultas;
* inserciones;
* actualizaciones;
* eliminaciones cuando sean permitidas;
* relaciones persistentes;
* soporte para transacciones.

## Consecuencia

Prisma no representa el modelo de negocio completo.

El hecho de que una entidad exista en Prisma no significa que cualquier módulo pueda modificarla directamente.

Las reglas siguen perteneciendo a la lógica de la aplicación y del dominio correspondiente.

---

# 10. Decisión 08 — PostgreSQL como fuente persistente principal

## Decisión

PostgreSQL será la fuente persistente principal del backend.

## Motivo

El sistema requiere preservar información relacionada con:

```text
maestros
compras
inventario
producción
lotes
ventas
pagos
gastos
costos
rentabilidad
```

Estas operaciones requieren:

* relaciones consistentes;
* integridad referencial;
* transacciones;
* historial;
* consultas relacionales.

## Consecuencia

Las restricciones críticas de persistencia deben definirse correctamente.

La aplicación no debe depender exclusivamente de validaciones del frontend para proteger los datos.

---

# 11. Decisión 09 — Base de datos como protección final de integridad

## Decisión

Las restricciones estructurales críticas deberán estar protegidas también en la base de datos cuando corresponda.

Ejemplos conceptuales:

```text
unicidad
```

```text
relaciones obligatorias
```

```text
claves foráneas
```

```text
campos requeridos
```

## Motivo

La aplicación puede contener errores o existir futuras interfaces diferentes al cliente actual.

La integridad fundamental no debe depender únicamente del cliente.

## Consecuencia

La estrategia será:

```text
CLIENT VALIDATION
        +
API VALIDATION
        +
BUSINESS VALIDATION
        +
DATABASE CONSTRAINTS
```

Cada nivel tiene una responsabilidad distinta.

---

# 12. Decisión 10 — La API como contrato del backend

## Decisión

La comunicación entre clientes y backend se realizará mediante contratos de API claramente definidos.

Los clientes no deben depender de:

* estructura interna de módulos;
* modelos de Prisma;
* nombres de tablas;
* detalles de persistencia.

## Motivo

El backend debe poder evolucionar internamente sin obligar al cliente a conocer su implementación.

La API representa la frontera pública.

## Consecuencia

Los cambios incompatibles en contratos deben evaluarse explícitamente.

No se deben modificar respuestas arbitrariamente porque un detalle interno cambió.

---

# 13. Decisión 11 — DTOs como frontera de entrada

## Decisión

Las solicitudes externas deberán atravesar contratos de entrada definidos para cada operación.

Estos contratos serán responsables de validar:

```text
estructura
tipos
campos requeridos
formatos
restricciones simples
```

## Motivo

El backend no debe aceptar directamente cualquier estructura enviada por el cliente.

La entrada debe normalizarse antes de llegar a la lógica de negocio.

## Consecuencia

Los DTOs no reemplazan las reglas de negocio.

Una solicitud puede ser válida estructuralmente y aun así ser rechazada posteriormente.

---

# 14. Decisión 12 — Reglas de negocio fuera del controlador

## Decisión

Los controladores deben permanecer delgados.

Su responsabilidad principal será:

```text
RECIBIR
        ↓
VALIDAR ENTRADA
        ↓
DELEGAR
        ↓
DEVOLVER RESPUESTA
```

No deben contener directamente reglas complejas relacionadas con:

```text
inventario
producción
ventas
costos
lotes
trazabilidad
```

## Motivo

La lógica distribuida en controladores dificulta:

* pruebas;
* reutilización;
* mantenimiento;
* consistencia.

## Consecuencia

Las reglas deben ubicarse en la responsabilidad correspondiente del módulo.

---

# 15. Decisión 13 — Validación distribuida por responsabilidad

## Decisión

La validación se dividirá según el tipo de condición.

```text
DTO
        ↓
estructura y datos simples
```

```text
Application / Business Logic
        ↓
reglas y condiciones operacionales
```

```text
Database
        ↓
integridad persistente
```

## Motivo

Una única capa no puede representar correctamente todos los tipos de validación.

## Consecuencia

No debe crearse una validación duplicada en todas las capas sin necesidad.

La estrategia completa se define en:

```text
07-validation-strategy.md
```

---

# 16. Decisión 14 — Operaciones críticas con límites transaccionales explícitos

## Decisión

Las operaciones que produzcan múltiples efectos dependientes deben ejecutarse dentro de límites transaccionales claramente definidos.

Ejemplos conceptuales:

```text
registrar compra
        +
registrar detalles
        +
registrar efectos relacionados
```

```text
registrar producción
        +
consumir recursos requeridos
        +
generar efectos correspondientes
```

```text
confirmar venta
        +
registrar detalles
        +
registrar salida de inventario
```

## Motivo

No deben persistirse operaciones parcialmente completadas.

## Consecuencia

La transacción debe representar una unidad coherente del negocio.

La estrategia concreta está definida en:

```text
05-transaction-boundaries.md
```

---

# 17. Decisión 15 — Inventario no puede quedar parcialmente actualizado

## Decisión

Una operación crítica que afecte inventario debe preservar la consistencia completa de sus efectos.

Ejemplo conceptual:

```text
VENTA CONFIRMADA
        ↓
SALIDA DE INVENTARIO
```

No debe ocurrir:

```text
VENTA CONFIRMADA
        ↓
ERROR
        ↓
INVENTARIO SIN ACTUALIZAR
```

ni:

```text
INVENTARIO ACTUALIZADO
        ↓
ERROR
        ↓
VENTA NO REGISTRADA
```

cuando ambas acciones forman parte de una misma unidad de negocio.

## Consecuencia

Las operaciones deberán definir explícitamente qué efectos deben confirmarse juntos.

---

# 18. Decisión 16 — Los errores tendrán un contrato uniforme

## Decisión

Todos los módulos deberán utilizar una estrategia coherente para exponer errores.

Las categorías iniciales serán:

```text
VALIDATION_ERROR
NOT_FOUND
BUSINESS_RULE_VIOLATION
UNAUTHORIZED
FORBIDDEN
CONFLICT
INTERNAL_ERROR
```

## Motivo

El frontend no debe interpretar errores diferentes para cada módulo.

## Consecuencia

Los errores técnicos internos deberán traducirse antes de llegar al cliente.

La estrategia completa está definida en:

```text
06-error-handling.md
```

---

# 19. Decisión 17 — No exponer detalles internos

## Decisión

Las respuestas de error no deben revelar:

* stack traces;
* consultas SQL;
* nombres internos de tablas;
* detalles completos de Prisma;
* variables de entorno;
* credenciales;
* secretos.

## Motivo

Los detalles internos no forman parte del contrato público y pueden representar riesgos técnicos o de seguridad.

## Consecuencia

Los detalles necesarios para diagnóstico deben registrarse internamente, mientras que la API devuelve una respuesta segura y consistente.

---

# 20. Decisión 18 — Los mensajes no son el contrato técnico

## Decisión

El frontend no debe implementar lógica basándose exclusivamente en el contenido textual de un mensaje de error.

Incorrecto:

```text
if message === "No hay inventario suficiente"
```

La lógica debe utilizar códigos estables.

Ejemplo conceptual:

```text
if code === "BUSINESS_RULE_VIOLATION"
```

Cuando sea necesario, podrán introducirse códigos específicos.

Ejemplo:

```text
INSUFFICIENT_INVENTORY
```

## Consecuencia

Los mensajes pueden evolucionar sin romper innecesariamente la lógica del cliente.

---

# 21. Decisión 19 — No crear códigos específicos prematuramente

## Decisión

Inicialmente se utilizarán categorías generales de error.

Los códigos extremadamente específicos solo se crearán cuando exista una necesidad real.

No se crearán desde el inicio decenas de códigos como:

```text
SUPPLY_INACTIVE
```

```text
PRODUCT_DISABLED
```

```text
RECIPE_INVALID_FOR_PRODUCTION
```

```text
LOT_NOT_AVAILABLE
```

sin que la lógica implementada realmente requiera diferenciarlos.

## Motivo

Una taxonomía excesiva de errores también representa complejidad.

## Consecuencia

El sistema podrá evolucionar progresivamente.

---

# 22. Decisión 20 — Los módulos no se comunican mediante acceso libre a tablas

## Decisión

Un módulo no debe utilizar directamente la persistencia interna de otro módulo para implementar lógica de negocio.

Incorrecto conceptualmente:

```text
SALES MODULE
        ↓
modifica directamente
        ↓
INVENTORY TABLE
```

La dirección debe respetar las fronteras:

```text
SALES
        ↓
INTERACCIÓN DEFINIDA
        ↓
INVENTORY
```

## Motivo

El módulo propietario debe conservar el control sobre sus reglas.

## Consecuencia

Los detalles de interacción podrán implementarse inicialmente de forma simple, siempre respetando las dependencias documentadas.

---

# 23. Decisión 21 — Dependencias entre módulos explícitas

## Decisión

Las dependencias entre módulos deben estar documentadas y controladas.

La referencia principal será:

```text
02-module-dependencies.md
```

## Motivo

Las dependencias implícitas producen acoplamiento difícil de detectar.

## Consecuencia

Antes de introducir una nueva dependencia debe evaluarse:

```text
¿QUÉ MÓDULO NECESITA A CUÁL?
```

```text
¿POR QUÉ?
```

```text
¿LA DEPENDENCIA ES NECESARIA?
```

```text
¿SE PUEDE EVITAR EL ACCESO A DETALLES INTERNOS?
```

---

# 24. Decisión 22 — Sin arquitectura orientada a eventos prematura

## Decisión

No se implementará inicialmente una arquitectura compleja basada en eventos distribuidos.

No se introducirán desde el inicio:

```text
message broker
```

```text
event bus distribuido
```

```text
event sourcing
```

```text
CQRS completo
```

## Motivo

El sistema todavía no presenta una necesidad demostrada de infraestructura distribuida.

## Consecuencia

Las operaciones críticas podrán coordinarse inicialmente mediante llamadas directas y transacciones apropiadas.

Si en el futuro aparecen necesidades reales de desacoplamiento, podrán evaluarse mecanismos adicionales.

---

# 25. Decisión 23 — Sin microservicios en la fase actual

## Decisión

El backend se construirá inicialmente como una aplicación modular única.

## Motivo

Los módulos documentados pueden desarrollarse dentro de un mismo backend manteniendo fronteras claras.

Separarlos prematuramente en servicios independientes introduciría:

* comunicación distribuida;
* mayor complejidad operativa;
* consistencia distribuida;
* observabilidad adicional;
* despliegues múltiples.

## Consecuencia

La modularidad interna debe mantenerse suficientemente clara para permitir evolución futura si llegara a ser necesaria.

Pero esa evolución no debe anticiparse sin una necesidad real.

---

# 26. Decisión 24 — Evolución incremental del modelo de dominio

## Decisión

No se crearán abstracciones avanzadas del dominio únicamente porque sean consideradas buenas prácticas generales.

Ejemplos:

```text
aggregates
```

```text
domain events
```

```text
value objects complejos
```

```text
factories
```

solo deberán introducirse cuando resuelvan una complejidad real.

## Motivo

El modelo actual ya ha sido documentado y validado contra la lógica del sistema anterior.

El objetivo inicial es preservar y evolucionar correctamente esa lógica.

## Consecuencia

La implementación comienza respetando:

```text
MODELO DOCUMENTADO
        ↓
IMPLEMENTACIÓN SIMPLE
        ↓
VALIDACIÓN
        ↓
EVOLUCIÓN JUSTIFICADA
```

---

# 27. Decisión 25 — Fidelidad al modelo documentado

## Decisión

La implementación inicial debe mantener fidelidad con la lógica aprobada y validada del modelo.

Las referencias principales son:

```text
docs/domains/
```

```text
docs/data-model/
```

y:

```text
12-vba-fidelity-validation.md
```

## Motivo

El sistema ya pasó por una fase de reconstrucción y validación de su lógica.

No debe modificarse silenciosamente durante la implementación.

## Consecuencia

Si durante el desarrollo aparece una necesidad de cambiar una regla, entidad o relación, debe tratarse explícitamente como una evolución del modelo.

No debe realizarse simplemente modificando código.

---

# 28. Decisión 26 — Documentación antes de cambios estructurales

## Decisión

Los cambios que afecten:

* entidades;
* relaciones;
* reglas de integridad;
* procesos críticos;
* cálculos;
* fronteras entre módulos;

deben revisarse primero contra la documentación existente.

## Motivo

La documentación representa el contrato actual del sistema.

## Consecuencia

El proceso será:

```text
NECESIDAD DE CAMBIO
        ↓
IDENTIFICAR DOCUMENTOS AFECTADOS
        ↓
ANALIZAR IMPACTO
        ↓
TOMAR DECISIÓN
        ↓
ACTUALIZAR DOCUMENTACIÓN
        ↓
IMPLEMENTAR
```

No:

```text
MODIFICAR CÓDIGO
        ↓
DESCUBRIR DESPUÉS
QUE CAMBIÓ EL MODELO
```

---

# 29. Decisión 27 — Separación entre hechos y cálculos

## Decisión

Las operaciones del sistema deben distinguir entre:

```text
HECHOS OPERACIONALES
```

y:

```text
RESULTADOS CALCULADOS
```

Ejemplos de hechos:

```text
compra registrada
producción realizada
venta realizada
pago registrado
gasto registrado
```

Ejemplos de resultados derivados:

```text
costos
rentabilidad
indicadores
resúmenes
dashboard
```

## Motivo

Los hechos deben conservarse como registros operacionales.

Los resultados calculados pueden depender de reglas y datos derivados.

## Consecuencia

Los módulos de cálculo no deben convertirse en propietarios arbitrarios de los hechos que utilizan.

La responsabilidad debe respetar:

```text
09-calculation-responsibilities.md
```

---

# 30. Decisión 28 — Dashboard como consumidor de información

## Decisión

El módulo Dashboard no será propietario de las operaciones principales del negocio.

Su responsabilidad será presentar y consolidar información derivada de otros módulos.

Conceptualmente:

```text
PURCHASES
PRODUCTION
SALES
EXPENSES
INVENTORY
        ↓
    DASHBOARD
```

## Consecuencia

No deben crearse procesos operacionales fundamentales dentro del módulo Dashboard.

---

# 31. Decisión 29 — Costos y rentabilidad como capacidades derivadas

## Decisión

Los módulos:

```text
costs
```

y:

```text
profitability
```

deben consumir hechos y reglas documentadas para producir resultados.

No deben modificar arbitrariamente:

```text
compras
producción
ventas
inventario
```

para obtener sus cálculos.

## Consecuencia

Las responsabilidades deben mantenerse separadas:

```text
OPERACIÓN
        ↓
HECHOS
        ↓
CÁLCULOS
        ↓
ANÁLISIS
```

---

# 32. Decisión 30 — El cliente no decide reglas críticas

## Decisión

La aplicación desktop puede realizar validaciones para mejorar la experiencia del usuario.

Sin embargo, las reglas críticas deben validarse nuevamente en el backend.

Ejemplo:

```text
DESKTOP
        ↓
VALIDACIÓN DE EXPERIENCIA
```

```text
BACKEND
        ↓
VALIDACIÓN AUTORITATIVA
```

## Motivo

El cliente puede:

* contener errores;
* estar desactualizado;
* ser reemplazado;
* ser complementado por otros clientes.

## Consecuencia

La fuente autoritativa de las reglas críticas será el backend.

---

# 33. Decisión 31 — No implementar optimizaciones prematuras

## Decisión

No se introducirán inicialmente mecanismos complejos de:

```text
caching
```

```text
read models especializados
```

```text
colas
```

```text
procesamiento asíncrono
```

sin una necesidad real.

## Motivo

La primera prioridad es obtener un sistema correcto, coherente y trazable.

La optimización debe responder a un problema identificado.

## Consecuencia

El orden será:

```text
CORRECTITUD
        ↓
MEDICIÓN
        ↓
IDENTIFICACIÓN DEL PROBLEMA
        ↓
OPTIMIZACIÓN
```

---

# 34. Decisión 32 — Preparación para múltiples clientes sin sobreconstrucción

## Decisión

La API se diseñará como una frontera independiente del cliente actual.

Esto permitirá que, en el futuro, otros clientes puedan utilizarla.

Sin embargo, no se crearán desde ahora clientes adicionales ni infraestructura específica para escenarios hipotéticos.

## Consecuencia

El backend será independiente del cliente, pero su implementación inicial se limitará a las necesidades reales del proyecto.

---

# 35. Decisión 33 — Pruebas orientadas a reglas críticas

## Decisión

Las reglas críticas del negocio deberán poder probarse de forma independiente.

La prioridad inicial estará en operaciones que afecten:

```text
inventario
compras
producción
lotes
ventas
pagos
costos críticos
```

## Motivo

Estas operaciones representan los puntos donde un error puede afectar la consistencia del negocio.

## Consecuencia

La estrategia de pruebas detallada se definirá en la documentación correspondiente, pero la arquitectura no debe dificultar probar reglas importantes.

---

# 36. Decisión 34 — Cambios arquitectónicos deben ser explícitos

## Decisión

Cuando una implementación requiera cambiar una decisión establecida en este documento, el cambio no debe realizarse silenciosamente.

Debe identificarse:

```text
DECISIÓN ACTUAL
        ↓
LIMITACIÓN O PROBLEMA
        ↓
ALTERNATIVA
        ↓
IMPACTO
        ↓
NUEVA DECISIÓN
```

Cuando corresponda, deberá registrarse mediante un ADR o actualizar este documento y los documentos relacionados.

---

# 37. Decisión 35 — La documentación forma parte del desarrollo

## Decisión

La documentación técnica y del dominio no será tratada como un artefacto separado que se escribe una sola vez.

Debe evolucionar junto con el sistema.

El código no debe convertirse silenciosamente en una fuente de verdad diferente a:

```text
docs/domains/
```

```text
docs/data-model/
```

```text
docs/backend/
```

## Consecuencia

Antes de implementar cambios relevantes debe verificarse el modelo documentado.

Después de aprobar un cambio estructural, la documentación afectada debe actualizarse.

---

# 38. Resumen de decisiones

```text
01 → Backend separado en apps/api
02 → Arquitectura modular
03 → Modularidad progresiva
04 → Módulos como fronteras de responsabilidad
05 → Inventory como capacidad transversal
06 → Persistencia detrás de fronteras técnicas
07 → Prisma como mecanismo de persistencia
08 → PostgreSQL como fuente persistente principal
09 → Base de datos como protección de integridad
10 → API como contrato público
11 → DTOs como frontera de entrada
12 → Reglas de negocio fuera de controladores
13 → Validación distribuida por responsabilidad
14 → Límites transaccionales explícitos
15 → Inventario sin actualizaciones parciales
16 → Contrato uniforme de errores
17 → Protección de detalles internos
18 → Mensajes no como contrato técnico
19 → Códigos específicos solo cuando sean necesarios
20 → Sin acceso libre entre persistencias de módulos
21 → Dependencias entre módulos explícitas
22 → Sin arquitectura orientada a eventos prematura
23 → Sin microservicios en la fase actual
24 → Evolución incremental del modelo de dominio
25 → Fidelidad al modelo documentado
26 → Documentación antes de cambios estructurales
27 → Separación entre hechos y cálculos
28 → Dashboard como consumidor de información
29 → Costos y rentabilidad como capacidades derivadas
30 → Cliente no decide reglas críticas
31 → Sin optimización prematura
32 → API preparada para múltiples clientes
33 → Prioridad a pruebas de reglas críticas
34 → Cambios arquitectónicos explícitos
35 → Documentación como parte del desarrollo
```

---

# 39. Estado actual

```text
Documento: 08-backend-decisions.md
Versión: V1
Estado: BASE DE DECISIONES TÉCNICAS DEL BACKEND
```

Este documento consolida las decisiones iniciales para implementar el backend sin introducir sobrearquitectura, manteniendo fidelidad al modelo de negocio documentado, preservando las fronteras entre módulos y permitiendo que la arquitectura evolucione únicamente cuando exista una necesidad técnica o funcional demostrable.
