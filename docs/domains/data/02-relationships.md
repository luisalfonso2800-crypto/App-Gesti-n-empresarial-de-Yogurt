# 02 — RELATIONSHIPS

## 1. Propósito

Este documento define las relaciones entre las entidades identificadas en el modelo de datos del Sistema de Gestión Empresarial de Yogurt.

Su objetivo es establecer con precisión:

* qué entidad se relaciona con cuál;
* cuál es la dirección lógica de la relación;
* cuál es su cardinalidad;
* qué entidad depende de otra;
* qué relaciones representan datos maestros;
* qué relaciones representan operaciones;
* qué relaciones deben conservar trazabilidad histórica.

Este documento no define todavía:

* tipos físicos de datos;
* nombres definitivos de columnas en PostgreSQL;
* índices;
* claves técnicas específicas;
* comportamiento de borrado en cascada;
* implementación con Prisma.

Esas decisiones se documentarán posteriormente sin modificar la lógica de negocio definida aquí.

La base de estas relaciones procede del sistema maestro anterior y de las estructuras y validaciones existentes en VBA. Por ejemplo, Productos mantiene la relación directa con Presentaciones mediante `ID_Presentacion`, y Recetas separa su cabecera de su detalle mediante `ID_Receta` e `ID_Insumo`.  

---

# 2. Principio general de relación

El sistema se organiza alrededor de cuatro grandes grupos:

```text
DATOS MAESTROS
        ↓
DEFINICIONES DEL NEGOCIO
        ↓
OPERACIONES
        ↓
RESULTADOS Y ANÁLISIS
```

La estructura general es:

```text
PRESENTACIONES
INSUMOS
PROVEEDORES
PRODUCTOS
CLIENTES
        ↓
RECETAS
PRECIOS DE PROVEEDORES
        ↓
COMPRAS
PRODUCCIÓN
VENTAS
PAGOS
GASTOS
        ↓
MOVIMIENTOS DE INVENTARIO
LOTES
        ↓
COSTOS
RENTABILIDAD
DASHBOARD
```

No todas estas relaciones representan claves foráneas directas.

Algunas representan:

* dependencia operativa;
* origen de información;
* generación de movimientos;
* trazabilidad;
* agregación para cálculos.

---

# 3. Relación Presentaciones → Productos

## Cardinalidad

```text
Una Presentación
        ↓
puede estar asociada a
        ↓
muchos Productos
```

```text
PRESENTATION 1 ──────── N PRODUCT
```

Cada Producto utiliza una única Presentación.

Ejemplo conceptual:

```text
Presentación:
Vaso 6 oz

Productos:
- Yogurt Natural 6 oz
- Yogurt Fresa 6 oz
- Yogurt Mora 6 oz
```

La Presentación representa las características físicas o comerciales del envase utilizado por el producto.

El Producto mantiene la referencia a la Presentación mediante `ID_Presentacion`. La validación original del sistema permite el mismo nombre de producto en diferentes presentaciones, pero no permite duplicar la misma combinación producto + presentación. 

### Regla

```text
Un Producto debe estar asociado a una Presentación existente.
```

La Presentación no depende del Producto.

---

# 4. Relación Productos → Recetas

## Cardinalidad

```text
PRODUCT 1 ──────── N RECIPE
```

Un Producto puede tener una o más Recetas registradas.

Cada Receta pertenece a un Producto.

La relación se representa mediante:

```text
Recipe.ID_Product
        ↓
Product.ID_Product
```

El sistema maestro contiene validaciones específicas para comprobar si un producto tiene al menos una receta. 

### Regla

```text
Una Receta debe estar asociada a un Producto existente.
```

La relación no implica que todos los Productos tengan necesariamente una Receta en el mismo momento de su creación.

La necesidad de una receta depende de la lógica posterior de Producción.

---

# 5. Relación Recetas → Detalle de Recetas

## Cardinalidad

