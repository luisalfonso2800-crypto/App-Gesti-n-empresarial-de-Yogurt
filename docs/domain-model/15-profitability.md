# 15 - PROFITABILITY

## Propósito

El módulo **Profitability** es responsable de analizar la rentabilidad económica generada por el negocio.

Su función es transformar la información histórica proveniente de ventas, costos y gastos en indicadores que permitan responder preguntas como:

* ¿Cuánto dinero se generó en ventas?
* ¿Cuál fue el costo de los productos vendidos?
* ¿Cuál fue la utilidad generada?
* ¿Qué producto fue más rentable?
* ¿Qué lote generó mayor utilidad?
* ¿Cuál fue la rentabilidad durante un período determinado?
* ¿Cómo afectan los gastos al resultado final del negocio?
* ¿Cuál fue la diferencia entre los ingresos y los costos asociados?
* ¿Cuál es el margen obtenido sobre las ventas?

En el sistema original, la rentabilidad fue identificada como un área independiente de **consultas y análisis**, junto con Inventario, Movimientos, Lotes y Costos. 

---

# 1. RESPONSABILIDAD DEL MÓDULO

El módulo Profitability debe:

1. Analizar los ingresos generados por las ventas.
2. Utilizar los costos históricos asociados a los productos vendidos.
3. Calcular utilidad bruta.
4. Analizar utilidad por producto.
5. Analizar utilidad por lote.
6. Analizar utilidad por venta.
7. Analizar resultados por período.
8. Incorporar información de gastos cuando corresponda al nivel de análisis definido.
9. Calcular indicadores de margen y rentabilidad.
10. Proporcionar información para consultas y Dashboard.
11. Permitir comparar resultados entre diferentes períodos.
12. Mantener la trazabilidad entre un indicador y la información histórica que lo origina.

Profitability es principalmente un módulo de:

```text
Análisis
Cálculo
Consulta
Indicadores
```

No debe convertirse en propietario de las operaciones que generan los datos.

---

# 2. POSICIÓN DEL MÓDULO EN EL NEGOCIO

Profitability se encuentra al final de varios flujos económicos.

```text
PURCHASES
    │
    ▼
Costos de adquisición
    │
    ▼
COSTS
    │
    ▼
Costos históricos
    │
    ├──────────────────┐
    │                  │
    ▼                  ▼
PRODUCTION          SALES
    │                  │
    ▼                  │
LOTS ────────────────┘
                       │
                       ▼
                    Ingresos
                       │
                       ▼
                 PROFITABILITY
                       ▲
                       │
                    EXPENSES
```

El módulo no genera los hechos económicos.

Los analiza.

---

# 3. FUENTES PRINCIPALES DE INFORMACIÓN

Profitability obtiene información principalmente de:

```text
SALES
    │
    ├── Ventas
    ├── Cantidades vendidas
    ├── Precios
    ├── Descuentos
    └── Totales

COSTS
    │
    ├── Costos unitarios
    ├── Costos de producción
    └── Costos históricos

EXPENSES
    │
    ├── Gastos
    ├── Categorías
    └── Períodos

LOTS
    │
    └── Trazabilidad de productos producidos

PRODUCTS
    │
    └── Identificación y clasificación de productos

PAYMENTS
    │
    └── Información de cobro cuando el análisis lo requiera
```

Profitability no debe duplicar la propiedad de estos datos.

Debe consultar o recibir la información necesaria para construir sus análisis.

---

# 4. BASE HISTÓRICA DEL SISTEMA ORIGINAL

La estructura original del detalle de ventas ya contemplaba información específica para analizar utilidad:

| Campo               | Propósito                  |
| ------------------- | -------------------------- |
| `ID_Detalle_Venta`  | Identificador del detalle  |
| `ID_Venta`          | Venta a la que pertenece   |
| `ID_Producto`       | Producto vendido           |
| `ID_Lote`           | Lote de origen             |
| `Cantidad`          | Cantidad vendida           |
| `Precio_Unitario`   | Precio por unidad          |
| `Descuento`         | Descuento aplicado         |
| `Total_Linea`       | Total de la línea          |
| `Costo_Unitario`    | Costo unitario histórico   |
| `Utilidad_Unitaria` | Utilidad por unidad        |
| `Utilidad_Total`    | Utilidad total de la línea |

