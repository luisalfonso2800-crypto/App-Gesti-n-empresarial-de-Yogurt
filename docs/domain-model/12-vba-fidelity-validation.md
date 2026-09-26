# Validación de Fidelidad contra el Modelo Maestro VBA

## 1. Propósito

Este documento registra la validación de fidelidad entre el modelo documental V1 del nuevo sistema y el archivo maestro VBA utilizado como fuente histórica del sistema original.

La validación tiene como objetivo comprobar que la reconstrucción documental realizada en:

```text
docs/domains/
```

y:

```text
docs/data-model/
```

conserva la lógica funcional esencial definida en el sistema VBA y no introduce, como si fueran parte del modelo original, entidades, relaciones o responsabilidades inexistentes en la fuente.

Este documento no convierte automáticamente toda decisión del modelo VBA en una decisión definitiva para la nueva aplicación.

Su función es distinguir entre:

```text
LÓGICA ORIGINAL CONFIRMADA
```

```text
EVOLUCIÓN DOCUMENTAL POSTERIOR
```

y:

```text
DECISIÓN NUEVA DEL MODELO V1
```

La fuente histórica principal utilizada para esta validación es el archivo maestro:

```text
Modulo_con-todos-los-modulos-del-proyecto.bas
```

La validación también se contrasta con la documentación V1 previamente construida.

---

# 2. Alcance de la validación

La revisión cubre las siguientes áreas:

1. Estructura general del sistema.
2. Módulos funcionales.
3. Tablas y entidades originales.
4. Relaciones entre procesos.
5. Relaciones cabecera-detalle.
6. Inventario.
7. Producción.
8. Lotes.
9. Ventas.
10. Pagos.
11. Gastos.
12. Costos y rentabilidad.
13. Historial y trazabilidad.
14. Responsabilidades de cálculo.
15. Límites entre módulos.

La validación se realiza contra la lógica existente en el código VBA.

No se considera automáticamente fiel una decisión simplemente porque aparezca en la documentación V1.

Cuando una decisión no puede confirmarse directamente en el VBA, se clasifica expresamente.

---

# 3. Fuente histórica validada

El sistema VBA define una estructura física basada en veinte áreas principales:

```text
01 - DASHBOARD
02 - PRESENTACIONES
03 - INSUMOS
04 - PROVEEDORES
05 - PRECIOS_PROVEEDORES
06 - PRODUCTOS
07 - RECETAS
08 - COMPRAS
09 - DETALLE_COMPRAS
10 - MOVIMIENTOS_INVENTARIO
11 - INVENTARIO
12 - PRODUCCION
13 - DETALLE_PRODUCCION
14 - LOTES
15 - CLIENTES
16 - VENTAS
17 - DETALLE_VENTAS
18 - PAGOS_CLIENTES
19 - GASTOS
20 - CONFIGURACION
```

Esta estructura confirma que el sistema original estaba organizado alrededor de los siguientes dominios funcionales:

```text
PRESENTACIONES
INSUMOS
PROVEEDORES
PRECIOS DE PROVEEDORES
PRODUCTOS
RECETAS
COMPRAS
INVENTARIO
PRODUCCIÓN
LOTES
CLIENTES
VENTAS
PAGOS
GASTOS
CONFIGURACIÓN
DASHBOARD
```

La documentación V1 conserva estos conceptos.

La nueva arquitectura no debe crear un módulo independiente por cada tabla histórica cuando varias tablas forman parte de un mismo proceso de negocio.

Por esta razón:

```text
DETALLE_COMPRAS
→ pertenece a Purchases
```

```text
DETALLE_PRODUCCION
→ pertenece a Production
```

```text
DETALLE_VENTAS
→ pertenece a Sales
```

```text
PRECIOS_PROVEEDORES
→ pertenece funcionalmente a Suppliers / Purchasing
```

Esta consolidación es compatible con la lógica histórica y representa una mejora de organización del nuevo sistema, no una alteración del negocio.

---

# 4. Inventario de entidades y estructuras confirmadas

## 4.1 Presentaciones

Confirmado en:

```text
tblPresentaciones
```

El concepto de presentación existe como maestro independiente.

La documentación V1 mantiene correctamente este dominio.

Estado:

```text
CONFIRMADO
```

---

## 4.2 Insumos

Confirmado en:

```text
tblInsumos
```

El sistema VBA define un módulo específico para administrar los insumos.

Sus responsabilidades incluyen:

```text
- Crear insumos.
- Consultar insumos.
- Buscar por ID.
- Buscar por nombre.
- Actualizar.
- Activar.
- Desactivar.
- Obtener información.
- Obtener insumos activos.
```

También se confirma que los insumos son utilizados por:

```text
Recetas
Compras
Producción
Inventario
Lotes, cuando corresponda al seguimiento de insumos
```

Estado:

```text
CONFIRMADO
```

---

## 4.3 Proveedores

Confirmado mediante:

```text
tblProveedores
```

y:

```text
tblPreciosProveedores
```

El modelo histórico diferencia claramente entre:

```text
PROVEEDOR
```

y:

```text
PRECIO DE UN INSUMO OFRECIDO POR UN PROVEEDOR
```

Esto confirma que el precio de proveedor no debe confundirse con el maestro del proveedor.

La documentación V1 debe mantener esta distinción.

Estado:

```text
CONFIRMADO
```

---

## 4.4 Productos

Confirmado mediante:

```text
tblProductos
```

Los productos son una entidad maestra independiente.

También se confirma su relación funcional con:

```text
Presentaciones
Recetas
Producción
Lotes
Inventario
Ventas
Costos
Rentabilidad
```

Estado:

```text
CONFIRMADO
```

---

# 5. Fidelidad del módulo Recipes

El archivo maestro presenta evidencia de evolución dentro del propio sistema VBA.

Existen referencias históricas a una estructura donde una receta podía representarse directamente mediante filas de ingredientes:

```text
ID_Receta
ID_Producto
ID_Insumo
Cantidad_Requerida
```

También existe una versión evolucionada de la estructura donde se separa:

```text
tblRecetas
```

y:

```text
tblDetalleRecetas
```

La estructura más reciente del sistema constructor establece expresamente:

```text
07 - RECETAS
```

con:

```text
tblRecetas
→ cabecera principal de cada receta
```

y:

```text
tblDetalleRecetas
→ detalle de los insumos asociados a cada receta
```

Por lo tanto, para el modelo V1 la fuente histórica válida será la versión evolucionada:

```text
RECETA
    ↓
DETALLE DE RECETA
    ↓
INSUMOS
```

La relación:

```text
Producto
    ↓
Receta
    ↓
DetalleReceta
    ↓
Insumo
```

es consistente con la evolución final del sistema.

Estado:

```text
CONFIRMADO COMO ESTRUCTURA EVOLUCIONADA DEL MODELO VBA
```

---

# 6. Fidelidad del módulo Purchases

El modelo maestro confirma dos estructuras:

```text
tblCompras
```

y:

```text
tblDetalleCompras
```

La relación histórica es:

```text
Compra
    ↓
DetalleCompra
    ↓
Insumo
```

El detalle de compra contiene información relevante para la trazabilidad, incluyendo:

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

Esto confirma varias decisiones documentales importantes:

1. La compra es una operación independiente.
2. Una compra puede contener múltiples insumos.
3. El costo se registra en el detalle.
4. Existe conversión hacia una unidad base.
5. Puede existir información de vencimiento.
6. Puede registrarse el lote entregado por el proveedor.

Estado:

```text
CONFIRMADO
```

---

# 7. Fidelidad del modelo de inventario

El archivo maestro define explícitamente dos estructuras diferentes:

```text
tblMovimientosInventario
```

y:

```text
tblInventario
```

Esto confirma una separación fundamental.

## 7.1 Movimientos

Los movimientos contienen:

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

Esto confirma que el sistema histórico concibe el movimiento de inventario como un registro explícito.

Cada movimiento puede identificar:

```text
qué cambió
```

```text
cuándo cambió
```

```text
si fue entrada o salida
```