```text
RECIPE 1 ──────── N RECIPE_DETAIL
```

Una Receta está compuesta por uno o varios ingredientes.

Cada registro del detalle pertenece a una única Receta.

```text
RECIPE
│
├── RECIPE_DETAIL
├── RECIPE_DETAIL
├── RECIPE_DETAIL
└── RECIPE_DETAIL
```

La cabecera de la Receta identifica la definición general.

El Detalle de Receta identifica los insumos y cantidades requeridas.

La estructura original separa explícitamente:

```text
ID_Receta
```

de:

```text
ID_Detalle_Receta
ID_Receta
ID_Insumo
Cantidad_Requerida
Unidad
Merma_Porcentaje
Observaciones
```



---

# 6. Relación Insumos → Detalle de Recetas

## Cardinalidad

```text
SUPPLY 1 ──────── N RECIPE_DETAIL
```

Un Insumo puede aparecer en múltiples Recetas.

Cada línea del Detalle de Receta utiliza un único Insumo.

La relación completa es:

```text
PRODUCT
   │
   └── RECIPE
           │
           ├── RECIPE_DETAIL ──── SUPPLY
           ├── RECIPE_DETAIL ──── SUPPLY
           └── RECIPE_DETAIL ──── SUPPLY
```

### Regla

Dentro de una misma Receta, un mismo Insumo no puede registrarse más de una vez.

La validación existe explícitamente en el sistema original. 

Por tanto:

```text
RECIPE + SUPPLY
```

debe representar una combinación única dentro del detalle de una receta.

---

# 7. Relación Proveedores → Precios de Proveedores

## Cardinalidad

```text
SUPPLIER 1 ──────── N SUPPLIER_PRICE
```

Un Proveedor puede registrar múltiples precios.

Cada registro de precio pertenece a un único Proveedor.

La finalidad de esta relación es conservar la información comercial de los precios ofrecidos por cada proveedor.

---

# 8. Relación Insumos → Precios de Proveedores

## Cardinalidad

```text
SUPPLY 1 ──────── N SUPPLIER_PRICE
```

Un Insumo puede tener múltiples precios registrados.

Cada precio corresponde a un único Insumo.

Por tanto, `SUPPLIER_PRICE` funciona como entidad de relación entre:

```text
SUPPLIER
        ↕
SUPPLIER_PRICE
        ↕
SUPPLY
```

La estructura lógica es:

```text
SUPPLIER 1 ──── N SUPPLIER_PRICE N ──── 1 SUPPLY
```

Esto permite que:

```text
Un proveedor venda muchos insumos.
Un insumo pueda tener precios de varios proveedores.
```

---

# 9. Relación Proveedores → Compras

## Cardinalidad

```text
SUPPLIER 1 ──────── N PURCHASE
```

Un Proveedor puede participar en múltiples Compras.

Cada Compra se registra para un único Proveedor.

La Compra representa la operación comercial general.

Ejemplo conceptual:

```text
COMPRA
│
├── Proveedor
├── Fecha
├── Información general
└── Detalle de productos o insumos adquiridos
```

---

# 10. Relación Compras → Detalle de Compras

## Cardinalidad

```text
PURCHASE 1 ──────── N PURCHASE_DETAIL
```

Una Compra puede contener múltiples líneas.

Cada línea pertenece a una única Compra.

```text
PURCHASE
│
├── PURCHASE_DETAIL
├── PURCHASE_DETAIL
├── PURCHASE_DETAIL
└── PURCHASE_DETAIL
```

La cabecera representa la operación.

El detalle representa los elementos adquiridos.

---

# 11. Relación Insumos → Detalle de Compras

## Cardinalidad

```text
SUPPLY 1 ──────── N PURCHASE_DETAIL
```

Cada línea del detalle identifica el Insumo comprado.

Un mismo Insumo puede aparecer en múltiples compras a lo largo del tiempo.

