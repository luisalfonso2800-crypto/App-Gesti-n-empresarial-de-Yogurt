# Overview de Implementación — V1

## 1. Propósito del documento

Este documento define cómo se realizará la transición desde la documentación funcional y técnica existente hacia la implementación real de **App Gestión Empresarial de Yogurt**.

Su propósito es evitar que el inicio del desarrollo vuelva a depender de decisiones improvisadas, interpretaciones aisladas o lógica inventada directamente durante la escritura del código.

La implementación debe seguir la siguiente cadena:

```text
DOMINIO
    ↓
MODELO DE DATOS
    ↓
ARQUITECTURA
    ↓
DECISIONES TÉCNICAS
    ↓
PLAN DE IMPLEMENTACIÓN
    ↓
CÓDIGO
    ↓
VALIDACIÓN
```

Cada etapa debe respetar la información aprobada en la etapa anterior.

---

# 2. Estado actual del proyecto

Antes de iniciar la implementación, el proyecto cuenta con tres bloques principales de documentación.

## 2.1. Dominio

Ubicación:

```text
docs/domains/
```

Estos documentos definen qué existe dentro del negocio y cómo se comportan sus principales áreas funcionales.

La documentación actual cubre:

```text
00-business-map.md

01-presentations.md
02-supplies.md
03-suppliers.md
04-products.md
05-recipes.md
06-purchases.md
07-inventory.md
08-production.md
09-lots.md
10-clients.md
11-sales.md
12-payments.md
13-expenses.md
14-costs.md
15-profitability.md
16-dashboard.md
```

Estos documentos representan la referencia principal para comprender las responsabilidades funcionales del sistema.

---

## 2.2. Modelo de datos

Ubicación:

```text
docs/data-model/
```

Estos documentos definen cómo se representa y protege la información del sistema.

La documentación actual incluye:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
05-data-model-decisions.md

06-inventory-flow.md
07-business-processes.md
08-cross-module-rules.md
09-calculation-responsibilities.md
10-technical-implementation-notes.md

11-model-validation.md
12-vba-fidelity-validation.md
```

Este bloque establece:

* entidades identificadas;
* relaciones;
* reglas de integridad;
* trazabilidad;
* flujos operacionales;
* responsabilidades de cálculo;
* reglas entre módulos;
* decisiones del modelo;
* validación documental;
* fidelidad respecto al sistema VBA maestro.

---

## 2.3. Backend

Ubicación:

```text
docs/backend/
```

La documentación actual incluye:

```text
00-backend-overview.md
01-module-boundaries.md
02-module-dependencies.md
03-api-design.md
04-persistence-boundaries.md
05-transaction-boundaries.md
06-error-handling.md
07-validation-strategy.md
08-backend-decisions.md
```

Este bloque define cómo el backend debe implementar y proteger el modelo del negocio.

---

# 3. Fuente de verdad durante la implementación

La implementación no debe utilizar una única fuente de verdad para todas las decisiones.

Cada tipo de decisión debe consultar el documento correspondiente.

La jerarquía funcional será:

```text
REGLAS DEL NEGOCIO
        ↓
docs/domains/
```

```text
ENTIDADES Y RELACIONES
        ↓
docs/data-model/
```

```text
DECISIONES Y FRONTERAS DEL BACKEND
        ↓
docs/backend/
```

```text
IMPLEMENTACIÓN
        ↓
apps/api/
```

Por lo tanto, el código no debe convertirse en una fuente independiente que contradiga la documentación aprobada.

---

# 4. Principio de fidelidad

La primera implementación debe preservar la lógica aprobada.

La regla general será:

```text
DOCUMENTACIÓN APROBADA
        ↓
IMPLEMENTACIÓN
```

No:

```text
IMPLEMENTACIÓN
        ↓
INVENTAR NUEVA LÓGICA
        ↓
MODIFICAR DOCUMENTACIÓN DESPUÉS
```

Si durante la implementación se descubre una ambigüedad o una necesidad real de cambio, el proceso será:

```text
IDENTIFICAR LA DIFERENCIA
        ↓
REVISAR DOCUMENTACIÓN RELACIONADA
        ↓
DETERMINAR IMPACTO
        ↓
TOMAR DECISIÓN EXPLÍCITA
        ↓
ACTUALIZAR DOCUMENTACIÓN
        ↓
