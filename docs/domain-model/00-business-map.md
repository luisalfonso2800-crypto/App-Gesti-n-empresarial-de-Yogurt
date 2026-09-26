
# MAPA DEL NEGOCIO — SISTEMA DE GESTIÓN EMPRESARIAL DE YOGURT

## 1. Propósito

Este documento define el mapa general del negocio que administra el Sistema de Gestión Empresarial de Yogurt.

Su objetivo es identificar los dominios funcionales del sistema, sus responsabilidades principales y las relaciones generales entre ellos.

Este documento funciona como punto de referencia para la reconstrucción progresiva de la lógica del sistema previamente desarrollada en VBA.

No define todavía:

- La arquitectura técnica de implementación.
- El modelo físico de PostgreSQL.
- Tablas definitivas.
- Endpoints.
- DTOs.
- Componentes React.
- Módulos de NestJS.
- Servicios.
- Repositorios.
- Interfaces.
- Detalles internos de implementación.

La información detallada de cada dominio será definida en su respectivo documento dentro de:

```text
docs/domains/
````

---

# 2. Visión general del sistema

El sistema tiene como propósito administrar las principales operaciones de una empresa dedicada a la producción y comercialización de yogurt.

El negocio se divide conceptualmente en tres grandes áreas:

```text
MAESTROS
    ↓
OPERACIONES
    ↓
ANÁLISIS Y CONTROL
```

Los datos maestros proporcionan la información base necesaria para realizar las operaciones.

Las operaciones generan movimientos y registros históricos del negocio.

Los módulos de análisis utilizan la información generada por las operaciones para calcular costos, rentabilidad e indicadores generales.

---

# 3. Mapa general del negocio

```text
SISTEMA DE GESTIÓN EMPRESARIAL DE YOGURT
│
├── MAESTROS
│   │
│   ├── Presentaciones
│   ├── Insumos
│   ├── Proveedores
│   ├── Productos
│   └── Clientes
│
├── OPERACIONES
│   │
│   ├── Recetas
│   ├── Compras
│   ├── Inventario
│   ├── Producción
│   ├── Lotes
│   ├── Ventas
│   ├── Pagos
│   └── Gastos
│
└── ANÁLISIS Y CONTROL
    │
    ├── Costos
    ├── Rentabilidad
    └── Dashboard
```

Este mapa representa la organización funcional inicial del sistema.

Cada dominio será documentado y validado individualmente antes de considerarse definitivo.

---

# 4. Área de Maestros

Los módulos maestros administran información base utilizada por otros procesos del sistema.

Los registros maestros no representan, por sí mismos, operaciones del negocio.

Su función es proporcionar información estructurada y reutilizable para compras, producción, ventas y otros procesos.

Los dominios maestros identificados inicialmente son:

```text
MAESTROS
│
├── Presentaciones
├── Insumos
├── Proveedores
├── Productos
└── Clientes
```

---

## 4.1 Presentaciones

Administra las presentaciones comerciales disponibles para los productos.

Ejemplos conceptuales:

* Tamaño o capacidad.
* Cantidad en onzas.
* Cantidad en mililitros.
* Tipo de envase.
* Estado de disponibilidad.

Relación principal identificada:

```text
PRESENTACIONES
      │
      ▼
   PRODUCTOS
```

El detalle de sus reglas será definido en:

```text
docs/domains/presentations.md
```

---

## 4.2 Insumos

Administra los materiales, ingredientes y demás recursos utilizados por la operación.

Los insumos pueden participar en procesos como:

```text
INSUMOS
│
├── Recetas
├── Compras
├── Inventario
└── Producción
```

El detalle de sus reglas será definido en:

```text
docs/domains/supplies.md
```

---

## 4.3 Proveedores

Administra la información de los proveedores relacionados con la adquisición de insumos y otros recursos necesarios para el negocio.

Relaciones generales identificadas:

```text
PROVEEDORES
      │
      ▼
    COMPRAS
      │
      ▼
    INSUMOS
```

La relación exacta entre proveedores, precios e insumos será reconstruida y documentada posteriormente.

El detalle del dominio será definido en:

```text
docs/domains/suppliers.md
```

---

## 4.4 Productos

Administra los productos comercializados o producidos por la empresa.

Los productos se relacionan conceptualmente con:

```text
PRESENTACIONES
      │
      ▼
   PRODUCTOS
      │
      ├── Recetas
      ├── Producción
      ├── Lotes
      ├── Inventario
      └── Ventas
```

El detalle de sus reglas será definido en:

```text
docs/domains/products.md
```

---

## 4.5 Clientes

Administra la información de los clientes relacionados con las ventas y pagos.

Relación general:

```text
CLIENTES
    │
    ├── Ventas
    └── Pagos
