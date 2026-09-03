# Database Implementation Readiness Review

**Fecha de ejecución:** 2026-08-28  
**Estado:** READY FOR PRISMA IMPLEMENTATION  
**Alcance:** Auditoría y preparación conceptual para la preimplementación de base de datos y Prisma sobre el modelo documentado.

---

## 1. Documentos revisados

Se realizó una auditoría técnica profunda y exhaustiva sobre toda la documentación del proyecto relacionada con el modelo de datos, la arquitectura de persistencia, las fronteras transaccionales y los planes de implementación:

### 1.1. Documentación del Modelo de Datos
- `docs/domains/data/00-data-model-overview.md`: Visión general del modelo conceptual y capas de datos.
- `docs/domains/data/01-entities.md`: Catálogo de entidades maestras, transaccionales, de detalle y conceptos derivados.
- `docs/domains/data/02-relationships.md`: Mapa completo de relaciones conceptuales, cardinalidades y dependencias.
- `docs/domains/data/03-data-integrity-rules.md`: Reglas de integridad referencial, unicidad y validaciones operativas.
- `docs/domains/data/04-history-and-traceability.md`: Principios de inmutabilidad histórica, snapshots de precios/costos y auditoría.
- `docs/domains/data/05-data-model-decisions.md`: Decisiones estructurales consolidadas del modelo de datos.
- `docs/domains/data/06-inventory-flow.md`: Flujo integral de inventario (entradas, consumos, productos terminados y salidas).
- `docs/domains/data/07-business-processes.md`: Procesos de negocio de compras, producción, ventas y recaudo.
- `docs/domains/data/08-cross-module-rules.md`: Reglas de interacción y límites de propiedad entre módulos.
- `docs/domains/data/09-calculation-responsibilities.md`: Matriz de autoridad exclusiva para cálculos del sistema.
- `docs/domains/data/10-technical-implementation-notes.md`: Directrices técnicas para PostgreSQL, Prisma y NestJS.
- `docs/data-model/11-model-validation.md`: Validación cruzada del modelo V1.
- `docs/data-model/12-vba-fidelity-validation.md`: Validación de fidelidad contra el sistema maestro original VBA.

### 1.2. Documentación de Implementación
- `docs/implementation/02-database-implementation-plan.md`: Plan de implementación de la base de datos.
- `docs/implementation/05-prisma-implementation-plan.md`: Plan de implementación progresiva con Prisma ORM.

### 1.3. Documentación de Arquitectura Backend y Límites
- `docs/backend/04-persistence-boundaries.md`: Límites y propiedad de la persistencia por módulo.
- `docs/backend/05-transaction-boundaries.md`: Límites transaccionales y operaciones atómicas.
- `docs/backend/08-backend-decisions.md`: Decisiones técnicas de backend consolidadas.

---

## 2. Modelos confirmados

Con base en la documentación analizada, se identifican y confirman los siguientes modelos agrupados por su naturaleza funcional y de persistencia:

### 2.1. Modelos Maestros (CONFIRMADO)
1. **`Presentation`**
   - *Módulo:* `presentations`
   - *Identificador:* `ID_Presentacion`
   - *Atributos clave:* `Nombre_Presentacion`, `Cantidad_Oz`, `Cantidad_ml`, `Tipo_Envase`, `Activo`, `Observaciones` (y `Tapilla` como atributo opcional).
   - *Responsabilidad:* Características físicas y comerciales del envase/formato.
2. **`Supply`**
   - *Módulo:* `supplies`
   - *Identificador:* `ID_Insumo`
   - *Atributos clave:* `Nombre_Insumo`, `Categoria`, `Subcategoria`, `Marca`, `Unidad_Base`, `Stock_Minimo`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Catálogo de insumos y materiales requeridos para producción.
3. **`Supplier`**
   - *Módulo:* `suppliers`
   - *Identificador:* `ID_Proveedor`
   - *Atributos clave:* `Nombre_Proveedor`, `NIT_Cedula`, `Nombre_Contacto`, `Telefono`, `Email`, `Direccion`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Directorio de proveedores de insumos.
4. **`SupplierPrice`**
   - *Módulo:* `suppliers`
   - *Identificador:* `ID_Precio`
   - *Atributos clave:* `ID_Insumo`, `ID_Proveedor`, `Presentacion_Compra`, `Cantidad_Presentacion`, `Unidad_Presentacion`, `Cantidad_Equivalente_Base`, `Precio_Compra`, `Costo_Unidad_Base`, `Fecha_Registro`, `Fecha_Ultima_Compra`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Catálogo de precios comerciales de insumos por proveedor con equivalencia a unidad base.
