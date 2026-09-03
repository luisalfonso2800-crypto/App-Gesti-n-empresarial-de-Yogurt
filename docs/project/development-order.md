````md
# Development Order — V1

## 1. Propósito

Este documento define la **secuencia operativa de desarrollo** del proyecto.

Su función es indicar qué bloque debe trabajarse primero, qué dependencias deben estar resueltas antes de avanzar y en qué punto se encuentra el desarrollo.

Este documento no redefine la arquitectura, el modelo de datos ni el orden oficial de los módulos.

La fuente oficial del orden técnico es:

```text
docs/implementation/03-module-implementation-order.md
````

Este archivo debe mantenerse sincronizado con dicha fuente.

---

# 2. Regla principal

El desarrollo seguirá una secuencia controlada:

```text
DOCUMENTACIÓN APROBADA
        ↓
PREPARAR INFRAESTRUCTURA
        ↓
IMPLEMENTAR BLOQUE
        ↓
PROBAR
        ↓
VALIDAR
        ↓
CERRAR BLOQUE
        ↓
CONTINUAR
```

No se debe comenzar un bloque que dependa de otro que todavía no esté validado.

---

# 3. Estado actual

```text
ESTADO DEL PROYECTO:
READY FOR IMPLEMENTATION

IMPLEMENTACIÓN REAL:
NO INICIADA

BLOQUE ACTUAL:
PREPARACIÓN DEL PROYECTO
```

---

# 4. Bloque 0 — Preparación del proyecto

**Estado: PENDIENTE**

Antes de implementar módulos de negocio se debe crear la base real del proyecto.

Orden:

```text
1. Crear repositorio
2. Inicializar proyecto
3. Configurar control de versiones
4. Definir estructura inicial
5. Configurar variables de entorno
6. Preparar documentación dentro del repositorio
```

Resultado esperado:

```text
REPOSITORIO FUNCIONAL
CON ESTRUCTURA BASE
```

Dependencias:

```text
DOCUMENTACIÓN APROBADA
```

---

# 5. Bloque 1 — Backend Bootstrap

**Estado: PENDIENTE**

Basado en:

```text
docs/implementation/01-backend-bootstrap.md
```

Objetivo:

```text
BACKEND NESTJS FUNCIONANDO
```

Incluye únicamente la infraestructura mínima necesaria:

* NestJS;
* JavaScript;
* configuración base;
* estructura inicial;
* manejo global de errores;
* configuración de entorno;
* componentes técnicos mínimos.

No incluye todavía:

* módulos completos de negocio;
* lógica de compras;
* inventario;
* producción;
* ventas.

Resultado esperado:

```text
BACKEND EJECUTABLE
Y ESTRUCTURALMENTE PREPARADO
```

---

# 6. Bloque 2 — Base de datos y Prisma

**Estado: PENDIENTE**

Basado en:

```text
docs/implementation/02-database-implementation-plan.md
docs/implementation/05-prisma-implementation-plan.md
```

Orden:

```text
1. Configurar PostgreSQL
2. Configurar Prisma
3. Construir schema.prisma
4. Revisar entidades
5. Revisar relaciones
6. Revisar restricciones
7. Generar primera migración
8. Validar estructura física
```

La fuente para el modelo será:

```text
docs/data-model/
```

Resultado esperado:

```text
BASE DE DATOS FUNCIONAL
CON MODELO FÍSICO VALIDADO
```

---

# 7. Bloque 3 — Componentes compartidos

**Estado: PENDIENTE**

Basado en:

```text
docs/implementation/04-shared-kernel-and-common-components.md
```

Antes de crear componentes compartidos debe comprobarse que realmente sean utilizados por más de un módulo.

Posibles componentes:

```text
common/
├── errors/
├── filters/
├── pagination/
├── validation/
└── types/
```

Regla:

```text
NO CREAR ABSTRACCIONES
SIN NECESIDAD REAL
```

Resultado esperado:

```text
BASE COMPARTIDA MÍNIMA
```

---

# 8. Bloque 4 — Implementación de módulos

Los módulos deben implementarse siguiendo el orden oficial definido en:

```text
docs/implementation/03-module-implementation-order.md
```

La secuencia general es:

```text
1. Presentaciones
2. Insumos
3. Proveedores
4. Precios de proveedores
5. Productos
6. Recetas
7. Compras
8. Inventario
9. Producción
10. Lotes
11. Clientes
12. Ventas
13. Pagos
14. Gastos
15. Costos
16. Rentabilidad
17. Dashboard
```

Si el documento oficial establece agrupaciones o dependencias más específicas, dicho documento tiene prioridad.

---

# 9. Ciclo obligatorio por módulo

Cada módulo debe seguir el mismo ciclo:

```text
1. Revisar documentación del dominio
        ↓
2. Revisar entidades y relaciones
        ↓
3. Revisar reglas de integridad
        ↓
4. Implementar persistencia
        ↓
5. Implementar lógica de negocio
        ↓
6. Implementar validación
        ↓
7. Implementar API
        ↓
8. Implementar pruebas
        ↓
9. Ejecutar pruebas
        ↓
10. Validar comportamiento
        ↓
11. Cerrar módulo
```

No se debe marcar un módulo como completado sin validación.

---

# 10. Orden interno de implementación

Dentro de cada módulo se seguirá, cuando aplique, esta secuencia:

```text
DTO / INPUT
        ↓
