# Límites de Módulos del Backend — V1

## 1. Propósito del documento

Este documento define los límites funcionales y técnicos iniciales de los módulos del backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es establecer con claridad:

* qué responsabilidad pertenece a cada módulo;
* qué información administra cada módulo;
* qué operaciones son responsabilidad de cada módulo;
* qué responsabilidades no pertenecen al módulo;
* qué módulos participan en los principales procesos del negocio;
* qué modificaciones entre módulos deben realizarse mediante responsabilidades públicas y no mediante acceso interno indiscriminado.

Este documento no define todavía:

* endpoints HTTP específicos;
* DTOs;
* implementación NestJS;
* estructura interna definitiva de cada módulo;
* repositorios concretos;
* esquema Prisma;
* transacciones específicas;
* mecanismos concretos de comunicación entre módulos.

Esos aspectos serán definidos en documentos posteriores.

---

# 2. Principio general de límite modular

Un módulo representa una responsabilidad de negocio o técnica claramente identificable.

La existencia de una entidad o tabla no implica automáticamente la creación de un módulo independiente.

La regla general es:

```text
RESPONSABILIDAD DE NEGOCIO
        ↓
MÓDULO
        ↓
ENTIDADES Y OPERACIONES
BAJO SU RESPONSABILIDAD
```

No:

```text
TABLA
        ↓
MÓDULO AUTOMÁTICO
```

Cada módulo será responsable de:

* sus operaciones;
* sus reglas;
* la información bajo su dominio;
* la validación de las condiciones necesarias para ejecutar sus procesos;
* exponer las capacidades necesarias para que otros módulos puedan interactuar con él.

Cada módulo no será responsable de:

* implementar procesos que pertenecen a otro dominio;
* modificar directamente la persistencia interna de otro módulo;
* asumir reglas ajenas únicamente por comodidad técnica.

---

# 3. Mapa general de módulos

La arquitectura inicial del backend estará compuesta por los siguientes módulos:

```text
auth
users

presentations
supplies
suppliers
products
recipes

purchases
inventory
production
lots

clients
sales
payments

expenses
costs
profitability
dashboard
```

Estos módulos se agrupan conceptualmente de la siguiente forma:

```text
SEGURIDAD Y ACCESO
│
├── auth
└── users


INFORMACIÓN MAESTRA
│
├── presentations
├── supplies
├── suppliers
├── products
└── clients


DEFINICIÓN DEL PRODUCTO
│
└── recipes


OPERACIÓN Y ABASTECIMIENTO
│
├── purchases
└── inventory


TRANSFORMACIÓN Y PRODUCCIÓN
│
├── production
└── lots


OPERACIÓN COMERCIAL
│
├── sales
└── payments


ANÁLISIS FINANCIERO
│
├── expenses
├── costs
├── profitability
└── dashboard
```

Esta agrupación conceptual no implica que los módulos estén fusionados físicamente.

Cada módulo mantiene su propia responsabilidad.

---

# 4. Módulo `auth`

## Responsabilidad

Gestionar la autenticación y el control de acceso al sistema.

Será responsable de determinar:

* quién puede iniciar sesión;
* cómo se valida la identidad;
* cómo se gestionan las credenciales;
* cómo se establece una sesión o contexto autenticado;
* cómo se emiten y validan los mecanismos de autenticación definidos técnicamente.

## Es propietario de

* procesos de autenticación;
* credenciales y mecanismos relacionados con autenticación;
* emisión y validación de mecanismos de acceso;
* cierre o invalidación de acceso cuando corresponda.

## No es responsable de

* administrar la información general de un usuario;
* definir reglas de negocio de otros módulos;
* determinar permisos funcionales específicos fuera del modelo de autorización definido.

La información funcional de las personas o usuarios pertenece al módulo:

```text
users
```

---

# 5. Módulo `users`

## Responsabilidad

Gestionar la información de los usuarios que pueden operar el sistema.

Será responsable de:

* crear usuarios;
* consultar usuarios;
* modificar información permitida;
* gestionar estados de usuario;
* mantener la información necesaria para identificar al usuario dentro del sistema.

## Es propietario de

* identidad funcional del usuario;
* estado del usuario;
* información propia del usuario;
* relaciones necesarias para identificar quién realizó una operación cuando la trazabilidad lo requiera.

## No es responsable de

* ejecutar autenticación directamente;
* registrar procesos de ventas;
* modificar inventario;
* administrar operaciones del negocio.

