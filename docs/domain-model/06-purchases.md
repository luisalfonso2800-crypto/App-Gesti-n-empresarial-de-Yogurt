# COMPRAS

## 1. Propósito del módulo

El módulo de Compras registra la adquisición de insumos necesarios para la operación del negocio.

Una compra permite registrar:

* cuándo se realizó la compra;
* a qué proveedor se realizó;
* el número de factura o documento de referencia;
* el estado de pago;
* los insumos adquiridos;
* las cantidades compradas;
* las unidades de compra;
* la cantidad equivalente en la unidad base;
* el costo total de cada línea;
* el costo por unidad base;
* la fecha de vencimiento, cuando corresponda;
* el lote informado por el proveedor;
* las observaciones;
* el total general de la compra.

La estructura histórica del sistema separa la compra en una cabecera y un detalle mediante `tblCompras` y `tblDetalleCompras`. 

La responsabilidad principal del módulo es responder:

> ¿Qué se compró, a quién, cuándo, en qué cantidad y a qué costo?

---

## 2. Responsabilidad del módulo

El módulo de Compras es responsable de:

1. Registrar una compra.
2. Identificar cada compra de forma única.
3. Asociar la compra con un proveedor.
4. Registrar la fecha de compra.
5. Registrar el número de factura o documento de referencia.
6. Registrar el estado de pago.
7. Agregar uno o varios insumos a una compra.
8. Registrar la cantidad comprada de cada insumo.
9. Registrar la unidad en la que se realizó la compra.
10. Registrar la cantidad equivalente en la unidad base.
11. Registrar el costo total de cada línea.
12. Registrar el costo por unidad base.
13. Registrar fecha de vencimiento cuando aplique.
14. Registrar el lote informado por el proveedor cuando exista.
15. Mantener las observaciones de la compra y de cada detalle.
16. Mantener la relación entre la cabecera y sus detalles.
17. Determinar el total de la compra a partir de sus detalles.
18. Proporcionar la información necesaria para los módulos posteriores de Inventario y Costos.

---

## 3. Lo que este módulo no hace

El módulo de Compras no es responsable de:

* crear proveedores;
* administrar proveedores;
* crear insumos;
* administrar insumos;
* definir recetas;
* ejecutar producción;
* registrar ventas;
* administrar clientes;
* administrar pagos de clientes;
* calcular rentabilidad;
* administrar el Dashboard.

Tampoco debe asumir directamente la responsabilidad completa del Inventario.

La compra registra el hecho comercial de adquirir insumos. El movimiento y control de existencias pertenece al dominio de Inventario.

La estructura del sistema mantiene Compras y Movimientos de Inventario como registros separados. `tblCompras` y `tblDetalleCompras` existen de forma independiente de `tblMovimientosInventario`. 

---

# 4. Concepto de compra

Una compra representa una operación realizada con un proveedor.

Una compra puede contener uno o varios insumos.

La estructura conceptual es:

```text
COMPRA
   │
   ├── Fecha
   ├── Proveedor
   ├── Número de factura
   ├── Estado de pago
   ├── Total
   │
   └── DETALLES
          │
          ├── Insumo 1
          ├── Insumo 2
          ├── Insumo 3
          └── ...
```

Por ejemplo:

```text
COMPRA: COM-001

Proveedor:
PROV-001

Fecha:
27/08/2026

Factura:
FAC-12345

Detalles:

Leche
Cantidad: 20
Unidad: Litros
Costo total: $100.000

Azúcar
Cantidad: 10
Unidad: Kilogramos
Costo total: $50.000

Envases
Cantidad: 100
Unidad: Unidades
Costo total: $80.000
```

El total de la compra representa la suma económica de sus detalles.

---

# 5. Estructura del dominio

El modelo histórico utiliza una relación Cabecera–Detalle:

```text
COMPRA
   │
   │ ID_Compra
   │
   ├─────────────────────────────┐
   │                             │
   ▼                             ▼
DATOS GENERALES             DETALLE_COMPRA
                                  │
                                  ├── Insumo 1
                                  ├── Insumo 2
                                  ├── Insumo 3
                                  └── ...
```

Las estructuras originales son:

```text
tblCompras
```

y:

```text
tblDetalleCompras
```

La relación principal es:

```text
tblCompras.ID_Compra
          │
          ▼
tblDetalleCompras.ID_Compra
```

La cabecera y el detalle están definidos como estructuras separadas dentro del sistema original. 

---

# 6. Entidad principal: Compra

La compra representa la cabecera de la operación.

Su estructura es:

| Campo            | Descripción                          |
| ---------------- | ------------------------------------ |
| `ID_Compra`      | Identificador único de la compra     |
| `Fecha_Compra`   | Fecha en la que se realizó la compra |
| `ID_Proveedor`   | Proveedor asociado                   |
| `Numero_Factura` | Número de factura o documento        |
| `Estado_Pago`    | Estado de pago de la compra          |
| `Total_Compra`   | Valor total de la compra             |
| `Observaciones`  | Información adicional                |

Esta estructura está definida en `tblCompras`. 

---

## 6.1 Identificador de compra

Cada compra debe tener un identificador único:

```text
ID_Compra
```

Este identificador relaciona la cabecera con todos los detalles correspondientes.

Conceptualmente:

```text
COM-001
COM-002
COM-003
```

El formato definitivo del identificador visible se conservará o redefinirá durante la implementación de la nueva aplicación, pero la necesidad de una identidad única permanece.

---

## 6.2 Fecha de compra

El campo:

```text
Fecha_Compra
```

representa la fecha en la que ocurrió la adquisición.

Esta fecha pertenece a la operación completa y no a cada línea individual del detalle.

```text
COMPRA
├── Fecha_Compra
│
├── Detalle 1
├── Detalle 2
└── Detalle 3
```

---

## 6.3 Proveedor asociado

Cada compra se relaciona con un proveedor mediante:

```text
ID_Proveedor
```

La relación conceptual es:

```text
PROVEEDOR
    1
    │
    ▼
    N
COMPRAS
```

Una compra debe poder identificar claramente el proveedor al que corresponde.

El módulo de Compras consume la información del dominio de Proveedores, pero no administra los datos del proveedor.

---

## 6.4 Número de factura

El campo:

```text
Numero_Factura
```

permite almacenar el número del documento comercial asociado a la compra.

Puede representar, según el caso:

```text
Factura
Cuenta de cobro
Remisión
Documento interno de compra
Otro número de referencia
```

El sistema histórico reserva explícitamente este campo en la cabecera de la compra. 

La regla de obligatoriedad o unicidad definitiva debe definirse posteriormente si el negocio requiere controles adicionales.

---

## 6.5 Estado de pago

El campo:

```text
Estado_Pago
```

representa la situación de pago de la compra.

El modelo histórico confirma la existencia de este concepto dentro de la cabecera, pero no define en la estructura recuperada un catálogo cerrado de valores. 

Por tanto, este documento no debe inventar todavía estados definitivos como:

```text
PAGADO
PENDIENTE
PARCIAL
```

Esos valores deberán definirse explícitamente como parte de la reconstrucción financiera del sistema.

Por ahora, la regla confirmada es:

> Cada compra puede registrar su estado de pago.

---

## 6.6 Total de compra

El campo:

```text
Total_Compra
```

representa el valor económico total de la compra.

La estructura de la cabecera incluye este campo explícitamente. 

Conceptualmente:

```text
Total_Compra
=
Σ Costo_Total de cada detalle
```

Ejemplo:

```text
Detalle 1: $100.000
Detalle 2: $50.000
Detalle 3: $80.000
────────────────────
Total:      $230.000
```

La fórmula exacta y la política de persistencia se definirán durante el diseño de la lógica transaccional.

---

# 7. Entidad de detalle: Detalle de compra

Cada compra puede contener múltiples registros de detalle.

