# 07 — BUSINESS PROCESSES

## 1. Propósito del documento

Este documento define los procesos principales del negocio y la secuencia funcional mediante la cual interactúan los módulos del sistema.

Su objetivo es establecer:

* qué procesos existen;
* dónde inicia cada proceso;
* qué información utiliza;
* qué resultado produce;
* qué módulos participan;
* qué cambios genera;
* qué procesos dependen de otros;
* qué información debe conservarse históricamente.

Este documento no define todavía:

* endpoints;
* servicios de NestJS;
* controladores;
* tablas físicas;
* transacciones técnicas;
* implementación con Prisma.

Define el comportamiento funcional del negocio.

Debe leerse junto con:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
05-data-model-decisions.md
06-inventory-flow.md
```

---

# 2. Mapa general de procesos

El sistema se organiza alrededor del siguiente ciclo operativo:

```text
DATOS MAESTROS
        │
        ├── Presentaciones
        ├── Insumos
        ├── Proveedores
        ├── Productos
        ├── Recetas
        └── Clientes
        │
        ▼
OPERACIÓN DE ABASTECIMIENTO
        │
        ▼
COMPRAS
        │
        ▼
INVENTARIO DE INSUMOS
        │
        ▼
PRODUCCIÓN
        │
        ▼
LOTES Y PRODUCTO TERMINADO
        │
        ▼
VENTAS
        │
        ├── SALIDA DE INVENTARIO
        │
        └── CUENTAS POR COBRAR / PAGOS
        │
        ▼
ANÁLISIS ECONÓMICO
        │
        ├── COSTOS
        ├── GASTOS
        └── RENTABILIDAD
        │
        ▼
DASHBOARD
```

Los procesos no son módulos aislados.

Cada uno utiliza información producida por otros procesos.

---

# 3. Clasificación de procesos

El sistema distingue cuatro grupos principales.

```text
1. Configuración y datos maestros

2. Abastecimiento e inventario

3. Producción y trazabilidad

4. Comercialización y análisis
```

Esta clasificación es funcional.

No determina necesariamente cómo se implementarán técnicamente los módulos.

---

# 4. Proceso de gestión de presentaciones

## 4.1 Inicio

El proceso inicia cuando se necesita registrar una nueva forma de presentación para los productos.

Una presentación define características relacionadas con la forma en que el producto será entregado o comercializado.

Puede incluir información como:

```text
Nombre

Cantidad en onzas

Cantidad en mililitros

Tipo de envase

Uso de tapa

Observación

Estado
```

## 4.2 Resultado

El proceso produce una presentación disponible para ser utilizada por otros procesos.

Conceptualmente:

```text
CREAR PRESENTACIÓN
        ↓
VALIDAR DATOS
        ↓
REGISTRAR PRESENTACIÓN
        ↓
PRESENTACIÓN DISPONIBLE
```

## 4.3 Módulos relacionados

```text
Presentations
        ↓
Products
```

Una presentación no representa una operación de inventario.

---

# 5. Proceso de gestión de insumos

## 5.1 Inicio

El proceso inicia cuando se necesita registrar un recurso utilizado por el negocio.

Los insumos pueden incluir materiales utilizados directamente en la elaboración o elementos necesarios para la presentación del producto.

## 5.2 Flujo

```text
DEFINIR INSUMO
        ↓
REGISTRAR INFORMACIÓN
        ↓
DEFINIR UNIDAD DE CONTROL
        ↓
VALIDAR
        ↓
INSUMO DISPONIBLE PARA OPERACIONES
```

## 5.3 Resultado

El resultado es un insumo maestro disponible para:

```text
Compras

Recetas

Producción

Inventario
```

El registro del insumo no genera existencias.

La existencia aparece únicamente cuando ocurre una operación que produce una entrada de inventario.

---

# 6. Proceso de gestión de proveedores

## 6.1 Inicio

El proceso inicia cuando se necesita registrar una fuente de suministro.

## 6.2 Flujo

```text
REGISTRAR PROVEEDOR
        ↓