5. **`Product`**
   - *Módulo:* `products`
   - *Identificador:* `ID_Producto`
   - *Atributos clave:* `Nombre_Producto`, `ID_Presentacion`, `Categoria_Producto`, `Descripcion`, `Canal_Venta`, `Precio_Venta`, `Margen_Objetivo`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Catálogo de productos comercializables y producidos.
6. **`Recipe`**
   - *Módulo:* `recipes`
   - *Identificador:* `ID_Receta`
   - *Atributos clave:* `ID_Producto`, `Nombre_Receta`, `Rendimiento_Base`, `Unidad_Rendimiento`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Cabecera de la fórmula teórica de producción por producto.
7. **`Client`**
   - *Módulo:* `clients`
   - *Identificador:* `ID_Cliente`
   - *Atributos clave:* `Nombre_Cliente`, `Tipo_Cliente`, `Canal`, `Contacto`, `Telefono`, `Direccion`, `Dias_Credito`, `Activo`, `Observaciones`.
   - *Responsabilidad:* Directorio de clientes comerciales.

### 2.2. Modelos de Detalle (CONFIRMADO)
8. **`RecipeDetail`**
   - *Módulo:* `recipes`
   - *Identificador:* `ID_Detalle_Receta`
   - *Atributos clave:* `ID_Receta`, `ID_Insumo`, `Cantidad_Requerida`, `Unidad`, `Merma_Porcentaje`, `Observaciones` (y `Activo` opcional).
   - *Responsabilidad:* Insumos y proporciones requeridas en una receta.
9. **`PurchaseDetail`**
   - *Módulo:* `purchases`
   - *Identificador:* `ID_Detalle_Compra`
   - *Atributos clave:* `ID_Compra`, `ID_Insumo`, `Cantidad_Comprada`, `Unidad_Compra`, `Cantidad_Convertida_Base`, `Costo_Total`, `Costo_Unidad_Base`, `Fecha_Vencimiento`, `Lote_Proveedor`, `Observaciones`.
   - *Responsabilidad:* Líneas de insumos adquiridos en una orden de compra.
10. **`ProductionDetail`**
    - *Módulo:* `production`
    - *Identificador:* `ID_Detalle_Produccion`
    - *Atributos clave:* `ID_Produccion`, `ID_Insumo`, `Cantidad_Teorica`, `Cantidad_Real_Utilizada`, `Diferencia`, `Unidad`, `Costo_Teorico`, `Costo_Real`, `Observaciones`.
    - *Responsabilidad:* Insumos teóricos vs. reales consumidos en una producción.
11. **`SaleDetail`**
    - *Módulo:* `sales`
    - *Identificador:* `ID_Detalle_Venta`
    - *Atributos clave:* `ID_Venta`, `ID_Producto`, `ID_Lote`, `Cantidad`, `Precio_Unitario`, `Descuento`, `Total_Linea`, `Costo_Unitario`, `Utilidad_Unitaria`, `Utilidad_Total`.
    - *Responsabilidad:* Líneas de productos y lotes vendidos con snapshot histórico de precios y costos.

### 2.3. Modelos Transaccionales y de Trazabilidad (CONFIRMADO)
12. **`Purchase`**
    - *Módulo:* `purchases`
    - *Identificador:* `ID_Compra`
    - *Atributos clave:* `Fecha_Compra`, `ID_Proveedor`, `Numero_Factura`, `Estado_Pago`, `Total_Compra`, `Observaciones`.
    - *Responsabilidad:* Cabecera de la operación comercial de compra.
13. **`Production`**
    - *Módulo:* `production`
    - *Identificador:* `ID_Produccion`
    - *Atributos clave:* `Fecha_Planificada`, `Fecha_Produccion`, `ID_Producto`, `Cantidad_Planificada`, `Cantidad_Producida_Real`, `Estado`, `Fecha_Vencimiento`, `ID_Lote`, `Observaciones`.
    - *Responsabilidad:* Registro del hecho de fabricación/transformación.
14. **`Lot`**
    - *Módulo:* `lots`
    - *Identificador:* `ID_Lote`
    - *Atributos clave:* `Tipo_Lote`, `ID_Producto`, `ID_Insumo`, `Fecha_Produccion`, `Fecha_Vencimiento`, `Cantidad_Inicial`, `Cantidad_Disponible`, `Unidad`, `Estado`, `Observaciones`.
    - *Responsabilidad:* Unidad física de existencia trazable con vencimiento y control de disponibilidad.