La relación completa es:

```text
SUPPLIER
    │
    └── PURCHASE
            │
            ├── PURCHASE_DETAIL ──── SUPPLY
            ├── PURCHASE_DETAIL ──── SUPPLY
            └── PURCHASE_DETAIL ──── SUPPLY
```

---

# 12. Relación Compras → Inventario

Una Compra no modifica directamente el inventario como un simple campo acumulado.

La Compra constituye el origen de una operación que debe producir un movimiento de inventario.

La relación conceptual es:

```text
PURCHASE
    ↓
PURCHASE_DETAIL
    ↓
INVENTORY_MOVEMENT
    ↓
INVENTORY
```

El detalle de la compra representa la información comercial de lo adquirido.

El Movimiento de Inventario representa el efecto sobre las existencias.

---

# 13. Relación Movimientos de Inventario → Insumos

## Cardinalidad

```text
SUPPLY 1 ──────── N INVENTORY_MOVEMENT
```

Un Insumo puede generar múltiples movimientos a lo largo de su vida.

Ejemplos conceptuales:

```text
Compra
Producción
Ajuste
Pérdida
Corrección
```

Cada Movimiento de Inventario afecta un único elemento inventariable.

La existencia actual no debe entenderse como un registro independiente sin historial.

El inventario representa el resultado acumulado de los movimientos registrados.

---

# 14. Relación Inventario → Movimientos de Inventario

La relación conceptual es:

```text
INVENTORY_MOVEMENT N ──────── 1 INVENTORY_ITEM
```

Sin embargo, el Inventario representa una visión o estado de las existencias, mientras que el Movimiento conserva la trazabilidad histórica.

La lógica es:

```text
MOVIMIENTOS
        ↓
ENTRADAS
        +
SALIDAS
        ↓
EXISTENCIA ACTUAL
```

El sistema debe preservar los movimientos como fuente histórica de las variaciones del inventario.

---

# 15. Relación Productos → Producción

## Cardinalidad

```text
PRODUCT 1 ──────── N PRODUCTION
```

Un Producto puede producirse múltiples veces.

Cada operación de Producción corresponde a un Producto.

La Producción representa la ejecución de una operación real de fabricación.

Ejemplo:

```text
Producto:
Yogurt Natural 6 oz

Producciones:
- Producción 001
- Producción 002
- Producción 003
```

La Producción no representa la definición del producto.

Representa una ejecución concreta realizada en una fecha determinada.

---

# 16. Relación Producción → Receta

La Producción utiliza la lógica definida por una Receta asociada al Producto.

La relación conceptual es:

```text
PRODUCT
   │
   └── RECIPE
           │
           ↓
       PRODUCTION
```

La Producción requiere conocer qué definición de ingredientes y cantidades corresponde al producto fabricado.

La relación exacta de persistencia entre Producción y Receta debe conservar la trazabilidad de la receta utilizada en la operación.

No debe asumirse que modificar posteriormente una Receta modifica retrospectivamente una Producción ya ejecutada.

---

# 17. Relación Producción → Detalle de Producción

## Cardinalidad

```text
PRODUCTION 1 ──────── N PRODUCTION_DETAIL
```

Una Producción puede estar compuesta por múltiples registros de detalle.

El detalle permite registrar los insumos realmente involucrados en la operación.

```text
PRODUCTION
│
├── PRODUCTION_DETAIL
├── PRODUCTION_DETAIL
├── PRODUCTION_DETAIL
└── PRODUCTION_DETAIL
```

La Receta representa la definición planificada.

El Detalle de Producción representa la información asociada a la ejecución real.

---

# 18. Relación Insumos → Detalle de Producción

## Cardinalidad

```text
SUPPLY 1 ──────── N PRODUCTION_DETAIL
```

Un Insumo puede utilizarse en múltiples operaciones de Producción.

Cada registro de detalle identifica un insumo utilizado dentro de una producción.