VALIDAR INFORMACIÓN
        ↓
PROVEEDOR DISPONIBLE
```

## 6.3 Resultado

El proveedor queda disponible para participar en procesos de compra.

El proveedor no modifica directamente:

```text
Inventario

Costos

Producción
```

Su participación ocurre cuando existe una operación concreta de compra.

---

# 7. Proceso de gestión de precios de proveedores

El negocio puede requerir conservar información sobre los precios ofrecidos por diferentes proveedores para los insumos.

El flujo conceptual es:

```text
PROVEEDOR
        +
INSUMO
        ↓
REGISTRAR PRECIO DE REFERENCIA
        ↓
INFORMACIÓN DISPONIBLE PARA CONSULTA
```

Esta información representa una referencia comercial.

No debe confundirse automáticamente con el precio histórico de una compra.

Una compra debe conservar el precio realmente registrado en esa operación.

Por tanto:

```text
PRECIO DE REFERENCIA
        ≠
PRECIO HISTÓRICO DE COMPRA
```

El precio de referencia puede cambiar.

La compra histórica debe conservar su valor original.

---

# 8. Proceso de gestión de productos

## 8.1 Inicio

El proceso inicia cuando se necesita definir un producto que será producido o comercializado.

## 8.2 Flujo

```text
DEFINIR PRODUCTO
        ↓
ASIGNAR PRESENTACIÓN
        ↓
REGISTRAR PROPIEDADES
        ↓
VALIDAR
        ↓
PRODUCTO DISPONIBLE
```

## 8.3 Resultado

El producto queda disponible para:

```text
Recetas

Producción

Lotes

Ventas

Costos

Rentabilidad
```

El registro de un producto no genera inventario.

La existencia de producto terminado depende de una producción y de los lotes generados.

---

# 9. Proceso de definición de recetas

## 9.1 Inicio

El proceso inicia cuando existe un producto cuya elaboración requiere una composición definida.

## 9.2 Flujo

```text
SELECCIONAR PRODUCTO
        ↓
CREAR RECETA
        ↓
AGREGAR INSUMOS
        ↓
DEFINIR CANTIDADES
        ↓
VALIDAR RECETA
        ↓
RECETA DISPONIBLE
```

## 9.3 Resultado

La receta queda disponible como definición para el proceso de producción.

La receta no:

```text
Compra insumos

Descuenta inventario

Genera producto terminado

Crea lotes
```

La receta representa una definición.

La producción representa la ejecución real.

---

# 10. Proceso de compra

## 10.1 Inicio

El proceso inicia cuando el negocio adquiere uno o varios insumos.

## 10.2 Información requerida

La compra debe relacionarse con:

```text
Proveedor

Fecha

Detalles de compra
```

Cada detalle representa un insumo adquirido.

La información de cada detalle debe permitir conocer, según las reglas del dominio:

```text
Insumo

Cantidad

Unidad correspondiente

Valor económico registrado
```

## 10.3 Flujo

```text
SELECCIONAR PROVEEDOR
        ↓
CREAR COMPRA
        ↓
AGREGAR DETALLES
        ↓
VALIDAR INFORMACIÓN
        ↓
CONFIRMAR COMPRA
        ↓
GENERAR ENTRADAS DE INVENTARIO
```

## 10.4 Resultado

Una compra confirmada produce:

```text
Compra histórica
        +
Detalles históricos
        +
Entradas de inventario
```

---

# 11. Proceso de disponibilidad de inventario

El inventario representa el estado resultante de las operaciones.

El proceso conceptual es:

```text
MOVIMIENTOS REGISTRADOS
        ↓
ENTRADAS
        -
SALIDAS
        ↓
EXISTENCIA RESULTANTE
```

El inventario recibe consecuencias de otros procesos.

No inicia arbitrariamente cambios de existencias.

Sus principales orígenes son:

```text
Compras

Producción