15. **`InventoryMovement`**
    - *Módulo:* `inventory`
    - *Identificador:* `ID_Movimiento`
    - *Atributos clave:* `Fecha`, `Tipo_Movimiento`, `ID_Insumo`, `ID_Producto`, `Cantidad_Entrada`, `Cantidad_Salida`, `Unidad`, `Costo_Unitario`, `Costo_Total`, `ID_Referencia`, `Origen`, `Destino`, `Observaciones`.
    - *Responsabilidad:* Registro inmutable de cada evento que altera existencias (única fuente de verdad de variación de stock).
16. **`Sale`**
    - *Módulo:* `sales`
    - *Identificador:* `ID_Venta`
    - *Atributos clave:* `Fecha_Venta`, `ID_Cliente`, `Canal_Venta`, `Tipo_Pago`, `Fecha_Limite_Pago`, `Total_Venta`, `Valor_Pagado`, `Saldo_Pendiente`, `Estado`, `Observaciones`.
    - *Responsabilidad:* Operación comercial de venta y estado financiero de la cuenta.
17. **`Payment`**
    - *Módulo:* `payments`
    - *Identificador:* `ID_Pago`
    - *Atributos clave:* `Fecha_Pago`, `ID_Cliente`, `ID_Venta`, `Valor_Pagado`, `Metodo_Pago`, `Referencia`, `Observaciones`.
    - *Responsabilidad:* Registro financiero del recaudo/abono a una venta.
18. **`Expense`**
    - *Módulo:* `expenses`
    - *Identificador:* `ID_Gasto`
    - *Atributos clave:* `Fecha`, `Categoria`, `Descripcion`, `Valor`, `Tipo_Gasto`, `Periodo`, `Observaciones`.
    - *Responsabilidad:* Registro de egresos operativos y administrativos.
19. **`Configuration`**
    - *Módulo:* `configuration` (sistema)
    - *Identificador:* Clave primaria de configuración (`Parametro` o `ID_Configuracion`)
    - *Atributos clave:* `Parametro`, `Valor`, `Unidad`, `Descripcion`.
    - *Responsabilidad:* Parámetros globales del sistema.

### 2.4. Conceptos Derivados / Capas de Consulta (NO PERSISTENTES COMO MODELOS EN V1 - CONFIRMADO)
- **`Inventory` (`InventoryBalance`)**: Saldo consolidado calculado a partir de `InventoryMovement` (no se crea tabla independiente redundante en V1 sin justificación de rendimiento).
- **`Cost`**: Responsabilidad funcional de cálculo dinámico basada en compras, producción y gastos (no genera tabla independiente).
- **`Profitability`**: Responsabilidad funcional de análisis económico bajo demanda (no genera tabla independiente).
- **`Dashboard`**: Capa de consulta y agregación (no genera tabla independiente).

---

## 3. Relaciones confirmadas