La relación es:

```text
SUPPLY
   ↑
   │
PRODUCTION_DETAIL
   │
   ↓
PRODUCTION
```

---

# 19. Relación Producción → Movimientos de Inventario

La ejecución de una Producción genera efectos sobre el inventario.

Conceptualmente:

```text
PRODUCTION
    │
    ├── consume insumos
    │       ↓
    │   INVENTORY_MOVEMENT
    │
    └── genera producto terminado
            ↓
        INVENTORY_MOVEMENT
```

Por tanto, una Producción puede originar múltiples Movimientos de Inventario.

No se debe registrar una Producción como un evento aislado del inventario.

La producción modifica existencias mediante movimientos trazables.

---

# 20. Relación Producción → Lotes

## Cardinalidad

```text
PRODUCTION 1 ──────── N LOT
```

Una operación de Producción puede generar uno o varios Lotes, dependiendo de cómo se defina y ejecute la producción.

Cada Lote procede de una operación de Producción.

La relación conceptual es:

```text
PRODUCTION
        ↓
       LOT
```

El Lote permite identificar una cantidad concreta de producto producido y conservar su trazabilidad.

---

# 21. Relación Productos → Lotes

## Cardinalidad

```text
PRODUCT 1 ──────── N LOT
```

Un Producto puede existir en múltiples Lotes.

Cada Lote corresponde a un único Producto.

```text
PRODUCT
│
├── LOT
├── LOT
├── LOT
└── LOT
```

Cada lote debe conservar como mínimo la relación con:

```text
Producto
Producción de origen
Fecha de creación
Fecha de vencimiento
```

La fecha de creación corresponde al momento en que el lote fue generado.

La fecha de vencimiento corresponde al límite de vigencia establecido para ese lote.

Estas fechas deben conservarse como información histórica del lote y no deben depender únicamente de valores actuales de configuración.

---

# 22. Relación Lotes → Inventario

Los Lotes participan en el control de existencias de productos terminados.

La relación conceptual es:

```text
PRODUCTION
        ↓
      LOT
        ↓
INVENTORY_MOVEMENT
        ↓
INVENTORY
```

Cuando el sistema requiera trazabilidad por lote, las entradas y salidas del producto terminado deben poder relacionarse con el lote correspondiente.

---

# 23. Relación Clientes → Ventas

## Cardinalidad

```text
CLIENT 1 ──────── N SALE
```

Un Cliente puede realizar múltiples Ventas.

Cada Venta corresponde a un único Cliente cuando la operación requiera identificarlo.

La Venta representa la operación comercial general.

---

# 24. Relación Ventas → Detalle de Ventas

## Cardinalidad

```text
SALE 1 ──────── N SALE_DETAIL
```

Una Venta puede contener múltiples productos.

Cada línea del detalle pertenece a una única Venta.

```text
SALE
│
├── SALE_DETAIL
├── SALE_DETAIL
├── SALE_DETAIL
└── SALE_DETAIL
```

---

# 25. Relación Productos → Detalle de Ventas

## Cardinalidad

```text
PRODUCT 1 ──────── N SALE_DETAIL
```

Un Producto puede venderse muchas veces.

Cada línea del detalle de una Venta corresponde a un Producto.

La relación general es:

```text
CLIENT
   │
   └── SALE
           │
           ├── SALE_DETAIL ──── PRODUCT
           ├── SALE_DETAIL ──── PRODUCT
           └── SALE_DETAIL ──── PRODUCT
```

---

# 26. Relación Ventas → Lotes

La venta de productos terminados puede requerir identificar el Lote del cual proviene el producto vendido.

La relación conceptual es:

```text
SALE
   │
   └── SALE_DETAIL
           │
           ↓
          LOT
```

Esto permite conservar trazabilidad:

```text
Lote producido
        ↓
Existencia disponible
        ↓
Producto vendido
```

