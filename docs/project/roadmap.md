````md
# Project Roadmap — V1

## 1. Propósito

Este documento funciona como la hoja de ruta general del proyecto.

Su función es permitir conocer:

- qué etapa del proyecto se está ejecutando;
- qué etapas ya fueron completadas;
- qué sigue después;
- cuál es el estado general del sistema.

Este documento **no define el orden técnico de implementación de los módulos**.

La fuente oficial para ese orden es:

```text
docs/implementation/03-module-implementation-order.md
````

Por tanto, este roadmap debe mantenerse sincronizado con dicho documento.

---

# 2. Fuente de verdad

La jerarquía documental del proyecto es:

```text
DOCUMENTACIÓN DE DOMINIO
        ↓
MODELO DE DATOS
        ↓
ARQUITECTURA BACKEND
        ↓
PLAN DE IMPLEMENTACIÓN
        ↓
IMPLEMENTACIÓN REAL
```

El orden oficial de implementación se encuentra en:

```text
docs/implementation/03-module-implementation-order.md
```

Este documento únicamente proporciona una visión general del avance.

No debe introducir:

* módulos nuevos;
* entidades nuevas;
* relaciones nuevas;
* cambios arquitectónicos;
* un orden de implementación diferente.

---

# 3. Estado general del proyecto

## Etapa 1 — Documentación de dominio

**Estado: COMPLETADA**

Documentos definidos:

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

Resultado:

```text
DOMINIO DOCUMENTADO
```

---

## Etapa 2 — Modelo de datos

**Estado: COMPLETADA Y VALIDADA**

Documentación:

```text
docs/data-model/
├── 00-data-model-overview.md
├── 01-entities.md
├── 02-relationships.md
├── 03-data-integrity-rules.md
├── 04-history-and-traceability.md
├── 05-data-model-decisions.md
├── 06-inventory-flow.md
├── 07-business-processes.md
├── 08-cross-module-rules.md
├── 09-calculation-responsibilities.md
├── 10-technical-implementation-notes.md
├── 11-model-validation.md
└── 12-vba-fidelity-validation.md
```

Resultado:

```text
MODELO DE DATOS DEFINIDO
Y VALIDADO CONTRA EL MODELO MAESTRO VBA
```

---

## Etapa 3 — Arquitectura backend

**Estado: COMPLETADA**

Documentación:

```text
docs/backend/
├── 00-backend-overview.md
├── 01-module-boundaries.md
├── 02-module-dependencies.md
├── 03-api-design.md
├── 04-persistence-boundaries.md
├── 05-transaction-boundaries.md
├── 06-error-handling.md
├── 07-validation-strategy.md
└── 08-backend-decisions.md
```

Resultado:

```text
ARQUITECTURA BACKEND DEFINIDA
```

---

## Etapa 4 — Plan de implementación

**Estado: COMPLETADA**

Documentación:

```text
docs/implementation/
├── 00-implementation-overview.md
├── 01-backend-bootstrap.md
├── 02-database-implementation-plan.md
├── 03-module-implementation-order.md
├── 04-shared-kernel-and-common-components.md
├── 05-prisma-implementation-plan.md
├── 06-api-implementation-plan.md
└── 07-testing-implementation-plan.md
```

Resultado:

```text
PLAN DE IMPLEMENTACIÓN DEFINIDO
```

---

## Etapa 5 — Revisión final de preparación

**Estado: COMPLETADA**

Se realizó una revisión cruzada de:

```text
DOMINIO
        ↓
MODELO DE DATOS
        ↓
BACKEND
        ↓
PLAN DE IMPLEMENTACIÓN
```

Resultado final:

```text
READY FOR IMPLEMENTATION
```

No existen bloqueadores identificados para iniciar la implementación.

Las precisiones pendientes identificadas corresponden a decisiones que deberán resolverse en la fase técnica correspondiente, sin impedir el inicio del proyecto.

---

# 4. Próxima etapa

## Etapa 6 — Creación del proyecto real

**Estado: PENDIENTE**

Objetivo:

```text
CREAR LA BASE REAL DEL PROYECTO
```

Incluye:

* creación del repositorio;
* estructura inicial;
* configuración base;
* preparación del backend;
* preparación de documentación dentro del proyecto;
* control de versiones.

Resultado esperado:

```text
PROYECTO BASE CREADO
```

---

# 5. Bootstrap del backend

## Etapa 7 — Backend Bootstrap

**Estado: PENDIENTE**

Basado en:

```text
docs/implementation/01-backend-bootstrap.md
```

Objetivo:

```text
NESTJS FUNCIONANDO
CON UNA BASE TÉCNICA ESTABLE
```

Incluye:

* configuración inicial;
* estructura base;
* configuración;
* manejo inicial de errores;
* componentes comunes necesarios;
* entorno de desarrollo.

Resultado esperado:

```text
BACKEND FUNCIONAL
SIN MÓDULOS DE NEGOCIO IMPLEMENTADOS TODAVÍA
```

---

# 6. Base de datos

## Etapa 8 — Implementación del modelo físico

**Estado: PENDIENTE**

Basado en:

```text
docs/implementation/02-database-implementation-plan.md
docs/implementation/05-prisma-implementation-plan.md
```

Proceso:

```text
MODELO DOCUMENTADO
        ↓
