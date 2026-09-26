# Arquitectura del Backend — Visión General V1

## 1. Propósito del documento

Este documento define la visión general de la arquitectura del backend del sistema **App Gestión Empresarial de Yogurt**.

Su objetivo es establecer cómo el backend organizará e implementará la lógica del negocio ya definida en los documentos de dominio y en el modelo de datos.

Este documento no define todavía:

* endpoints específicos;
* DTOs concretos;
* esquema Prisma;
* tablas físicas de PostgreSQL;
* estructura interna detallada de cada módulo;
* implementación de servicios;
* código NestJS.

Esos elementos serán definidos en documentos posteriores.

La función de este documento es establecer el marco general sobre el cual se diseñarán los módulos técnicos del backend.

---

# 2. Posición del backend dentro del sistema

El sistema estará compuesto inicialmente por dos aplicaciones principales:

```text
apps/
├── api/
│   └── Backend
│
└── desktop/
    └── Cliente de escritorio
```

La comunicación general será:

```text
Usuario
   │
   ▼
Aplicación Desktop
   │
   │ HTTP / API
   ▼
Backend
   │
   ▼
PostgreSQL
```

El backend será la autoridad responsable de ejecutar y proteger la lógica del negocio.

El cliente de escritorio no será responsable de:

* garantizar integridad de datos;
* actualizar inventario directamente;
* calcular estados históricos oficiales;
* modificar datos protegidos;
* aplicar reglas críticas del negocio;
* coordinar operaciones entre módulos;
* decidir si una operación es válida.

El cliente podrá:

* solicitar operaciones;
* mostrar información;
* capturar datos;
* validar aspectos de experiencia de usuario;
* mostrar errores devueltos por el backend.

La decisión final sobre la validez de una operación pertenece al backend.

---

# 3. Responsabilidad general del backend

El backend será responsable de cinco áreas principales:

```text
1. Exponer operaciones del sistema
2. Ejecutar procesos de negocio
3. Proteger reglas e integridad
4. Coordinar módulos
5. Persistir y recuperar información
```

Conceptualmente:

```text
SOLICITUD
    │
    ▼
API
    │
    ▼
VALIDACIÓN
    │
    ▼
LÓGICA DE NEGOCIO
    │
    ├── Reglas
    ├── Procesos
    ├── Coordinación
    └── Cálculos
    │
    ▼
PERSISTENCIA
    │
    ▼
RESPUESTA
```

El backend no debe convertirse en una simple capa entre:

```text
HTTP
↓
Prisma
↓
PostgreSQL
```

Las operaciones que representen procesos del negocio deberán ejecutar la lógica definida en los documentos oficiales.

---

# 4. Fuente de verdad del backend

La implementación del backend deberá respetar la siguiente jerarquía documental:

```text
1. docs/domains/
        │
        └── Definición funcional del negocio

2. docs/data-model/
        │
        └── Modelo técnico y relaciones de información

3. docs/backend/
        │
        └── Diseño de implementación backend

4. Código implementado y pruebas
```

La documentación existente define el comportamiento esperado del sistema.

El backend no deberá introducir nuevas reglas de negocio sin que dichas reglas sean evaluadas y documentadas.

Si durante la implementación se detecta una contradicción:

```text
Implementación propuesta
        │
        ▼
¿Contradice documentación oficial?
        │
        ├── NO
        │   └── Puede continuar
        │
        └── SÍ
            │
            ▼
        No improvisar
            │
            ▼
        Revisar decisión
            │
            ▼
        Actualizar documentación
            │
            ▼
        Implementar decisión actualizada
```

---

# 5. Arquitectura modular

El backend será organizado por módulos de negocio.

La unidad principal de organización no será:

* una tabla;
* un controlador;
* un servicio;
* un tipo de entidad de base de datos.

La unidad principal será una **responsabilidad de negocio**.

La estructura conceptual será:

```text
apps/api/
└── src/
    │
    ├── config/
    │
    ├── common/
    │
    ├── database/
    │
    └── modules/
```