La implementación física exacta dependerá de si una línea de venta puede consumir uno o varios lotes.

Esa decisión no debe inventarse en este documento y deberá respetar la lógica operativa definida durante la implementación del control de inventario por lotes.

---

# 27. Relación Ventas → Movimientos de Inventario

Una Venta genera una salida de inventario.

La relación conceptual es:

```text
SALE
    ↓
SALE_DETAIL
    ↓
INVENTORY_MOVEMENT
```

Cada venta debe producir el efecto correspondiente sobre las existencias.

El registro comercial de la Venta y el registro de inventario son responsabilidades diferentes, aunque estén relacionadas.

---

# 28. Relación Clientes → Pagos

## Cardinalidad

```text
CLIENT 1 ──────── N PAYMENT
```

Un Cliente puede realizar múltiples Pagos.

Cada Pago corresponde a un Cliente identificado.

---

# 29. Relación Ventas → Pagos

La relación conceptual entre Venta y Pago permite registrar el cumplimiento financiero de las ventas realizadas.

```text
SALE
    ↓
PAYMENT
```

Dependiendo de la operación:

```text
Una Venta puede recibir uno o varios Pagos.
```

Por tanto, la relación conceptual principal es:

```text
SALE 1 ──────── N PAYMENT
```

Esta relación permite distinguir:

```text
Valor vendido
        ↓
Valor pagado
        ↓
Saldo pendiente
```

Los Pagos no deben confundirse con las Ventas.

Una Venta representa la obligación comercial.

Un Pago representa el movimiento financiero realizado para cubrir total o parcialmente esa obligación.

---

# 30. Relación Gastos → Operación del Negocio

El Gasto representa una salida económica independiente de las operaciones de Compra, Producción y Venta.

No debe forzarse una relación artificial entre un Gasto y otra entidad únicamente para completar un modelo relacional.

El Gasto puede utilizarse posteriormente como fuente de información para:

```text
COSTS
        ↓
PROFITABILITY
        ↓
DASHBOARD
```

La relación principal del Gasto dentro del modelo es de carácter analítico y financiero.

---

# 31. Relación Compras → Costos

Las Compras proporcionan información necesaria para conocer el costo de adquisición de los Insumos.

La relación conceptual es:

```text
PURCHASE
    ↓
PURCHASE_DETAIL
    ↓
SUPPLY COST INFORMATION
```

La información histórica de compra puede utilizarse para cálculos posteriores de costos.

No se debe asumir que el costo actual de un Insumo elimina o reemplaza automáticamente el costo histórico de compras anteriores.

---

# 32. Relación Producción → Costos

La Producción utiliza información relacionada con:

```text
Insumos utilizados
        +
Cantidades utilizadas
        +
Costos correspondientes
        ↓
Costo de Producción
```

Conceptualmente:

```text
PRODUCTION
    ↓
PRODUCTION_DETAIL
    ↓
SUPPLY
    ↓
COST INFORMATION
```

El resultado puede alimentar el análisis de costos del producto fabricado.

---

# 33. Relación Productos → Costos

Los costos pueden analizarse desde la perspectiva del Producto.

La relación conceptual es:

```text
PRODUCT
    ↓
RECIPE
    ↓
SUPPLIES
    ↓
PURCHASE COSTS
```

y también:

```text
PRODUCT
    ↓
PRODUCTION
    ↓
ACTUAL PRODUCTION COST
```

La definición exacta de las fórmulas de costo no se establece en este documento.

Este documento únicamente identifica las fuentes de información relacionadas.

---

# 34. Relación Ventas → Rentabilidad

La Rentabilidad depende de la información generada por las ventas y de los costos asociados.

La relación conceptual es:

```text
SALES
        +
COSTS
        +
EXPENSES
        ↓
PROFITABILITY
```

La Rentabilidad no representa una operación independiente.

Es un resultado analítico construido a partir de información registrada en otros módulos.

---