---

# 6. Módulo `presentations`

## Responsabilidad

Gestionar las presentaciones comerciales utilizadas por los productos del negocio.

Una presentación representa la forma en que un producto puede ser comercializado o identificado según la lógica definida en el dominio.

## Es responsable de

* registrar presentaciones;
* mantener sus características;
* consultar presentaciones;
* actualizar información permitida;
* controlar su disponibilidad o estado cuando corresponda.

## Participa en

```text
products
production
lots
sales
costs
profitability
```

La participación de `presentations` no significa que controle esos procesos.

Su función es proporcionar información de referencia cuando otros módulos la requieran.

## No es responsable de

* definir recetas;
* producir productos;
* controlar inventario;
* registrar ventas;
* calcular rentabilidad.

---

# 7. Módulo `supplies`

## Responsabilidad

Gestionar el catálogo de insumos utilizados por el negocio.

Un insumo representa un recurso que puede ser adquirido y utilizado dentro de procesos posteriores, especialmente compras y producción.

## Es responsable de

* registrar insumos;
* definir sus características;
* mantener unidades y datos necesarios para su utilización;
* consultar y actualizar información permitida;
* controlar su estado cuando corresponda.

## Participa en

```text
purchases
inventory
recipes
production
costs
```

## No es responsable de

* registrar una compra;
* administrar proveedores;
* registrar movimientos de inventario;
* ejecutar producción;
* calcular automáticamente toda la estructura financiera del negocio.

---

# 8. Módulo `suppliers`

## Responsabilidad

Gestionar la información de los proveedores.

Será responsable de mantener la información necesaria para identificar y utilizar proveedores dentro de los procesos de abastecimiento.

## Es responsable de

* registrar proveedores;
* consultar proveedores;
* actualizar información permitida;
* controlar su estado;
* proporcionar información de referencia a procesos de compra.

## Participa en

```text
purchases
```

Puede participar posteriormente en análisis relacionados con:

* precios;
* historial de compras;
* comparación de abastecimiento.

## No es responsable de

* registrar inventario;
* modificar existencias;
* definir costos de producción;
* ejecutar procesos de compra fuera de su propia información.

La compra pertenece al módulo:

```text
purchases
```

---

# 9. Módulo `products`

## Responsabilidad

Gestionar los productos definidos por el negocio.

El módulo representa la definición del producto y sus características generales.

## Es responsable de

* registrar productos;
* mantener sus características;
* relacionar el producto con su presentación cuando corresponda;
* controlar su disponibilidad o estado;
* proporcionar información de referencia a producción, lotes y ventas.

## Participa en

```text
recipes
production
lots
sales
costs
profitability
```

## No es responsable de

* definir por sí solo el proceso completo de fabricación;
* descontar inventario;
* crear movimientos de inventario;
* registrar ventas;
* registrar lotes.

La definición de cómo se produce pertenece a:

```text
recipes
```

La ejecución del proceso pertenece a:

```text
production
```

El resultado trazable de la producción pertenece a:

```text
lots
```

---

# 10. Módulo `recipes`

## Responsabilidad

Gestionar la definición de las recetas utilizadas para producir los productos.

Una receta define los insumos y cantidades requeridas para una producción según la lógica documentada.

## Es responsable de

* crear recetas;
* relacionar productos con los insumos necesarios;
* definir cantidades;
* mantener la composición de la receta;
* consultar la información necesaria para planificación y producción.

## Participa en

```text
supplies
products
production
costs
```

## No es responsable de

* descontar físicamente inventario;
* ejecutar producción;
* crear lotes;
* registrar compras.

La receta define.

La producción ejecuta.

El inventario registra los cambios de existencias.

---

# 11. Módulo `purchases`

## Responsabilidad

Gestionar el proceso de adquisición de insumos.

Una compra representa un hecho histórico del negocio.

El módulo será responsable de registrar la operación de compra y su detalle según las reglas documentadas.

## Es responsable de

* crear compras;
* registrar proveedor;
* registrar insumos adquiridos;
* registrar cantidades;
* registrar precios;
* mantener el detalle histórico de la operación;
* aplicar las validaciones propias de una compra.

## Coordina con

```text
suppliers
supplies
inventory
costs
```

La relación principal será:

```text
PURCHASES
    │
    ├── Consulta proveedor
    ├── Consulta insumo
    │
    └── Solicita registro del efecto
        correspondiente en INVENTORY
```