Ventas

Procesos futuros explícitamente definidos
```

---

# 12. Proceso de planificación de producción

La planificación de producción representa la preparación de una operación antes de ejecutarla.

Conceptualmente:

```text
SELECCIONAR PRODUCTO
        ↓
IDENTIFICAR RECETA
        ↓
DETERMINAR CANTIDAD A PRODUCIR
        ↓
CALCULAR INSUMOS REQUERIDOS
        ↓
CONSULTAR DISPONIBILIDAD
        ↓
PREPARAR PRODUCCIÓN
```

La planificación no debe descontar inventario.

La salida de inventario ocurre únicamente cuando se registra o confirma la producción según las reglas definitivas del proceso.

---

# 13. Proceso de ejecución de producción

## 13.1 Inicio

El proceso inicia cuando se realiza la producción real.

## 13.2 Flujo

```text
PRODUCCIÓN PREPARADA
        ↓
VALIDAR DISPONIBILIDAD
        ↓
REGISTRAR CANTIDADES UTILIZADAS
        ↓
CONFIRMAR PRODUCCIÓN
        ↓
GENERAR SALIDAS DE INSUMOS
        ↓
REGISTRAR RESULTADO PRODUCIDO
        ↓
GENERAR LOTE
        ↓
GENERAR DISPONIBILIDAD
DE PRODUCTO TERMINADO
```

## 13.3 Resultado

Una producción confirmada produce:

```text
Registro histórico de producción

Detalle de insumos utilizados

Salidas de inventario de insumos

Resultado producido

Lote identificable

Entrada de producto terminado
```

---

# 14. Proceso de creación de lote

El lote surge como resultado de una producción.

El flujo es:

```text
PRODUCCIÓN CONFIRMADA
        ↓
IDENTIFICAR PRODUCTO RESULTANTE
        ↓
REGISTRAR CANTIDAD INICIAL
        ↓
REGISTRAR FECHA DE CREACIÓN
        ↓
REGISTRAR FECHA DE VENCIMIENTO
        ↓
CREAR LOTE
```

El lote debe conservar su relación con la producción de origen.

El lote no debe perder su identidad cuando:

```text
Se vende parcialmente

Se agota

Vence
```

El cambio afecta su disponibilidad o estado operativo, no la existencia histórica del lote.

---

# 15. Proceso de control de vencimiento

El sistema debe poder evaluar la fecha de vencimiento de los lotes.

Conceptualmente:

```text
LOTE
        ↓
CONSULTAR FECHA ACTUAL
        ↓
COMPARAR CON FECHA DE VENCIMIENTO
        │
        ├── Vigente
        │       ↓
        │   Puede considerarse disponible
        │
        └── Vencido
                ↓
          No disponible para venta
```

El vencimiento no elimina el lote.

El lote continúa formando parte del historial.

---

# 16. Proceso de registro de clientes

El proceso inicia cuando se necesita registrar un cliente.

El flujo es:

```text
REGISTRAR CLIENTE
        ↓
VALIDAR INFORMACIÓN
        ↓
CLIENTE DISPONIBLE
```

El cliente puede participar posteriormente en:

```text
Ventas

Pagos

Consultas de historial
```

Registrar un cliente no genera una venta ni una obligación financiera.

---

# 17. Proceso de venta

## 17.1 Inicio

El proceso inicia cuando se realiza una operación comercial.

## 17.2 Flujo

```text
SELECCIONAR CLIENTE
        ↓
CREAR VENTA
        ↓
AGREGAR PRODUCTOS
        ↓
IDENTIFICAR DISPONIBILIDAD
        ↓
VALIDAR PRODUCTOS Y LOTES
        ↓
CONFIRMAR VENTA
        ↓
REGISTRAR SALIDA DE INVENTARIO
```

## 17.3 Resultado

Una venta confirmada produce:

```text
Venta histórica

Detalles de venta

Salida de inventario

Actualización de disponibilidad
```

La venta puede estar relacionada con:

```text
Cliente

