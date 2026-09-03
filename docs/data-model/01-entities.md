# 01 — ENTIDADES DEL SISTEMA

## 1. Propósito del documento

Este documento define las entidades conceptuales identificadas en el Sistema de Gestión Empresarial de Yogurt.

Su objetivo es establecer, antes de implementar PostgreSQL y Prisma:

* qué información representa cada entidad;
* cuál es su responsabilidad dentro del sistema;
* qué módulo de negocio es responsable de ella;
* cuáles son sus atributos principales;
* cuáles entidades representan información maestra;
* cuáles representan transacciones;
* cuáles representan detalle;
* cuáles representan historial o trazabilidad;
* cuáles son entidades persistentes;
* cuáles representan información calculada o derivada.

Este documento no define todavía:

* tipos definitivos de PostgreSQL;
* sintaxis de Prisma;
* claves foráneas definitivas;
* índices;
* restricciones técnicas;
* cardinalidades completas;
* comportamiento de eliminación;
* implementación del backend.

Esos aspectos serán definidos en documentos posteriores.

La fuente funcional de esta definición es el sistema maestro previamente construido en Excel/VBA y la documentación de dominio derivada de dicho sistema.

---

# 2. Principio de identificación de entidades

Una entidad del sistema no se crea simplemente porque exista una tabla en Excel.

La existencia de una entidad debe corresponder a una responsabilidad real dentro del negocio.

Por esta razón se distinguen cuatro grupos principales:

```text
ENTIDADES MAESTRAS
        ↓
Definen información reutilizable del negocio

ENTIDADES TRANSACCIONALES
        ↓
Registran hechos y operaciones ocurridas

ENTIDADES DE DETALLE
        ↓
Representan líneas o componentes de una operación principal

ENTIDADES DE TRAZABILIDAD
        ↓
Permiten conocer origen, historial, disponibilidad y recorrido
```

Además, existen conceptos que forman parte del sistema pero que no deben asumirse automáticamente como entidades persistentes independientes:

```text
INFORMACIÓN DERIVADA
        ↓
Inventario actual
Costos calculados
Rentabilidad
Indicadores del dashboard
```

La decisión definitiva sobre cuáles de estos conceptos se almacenarán físicamente y cuáles serán calculados será definida posteriormente.

---

# 3. Clasificación general de entidades

El modelo actual identifica las siguientes entidades conceptuales.

## 3.1 Entidades maestras

```text
Presentation
Supply
Supplier
SupplierPrice
Product
Recipe
Client
```

Estas entidades representan información reutilizable que sirve como base para múltiples procesos posteriores.

---

## 3.2 Entidades transaccionales

```text
Purchase
Production
Lot
Sale
Payment
Expense
InventoryMovement
```

Estas entidades representan hechos u operaciones realizadas por el negocio.

---

## 3.3 Entidades de detalle

```text
RecipeDetail
PurchaseDetail
ProductionDetail
SaleDetail
```

Estas entidades no representan procesos autónomos.

Existen como parte de una entidad principal.

Por ejemplo:

```text
Purchase
    ↓
PurchaseDetail

Recipe
    ↓
RecipeDetail

Production
    ↓
ProductionDetail

Sale
    ↓
SaleDetail
```

---

## 3.4 Información derivada o consolidada

```text
Inventory
Cost
Profitability
Dashboard
```

Estos conceptos existen funcionalmente dentro del sistema, pero no deben ser considerados automáticamente entidades persistentes equivalentes a:

```text
Product
Purchase
Sale
Lot
```

Su naturaleza definitiva será analizada posteriormente.

---

# 4. Entidad: Presentation

## Nombre técnico

```text
Presentation
```

## Módulo responsable