## No es responsable de

* administrar directamente las existencias;
* modificar directamente registros internos de inventario;
* ejecutar producción;
* registrar ventas.

El estado y movimiento del inventario pertenece a:

```text
inventory
```

---

# 12. Módulo `inventory`

## Responsabilidad

Gestionar el estado y los movimientos de inventario definidos por el modelo del negocio.

Este módulo es el propietario funcional de los cambios de existencias.

## Es responsable de

* registrar movimientos de inventario;
* representar entradas;
* representar salidas;
* registrar ajustes cuando estén permitidos;
* mantener el estado de inventario;
* proporcionar información sobre disponibilidad.

## Recibe efectos desde procesos como

```text
purchases
production
sales
```

El flujo conceptual es:

```text
PROCESO DE NEGOCIO
        │
        ▼
INVENTORY
        │
        ├── Valida operación
        ├── Registra movimiento
        └── Actualiza estado correspondiente
```

## No es responsable de

* registrar una compra completa;
* definir una receta;
* decidir cómo se produce;
* registrar una venta completa;
* administrar pagos.

## Principio crítico

Ningún módulo debe modificar directamente las existencias sin pasar por una responsabilidad controlada de `inventory`.

---

# 13. Módulo `production`

## Responsabilidad

Gestionar la ejecución de los procesos de producción.

La producción representa el proceso mediante el cual se utilizan recursos definidos previamente para obtener productos.

## Es responsable de

* registrar procesos de producción;
* utilizar la información de recetas cuando corresponda;
* determinar los insumos utilizados;
* registrar el detalle del proceso;
* coordinar el consumo necesario con `inventory`;
* coordinar la generación del resultado producido.

## Participa con

```text
products
recipes
supplies
inventory
lots
costs
```

El flujo conceptual será:

```text
PRODUCTION
    │
    ├── Consulta PRODUCT / RECIPE
    │
    ├── Determina recursos utilizados
    │
    ├── Solicita a INVENTORY
    │   registrar los movimientos correspondientes
    │
    └── Genera el resultado trazable
        mediante LOTS cuando corresponda
```

## No es responsable de

* ser propietario del estado general del inventario;
* administrar recetas como catálogo;
* registrar ventas;
* administrar pagos.

---

# 14. Módulo `lots`

## Responsabilidad

Gestionar los lotes generados como resultado de procesos de producción.

El lote representa una unidad trazable de producto.

## Es responsable de

* registrar lotes;
* identificar el origen del lote;
* registrar la fecha de creación;
* registrar y conservar la fecha de vencimiento;
* mantener información necesaria para trazabilidad;
* relacionar el lote con su proceso de producción;
* proporcionar información necesaria para operaciones posteriores.

## Participa en

```text
production
inventory
sales
costs
profitability
```

## Principio de trazabilidad

Un lote debe permitir reconstruir conceptualmente:

```text
LOTE
    │
    ▼
PRODUCCIÓN QUE LO GENERÓ
    │
    ▼
RECETA / INSUMOS UTILIZADOS
```

y conservar, como mínimo según el modelo aprobado:

```text
fecha de creación
fecha de vencimiento
```

## No es responsable de

* definir recetas;
* ejecutar compras;
* administrar clientes;
* registrar pagos.

---

# 15. Módulo `clients`

## Responsabilidad

Gestionar la información de los clientes.

## Es responsable de

* registrar clientes;
* consultar clientes;
* actualizar información permitida;
* controlar estados cuando corresponda;
* proporcionar información de referencia para ventas y pagos.

## Participa en

```text
sales
payments
```

## No es responsable de

* registrar una venta;
* calcular rentabilidad;
* modificar inventario;
* administrar lotes.

---

# 16. Módulo `sales`

## Responsabilidad

Gestionar el proceso de venta.

Una venta representa un hecho histórico del negocio.

## Es responsable de

* registrar ventas;
* identificar el cliente cuando corresponda;
* registrar los productos vendidos;
* registrar cantidades;
* registrar valores;
* mantener el detalle histórico;
* aplicar reglas propias del proceso comercial;
* coordinar el efecto correspondiente sobre inventario.

## Coordina con

```text
clients
products
lots
inventory
payments
costs
profitability
```

El flujo conceptual será:

```text
SALE
    │
    ├── Consulta información comercial
    │
    ├── Registra venta
    │
    └── Solicita a INVENTORY
        registrar el efecto correspondiente
```