Producto

Lote, cuando corresponda
```

---

# 18. Proceso de registro de pagos

Un pago representa un registro financiero asociado a una venta cuando corresponda.

El flujo conceptual es:

```text
IDENTIFICAR VENTA
        ↓
IDENTIFICAR VALOR PENDIENTE
        ↓
REGISTRAR PAGO
        ↓
ACTUALIZAR INFORMACIÓN DE PAGO
```

La venta y el pago permanecen separados.

Una venta puede tener:

```text
Un pago

Varios pagos

Un saldo pendiente
```

El pago no debe crear una nueva venta.

---

# 19. Proceso de registro de gastos

El proceso inicia cuando se registra una salida económica que corresponde a un gasto del negocio.

El flujo es:

```text
IDENTIFICAR GASTO
        ↓
REGISTRAR INFORMACIÓN
        ↓
REGISTRAR VALOR
        ↓
CONSERVAR FECHA Y CONTEXTO
        ↓
GASTO DISPONIBLE PARA ANÁLISIS
```

Un gasto no debe confundirse automáticamente con una compra de inventario.

La compra incrementa existencias.

El gasto representa una salida económica según su naturaleza.

---

# 20. Proceso de cálculo de costos

El cálculo de costos utiliza información proveniente de operaciones reales.

Conceptualmente:

```text
INFORMACIÓN DE COMPRAS
        │
        ▼
COSTOS DE INSUMOS
        │
        ▼
INFORMACIÓN DE PRODUCCIÓN
        │
        ▼
COSTO DEL PRODUCTO
```

La metodología concreta de cálculo será definida en:

```text
09-calculation-responsibilities.md
```

El proceso de costos no debe modificar operaciones históricas para obtener un resultado.

---

# 21. Proceso de cálculo de rentabilidad

La rentabilidad analiza el resultado económico a partir de información registrada por otros módulos.

Conceptualmente:

```text
VENTAS
        │
        ├── INGRESOS
        │
        ▼
COSTOS
        │
        ▼
GASTOS
        │
        ▼
RENTABILIDAD
```

El módulo de rentabilidad no debe convertirse en propietario de las operaciones de origen.

Su función es analizar información.

---

# 22. Proceso de actualización del dashboard

El dashboard utiliza información de los demás procesos.

Conceptualmente:

```text
COMPRAS
PRODUCCIÓN
INVENTARIO
LOTES
VENTAS
PAGOS
GASTOS
COSTOS
RENTABILIDAD
        │
        ▼
DASHBOARD
```

El dashboard no crea ni modifica las operaciones originales.

Su función es:

```text
Consultar

Agrupar

Calcular indicadores autorizados

Presentar información
```

---

# 23. Dependencia general entre procesos

El ciclo principal del negocio puede representarse así:

```text
DATOS MAESTROS
        │
        ├───────────────┐
        │               │
        ▼               ▼
PROVEEDORES         PRODUCTOS
        │               │
        ▼               ▼
COMPRAS             RECETAS
        │               │
        ▼               │
INVENTARIO           │
        │               │
        └───────┬───────┘
                ▼
           PRODUCCIÓN
                │
                ▼
              LOTES
                │
                ▼
           INVENTARIO
                │
                ▼
              VENTAS
                │
                ├───────────────┐
                ▼               ▼
              PAGOS         COSTOS
                                │
GASTOS ──────────────────────────┤
                                ▼
                          RENTABILIDAD
                                │
                                ▼
                            DASHBOARD
