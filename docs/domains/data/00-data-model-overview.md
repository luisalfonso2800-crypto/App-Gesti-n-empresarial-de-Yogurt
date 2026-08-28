# Modelo de Datos — Visión General

**Documento:** `00-data-model-overview.md`
**Estado:** Base técnica en construcción
**Fuente de referencia:** Documentación de dominios y archivo maestro del sistema VBA
**Propósito:** Definir la visión general del modelo de datos antes de diseñar PostgreSQL y Prisma.

---

# 1. Propósito

Este documento define la estructura conceptual general de los datos del sistema de Gestión Empresarial de Yogurt.

Su objetivo es servir como puente entre la lógica del negocio documentada en `docs/domains/` y la futura implementación técnica mediante:

```text
PostgreSQL
    ↓
Prisma ORM
    ↓
NestJS API
    ↓
Aplicación Desktop
```

Este documento todavía no define:

* tablas SQL;
* tipos específicos de PostgreSQL;
* modelos Prisma;
* índices;
* claves foráneas definitivas;
* migraciones;
* consultas;
* repositorios;
* endpoints.

Su función es establecer primero **qué información existe en el sistema y cómo se relaciona conceptualmente**.

---

# 2. Fuente de verdad

El modelo de datos debe construirse a partir de las siguientes fuentes, en este orden:

```text
1. Documentación oficial de dominios
        ↓
2. Archivo maestro del sistema VBA
        ↓
3. Decisiones arquitectónicas documentadas
        ↓
4. Implementación técnica
```

Las conversaciones no constituyen fuente de verdad permanente.

Cuando una decisión nueva modifique la estructura del negocio o del modelo de datos, deberá actualizarse la documentación correspondiente antes o junto con la implementación.

---

# 3. Principio fundamental

El modelo de datos no se construirá aplicando automáticamente esta regla:

```text
Tabla anterior = nueva entidad
```

Tampoco se aplicará:

```text
Módulo de negocio = tabla
```

La regla oficial será:

> Cada estructura de datos deberá existir porque representa una responsabilidad, relación, transacción, estado histórico o necesidad de persistencia real del sistema.

Por tanto:

```text
Una tabla puede representar una entidad.
```

```text
Una tabla puede representar una relación.
```

```text
Una tabla puede representar un detalle transaccional.
```

```text
Una responsabilidad de negocio puede no necesitar una tabla propia.
```

---

# 4. Arquitectura conceptual de los datos

El sistema se divide conceptualmente en cinco grandes grupos:

```text
MAESTROS
    ↓
CONFIGURACIÓN Y RELACIONES
    ↓
OPERACIONES TRANSACCIONALES
    ↓
TRAZABILIDAD E INVENTARIO
    ↓
CÁLCULOS Y ANÁLISIS
```

La estructura general es:

```text
┌──────────────────────────────┐
│          MAESTROS            │
│                              │
│ • Presentations              │
│ • Supplies                   │
│ • Suppliers                  │
│ • Products                   │
│ • Clients                    │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ CONFIGURACIÓN Y RELACIONES   │
│                              │
│ • Supplier Prices            │
│ • Recipes                    │
│ • Recipe Items               │
│ • Configuration              │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│       OPERACIONES            │
│                              │
│ • Purchases                  │
│ • Purchase Items             │
│ • Production                 │
│ • Production Items           │
│ • Sales                      │
│ • Sale Items                 │
│ • Customer Payments          │
│ • Expenses                   │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│   INVENTARIO Y TRAZABILIDAD  │
│                              │
│ • Inventory Movements        │
│ • Inventory Balance          │
│ • Lots                       │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│   CÁLCULO Y ANÁLISIS         │
│                              │
│ • Costs                      │
│ • Profitability              │
│ • Dashboard                  │
└──────────────────────────────┘
```

---

# 5. Entidades maestras

Las entidades maestras representan información base utilizada por diferentes procesos del sistema.

Inicialmente se identifican las siguientes:

```text
Presentation
Supply
Supplier
Product
Client
```

## 5.1 Presentation

Representa las características físicas y comerciales de una presentación.

Puede contener información como:

* identificador;
* nombre;
* capacidad;
* unidad;
* tipo de envase;
* tipo de tapa;
* observaciones;
* estado.

Una presentación puede ser utilizada por productos del negocio.

---

## 5.2 Supply

Representa un insumo utilizado en la operación.

Puede ser utilizado en:

* recetas;
* compras;
* movimientos de inventario;
* producción;
* lotes, cuando aplique.

El insumo representa el recurso base utilizado para producir.

---

## 5.3 Supplier

Representa una empresa, persona o entidad que suministra insumos al negocio.

Un proveedor puede:

* ofrecer uno o varios insumos;
* tener diferentes precios registrados;
* participar en múltiples compras.

---

## 5.4 Product

Representa un producto comercializable o producido por el negocio.

Un producto puede estar relacionado con:

* una presentación;
* una receta;
* procesos de producción;
* lotes;
* inventario;
* ventas;
* cálculos de costos y rentabilidad.

---

## 5.5 Client

Representa una persona, negocio o entidad a la que se realizan ventas.

Un cliente puede tener:

* múltiples ventas;
* múltiples pagos;
* historial comercial.

---

# 6. Entidades de relación y configuración

Existen estructuras cuya responsabilidad principal no es representar un maestro independiente ni una operación completa.

Estas estructuras representan relaciones o configuraciones del negocio.

Inicialmente:

```text
SupplierPrice
Recipe
RecipeItem
Configuration
```

---

# 7. SupplierPrice

Representa la relación entre:

```text
Supply
   +
Supplier
```

Esta estructura permite registrar información comercial asociada a la adquisición de un insumo.

Conceptualmente:

```text
Supplier
    │
    │
    ├──────────────┐
    │              │
    ▼              ▼
SupplierPrice ◄── Supply
```

Puede contener información relacionada con:

* presentación de compra;
* cantidad de la presentación;
* unidad;
* equivalencia a unidad base;
* precio de compra;
* costo por unidad base;
* fecha de registro;
* fecha de última compra.

`SupplierPrice` no debe interpretarse como un proveedor ni como un insumo.

Representa una relación comercial entre ambos.

---

# 8. Recipe

Una receta define la composición necesaria para producir un producto.

La relación conceptual es:

```text
Product
   │
   │ 1
   ▼
Recipe
   │
   │ 1
   ▼
RecipeItem
   │
   │ N
   ▼
Supply
```

Una receta contiene uno o varios ingredientes o insumos.

La estructura debe permitir conservar:

* producto asociado;
* rendimiento;
* unidad de producción;
* estado;
* observaciones.

Los componentes de la receta se almacenan en `RecipeItem`.

---

# 9. RecipeItem

Representa un componente individual de una receta.

Cada elemento relaciona:

```text
Recipe
   +
Supply
```

y define la cantidad necesaria del insumo para la receta.

Regla conceptual:

> Un mismo insumo no debe aparecer repetidamente dentro de la misma receta.

La forma de proteger esta regla se definirá posteriormente en el modelo relacional y en las reglas de aplicación.

---

# 10. Documentos transaccionales

El sistema utiliza operaciones compuestas por una estructura principal y uno o varios detalles.

El patrón conceptual oficial es:

```text
DOCUMENTO
    │
    ├── información general
    │
    └── DETALLES[]
```

Este patrón se aplica inicialmente a:

```text
Purchase
└── PurchaseItem[]

Production
└── ProductionItem[]

Sale
└── SaleItem[]
```

Los detalles no constituyen módulos independientes.

Pertenecen a la operación principal.

---

# 11. Purchase

Representa una compra realizada por el negocio.

Una compra se relaciona con:

```text
Supplier
```

y contiene:

```text
PurchaseItem[]
```

Conceptualmente:

```text
Supplier
    │
    │ 1
    ▼
Purchase
    │
    │ 1
    ▼
PurchaseItem
    │
    │ N
    ▼
Supply
```

La compra constituye una operación histórica.

La información registrada en una compra no debe depender exclusivamente del precio actual configurado para un proveedor o insumo.

Los valores relevantes para la operación deberán conservarse como parte del registro histórico correspondiente.

---

# 12. PurchaseItem

Representa cada insumo incluido en una compra.

Cada detalle pertenece a una única compra y está relacionado con un insumo.

Puede conservar información histórica de la operación, incluyendo:

* cantidad;
* unidad;
* precio unitario;
* subtotal;
* otros valores necesarios para reconstruir la compra original.

Una compra puede contener múltiples detalles.

---

# 13. Production

Representa una operación de producción.

Una producción puede:

* utilizar una receta;
* producir uno o varios resultados según la lógica definitiva del proceso;
* consumir insumos;
* generar movimientos de inventario;
* generar o relacionarse con lotes;
* registrar costos asociados.

La estructura conceptual mínima es:

```text
Product
    │
Recipe
    │
    ▼
Production
    │
    ├── ProductionItem[]
    │
    └── Lot / Lots
```

La cardinalidad definitiva entre `Production` y `Lot` deberá definirse en el documento de relaciones.

No debe asumirse todavía una restricción técnica sin validar completamente el flujo operativo.

---

# 14. ProductionItem

Representa el detalle de insumos utilizados durante una producción.

Su propósito es conservar la información real de lo utilizado en la operación.

La relación conceptual es:

```text
Production
    │
    ▼
ProductionItem
    │
    ▼
Supply
```

Este registro debe permitir diferenciar, cuando corresponda:

```text
Cantidad planificada
```

de:

```text
Cantidad realmente utilizada
```

si la lógica de producción requiere conservar ambas.

---

# 15. Lot

Un lote representa una unidad identificable para fines de trazabilidad.

Debe permitir registrar información histórica relacionada con:

* fecha de creación o producción;
* fecha de vencimiento;
* cantidad inicial;
* cantidad disponible;
* unidad;
* estado;
* observaciones.

Conceptualmente:

```text
Production
    │
    ▼
Lot
```

Los lotes participan posteriormente en:

```text
Inventory
```

y:

```text
Sales
```

El modelo original contempla que un lote pueda estar relacionado con un producto o con un insumo.

La regla conceptual pendiente de formalización es:

> Un lote debe pertenecer a exactamente un elemento trazable definido por el modelo: un producto o un insumo, según corresponda.

Esta exclusividad deberá resolverse explícitamente antes de implementar el modelo Prisma.

No se permitirá una interpretación ambigua en la que un mismo lote pertenezca simultáneamente a un producto y a un insumo.

---

# 16. InventoryMovement

Representa un evento histórico que modifica existencias.

Los movimientos pueden originarse en diferentes procesos:

```text
Purchase
    │
    └── entrada de inventario

Production
    │
    ├── salida de insumos
    │
    └── entrada de productos

Sale
    │
    └── salida de productos
```

La estructura conceptual es:

```text
Business Operation
        │
        ▼
InventoryMovement
        │
        ├── entrada
        ├── salida
        ├── referencia
        ├── origen
        └── destino
```

El movimiento debe conservar su referencia a la operación que lo originó.

El inventario no debe perder la capacidad de reconstruir el historial de movimientos.

---

# 17. InventoryBalance

Representa la visión consolidada de las existencias.

Puede contener información como:

* entradas acumuladas;
* salidas acumuladas;
* stock actual;
* costo promedio;
* valor del inventario.

Conceptualmente:

```text
InventoryMovements
        │
        ▼
Inventory Balance
```

Sin embargo, todavía no se establece si `InventoryBalance` será:

1. una estructura persistida;
2. una proyección calculada;
3. una combinación de ambas.

Esta decisión se tomará después de definir completamente:

* relaciones;
* reglas de inventario;
* lotes;
* movimientos;
* consistencia histórica.