IMPLEMENTAR EL CAMBIO
```

No deben introducirse nuevas reglas silenciosamente dentro del código.

---

# 5. Qué significa implementar un módulo

Un módulo no se considera implementado simplemente porque existan:

```text
controller
service
repository
schema
```

Un módulo está implementado cuando la responsabilidad funcional definida para ese módulo puede ejecutarse correctamente.

El criterio general será:

```text
DOCUMENTACIÓN DEL DOMINIO
        ↓
CASOS DE USO IDENTIFICADOS
        ↓
CONTRATOS DE ENTRADA
        ↓
VALIDACIONES
        ↓
REGLAS DE NEGOCIO
        ↓
PERSISTENCIA
        ↓
EFECTOS RELACIONADOS
        ↓
PRUEBAS
```

Por lo tanto:

```text
CÓDIGO EXISTENTE
```

no significa necesariamente:

```text
MÓDULO TERMINADO
```

---

# 6. Antes de implementar una entidad

Una entidad persistente no debe crearse simplemente porque exista una idea de negocio relacionada.

Antes de crearla debe verificarse:

```text
1. ¿Está identificada en 01-entities.md?

2. ¿Su relación está definida en 02-relationships.md?

3. ¿Sus reglas de integridad están documentadas?

4. ¿Tiene responsabilidad funcional definida?

5. ¿Existe una necesidad real de persistirla?

6. ¿Su creación contradice alguna decisión existente?
```

Si la documentación no permite responder claramente estas preguntas, la entidad no debe inventarse durante la implementación.

Debe resolverse primero la ambigüedad.

---

# 7. Antes de implementar una relación

Las relaciones entre entidades deben verificarse contra:

```text
02-relationships.md
```

y:

```text
03-data-integrity-rules.md
```

Antes de implementar una relación debe determinarse:

```text
¿Es obligatoria?
```

```text
¿Es opcional?
```

```text
¿Cuál entidad es propietaria?
```

```text
¿Existe dependencia histórica?
```

```text
¿Puede modificarse después de crear el registro?
```

```text
¿La relación afecta trazabilidad?
```

No deben agregarse relaciones únicamente porque sean técnicamente convenientes en Prisma.

---

# 8. Antes de implementar un campo

Cada campo persistente debe tener una razón funcional.

Antes de agregarlo debe responderse:

```text
¿QUÉ REPRESENTA?
```

```text
¿DE DÓNDE PROVIENE?
```

```text
¿QUIÉN LO MODIFICA?
```

```text
¿ES UN HECHO O UN VALOR CALCULADO?
```

```text
¿DEBE CONSERVARSE HISTÓRICAMENTE?
```

```text
¿TIENE UNA REGLA DE VALIDACIÓN?
```

No deben agregarse columnas simplemente porque parezcan útiles para una futura necesidad hipotética.

---

# 9. Separación entre implementación y evolución del modelo

La implementación inicial tiene como objetivo trasladar el modelo aprobado al sistema.

Esto es diferente de evolucionar el modelo.

```text
IMPLEMENTACIÓN
=
CONSTRUIR LO QUE YA ESTÁ DEFINIDO
```

```text
EVOLUCIÓN
=
CAMBIAR LO QUE YA ESTÁ DEFINIDO
```

Ambas actividades no deben mezclarse.

Si se detecta que una regla debe cambiar, debe tratarse explícitamente como una evolución.

---

# 10. Orden general de implementación

El desarrollo no debe comenzar por los módulos más complejos.

La secuencia general será:

```text
1. FUNDACIÓN TÉCNICA
```

```text
2. MODELO DE PERSISTENCIA
```

```text
3. MÓDULOS MAESTROS
```

```text
4. MÓDULOS DEPENDIENTES
```

```text
5. OPERACIONES TRANSACCIONALES
```

```text
6. INVENTARIO Y TRAZABILIDAD
```

```text
7. CÁLCULOS Y ANÁLISIS
```

```text
8. API COMPLETA
```

```text
9. CLIENTE DESKTOP
```

El orden concreto de cada módulo se definirá en la planificación de implementación.

---

# 11. Fase 1 — Fundación técnica

Antes de construir módulos funcionales debe existir una base mínima para el backend.

Esta fase deberá establecer:

```text
apps/api
```

como aplicación ejecutable y preparada para evolucionar.

La fundación técnica incluirá únicamente lo necesario para comenzar correctamente.

Conceptualmente:

```text
API APPLICATION
│
├── configuración
├── módulos base
├── manejo global de errores
├── validación global
├── conexión de persistencia
└── estructura inicial
```

No deben construirse todavía módulos ficticios únicamente para llenar la arquitectura.

---

# 12. Fase 2 — Traducción del modelo de datos

Antes de implementar operaciones complejas debe traducirse el modelo documentado hacia la estrategia real de persistencia.

Esta fase deberá producir una representación verificable de:

```text
ENTIDADES
```

```text
RELACIONES
```

```text
RESTRICCIONES
```

```text
CAMPOS HISTÓRICOS
```

```text
IDENTIFICADORES
```

La implementación deberá contrastarse contra:

```text
docs/data-model/01-entities.md
```

```text
docs/data-model/02-relationships.md
```

```text
docs/data-model/03-data-integrity-rules.md
```

```text
docs/data-model/04-history-and-traceability.md
```

El objetivo no es crear una base de datos completa sin verificación.

El objetivo es crear una traducción técnica fiel al modelo aprobado.

---

# 13. Fase 3 — Implementación de módulos maestros

Los módulos maestros deben implementarse antes que los procesos que dependen de ellos.

Conceptualmente:

```text
PRESENTATIONS
```

```text
SUPPLIES
```

```text
SUPPLIERS
```

```text
PRODUCTS
```

```text
CLIENTS
```

El orden exacto debe respetar las dependencias reales documentadas.

Cada módulo debe construirse y validarse antes de continuar indiscriminadamente con todos los demás.

---

# 14. Fase 4 — Implementación de relaciones funcionales

Después de los módulos maestros se implementarán los módulos que utilizan esas referencias.

Conceptualmente:

```text
RECIPES
```

depende de información relacionada con:

```text
PRODUCTS
```

y:

```text
SUPPLIES
```

Otros módulos deberán implementarse según las dependencias definidas en:

```text
02-module-dependencies.md
```

La implementación debe seguir el grafo real de dependencias.

No únicamente el orden numérico de los documentos.

---

# 15. Fase 5 — Operaciones críticas

Una vez disponibles las estructuras necesarias, se implementarán los procesos que generan efectos múltiples.

Entre ellos pueden encontrarse:

```text
PURCHASES
```

```text
PRODUCTION
```

```text
SALES
```

Estas operaciones requieren especial cuidado porque pueden afectar:

```text
detalles
inventario
lotes
historial
trazabilidad
costos
```

No deben implementarse como simples operaciones CRUD si el modelo documentado establece efectos adicionales.

---

# 16. Fase 6 — Inventario y trazabilidad

El inventario debe implementarse respetando el flujo documentado.

La referencia principal será:

```text
06-inventory-flow.md
```

y:

```text
04-history-and-traceability.md
```

La implementación debe garantizar que los movimientos correspondan a operaciones válidas.

Conceptualmente:

```text
COMPRA
    ↓