```

---

# 24. Procesos que no deben mezclarse

La arquitectura funcional debe evitar mezclar responsabilidades.

No corresponde:

```text
Una receta
registrando inventario.
```

No corresponde:

```text
Un lote
creando una venta.
```

No corresponde:

```text
Una venta
calculando arbitrariamente
el inventario completo.
```

No corresponde:

```text
El dashboard
modificando compras
o producciones.
```

No corresponde:

```text
Un pago
creando una nueva venta.
```

Cada proceso debe producir únicamente las consecuencias correspondientes a su responsabilidad.

---

# 25. Regla de confirmación de procesos

Los procesos que generan consecuencias históricas o afectan inventario deben distinguir entre:

```text
BORRADOR / PREPARACIÓN
```

y:

```text
OPERACIÓN CONFIRMADA
```

La información preliminar no debe producir automáticamente consecuencias definitivas.

Ejemplo:

```text
Compra en preparación
        ↓
No modifica inventario
```

Después:

```text
Compra confirmada
        ↓
Genera entradas de inventario
```

La misma lógica aplica conceptualmente a:

```text
Producción

Venta

Otras operaciones
que generen cambios históricos
```

---

# 26. Corrección de procesos

Cuando se detecte un error, primero debe identificarse el estado del proceso.

```text
¿Todavía está en preparación?
        │
        ├── Sí
        │       ↓
        │   Puede modificarse
        │
        └── No
                ↓
        Evaluar mecanismo de corrección
```

Una operación histórica confirmada no debe tratarse automáticamente como un formulario editable sin restricciones.

El mecanismo concreto dependerá del proceso:

```text
Anulación

Reversión

Ajuste

Corrección documentada
```

Estos mecanismos serán definidos cuando se implementen los procesos que realmente los requieran.

---

# 27. Consistencia entre procesos

Un proceso que produce consecuencias en otros módulos debe mantener consistencia con ellas.

Ejemplo:

```text
COMPRA CONFIRMADA
        ↓
ENTRADAS GENERADAS
```

No debe quedar permanentemente:

```text
Compra confirmada
        +
Sin entradas correspondientes
```

Otro ejemplo:

```text
VENTA CONFIRMADA
        ↓
SALIDA DE INVENTARIO
```

No debe quedar permanentemente:

```text
Venta confirmada
        +
Sin modificación correspondiente
de disponibilidad
```

La implementación técnica deberá garantizar la consistencia necesaria.

---

# 28. Resumen de procesos principales

```text
01. Gestionar presentaciones
        ↓
02. Gestionar insumos
        ↓
03. Gestionar proveedores
        ↓
04. Gestionar precios de referencia
        ↓
05. Gestionar productos
        ↓
06. Definir recetas
        ↓
07. Registrar compras
        ↓
08. Actualizar disponibilidad de insumos
        ↓
09. Planificar producción
        ↓
10. Ejecutar producción
        ↓
11. Generar lote
        ↓
12. Actualizar disponibilidad de producto terminado
        ↓
13. Gestionar clientes
        ↓
14. Registrar ventas
        ↓
15. Registrar pagos
        ↓
16. Registrar gastos
        ↓
17. Calcular costos
        ↓
18. Analizar rentabilidad
        ↓
19. Consultar dashboard
```

---

# 29. Estado actual de definición

Este documento define el flujo funcional de los procesos principales del negocio.

Todavía no define:

```text
Estados técnicos definitivos.

Máquinas de estado.

Endpoints.

Comandos.

Queries.

Servicios.

Eventos técnicos.

Transacciones de base de datos.

Colas.

Procesos asíncronos.

Implementación con NestJS.

Implementación con Prisma.
```

Estas decisiones deberán tomarse durante el diseño e implementación técnica.

La implementación deberá respetar los procesos y responsabilidades definidos en este documento.

---

# 30. Principio final

El sistema debe representar procesos reales del negocio.

La secuencia general es:

```text
DEFINICIÓN
        ↓
OPERACIÓN
        ↓
CONFIRMACIÓN
        ↓
CONSECUENCIA
        ↓
TRAZABILIDAD
        ↓
ANÁLISIS
```

Cada módulo participa en el proceso según su responsabilidad.

> **El sistema no debe ser una colección de pantallas y tablas independientes. Debe representar procesos conectados, donde cada operación produce consecuencias identificables y trazables dentro del negocio.**