```text
qué documento u operación lo originó
```

mediante:

```text
ID_Referencia
```

---

## 7.2 Estado de inventario

La tabla:

```text
tblInventario
```

contiene:

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

Esto confirma que el sistema histórico diferencia entre:

```text
HISTORIAL DE MOVIMIENTOS
```

y:

```text
ESTADO ACTUAL O CONSOLIDADO DEL INVENTARIO
```

La documentación V1 que establece a los movimientos como fuente primaria de trazabilidad es compatible con esta lógica.

Sin embargo, debe mantenerse la precisión:

> El VBA original contiene una tabla explícita de inventario consolidado. Por lo tanto, el nuevo modelo no debe afirmar que `InventoryMovement` es la única estructura existente del modelo histórico.

La interpretación correcta es:

```text
MOVIMIENTOS
→ registran las variaciones
```

```text
INVENTARIO
→ representa el estado consolidado
```

Estado:

```text
CONFIRMADO
```

---

# 8. Fidelidad del módulo Production

El modelo VBA define:

```text
tblProduccion
```

con:

```text
ID_Produccion
Fecha_Planificada
Fecha_Produccion
ID_Producto
Cantidad_Planificada
Cantidad_Producida_Real
Estado
Fecha_Vencimiento
ID_Lote
Observaciones
```

También define:

```text
tblDetalleProduccion
```

con:

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

Esto confirma una estructura de producción basada en:

```text
PLANIFICACIÓN
```

```text
EJECUCIÓN
```

```text
CONSUMO TEÓRICO
```

```text
CONSUMO REAL
```

```text
DIFERENCIA
```

```text
COSTO TEÓRICO
```

y:

```text
COSTO REAL
```

La documentación V1 mantiene correctamente la producción como un proceso de negocio y no como una simple tabla.

Estado:

```text
CONFIRMADO
```

---

# 9. Fidelidad de la separación Production / Lots

El modelo maestro contiene tanto:

```text
tblProduccion
```

como:

```text
tblLotes
```

La producción contiene:

```text
ID_Lote
```

como referencia.

El lote contiene:

```text
ID_Lote
Tipo_Lote
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

Esto confirma que:

```text
Producción
```

y:

```text
Lote
```

son conceptos diferentes.

La relación histórica es:

```text
PRODUCCIÓN
    ↓
genera o referencia
    ↓
LOTE
```

Por tanto, la decisión documental de mantener ambos como conceptos separados es fiel al modelo original.

Estado:

```text
CONFIRMADO
```

---

# 10. Corrección sobre fecha de creación y vencimiento del lote

Durante la documentación se incorporó la necesidad de registrar:

```text
Fecha de creación del lote
```

y:

```text
Fecha de vencimiento
```

El archivo VBA original contiene explícitamente:

```text
Fecha_Produccion
```

y:

```text
Fecha_Vencimiento
```

No aparece un campo independiente denominado:

```text
Fecha_Creacion_Lote
```

Por tanto, debe mantenerse la siguiente distinción:

### Fuente histórica confirmada

```text
Fecha_Produccion
```

y:

```text
Fecha_Vencimiento
```

### Posible evolución del nuevo modelo

Si el nuevo sistema necesita diferenciar técnicamente:

```text
momento en que se registra el lote
```

de:

```text
fecha real de producción
```

podrá incorporarse un campo de auditoría como:

```text
createdAt
```

Pero dicho campo debe clasificarse como:

```text
DECISIÓN TÉCNICA DEL NUEVO SISTEMA
```

y no como una reproducción literal del modelo VBA.

La trazabilidad de vencimiento sí está confirmada directamente por la fuente.

Estado:

```text
CONFIRMADO CON DISTINCIÓN ENTRE MODELO HISTÓRICO Y AUDITORÍA TÉCNICA NUEVA
```

---

# 11. Fidelidad del módulo Lots

El lote histórico puede relacionarse tanto con:

```text
ID_Producto
```

como con:

```text
ID_Insumo
```

Esto significa que el concepto de lote no fue diseñado exclusivamente para producto terminado.

La tabla contiene:

```text
Tipo_Lote
ID_Producto
ID_Insumo
```

Por tanto, la documentación V1 debe preservar esta capacidad conceptual.

No debe afirmarse que todos los lotes pertenecen exclusivamente a producción de producto terminado.

El modelo histórico permite representar lotes asociados a:

```text
PRODUCTOS
```

o:

```text
INSUMOS
```

según:

```text
Tipo_Lote
```

Estado:

```text
CONFIRMADO
```

---

# 12. Fidelidad del módulo Sales

El sistema maestro define:

```text
tblVentas
```

y:

```text
tblDetalleVentas
```

La venta contiene:

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

El detalle contiene:

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

Esto confirma:

```text
VENTA
    ↓