La gestión de pagos permanece separada.

Registrar una venta no significa necesariamente registrar un pago.

## No es responsable de

* modificar directamente existencias;
* registrar directamente movimientos internos de inventario;
* administrar la información maestra del cliente;
* apropiarse del proceso completo de pagos.

---

# 17. Módulo `payments`

## Responsabilidad

Gestionar los pagos registrados asociados a operaciones comerciales según las reglas del negocio.

## Es responsable de

* registrar pagos;
* relacionar pagos con la operación correspondiente;
* conservar el historial;
* determinar el efecto del pago sobre el estado pendiente cuando corresponda.

## Participa con

```text
clients
sales
profitability
dashboard
```

## No es responsable de

* crear ventas;
* modificar directamente inventario;
* modificar el detalle histórico de una venta;
* administrar productos.

---

# 18. Módulo `expenses`

## Responsabilidad

Gestionar los gastos registrados por el negocio que no forman parte directamente de la operación específica de compra, producción o venta cuando así lo defina el modelo aprobado.

## Es responsable de

* registrar gastos;
* clasificar información de gastos;
* mantener historial;
* proporcionar información para análisis financiero.

## Participa en

```text
costs
profitability
dashboard
```

## No es responsable de

* modificar precios históricos de compras;
* registrar movimientos de inventario;
* modificar ventas;
* modificar pagos.

---

# 19. Módulo `costs`

## Responsabilidad

Gestionar o calcular la información de costos definida en la documentación del dominio y del modelo de datos.

Este módulo trabaja principalmente con información originada en otros módulos.

## Utiliza información de

```text
purchases
supplies
recipes
production
lots
inventory
expenses
```

Su responsabilidad será aplicar las reglas oficiales de cálculo correspondientes.

## No es responsable de

* registrar compras;
* modificar recetas;
* modificar inventario;
* ejecutar producción;
* alterar datos históricos para obtener un resultado calculado.

El módulo `costs` consume información cuya propiedad permanece en los módulos de origen.

---

# 20. Módulo `profitability`

## Responsabilidad

Calcular y exponer información relacionada con la rentabilidad del negocio.

## Utiliza información proveniente de

```text
sales
payments
costs
expenses
```

y otras fuentes documentadas cuando corresponda.

Su responsabilidad será aplicar las fórmulas y criterios definidos oficialmente.

## No es responsable de

* modificar ventas;
* modificar pagos;
* modificar costos históricos;
* registrar gastos;
* alterar información de origen.

La rentabilidad representa información derivada.

Los hechos originales permanecen bajo responsabilidad de sus módulos de origen.

---

# 21. Módulo `dashboard`

## Responsabilidad

Consolidar información del sistema para generar indicadores y visualizaciones.

## Utiliza información de

```text
purchases
inventory
production
lots
sales
payments
expenses
costs
profitability
```

según las necesidades de los indicadores aprobados.

## No es responsable de

* modificar directamente datos operativos;
* registrar compras;
* modificar inventario;
* ejecutar producción;
* registrar ventas;
* alterar pagos.

El `dashboard` es principalmente un consumidor y consolidador de información.

---

# 22. Interacciones principales entre módulos

La siguiente representación muestra las relaciones funcionales principales:

```text
PRESENTATIONS
       │
       ▼
PRODUCTS
       │
       ├──────────────► RECIPES ◄──────────── SUPPLIES
       │                   │
       │                   ▼
       │              PRODUCTION
       │                   │
       │                   ├──────────► INVENTORY
       │                   │
       │                   ▼
       │                  LOTS
       │                   │
       ▼                   ▼
                     SALES
                       │
                       ├──────────► INVENTORY
                       │
CLIENTS ────────────────┤
                       │
                       ▼
                    PAYMENTS
```

El proceso de abastecimiento:

```text
SUPPLIERS
     │
     ▼
PURCHASES ◄──── SUPPLIES
     │
     ▼
INVENTORY
```

Los módulos analíticos consumen información:

```text
PURCHASES ─┐
PRODUCTION ├────► COSTS
EXPENSES ──┘
                 │
                 ▼
SALES ─────────► PROFITABILITY
PAYMENTS ──────►
EXPENSES ──────►
                 │
                 ▼
              DASHBOARD
```

Estos diagramas representan relaciones conceptuales.

No definen todavía dependencias de código ni mecanismos técnicos de comunicación.

