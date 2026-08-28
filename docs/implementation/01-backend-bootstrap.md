# Backend Bootstrap — V1

## 1. Propósito del documento

Este documento define la preparación técnica inicial de la aplicación backend antes de comenzar la implementación de los módulos de negocio.

El objetivo del bootstrap es establecer una base mínima, ejecutable y coherente con la arquitectura aprobada.

El bootstrap no debe utilizarse para implementar anticipadamente módulos, entidades, reglas de negocio o funcionalidades que todavía no correspondan a la fase inicial.

La secuencia esperada es:

```text
MONOREPO
    ↓
APLICACIÓN API BASE
    ↓
CONFIGURACIÓN
    ↓
ESTRUCTURA TÉCNICA MÍNIMA
    ↓
INFRAESTRUCTURA TRANSVERSAL
    ↓
VERIFICACIÓN DE EJECUCIÓN
    ↓
IMPLEMENTACIÓN DEL MODELO
```

---

# 2. Alcance

Este documento cubre únicamente la preparación inicial de:

```text
apps/api/
```

y los elementos compartidos estrictamente necesarios para que la aplicación backend pueda comenzar su implementación.

No cubre todavía:

```text
módulos de negocio completos
```

```text
CRUD de entidades
```

```text
casos de uso funcionales
```

```text
endpoints específicos del negocio
```

```text
schema definitivo de persistencia
```

```text
cliente desktop
```

```text
dashboard
```

```text
autenticación completa
```

Estos elementos se implementarán en las fases correspondientes.

---

# 3. Objetivo del bootstrap

Al finalizar esta etapa debe existir una aplicación backend que:

```text
✓ pueda instalarse
✓ pueda ejecutarse
✓ tenga una estructura inicial clara
✓ pueda cargar configuración
✓ tenga manejo global de errores
✓ tenga validación global preparada
✓ pueda evolucionar hacia módulos funcionales
✓ respete las fronteras arquitectónicas aprobadas
```

El resultado esperado no es una aplicación terminada.

El resultado esperado es una base técnica estable sobre la cual comenzar a implementar.

---

# 4. Ubicación dentro del monorepo

La aplicación backend residirá en:

```text
App-Gestion-Empresarial-de-Yogurt/
│
├── apps/
│   │
│   └── api/
│
├── packages/
│
├── docs/
│
└── scripts/
```

La responsabilidad de:

```text
apps/api/
```

será ejecutar la lógica del servidor y exponer la interfaz HTTP del sistema.

---

# 5. Responsabilidad inicial de la API

Durante la fase de bootstrap, la API será responsable de establecer:

```text
INICIO DE LA APLICACIÓN
```

```text
CONFIGURACIÓN
```

```text
VALIDACIÓN TRANSVERSAL
```

```text
MANEJO DE ERRORES
```

```text
ESTRUCTURA MODULAR BASE
```

La API no debe comenzar a contener lógica específica del negocio durante esta etapa.

---

# 6. Stack base del backend

La aplicación backend se construirá sobre:

```text
Node.js
```

```text
TypeScript
```

```text
NestJS
```

La elección de estas tecnologías forma parte de la dirección técnica previamente definida para el proyecto.

La estructura inicial debe aprovechar las capacidades propias del framework sin crear abstracciones adicionales innecesarias.

---

# 7. Principio de bootstrap mínimo

La regla principal de esta fase será:

```text
CREAR LO NECESARIO
PARA PODER COMENZAR
```

No:

```text
CREAR TODA LA ARQUITECTURA
ANTES DE NECESITARLA
```

Por lo tanto, no deben generarse carpetas vacías para todos los módulos futuros.

Tampoco deben crearse clases genéricas sin una responsabilidad inmediata.

Ejemplos de elementos que no deben crearse anticipadamente:

```text
BaseRepository
```

```text
GenericService
```

```text
BaseEntity
```

```text
AbstractUseCase
```

```text
EventBus propio
```

```text
Factory genérica
```

```text
RepositoryFactory
```

El framework y las decisiones arquitectónicas existentes deben ser suficientes hasta que aparezca una necesidad concreta.

---

# 8. Estructura inicial de la aplicación

La estructura inicial debe mantenerse deliberadamente pequeña.

La forma exacta podrá evolucionar, pero conceptualmente la aplicación comenzará con:

```text
apps/
└── api/
    │
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   │
    │   ├── config/
    │   │
    │   └── common/
    │
    ├── test/
    │
    ├── package.json
    ├── tsconfig.json
    └── nest-cli.json
```