Dentro de `modules/` existirán los módulos definidos por el negocio.

La lista inicial será:

```text
modules/
├── auth/
├── users/
├── presentations/
├── supplies/
├── suppliers/
├── products/
├── recipes/
├── purchases/
├── inventory/
├── production/
├── lots/
├── clients/
├── sales/
├── payments/
├── expenses/
├── costs/
├── profitability/
└── dashboard/
```

La existencia de un módulo no implica que todos tengan la misma complejidad interna.

Cada módulo podrá evolucionar según su responsabilidad real.

---

# 6. Clasificación inicial de los módulos

Los módulos no deben tratarse todos como CRUD.

Inicialmente se identifican tres tipos principales.

## 6.1 Módulos maestros

Gestionan información base utilizada por otros procesos.

Incluyen inicialmente:

```text
presentations
supplies
suppliers
products
clients
users
```

Su responsabilidad principal será administrar información de referencia.

Esto no significa que necesariamente sean CRUD sin reglas.

Cada módulo podrá contener validaciones e invariantes propias.

---

## 6.2 Módulos de procesos de negocio

Representan operaciones que producen cambios relevantes en el sistema.

Incluyen:

```text
recipes
purchases
inventory
production
lots
sales
payments
expenses
```

Estos módulos pueden:

* validar estados;
* modificar información relacionada;
* generar movimientos;
* crear registros históricos;
* coordinar varias operaciones;
* requerir transacciones.

Estos módulos no deben diseñarse únicamente alrededor de operaciones CRUD genéricas.

---

## 6.3 Módulos de cálculo y consulta

Representan información derivada de otros módulos.

Incluyen:

```text
costs
profitability
dashboard
```

Estos módulos deberán respetar las responsabilidades de cálculo ya documentadas.

Su función principal será:

* consultar información;
* consolidar datos;
* calcular resultados;
* presentar indicadores.

Estos módulos no deberán convertirse en propietarios de información que corresponde a otros módulos.

Por ejemplo:

```text
Inventory
```

es responsable del estado y los movimientos de inventario.

```text
Costs
```

puede utilizar información relacionada con inventario, compras y producción para realizar cálculos, pero no debe apropiarse de la gestión del inventario.

---

# 7. Principio de propiedad de la información

Cada módulo será responsable de la información y operaciones que pertenecen a su dominio.

Conceptualmente:

```text
MÓDULO
   │
   ├── Información propia
   ├── Reglas propias
   ├── Operaciones propias
   └── Procesos bajo su responsabilidad
```

Un módulo no debe modificar directamente la información interna de otro módulo.

La interacción deberá respetar límites definidos.

Ejemplo conceptual:

```text
PURCHASES
    │
    │ Registra una compra
    ▼
INVENTORY
    │
    │ Registra movimiento de entrada
    ▼
Estado de inventario actualizado
```

No:

```text
PURCHASES
    │
    └── Modifica directamente
        la persistencia interna
        de INVENTORY
```

La forma técnica concreta de esta comunicación será definida posteriormente.

Podrá ser:

* llamada directa a una responsabilidad pública del módulo;
* coordinación mediante un servicio de aplicación;
* evento interno;
* otro mecanismo permitido por la arquitectura.

El mecanismo se elegirá según la necesidad real y no por anticipación.

---

# 8. Separación entre módulos y tablas

La arquitectura del backend no estará definida como una copia directa del modelo relacional.

La siguiente equivalencia no es válida:

```text
Una tabla
=
Un módulo
```

Existen estructuras de información que pertenecen al mismo proceso de negocio.

Ejemplos conceptuales:

```text
Compra
├── Encabezado
└── Detalles
```

pertenecen al módulo:

```text
purchases
```

De igual forma:

```text
Venta
├── Encabezado
└── Detalles
```

pertenecen al módulo:

```text
sales
```

Y:

```text
Producción
├── Encabezado
└── Detalles
```

pertenecen al módulo:

```text
production
```

La división modular se realizará según responsabilidad de negocio y no según el número de entidades o tablas involucradas.

---

# 9. Responsabilidades transversales

Algunas responsabilidades no pertenecen exclusivamente a un módulo de negocio.

Estas deberán ubicarse fuera de los módulos cuando sean realmente transversales.

La estructura conceptual inicial será:

```text
src/
├── config/
│
├── common/
│   ├── decorators/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── types/
│
├── database/
│
└── modules/
```

Estas áreas tendrán responsabilidades específicas.

## `config/`

Responsable de configuración técnica de la aplicación.

Ejemplos:

* variables de entorno;
* configuración de aplicación;
* configuración de conexiones;
* configuración técnica de servicios externos.

No contendrá reglas del negocio.

---

## `common/`

Contendrá elementos realmente transversales.

Ejemplos posibles:

* excepciones comunes;
* filtros HTTP;
* decoradores;
* guards;
* interceptores;
* pipes;
* tipos transversales.

No deberá utilizarse como carpeta genérica para código que no tiene ubicación clara.

La regla será:

> Si una responsabilidad no tiene un módulo claro, primero debe determinarse si realmente es transversal. No debe enviarse automáticamente a `common/`.

---

## `database/`

Contendrá responsabilidades relacionadas con la infraestructura de persistencia.

Inicialmente incluirá la integración técnica con la base de datos y Prisma.

No será responsable de implementar reglas del negocio.

---

# 10. Flujo conceptual de una operación

Una operación típica seguirá conceptualmente el siguiente flujo:

```text
CLIENTE
   │
   ▼
HTTP
   │
   ▼
CONTROLLER
   │
   ▼
VALIDACIÓN DE ENTRADA
   │
   ▼
RESPONSABILIDAD DE APLICACIÓN
   │
   ├── Verificar reglas
   ├── Consultar información necesaria
   ├── Ejecutar proceso
   ├── Coordinar módulos si corresponde
   └── Persistir resultado
   │
   ▼
RESPUESTA
```

La estructura física exacta de cada módulo será definida progresivamente según las reglas establecidas en:

```text
docs/architecture/architecture-evolution.md
```

No todos los módulos deberán tener las mismas capas.

---

# 11. Separación de responsabilidades

Como regla general:

```text
Controller
    │
    └── Transporte HTTP
```

```text
Application / Service
    │
    └── Ejecución y coordinación de casos de uso
```

```text
Domain
    │
    └── Reglas y comportamiento de negocio
    cuando su complejidad lo justifique
```

```text
Repository / Persistence
    │
    └── Acceso y persistencia de información
```

```text
Infrastructure
    │
    └── Integraciones y detalles técnicos
```

La aparición física de estas responsabilidades dependerá de los criterios definidos en la arquitectura evolutiva.

No se crearán automáticamente todas las capas para todos los módulos.

---

# 12. Backend como autoridad de integridad

Las reglas críticas deberán ejecutarse en el backend.

Esto incluye, según corresponda:

* validación de relaciones;
* validación de estados;
* control de operaciones permitidas;
* protección de registros históricos;
* aplicación de reglas de inventario;
* control de trazabilidad;
* coordinación de procesos;
* validación de datos de negocio.

La interfaz de usuario podrá realizar validaciones adicionales para mejorar la experiencia, pero dichas validaciones no sustituyen las validaciones oficiales del backend.

La regla será:

```text
Validación de interfaz
        │
        └── Mejora experiencia

Validación backend
        │
        └── Protege el sistema
```

---

# 13. Procesos que requieren coordinación entre módulos

Existen procesos donde una operación puede afectar más de un dominio.

Ejemplos identificados en la lógica actual:

```text
COMPRA
    │
    ├── Registra compra
    └── Genera entrada de inventario
```

```text
PRODUCCIÓN
    │
    ├── Utiliza receta
    ├── Consume insumos
    ├── Registra movimientos de inventario
    ├── Genera producción
    └── Genera lote
```