```

El detalle del dominio será definido en:

```text
docs/domains/clients.md
```

---

# 5. Área de Operaciones

Los módulos operativos registran los procesos reales que ocurren dentro del negocio.

A diferencia de los maestros, estas operaciones pueden generar:

* Movimientos.
* Registros históricos.
* Cambios de inventario.
* Costos.
* Lotes.
* Obligaciones de pago.
* Ingresos.
* Información para análisis posterior.

Los dominios operativos identificados inicialmente son:

```text
OPERACIONES
│
├── Recetas
├── Compras
├── Inventario
├── Producción
├── Lotes
├── Ventas
├── Pagos
└── Gastos
```

---

# 6. Recetas

Las recetas representan la definición de los insumos necesarios para elaborar un producto.

Relación conceptual:

```text
PRODUCTOS
     │
     ▼
   RECETAS
     │
     ▼
   INSUMOS
```

La receta actúa como un punto de conexión entre el producto que se desea elaborar y los insumos requeridos para su producción.

El detalle del dominio será definido en:

```text
docs/domains/recipes.md
```

---

# 7. Compras

El módulo de compras registra la adquisición de insumos y otros recursos.

La estructura conceptual inicial es:

```text
PROVEEDOR
    │
    ▼
  COMPRA
    │
    ├── DETALLES DE COMPRA
    │          │
    │          ▼
    │       INSUMOS
    │
    └──────────────► INVENTARIO
```

Una compra puede estar compuesta por múltiples elementos adquiridos.

El detalle del dominio será definido en:

```text
docs/domains/purchases.md
```

---

# 8. Inventario

El inventario representa el control de existencias dentro del sistema.

Recibe información de diferentes procesos del negocio.

Conceptualmente:

```text
COMPRAS
    │
    ▼
INVENTARIO
    ▲
    │
PRODUCCIÓN
    │
    ▼
VENTAS
```

La lógica exacta de entradas, salidas, ajustes y movimientos debe ser reconstruida y validada.

Existe además un concepto separado de movimientos de inventario que deberá determinarse como parte del dominio de Inventario y no necesariamente como un dominio independiente.

El detalle será definido en:

```text
docs/domains/inventory.md
```

---

# 9. Producción

El módulo de producción representa el proceso mediante el cual los insumos y recetas se utilizan para obtener productos terminados.

Relación conceptual:

```text
RECETA
   │
   ▼
PRODUCCIÓN
   │
   ├── Consume insumos
   │
   ▼
PRODUCTO TERMINADO
   │
   ▼
LOTE
   │
   ▼
INVENTARIO
```

La lógica específica del proceso será reconstruida posteriormente.

El detalle será definido en:

```text
docs/domains/production.md
```

---

# 10. Lotes

Los lotes permiten identificar unidades o grupos de producción.

Están relacionados principalmente con:

```text
PRODUCCIÓN
     │
     ▼
    LOTES
     │
     ├── Inventario
     └── Ventas
```

La estructura exacta del lote, sus estados y su relación con fechas y disponibilidad deberán ser confirmadas durante la reconstrucción del dominio.

El detalle será definido en:

```text
docs/domains/lots.md
```

---

# 11. Ventas

El módulo de ventas registra la comercialización de productos.

Relación conceptual:

```text
CLIENTE
    │
    ▼
  VENTA
    │
    ├── DETALLE DE VENTA
    │          │
    │          ▼
    │       PRODUCTOS
    │
    ├──────────────► INVENTARIO
    │
    └──────────────► PAGOS
```

Una venta puede contener uno o varios productos.

El detalle del dominio será definido en:

```text
docs/domains/sales.md
```

---

# 12. Pagos

El módulo de pagos administra los pagos relacionados con las ventas y clientes.

Relación conceptual inicial:

```text
CLIENTE
    │
    ▼
  VENTA
    │
    ▼
  PAGOS
```

Las reglas exactas sobre pagos parciales, saldos, estados y formas de pago deberán ser confirmadas durante la reconstrucción del dominio.

El detalle será definido en:

```text
docs/domains/payments.md
```

---

# 13. Gastos

El módulo de gastos registra egresos que afectan la operación o la rentabilidad del negocio.

Conceptualmente:

```text
GASTOS
   │
   ▼
ANÁLISIS FINANCIERO
   │
   ├── Costos
   └── Rentabilidad
```

La clasificación y tratamiento exacto de los gastos será definida durante la reconstrucción del dominio.

El detalle será definido en:

```text
docs/domains/expenses.md
```

---

# 14. Costos

El dominio de costos analiza y determina los costos relacionados con la operación del negocio.

Puede utilizar información proveniente de:

```text
INSUMOS
    │
COMPRAS
    │