Esta estructura no representa todavía los módulos del negocio.

Representa únicamente la base de la aplicación.

---

# 9. Punto de entrada

El punto de entrada de la aplicación será:

```text
apps/api/src/main.ts
```

Su responsabilidad será iniciar la aplicación y registrar la configuración transversal necesaria.

Entre sus responsabilidades estarán, según corresponda:

```text
crear la aplicación NestJS
```

```text
aplicar configuración global
```

```text
registrar validación global
```

```text
registrar manejo global de errores
```

```text
configurar el ciclo de inicio
```

No debe contener lógica de negocio.

---

# 10. Módulo raíz

El módulo raíz será:

```text
apps/api/src/app.module.ts
```

Su responsabilidad será componer la aplicación.

Conceptualmente:

```text
APP MODULE
│
├── configuración
│
├── infraestructura transversal
│
└── módulos funcionales
    └── cuando sean implementados
```

El módulo raíz no debe convertirse en un lugar donde se implemente lógica del negocio.

Su función es principalmente de composición.

---

# 11. Configuración

La configuración de la aplicación debe separarse de la lógica funcional.

La ubicación inicial será:

```text
apps/api/src/config/
```

La configuración podrá incluir progresivamente elementos relacionados con:

```text
entorno
```

```text
puerto
```

```text
base de datos
```

```text
seguridad
```

```text
otros parámetros técnicos
```

La configuración no debe estar distribuida arbitrariamente por los módulos.

---

# 12. Variables de entorno

La aplicación utilizará variables de entorno para los valores que dependan del entorno de ejecución.

Ejemplos conceptuales:

```text
NODE_ENV
```

```text
PORT
```

```text
DATABASE_URL
```

Los valores concretos no deben quedar escritos directamente en el código cuando correspondan a configuración externa.

El repositorio debe proporcionar:

```text
.env.example
```

como referencia de las variables necesarias.

El archivo:

```text
.env
```

no debe utilizarse como fuente de configuración versionada con información sensible.

---

# 13. Validación de configuración

La configuración requerida para ejecutar la aplicación debe poder verificarse durante el inicio.

El objetivo es evitar que la aplicación comience con valores críticos ausentes o inválidos.

Conceptualmente:

```text
VARIABLES DE ENTORNO
        ↓
CARGA
        ↓
VALIDACIÓN
        ↓
CONFIGURACIÓN DISPONIBLE
        ↓
INICIO DE LA APLICACIÓN
```

Si una configuración obligatoria no es válida, el inicio debe fallar de manera explícita.

No debe permitirse que errores de configuración aparezcan posteriormente como fallos ambiguos durante una operación funcional.

---

# 14. Common

La ubicación:

```text
apps/api/src/common/
```

se reservará para elementos técnicos realmente transversales.

Inicialmente podrá contener componentes relacionados con:

```text
errores
```

```text
filtros
```

```text
pipes
```

```text
utilidades técnicas
```

No debe utilizarse como una carpeta genérica para cualquier código que no tenga una ubicación clara.

La regla será:

```text
SI TIENE UNA RESPONSABILIDAD DE DOMINIO
    ↓
PERTENECE AL MÓDULO CORRESPONDIENTE
```

```text
SI ES TÉCNICO Y TRANSVERSAL
    ↓
PUEDE EVALUARSE PARA common/
```

---

# 15. Manejo global de errores

El bootstrap debe preparar el mecanismo global definido en:

```text
docs/backend/06-error-handling.md
```

El objetivo es evitar que cada controlador o servicio implemente formatos de error diferentes.

Conceptualmente:

```text
ERROR
    ↓
CAPTURA
    ↓
NORMALIZACIÓN
    ↓
RESPUESTA HTTP COHERENTE
```

La implementación concreta deberá respetar la estrategia aprobada para el backend.

El bootstrap debe preparar el mecanismo, no inventar errores específicos de cada módulo.

---

# 16. Validación global

El bootstrap debe preparar la estrategia transversal definida en:

```text
docs/backend/07-validation-strategy.md
```

La validación global permitirá que los futuros contratos de entrada sean procesados de manera consistente.

Conceptualmente:

```text
REQUEST
    ↓
VALIDACIÓN
    ↓
TRANSFORMACIÓN CUANDO CORRESPONDA
    ↓
CONTROLADOR
```

La lógica específica de validación del negocio continuará perteneciendo a cada módulo o caso de uso.

La validación global no sustituye las reglas de negocio.

---