La regla actual es:

> No se crearán dos fuentes independientes de verdad para el stock.

---

# 18. Sale

Representa una operación de venta.

Una venta pertenece a un cliente y contiene uno o varios detalles.

Conceptualmente:

```text
Client
    │
    │ 1
    ▼
Sale
    │
    │ 1
    ▼
SaleItem[]
```

Una venta puede afectar:

* inventario;
* lotes;
* cuentas pendientes;
* pagos;
* costos;
* rentabilidad.

---

# 19. SaleItem

Representa cada producto o lote vendido dentro de una venta.

Cada detalle puede conservar históricamente:

* producto;
* lote;
* cantidad;
* precio unitario;
* descuento;
* subtotal;
* costo unitario;
* costo total;
* utilidad.

La información histórica de una venta no debe modificarse automáticamente si posteriormente cambia:

* el precio actual del producto;
* el costo actual;
* la configuración comercial.

---

# 20. CustomerPayment

Representa un pago realizado por un cliente.

La relación conceptual es:

```text
Client
    │
    ▼
Sale
    │
    ▼
CustomerPayment
```

Un cliente puede realizar múltiples pagos.

Una venta puede tener:

```text
0 pagos
1 pago
N pagos
```

La estructura debe permitir reconstruir:

```text
Total de la venta
        -
Pagos registrados
        =
Saldo pendiente
```

No se creará todavía una entidad independiente de cuenta por cobrar.

Si en el futuro se necesita una cuenta corriente o un ledger financiero, deberá justificarse mediante una evolución explícita de la arquitectura.

---

# 21. Expense

Representa un gasto operativo del negocio.

Los gastos pueden afectar:

* costos;
* rentabilidad;
* análisis financiero;
* dashboard.

La estructura específica de clasificación y relación de gastos se definirá en el documento correspondiente de entidades y relaciones.

No debe asumirse que todos los gastos forman parte directamente del costo de producción.

La distinción entre:

```text
Costo
```

y:

```text
Gasto
```

debe mantenerse según las reglas del dominio.

---

# 22. Configuration

Representa parámetros globales configurables del sistema.

No representa una operación comercial ni una entidad maestra del negocio.

Su función es almacenar valores configurables como:

```text
Parameter
Value
Unit
Description
```

La configuración no debe utilizarse como una estructura genérica para almacenar información que debería pertenecer a un dominio específico.

---

# 23. Cost

`Cost` representa una responsabilidad funcional del sistema.

No se considera todavía una entidad persistente independiente.

Los costos pueden derivarse de información procedente de:

```text
Purchases
Production
Inventory
Sales
Expenses
```

Por tanto, inicialmente:

```text
Operational Data
        │
        ▼
Cost Calculation
```

La necesidad de persistir resultados de cálculos deberá justificarse posteriormente.

No se crearán tablas de costos únicamente porque exista un módulo denominado `costs`.

---

# 24. Profitability

La rentabilidad representa información derivada del comportamiento económico del negocio.

Puede analizarse desde diferentes perspectivas:

* por producto;
* por lote;
* por venta;
* por período;
* por cliente, cuando corresponda;
* por operación.

Inicialmente se considera una responsabilidad de cálculo y análisis.

No implica automáticamente:

```text
Profitability table
```

La persistencia de resultados agregados solo será evaluada si existe una necesidad concreta de:

* rendimiento;
* histórico inmutable;
* auditoría;
* reportes precomputados.

---

# 25. Dashboard

El dashboard no constituye una entidad de datos.

Es una capa de consulta y presentación de información procedente de diferentes dominios.

Conceptualmente:

```text
Purchases
Production
Inventory
Sales
Payments
Expenses
Costs
Profitability
        │
        ▼
     Dashboard
```

El dashboard consume información.

No debe convertirse en propietario de la información original.

---

# 26. Mapa general de relaciones

La relación conceptual consolidada es:

```text
PRESENTATION
      │
      ▼
   PRODUCT
      │
      ▼
    RECIPE
      │
      ▼
 RECIPE_ITEM
      │
      ▼
    SUPPLY
      │
      ├─────────────────────┐
      │                     │
      ▼                     ▼
SUPPLIER_PRICE         PURCHASE_ITEM
      │                     │
      ▼                     ▼
  SUPPLIER ◄────────── PURCHASE
                              │
                              ▼
                    INVENTORY MOVEMENT
                              │
                              ▼
                       INVENTORY BALANCE


PRODUCT
   │
   ▼
PRODUCTION
   │
   ├───────────────► PRODUCTION_ITEM ───► SUPPLY
   │
   ▼
 LOT
   │
   ▼
SALE_ITEM
   │
   ▼
 SALE
   │
   ▼
CLIENT
   │
   ▼
CUSTOMER_PAYMENT
```

Las operaciones también se conectan con el inventario:

```text
PURCHASE
    │
    ▼
INVENTORY MOVEMENT
    │
    ▼
INVENTORY BALANCE


PRODUCTION
    │
    ├── consumo de insumos
    │
    └── generación de productos / lotes
                │
                ▼
        INVENTORY MOVEMENT


SALE
    │
    ▼
SALE ITEM
    │
    ▼
INVENTORY MOVEMENT
```

---

# 27. Propiedad de los datos

Cada estructura debe tener una responsabilidad claramente definida.

| Dominio             | Propietario de la información |
| ------------------- | ----------------------------- |
| Presentations       | Presentations                 |
| Supplies            | Supplies                      |
| Suppliers           | Suppliers                     |
| Supplier Prices     | Suppliers / Supplies          |
| Products            | Products                      |
| Recipes             | Recipes                       |
| Purchases           | Purchases                     |
| Inventory Movements | Inventory                     |
| Inventory Balance   | Inventory                     |
| Production          | Production                    |
| Lots                | Lots                          |
| Clients             | Clients                       |
| Sales               | Sales                         |
| Customer Payments   | Payments                      |
| Expenses            | Expenses                      |
| Configuration       | System Configuration          |

Los módulos analíticos:

```text
Costs
Profitability
Dashboard
```

no son propietarios de los datos operativos originales.

Consumen información producida por otros dominios.

---

# 28. Datos históricos

El sistema debe preservar información histórica cuando una operación haya sido registrada.

Esto aplica especialmente a:

```text
Purchase
PurchaseItem

Production
ProductionItem

Lot

Sale
SaleItem

CustomerPayment
```

Cambios posteriores en información maestra no deben alterar automáticamente la reconstrucción histórica de una operación.

Ejemplo:

```text
Un proveedor cambia su precio actual.
```

Eso no debe modificar el precio registrado en una compra histórica.

Del mismo modo:

```text
Un producto cambia su precio de venta.
```

Eso no debe modificar el precio registrado en ventas anteriores.

La estrategia técnica exacta para preservar datos históricos se definirá posteriormente.

---

# 29. Identificadores

Todas las entidades persistentes deberán contar con un identificador único.

Todavía no se define en este documento:

* UUID;
* CUID;
* identificadores secuenciales;
* claves compuestas;
* formato visual de códigos.

Estas decisiones se documentarán en:

```text
03-identifiers.md
```

Los identificadores internos y los códigos visibles para el usuario podrán ser conceptos diferentes.

---

# 30. Estados y ciclos de vida

Varias entidades poseen estados.

Por ejemplo:

```text
Product
Supply
Supplier
Recipe
Lot
Purchase
Production
Sale
```

Este documento no define todavía los estados específicos ni sus transiciones.

Estos serán definidos en:

```text
04-statuses.md
```

La creación de un campo `status` no debe hacerse de forma automática.

Cada estado deberá tener:

* significado;
* valores permitidos;
* transiciones permitidas;
* reglas de modificación.

---

# 31. Datos calculados

El sistema contiene información que puede ser:

```text
Persistida
```

o:

```text
Calculada
```