```text
presentations
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa la presentación física o comercial utilizada para comercializar un producto.

Una presentación define las características generales del envase o formato.

Ejemplos conceptuales:

```text
Vaso de 8 oz
Vaso de 12 oz
Envase de 1 litro
Presentación familiar
```

La presentación puede ser utilizada por uno o varios productos.

## Identificador

```text
ID_Presentacion
```

## Atributos identificados

```text
ID_Presentacion
Nombre_Presentacion
Cantidad_Oz
Cantidad_ml
Tipo_Envase
Activo
Observaciones
```

En versiones posteriores del sistema maestro también aparece el atributo:

```text
Tapilla
```

Este atributo deberá mantenerse como concepto pendiente de consolidación técnica con la definición final del dominio de Presentaciones, evitando eliminarlo únicamente por la existencia de una versión anterior de la estructura.

## Responsabilidad

Presentation es responsable de definir:

```text
Nombre de la presentación
Capacidad
Unidad de referencia
Tipo de envase
Características asociadas al envase
Estado operativo
Observaciones
```

No es responsable de:

```text
Definir el precio de venta
Definir la receta
Controlar inventario
Registrar producción
Registrar ventas
Calcular rentabilidad
```

---

# 5. Entidad: Supply

## Nombre técnico

```text
Supply
```

## Módulo responsable

```text
supplies
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa un insumo utilizado por el negocio.

Un insumo puede participar en procesos como:

```text
Compras
Recetas
Producción
Inventario
Lotes
Costos
```

## Identificador

```text
ID_Insumo
```

## Atributos identificados

```text
ID_Insumo
Nombre_Insumo
Categoria
Subcategoria
Marca
Unidad_Base
Stock_Minimo
Activo
Observaciones
```

## Responsabilidad

Supply define:

```text
Identidad del insumo
Clasificación
Marca
Unidad base de control
Stock mínimo
Estado
Observaciones
```

No representa:

```text
Una compra específica
Un lote específico
Un precio histórico específico
Una existencia actual
```

Esos conceptos pertenecen a otras entidades.

---

# 6. Entidad: Supplier

## Nombre técnico

```text
Supplier
```

## Módulo responsable

```text
suppliers
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa una persona, empresa u organización que suministra insumos al negocio.

## Identificador

```text
ID_Proveedor
```

## Atributos identificados

```text
ID_Proveedor
Nombre_Proveedor
NIT_Cedula
Nombre_Contacto
Telefono
Email
Direccion
Activo
Observaciones
```

## Responsabilidad

Supplier administra la información general del proveedor.

No representa:

```text
Una compra
Un precio histórico
Un lote recibido
Una deuda específica
```

---

# 7. Entidad: SupplierPrice

## Nombre técnico

```text
SupplierPrice
```

## Módulo responsable

```text
suppliers
```

## Tipo

```text
Entidad maestra con información histórica de referencia
```

## Propósito

Representa la relación comercial entre:

```text
Supply
        +
Supplier
```

y permite registrar información relacionada con la presentación de compra y su costo.

## Identificador

```text
ID_Precio
```

## Atributos identificados

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

## Responsabilidad

SupplierPrice permite conservar información como:

```text
Qué proveedor vende un insumo
Cómo se presenta comercialmente
Qué cantidad representa
Cuál es su equivalencia en la unidad base
Cuál es el precio registrado
Cuál es el costo por unidad base
Cuándo se registró
Cuándo se realizó la última compra registrada
```

No reemplaza a:

```text
Purchase
PurchaseDetail
```

Una compra representa un hecho histórico.

SupplierPrice representa información comercial asociada a la relación entre un insumo y un proveedor.

---

# 8. Entidad: Product

## Nombre técnico

```text
Product
```

## Módulo responsable

```text
products
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa un producto comercializable por el negocio.

Un producto puede estar asociado a:

```text
Presentation
Recipe
Production
Lot
Sale
Inventory
Cost
Profitability
```

## Identificador

```text
ID_Producto
```

## Atributos identificados

```text
ID_Producto
Nombre_Producto
ID_Presentacion
Categoria_Producto
Descripcion
Canal_Venta
Precio_Venta
Margen_Objetivo
Activo
Observaciones
```

## Responsabilidad

Product define:

```text
Identidad comercial
Nombre
Presentación
Categoría
Descripción
Canal de venta
Precio de venta
Margen objetivo
Estado
Observaciones
```

No representa:

```text
Una receta específica ejecutada
Una producción realizada
Un lote físico
Una venta específica
Existencia actual
```

---

# 9. Entidad: Recipe

## Nombre técnico

```text
Recipe
```

## Módulo responsable