Esta estructura demuestra que la utilidad por venta ya formaba parte del modelo original del negocio. 

La nueva aplicación debe conservar esta capacidad.

---

# 5. INGRESOS

Los ingresos utilizados para analizar rentabilidad provienen principalmente de las ventas.

Conceptualmente:

```text
VENTAS
    │
    ├── Producto
    ├── Cantidad
    ├── Precio
    ├── Descuento
    └── Total
            │
            ▼
         INGRESOS
```

Para una línea de venta:

```text
Ingreso bruto
=
Cantidad
×
Precio unitario
```

Si existe descuento:

```text
Ingreso neto de la línea
=
Ingreso bruto
-
Descuento
```

El sistema original ya contemplaba `Precio_Unitario`, `Descuento` y `Total_Linea` dentro del detalle de ventas. 

---

# 6. COSTO DE LOS PRODUCTOS VENDIDOS

La rentabilidad no debe calcularse utilizando simplemente el costo actual del producto.

Debe utilizarse el costo histórico asociado a la operación de venta.

Conceptualmente:

```text
Cantidad vendida
×
Costo unitario histórico
=
Costo de los productos vendidos
```

El campo:

```text
Costo_Unitario
```

dentro del detalle de ventas permite conservar esta información. 

Esta regla es fundamental.

Si el costo de un insumo cambia posteriormente, ese cambio no debe modificar artificialmente la utilidad histórica de una venta ya registrada.

---

# 7. UTILIDAD UNITARIA

Para cada unidad vendida puede calcularse:

```text
Utilidad unitaria
=
Precio unitario efectivo
-
Costo unitario
```

La estructura original ya contemplaba:

```text
Utilidad_Unitaria
```

como parte del detalle de ventas. 

La utilidad unitaria permite analizar el rendimiento económico individual de cada producto vendido.

---

# 8. UTILIDAD TOTAL POR LÍNEA

Para una línea de venta:

```text
Utilidad total
=
Utilidad unitaria
×
Cantidad vendida
```

El sistema original ya contemplaba el campo:

```text
Utilidad_Total
```

dentro de `tblDetalleVentas`. 

Conceptualmente:

```text
VENTA
    │
    ├── Producto A
    │       ├── Cantidad
    │       ├── Ingreso
    │       ├── Costo
    │       └── Utilidad
    │
    ├── Producto B
    │       ├── Cantidad
    │       ├── Ingreso
    │       ├── Costo
    │       └── Utilidad
    │
    └── ...
```

---

# 9. UTILIDAD BRUTA

La utilidad bruta representa la diferencia entre los ingresos de las ventas y el costo asociado a los productos vendidos.

Conceptualmente:

```text
Utilidad bruta
=
Ingresos por ventas
-
Costo de productos vendidos
```

También puede reconstruirse mediante:

```text
Utilidad bruta
=
Σ utilidad total
de cada línea de venta
```

Esta utilidad todavía no representa necesariamente el resultado final del negocio, porque pueden existir gastos adicionales.

---

# 10. GASTOS Y RESULTADO

El módulo Expenses registra los gastos operativos y administrativos del negocio.

La relación conceptual es:

```text
Ingresos
      -
Costo de productos vendidos
      =
Utilidad bruta
      -
Gastos aplicables
      =
Resultado
```

Sin embargo, no todos los gastos deben atribuirse automáticamente a un producto, lote o venta específica.

Por tanto, Profitability debe distinguir claramente entre:

```text
Rentabilidad bruta
```

y:

```text
Resultado después de gastos
```

La regla de asignación de gastos deberá definirse explícitamente.

No debe inventarse una distribución automática sin una regla de negocio formal.

---

# 11. MARGEN BRUTO

El margen bruto permite expresar la utilidad bruta como proporción de los ingresos.

Conceptualmente:

```text
Margen bruto (%)
=
(Utilidad bruta
÷
Ingresos)
× 100
```