EFECTO DE INVENTARIO
```

```text
PRODUCCIÓN
    ↓
CONSUMO / GENERACIÓN SEGÚN EL MODELO
```

```text
VENTA
    ↓
SALIDA CORRESPONDIENTE
```

El inventario no debe convertirse en una colección de cantidades modificables libremente.

---

# 17. Fase 7 — Lotes y trazabilidad

La implementación de lotes debe respetar la información histórica definida.

Entre los elementos relevantes se encuentran:

```text
origen
```

```text
fecha de creación
```

```text
fecha de vencimiento
```

```text
relación con la operación correspondiente
```

```text
estado según el modelo
```

La información histórica no debe modificarse sin evaluar sus efectos sobre trazabilidad e integridad.

---

# 18. Fase 8 — Cálculos derivados

Los módulos:

```text
costs
```

```text
profitability
```

y:

```text
dashboard
```

deben construirse sobre hechos operacionales ya implementados.

La secuencia conceptual es:

```text
OPERACIONES
        ↓
DATOS HISTÓRICOS
        ↓
CÁLCULOS
        ↓
ANÁLISIS
        ↓
PRESENTACIÓN
```

No se recomienda comenzar por estos módulos porque dependen de información producida por otros procesos.

Las responsabilidades deben respetar:

```text
09-calculation-responsibilities.md
```

---

# 19. Fase 9 — API funcional

La API debe construirse progresivamente junto con los módulos.

No es necesario definir todos los endpoints del sistema antes de comenzar la implementación.

Sin embargo, cada endpoint implementado debe respetar:

```text
03-api-design.md
```

Cada operación deberá tener claramente definidos:

```text
entrada
```

```text
validación
```

```text
caso de uso
```

```text
resultado
```

```text
errores posibles
```

La API no debe exponer directamente:

```text
modelos Prisma
```

```text
tablas
```

```text
detalles internos
```

---

# 20. Fase 10 — Pruebas

Las pruebas no deben dejarse completamente para el final.

Cada módulo debe incorporar validación proporcional a su complejidad.

La prioridad inicial debe estar en las reglas críticas relacionadas con:

```text
compras
```

```text
inventario
```

```text
producción
```

```text
lotes
```

```text
ventas
```

```text
pagos
```

El objetivo inicial no es alcanzar una métrica artificial de cobertura.

El objetivo es verificar las reglas cuya falla puede afectar la consistencia del negocio.

---

# 21. Criterio para iniciar un módulo

Antes de comenzar un módulo debe existir claridad suficiente sobre:

```text
1. Responsabilidad del módulo.