No se decidirá todavía de forma arbitraria.

Ejemplos:

```text
Stock actual
Costo promedio
Valor de inventario
Saldo pendiente
Costo de producción
Utilidad
Rentabilidad
Indicadores del dashboard
```

Cada dato deberá clasificarse posteriormente como:

```text
SOURCE DATA
```

o:

```text
DERIVED DATA
```

La persistencia de un valor derivado deberá justificarse.

---

# 32. Fuente de verdad y duplicación

El sistema debe evitar mantener múltiples fuentes independientes de verdad para la misma información.

Esto es especialmente importante en:

```text
Inventory
Lots
Costs
Balances
Profitability
```

Por ejemplo:

```text
Inventory Movements
```

y:

```text
Inventory Balance
```

no pueden evolucionar como dos sistemas independientes.

Debe existir una regla clara que determine:

* cuál es la información base;
* qué información se deriva;
* cuándo se recalcula;
* cuándo se persiste una proyección;
* cómo se garantiza la consistencia.

Esta decisión será definida antes de implementar el esquema definitivo de base de datos.

---

# 33. Decisiones pendientes

Antes de crear el modelo Prisma deben resolverse explícitamente las siguientes cuestiones.

## 33.1 Relación Production → Lot

Definir:

```text
¿Una producción genera exactamente un lote?

o

¿Una producción puede generar múltiples lotes?
```

La decisión dependerá del flujo real de producción y trazabilidad.

---

## 33.2 Lotes de insumos y productos

El modelo original contempla lotes asociados a:

```text
Supply
```

o:

```text
Product
```

Debe definirse una estructura que garantice:

> Un lote pertenece a exactamente un elemento trazable según su tipo.

No se implementarán relaciones ambiguas sin una regla de consistencia explícita.

---

## 33.3 Fuente de verdad del inventario

Debe definirse la relación definitiva entre:

```text
InventoryMovement
```

```text
InventoryBalance
```

```text
Lot
```

Antes de crear tablas o modelos Prisma.

---

## 33.4 Persistencia de datos calculados

Debe definirse qué valores se:

```text
calculan en tiempo real
```

y cuáles se:

```text
persisten como proyección
```

Especialmente para:

* inventario;
* costos;
* saldos;
* rentabilidad;
* dashboard.

---

## 33.5 Historial de información maestra

Debe definirse qué información se copia dentro de los documentos transaccionales para garantizar la reconstrucción histórica.

---

# 34. Próximos documentos

La construcción del modelo de datos continuará en este orden:

```text
00-data-model-overview.md
        │
        ▼
01-entities.md
        │
        ▼
02-relationships.md
        │
        ▼
03-identifiers.md
        │
        ▼
04-statuses.md
        │
        ▼
05-historical-data.md
        │
        ▼
06-calculation-rules.md
```

Cada documento deberá ser consistente con:

```text
docs/domains/
```

y con la lógica confirmada en el archivo maestro del sistema anterior.

No se implementará PostgreSQL ni Prisma hasta completar y revisar este conjunto documental.

---

# 35. Regla de implementación

La secuencia oficial será:

```text
DOMINIO
    ↓
MODELO CONCEPTUAL DE DATOS
    ↓
ENTIDADES
    ↓
RELACIONES
    ↓
IDENTIFICADORES
    ↓
ESTADOS
    ↓
HISTORIAL
    ↓
REGLAS DE CÁLCULO
    ↓
REVISIÓN DE CONSISTENCIA
    ↓
MODELO RELACIONAL
    ↓
PRISMA
    ↓
POSTGRESQL
    ↓
MIGRACIONES
    ↓
IMPLEMENTACIÓN
```

> Ninguna estructura de base de datos debe crearse únicamente porque existía una tabla equivalente en el sistema VBA anterior. La estructura anterior es una fuente de referencia para reconstruir la lógica del negocio, pero el modelo definitivo deberá respetar las responsabilidades, relaciones, reglas históricas y fuentes de verdad definidas en esta documentación.