| ID | Modelo Origen | Relación / Cardinalidad | Modelo Relacionado | Justificación y Estado |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | `Presentation` | `1 : N` | `Product` | **CONFIRMADO**. Un producto requiere una presentación obligatoria. No se duplica nombre + presentación. |
| **R-02** | `Supplier` | `1 : N` | `SupplierPrice` | **CONFIRMADO**. Un proveedor ofrece múltiples precios/catálogos de insumos. |
| **R-03** | `Supply` | `1 : N` | `SupplierPrice` | **CONFIRMADO**. Un insumo puede ser cotizado por múltiples proveedores. |
| **R-04** | `Product` | `1 : N` | `Recipe` | **CONFIRMADO**. Un producto puede tener una o varias recetas registradas. |
| **R-05** | `Recipe` | `1 : N` | `RecipeDetail` | **CONFIRMADO**. Composición de ingredientes de la receta (cabecera-detalle). |
| **R-06** | `Supply` | `1 : N` | `RecipeDetail` | **CONFIRMADO**. Cada línea de detalle utiliza un insumo. Unicidad `(ID_Receta, ID_Insumo)`. |
| **R-07** | `Supplier` | `1 : N` | `Purchase` | **CONFIRMADO**. La compra se realiza a un proveedor existente. |
| **R-08** | `Purchase` | `1 : N` | `PurchaseDetail` | **CONFIRMADO**. Líneas de insumos comprados (cabecera-detalle). |
| **R-09** | `Supply` | `1 : N` | `PurchaseDetail` | **CONFIRMADO**. Insumo adquirido con costo histórico y factor de conversión. |
| **R-10** | `Product` | `1 : N` | `Production` | **CONFIRMADO**. La producción fabrica un producto específico. |
| **R-11** | `Production` | `1 : N` | `ProductionDetail`| **CONFIRMADO**. Insumos reales vs. teóricos utilizados en la orden. |
| **R-12** | `Supply` | `1 : N` | `ProductionDetail`| **CONFIRMADO**. Insumo consumido en la producción. |
| **R-13** | `Production` | `1 : N` *(o 1:1)* | `Lot` | **CONFIRMADO** *(con ambigüedad A-03 sobre cardinalidad 1:1 vs 1:N)*. Generación de lote trazable. |
| **R-14** | `Product` | `1 : N` | `Lot` | **CONFIRMADO**. Lote asociado al producto terminado. |
| **R-15** | `Client` | `1 : N` | `Sale` | **CONFIRMADO**. Venta efectuada a un cliente identificado. |
| **R-16** | `Sale` | `1 : N` | `SaleDetail` | **CONFIRMADO**. Líneas de productos vendidos (cabecera-detalle). |
| **R-17** | `Product` | `1 : N` | `SaleDetail` | **CONFIRMADO**. Producto vendido en la línea. |
| **R-18** | `Lot` | `1 : N` | `SaleDetail` | **CONFIRMADO**. Lote del cual se descuenta la existencia vendida. |
| **R-19** | `Client` | `1 : N` | `Payment` | **CONFIRMADO**. Cliente que efectúa el pago. |
| **R-20** | `Sale` | `1 : N` | `Payment` | **CONFIRMADO**. Venta que recibe el pago o abono (actualiza saldo pendiente). |
| **R-21** | `Supply` / `Product` | `1 : N` | `InventoryMovement` | **CONFIRMADO**. Elemento inventariable afectado por el movimiento. |
| **R-22** | Transacciones (`Purchase`, `Production`, `Sale`) | `1 : N` | `InventoryMovement` | **CONFIRMADO**. Trazabilidad mediante `ID_Referencia` y `Tipo_Movimiento`. |

---

## 4. Estructura documental de modelos propuesta

Se propone organizar físicamente la documentación individual de cada modelo persistente en la estructura `docs/data-model/models/`, creando únicamente los archivos correspondientes a modelos reales y justificados:

```text
docs/data-model/
└── models/
    ├── presentations/
    │   └── presentation.md
    ├── supplies/
    │   └── supply.md
    ├── suppliers/
    │   ├── supplier.md
    │   └── supplier-price.md
    ├── products/
    │   └── product.md
    ├── recipes/
    │   ├── recipe.md
    │   └── recipe-detail.md
    ├── purchases/
    │   ├── purchase.md
    │   └── purchase-detail.md
    ├── inventory/
    │   └── inventory-movement.md
    ├── production/
    │   ├── production.md
    │   └── production-detail.md
    ├── lots/
    │   └── lot.md
    ├── clients/
    │   └── client.md
    ├── sales/
    │   ├── sale.md
    │   └── sale-detail.md
    ├── payments/
    │   └── payment.md
    ├── expenses/
    │   └── expense.md
    └── configuration/
        └── configuration.md
```

> **Nota justificada:** No se crean subcarpetas ni archivos de modelos en `models/costs/`, `models/profitability/` ni `models/dashboard/` porque dichos módulos no poseen tablas ni modelos de persistencia en V1 (sus cálculos son derivados y analíticos bajo demanda).

---

## 5. Estructura documental de relaciones propuesta

Se propone centralizar los documentos de relación individual en `docs/data-model/relationships/`, manteniendo a `docs/data-model/02-relationships.md` como el índice maestro de navegación:

```text
docs/data-model/
└── relationships/
    ├── presentations/
    │   └── presentation-products.md
    ├── suppliers/
    │   ├── supplier-prices.md
    │   └── supplier-purchases.md
    ├── supplies/
    │   ├── supply-prices.md
    │   ├── supply-recipe-details.md
    │   ├── supply-purchase-details.md
    │   └── supply-production-details.md
    ├── products/
    │   ├── product-recipes.md
    │   ├── product-productions.md
    │   ├── product-lots.md
    │   └── product-sale-details.md
    ├── recipes/
    │   └── recipe-details.md
    ├── purchases/
    │   ├── purchase-details.md
    │   └── purchase-inventory-movements.md
    ├── production/
    │   ├── production-details.md
    │   ├── production-lots.md
    │   └── production-inventory-movements.md
    ├── lots/
    │   └── lot-sale-details.md
    ├── clients/
    │   ├── client-sales.md
    │   └── client-payments.md
    ├── sales/
    │   ├── sale-details.md
    │   ├── sale-payments.md
    │   └── sale-inventory-movements.md
    └── inventory/
        └── inventory-movements-traceability.md
```