La estructura original es:

| Campo                      | Descripción                             |
| -------------------------- | --------------------------------------- |
| `ID_Detalle_Compra`        | Identificador único del detalle         |
| `ID_Compra`                | Compra a la que pertenece               |
| `ID_Insumo`                | Insumo adquirido                        |
| `Cantidad_Comprada`        | Cantidad adquirida                      |
| `Unidad_Compra`            | Unidad utilizada en la compra           |
| `Cantidad_Convertida_Base` | Equivalencia en la unidad base          |
| `Costo_Total`              | Costo total de la línea                 |
| `Costo_Unidad_Base`        | Costo correspondiente a una unidad base |
| `Fecha_Vencimiento`        | Fecha de vencimiento cuando aplique     |
| `Lote_Proveedor`           | Lote informado por el proveedor         |
| `Observaciones`            | Información adicional                   |

Esta estructura está definida en `tblDetalleCompras`. 

---

## 7.1 Identificador del detalle

Cada línea de compra tiene su propio identificador:

```text
ID_Detalle_Compra
```

Esto permite identificar individualmente cada adquisición registrada dentro de una compra.

Conceptualmente:

```text
Compra: COM-001

DET-001 → Leche
DET-002 → Azúcar
DET-003 → Envases
```

El identificador técnico definitivo se establecerá durante la implementación de PostgreSQL.

---

## 7.2 Insumo adquirido

Cada detalle corresponde a un insumo:

```text
ID_Insumo
```

La relación conceptual es:

```text
COMPRA
   │
   ▼
DETALLE_COMPRA
   │
   ▼
INSUMO
```

El insumo debe pertenecer al catálogo oficial de Insumos.

Compras no crea insumos nuevos.

---

## 7.3 Cantidad comprada

El campo:

```text
Cantidad_Comprada
```

representa la cantidad adquirida según la unidad de compra.

Ejemplo:

```text
Cantidad_Comprada:
10

Unidad_Compra:
Kilogramos
```

Esto significa:

```text
10 Kilogramos adquiridos
```

La cantidad debe representar una cantidad positiva.

```text
Cantidad_Comprada > 0
```

Esta regla es necesaria para mantener la coherencia de una adquisición real.

---

## 7.4 Unidad de compra

El campo:

```text
Unidad_Compra
```

indica cómo fue adquirida la cantidad registrada.

Ejemplos:

```text
Kilogramos
Litros
Unidades
Cajas
Paquetes
Botellas
```

La unidad de compra no debe confundirse con la unidad base del inventario.

Ejemplo:

```text
Compra:
2 cajas

Contenido por caja:
12 unidades

Cantidad equivalente base:
24 unidades
```

---

# 8. Conversión a unidad base

Uno de los conceptos más importantes del modelo de Compras es:

```text
Cantidad_Convertida_Base
```

Este campo representa la cantidad comprada expresada en la unidad base utilizada por el sistema.

Ejemplo:

```text
Cantidad_Comprada:
2

Unidad_Compra:
Cajas

Cantidad_Convertida_Base:
24

Unidad base:
Unidades
```

La separación entre cantidad comprada y cantidad equivalente permite mantener:

```text
FORMA REAL DE COMPRA
```

y:

```text
CANTIDAD OPERATIVA PARA INVENTARIO
```

como conceptos distintos.

La estructura histórica conserva ambos campos explícitamente. 

---

# 9. Costo total

El campo:

```text
Costo_Total
```

representa el valor pagado o registrado para una línea específica de compra.

Ejemplo:

```text
Insumo:
Leche

Cantidad:
20 litros

Costo_Total:
$100.000
```

Cada línea del detalle tiene su propio costo.

El total de la compra se compone de los costos totales de sus detalles.

---

# 10. Costo por unidad base

El campo:

```text
Costo_Unidad_Base
```

representa el costo correspondiente a una unidad de la cantidad base.

Conceptualmente:

```text
Costo_Unidad_Base
=
Costo_Total
÷
Cantidad_Convertida_Base
```