# 35. Relación Gastos → Rentabilidad

Los Gastos participan en el análisis económico del negocio.

La relación conceptual es:

```text
EXPENSES
        ↓
PROFITABILITY
```

Los gastos no deben confundirse automáticamente con el costo directo de un producto.

El módulo de Costos y el módulo de Rentabilidad definirán posteriormente cómo se utilizan los gastos dentro de los cálculos.

---

# 36. Relación Dashboard → Otros módulos

El Dashboard no es una fuente primaria de datos del negocio.

El Dashboard consume información procedente de los demás dominios.

```text
PRESENTATIONS
SUPPLIES
SUPPLIERS
PRODUCTS
CLIENTS
PURCHASES
INVENTORY
PRODUCTION
LOTS
SALES
PAYMENTS
EXPENSES
COSTS
PROFITABILITY
        ↓
    DASHBOARD
```

El Dashboard representa una capa de consulta y visualización.

No debe convertirse en propietario de los datos operativos.

---

# 37. Mapa general de relaciones

La estructura general del sistema puede representarse así:

```text
PRESENTATIONS
        │
        └────────────── PRODUCTS
                            │
                            ├────────────── RECIPES
                            │                   │
                            │                   └── RECIPE_DETAILS ──── SUPPLIES
                            │
                            ├────────────── PRODUCTION
                            │                   │
                            │                   ├── PRODUCTION_DETAILS ──── SUPPLIES
                            │                   │
                            │                   ├── INVENTORY_MOVEMENTS
                            │                   │
                            │                   └────────────── LOTS
                            │
                            └────────────── SALE_DETAILS
                                                │
CLIENTS ─────────────── SALES ──────────────────┤
    │                       │                    │
    │                       ├── PAYMENTS         └── INVENTORY_MOVEMENTS
    │                       │
    └───────────────────────┘

SUPPLIERS
    │
    ├────────────── SUPPLIER_PRICES ──── SUPPLIES
    │
    └────────────── PURCHASES
                        │
                        └── PURCHASE_DETAILS ──── SUPPLIES
                                                    │
                                                    └── INVENTORY_MOVEMENTS
```

La información financiera y analítica se alimenta conceptualmente así:

```text
PURCHASES ────────┐
PRODUCTION ───────┤
SALES ────────────┼──── COSTS
EXPENSES ─────────┤
                  └──── PROFITABILITY
                           │
                           ↓
                       DASHBOARD
```

---

# 38. Relaciones maestras

Las relaciones principales de datos maestros son:

```text
PRESENTATION 1 ──── N PRODUCT

PRODUCT 1 ──── N RECIPE

RECIPE 1 ──── N RECIPE_DETAIL

SUPPLY 1 ──── N RECIPE_DETAIL

SUPPLIER 1 ──── N SUPPLIER_PRICE

SUPPLY 1 ──── N SUPPLIER_PRICE
```

Estas relaciones definen las estructuras necesarias antes de ejecutar las operaciones del negocio.

---

# 39. Relaciones operativas

Las relaciones principales de operación son:

```text
SUPPLIER 1 ──── N PURCHASE

PURCHASE 1 ──── N PURCHASE_DETAIL

SUPPLY 1 ──── N PURCHASE_DETAIL

PRODUCT 1 ──── N PRODUCTION

PRODUCTION 1 ──── N PRODUCTION_DETAIL

SUPPLY 1 ──── N PRODUCTION_DETAIL

PRODUCTION 1 ──── N LOT

PRODUCT 1 ──── N LOT

CLIENT 1 ──── N SALE

SALE 1 ──── N SALE_DETAIL

PRODUCT 1 ──── N SALE_DETAIL

CLIENT 1 ──── N PAYMENT

SALE 1 ──── N PAYMENT
```

---

# 40. Relaciones de trazabilidad

Las relaciones de trazabilidad más importantes son:

```text
PURCHASE
    ↓
PURCHASE_DETAIL
    ↓
SUPPLY
    ↓
INVENTORY_MOVEMENT
```

```text
RECIPE
    ↓
RECIPE_DETAIL
    ↓
SUPPLY
```

```text
PRODUCTION
    ↓
PRODUCTION_DETAIL
    ↓
SUPPLY CONSUMPTION
```

```text
PRODUCTION
    ↓
LOT
    ↓
PRODUCT INVENTORY
    ↓
SALE
```

El objetivo es poder reconstruir el recorrido lógico de los recursos y productos dentro del negocio.

---

# 41. Relaciones derivadas y no propietarias

Las siguientes áreas consumen información de otros módulos y no deben convertirse en propietarios de los registros originales:

```text
INVENTORY
COSTS
PROFITABILITY
DASHBOARD
```

Su función principal es:

```text
INVENTORY
→ representar y controlar existencias y movimientos.

COSTS
→ analizar información económica relacionada con insumos,
  compras y producción.

PROFITABILITY
→ analizar resultados económicos utilizando ventas,
  costos y gastos.

DASHBOARD
→ presentar indicadores y estado general del negocio.
```

---

# 42. Reglas de dependencia entre dominios

Las dependencias lógicas principales son:

```text
PRODUCTS
→ depende de PRESENTATIONS
```

```text
RECIPES
→ depende de PRODUCTS y SUPPLIES
```

```text
SUPPLIER_PRICES
→ depende de SUPPLIERS y SUPPLIES
```

```text
PURCHASES
→ depende de SUPPLIERS y SUPPLIES
```

```text
PRODUCTION
→ depende de PRODUCTS, RECIPES y SUPPLIES
```

```text
LOTS
→ depende de PRODUCTION y PRODUCTS
```

```text
SALES
→ depende de CLIENTS y PRODUCTS
```

```text
PAYMENTS
→ depende de CLIENTS y SALES
```

```text
INVENTORY
→ recibe información de PURCHASES, PRODUCTION y SALES
```

```text
COSTS
→ utiliza información de PURCHASES, SUPPLIES y PRODUCTION
```

```text
PROFITABILITY
→ utiliza información de SALES, COSTS y EXPENSES
```

```text
DASHBOARD
→ consume información de los módulos del sistema
```

---

# 43. Restricción fundamental: una tabla no implica un módulo independiente

Las entidades de detalle no representan necesariamente dominios independientes.

Por tanto:

```text
PURCHASE_DETAIL
```

pertenece funcionalmente a:

```text
PURCHASES
```

```text
RECIPE_DETAIL
```

pertenece funcionalmente a:

```text
RECIPES
```

```text
PRODUCTION_DETAIL
```

pertenece funcionalmente a:

```text
PRODUCTION
```

```text
SALE_DETAIL
```

pertenece funcionalmente a:

```text
SALES
```

La existencia de una entidad o tabla de detalle responde a una necesidad de relación y persistencia, no a la obligación de crear un módulo independiente.

---

# 44. Estado de definición

Las relaciones establecidas en este documento se consideran parte del mapa técnico del negocio.

Todavía no deben traducirse automáticamente a:

* modelos Prisma;
* tablas PostgreSQL;
* claves foráneas;
* relaciones `onDelete`;
* relaciones bidireccionales en código.

Antes de implementar la persistencia se debe crear el siguiente nivel de documentación técnica:

```text
03-constraints.md
```

Ese documento definirá las restricciones de integridad derivadas de las entidades y relaciones ya identificadas, incluyendo:

* relaciones obligatorias;
* relaciones opcionales;
* unicidad;
* prohibiciones de duplicidad;
* reglas de integridad referencial;
* reglas históricas;
* restricciones que deben impedir operaciones inválidas.

Las entidades definen qué existe.

Las relaciones definen cómo se conectan.

Las restricciones definirán qué combinaciones y operaciones son válidas.