Este indicador permite comparar resultados aunque los valores absolutos de venta sean diferentes.

Ejemplo conceptual:

```text
Producto A
Ventas: $1.000.000
Utilidad: $300.000

Producto B
Ventas: $500.000
Utilidad: $250.000
```

Aunque el Producto A genera mayor utilidad absoluta, el análisis porcentual puede mostrar una situación diferente.

Por esta razón, Profitability debe poder analizar tanto:

```text
Valores absolutos
```

como:

```text
Valores porcentuales
```

---

# 12. RENTABILIDAD POR PRODUCTO

El módulo debe permitir analizar los resultados de cada producto.

Conceptualmente:

```text
PRODUCTO
    │
    ├── Unidades vendidas
    ├── Ingresos
    ├── Costos
    ├── Utilidad
    └── Margen
```

Debe ser posible responder:

```text
¿Cuánto se vendió de este producto?

¿Cuánto ingreso generó?

¿Cuál fue su costo?

¿Cuál fue su utilidad?

¿Cuál fue su margen?
```

El análisis debe poder realizarse para un período determinado.

---

# 13. RENTABILIDAD POR LOTE

Cuando una venta está relacionada con un lote, el sistema puede analizar el resultado económico generado por ese lote.

La estructura original relaciona el detalle de venta con:

```text
ID_Lote
```



Conceptualmente:

```text
LOTE
    │
    ├── Producto
    ├── Cantidad producida
    ├── Costo asociado
    │
    └── Ventas
            │
            ├── Ingresos
            ├── Costos
            └── Utilidad
```

Esto permite conservar trazabilidad entre:

```text
Producción
        ↓
Lote
        ↓
Venta
        ↓
Resultado económico
```

---

# 14. RENTABILIDAD POR VENTA

Cada venta puede analizarse individualmente.

Conceptualmente:

```text
VENTA
    │
    ├── Total vendido
    ├── Costo asociado
    ├── Utilidad total
    └── Margen
```

Si una venta contiene múltiples productos, el resultado total debe poder reconstruirse a partir de sus líneas.

```text
Venta
    │
    ├── Línea 1
    ├── Línea 2
    ├── Línea 3
    └── ...
            │
            ▼
     Resultado consolidado
```

---

# 15. RENTABILIDAD POR PERÍODO

Profitability debe permitir analizar períodos.

Ejemplos:

```text
Día
Semana
Mes
Año
Período personalizado
```

Conceptualmente:

```text
PERÍODO
    │
    ├── Ingresos
    ├── Costos
    ├── Utilidad bruta
    ├── Gastos
    ├── Resultado
    └── Indicadores
```

Esto permite responder:

```text
¿Cuánto se vendió este mes?

¿Cuánto costaron los productos vendidos?

¿Cuál fue la utilidad bruta?

¿Cuánto se gastó?

¿Cuál fue el resultado del período?
```

---

# 16. COMPARACIÓN ENTRE PERÍODOS

El módulo debe poder proporcionar información para comparar:

```text
Mes actual
vs
Mes anterior
```

o:

```text
Semana actual
vs
Semana anterior
```

La comparación debe utilizar información histórica conservada por los módulos operativos.

Profitability no debe modificar los registros históricos para producir una comparación.

Debe analizar los datos existentes.

---

# 17. RELACIÓN ENTRE VENTAS Y COBROS

Debe mantenerse una separación entre:

```text
Venta
```

y:

```text
Pago
```

Una venta representa una operación comercial.

Un pago representa el dinero recibido.

Por tanto:

```text
VENTA
    │
    ▼
Genera ingreso comercial
```

mientras:

```text
PAGO
    │
    ▼
Registra dinero recibido
```

Esto significa que la utilidad generada por una venta y el dinero efectivamente cobrado no son necesariamente el mismo concepto.

Ejemplo conceptual:

```text
Venta:
$100.000

Costo:
$60.000

Utilidad bruta:
$40.000

Pago recibido:
$0
```

La venta puede generar una utilidad comercial aunque el cliente todavía no haya pagado.