Ejemplo:

```text
Cantidad comprada:
2 cajas

Cantidad equivalente base:
24 unidades

Costo total:
$120.000

Costo unidad base:
$5.000
```

Este valor es fundamental porque permite que otros módulos trabajen con una unidad económica comparable independientemente de la forma en que se realizó la compra.

El sistema histórico registra explícitamente este campo dentro del detalle de compra. 

---

# 11. Fecha de vencimiento

El campo:

```text
Fecha_Vencimiento
```

permite registrar la fecha de vencimiento del insumo adquirido cuando corresponda.

No todos los insumos necesariamente requerirán este dato.

Por ejemplo:

```text
Leche:
Puede requerir vencimiento.

Cultivo:
Puede requerir vencimiento.

Envases:
Puede no requerir vencimiento.
```

El detalle de compra conserva este dato porque la misma compra puede contener insumos con condiciones de vencimiento diferentes. 

---

# 12. Lote del proveedor

El campo:

```text
Lote_Proveedor
```

permite conservar el identificador del lote entregado por el proveedor.

Ejemplo:

```text
Proveedor:
PROV-001

Insumo:
Leche

Lote_Proveedor:
L-20260827-A
```

Este dato pertenece al detalle porque una misma compra puede contener diferentes insumos y cada uno puede pertenecer a un lote distinto.

La estructura histórica incluye explícitamente este campo. 

---

# 13. Observaciones

Existen observaciones en dos niveles.

## Observaciones de la compra

```text
Compra
└── Observaciones
```

Permiten registrar información general de toda la operación.

## Observaciones del detalle

```text
Detalle_Compra
└── Observaciones
```

Permiten registrar información específica de una línea.

Esta separación existe en la estructura histórica.  

---

# 14. Relación entre Compra y Detalle

Una compra puede contener múltiples detalles.

```text
COMPRA
   1
   │
   │
   ▼
   N
DETALLE_COMPRA
```

Ejemplo:

```text
COM-001
│
├── DET-001 → Leche
├── DET-002 → Azúcar
├── DET-003 → Cultivo
└── DET-004 → Envases
```

Un detalle pertenece a una única compra.

---

# 15. Relación entre Compra y Proveedor

Cada compra está asociada a un proveedor:

```text
PROVEEDOR
    1
    │
    ▼
    N
COMPRAS
```

Ejemplo:

```text
PROV-001
│
├── COM-001
├── COM-005
└── COM-012
```

El proveedor puede tener múltiples compras históricas.

---

# 16. Relación entre Detalle de Compra e Insumo

Cada detalle corresponde a un insumo:

```text
INSUMO
   1
   │
   ▼
   N
DETALLES_DE_COMPRA
```

Un mismo insumo puede aparecer en múltiples compras a lo largo del tiempo.

Ejemplo:

```text
INS-001: Leche

├── COM-001
├── COM-004
├── COM-009
└── COM-015
```

Esto permite conservar el historial de adquisiciones.

---

# 17. Flujo conceptual de registro

El registro de una compra debe seguir una estructura Cabecera–Detalle.

## Etapa 1 — Crear la compra

```text
Seleccionar proveedor
        ↓
Definir fecha de compra
        ↓
Registrar número de factura
        ↓
Definir estado de pago
        ↓
Crear compra
```

En este punto existe:

```text
ID_Compra
```

---

## Etapa 2 — Agregar los detalles

Para cada insumo:

```text
Seleccionar insumo
        ↓
Definir cantidad comprada
        ↓
Definir unidad de compra
        ↓
Determinar cantidad equivalente base
        ↓
Registrar costo total
        ↓
Determinar costo por unidad base
        ↓
Registrar vencimiento si aplica
        ↓
Registrar lote del proveedor si existe
        ↓
Agregar detalle
```

---

## Etapa 3 — Determinar el total

Después de registrar los detalles:

```text
Costo detalle 1
        +
Costo detalle 2
        +
Costo detalle 3
        ↓
Total_Compra
```

---

# 18. Relación con Inventario

El sistema histórico separa claramente:

```text
COMPRAS
```

de:

```text
MOVIMIENTOS_INVENTARIO
```

La compra contiene información comercial y de adquisición.

El movimiento de inventario contiene:

```text
ID_Movimiento
Fecha
Tipo_Movimiento
ID_Insumo
ID_Producto
Cantidad_Entrada
Cantidad_Salida
Unidad
Costo_Unitario
Costo_Total
ID_Referencia
Origen
Destino
Observaciones
```



La relación conceptual futura es:

```text
COMPRA
    │
    ▼
DETALLE_COMPRA
    │
    └───────────────┐
                    │
                    ▼
          MOVIMIENTO DE INVENTARIO
                    │
                    ▼
             ENTRADA DE INSUMO
```

Sin embargo, la política exacta de cuándo se genera el movimiento de inventario debe definirse junto con el módulo de Inventario.

Este documento no debe anticipar una implementación transaccional que todavía no está definida en la fuente actual.

---

# 19. Relación con Precios de Proveedores

El sistema histórico también incluye una estructura independiente:

```text
tblPreciosProveedores
```

con información como:

```text
ID_Precio
ID_Insumo
ID_Proveedor
Presentacion_Compra
Cantidad_Presentacion
Unidad_Presentacion
Cantidad_Equivalente_Base
Precio_Compra
Costo_Unidad_Base
Fecha_Registro
Fecha_Ultima_Compra
Activo
Observaciones
```



Esto significa que debemos mantener separados dos conceptos:

```text
PRECIO DE PROVEEDOR
```

y:

```text
DETALLE REAL DE UNA COMPRA
```

El primero representa información de precios asociada a la relación:

```text
Proveedor + Insumo
```

El segundo representa una operación histórica real.

Por tanto:

```text
Precio de proveedor
≠
Compra
```

La relación exacta entre ambos módulos deberá reconstruirse posteriormente al consolidar la lógica de Proveedores y Compras.

---

# 20. Reglas de negocio

## RN-COM-001 — Cada compra debe tener identidad única

```text
ID_Compra
```

debe identificar una única compra.

---

## RN-COM-002 — Cada detalle debe tener identidad única

```text
ID_Detalle_Compra
```

debe identificar una única línea de compra.

---

## RN-COM-003 — Una compra debe estar asociada a un proveedor

El proveedor debe existir en el dominio correspondiente.

---

## RN-COM-004 — Un detalle debe pertenecer a una compra existente

No puede existir un detalle de compra sin una compra válida.

```text
ID_Compra
```

debe corresponder a una compra existente.

---

## RN-COM-005 — Un detalle debe estar asociado a un insumo existente

```text
ID_Insumo
```

debe corresponder a un insumo válido del sistema.

---

## RN-COM-006 — La cantidad comprada debe ser positiva

```text
Cantidad_Comprada > 0
```

No son válidos valores negativos o cero para representar una adquisición.

---

## RN-COM-007 — La unidad de compra debe estar definida

Cada cantidad registrada debe poder interpretarse mediante:

```text
Unidad_Compra
```

---

## RN-COM-008 — La cantidad equivalente base debe mantener coherencia con la compra

```text
Cantidad_Convertida_Base
```

debe representar la equivalencia operativa de la cantidad adquirida.

La lógica exacta de conversión se definirá en la arquitectura de unidades y equivalencias.

---

## RN-COM-009 — El costo total no puede ser negativo

```text
Costo_Total >= 0
```

---

## RN-COM-010 — El costo por unidad base debe ser coherente

Cuando exista una cantidad base válida:

```text
Costo_Unidad_Base
=
Costo_Total
÷
Cantidad_Convertida_Base
```

---

## RN-COM-011 — El total de la compra corresponde a sus detalles

Conceptualmente:

```text
Total_Compra
=
Σ Costo_Total
```