---

## 6. Mapa modelo ↔ relación

| Modelo | Relaciones que documenta / Referencia | Documentos de Relación Asociados |
| :--- | :--- | :--- |
| **Presentation** | ↔ Product (1:N) | `relationships/presentations/presentation-products.md` |
| **Supply** | ↔ SupplierPrice (1:N), RecipeDetail (1:N), PurchaseDetail (1:N), ProductionDetail (1:N), InventoryMovement (1:N) | `relationships/supplies/*.md` |
| **Supplier** | ↔ SupplierPrice (1:N), Purchase (1:N) | `relationships/suppliers/*.md` |
| **SupplierPrice**| ↔ Supplier (N:1), Supply (N:1) | `relationships/suppliers/supplier-prices.md` |
| **Product** | ↔ Presentation (N:1), Recipe (1:N), Production (1:N), Lot (1:N), SaleDetail (1:N) | `relationships/products/*.md` |
| **Recipe** | ↔ Product (N:1), RecipeDetail (1:N) | `relationships/recipes/recipe-details.md` |
| **RecipeDetail** | ↔ Recipe (N:1), Supply (N:1) | `relationships/recipes/recipe-details.md` |
| **Purchase** | ↔ Supplier (N:1), PurchaseDetail (1:N), InventoryMovement (1:N) | `relationships/purchases/*.md` |
| **PurchaseDetail**| ↔ Purchase (N:1), Supply (N:1) | `relationships/purchases/purchase-details.md` |
| **Production** | ↔ Product (N:1), Recipe (N:1), ProductionDetail (1:N), Lot (1:N), InventoryMovement (1:N) | `relationships/production/*.md` |
| **ProductionDetail**| ↔ Production (N:1), Supply (N:1) | `relationships/production/production-details.md` |
| **Lot** | ↔ Production (N:1), Product (N:1), SaleDetail (1:N) | `relationships/lots/*.md`, `relationships/production/production-lots.md` |
| **InventoryMovement**| ↔ Supply (N:1), Product (N:1), Operación Origen (`ID_Referencia`) | `relationships/inventory/inventory-movements-traceability.md` |
| **Client** | ↔ Sale (1:N), Payment (1:N) | `relationships/clients/*.md` |
| **Sale** | ↔ Client (N:1), SaleDetail (1:N), Payment (1:N), InventoryMovement (1:N) | `relationships/sales/*.md` |
| **SaleDetail** | ↔ Sale (N:1), Product (N:1), Lot (N:1) | `relationships/sales/sale-details.md` |
| **Payment** | ↔ Sale (N:1), Client (N:1) | `relationships/sales/sale-payments.md`, `relationships/clients/client-payments.md` |
| **Expense** | Autónomo (consumido por analítica) | No genera clave foránea operativa directa |
| **Configuration**| Autónomo (sistema) | No genera clave foránea operativa directa |

---

## 7. Relaciones que requieren referencias bidireccionales

Las siguientes relaciones entre entidades requieren navegación bidireccional tanto a nivel documental como en la futura definición de Prisma:

1. **`Presentation` ↔ `Product`**:
   - `Presentation.products` (1:N)
   - `Product.presentation` (N:1)
2. **`Product` ↔ `Recipe`**:
   - `Product.recipes` (1:N)
   - `Recipe.product` (N:1)
3. **`Recipe` ↔ `RecipeDetail`**:
   - `Recipe.items` (1:N)
   - `RecipeDetail.recipe` (N:1)
4. **`Supplier` ↔ `Purchase`**:
   - `Supplier.purchases` (1:N)
   - `Purchase.supplier` (N:1)
5. **`Purchase` ↔ `PurchaseDetail`**:
   - `Purchase.items` (1:N)
   - `PurchaseDetail.purchase` (N:1)
6. **`Production` ↔ `ProductionDetail`**:
   - `Production.items` (1:N)
   - `ProductionDetail.production` (N:1)