Por tanto, Profitability debe diferenciar:

```text
Rentabilidad basada en ventas
```

de:

```text
Flujo de dinero o recaudo
```

El análisis de recaudo pertenece principalmente a Payments y al análisis financiero que se defina posteriormente.

---

# 18. RELACIÓN CON COSTS

Costs es responsable de proporcionar la información relacionada con los costos.

Profitability utiliza esa información para analizar resultados.

```text
COSTS
    │
    ├── Costo unitario
    ├── Costo histórico
    └── Costo total
            │
            ▼
       PROFITABILITY
            │
            ▼
     Utilidad y margen
```

Profitability no debe recalcular arbitrariamente un costo utilizando reglas distintas a las establecidas por Costs.

---

# 19. RELACIÓN CON EXPENSES

Expenses es responsable de registrar:

```text
Fecha
Categoría
Descripción
Valor
Tipo de gasto
Período
Observaciones
```

Profitability utiliza esta información cuando se realiza un análisis de resultados que incorpora gastos.

La relación es:

```text
EXPENSES
    │
    ▼
Información de gastos
    │
    ▼
PROFITABILITY
    │
    ▼
Resultado después de gastos
```

Profitability no es responsable de crear, modificar o eliminar gastos.

---

# 20. RELACIÓN CON SALES

Sales es una de las principales fuentes de información del módulo.

Sales proporciona:

```text
Ventas
Productos vendidos
Cantidades
Precios
Descuentos
Totales
Costos históricos asociados
```

Profitability transforma esta información en indicadores.

```text
SALES
    │
    ▼
Hechos comerciales
    │
    ▼
PROFITABILITY
    │
    ▼
Análisis económico
```

---

# 21. RELACIÓN CON PAYMENTS

Payments permite conocer el estado de recaudo.

Puede proporcionar información para análisis como:

```text
Ventas registradas
vs
Pagos recibidos
```

Sin embargo:

```text
Rentabilidad
≠
Dinero efectivamente recibido
```

Esta separación debe mantenerse.

Profitability puede consumir información de Payments para análisis complementarios, pero Payments continúa siendo el propietario de los registros de cobro.

---

# 22. RELACIÓN CON LOTS

Lots permite conservar trazabilidad del origen de los productos.

La relación conceptual es:

```text
PRODUCTION
    │
    ▼
LOT
    │
    ▼
SALES
    │
    ▼
PROFITABILITY
```

Cuando exista relación entre venta y lote, debe ser posible seguir el flujo histórico.

Esto permite analizar:

```text
¿Cuánto costó producir este lote?

¿Cuánto se vendió de este lote?

¿Cuánto ingreso generó?

¿Cuál fue la utilidad asociada?
```

---

# 23. RELACIÓN CON DASHBOARD

Profitability proporciona información analítica que puede ser presentada por Dashboard.

Ejemplos de indicadores:

```text
Ingresos del período
Utilidad bruta
Margen bruto
Gastos del período
Resultado después de gastos
Producto más rentable
Producto con mayor utilidad
Lote con mayor rendimiento económico
Comparación con período anterior
```

Dashboard no debe convertirse en el propietario de la lógica de cálculo.

La relación correcta es:

```text
PROFITABILITY
        │
        ▼
Datos e indicadores
        │
        ▼
DASHBOARD
        │
        ▼
Visualización
```

---

# 24. RESPONSABILIDADES DEL MÓDULO

Profitability es responsable de:

```text
✓ Analizar ingresos.
✓ Analizar costos históricos.
✓ Calcular utilidad bruta.
✓ Calcular márgenes.
✓ Analizar utilidad por producto.
✓ Analizar utilidad por lote.
✓ Analizar utilidad por venta.
✓ Analizar resultados por período.
✓ Incorporar gastos cuando corresponda.
✓ Comparar períodos.
✓ Proporcionar indicadores al Dashboard.
✓ Mantener trazabilidad hacia la información fuente.
```

---

# 25. NO RESPONSABILIDADES

Profitability no debe:

```text
✗ Registrar ventas.
✗ Registrar pagos.
✗ Crear productos.
✗ Modificar precios.
✗ Registrar compras.
✗ Calcular costos utilizando reglas independientes de Costs.
✗ Modificar inventario.
✗ Registrar producción.
✗ Crear lotes.
✗ Registrar gastos.
✗ Administrar clientes.
✗ Administrar proveedores.
✗ Modificar registros históricos para producir indicadores.
```

---

# 26. PRINCIPIO DE TRAZABILIDAD

Todo indicador de rentabilidad debe poder relacionarse con la información que lo originó.

Por ejemplo:

```text
Utilidad del producto
        ↓
Ventas del producto
        ↓
Detalles de venta
        ↓
Cantidad
Precio
Costo unitario histórico
```

O:

```text
Resultado del período
        ↓
Ventas del período
        ↓
Costos asociados
        ↓
Gastos aplicables
```

No deben existir indicadores que dependan de valores manuales sin una fuente identificable.

---

# 27. REGLAS PRINCIPALES

## Regla 1 — La rentabilidad utiliza información histórica

Los cambios posteriores en:

```text
Precios
Costos
Recetas
Productos
```

no deben modificar artificialmente los resultados históricos.

---

## Regla 2 — Utilidad y pago son conceptos diferentes

Una venta puede ser rentable aunque todavía no haya sido cobrada.

Un pago puede producirse después de la fecha de venta.

Por tanto:

```text
Utilidad
≠
Recaudo
```

---

## Regla 3 — Los indicadores deben ser reproducibles

Un resultado debe poder reconstruirse a partir de los datos históricos.

Incorrecto:

```text
Utilidad mensual = valor escrito manualmente
```

Correcto:

```text
Utilidad mensual
=
Σ resultados de las operaciones
incluidas en el período
```

---

## Regla 4 — Los gastos no deben asignarse arbitrariamente

Si un gasto se utiliza para calcular el resultado de un producto, lote o período, debe existir una regla definida para esa asignación.

---

## Regla 5 — El análisis no debe modificar los hechos históricos

Profitability consulta y calcula.

No debe alterar:

```text
Ventas
Costos históricos
Pagos
Gastos
Producciones
Lotes
```

para generar un reporte.

---

# 28. INDICADORES CONCEPTUALES

El módulo podrá proporcionar indicadores como:

```text
Ingresos totales
```

```text
Costo de productos vendidos
```

```text
Utilidad bruta
```

```text
Margen bruto
```

```text
Gastos del período
```

```text
Resultado después de gastos
```

```text
Utilidad por producto
```

```text
Margen por producto
```

```text
Utilidad por lote
```

```text
Utilidad por venta
```

```text
Producto con mayor utilidad
```

```text
Producto con mayor margen
```

---

# 29. DECISIONES PENDIENTES

Existen decisiones que no deben asumirse automáticamente durante la implementación.

## 29.1 Definición exacta de rentabilidad

Debe definirse formalmente la diferencia entre:

```text
Utilidad bruta
Resultado operativo
Resultado después de gastos
Rentabilidad
Margen
```

Estos conceptos pueden requerir indicadores distintos.

---

## 29.2 Asignación de gastos

Debe definirse si los gastos serán analizados:

```text
Solo por período
```

o si algunos podrán distribuirse hacia:

```text
Productos
Lotes
Producciones
Centros de costo
```

No se debe implementar una distribución automática sin esta definición.

---

## 29.3 Tratamiento de descuentos

Debe definirse formalmente si el análisis utiliza:

```text
Precio original
```

o:

```text
Precio efectivo después del descuento
```

La información original ya contempla ambos conceptos mediante `Precio_Unitario`, `Descuento` y `Total_Linea`. 

La fórmula definitiva deberá respetar la definición que se adopte en el modelo de ventas.

---

## 29.4 Devoluciones y anulaciones

El sistema original reconstruido hasta este punto no define todavía el tratamiento completo de:

```text
Devoluciones
Anulación de ventas
Reversión de pagos
```

Cuando estas funcionalidades sean incorporadas, deberá definirse cómo afectan:

```text
Ingresos
Costos
Utilidad
Rentabilidad histórica
```