# 17. Separación entre validación técnica y reglas de negocio

Durante la implementación debe mantenerse la siguiente diferencia:

```text
VALIDACIÓN TÉCNICA
```

Responde preguntas como:

```text
¿el campo existe?
```

```text
¿el formato es válido?
```

```text
¿el tipo de dato corresponde?
```

```text
¿el valor obligatorio fue enviado?
```

Las reglas de negocio responden preguntas como:

```text
¿esta presentación puede utilizarse?
```

```text
¿este insumo puede participar en esta operación?
```

```text
¿esta operación es válida en el estado actual?
```

```text
¿esta modificación rompe una regla del sistema?
```

La validación global se encarga principalmente de la primera categoría.

La segunda pertenece a la lógica funcional.

---

# 18. Health check inicial

La aplicación podrá contar con un mecanismo técnico mínimo para verificar que el proceso se encuentra disponible.

Su propósito será responder:

```text
¿LA APLICACIÓN ESTÁ EJECUTÁNDOSE?
```

No debe confundirse con:

```text
¿TODOS LOS MÓDULOS DEL NEGOCIO FUNCIONAN?
```

El mecanismo inicial debe permanecer simple.

No es necesario implementar sistemas complejos de monitoreo durante el bootstrap.

---

# 19. Logging inicial

La aplicación debe utilizar un mecanismo coherente de registro técnico.

Inicialmente, debe priorizarse:

```text
inicio de la aplicación
```

```text
errores relevantes
```

```text
fallos de configuración
```

No debe introducirse todavía una infraestructura compleja de observabilidad sin una necesidad concreta.

El logging podrá evolucionar cuando las necesidades operativas del sistema lo justifiquen.

---

# 20. Persistencia durante el bootstrap

El bootstrap debe preparar el terreno para la persistencia, pero no obliga a implementar todavía todas las entidades del sistema.

La implementación concreta de la base de datos debe seguir el plan definido posteriormente.

La secuencia será:

```text
BOOTSTRAP DE APLICACIÓN
        ↓
ESTRATEGIA DE PERSISTENCIA
        ↓
MODELO DE PERSISTENCIA
        ↓
MIGRACIÓN INICIAL
        ↓
IMPLEMENTACIÓN DE MÓDULOS
```

No debe crearse un modelo parcial improvisado únicamente para comprobar que la base de datos funciona.

---

# 21. Prisma

La estrategia técnica prevista para la persistencia utilizará Prisma.

Sin embargo, su incorporación debe respetar:

```text
docs/backend/04-persistence-boundaries.md
```

La introducción de Prisma no significa que los modelos de negocio deban copiarse automáticamente desde los nombres de las tablas anteriores.

La implementación deberá realizar una traducción consciente entre:

```text
MODELO DOCUMENTADO
        ↓
MODELO DE PERSISTENCIA
```

No:

```text
NOMBRE DE TABLA
        ↓
COPIA AUTOMÁTICA
        ↓
MODELO FINAL
```

---

# 22. Base de datos

La arquitectura prevista utiliza PostgreSQL como sistema de persistencia principal.

La base de datos deberá configurarse para que pueda utilizarse desde el entorno de desarrollo sin depender de valores personales escritos directamente dentro del repositorio.

La configuración debe permitir posteriormente trabajar con:

```text
desarrollo
```

```text
pruebas
```

```text
producción
```

Sin crear todavía una infraestructura excesiva para cada entorno.

---

# 23. Packages durante el bootstrap

El bootstrap no requiere llenar automáticamente:

```text
packages/contracts/
```

```text
packages/shared/
```

```text
packages/config/
```

Estos paquetes deben permanecer sin código innecesario hasta que aparezcan responsabilidades reales.

Por ejemplo:

```text
apps/api/
```

no debe depender de:

```text
packages/shared/
```

simplemente porque dicho paquete existe.

La existencia de un directorio no obliga a utilizarlo.

---

# 24. Contratos compartidos

Los contratos compartidos entre aplicaciones deben aparecer únicamente cuando exista más de un consumidor real.

Por ejemplo:

```text
API
        ↓
CONTRATO COMPARTIDO
        ↑
DESKTOP
```

Si inicialmente el contrato solo es utilizado por:

```text
apps/api/
```

no existe obligación de moverlo inmediatamente a:

```text
packages/contracts/
```

La extracción debe producirse cuando la reutilización sea real y estable.

---

# 25. Módulos de negocio

Durante el bootstrap no deben crearse automáticamente directorios como:

```text
presentations/
```