```text
recipes
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa la definición de una receta asociada a un producto.

La receta establece la composición teórica necesaria para producir un determinado rendimiento.

## Identificador

```text
ID_Receta
```

## Atributos identificados

```text
ID_Receta
ID_Producto
Nombre_Receta
Rendimiento_Base
Unidad_Rendimiento
Activo
Observaciones
```

## Responsabilidad

Recipe define:

```text
Producto asociado
Identidad de la receta
Nombre
Rendimiento esperado
Unidad del rendimiento
Estado
Observaciones
```

Los insumos y cantidades específicas no pertenecen directamente a Recipe como una lista de campos.

Se representan mediante:

```text
RecipeDetail
```

---

# 10. Entidad: RecipeDetail

## Nombre técnico

```text
RecipeDetail
```

## Módulo responsable

```text
recipes
```

## Tipo

```text
Entidad de detalle
```

## Propósito

Representa cada insumo utilizado dentro de una receta.

## Identificador

```text
ID_Detalle_Receta
```

## Atributos identificados

```text
ID_Detalle_Receta
ID_Receta
ID_Insumo
Cantidad_Requerida
Unidad
Merma_Porcentaje
Observaciones
```

En una estructura posterior del sistema maestro aparece también:

```text
Activo
```

La necesidad definitiva de conservar este atributo en el modelo técnico deberá seguir la definición consolidada del módulo Recipes.

## Responsabilidad

RecipeDetail representa:

```text
Qué insumo participa
Qué cantidad se requiere
En qué unidad se expresa
Qué merma porcentual se contempla
Observaciones específicas
```

No es una entidad autónoma.

Su existencia depende de una receta.

---

# 11. Entidad: Purchase

## Nombre técnico

```text
Purchase
```

## Módulo responsable

```text
purchases
```

## Tipo

```text
Entidad transaccional
```

## Propósito

Representa una operación de compra realizada por el negocio.

Una compra representa un hecho histórico.

## Identificador

```text
ID_Compra
```

## Atributos identificados

```text
ID_Compra
Fecha_Compra
ID_Proveedor
Numero_Factura
Estado_Pago
Total_Compra
Observaciones
```

## Responsabilidad

Purchase representa:

```text
Cuándo se realizó la compra
A qué proveedor se realizó
Número de factura o referencia
Estado de pago
Valor total
Observaciones
```

Los artículos comprados no pertenecen como campos repetidos dentro de Purchase.

Se representan mediante:

```text
PurchaseDetail
```

---

# 12. Entidad: PurchaseDetail

## Nombre técnico

```text
PurchaseDetail
```

## Módulo responsable

```text
purchases
```

## Tipo

```text
Entidad de detalle transaccional
```

## Propósito

Representa cada insumo incluido dentro de una compra.

## Identificador

```text
ID_Detalle_Compra
```

## Atributos identificados

```text
ID_Detalle_Compra
ID_Compra
ID_Insumo
Cantidad_Comprada
Unidad_Compra
Cantidad_Convertida_Base
Costo_Total
Costo_Unidad_Base
Fecha_Vencimiento
Lote_Proveedor
Observaciones
```

## Responsabilidad

PurchaseDetail conserva información específica de cada línea comprada.

Incluye:

```text
Insumo adquirido
Cantidad comprada
Unidad de compra
Conversión a unidad base
Costo total
Costo por unidad base
Fecha de vencimiento
Lote del proveedor
Observaciones
```

La existencia de:

```text
Fecha_Vencimiento
Lote_Proveedor
```

es relevante para la trazabilidad posterior.

---

# 13. Entidad: InventoryMovement

## Nombre técnico

```text
InventoryMovement
```

## Módulo responsable

```text
inventory
```

## Tipo

```text
Entidad transaccional de trazabilidad
```

## Propósito

Representa un movimiento que afecta la existencia de inventario.

Es uno de los registros fundamentales para conservar historial.

## Identificador

```text
ID_Movimiento
```

## Atributos identificados

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

## Responsabilidad

InventoryMovement registra:

```text
Cuándo ocurrió el movimiento
Qué tipo de movimiento ocurrió
Qué insumo o producto fue afectado
Cuánto entró
Cuánto salió
En qué unidad
Cuál era el costo asociado
Cuál fue el valor total
Qué operación originó el movimiento
Origen
Destino
Observaciones
```

El campo:

```text
ID_Referencia
```

permite relacionar conceptualmente el movimiento con la operación que lo originó.

Ejemplos:

```text
Compra
Producción
Venta
Ajuste
Otro movimiento definido por el sistema
```

La definición exacta de este mecanismo será desarrollada en el documento de relaciones y trazabilidad.

---

# 14. Concepto: Inventory

## Nombre técnico conceptual

```text
Inventory
```

## Módulo responsable

```text
inventory
```

## Tipo

```text
Información derivada o consolidada
```

## Propósito

Representa el estado actual consolidado del inventario.

En el sistema maestro aparece una estructura con los siguientes atributos:

```text
ID_Item
Tipo_Item
Nombre_Item
Unidad_Base
Total_Entradas
Total_Salidas
Stock_Actual
Stock_Minimo
Estado_Stock
Costo_Promedio
Valor_Inventario
```

Esta estructura representa información consolidada.

Por tanto, en esta etapa no se debe asumir automáticamente que:

```text
Inventory
```

será una entidad persistente independiente en PostgreSQL.

Su definición técnica deberá analizarse considerando:

```text
InventoryMovement
Lotes
Existencias actuales
Rendimiento del sistema
Consultas necesarias
```

---

# 15. Entidad: Production

## Nombre técnico

```text
Production
```

## Módulo responsable

```text
production
```

## Tipo

```text
Entidad transaccional
```

## Propósito

Representa un proceso de producción planificado o realizado.

Production es una de las entidades centrales del sistema porque conecta:

```text
Producto
Receta
Insumos
Consumo real
Costos
Lotes
Inventario
```

## Identificador

```text
ID_Produccion
```

## Atributos identificados

```text
ID_Produccion
Fecha_Planificada
Fecha_Produccion
ID_Producto
Cantidad_Planificada
Cantidad_Producida_Real
Estado
Fecha_Vencimiento
Observaciones
```

## Responsabilidad

Production representa:

```text
Cuándo fue planificada
Cuándo fue realizada
Qué producto se produjo
Qué cantidad se esperaba producir
Qué cantidad se produjo realmente
Estado del proceso
Fecha de vencimiento asociada
Lote generado
Observaciones
```

Los insumos teóricos y reales utilizados se representan mediante:

```text
ProductionDetail
```

---

# 16. Entidad: ProductionDetail

## Nombre técnico

```text
ProductionDetail
```

## Módulo responsable

```text
production
```

## Tipo

```text
Entidad de detalle transaccional
```

## Propósito

Representa el consumo de cada insumo dentro de una producción.

Permite comparar:

```text
Consumo esperado
        vs