```text
VENTA
    │
    ├── Registra venta
    ├── Registra detalle
    ├── Afecta inventario
    └── Puede generar saldo pendiente
```

```text
PAGO
    │
    └── Actualiza la situación financiera
        asociada a una venta
```

La implementación de estos procesos deberá preservar los límites de cada módulo.

No se permitirá resolver la coordinación simplemente mediante acceso directo indiscriminado a repositorios o tablas de otros módulos.

Los mecanismos concretos de coordinación serán definidos en:

```text
01-module-boundaries.md
02-module-dependencies.md
05-transaction-boundaries.md
```

---

# 14. Persistencia y reglas de negocio

La persistencia será una responsabilidad técnica separada de la lógica de negocio.

El objetivo es evitar que las reglas queden distribuidas accidentalmente entre:

```text
Controller
Prisma
Frontend
Base de datos
```

Las reglas deberán tener una ubicación clara según su naturaleza.

Conceptualmente:

```text
REGLA DE INTERFAZ
    ↓
Frontend

REGLA DE ENTRADA HTTP
    ↓
DTO / Validation Layer

REGLA DE CASO DE USO
    ↓
Application

REGLA DE NEGOCIO PURA
    ↓
Domain cuando corresponda

REGLA DE INTEGRIDAD RELACIONAL
    ↓
Backend + Base de datos
```

Una misma regla no debe duplicarse innecesariamente.

---

# 15. Uso de Prisma

Prisma será utilizado como tecnología de persistencia.

Su responsabilidad será facilitar:

* acceso a PostgreSQL;
* consultas;
* creación de registros;
* actualización;
* eliminación controlada cuando corresponda;
* transacciones;
* definición técnica del esquema.

Prisma no definirá por sí mismo la arquitectura del negocio.

La siguiente estructura no será aceptada como arquitectura general:

```text
Controller
    ↓
Prisma
```

La lógica deberá mantener una responsabilidad intermedia encargada del caso de uso o proceso correspondiente.

La estructura exacta de la capa de persistencia será definida posteriormente.

---

# 16. Uso de transacciones

Las operaciones que modifiquen varias piezas de información relacionadas deberán evaluarse como unidades transaccionales.

Ejemplo conceptual:

```text
Ejecutar producción
        │
        ├── Registrar producción
        ├── Registrar consumo
        ├── Registrar movimientos
        └── Crear lote
```

No debe quedar un estado donde:

```text
Producción creada
        ✔

Inventario descontado
        ✘

Lote creado
        ✔
```

cuando todas esas operaciones formen parte de una misma unidad de negocio.

Los límites exactos de las transacciones serán definidos posteriormente.

---

# 17. Historial y trazabilidad

El backend deberá respetar las reglas documentadas en:

```text
docs/data-model/04-history-and-traceability.md
```

Esto implica que determinadas operaciones no podrán tratarse como simples modificaciones o eliminaciones de datos.

Cuando la información represente un hecho histórico del negocio, deberá preservarse según las reglas oficiales.

Ejemplos conceptuales:

```text
Compra registrada
```

```text
Movimiento de inventario
```

```text
Producción ejecutada
```

```text
Lote generado
```

```text
Venta registrada
```

```text
Pago registrado
```

La estrategia técnica específica para correcciones, anulaciones y reversión de operaciones será definida en los documentos correspondientes.

---

# 18. Evolución de los módulos

Los módulos no deberán evolucionar por copia.

No se debe asumir:

```text
Si production tiene domain/
entonces presentations también debe tener domain/
```

Cada módulo evolucionará según su complejidad.

Ejemplo:

```text
presentations/
```

puede comenzar con una estructura relativamente simple.

Mientras que:

```text
production/
```

puede requerir una separación mayor debido a:

* procesos;
* reglas;
* coordinación;
* transacciones;
* trazabilidad;
* cálculos.

La evolución deberá seguir las reglas definidas en:

```text
docs/architecture/architecture-evolution.md
```

---