La fuente histórica contiene tanto el total en la cabecera como el costo total en cada detalle.  

---

## RN-COM-012 — La fecha de vencimiento pertenece al detalle

Cuando un insumo requiera vencimiento, el dato se registra en el detalle correspondiente y no como una fecha única para toda la compra.

---

## RN-COM-013 — El lote del proveedor pertenece al detalle

Una compra puede contener múltiples lotes de proveedor.

Por tanto:

```text
Lote_Proveedor
```

pertenece al detalle de cada insumo.

---

# 21. Límites de responsabilidad

El módulo de Compras debe mantenerse dentro de estos límites:

```text
COMPRAS
│
├── Registra adquisición
├── Identifica proveedor
├── Registra insumos adquiridos
├── Registra cantidades
├── Registra unidades
├── Registra costos
├── Conserva vencimientos
├── Conserva lotes del proveedor
└── Mantiene el historial de la operación
```

Mientras que:

```text
INVENTORY
│
├── Registra entradas
├── Registra salidas
├── Calcula existencias
└── Mantiene el estado del stock
```

```text
SUPPLIERS
│
└── Administra la información del proveedor
```

```text
SUPPLIES
│
└── Administra el catálogo de insumos
```

```text
COSTS
│
└── Utiliza información económica para cálculos posteriores
```

La compra no debe absorber las responsabilidades de estos dominios.

---

# 22. Modelo conceptual de datos

```text
┌─────────────────────┐
│      SUPPLIER       │
├─────────────────────┤
│ ID_Proveedor        │
│ ...                 │
└──────────┬──────────┘
           │
           │ 1
           ▼ N
┌─────────────────────────────┐
│           PURCHASE           │
├─────────────────────────────┤
│ ID_Compra                   │
│ Fecha_Compra                │
│ ID_Proveedor                │
│ Numero_Factura              │
│ Estado_Pago                 │
│ Total_Compra                │
│ Observaciones               │
└──────────────┬──────────────┘
               │
               │ 1
               ▼ N
┌─────────────────────────────┐
│        PURCHASE DETAIL      │
├─────────────────────────────┤
│ ID_Detalle_Compra           │
│ ID_Compra                   │
│ ID_Insumo                   │
│ Cantidad_Comprada           │
│ Unidad_Compra               │
│ Cantidad_Convertida_Base    │
│ Costo_Total                 │
│ Costo_Unidad_Base           │
│ Fecha_Vencimiento           │
│ Lote_Proveedor              │
│ Observaciones               │
└──────────────┬──────────────┘
               │
               │ N
               ▼ 1
┌─────────────────────┐
│       SUPPLY        │
├─────────────────────┤
│ ID_Insumo           │
│ ...                 │
└─────────────────────┘
```

---

# 23. Dependencias del dominio

El módulo de Compras depende conceptualmente de:

```text
SUPPLIERS
```

para identificar el proveedor.

También depende de:

```text
SUPPLIES
```

para identificar los insumos adquiridos.

Además, se relaciona posteriormente con:

```text
INVENTORY
```

para representar la entrada física de los insumos.

Y proporciona información para:

```text
COSTS
```

mediante los costos registrados en las compras.

La relación conceptual es:

```text
SUPPLIERS
      │
      ▼
   PURCHASES
      │
      ├──────────────► SUPPLIES
      │
      ▼
  PURCHASE DETAILS
      │
      ├──────────────► INVENTORY
      │
      └──────────────► COSTS
```

---

# 24. Operaciones funcionales del módulo

El sistema debe poder realizar como mínimo:

```text
Crear compra
Consultar compra
Consultar compras
Consultar compras por proveedor
Consultar compras por fecha
Consultar detalles de una compra
Agregar detalle
Actualizar detalle
Consultar total de compra
Consultar historial de compras de un insumo
```

Las operaciones exactas de modificación, cancelación o eliminación deberán definirse cuando se reconstruya la lógica transaccional completa.