DETALLE DE VENTA
```

y:

```text
DETALLE DE VENTA
    ↓
PRODUCTO
```

además de:

```text
DETALLE DE VENTA
    ↓
LOTE
```

La presencia de:

```text
Precio_Unitario
Costo_Unitario
Utilidad_Unitaria
Utilidad_Total
```

confirma que el sistema histórico ya contemplaba conservación de información económica dentro del detalle de venta.

Estado:

```text
CONFIRMADO
```

---

# 13. Fidelidad del módulo Payments

El archivo maestro define:

```text
tblPagosClientes
```

con:

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

Esto confirma la relación:

```text
CLIENTE
    ↓
VENTA
    ↓
PAGO
```

El modelo también confirma que una venta conserva:

```text
Valor_Pagado
```

y:

```text
Saldo_Pendiente
```

Por tanto, la documentación V1 es coherente al tratar los pagos como un módulo independiente encargado de registrar pagos y actualizar la situación financiera de la venta.

Estado:

```text
CONFIRMADO
```

---

# 14. Fidelidad del módulo Expenses

El archivo maestro define:

```text
tblGastos
```

con:

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

Esto confirma que los gastos son una estructura independiente de:

```text
Compras
```

No deben fusionarse automáticamente.

La documentación V1 mantiene correctamente:

```text
PURCHASES
```

como adquisición de insumos y:

```text
EXPENSES
```

como registro de gastos operativos o económicos independientes.

Estado:

```text
CONFIRMADO
```

---

# 15. Fidelidad de Costs y Profitability

El archivo maestro no contiene tablas independientes denominadas:

```text
tblCostos
```

o:

```text
tblRentabilidad
```

Sin embargo, sí existen datos de costo y utilidad distribuidos entre procesos:

```text
Compras
→ Costo_Total
→ Costo_Unidad_Base
```

```text
MovimientosInventario
→ Costo_Unitario
→ Costo_Total
```

```text
Inventario
→ Costo_Promedio
→ Valor_Inventario
```

```text
DetalleProduccion
→ Costo_Teorico
→ Costo_Real
```

```text
DetalleVentas
→ Costo_Unitario
→ Utilidad_Unitaria
→ Utilidad_Total
```

Por tanto, los módulos:

```text
Costs
```

y:

```text
Profitability
```

deben interpretarse como dominios de cálculo y análisis derivados de información existente.

No deben introducir una tabla transaccional independiente únicamente porque existe un módulo documental.

La decisión documental de establecer:

```text
Costs
→ propietario de cálculos de costo
```

y:

```text
Profitability
→ propietario de cálculos de margen y rentabilidad
```

es una organización arquitectónica nueva construida sobre conceptos económicos ya presentes en el VBA.

Clasificación:

```text
EVOLUCIÓN ARQUITECTÓNICA COMPATIBLE CON EL MODELO ORIGINAL
```

---

# 16. Fidelidad del Dashboard

El archivo maestro define una hoja:

```text
01 - DASHBOARD
```

Además, la estructura visual del menú principal lo identifica como un área de:

```text
Indicadores
Alertas
Gráficos
Estado real del negocio
```

El Dashboard aparece como área de consulta y visualización, no como origen de operaciones transaccionales.

La decisión documental de establecer:

```text
Dashboard
→ lectura, consulta y presentación
```

es consistente con el modelo histórico.

Estado:

```text
CONFIRMADO
```

---

# 17. Fidelidad de las relaciones cabecera-detalle

Las siguientes relaciones están directamente confirmadas.

## Recetas

```text
Recipe
    1
    ↓
    N