7. **`Production` ↔ `Lot`**:
   - `Production.lots` (1:N o 1:1)
   - `Lot.production` (N:1 o 1:1)
8. **`Product` ↔ `Lot`**:
   - `Product.lots` (1:N)
   - `Lot.product` (N:1)
9. **`Client` ↔ `Sale`**:
   - `Client.sales` (1:N)
   - `Sale.client` (N:1)
10. **`Sale` ↔ `SaleDetail`**:
    - `Sale.items` (1:N)
    - `SaleDetail.sale` (N:1)
11. **`Sale` ↔ `Payment`**:
    - `Sale.payments` (1:N)
    - `Payment.sale` (N:1)
12. **`Client` ↔ `Payment`**:
    - `Client.payments` (1:N)
    - `Payment.client` (N:1)

---

## 8. Reglas de integridad confirmadas

1. **Unicidad de Identificadores Técnicos (CONFIRMADO):** Cada registro posee una clave primaria única inmutable generada por el sistema.
2. **Unicidad Compuesta de Producto (CONFIRMADO):** Restricción única sobre `(Nombre_Producto, ID_Presentacion)`.
3. **Unicidad de Insumos en Recetas (CONFIRMADO):** Restricción única sobre `(ID_Receta, ID_Insumo)` en `RecipeDetail`.
4. **Validación de Existencia Previa (CONFIRMADO):** No se pueden crear registros dependientes (ej. productos, compras, recetas) que apunten a entidades maestras inexistentes.
5. **Restricción de Eliminación Física (Soft-Delete Obligatorio) (CONFIRMADO):** Prohibido el uso de `DELETE` físico sobre registros con dependencias u operaciones históricas; uso de `Activo = false` o `Estado = INACTIVO`.
6. **Integridad de Dominios Numéricos (CONFIRMADO):**
   - Cantidades de insumos y productos: `Cantidad > 0`.
   - Mermas de receta: `0 <= Merma_Porcentaje < 100`.
   - Precios y costos: `Valor >= 0`.
   - Saldo de ventas: `Saldo_Pendiente >= 0` (`Total_Venta - SUM(Pagos)`).
7. **No Existencias Negativas (CONFIRMADO):** Operaciones que consumen o venden stock deben validar previamente `Cantidad_Disponible >= Cantidad_Requerida`.
8. **Integridad Temporal de Lotes (CONFIRMADO):** `Fecha_Vencimiento >= Fecha_Produccion`.

---

## 9. Reglas de historial y trazabilidad confirmadas

1. **Inmutabilidad de Hechos Históricos (CONFIRMADO):** Las compras, producciones ejecutadas, ventas cerradas, pagos y movimientos de inventario son inmutables.
2. **Snapshots de Precios y Costos (CONFIRMADO):**
   - `PurchaseDetail` registra el costo unitario base pactado en la compra (no cambia si el proveedor sube sus tarifas).
   - `ProductionDetail` registra el costo teórico y real al momento de fabricar.
   - `SaleDetail` registra precio unitario, descuento, costo unitario y utilidades al momento de la venta.
3. **Trazabilidad de Cadena Completa (CONFIRMADO):**
   - Compra Insumo (`Lote_Proveedor`, `Fecha_Vencimiento`) ──► Movimiento Entrada.
   - Producción (Consumo Insumos) ──► Generación de Lote PT (`Fecha_Produccion`, `Fecha_Vencimiento`).
   - Venta (`SaleDetail` vinculado a `ID_Lote`) ──► Movimiento Salida PT ──► Cliente Final.

---

## 10. Reglas de persistencia confirmadas

1. **PostgreSQL como Fuente de Verdad Persistente (CONFIRMADO):** Motor relacional con soporte transaccional ACID.
2. **Prisma ORM como Capa de Infraestructura (CONFIRMADO):** Encapsulado detrás de los repositorios de cada módulo; no contiene lógica empresarial.
3. **Persistencia por Agregados / Módulos (CONFIRMADO):** Cada módulo backend (`apps/api/src/...`) es propietario exclusivo de sus tablas; otros módulos interactúan mediante servicios del dominio.
4. **Traducción de Tipos (CONFIRMADO):**
   - Montos monetarios y costos: `Decimal(12, 2)` o `Decimal(12, 4)`.
   - Cantidades de insumos: `Decimal(12, 4)`.
   - Cantidades enteras de unidades comerciales: `Int` o `Decimal`.
   - Fechas y marcas temporales: `DateTime` (`timestamp with time zone`).

---