Consumo real
```

## Identificador

```text
ID_Detalle_Produccion
```

## Atributos identificados

```text
ID_Detalle_Produccion
ID_Produccion
ID_Insumo
Cantidad_Teorica
Cantidad_Real_Utilizada
Diferencia
Unidad
Costo_Teorico
Costo_Real
Observaciones
```

## Responsabilidad

ProductionDetail conserva:

```text
Insumo utilizado
Cantidad teórica
Cantidad real utilizada
Diferencia
Unidad
Costo teórico
Costo real
Observaciones
```

Esta entidad permite preservar información histórica de la producción realizada y no depender exclusivamente de la receta vigente.

---

# 17. Entidad: Lot

## Nombre técnico

```text
Lot
```

## Módulo responsable

```text
lots
```

## Tipo

```text
Entidad transaccional de trazabilidad
```

## Propósito

Representa un lote específico de insumos o productos.

El lote permite controlar la trazabilidad física y temporal de una existencia.

## Identificador

```text
ID_Lote
```

## Atributos identificados

```text
ID_Lote
Tipo_Lote
ID_Produccion
ID_Producto
ID_Insumo
Fecha_Produccion
Fecha_Vencimiento
Cantidad_Inicial
Cantidad_Disponible
Unidad
Estado
Observaciones
```

## Responsabilidad

Lot conserva:

```text
Tipo de lote
Producto o insumo asociado
Fecha de creación o producción
Fecha de vencimiento
Cantidad inicial
Cantidad disponible
Unidad
Estado
Observaciones
```

La fecha de creación y la fecha de vencimiento forman parte de la información necesaria para la trazabilidad.

La lógica actual del sistema contempla tanto:

```text
Lotes de producto
```

como:

```text
Lotes de insumo
```

por lo que esta entidad requiere una definición cuidadosa de relaciones y reglas de integridad antes de implementarse en Prisma.

---

# 18. Entidad: Client

## Nombre técnico

```text
Client
```

## Módulo responsable

```text
clients
```

## Tipo

```text
Entidad maestra
```

## Propósito

Representa un cliente del negocio.

## Identificador

```text
ID_Cliente
```

## Atributos identificados

```text
ID_Cliente
Nombre_Cliente
Tipo_Cliente
Canal
Contacto
Telefono
Direccion
Dias_Credito
Activo
Observaciones
```

## Responsabilidad

Client administra:

```text
Identidad del cliente
Tipo
Canal
Información de contacto
Teléfono
Dirección
Días de crédito
Estado
Observaciones
```

No representa:

```text
Una venta
Un pago
Una deuda específica
```

Esos hechos pertenecen a entidades transaccionales.

---

# 19. Entidad: Sale

## Nombre técnico

```text
Sale
```

## Módulo responsable

```text
sales
```

## Tipo

```text
Entidad transaccional
```

## Propósito

Representa una operación de venta realizada por el negocio.

## Identificador

```text
ID_Venta
```

## Atributos identificados

```text
ID_Venta
Fecha_Venta
ID_Cliente
Canal_Venta
Tipo_Pago
Fecha_Limite_Pago
Total_Venta
Valor_Pagado
Saldo_Pendiente
Estado
Observaciones
```

## Responsabilidad

Sale conserva:

```text
Fecha de venta
Cliente
Canal de venta
Tipo de pago
Fecha límite de pago
Total de la venta
Valor pagado
Saldo pendiente
Estado
Observaciones
```

Los productos vendidos se representan mediante:

```text
SaleDetail
```

---

# 20. Entidad: SaleDetail

## Nombre técnico

```text
SaleDetail
```

## Módulo responsable

```text
sales
```

## Tipo

```text
Entidad de detalle transaccional
```

## Propósito

Representa cada producto vendido dentro de una venta.

También vincula la venta con el lote correspondiente.

## Identificador

```text
ID_Detalle_Venta
```

## Atributos identificados

```text
ID_Detalle_Venta
ID_Venta
ID_Producto
ID_Lote
Cantidad
Precio_Unitario
Descuento
Total_Linea
Costo_Unitario
Utilidad_Unitaria
Utilidad_Total
```

## Responsabilidad

SaleDetail conserva información histórica sobre:

```text
Producto vendido
Lote del cual proviene
Cantidad
Precio unitario aplicado
Descuento
Total de la línea
Costo unitario
Utilidad unitaria
Utilidad total
```

La conservación del costo y utilidad en el detalle es relevante porque los valores históricos de una venta no deben depender necesariamente de modificaciones futuras en:

```text
Precio de producto
Costo actual
Rentabilidad actual
```

---

# 21. Entidad: Payment

## Nombre técnico

```text
Payment
```

## Módulo responsable

```text
payments
```

## Tipo

```text
Entidad transaccional
```

## Propósito

Representa un pago recibido de un cliente asociado a una venta.

## Identificador

```text
ID_Pago
```

## Atributos identificados

```text
ID_Pago
Fecha_Pago
ID_Cliente
ID_Venta
Valor_Pagado
Metodo_Pago
Referencia
Observaciones
```

## Responsabilidad

Payment conserva:

```text
Fecha del pago
Cliente
Venta asociada
Valor recibido
Método de pago
Referencia
Observaciones
```

Payment representa un hecho histórico.

No debe confundirse con:

```text
Saldo_Pendiente
```

El saldo es un valor asociado al estado financiero de una venta.

El pago representa una operación concreta registrada.

---

# 22. Entidad: Expense

## Nombre técnico

```text
Expense
```

## Módulo responsable

```text
expenses
```

## Tipo

```text
Entidad transaccional
```

## Propósito

Representa un gasto registrado dentro de la operación del negocio.

## Identificador

```text
ID_Gasto
```

## Atributos identificados

```text
ID_Gasto
Fecha
Categoria
Descripcion
Valor
Tipo_Gasto
Periodo
Observaciones
```

## Responsabilidad

Expense registra:

```text
Fecha
Categoría
Descripción
Valor
Tipo de gasto
Período
Observaciones
```

No debe confundirse con el costo directo de:

```text
Un insumo
Una producción
Un producto vendido
```

Expense representa un registro económico propio del módulo de gastos.

---

# 23. Concepto: Cost

## Nombre técnico conceptual

```text
Cost
```

## Módulo responsable

```text
costs
```

## Tipo

```text
Información de cálculo y análisis
```

## Propósito

El módulo Costs existe para determinar y analizar costos asociados a la operación del negocio.

La información base para estos cálculos proviene de entidades existentes como:

```text
Supply
SupplierPrice
PurchaseDetail
Recipe
RecipeDetail
Production
ProductionDetail
Lot
SaleDetail
Expense
```

En esta etapa no se define una entidad persistente independiente llamada:

```text
Cost
```

La necesidad de persistir resultados de cálculo deberá justificarse posteriormente según:

```text
Necesidad histórica
Rendimiento
Auditoría
Reproducibilidad de cálculos
Reportes
```

---

# 24. Concepto: Profitability

## Nombre técnico conceptual

```text
Profitability
```

## Módulo responsable

```text
profitability
```

## Tipo

```text
Información derivada de análisis
```

## Propósito

Representa indicadores y cálculos relacionados con:

```text
Ingresos
Costos
Utilidades
Márgenes
Resultados por producto
Resultados por venta
Resultados por período
```

La información necesaria proviene principalmente de:

```text
Sale
SaleDetail
Purchase
PurchaseDetail
Production
ProductionDetail
Expense
```

No se define todavía:

```text
Profitability
```

como una entidad persistente autónoma.

Primero deberá establecerse si los valores serán:

```text
Calculados bajo demanda
Materializados
Almacenados como históricos
O una combinación de los anteriores
```

---

# 25. Concepto: Dashboard

## Nombre técnico conceptual

```text
Dashboard
```

## Módulo responsable

```text
dashboard
```

## Tipo

```text
Capa de consulta y consolidación
```

## Propósito

Dashboard consolida información proveniente de diferentes áreas del sistema.

No representa inicialmente una entidad de negocio independiente.

Puede utilizar información de:

```text
Inventory
Production
Sales
Payments
Expenses
Costs
Profitability
Lots
```

Por tanto, en esta etapa no se define una tabla:

```text
Dashboard
```

como parte del modelo de persistencia.

Su implementación dependerá posteriormente de las necesidades reales de consulta y rendimiento.

---

# 26. Resumen de entidades persistentes identificadas

Con base en la lógica reconstruida del sistema maestro, las entidades candidatas principales a persistencia son:

```text
Presentation
Supply
Supplier
SupplierPrice
Product
Recipe
RecipeDetail
Purchase
PurchaseDetail
InventoryMovement
Production
ProductionDetail
Lot
Client
Sale
SaleDetail
Payment
Expense
```

Esta lista representa el mapa actual de entidades conceptuales identificadas.

No significa todavía que los nombres técnicos definitivos, tablas o modelos Prisma deban utilizar exactamente estos nombres.

La implementación técnica será definida posteriormente.

---

# 27. Resumen por módulo

```text
presentations
└── Presentation