RecipeDetail
```

Estructura evolucionada confirmada por:

```text
tblRecetas
```

y:

```text
tblDetalleRecetas
```

---

## Compras

```text
Purchase
    1
    ↓
    N
PurchaseDetail
```

Confirmado por:

```text
tblCompras
```

y:

```text
tblDetalleCompras
```

---

## Producción

```text
Production
    1
    ↓
    N
ProductionDetail
```

Confirmado por:

```text
tblProduccion
```

y:

```text
tblDetalleProduccion
```

---

## Ventas

```text
Sale
    1
    ↓
    N
SaleDetail
```

Confirmado por:

```text
tblVentas
```

y:

```text
tblDetalleVentas
```

---

# 18. Fidelidad de la trazabilidad

El modelo VBA contiene suficientes referencias para confirmar una cadena de trazabilidad compuesta por:

```text
COMPRA
    ↓
DETALLE DE COMPRA
    ↓
INSUMO
```

```text
INSUMO
    ↓
RECETA
    ↓
DETALLE DE RECETA
```

```text
RECETA / INSUMOS
    ↓
PRODUCCIÓN
    ↓
DETALLE DE PRODUCCIÓN
```

```text
PRODUCCIÓN
    ↓
LOTE
```

```text
LOTE
    ↓
DETALLE DE VENTA
    ↓
VENTA
    ↓
CLIENTE
```

Los movimientos de inventario complementan la trazabilidad mediante:

```text
ID_Referencia
```

La documentación V1 puede conservar esta cadena como modelo conceptual.

Sin embargo, debe mantenerse una precisión importante:

> La trazabilidad documental representa la relación lógica entre los procesos. La implementación definitiva deberá garantizar mediante claves, referencias y reglas de integridad que esas relaciones puedan reconstruirse técnicamente.

Estado:

```text
CONFIRMADO COMO LÓGICA DE NEGOCIO
```

---

# 19. Validación de los módulos documentales

| Módulo V1     | Fidelidad frente al VBA                 |
| ------------- | --------------------------------------- |
| Presentations | Confirmado                              |
| Supplies      | Confirmado                              |
| Suppliers     | Confirmado                              |
| Products      | Confirmado                              |
| Recipes       | Confirmado como estructura evolucionada |
| Purchases     | Confirmado                              |
| Inventory     | Confirmado                              |
| Production    | Confirmado                              |
| Lots          | Confirmado                              |
| Clients       | Confirmado                              |
| Sales         | Confirmado                              |
| Payments      | Confirmado                              |
| Expenses      | Confirmado                              |
| Costs         | Evolución arquitectónica compatible     |
| Profitability | Evolución arquitectónica compatible     |
| Dashboard     | Confirmado                              |
| Auth          | No proviene del modelo de negocio VBA   |
| Users         | No proviene del modelo de negocio VBA   |

Los módulos:

```text
Auth
```

y:

```text
Users
```

forman parte de la arquitectura de la nueva aplicación y no de la lógica histórica del archivo maestro.

Por tanto, no deben presentarse como entidades recuperadas del VBA.

Clasificación:

```text
NUEVA CAPACIDAD DE APLICACIÓN
```

---

# 20. Validación de reglas de eliminación y estado

En los módulos históricos de maestros existe evidencia explícita del uso de campos como:

```text
Activo
```

y de la regla:

```text
Los registros no se eliminan físicamente como operación normal.
```

Esto está claramente confirmado, por ejemplo, para maestros como insumos.

Sin embargo, no puede afirmarse automáticamente que:

> Todas las entidades maestras y operativas del sistema VBA utilizan obligatoriamente soft delete.

La documentación V1 debe diferenciar entre:

```text
REGLA CONFIRMADA PARA MAESTROS DONDE EXISTE CAMPO ACTIVO
```

y:

```text
DECISIÓN NUEVA PARA ENTIDADES QUE REQUIERAN AUDITORÍA O CANCELACIÓN
```

En particular, para procesos como:

```text
Compras
Producción
Ventas
Pagos
Movimientos de inventario
```

la nueva aplicación debe evaluar si corresponde:

```text
cancelación
```

```text
reversión
```

```text
anulación
```

o:

```text
registro correctivo
```

en lugar de aplicar indiscriminadamente un campo:

```text
Activo
```

Esta precisión debe conservarse en la documentación posterior.

---

# 21. Validación de la autoridad de cálculo

El VBA histórico distribuye cálculos entre diferentes áreas:

```text
Inventario
→ stock, entradas, salidas, costo promedio y valor.
```

```text
Producción
→ cantidades teóricas, reales, diferencias y costos.
```

```text
Ventas
→ total de línea, costos y utilidad.
```

```text
Pagos
→ valor pagado y saldo pendiente.
```

La documentación V1 formaliza esta distribución mediante una regla de propiedad exclusiva de cálculo.

Esta formalización no contradice el VBA.

Sin embargo:

> La asignación exacta de un único propietario arquitectónico para cada cálculo es una decisión del nuevo sistema y no una estructura explícita del código VBA.

Clasificación:

```text
EVOLUCIÓN ARQUITECTÓNICA COMPATIBLE
```

---

# 22. Ambigüedad detectada: versiones históricas dentro del archivo maestro

El archivo maestro contiene evidencia de evolución del propio sistema.

Existen secciones donde una misma responsabilidad aparece representada con estructuras diferentes o con versiones actualizadas.

El caso más importante es:

```text
RECETAS
```

donde existe evidencia de:

```text
estructura inicial integrada
```

y posteriormente:

```text
estructura cabecera + detalle
```

Por esta razón, la validación no debe tratar automáticamente cada fragmento antiguo del archivo como la versión definitiva.

La prioridad de interpretación será:

```text
1. Estructura más evolucionada y explícitamente definida.
        ↓