PRISMA SCHEMA
        ↓
REVISIÓN
        ↓
MIGRACIONES
        ↓
POSTGRESQL
```

Resultado esperado:

```text
MODELO FÍSICO IMPLEMENTADO
Y VALIDADO
```

---

# 7. Implementación de módulos

Una vez completada la base técnica y el modelo físico, comenzará la implementación incremental de los módulos.

El orden exacto será siempre el definido en:

```text
docs/implementation/03-module-implementation-order.md
```

La implementación seguirá la lógica:

```text
DEPENDENCIAS BASE
        ↓
MÓDULOS MAESTROS
        ↓
CONFIGURACIÓN DE PRODUCTOS
        ↓
RECETAS
        ↓
COMPRAS
        ↓
INVENTARIO
        ↓
PRODUCCIÓN
        ↓
LOTES
        ↓
CLIENTES
        ↓
VENTAS
        ↓
PAGOS
        ↓
GASTOS
        ↓
COSTOS
        ↓
RENTABILIDAD
        ↓
DASHBOARD
```

Este resumen no reemplaza el orden oficial detallado.

---

# 8. Ciclo de desarrollo por módulo

Cada módulo seguirá el ciclo definido en el plan de implementación:

```text
DOCUMENTACIÓN
        ↓
IMPLEMENTACIÓN
        ↓
PRUEBAS UNITARIAS
        ↓
PRUEBAS DE INTEGRACIÓN
        ↓
VALIDACIÓN DE API
        ↓
CORRECCIÓN
        ↓
VALIDACIÓN FINAL
        ↓
SIGUIENTE MÓDULO
```

Un módulo no se considerará terminado simplemente porque compile o porque un endpoint responda.

Debe respetar:

* reglas de dominio;
* modelo de datos;
* integridad;
* transacciones;
* contratos de API;
* pruebas correspondientes.

---

# 9. Estado actual

```text
DOCUMENTACIÓN DE DOMINIO:
COMPLETADA

MODELO DE DATOS:
COMPLETADO Y VALIDADO

ARQUITECTURA BACKEND:
COMPLETADA

PLAN DE IMPLEMENTACIÓN:
COMPLETADO

IMPLEMENTATION READINESS REVIEW:
APROBADO

ESTADO DEL PROYECTO:
READY FOR IMPLEMENTATION

SIGUIENTE FASE:
CREACIÓN DEL PROYECTO REAL
```

---

# 10. Regla de mantenimiento

Este documento debe actualizarse únicamente para reflejar el avance real del proyecto.

No debe convertirse en una segunda fuente de decisiones técnicas.

La jerarquía es:

```text
DOCUMENTOS DE DOMINIO
        ↓
MODELO DE DATOS
        ↓
DOCUMENTACIÓN BACKEND
        ↓
DOCUMENTACIÓN DE IMPLEMENTACIÓN
        ↓
ROADMAP
        ↓
ESTADO Y AVANCE DEL PROYECTO
```

El orden oficial de implementación permanece definido en:

```text
docs/implementation/03-module-implementation-order.md
```

---

# 11. Próximo hito

```text
CREAR EL PROYECTO REAL
        ↓
BOOTSTRAP DEL BACKEND
        ↓
CONFIGURAR POSTGRESQL
        ↓
IMPLEMENTAR PRISMA
        ↓
CREAR PRIMERA MIGRACIÓN
        ↓
COMENZAR IMPLEMENTACIÓN INCREMENTAL
DE LOS MÓDULOS
```

---

## Estado del documento

```text
Documento:
docs/project/roadmap.md

Versión:
V1

Estado:
ACTIVO

Función:
SEGUIMIENTO GENERAL DEL AVANCE DEL PROYECTO

Fuente oficial del orden técnico:
docs/implementation/03-module-implementation-order.md

Estado actual del proyecto:
READY FOR IMPLEMENTATION
```