2. Entidades involucradas.

3. Dependencias.

4. Operaciones necesarias.

5. Reglas de negocio.

6. Reglas de validación.

7. Efectos sobre otros módulos.

8. Persistencia necesaria.

9. Errores relevantes.

10. Criterio de finalización.
```

Si alguno de estos puntos no puede determinarse con la documentación existente, debe investigarse antes de implementar.

---

# 22. Criterio de finalización de un módulo

Un módulo podrá considerarse terminado para su fase cuando:

```text
✓ Su responsabilidad esté implementada.
```

```text
✓ Sus operaciones principales funcionen.
```

```text
✓ Las reglas documentadas estén aplicadas.
```

```text
✓ Las relaciones necesarias estén protegidas.
```

```text
✓ Sus errores sean coherentes.
```

```text
✓ Sus efectos sobre otros módulos estén controlados.
```

```text
✓ Las reglas críticas tengan pruebas.
```

```text
✓ La implementación no contradiga la documentación.
```

Un módulo no debe considerarse terminado únicamente porque:

```text
compila
```

o:

```text
tiene endpoints CRUD
```

---

# 23. Proceso de implementación de una funcionalidad

Cada funcionalidad seguirá, en general, este proceso:

```text
1. IDENTIFICAR RESPONSABILIDAD
```

```text
2. REVISAR DOCUMENTACIÓN DEL DOMINIO
```

```text
3. REVISAR MODELO DE DATOS
```

```text
4. REVISAR DEPENDENCIAS
```

```text
5. DEFINIR CASO DE USO
```

```text
6. DEFINIR CONTRATO DE ENTRADA
```

```text
7. IMPLEMENTAR VALIDACIONES
```

```text
8. IMPLEMENTAR REGLAS
```

```text
9. IMPLEMENTAR PERSISTENCIA
```

```text
10. IMPLEMENTAR EFECTOS RELACIONADOS
```

```text
11. MANEJAR ERRORES
```

```text
12. PROBAR
```

```text
13. CONTRASTAR CONTRA LA DOCUMENTACIÓN
```

---

# 24. Prohibición de implementación especulativa

No deben implementarse anticipadamente funcionalidades basadas en:

```text
algún día podría necesitarse
```

```text
quizás en el futuro
```

```text
por si acaso
```

Ejemplos de implementación especulativa:

```text
sistemas genéricos de eventos sin necesidad actual
```

```text
abstracciones complejas de repositorios
```

```text
motores genéricos de reglas
```

```text
infraestructura distribuida
```

```text
microservicios
```

```text
caching sin un problema medido
```

La regla será:

```text
NECESIDAD REAL
        ↓
DISEÑO
        ↓
IMPLEMENTACIÓN
```

---

# 25. Relación entre documentación y código

La documentación existente debe utilizarse activamente durante el desarrollo.

Antes de implementar:

```text
REVISAR DOCUMENTACIÓN
```

Durante la implementación:

```text
CONTRASTAR DECISIONES
```

Después de implementar:

```text
VALIDAR FIDELIDAD
```

Si aparece una diferencia:

```text
DOCUMENTACIÓN
        ≠
CÓDIGO
```

debe determinarse cuál es la causa.

El código no debe considerarse automáticamente correcto simplemente porque ya fue implementado.

---

# 26. Cambios durante la implementación

Si durante el desarrollo aparece una nueva necesidad, deben distinguirse tres situaciones.

## 26.1. La funcionalidad ya está documentada

Se implementa según el modelo existente.

---

## 26.2. La documentación es ambigua

La ambigüedad debe resolverse antes de consolidar la implementación.

No debe tomarse una decisión silenciosa que posteriormente se convierta accidentalmente en una regla del sistema.

---

## 26.3. Se requiere cambiar el modelo

Debe seguirse el proceso:

```text
PROPUESTA DE CAMBIO
        ↓
ANÁLISIS DE IMPACTO
        ↓
DECISIÓN
        ↓
ACTUALIZACIÓN DOCUMENTAL
        ↓