2. Código actualizado que reemplaza versiones anteriores.
        ↓
3. Constructor final de tablas y estructura física.
        ↓
4. Versiones históricas anteriores.
```

La estructura oficial utilizada para el nuevo modelo será la versión más reciente y coherente del archivo maestro.

---

# 23. Elementos que no deben trasladarse literalmente al nuevo sistema

La fidelidad no significa copiar Excel o VBA.

Los siguientes elementos pertenecen a la implementación anterior:

```text
Worksheet
```

```text
ListObject
```

```text
UserForm
```

```text
Rangos de Excel
```

```text
Macros
```

```text
Generación de estructura física mediante hojas
```

Estos conceptos no forman parte del dominio del negocio.

El nuevo sistema debe conservar:

```text
ENTIDADES
```

```text
RELACIONES
```

```text
REGLAS
```

```text
PROCESOS
```

```text
TRAZABILIDAD
```

pero reemplazar la infraestructura por:

```text
API
```

```text
PostgreSQL
```

```text
Prisma
```

```text
Aplicación Desktop
```

La equivalencia correcta es:

```text
VBA / Excel
        ↓
Nueva aplicación
```

```text
ListObject
→ Persistencia relacional
```

```text
Módulo funcional VBA
→ Módulo de dominio / aplicación
```

```text
UserForm
→ Interfaz Desktop
```

```text
Funciones de acceso a tabla
→ Repositorios / infraestructura de persistencia
```

---

# 24. Hallazgos principales de la validación

## H-01 — El mapa funcional V1 es compatible con el modelo maestro

Estado:

```text
CONFIRMADO
```

Los principales dominios documentados corresponden con áreas existentes en el sistema VBA.

---

## H-02 — Los detalles transaccionales no deben convertirse en módulos autónomos

Estado:

```text
CONFIRMADO
```

La estructura histórica demuestra relaciones cabecera-detalle.

---

## H-03 — Inventory requiere distinguir movimientos de estado consolidado

Estado:

```text
CONFIRMADO
```

El VBA contiene ambas estructuras:

```text
tblMovimientosInventario
```

y:

```text
tblInventario
```

---

## H-04 — Production y Lots son conceptos distintos

Estado:

```text
CONFIRMADO
```

Existen tablas separadas y una referencia desde producción hacia lote.

---

## H-05 — El lote conserva información de vencimiento

Estado:

```text
CONFIRMADO
```

La fuente contiene:

```text
Fecha_Produccion
```

y:

```text
Fecha_Vencimiento
```

---

## H-06 — Los lotes pueden representar productos o insumos

Estado:

```text
CONFIRMADO
```

La tabla contiene:

```text
Tipo_Lote
ID_Producto
ID_Insumo
```

---

## H-07 — Costs y Profitability son dominios derivados

Estado:

```text
CONFIRMADO COMO EVOLUCIÓN COMPATIBLE
```

No existen como tablas independientes en el VBA, pero sus datos y cálculos existen distribuidos en otros procesos.

---

## H-08 — Dashboard no es una fuente transaccional

Estado:

```text
CONFIRMADO
```

Su naturaleza histórica es de consulta y visualización.

---

## H-09 — Soft delete universal no está confirmado por el VBA

Estado:

```text
REQUIERE PRECISIÓN
```

Está confirmado para determinados maestros mediante el uso de:

```text
Activo
```

No debe generalizarse automáticamente a todas las entidades operativas.

---

# 25. Correcciones y precisiones incorporadas al modelo V1

A partir de esta validación se establecen las siguientes precisiones.

## C-01 — Inventario

La documentación debe conservar:

```text
InventoryMovement
```

como historial de variaciones y:

```text
Inventory
```

como representación del estado consolidado.

---

## C-02 — Lotes

El modelo histórico conserva:

```text
Fecha_Produccion
```

y:

```text
Fecha_Vencimiento
```

La creación técnica del registro puede utilizar auditoría como:

```text
createdAt
```

pero no debe confundirse con la fecha real de producción.

---

## C-03 — Soft delete

Se elimina la afirmación general de que todas las entidades del sistema utilizan obligatoriamente soft delete.

La regla queda pendiente de definición por tipo de entidad y operación.

---

## C-04 — Recipes

La estructura oficial V1 será:

```text
Recipe
```

```text
RecipeDetail
```

correspondiente a la versión evolucionada del sistema histórico.

---

## C-05 — Supplier Prices

La información de precios de proveedores se conserva conceptualmente como parte del dominio de proveedores y compras.

No constituye necesariamente un módulo independiente.

---

## C-06 — Costs y Profitability

No se crearán entidades o tablas persistentes para costos o rentabilidad sin una necesidad funcional concreta.

Inicialmente son responsables de:

```text
cálculos
```

```text
consultas
```

```text
análisis
```

sobre información generada por los procesos transaccionales.

---

# 26. Decisiones pendientes

La fidelidad frente al VBA está suficientemente validada para continuar, pero las siguientes decisiones pertenecen al diseño del nuevo sistema y deben resolverse antes de implementar la persistencia definitiva.

## D-01 — Estrategia definitiva de cancelación

Definir por proceso:

```text
soft delete
```

```text
cancelación
```

```text
anulación
```

```text
reversión mediante nuevo registro
```

---

## D-02 — Modelo definitivo de inventario

Definir técnicamente si:

```text
Inventory
```

será una tabla persistente consolidada, una proyección mantenida por la aplicación o una representación calculada.

La existencia de ambos conceptos está confirmada históricamente.

La estrategia técnica definitiva pertenece al nuevo sistema.

---

## D-03 — Trazabilidad entre lotes de insumos y compras

El modelo histórico contiene:

```text
Lote_Proveedor
```

en detalle de compra y una entidad de lotes capaz de representar insumos.

Debe definirse la relación técnica definitiva entre:

```text
PurchaseDetail
```

y:

```text
Lot
```

sin inventar relaciones que el proceso real no necesite.

---

## D-04 — Auditoría técnica

Definir el estándar para:

```text
createdAt
updatedAt
createdBy
updatedBy
```

Estos campos pertenecen a las necesidades de la nueva aplicación y no son una reproducción literal del modelo Excel.

---

## D-05 — Auth y Users

Definir posteriormente su modelo de datos y relación con la auditoría.

Estos dominios no provienen de la lógica original del negocio VBA.

---

# 27. Estado final de fidelidad

Después de contrastar la documentación V1 con el archivo maestro VBA, el resultado general es:

```text
MODELO DOCUMENTAL V1
        ↓
