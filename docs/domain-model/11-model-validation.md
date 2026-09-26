# Validación del Modelo V1

## Documentos revisados

Se realizó una auditoría exhaustiva de coherencia, consistencia y completitud sobre la totalidad de la documentación del proyecto, verificando de forma cruzada definiciones de entidades, reglas de negocio, relaciones, flujos de inventario, inmutabilidad histórica y responsabilidades de cálculo.

### 1. Documentación del Negocio (Dominios)
* [00-business-map.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/00-business-map.md): Mapa general del negocio (Maestros, Operaciones, Análisis y Control).
* [01-presentations.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/01-presentations.md): Dominio de presentaciones comerciales, formatos, envases y estados de disponibilidad.
* [02-supplies.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/02-supplies.md): Dominio de insumos, clasificación, marcas, unidades base y niveles de stock mínimo.
* [03-suppliers.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/03-suppliers.md): Dominio de proveedores, datos de contacto, relaciones comerciales y catálogo de precios de insumos.
* [04-products.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/04-products.md): Dominio de productos, relación con presentaciones, canales de venta y precios comerciales.
* [05-recipes.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/05-recipes.md): Dominio de recetas y formulaciones, insumos requeridos, mermas porcentuales y rendimientos base.
* [06-purchases.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/06-purchases.md): Dominio de compras de insumos, cabecera-detalle, conversión a unidades base, fechas de vencimiento y lotes de proveedor.
* [07-inventory.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/07-inventory.md): Dominio de inventario, movimientos de entrada/salida/ajuste y cálculo de existencias.
* [08-production.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/08-production.md): Dominio de producción, órdenes de fabricación, consumo planificado vs. real de insumos y generación de producto terminado.
* [09-lots.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/09-lots.md): Dominio de lotes, fechas de creación y vencimiento, control de cantidades disponibles y trazabilidad.
* [10-clients.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/10-clients.md): Dominio de clientes, canales, tipos de cliente, condiciones de crédito e historial comercial.
* [11-sales.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/11-sales.md): Dominio de ventas, estructura transaccional cabecera-detalle, asignación de lotes, precios, descuentos y saldos pendientes.
* [12-payments.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/12-payments.md): Dominio de pagos y abonos de clientes, métodos de pago, amortización y actualización de saldo de ventas.
* [13-expenses.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/13-expenses.md): Dominio de gastos operativos, clasificación por categoría y tipo, períodos y separación de costos directos.
* [14-costs.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/14-costs.md): Dominio de costos, costeo de insumos, costo unitario de producción y costeo de ventas.
* [15-profitability.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/15-profitability.md): Dominio de rentabilidad, cálculo de márgenes brutos, operativos y netos por producto, venta y período.
* [16-dashboard.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/16-dashboard.md): Dominio de dashboard, consolidación de métricas e indicadores en modo consulta sin propiedad de datos operativos.
* [auth.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/auth.md) y [users.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/users.md): Documentos base de autenticación y usuarios (pendientes de definición de negocio).