## 11. Reglas transaccionales confirmadas

Las siguientes operaciones requieren ejecución atómica obligatoria dentro de una única transacción (`$transaction` en Prisma):

1. **Registro / Confirmación de Compra (CONFIRMADO):**
   - Insertar `Purchase` + Insertar `PurchaseDetail[]` + Crear `InventoryMovement[]` (Entradas).
2. **Ejecución de Producción (CONFIRMADO):**
   - Insertar `Production` + Insertar `ProductionDetail[]` + Crear `Lot` + Crear `InventoryMovement[]` (Salidas de Insumos y Entrada de PT).
3. **Registro de Venta (CONFIRMADO):**
   - Insertar `Sale` + Insertar `SaleDetail[]` + Descontar disponibilidad de `Lot[]` + Crear `InventoryMovement[]` (Salidas de PT).
4. **Registro de Pago (CONFIRMADO):**
   - Insertar `Payment` + Recalcular y actualizar `Saldo_Pendiente` y `Estado` en `Sale`.

---

## 12. Índices y restricciones identificados

### Restricciones (Constraints)
- **Primary Keys (PK):** En todas las tablas del modelo.
- **Foreign Keys (FK):** Con `onDelete: Restrict` en todas las referencias a maestros para evitar eliminaciones destructivas de historial.
- **Unique Constraints (UQ):**
  - `(nombre_producto, id_presentacion)` en `Product`.
  - `(id_receta, id_insumo)` en `RecipeDetail`.
  - `(id_proveedor, id_insumo, presentacion_compra)` en `SupplierPrice`.
- **Check Constraints (CHECK en SQL):**
  - `cantidad > 0`, `costo >= 0`, `precio >= 0`, `merma_porcentaje >= 0 AND merma_porcentaje < 100`, `fecha_vencimiento >= fecha_produccion`.

### Índices de Rendimiento Identificados
- `idx_lots_product_status`: `(id_producto, estado, fecha_vencimiento)` para búsqueda de lotes disponibles en ventas.
- `idx_inventory_movements_ref`: `(id_referencia, tipo_movimiento)` para auditoría y trazabilidad de operaciones.
- `idx_sales_client_status`: `(id_cliente, estado, fecha_venta)` para estados de cuenta y cartera.
- `idx_supplier_prices_lookup`: `(id_insumo, activo)` para cotización rápida de insumos.

---

## 13. Enumeraciones y catálogos identificados

1. **`TipoMovimientoInventario` (CONFIRMADO):**
   - `ENTRADA_COMPRA`, `SALIDA_PRODUCCION`, `ENTRADA_PRODUCCION`, `SALIDA_VENTA`, `AJUSTE_ENTRADA`, `AJUSTE_SALIDA`.
2. **`EstadoProduccion` (CONFIRMADO):**
   - `PLANIFICADA`, `EN_PROCESO`, `COMPLETADA`, `CANCELADA`.
3. **`EstadoLote` (CONFIRMADO):**
   - `DISPONIBLE`, `AGOTADO`, `VENCIDO`, `BLOQUEADO`.
4. **`EstadoVenta` / `EstadoPagoVenta` (CONFIRMADO):**
   - `PENDIENTE`, `PARCIAL`, `PAGADA`, `ANULADA`.
5. **`TipoLote` (CONFIRMADO):**
   - `PRODUCTO_TERMINADO`, `INSUMO`.
6. **Catálogos Abiertos / Paramétricos (AMBIGÜEDAD / DECISIÓN TÉCNICA):**
   - `Tipo_Pago`, `Canal_Venta`, `Categoria_Insumo`, `Categoria_Producto`, `Categoria_Gasto`, `Metodo_Pago`.

---

## 14. Ambigüedades detectadas

- **A-01 (AMBIGÜEDAD):** Coexistencia de `Cantidad_Oz` y `Cantidad_ml` en `Presentation` (¿cálculo automático o captura libre?).
- **A-02 (AMBIGÜEDAD):** Polimorfismo en `Lot` (`ID_Producto` vs. `ID_Insumo`).
- **A-03 (AMBIGÜEDAD):** Cardinalidad exacta de `Production` a `Lot` (1:1 vs. 1:N).
- **A-04 (AMBIGÜEDAD):** Venta con fraccionamiento en múltiples lotes (múltiples `SaleDetail` vs. tabla intermedia de asignación).
- **A-05 (AMBIGÜEDAD):** Persistencia materializada de `InventoryBalance` vs. vista SQL calculada dinámicamente.
- **A-06 (AMBIGÜEDAD):** Campos opcionales en notas avanzadas (`Tapilla` en Presentación y `Activo` en `RecipeDetail`).