IMPLEMENTACIÓN
```

Los cambios estructurales relevantes deberán registrarse mediante el mecanismo de decisiones arquitectónicas correspondiente.

---

# 27. Relación con el monorepo

La implementación deberá respetar la estructura general del proyecto.

```text
App-Gestion-Empresarial-de-Yogurt/
│
├── apps/
│   │
│   ├── api/
│   │
│   └── desktop/
│
├── packages/
│   │
│   ├── contracts/
│   ├── shared/
│   └── config/
│
├── docs/
│
└── scripts/
```

La documentación no debe utilizarse como excusa para crear código ficticio dentro de:

```text
apps/
```

o:

```text
packages/
```

Cada elemento debe aparecer cuando exista una responsabilidad concreta para él.

---

# 28. Uso progresivo de packages

Los paquetes compartidos no deben llenarse anticipadamente.

Inicialmente:

```text
packages/contracts/
```

existirá para contratos realmente compartidos entre aplicaciones cuando aparezca esa necesidad.

```text
packages/shared/
```

contendrá únicamente código genuinamente compartido.

```text
packages/config/
```

centralizará configuraciones compartidas cuando corresponda.

No se debe mover código a un paquete compartido únicamente porque podría reutilizarse en el futuro.

La regla será:

```text
DOS O MÁS CONSUMIDORES REALES
        ↓
EVALUAR EXTRACCIÓN
```

No:

```text
PODRÍA REUTILIZARSE ALGÚN DÍA
        ↓
CREAR PAQUETE GENÉRICO
```

---

# 29. Orden de prioridad

La prioridad de implementación será:

```text
1. CORRECTITUD
```

```text
2. INTEGRIDAD
```

```text
3. TRAZABILIDAD
```

```text
4. CLARIDAD
```

```text
5. MANTENIBILIDAD
```

```text
6. EXPERIENCIA DEL CLIENTE
```

```text
7. OPTIMIZACIÓN
```

No se debe sacrificar la corrección del negocio por una optimización prematura.

---

# 30. Qué no representa este documento

Este documento no define todavía:

```text
el schema exacto de Prisma
```

```text
la estructura final de cada carpeta
```

```text
todos los endpoints
```

```text
todos los DTOs
```

```text
todas las clases
```

```text
todos los casos de uso concretos
```

```text
la implementación detallada de cada módulo
```

Estos elementos deben definirse progresivamente dentro del plan de implementación.

---

# 31. Resultado esperado

Al finalizar la etapa de planificación de implementación, el proyecto debe poder responder con claridad:

```text
¿QUÉ SE IMPLEMENTA PRIMERO?
```

```text
¿POR QUÉ?
```

```text
¿QUÉ DOCUMENTACIÓN RESPALDA ESA IMPLEMENTACIÓN?
```

```text
¿QUÉ MÓDULOS DEPENDEN DE OTROS?
```

```text
¿QUÉ ENTIDADES SE IMPLEMENTAN?
```

```text
¿QUÉ REGLAS DEBEN VALIDARSE?
```

```text
¿QUÉ OPERACIONES REQUIEREN TRANSACCIÓN?
```

```text
¿CUÁNDO UNA FUNCIONALIDAD ESTÁ TERMINADA?
```

La implementación debe poder avanzar sin depender constantemente de reinterpretar toda la arquitectura desde cero.

---

# 32. Principio operativo final

La regla de trabajo para esta etapa será:

```text
NO IMPLEMENTAR
LO QUE NO ESTÁ SUFICIENTEMENTE DEFINIDO
```

Cuando exista claridad:

```text
DOCUMENTACIÓN
        ↓
IMPLEMENTACIÓN
        ↓
VALIDACIÓN
```

Cuando exista una ambigüedad:

```text
DETENER
        ↓
ANALIZAR
        ↓
DECIDIR
        ↓
DOCUMENTAR
        ↓
CONTINUAR
```

El objetivo no es producir código rápidamente.

El objetivo es construir un sistema cuya implementación mantenga coherencia con el modelo de negocio, la estructura de datos y las decisiones técnicas ya aprobadas.

---

# 33. Estado actual

```text
Documento: 00-implementation-overview.md
Versión: V1
Estado: BASE PARA LA PLANIFICACIÓN DE LA IMPLEMENTACIÓN
```

Este documento establece el puente entre la documentación ya aprobada y el desarrollo real del sistema. A partir de este punto, las siguientes decisiones de implementación deberán traducir progresivamente el modelo documentado hacia código ejecutable, sin introducir cambios silenciosos en la lógica del negocio.