RECETAS
    │
PRODUCCIÓN
    │
GASTOS
    │
    ▼
  COSTOS
```

La metodología exacta para calcular costos todavía debe ser reconstruida y validada.

El detalle será definido en:

```text
docs/domains/costs.md
```

---

# 15. Rentabilidad

El dominio de rentabilidad analiza la relación entre ingresos, costos y gastos.

Conceptualmente:

```text
VENTAS
   │
   ▼
INGRESOS
   │
   ├─────────────┐
   │             │
   ▼             ▼
COSTOS        GASTOS
   │             │
   └──────┬──────┘
          │
          ▼
    RENTABILIDAD
```

Las fórmulas y reglas definitivas serán reconstruidas posteriormente.

El detalle será definido en:

```text
docs/domains/profitability.md
```

---

# 16. Dashboard

El Dashboard no representa un proceso operativo independiente.

Su responsabilidad es presentar información consolidada del sistema.

Puede consumir información proveniente de:

```text
COMPRAS
PRODUCCIÓN
INVENTARIO
VENTAS
PAGOS
GASTOS
COSTOS
RENTABILIDAD
```

El Dashboard no debe convertirse en propietario de las reglas de negocio de los demás dominios.

Su función principal será consultar, consolidar y presentar indicadores.

El detalle será definido en:

```text
docs/domains/dashboard.md
```

---

# 17. Flujo general del negocio

El flujo conceptual principal identificado hasta este momento es:

```text
MAESTROS
│
├── Presentaciones
├── Insumos
├── Proveedores
├── Productos
└── Clientes
        │
        ▼
    OPERACIONES
        │
        ├── Recetas
        │       │
        │       ▼
        │    Producción
        │       │
        │       ▼
        │     Lotes
        │
        ├── Compras
        │       │
        │       ▼
        │   Inventario
        │
        └── Ventas
                │
                ├── Inventario
                │
                └── Pagos
                        │
                        ▼
                ANÁLISIS Y CONTROL
                        │
                        ├── Costos
                        ├── Rentabilidad
                        └── Dashboard
```

Este flujo es una representación conceptual.

No debe interpretarse todavía como un modelo definitivo de dependencias técnicas ni como un diagrama de base de datos.

---

# 18. Principio de responsabilidad por dominio

Cada dominio debe tener una responsabilidad clara.

La existencia de una tabla histórica en el sistema anterior no implica automáticamente que deba existir un módulo independiente en la nueva aplicación.

Por ejemplo:

```text
DETALLE_COMPRA
```

puede formar parte del dominio:

```text
COMPRAS
```

y:

```text
DETALLE_VENTA
```

puede formar parte del dominio:

```text
VENTAS
```

De la misma manera:

```text
MOVIMIENTOS_INVENTARIO
```

forma parte conceptualmente del dominio:

```text
INVENTARIO
```

Los límites definitivos de cada dominio serán confirmados durante la documentación individual.

---

# 19. Estado actual del mapa

Estado del documento:

```text
EN RECONSTRUCCIÓN
```

Este documento representa el mapa inicial obtenido a partir de la estructura conocida del sistema anterior.

Las relaciones, reglas y responsabilidades detalladas todavía deben ser verificadas módulo por módulo.

Ninguna decisión técnica debe derivarse exclusivamente de este documento sin consultar la documentación específica del dominio correspondiente.

---

# 20. Próximo paso

El proceso oficial de reconstrucción continuará documentando los dominios en el siguiente orden:

```text
1. Presentaciones
2. Insumos
3. Proveedores
4. Productos
5. Clientes

6. Recetas
7. Compras
8. Inventario
9. Producción
10. Lotes
11. Ventas
12. Pagos
13. Gastos

14. Costos
15. Rentabilidad
16. Dashboard
```

Cada dominio será analizado utilizando la fuente VBA como referencia histórica.

El resultado de cada análisis deberá quedar documentado en su archivo correspondiente antes de avanzar al siguiente dominio.

---

# 21. Regla de actualización

Cuando durante la reconstrucción de un dominio se descubra que este mapa contiene una relación incorrecta, incompleta o ambigua:

1. No se modifica silenciosamente la lógica.
2. Se identifica la información encontrada.
3. Se valida la relación con el resto de dominios afectados.
4. Se actualiza este documento.
5. Si el cambio afecta una decisión arquitectónica, se evalúa la creación o actualización de un ADR.

Este documento debe evolucionar junto con la reconstrucción del sistema.

---

# FIN DEL DOCUMENTO

```

Hay un punto importante: este `business-map.md` queda deliberadamente en un nivel **conceptual**. No vamos a convertirlo todavía en un diagrama de base de datos disfrazado.

El siguiente paso será `presentations.md`. 