ALINEACIÓN CON LA LÓGICA HISTÓRICA
        ↓
APROBADO CON PRECISIONES
```

La documentación construida conserva correctamente los conceptos fundamentales del sistema original:

```text
Presentaciones
Insumos
Proveedores
Precios de proveedores
Productos
Recetas
Compras
Detalle de compras
Movimientos de inventario
Inventario
Producción
Detalle de producción
Lotes
Clientes
Ventas
Detalle de ventas
Pagos
Gastos
Configuración
Dashboard
```

También conserva correctamente las principales relaciones de negocio:

```text
Producto → Receta → Insumos
```

```text
Compra → DetalleCompra → Insumo
```

```text
Producción → DetalleProducción → Insumo
```

```text
Producción → Lote
```

```text
Venta → DetalleVenta → Producto / Lote
```

```text
Venta → Cliente
```

```text
Pago → Venta / Cliente
```

La nueva arquitectura introduce mejoras organizativas, especialmente mediante:

```text
módulos funcionales
```

```text
separación de responsabilidades
```

```text
propiedad explícita de cálculos
```

```text
documentación de integridad
```

```text
trazabilidad entre procesos
```

Estas mejoras no contradicen la lógica central del sistema VBA.

---

# 28. Dictamen de validación

## Fuente histórica

```text
VALIDADA
```

## Mapa de negocio

```text
ALINEADO
```

## Entidades principales

```text
ALINEADAS
```

## Relaciones cabecera-detalle

```text
CONFIRMADAS
```

## Flujo de inventario

```text
CONFIRMADO CON DISTINCIÓN ENTRE MOVIMIENTOS Y ESTADO CONSOLIDADO
```

## Producción y lotes

```text
CONFIRMADOS
```

## Trazabilidad

```text
COMPATIBLE CON EL MODELO HISTÓRICO
```

## Costs y Profitability

```text
EVOLUCIÓN ARQUITECTÓNICA COMPATIBLE
```

## Soft delete universal

```text
NO CONFIRMADO COMO REGLA GENERAL
```

## Auth y Users

```text
NUEVA CAPACIDAD DEL SISTEMA
```

---

# 29. Conclusión

El modelo documental V1 puede utilizarse como base para iniciar el diseño técnico de la persistencia del nuevo sistema.

No se ha detectado una contradicción estructural que obligue a reconstruir los documentos de dominio o el modelo de datos desde cero.

Sin embargo, a partir de esta validación quedan establecidas las siguientes reglas:

```text
1. El VBA es la fuente histórica del negocio.
```

```text
2. La documentación V1 es la fuente actual de diseño del nuevo sistema.
```

```text
3. Una mejora arquitectónica nueva no debe presentarse como si existiera originalmente en VBA.
```

```text
4. Cuando exista una diferencia entre una versión antigua y una evolucionada del VBA, se utilizará la estructura más reciente y coherente como referencia.
```

```text
5. Las decisiones nuevas deberán documentarse explícitamente.
```

```text
6. La implementación en PostgreSQL no copiará las tablas de Excel automáticamente.
```

```text
7. Antes de crear el schema definitivo se deberá realizar la traducción controlada:
```

```text
MODELO DE NEGOCIO V1
        ↓
MODELO RELACIONAL
        ↓
RESTRICCIONES DE INTEGRIDAD
        ↓
DECISIONES DE PERSISTENCIA
        ↓
PRISMA SCHEMA
```

## Estado final

```text
FIDELIDAD FRENTE AL MODELO MAESTRO VBA:
APROBADA CON PRECISIONES DOCUMENTADAS
```