---

# 23. Regla de acceso entre módulos

Cuando un módulo necesite información o una operación perteneciente a otro módulo, deberá utilizar una capacidad autorizada de dicho módulo.

Conceptualmente:

```text
MÓDULO A
    │
    ▼
CAPACIDAD PÚBLICA
DE MÓDULO B
    │
    ▼
MÓDULO B
```

No:

```text
MÓDULO A
    │
    ▼
ACCESO DIRECTO
A IMPLEMENTACIÓN INTERNA
DE MÓDULO B
```

Esto aplica especialmente a:

* repositorios internos;
* servicios internos;
* detalles de persistencia;
* lógica privada del módulo.

Las capacidades públicas y el mecanismo técnico de exposición serán definidos posteriormente.

---

# 24. Procesos con múltiples módulos

Los siguientes procesos requieren coordinación entre responsabilidades distintas.

## Registro de compra

```text
PURCHASES
    │
    ├── Valida proveedor
    ├── Valida insumos
    ├── Registra compra
    │
    ▼
INVENTORY
    │
    └── Registra entrada correspondiente
```

---

## Ejecución de producción

```text
PRODUCTION
    │
    ├── Consulta producto
    ├── Utiliza receta
    ├── Determina insumos
    │
    ▼
INVENTORY
    │
    └── Registra consumo
    │
    ▼
LOTS
    │
    └── Registra resultado trazable
```

La secuencia técnica exacta será definida posteriormente.

---

## Registro de venta

```text
SALES
    │
    ├── Valida información comercial
    ├── Registra venta
    │
    ▼
INVENTORY
    │
    └── Registra salida correspondiente
```

Cuando la venta genere una obligación pendiente, la gestión posterior de los pagos corresponde a:

```text
payments
```

---

## Registro de pago

```text
PAYMENTS
    │
    ├── Identifica operación relacionada
    ├── Registra pago
    │
    ▼
Estado financiero correspondiente
```

La forma exacta de representar los estados financieros será definida sin contradecir las reglas ya aprobadas del modelo de datos.

---

# 25. Responsabilidades que no deben duplicarse

La arquitectura deberá evitar que una misma responsabilidad crítica tenga múltiples propietarios.

Ejemplos:

```text
MOVIMIENTOS DE INVENTARIO
        ↓
inventory
```

```text
REGISTRO DE COMPRA
        ↓
purchases
```

```text
EJECUCIÓN DE PRODUCCIÓN
        ↓
production
```

```text
TRAZABILIDAD DEL LOTE
        ↓
lots
```

```text
REGISTRO DE VENTA
        ↓
sales
```

```text
REGISTRO DE PAGO
        ↓
payments
```

```text
CÁLCULO DE COSTOS
        ↓
costs
```

```text
CÁLCULO DE RENTABILIDAD
        ↓
profitability
```

```text
CONSOLIDACIÓN DE INDICADORES
        ↓
dashboard
```

Otros módulos podrán utilizar los resultados o solicitar operaciones, pero no duplicar la lógica central.

---

# 26. Límites iniciales y evolución

Los límites definidos en este documento representan la estructura inicial oficial.

No significa que nunca puedan cambiar.

Una modificación será necesaria cuando aparezca evidencia concreta de que:

* una responsabilidad fue asignada al módulo incorrecto;
* dos módulos representan artificialmente una sola responsabilidad;
* un módulo concentra responsabilidades incompatibles;
* la implementación demuestra una dependencia incorrecta;
* una nueva necesidad del negocio requiere una separación real.

La modificación deberá seguir:

```text
NECESIDAD IDENTIFICADA
        │
        ▼
ANÁLISIS DEL IMPACTO
        │
        ▼
REVISIÓN DE DOCUMENTACIÓN
        │
        ▼
DECISIÓN EXPLÍCITA
        │
        ▼
ACTUALIZACIÓN DOCUMENTAL
        │
        ▼
IMPLEMENTACIÓN
```

No se modificarán límites de módulos de manera improvisada durante la codificación.

---

# 27. Estado actual

```text
Documento: 01-module-boundaries.md
Versión: V1
Estado: APROBADO PARA CONTINUAR CON EL DISEÑO BACKEND
```

Este documento establece los límites iniciales de responsabilidad entre los módulos del backend.

El siguiente documento deberá definir cómo pueden depender técnicamente unos módulos de otros:

```text
02-module-dependencies.md
```