supplies
└── Supply


suppliers
├── Supplier
└── SupplierPrice


products
└── Product


recipes
├── Recipe
└── RecipeDetail


purchases
├── Purchase
└── PurchaseDetail


inventory
└── InventoryMovement

Concepto derivado:
└── Inventory


production
├── Production
└── ProductionDetail


lots
└── Lot


clients
└── Client


sales
├── Sale
└── SaleDetail


payments
└── Payment


expenses
└── Expense


costs
└── Información derivada de cálculo


profitability
└── Información derivada de análisis


dashboard
└── Información consolidada de consulta
```

---

# 28. Entidades que no deben convertirse automáticamente en módulos independientes

Las siguientes entidades forman parte de módulos existentes y no deben convertirse automáticamente en módulos autónomos:

```text
RecipeDetail
→ recipes


PurchaseDetail
→ purchases


ProductionDetail
→ production


SaleDetail
→ sales
```

Esto mantiene la regla definida para el sistema:

> Los módulos se definen por responsabilidades de negocio y no por cada tabla o estructura de almacenamiento.

---

# 29. Entidades que requieren especial cuidado técnico

Antes de construir el modelo en Prisma, existen entidades cuya implementación requiere decisiones adicionales.

## SupplierPrice

Debe definirse con precisión:

```text
Qué representa como registro histórico
Qué información puede actualizarse
Cómo se relaciona con compras reales
Cómo se conserva el historial de precios
```

---

## InventoryMovement

Debe definirse:

```text
Qué tipos de movimientos existen
Qué operaciones pueden originarlos
Cómo se referencia la operación de origen
Qué datos son inmutables
Cómo afecta el inventario consolidado
```

---

## Production

Debe definirse:

```text
Relación con Recipe
Relación con ProductionDetail
Relación con Lot
Generación de movimientos de inventario
Estados del proceso
```

---

## Lot

Debe definirse:

```text
Diferenciación entre lote de insumo y lote de producto
Relación con compra
Relación con producción
Fecha de creación
Fecha de producción
Fecha de vencimiento
Cantidad inicial
Cantidad disponible
Estados
Trazabilidad hacia ventas y movimientos
```

---

## Sale

Debe definirse:

```text
Estados de venta
Relación con pagos
Cálculo y actualización del saldo
Relación con inventario
Relación con lotes
Conservación histórica de precios y costos
```

---

## Payment

Debe definirse:

```text
Relación exacta con Sale
Actualización del valor pagado
Actualización del saldo pendiente
Reglas para pagos parciales
Estados derivados de la venta
```

---

# 30. Información histórica que ya aparece en las entidades identificadas

El sistema maestro contiene varios campos que evidencian la necesidad de conservar información histórica.

Entre ellos:

```text
Fecha_Registro
Fecha_Ultima_Compra
Fecha_Compra
Fecha_Vencimiento
Fecha_Planificada
Fecha_Produccion
Fecha_Venta
Fecha_Limite_Pago
Fecha_Pago
```

También existen valores históricos relacionados con:

```text
Costo_Unidad_Base
Costo_Total
Costo_Teorico
Costo_Real
Precio_Unitario
Descuento
Total_Linea
Costo_Unitario
Utilidad_Unitaria
Utilidad_Total
```

La existencia de estos valores debe ser considerada en el siguiente documento para evitar construir relaciones que hagan depender el historial de datos maestros modificables.

---

# 31. Principio de responsabilidad de las entidades

Cada entidad debe mantener una responsabilidad clara.

```text
Presentation
→ Define cómo se presenta comercialmente un producto.