No deben inventarse comportamientos destructivos sin considerar su impacto en Inventario, Costos e historial.

---

# 25. Traducción futura a PostgreSQL

La estructura conceptual indica al menos dos entidades persistentes:

```text
purchases
```

y:

```text
purchase_items
```

o nombres equivalentes según las convenciones oficiales del proyecto.

La relación debe preservar:

```text
Purchase
1 ─────── N PurchaseItem
```

Además:

```text
Supplier
1 ─────── N Purchase
```

y:

```text
Supply
1 ─────── N PurchaseItem
```

Los nombres físicos definitivos, tipos de datos, índices y restricciones serán definidos durante el diseño de la base de datos.

---

# 26. Estado actual del dominio

La reconstrucción actual de Compras define:

```text
[DEFINIDO]

✓ Compra como operación Cabecera–Detalle
✓ Relación Compra → Proveedor
✓ Relación Detalle → Insumo
✓ Fecha de compra
✓ Número de factura
✓ Estado de pago como concepto
✓ Total de compra
✓ Cantidad comprada
✓ Unidad de compra
✓ Cantidad equivalente base
✓ Costo total
✓ Costo por unidad base
✓ Fecha de vencimiento
✓ Lote del proveedor
✓ Observaciones generales
✓ Observaciones por detalle
✓ Relación futura con Inventario
✓ Relación futura con Costos
✓ Separación entre compra y precio de proveedor
```

---

# 27. Decisiones pendientes

La fuente disponible define la estructura de datos de Compras, pero todavía quedan decisiones que deben reconstruirse antes de implementar el módulo.

## 27.1 Estados de pago

Definir oficialmente los valores permitidos para:

```text
Estado_Pago
```

---

## 27.2 Pago parcial

Definir si una compra puede tener pagos parciales y, si es así, cómo se relacionará con el módulo financiero correspondiente.

---

## 27.3 Unicidad de factura

Definir si:

```text
Numero_Factura
```

debe ser único globalmente, único por proveedor o simplemente informativo.

---

## 27.4 Repetición de un insumo

Definir si un mismo insumo puede aparecer más de una vez dentro de la misma compra.

Esta regla no debe inventarse sin revisar el flujo operativo real.

---

## 27.5 Modificación de compras históricas

Definir qué partes de una compra pueden modificarse después de haber generado efectos en:

```text
INVENTORY
COSTS
LOTES
```

---

## 27.6 Cancelación de compras

Definir si una compra puede cancelarse y qué efectos debe producir sobre:

```text
Detalles de compra
Movimientos de inventario
Costos históricos
```

---

## 27.7 Generación del movimiento de inventario

Definir el momento exacto en el que:

```text
DETALLE DE COMPRA
```

genera:

```text
ENTRADA DE INVENTARIO
```

La arquitectura histórica confirma que ambas estructuras existen, pero la política transaccional exacta no está definida en la fuente recuperada. 

---

## 27.8 Conversión de unidades

Definir la fuente oficial de las conversiones necesarias para obtener:

```text
Cantidad_Convertida_Base
```

---

## 27.9 Actualización de precios de proveedores

Definir si una compra real debe actualizar automáticamente:

```text
tblPreciosProveedores
```

o si el historial de precios debe administrarse mediante otro proceso.

La estructura actual demuestra que ambos conceptos existen, pero no establece en el material disponible una regla automática entre ellos. 

---

# 28. Regla de continuidad

Este documento representa la reconstrucción actual del dominio de Compras a partir de la estructura más reciente disponible del sistema anterior.

Las decisiones pendientes no deben resolverse mediante suposiciones durante la implementación.

Cuando se defina una nueva regla:

```text
Análisis
      ↓
Decisión explícita
      ↓
Actualización de este documento
      ↓
Registro arquitectónico si corresponde
      ↓
Implementación
```

El módulo de Compras queda definido como el registro histórico de las adquisiciones de insumos, manteniendo separadas la operación comercial, el movimiento de inventario y los cálculos posteriores de costos.