VALIDACIÓN
        ↓
CASO DE USO
        ↓
PERSISTENCIA
        ↓
CONTROLADOR / API
        ↓
PRUEBAS
```

La organización interna debe respetar los límites definidos en:

```text
docs/backend/01-module-boundaries.md
```

y:

```text
docs/backend/02-module-dependencies.md
```

---

# 11. Dependencias críticas

La implementación no debe ignorar dependencias reales.

Ejemplo conceptual:

```text
PRESENTACIONES
        ↓
PRODUCTOS
        ↓
RECETAS
        ↓
PRODUCCIÓN
        ↓
LOTES
        ↓
VENTAS
```

Otro flujo:

```text
INSUMOS
        ↓
PROVEEDORES
        ↓
PRECIOS DE PROVEEDORES
        ↓
COMPRAS
        ↓
INVENTARIO
        ↓
PRODUCCIÓN
```

Estas dependencias deben respetar siempre el modelo de datos aprobado.

---

# 12. Procesos integrados

Después de que existan los módulos necesarios, deben validarse los procesos completos.

Prioridad:

```text
COMPRA
        ↓
INVENTARIO
```

```text
PRODUCCIÓN
        ↓
CONSUMO DE INSUMOS
        ↓
PRODUCTO TERMINADO
        ↓
LOTE
```

```text
VENTA
        ↓
SALIDA DE INVENTARIO
```

Estos procesos deben tener pruebas de integración.

---

# 13. Implementación de cálculos

Los módulos:

```text
COSTOS
RENTABILIDAD
DASHBOARD
```

deben implementarse después de que existan las fuentes de información necesarias.

La secuencia será:

```text
OPERACIONES
        ↓
DATOS HISTÓRICOS
        ↓
CÁLCULOS
        ↓
CONSULTAS
        ↓
INDICADORES
```

No deben implementarse indicadores utilizando datos simulados como comportamiento definitivo.

---

# 14. Punto de control entre bloques

Al terminar cada bloque debe realizarse una revisión.

La pregunta es:

```text
¿EL BLOQUE TERMINADO
ESTÁ LISTO PARA SOPORTAR
EL SIGUIENTE?
```

La respuesta debe considerar:

* funcionamiento;
* integridad;
* pruebas;
* dependencias;
* documentación;
* errores conocidos.

Posibles estados:

```text
APPROVED
```

o:

```text
CORRECTIONS REQUIRED
```

No se debe avanzar si existe un problema que comprometa al siguiente bloque.

---

# 15. Reglas de cambio

Si durante la implementación aparece una contradicción:

```text
IMPLEMENTACIÓN
        ↓
DOCUMENTACIÓN CONTRADICTORIA
```

No se debe resolver silenciosamente.

El proceso será:

```text
DETECTAR
        ↓
DOCUMENTAR
        ↓
ANALIZAR
        ↓
DECIDIR
        ↓
ACTUALIZAR FUENTE OFICIAL
        ↓
IMPLEMENTAR
```

Nunca:

```text
CAMBIAR EL CÓDIGO
Y DEJAR LA DOCUMENTACIÓN ANTIGUA
```

---

# 16. Estado de avance

Este documento debe actualizarse durante el desarrollo.

| Bloque                   | Estado    |
| ------------------------ | --------- |
| Preparación del proyecto | PENDIENTE |
| Backend Bootstrap        | PENDIENTE |
| Base de datos y Prisma   | PENDIENTE |
| Componentes compartidos  | PENDIENTE |
| Presentaciones           | PENDIENTE |
| Insumos                  | PENDIENTE |
| Proveedores              | PENDIENTE |
| Precios de proveedores   | PENDIENTE |
| Productos                | PENDIENTE |
| Recetas                  | PENDIENTE |
| Compras                  | PENDIENTE |
| Inventario               | PENDIENTE |
| Producción               | PENDIENTE |
| Lotes                    | PENDIENTE |
| Clientes                 | PENDIENTE |
| Ventas                   | PENDIENTE |
| Pagos                    | PENDIENTE |
| Gastos                   | PENDIENTE |
| Costos                   | PENDIENTE |
| Rentabilidad             | PENDIENTE |
| Dashboard                | PENDIENTE |

Estados permitidos:

```text
PENDIENTE
EN PROGRESO
APPROVED
BLOQUEADO
CORRECTIONS REQUIRED
```

---

# 17. Próximo paso inmediato

El siguiente trabajo oficial es:

```text
BLOQUE 0
PREPARACIÓN DEL PROYECTO
```

La primera acción será:

```text
CREAR EL REPOSITORIO Y LA ESTRUCTURA REAL DEL PROYECTO
```

Después:

```text
BACKEND BOOTSTRAP
```

Luego:

```text
POSTGRESQL + PRISMA
```

Solo después comenzará la implementación de los módulos de negocio.

---

# 18. Estado del documento

```text
Documento:
docs/project/development-order.md

Versión:
V1

Estado:
ACTIVO

Función:
DEFINIR LA SECUENCIA OPERATIVA
DEL DESARROLLO

Fuente oficial del orden técnico:
docs/implementation/03-module-implementation-order.md

Estado actual:
READY FOR IMPLEMENTATION

Próximo bloque:
PREPARACIÓN DEL PROYECTO
```