---

## 15. Contradicciones detectadas

- **C-01 (CONTRADICCIÓN ESTRUCTURAL DE RUTAS):**
  - *Descripción:* Los documentos de implementación (`02-database-implementation-plan.md`, `05-prisma-implementation-plan.md`, `04-persistence-boundaries.md`) y el mapa general citan la ruta `docs/data-model/00-data-model-overview.md` hasta `10-technical-implementation-notes.md`. Sin embargo, físicamente los archivos 00 al 10 se encuentran en la ruta `docs/domains/data/`, mientras que los archivos 11 y 12 están en `docs/data-model/`.
  - *Impacto:* Ruptura de enlaces relativos y dispersión documental.
- **C-02 (CONTRADICCIÓN DE NOMENCLATURA EN LOTES):**
  - *Descripción:* En algunos textos conceptuales se menciona `Fecha_Creacion` del lote, mientras que la estructura formal y el sistema maestro VBA confirman `Fecha_Produccion`.

---

## 16. Información no definida para Prisma

- **Nombres físicos exactos en base de datos (NO DEFINIDO):** Convención de mapeo de nombres de tablas y columnas (`@@map("products")`, `@map("unit_price")` en snake_case de PostgreSQL vs. camelCase/PascalCase en JavaScript).
- **Estrategia definitiva de IDs técnicos (NO DEFINIDO):** Selección entre `CUID`, `UUID` o enteros secuenciales para las claves primarias internas.
- **Definición de precisión en Decimals (NO DEFINIDO):** Especificación exacta de `@db.Decimal(12, 2)` para moneda y `@db.Decimal(12, 4)` para cantidades y mermas.
- **Configuración de esquema en PostgreSQL (NO DEFINIDO):** Uso del esquema por defecto `public` o esquema dedicado.

---

## 17. Duplicaciones documentales detectadas

1. **Dispersión de carpetas `docs/domains/data/` vs. `docs/data-model/`**: Archivos del modelo de datos fragmentados en dos ubicaciones.
2. **Definiciones repetidas de entidades y atributos**: La información de atributos y cardinalidades se repite de forma idéntica en `00-data-model-overview.md`, `01-entities.md` y `02-relationships.md`. La creación de `models/` y `relationships/` resolverá esta duplicación convirtiendo los archivos 01 y 02 en índices maestros de referencia.

---

## 18. Cambios documentales propuestos

### Fase 1: Unificación de Directorio
- Mover los archivos `00-...` al `10-...` desde `docs/domains/data/` hacia `docs/data-model/`, consolidando la totalidad del modelo en una sola carpeta oficial (`docs/data-model/00-...` a `12-...`).

### Fase 2: Creación de la Estructura Modular de Modelos y Relaciones
- Crear los documentos individuales en `docs/data-model/models/` y `docs/data-model/relationships/` según las estructuras propuestas en las Secciones 4 y 5.

### Fase 3: Conversión de Índices Maestros
- Convertir `01-entities.md` en el índice maestro de modelos (`models/`).
- Convertir `02-relationships.md` en el índice maestro de relaciones (`relationships/`).
- Actualizar las referencias cruzadas y enlaces relativos.

---

## 19. Bloqueadores

- **No existen bloqueadores críticos de arquitectura ni de dominio.**
- Las ambigüedades detectadas (A-01 a A-06) son decisiones de detalle de persistencia que están claramente aisladas y documentadas en `docs/data-model/11-model-validation.md` (decisiones D-01 a D-06) y pueden ratificarse ordenadamente en la siguiente fase.

---

## 20. Recomendaciones

1. **Aprobar la unificación y reorganización documental propuesta** en `docs/data-model/models/` y `docs/data-model/relationships/`.
2. **Ratificar las 6 decisiones técnicas menores (D-01 a D-06)** registradas en `11-model-validation.md` antes de escribir el `schema.prisma`.
3. **Mantener la regla de pureza en JavaScript (.js)** y la arquitectura de repositorios por módulo en `apps/api`.
4. **Construir el `schema.prisma` de forma progresiva**, comenzando por los maestros independientes (Presentations, Supplies, Suppliers), luego relaciones comerciales y recetas, y finalmente operaciones transaccionales.

---

## 21. Estado final

**READY FOR PRISMA IMPLEMENTATION**