```text
supplies/
```

```text
suppliers/
```

```text
products/
```

```text
recipes/
```

```text
purchases/
```

```text
inventory/
```

```text
production/
```

```text
lots/
```

```text
clients/
```

```text
sales/
```

```text
payments/
```

```text
expenses/
```

```text
costs/
```

```text
profitability/
```

```text
dashboard/
```

Cada módulo debe aparecer cuando llegue su turno real de implementación.

Esto evita generar una arquitectura visualmente completa pero técnicamente vacía.

---

# 26. Estructura modular progresiva

La estructura evolucionará de forma incremental.

Inicialmente:

```text
apps/api/src/
│
├── main.ts
├── app.module.ts
├── config/
└── common/
```

Posteriormente:

```text
apps/api/src/
│
├── main.ts
├── app.module.ts
│
├── config/
├── common/
│
└── modules/
    └── primer-módulo-real/
```

Y solo cuando aparezcan nuevas responsabilidades:

```text
apps/api/src/
│
├── config/
├── common/
│
└── modules/
    ├── presentations/
    ├── supplies/
    └── ...
```

La estructura debe crecer como consecuencia de la implementación, no anticiparse artificialmente a ella.

---

# 27. Dependencias iniciales

Las dependencias deben instalarse únicamente cuando tengan una función concreta dentro del bootstrap.

Inicialmente serán necesarias las relacionadas con:

```text
NestJS
```

```text
TypeScript
```

```text
configuración
```

```text
validación
```

```text
Prisma cuando corresponda a la fase de persistencia
```

No deben instalarse anticipadamente bibliotecas para:

```text
colas
```

```text
caching distribuido
```

```text
event buses externos
```

```text
microservicios
```

```text
mensajería
```

```text
monitorización compleja
```

hasta que exista una necesidad documentada.

---

# 28. Scripts mínimos

La aplicación backend debe contar con scripts suficientes para desarrollar y verificar su funcionamiento.

Conceptualmente:

```text
desarrollo
```

```text
compilación
```

```text
ejecución
```

```text
pruebas
```

Los nombres concretos deberán seguir las convenciones definidas para el proyecto.

No deben crearse scripts sin una operación real detrás.

---

# 29. Verificación del bootstrap

Antes de considerar completada esta fase debe verificarse como mínimo:

```text
1. El workspace reconoce apps/api.
```

```text
2. Las dependencias pueden instalarse correctamente.
```

```text
3. La aplicación puede iniciarse.
```

```text
4. TypeScript puede compilar el proyecto.
```

```text
5. La configuración necesaria se carga correctamente.
```

```text
6. La configuración inválida produce un fallo claro.
```

```text
7. La validación global está preparada.
```

```text
8. El manejo global de errores está preparado.
```

```text
9. La estructura no contiene módulos de negocio ficticios.
```

```text
10. El proyecto está preparado para comenzar la fase de persistencia.
```

---

# 30. Criterio de finalización

El backend bootstrap estará terminado cuando exista una aplicación mínima capaz de iniciar correctamente y proporcionar la infraestructura transversal necesaria para continuar.

El resultado esperado será:

```text
MONOREPO
    │
    └── apps/api
            │
            ├── inicia correctamente
            ├── carga configuración
            ├── valida configuración crítica
            ├── tiene manejo transversal de errores
            ├── tiene validación global preparada
            └── está lista para incorporar persistencia
```

No forma parte del criterio de finalización:

```text
tener todos los módulos creados
```

```text
tener endpoints CRUD
```

```text
tener entidades completas
```

```text
tener autenticación terminada
```

```text
tener el cliente desktop conectado
```

---

# 31. Decisión de cierre de la fase

Una vez completado y verificado el bootstrap, el siguiente paso será definir e implementar la estrategia concreta de persistencia.

La secuencia posterior será:

```text
00-implementation-overview.md
        ↓
01-backend-bootstrap.md
        ↓
02-database-implementation-plan.md
        ↓
03-module-implementation-order.md
        ↓
IMPLEMENTACIÓN CONTROLADA
```

---

# 32. Estado del documento

```text
Documento: 01-backend-bootstrap.md
Versión: V1
Estado: PLAN DE PREPARACIÓN INICIAL DEL BACKEND
Dependencia previa: 00-implementation-overview.md
Siguiente etapa: 02-database-implementation-plan.md
```

Este documento define únicamente cómo preparar la base técnica inicial del backend. La implementación de persistencia y de los módulos funcionales comenzará después de que esta fase esté completada y verificada.