# 19. Dependencias internas

La dirección conceptual permitida será:

```text
HTTP / PRESENTATION
        ↓
APPLICATION
        ↓
DOMAIN
```

La infraestructura proporcionará detalles técnicos necesarios para la ejecución.

Conceptualmente:

```text
                 ┌─────────────────┐
                 │   CONTROLLER    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   APPLICATION   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     DOMAIN      │
                 └─────────────────┘
                          ▲
                          │
                 ┌────────┴────────┐
                 │ INFRASTRUCTURE  │
                 └─────────────────┘
```

Esta representación es conceptual.

La estructura física solo se aplicará cuando la complejidad del módulo lo justifique.

Las reglas detalladas serán definidas en:

```text
docs/backend/02-module-dependencies.md
```

---

# 20. Prohibiciones arquitectónicas iniciales

No se permitirá:

```text
Controller
    ↓
Prisma directamente
```

para implementar procesos de negocio.

No se permitirá:

```text
Módulo A
    ↓
Modificar directamente
Repositorio interno de Módulo B
```

sin una responsabilidad pública definida.

No se permitirá utilizar:

```text
common/
shared/
utils/
```

como ubicaciones genéricas para código sin clasificación.

No se crearán:

```text
domain/
application/
events/
value-objects/
factories/
strategies/
```

únicamente para anticipar una posible necesidad futura.

No se crearán módulos simplemente porque existe una tabla.

No se moverá código a un paquete compartido únicamente porque podría reutilizarse en el futuro.

No se introducirán reglas de negocio nuevas durante la implementación sin revisar su impacto documental.

---

# 21. Relación con el frontend

El backend no deberá depender de la aplicación Desktop.

La dependencia permitida será:

```text
Desktop
    │
    ▼
API
```

Nunca:

```text
API
    │
    ▼
Desktop
```

Los contratos de comunicación entre aplicaciones serán definidos progresivamente.

Cuando exista una necesidad real de compartir contratos técnicos, se evaluará su incorporación en:

```text
packages/contracts/
```

No se crearán contratos completos anticipadamente sin operaciones reales que los requieran.

---

# 22. Principio de implementación progresiva

La implementación seguirá esta secuencia general:

```text
DOCUMENTACIÓN
        ↓
DISEÑO TÉCNICO
        ↓
REVISIÓN
        ↓
DECISIÓN DOCUMENTADA
        ↓
IMPLEMENTACIÓN
        ↓
PRUEBAS
        ↓
ACTUALIZACIÓN DOCUMENTAL SI ES NECESARIO
```

No se implementará una capa completa únicamente porque existe en un diagrama.

Cada responsabilidad deberá existir porque cumple una función concreta.

---

# 23. Estado actual

Actualmente el backend se encuentra en la fase de:

```text
DISEÑO TÉCNICO
```

La lógica del negocio y el modelo de datos han sido documentados previamente.

La implementación del backend todavía no ha comenzado.

No se han definido todavía:

* módulos NestJS físicos;
* endpoints;
* DTOs;
* servicios;
* repositorios;
* esquema Prisma;
* migraciones;
* base de datos;
* autenticación implementada;
* integración con el cliente Desktop.

Los siguientes documentos deberán convertir esta visión general en reglas técnicas implementables.

---

# 24. Próximos documentos

El diseño backend continuará en el siguiente orden:

```text
01-module-boundaries.md
        ↓
02-module-dependencies.md
        ↓
03-api-design.md
        ↓
04-persistence-boundaries.md
        ↓
05-transaction-boundaries.md
        ↓
06-error-handling.md
        ↓
07-validation-strategy.md
        ↓
08-backend-decisions.md
```

---

# 25. Estado del documento

```text
Documento: 00-backend-overview.md
Estado: APROBADO PARA CONTINUAR CON EL DISEÑO BACKEND
Versión: V1
```

Este documento establece la visión general del backend y servirá como base para definir los límites, dependencias y responsabilidades técnicas de cada módulo.