Supply
→ Define el insumo.


Supplier
→ Define quién suministra.


SupplierPrice
→ Define información comercial entre proveedor e insumo.


Product
→ Define el producto comercializable.


Recipe
→ Define la fórmula o composición base.


RecipeDetail
→ Define cada componente de la receta.


Purchase
→ Registra una operación de compra.


PurchaseDetail
→ Registra cada insumo adquirido.


InventoryMovement
→ Registra un cambio histórico en inventario.


Production
→ Registra una operación de producción.


ProductionDetail
→ Registra el consumo teórico y real de insumos.


Lot
→ Identifica y controla una existencia trazable.


Client
→ Define al cliente.


Sale
→ Registra una operación de venta.


SaleDetail
→ Registra cada producto vendido y su lote.


Payment
→ Registra un pago recibido.


Expense
→ Registra un gasto operativo o administrativo.
```

---

# 32. Límites actuales del documento

Este documento establece únicamente el inventario conceptual de entidades identificado hasta este punto.

No debe utilizarse todavía para:

```text
Crear schema.prisma
Crear migraciones
Crear tablas PostgreSQL
Definir relaciones definitivas
Crear foreign keys
Crear repositories
Crear endpoints
```

Antes de llegar a esa fase deben definirse formalmente las relaciones.

---

# 33. Próximo documento

El siguiente documento del modelo técnico será:

```text
02-relationships.md
```

Este documento deberá definir, sin introducir relaciones ajenas a la lógica original:

```text
Qué entidades se relacionan
Por qué se relacionan
Qué entidad depende de cuál
Cuál es la cardinalidad conceptual
Qué relaciones representan composición
Qué relaciones representan referencia
Qué relaciones participan en la trazabilidad
Qué relaciones deben conservar información histórica
```

La secuencia oficial continúa así:

```text
00-data-model-overview.md
        ↓
01-entities.md
        ↓
02-relationships.md
        ↓
03-data-integrity-rules.md
        ↓
04-history-and-traceability.md
        ↓
05-data-model-decisions.md
        ↓
Modelo Prisma
        ↓
Migraciones PostgreSQL
```