No deben inventarse reglas durante la implementación.

---

# 30. MODELO CONCEPTUAL

```text
                    SALES
                      │
                      ▼
                   INGRESOS
                      │
                      │
                      ├───────────────┐
                      │               │
                      ▼               ▼
                    COSTS         EXPENSES
                      │               │
                      ▼               ▼
               COSTOS HISTÓRICOS    GASTOS
                      │               │
                      └───────┬───────┘
                              │
                              ▼
                        PROFITABILITY
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
           UTILIDAD         MARGEN       RESULTADO
               │
               ▼
           DASHBOARD
```

---

# 31. FLUJO DE ANÁLISIS POR VENTA

```text
1. Obtener venta
        ↓
2. Obtener detalles de venta
        ↓
3. Obtener cantidad vendida
        ↓
4. Obtener precio efectivo
        ↓
5. Obtener costo unitario histórico
        ↓
6. Calcular ingreso
        ↓
7. Calcular costo asociado
        ↓
8. Calcular utilidad
        ↓
9. Consolidar resultado
```

---

# 32. FLUJO DE ANÁLISIS POR PERÍODO

```text
1. Definir período
        ↓
2. Obtener ventas incluidas
        ↓
3. Calcular ingresos
        ↓
4. Obtener costos históricos asociados
        ↓
5. Calcular utilidad bruta
        ↓
6. Obtener gastos aplicables
        ↓
7. Calcular resultado
        ↓
8. Calcular indicadores porcentuales
        ↓
9. Presentar análisis
```

---

# 33. CONSULTAS PRINCIPALES PREVISTAS

El módulo debe permitir construir consultas como:

```text
Rentabilidad general del negocio
```

```text
Rentabilidad por período
```

```text
Rentabilidad por producto
```

```text
Rentabilidad por lote
```

```text
Rentabilidad por venta
```

```text
Productos más rentables
```

```text
Productos con mayor margen
```

```text
Comparación entre períodos
```

```text
Ingresos vs costos
```

```text
Utilidad bruta vs gastos
```

```text
Ventas registradas vs dinero cobrado
```

---

# 34. DEPENDENCIAS CON OTROS DOMINIOS

```text
Profitability
│
├── Sales
│       └── Fuente principal de ingresos y ventas
│
├── Costs
│       └── Fuente de información de costos
│
├── Expenses
│       └── Fuente de gastos
│
├── Lots
│       └── Trazabilidad de producción y ventas
│
├── Products
│       └── Identificación de productos
│
├── Payments
│       └── Información complementaria de recaudo
│
└── Dashboard
        └── Consume indicadores para visualización
```

---

# 35. EVOLUCIÓN PREVISTA

El módulo podrá evolucionar cuando exista una necesidad real para incorporar:

* análisis por canal de venta;
* análisis por cliente;
* análisis por tipo de producto;
* análisis por presentación;
* centros de costo;
* presupuestos;
* metas de rentabilidad;
* comparaciones contra objetivos;
* análisis de tendencias;
* proyecciones;
* alertas de caída de margen;
* ranking automático de productos;
* indicadores financieros más avanzados;
* reportes exportables.

Estas capacidades no forman parte obligatoria de la primera implementación.

Su incorporación deberá seguir las reglas definidas en:

```text
docs/architecture/architecture-evolution.md
```

---

# 36. RESULTADO ESPERADO

El módulo Profitability debe permitir responder, con información trazable:

```text
¿Cuánto dinero vendimos?

¿Cuánto costaron los productos vendidos?

¿Cuál fue nuestra utilidad bruta?

¿Cuánto gastamos?

¿Cuál fue el resultado después de gastos?

¿Qué producto genera mayor utilidad?

¿Qué producto tiene mejor margen?

¿Qué lote generó mayor resultado?

¿Cómo cambió la rentabilidad entre períodos?
```

Profitability representa la capa de análisis económico del negocio.

Su función no es registrar operaciones ni modificar datos históricos, sino convertir la información generada por ventas, costos, gastos, lotes y otros procesos relacionados en indicadores claros, reproducibles y trazables.