### 2. Documentación del Modelo de Datos
* [00-data-model-overview.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/00-data-model-overview.md): Visión general del modelo conceptual, capas maestras, operativas, trazabilidad y análisis.
* [01-entities.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/01-entities.md): Catálogo de entidades maestras, transaccionales, de detalle y conceptos derivados.
* [02-relationships.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/02-relationships.md): Mapa completo de relaciones conceptuales, cardinalidades y dependencias entre entidades.
* [03-data-integrity-rules.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/03-data-integrity-rules.md): Reglas de integridad referencial, restricciones de unicidad, validación de estados y prohibición de eliminación física.
* [04-history-and-traceability.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/04-history-and-traceability.md): Principios de inmutabilidad histórica, snapshots de precios/costos y auditoría de eventos.
* [05-data-model-decisions.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/05-data-model-decisions.md): Decisiones estructurales consolidadas del modelo de datos.
* [06-inventory-flow.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/06-inventory-flow.md): Flujo integral de inventario (compras -> entradas, producción -> consumos y entradas de PT, ventas -> salidas).
* [07-business-processes.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/07-business-processes.md): Ciclo de vida de los procesos comerciales y operativos de punta a punta.
* [08-cross-module-rules.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/08-cross-module-rules.md): Reglas de interacción, límites de modificación y límites de propiedad entre módulos.
* [09-calculation-responsibilities.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/09-calculation-responsibilities.md): Matriz de asignación de autoridad y unicidad para cada cálculo del sistema.
* [10-technical-implementation-notes.md](file:///C:/Proyects/GitHub/App-Gesti-n-empresarial-de-Yogurt/docs/domains/data/10-technical-implementation-notes.md): Directrices técnicas para la futura implementación en PostgreSQL, Prisma, NestJS y Electron/React.

---

## Relaciones verificadas

A continuación se registra la auditoría detallada de las relaciones estructurales entre entidades y módulos, verificando su origen, cardinalidad, destino, respaldo documental y estado de validación.

### R-01: Presentaciones ──► Productos
* **Relación:** Presentation (1) ──► Product (N)
* **Documentos que la respaldan:** `01-presentations.md`, `04-products.md`, `01-entities.md`, `02-relationships.md`, `03-data-integrity-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Un producto requiere obligatoriamente una presentación existente y activa. No se permite duplicar el mismo nombre de producto bajo la misma presentación.

### R-02: Proveedores ──► Precios de Proveedor ◄── Insumos
* **Relación:** Supplier (1) ──► SupplierPrice (N) ◄── Supply (1)
* **Documentos que la respaldan:** `02-supplies.md`, `03-suppliers.md`, `01-entities.md`, `02-relationships.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Modela la relación comercial catálogo/precio de insumos por proveedor. Mantiene equivalencia a unidad base y fecha de última compra. No sustituye la compra real.

### R-03: Productos ──► Recetas ──► Detalle de Receta ◄── Insumos
* **Relación:** Product (1) ──► Recipe (N) ──► RecipeDetail (N) ◄── Supply (1)
* **Documentos que la respaldan:** `04-products.md`, `05-recipes.md`, `01-entities.md`, `02-relationships.md`, `03-data-integrity-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Un producto puede tener múltiples recetas (versiones/variantes). En cada receta, la combinación (`ID_Receta`, `ID_Insumo`) es estrictamente única (un insumo no se repite dentro de la misma receta).

### R-04: Proveedores ──► Compras ──► Detalle de Compra ◄── Insumos
* **Relación:** Supplier (1) ──► Purchase (N) ──► PurchaseDetail (N) ◄── Supply (1)
* **Documentos que la respaldan:** `03-suppliers.md`, `06-purchases.md`, `01-entities.md`, `02-relationships.md`, `03-data-integrity-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** PurchaseDetail registra los insumos adquiridos, cantidad comprada, factor de conversión, costo unitario base y lote/vencimiento de proveedor para trazabilidad.

### R-05: Compras (Detalle de Compra) ──► Movimientos de Inventario
* **Relación:** PurchaseDetail (1) ──► InventoryMovement (1)
* **Documentos que la respaldan:** `06-purchases.md`, `07-inventory.md`, `02-relationships.md`, `06-inventory-flow.md`, `08-cross-module-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Compras no altera directamente un contador mutable de stock; delega la creación del movimiento de entrada a Inventory (`Tipo_Movimiento = ENTRADA_COMPRA`), manteniendo referencia a la compra de origen.

### R-06: Productos + Recetas ──► Producción ──► Detalle de Producción ◄── Insumos
* **Relación:** Product (1), Recipe (1) ──► Production (N) ──► ProductionDetail (N) ◄── Supply (1)
* **Documentos que la respaldan:** `05-recipes.md`, `08-production.md`, `01-entities.md`, `02-relationships.md`, `07-business-processes.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** ProductionDetail conserva el snapshot de insumos teóricos vs. insumos reales consumidos. La modificación posterior de la receta no altera la producción histórica.

### R-07: Producción ──► Movimientos de Inventario (Salida de Insumos y Entrada de Producto Terminado)
* **Relación:** Production (1) / ProductionDetail (N) ──► InventoryMovement (N)
* **Documentos que la respaldan:** `07-inventory.md`, `08-production.md`, `06-inventory-flow.md`, `08-cross-module-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** La ejecución de producción genera movimientos trazables con `ID_Referencia = ID_Produccion` (`SALIDA_PRODUCCION` para insumos y `ENTRADA_PRODUCCION` para producto terminado).

### R-08: Producción ──► Lotes ◄── Productos
* **Relación:** Production (1) ──► Lot (1 o N) ◄── Product (1)
* **Documentos que la respaldan:** `08-production.md`, `09-lots.md`, `01-entities.md`, `02-relationships.md`, `00-data-model-overview.md`.
* **Resultado:** CONFIRMADO (Con ambigüedad menor en cardinalidad 1:1 vs 1:N detallada en sección de Ambigüedades).
* **Observaciones:** La producción genera el lote con su `Fecha_Produccion`, `Fecha_Vencimiento`, `Cantidad_Inicial` y `Cantidad_Disponible`.

### R-09: Clientes ──► Ventas ──► Detalle de Ventas ◄── Productos + Lotes
* **Relación:** Client (1) ──► Sale (N) ──► SaleDetail (N) ◄── Product (1), Lot (1)
* **Documentos que la respaldan:** `10-clients.md`, `11-sales.md`, `09-lots.md`, `01-entities.md`, `02-relationships.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** SaleDetail vincula obligatoriamente el producto y el lote específico del que se descuenta la existencia vendida, preservando precios, descuentos y costos históricos de la línea.

### R-10: Ventas (Detalle de Ventas) ──► Movimientos de Inventario
* **Relación:** SaleDetail (1) ──► InventoryMovement (1)
* **Documentos que la respaldan:** `07-inventory.md`, `11-sales.md`, `06-inventory-flow.md`, `08-cross-module-rules.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Cada línea vendida genera su respectiva salida de inventario de producto terminado (`Tipo_Movimiento = SALIDA_VENTA`, `ID_Referencia = ID_Venta`).

### R-11: Clientes + Ventas ──► Pagos
* **Relación:** Client (1) ──► Payment (N) ◄── Sale (1)
* **Documentos que la respaldan:** `10-clients.md`, `11-sales.md`, `12-payments.md`, `01-entities.md`, `02-relationships.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Un cliente realiza pagos que se imputan a ventas específicas. Permite pagos completos o parciales (abonos) y actualiza el saldo pendiente de la venta.

### R-12: Gastos ──► Análisis Financiero (Costos / Rentabilidad)
* **Relación:** Expense (N) ──► Costs / Profitability (1)
* **Documentos que la respaldan:** `13-expenses.md`, `14-costs.md`, `15-profitability.md`, `02-relationships.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Los gastos son transacciones independientes que no representan compras de inventario ni costos directos de producto, alimentando exclusivamente el análisis de rentabilidad operativa y neta.

### R-13: Operaciones (Compras, Producción, Ventas, Gastos) ──► Costos ──► Rentabilidad
* **Relación:** Purchases, Production, Sales, Expenses ──► Costs ──► Profitability
* **Documentos que la respaldan:** `14-costs.md`, `15-profitability.md`, `09-calculation-responsibilities.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Costs es autoridad exclusiva en determinación de costos unitarios de insumo y producto. Profitability es autoridad exclusiva en márgenes y utilidades brutas/operativas/netas.

### R-14: Módulos del Sistema ──► Dashboard
* **Relación:** Módulos Operativos y Maestros (N) ──► Dashboard (1)
* **Documentos que la respaldan:** `16-dashboard.md`, `00-data-model-overview.md`, `08-cross-module-rules.md`, `09-calculation-responsibilities.md`.
* **Resultado:** CONFIRMADO
* **Observaciones:** Dashboard es un consumidor de datos bajo demanda; no genera transacciones ni posee tablas maestras operativas.

---

## Reglas verificadas

Se contrastaron las reglas críticas de todos los dominios y modelos de datos:

### 1. Integridad y Eliminación Lógica
* **Regla:** Queda prohibida la eliminación física (`DELETE`) de datos maestros y transacciones operativas. La desactivación lógica (`Activo = false` o `Estado = INACTIVO`) es obligatoria para preservar la integridad referencial histórica.
* **Resultado:** CONFIRMADO (`01-presentations.md`, `02-supplies.md`, `03-suppliers.md`, `04-products.md`, `03-data-integrity-rules.md`, `04-history-and-traceability.md`).

### 2. Inventario como Registro de Movimientos
* **Regla:** El inventario no es un simple campo mutable que se sobreescribe sin registro. Todo cambio en existencias debe originarse en un `InventoryMovement` inmutable con referencia a su operación de origen (Compra, Producción, Venta o Ajuste auditado).
* **Resultado:** CONFIRMADO (`07-inventory.md`, `06-inventory-flow.md`, `08-cross-module-rules.md`, `09-calculation-responsibilities.md`).

### 3. Diferenciación estricta entre Producción y Lote
* **Regla:** `Production` representa el hecho de transformación (cuándo, qué insumos se planearon y consumieron realmente). `Lot` representa la unidad física trazable resultante (cantidad disponible actual, vencimiento, estado).
* **Resultado:** CONFIRMADO (`08-production.md`, `09-lots.md`, `01-entities.md`, `05-data-model-decisions.md`).

### 4. Inmutabilidad Histórica de Precios y Costos
* **Regla:** Las transacciones ejecutadas (`PurchaseDetail`, `ProductionDetail`, `SaleDetail`) almacenan snapshots inmutables de los precios unitarios, costos unitarios, descuentos y subtotales aplicados al momento del evento. Cambios futuros en tarifas maestras no recalculan el pasado.
* **Resultado:** CONFIRMADO (`04-history-and-traceability.md`, `05-data-model-decisions.md`, `08-cross-module-rules.md`).

### 5. Control de Fechas de Vencimiento y Bloqueo de Lotes
* **Regla:** Un lote con fecha de vencimiento superada (`Fecha_Vencimiento < Hoy`) o en estado `VENCIDO` / `BLOQUEADO` no puede seleccionarse para nuevas ventas.
* **Resultado:** CONFIRMADO (`09-lots.md`, `11-sales.md`, `03-data-integrity-rules.md`, `08-cross-module-rules.md`).

### 6. Control Financiero de Ventas y Saldo Pendiente
* **Regla:** `Saldo_Pendiente = Total_Venta - SUM(Valor_Pagado)`. El saldo pendiente nunca puede ser negativo (`Saldo_Pendiente >= 0`). Los pagos se asocian a ventas específicas y modifican el estado de la venta (`PENDIENTE`, `PARCIAL`, `PAGADA`).
* **Resultado:** CONFIRMADO (`11-sales.md`, `12-payments.md`, `08-cross-module-rules.md`, `09-calculation-responsibilities.md`).

### 7. Unicidad de Insumos en Recetas y Combinaciones Maestro
* **Regla:** Un mismo insumo no puede repetirse en los detalles de una misma receta. No pueden existir productos duplicados con la misma combinación (`Nombre_Producto`, `ID_Presentacion`).
* **Resultado:** CONFIRMADO (`04-products.md`, `05-recipes.md`, `03-data-integrity-rules.md`).

### 8. Autoridad Exclusiva de Cálculo
* **Regla:** Cada cálculo tiene un único propietario: `Inventory` para existencias, `Lots` para disponibilidad de lote, `Production` para rendimientos/mermas, `Sales` para totales de venta, `Payments` para saldos, `Costs` para costos unitarios, y `Profitability` para márgenes.
* **Resultado:** CONFIRMADO (`09-calculation-responsibilities.md`, `08-cross-module-rules.md`).

---

## Decisiones confirmadas

Las siguientes decisiones se encuentran plenamente alineadas y consistentes en toda la documentación:

1. **Estructura en Monorepo con Separación de Responsabilidades:** Monorepo con backend API en NestJS/Prisma/PostgreSQL y frontend Desktop en Electron/React.
2. **Organización por Dominios de Negocio:** El sistema se modela por agregados funcionales y no por tablas planas aisladas de base de datos.
3. **Pertenencia de los Detalles Transaccionales:** `PurchaseDetail`, `ProductionDetail`, `RecipeDetail` y `SaleDetail` pertenecen estrictamente a sus agregados principales (`Purchases`, `Production`, `Recipes`, `Sales`) y no constituyen módulos autónomos.
4. **Inventario Basado en Eventos:** La fuente primaria de verdad de los cambios de stock son los `InventoryMovement`.
5. **Separación Conceptual Producción vs. Lote:** La orden de producción y el lote son entidades distintas con ciclos de vida independientes.
6. **Conservación de Datos Históricos:** Registro explícito e inmutable de precios de compra, costos de producción y precios de venta en los documentos transaccionales.
7. **Desactivación Lógica Obligatoria:** Mecanismo de soft-delete en todas las entidades maestras y operativas.
8. **Naturaleza No Propietaria del Dashboard:** Módulo de solo lectura/consulta que no almacena datos transaccionales ni secuestra reglas de negocio.
9. **Gastos como Entidad Económica Independiente:** Los egresos operativos se gestionan en `Expenses` sin fusionarlos con compras de insumos.
10. **Trazabilidad de Cadena Completa:** Capacidad de rastrear desde la compra del insumo -> consumo en producción -> lote generado -> producto terminado -> venta al cliente final.

---

## Ambigüedades detectadas

Durante la revisión cruzada se identificaron los siguientes puntos que admiten más de una interpretación conceptual o técnica:

### A-01: Relación entre Onzas y Mililitros en Presentaciones
* **Descripción:** Coexistencia de los campos `Cantidad_Oz` y `Cantidad_ml` en la entidad Presentation.
* **Documentos involucrados:** `01-presentations.md` (Sección 9), `01-entities.md`, `03-data-integrity-rules.md`.
* **Por qué existe ambigüedad:** El sistema original permitía ingresar ambos valores manualmente con tal de que fueran mayores a cero, pero dejó abierta la duda de si debe existir una fórmula de conversión fija (1 oz = 29.5735 ml) o si deben permanecer como valores capturados de forma independiente.
* **Impacto potencial:** Si no se define, en base de datos podrían almacenarse combinaciones incoherentes (ej. 6 oz y 500 ml para un mismo registro).

### A-02: Naturaleza y Polimorfismo de la Entidad Lot (`ID_Producto` vs. `ID_Insumo`)
* **Descripción:** Definición de si un lote aplica tanto a producto terminado como a insumos comprados.
* **Documentos involucrados:** `00-data-model-overview.md` (Sección 15 y 33.2), `01-entities.md` (Sección 17), `06-purchases.md`, `09-lots.md`.
* **Por qué existe ambigüedad:** En `01-entities.md` la entidad Lot tiene campos opcionales `ID_Producto` e `ID_Insumo` con un `Tipo_Lote`, mientras que en `06-purchases.md` la compra registra un campo de texto `Lote_Proveedor`.
* **Impacto potencial:** En el diseño físico de PostgreSQL, si se usa una sola tabla `lots` con clave foránea opcional a Product o Supply, se requerirá un constraint XOR (`CHECK (id_producto IS NOT NULL AND id_insumo IS NULL) OR (id_producto IS NULL AND id_insumo IS NOT NULL)`), o alternativamente separar en dos tablas (`product_lots` y `supply_lots`).

### A-03: Cardinalidad de Producción hacia Lotes (1:1 vs. 1:N)
* **Descripción:** Determinación de si una ejecución de producción genera exactamente un único lote o puede generar múltiples lotes.
* **Documentos involucrados:** `08-production.md`, `09-lots.md`, `00-data-model-overview.md` (Sección 33.1), `02-relationships.md` (Sección 20).
* **Por qué existe ambigüedad:** La mayoría de los flujos operativos asumen que una tanda produce un único lote de producto terminado, pero la documentación técnica de relaciones deja abierta la cardinalidad 1 : N.
* **Impacto potencial:** Si es 1:1, `ID_Lote` puede residir como clave foránea única o relación directa; si es 1:N, la relación debe manejarse estrictamente con `production_id` dentro de la tabla de lotes.

### A-04: Manejo de Múltiples Lotes en una Línea de Venta (`SaleDetail`)
* **Descripción:** Comportamiento cuando una venta solicita una cantidad mayor a la disponible en un solo lote.
* **Documentos involucrados:** `11-sales.md`, `09-lots.md`, `02-relationships.md` (Sección 26).
* **Por qué existe ambigüedad:** La relación conceptual asocia `SaleDetail` a un `ID_Lote`. Si una venta de 50 unidades se satisface con 30 unidades del Lote A y 20 del Lote B, no se aclara si el sistema obliga a crear dos registros `SaleDetail` o si existe una tabla intermedia de desglose por lote.
* **Impacto potencial:** Definición de la interfaz de usuario en ventas y de la cardinalidad de detalle en base de datos.

### A-05: Materialización vs. Cálculo al Vuelo de `InventoryBalance`
* **Descripción:** Persistencia física del saldo consolidado de stock frente a su cálculo dinámico sobre `InventoryMovement`.
* **Documentos involucrados:** `07-inventory.md`, `00-data-model-overview.md` (Sección 17), `01-entities.md` (Sección 14), `09-calculation-responsibilities.md`.
* **Por qué existe ambigüedad:** La documentación establece que `InventoryMovement` es la única fuente de verdad, pero reconoce que consultar agregaciones constantes podría requerir una tabla de proyección o caché de saldos.
* **Impacto potencial:** Estrategia de indexación, triggers o servicios de sincronización en NestJS/PostgreSQL.

### A-06: Atributos Opcionales en Evoluciones de Maestros (`Tapilla` y `Activo` en Detalle)
* **Descripción:** Presencia del atributo `Tapilla` en Presentaciones y `Activo` en `RecipeDetail` en notas de versiones maestras avanzadas.
* **Documentos involucrados:** `01-entities.md` (Secciones 4 y 10).
* **Por qué existe ambigüedad:** No se especifica si forman parte obligatoria de la V1 o si fueron anotaciones secundarias.
* **Impacto potencial:** Definición de campos nullables en el esquema de persistencia.

---

## Correcciones realizadas

En estricto cumplimiento de las directrices de la auditoría:
1. **No se modificaron silenciosamente documentos existentes** del negocio ni del modelo conceptual.
2. **No se crearon entidades ficticias** ni se eliminó información previa.
3. Se creó formalmente el presente documento oficial de auditoría: `docs/data-model/11-model-validation.md`.
4. Todos los hallazgos, ambigüedades y discrepancias menores quedaron registrados explícitamente en las secciones correspondientes de este reporte para su resolución ordenada antes del diseño físico en PostgreSQL/Prisma.

---

## Decisiones pendientes

A continuación se registran las decisiones que deben confirmarse antes de generar el `schema.prisma` y las migraciones físicas:

### D-01: Regla de Almacenamiento Onzas / Mililitros en Presentaciones
* **Decisión requerida:** Confirmar si el usuario ingresa ambos campos o si el sistema calcula automáticamente `Cantidad_ml = Cantidad_Oz * 29.5735` (o viceversa) con redondeo estándar.
* **Documentos relacionados:** `01-presentations.md`, `01-entities.md`.
* **Impacto:** Restricción de validación en DTOs y columnas en PostgreSQL.
* **Qué no puede definirse hasta resolverla:** Regla de validación estricta y triggers de cálculo automático en base de datos/backend.

### D-02: Estructura de Persistencia para Lotes (Producto vs. Insumo)
* **Decisión requerida:** Decidir entre:
  * *Opción A:* Tabla única `lots` con `tipo_lote` y claves foráneas opcionales con constraint XOR.
  * *Opción B:* Tabla `lots` exclusiva para Producto Terminado y manejo de lote de insumo como atributo de texto/trazabilidad en `purchase_items` / `inventory_movements`.
* **Documentos relacionados:** `06-purchases.md`, `08-production.md`, `09-lots.md`, `00-data-model-overview.md`.
* **Impacto:** Modelo relacional y claves foráneas en Prisma.
* **Qué no puede definirse hasta resolverla:** Relaciones del modelo `Lot` en `schema.prisma`.

### D-03: Cardinalidad Definitiva Producción ──► Lote
* **Decisión requerida:** Fijar si una orden de producción completada genera exactamente un (1) lote de producto terminado (1:1) o si debe soportar división en múltiples lotes (1:N).
* **Documentos relacionados:** `08-production.md`, `09-lots.md`, `02-relationships.md`.
* **Impacto:** Ubicación de la clave foránea (`production_id` en `lots` vs. `lot_id` en `production`).
* **Qué no puede definirse hasta resolverla:** Restricción `@unique` en la relación Prisma entre `Production` y `Lot`.

### D-04: Estrategia de Consumo de Lotes en Ventas con Fraccionamiento
* **Decisión requerida:** Establecer la regla operativa de ventas cuando la cantidad supera un lote:
  * *Opción A:* El frontend/backend divide automáticamente la línea en múltiples `SaleDetail` (cada uno con su `ID_Lote`).
  * *Opción B:* Se añade una tabla de asignación intermedia `SaleDetailLotAllocation`.
* **Documentos relacionados:** `11-sales.md`, `09-lots.md`, `02-relationships.md`.
* **Impacto:** Estructura de tablas de venta y lógica de checkout en la aplicación Desktop.
* **Qué no puede definirse hasta resolverla:** Esquema relacional de `SaleDetail`.

### D-05: Estrategia de Persistencia de `InventoryBalance`
* **Decisión requerida:** Definir si `InventoryBalance` será una tabla física actualizada sincrónicamente con cada `InventoryMovement` (para consultas ultrarrápidas de stock) o una vista SQL calculada dinámicamente.
* **Documentos relacionados:** `07-inventory.md`, `00-data-model-overview.md`, `09-calculation-responsibilities.md`.
* **Impacto:** Rendimiento de consultas de inventario y transaccionalidad en el backend.
* **Qué no puede definirse hasta resolverla:** Creación o no del modelo `InventoryBalance` en Prisma.

### D-06: Catálogos Fijos vs. Texto Libre para Categorías, Canales y Métodos de Pago
* **Decisión requerida:** Definir si campos como `Categoria_Insumo`, `Categoria_Producto`, `Canal_Venta`, `Metodo_Pago` y `Categoria_Gasto` se modelan como Enums / Tablas Maestras o como cadenas de texto libre normalizadas.
* **Documentos relacionados:** `02-supplies.md`, `04-products.md`, `10-clients.md`, `11-sales.md`, `12-payments.md`, `13-expenses.md`.
* **Impacto:** Tipado de datos en PostgreSQL (`enum` vs `varchar`).
* **Qué no puede definirse hasta resolverla:** Enums en `schema.prisma`.

---

## Estado final del modelo

### ESTADO B — MODELO VALIDADO CON DECISIONES MENORES PENDIENTES

#### Justificación de la Calificación
1. **Coherencia Integral Confirmada:** La auditoría cruzada de los 17 documentos de dominio y los 11 documentos de modelo de datos demuestra una arquitectura conceptual sólida, armónica y libre de contradicciones estructurales.
2. **Flujos Críticos Cerrados:** Los flujos fundamentales del negocio (compras -> movimientos de entrada -> consumo en producción -> generación de lotes -> venta trazable -> recaudo -> costos y rentabilidad) están perfectamente delimitados y asignados a módulos con responsabilidad única.
3. **Inmutabilidad y Trazabilidad Aseguradas:** Las reglas de snapshots históricos de costos/precios, la prohibición de borrado físico destructivo y el inventario basado en eventos protegen la integridad de los datos.
4. **Pendientes Aislados y No Bloqueantes:** Las decisiones pendientes (D-01 a D-06) son decisiones técnicas y de detalle de implementación (cardinalidad 1:1 vs 1:N de producción a lote, enums vs texto, y estrategia de persistencia de saldo consolidado de inventario) que están perfectamente identificadas y delimitadas, permitiendo proceder ordenadamente a la fase de diseño físico de base de datos una vez ratificadas.
