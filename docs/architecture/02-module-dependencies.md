# Dependencias entre Módulos del Backend — V1

## 1. Propósito del documento

Este documento define las reglas de dependencia entre los módulos del backend de **App Gestión Empresarial de Yogurt**.

Su objetivo es establecer:

* qué módulos pueden necesitar información de otros módulos;
* qué tipo de dependencia está permitida;
* qué dependencias están prohibidas;
* cómo debe evitarse el acoplamiento entre módulos;
* qué módulos son propietarios de cada responsabilidad;
* cómo deben coordinarse los procesos que involucran varios módulos.

Este documento complementa:

```text
01-module-boundaries.md
```

Mientras `01-module-boundaries.md` define:

```text
QUÉ RESPONSABILIDAD TIENE CADA MÓDULO
```

este documento define:

```text
CÓMO PUEDEN RELACIONARSE ENTRE ELLOS
```

Este documento no define todavía:

* implementación concreta en NestJS;
* interfaces específicas;
* tokens de inyección de dependencias;
* eventos concretos;
* endpoints HTTP;
* DTOs;
* transacciones de base de datos;
* esquema Prisma.

Esas decisiones se definirán posteriormente.

---

# 2. Principio fundamental

La existencia de una relación entre dos módulos no significa que ambos puedan acceder libremente a su implementación interna.

La regla general es:

```text
MÓDULO A
    │
    │ necesita una capacidad
    ▼
CONTRATO O CAPACIDAD EXPUESTA
    POR MÓDULO B
    │
    ▼
MÓDULO B
```

Nunca:

```text
MÓDULO A
    │
    ▼
REPOSITORIO INTERNO
DE MÓDULO B
```

Ni:

```text
MÓDULO A
    │
    ▼
PRISMA / BASE DE DATOS
PARA MODIFICAR
INFORMACIÓN DE MÓDULO B
```

Cada módulo conserva el control sobre su propia lógica y persistencia.

---

# 3. Tipos de dependencia permitidos

Inicialmente se reconocen cuatro tipos conceptuales de dependencia.

## 3.1 Dependencia de consulta

Un módulo necesita consultar información perteneciente a otro módulo.

Ejemplo:

```text
PURCHASES
    │
    └── consulta
            │
            ▼
        SUPPLIERS
```

`purchases` necesita validar o recuperar información de un proveedor.

Pero `purchases` no administra proveedores.

---

## 3.2 Dependencia de operación

Un módulo necesita solicitar que otro módulo ejecute una operación bajo su propia responsabilidad.

Ejemplo:

```text
PURCHASES
    │
    └── solicita
            │
            ▼
        INVENTORY
            │
            └── registra entrada
```

`purchases` no modifica directamente las existencias.

Solicita a `inventory` ejecutar la operación correspondiente.

---

## 3.3 Dependencia de cálculo

Un módulo necesita utilizar información de otros módulos para producir información derivada.

Ejemplo:

```text
COSTS
    │
    ├── PURCHASES
    ├── RECIPES
    ├── PRODUCTION
    └── EXPENSES
```

`costs` consume información.

No se convierte en propietario de esa información.

---

## 3.4 Dependencia de consolidación

Un módulo consume información de varios módulos para presentar indicadores o resultados.

Ejemplo:

```text
DASHBOARD
    │
    ├── INVENTORY
    ├── PRODUCTION
    ├── SALES
    ├── EXPENSES
    ├── COSTS
    └── PROFITABILITY
```

El módulo consumidor no modifica la información de origen.

---

# 4. Regla de dirección de dependencias

Las dependencias deberán seguir la dirección de la responsabilidad.

En términos generales:

```text
MÓDULOS OPERATIVOS
        │
        ▼
INFORMACIÓN DERIVADA
        │
        ▼
ANÁLISIS Y CONSOLIDACIÓN
```

Por ejemplo:

```text
PURCHASES
PRODUCTION
SALES
PAYMENTS
EXPENSES
        │
        ▼
      COSTS
        │
        ▼
  PROFITABILITY
        │
        ▼
    DASHBOARD
```

La dependencia inversa está prohibida.

Incorrecto:

```text
PURCHASES
    │
    ▼
COSTS
```

si la única finalidad es permitir que `costs` controle o modifique el proceso de compra.

Los módulos de cálculo y análisis no deben convertirse en controladores de los módulos operativos.

---

# 5. Mapa general de dependencias

El mapa conceptual inicial es:

```text
AUTH
 │
 ▼
USERS


PRESENTATIONS ──────► PRODUCTS
                          │
                          ▼
SUPPLIES ─────────────── RECIPES
                          │
                          ▼
                       PRODUCTION
                          │
                          ├────────────► INVENTORY
                          │
                          ▼
                         LOTS
                          │
                          ▼
CLIENTS ───────────────► SALES ───────► INVENTORY
                          │
                          ▼
                       PAYMENTS


SUPPLIERS ────────────► PURCHASES ◄──── SUPPLIES
                          │
                          ▼
                       INVENTORY


PURCHASES ─────┐
RECIPES ───────┤
PRODUCTION ────┼────────────► COSTS
EXPENSES ──────┘
                                  │
SALES ────────────────────────────┤
PAYMENTS ─────────────────────────┼────► PROFITABILITY
EXPENSES ─────────────────────────┘
                                  │
                                  ▼
                              DASHBOARD
```

Este mapa representa dependencias conceptuales.

No implica que todos los módulos tengan una dependencia directa de código.

---

# 6. Dependencias del módulo `auth`

## Puede depender de

```text
users
```

cuando sea necesario obtener información válida para autenticar o establecer el contexto de acceso.

## No debe depender de

```text
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

`auth` debe permanecer aislado de la operación del negocio.

---

# 7. Dependencias del módulo `users`

## Puede depender de

```text
auth
```

únicamente en aspectos donde exista una relación técnica o funcional claramente definida entre usuario y acceso.

## No debe depender de módulos operativos.

```text
users
```

no necesita conocer:

```text
inventory
production
sales
purchases
```

La trazabilidad de una operación podrá referenciar un usuario sin que `users` tenga que conocer el proceso completo que está ocurriendo.

---

# 8. Dependencias del módulo `presentations`

`presentations` es principalmente un módulo de información maestra.

## No debe depender de módulos operativos.

No debe depender de:

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
dashboard
```

Otros módulos pueden consultar `presentations`.

La dependencia esperada es:

```text
PRESENTATIONS
        │
        ▼
INFORMACIÓN DE REFERENCIA
        │
        ├── PRODUCTS
        ├── PRODUCTION
        ├── LOTS
        └── SALES
```

---

# 9. Dependencias del módulo `supplies`

`supplies` es propietario de la definición de los insumos.

## No debe depender de

```text
purchases
inventory
production
costs
profitability
dashboard
```

Otros módulos pueden depender de la información del insumo:

```text
SUPPLIES
    │
    ├── PURCHASES
    ├── RECIPES
    ├── INVENTORY
    ├── PRODUCTION
    └── COSTS
```

La dependencia no implica que `supplies` controle esos procesos.

---

# 10. Dependencias del módulo `suppliers`

`suppliers` es un módulo de información maestra.

## No debe depender de

```text
purchases
inventory
production
sales
costs
profitability
dashboard
```

El módulo consumidor principal será:

```text
PURCHASES
    │
    ▼
SUPPLIERS
```

La compra consulta al proveedor.

El proveedor no conoce ni controla las compras.

---

# 11. Dependencias del módulo `products`

El módulo `products` puede depender de:

```text
presentations
```

cuando la definición aprobada del producto requiera utilizar información de una presentación.

Otros módulos pueden depender de `products` como fuente de información:

```text
PRODUCTS
    │
    ├── RECIPES
    ├── PRODUCTION
    ├── LOTS
    ├── SALES
    ├── COSTS
    └── PROFITABILITY
```

`products` no debe depender de:

```text
inventory
production
lots
sales
payments
profitability
dashboard
```

---

# 12. Dependencias del módulo `recipes`

El módulo `recipes` puede depender de información perteneciente a:

```text
products
supplies
```

La relación conceptual es:

```text
PRODUCT
   │
   ▼
RECIPE
   │
   ▼
SUPPLIES
```

`recipes` define la composición necesaria para un proceso de producción.

No debe depender de:

```text
purchases
inventory
production
lots
sales
payments
dashboard
```

La receta no ejecuta el proceso.

---

# 13. Dependencias del módulo `purchases`

El módulo `purchases` puede necesitar:

```text
suppliers
supplies
inventory
```

La naturaleza de cada dependencia es distinta.

```text
SUPPLIERS
    │
    └── consulta

SUPPLIES
    │
    └── consulta

INVENTORY
    │
    └── solicitud de operación
```

El flujo conceptual:

```text
PURCHASES
    │
    ├── consulta SUPPLIER
    │
    ├── consulta SUPPLY
    │
    └── solicita entrada a INVENTORY
```

`purchases` no debe depender de:

```text
production
lots
sales
payments
profitability
dashboard
```

---

# 14. Dependencias del módulo `inventory`

`inventory` puede depender de información de referencia cuando sea necesaria para validar una operación.

Por ejemplo:

```text
supplies
products
lots
```

Sin embargo, debe evitarse que `inventory` conozca la lógica completa de:

```text
purchases
production
sales
```

La dirección principal debe ser:

```text
PURCHASES ──────► INVENTORY

PRODUCTION ─────► INVENTORY

SALES ──────────► INVENTORY
```

No:

```text
INVENTORY
    ├── controla PURCHASES
    ├── ejecuta PRODUCTION
    └── administra SALES
```

`inventory` registra y protege la consistencia de los movimientos que le corresponden.

---

# 15. Dependencias del módulo `production`

`production` puede depender de:

```text
products
recipes
supplies
inventory
lots
```

Las dependencias se clasifican conceptualmente así:

```text
PRODUCTS
    → consulta

RECIPES
    → consulta

SUPPLIES
    → referencia o validación

INVENTORY
    → solicitud de movimiento

LOTS
    → solicitud de creación del resultado trazable
```

El flujo conceptual es:

```text
PRODUCTION
    │
    ├── PRODUCTS
    ├── RECIPES
    ├── SUPPLIES
    │
    ├── INVENTORY
    │       │
    │       └── consumo correspondiente
    │
    └── LOTS
            │
            └── creación del lote resultante
```

`production` no debe depender directamente de:

```text
sales
payments
profitability
dashboard
```

---

# 16. Dependencias del módulo `lots`

`lots` puede depender de información de referencia relacionada con:

```text
products
production
presentations
```

cuando sea necesario para conservar la trazabilidad aprobada.

`lots` no debe ejecutar producción.

La relación correcta es:

```text
PRODUCTION
    │
    ▼
LOTS
```

No:

```text
LOTS
    │
    ▼
ejecuta PRODUCTION
```

Otros módulos pueden consultar lotes, especialmente:

```text
inventory
sales
costs
profitability
```

---

# 17. Dependencias del módulo `clients`

`clients` es principalmente un módulo de información maestra.

No debe depender de:

```text
sales
payments
inventory
production
costs
profitability
dashboard
```

Otros módulos pueden consultar información de clientes:

```text
CLIENTS
    │
    ├── SALES
    └── PAYMENTS
```

---

# 18. Dependencias del módulo `sales`

`sales` puede depender de:

```text
clients
products
lots
inventory
```

La naturaleza de las dependencias es:

```text
CLIENTS
    → consulta

PRODUCTS
    → consulta o validación

LOTS
    → consulta o validación de trazabilidad/disponibilidad

INVENTORY
    → solicitud de salida
```

El flujo principal:

```text
SALES
    │
    ├── CLIENTS
    ├── PRODUCTS
    ├── LOTS
    │
    └── INVENTORY
            │
            └── registra salida
```

`sales` no debe depender directamente de:

```text
profitability
dashboard
```

Estos módulos consumen información de ventas.

---

# 19. Dependencias del módulo `payments`

`payments` puede depender de:

```text
clients
sales
```

cuando necesite identificar la operación comercial relacionada con un pago.

La dirección conceptual es:

```text
CLIENTS
    │
    └── referencia
           │
           ▼
        PAYMENTS

SALES
    │
    └── operación relacionada
           │
           ▼
        PAYMENTS
```

`payments` no debe depender de:

```text
inventory
production
lots
costs
profitability
dashboard
```

La información de `payments` puede ser consumida posteriormente por módulos analíticos.

---

# 20. Dependencias del módulo `expenses`

`expenses` debe permanecer independiente de los procesos operativos principales.

No debe depender de:

```text
purchases
inventory
production
sales
payments
```

Los módulos:

```text
costs
profitability
dashboard
```

pueden consumir la información registrada por `expenses`.

---

# 21. Dependencias del módulo `costs`

El módulo `costs` puede depender de información de:

```text
purchases
supplies
recipes
production
lots
inventory
expenses
```

Estas dependencias son principalmente de consulta y cálculo.

El flujo es:

```text
DATOS OPERATIVOS
        │
        ▼
      COSTS
        │
        ▼
INFORMACIÓN DERIVADA
```

`costs` no debe modificar:

```text
purchases
recipes
inventory
production
lots
expenses
```

Su función es calcular, no convertirse en propietario de los datos operativos.

---

# 22. Dependencias del módulo `profitability`

`profitability` puede consumir información de:

```text
sales
payments
costs
expenses
```

y otras fuentes aprobadas en la documentación del dominio cuando sean necesarias.

El flujo conceptual:

```text
SALES ───────┐
PAYMENTS ────┤
COSTS ───────┼────► PROFITABILITY
EXPENSES ────┘
```

`profitability` no debe modificar los datos de origen.

No debe depender de `dashboard`.

La dirección correcta es:

```text
PROFITABILITY
        │
        ▼
DASHBOARD
```

---

# 23. Dependencias del módulo `dashboard`

`dashboard` es un módulo de consolidación.

Puede consultar información proveniente de:

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

Su dependencia es exclusivamente de consumo y consolidación.

`dashboard` no debe depender de módulos para modificar procesos.

No debe:

```text
registrar compras
registrar ventas
registrar pagos
modificar inventario
ejecutar producción
crear lotes
```

La dirección correcta es:

```text
MÓDULOS OPERATIVOS
        │
        ▼
INFORMACIÓN DISPONIBLE
        │
        ▼
DASHBOARD
```

---

# 24. Matriz resumida de dependencias

La siguiente matriz representa las dependencias funcionales principales.

| Módulo          | Puede depender de                                                                 |
| --------------- | --------------------------------------------------------------------------------- |
| `auth`          | `users`                                                                           |
| `users`         | `auth` según necesidad técnica definida                                           |
| `presentations` | Ningún módulo operativo                                                           |
| `supplies`      | Ningún módulo operativo                                                           |
| `suppliers`     | Ningún módulo operativo                                                           |
| `products`      | `presentations`                                                                   |
| `recipes`       | `products`, `supplies`                                                            |
| `purchases`     | `suppliers`, `supplies`, `inventory`                                              |
| `inventory`     | `supplies`, `products`, `lots` según validación necesaria                         |
| `production`    | `products`, `recipes`, `supplies`, `inventory`, `lots`                            |
| `lots`          | `products`, `production`, `presentations` según trazabilidad aprobada             |
| `clients`       | Ningún módulo operativo                                                           |
| `sales`         | `clients`, `products`, `lots`, `inventory`                                        |
| `payments`      | `clients`, `sales`                                                                |
| `expenses`      | Ningún módulo operativo                                                           |
| `costs`         | `purchases`, `supplies`, `recipes`, `production`, `lots`, `inventory`, `expenses` |
| `profitability` | `sales`, `payments`, `costs`, `expenses`                                          |
| `dashboard`     | Módulos operativos y analíticos autorizados para consulta                         |

Esta matriz es conceptual.

La implementación concreta deberá respetar los límites definidos en:

```text
01-module-boundaries.md
```

---

# 25. Dependencias circulares prohibidas

Se deben evitar dependencias circulares entre módulos.

Incorrecto:

```text
PURCHASES
    │
    ▼
INVENTORY
    │
    ▼
PURCHASES
```

También:

```text
PRODUCTION
    │
    ▼
LOTS
    │
    ▼
PRODUCTION
```

O:

```text
SALES
    │
    ▼
PAYMENTS
    │
    ▼
SALES
```

Una relación de negocio bidireccional no significa que deba existir una dependencia técnica bidireccional.

La información puede estar relacionada en el modelo de datos mientras las dependencias de código permanecen unidireccionales.

---

# 26. Regla para resolver una posible dependencia circular

Cuando dos módulos parezcan necesitarse mutuamente, se deberá aplicar el siguiente análisis:

```text
¿AMBOS NECESITAN REALMENTE
EJECUTAR LÓGICA DEL OTRO?
        │
        ├── NO
        │
        └── Separar consulta y operación
```

Si la necesidad persiste:

```text
¿EXISTE UNA RESPONSABILIDAD
QUE ESTÁ MAL UBICADA?
        │
        ├── SÍ
        │
        └── Mover o extraer la responsabilidad
```

Si ambos módulos necesitan coordinar una operación:

```text
PROCESO A
      +
PROCESO B
      │
      ▼
CASO DE USO COORDINADOR
```

No se resolverá una dependencia circular simplemente haciendo que ambos módulos se importen entre sí.

---

# 27. Prohibición de acceso directo a persistencia ajena

Un módulo no debe acceder directamente a las tablas, repositorios o modelos internos de otro módulo para evitar utilizar su interfaz pública.

Incorrecto:

```text
SALES
    │
    ▼
Prisma.inventory.update(...)
```

Correcto conceptualmente:

```text
SALES
    │
    ▼
INVENTORY
    │
    ▼
Registrar salida
```

Igualmente:

```text
PURCHASES
    │
    ▼
INVENTORY
    │
    ▼
Registrar entrada
```

Y:

```text
PRODUCTION
    │
    ▼
INVENTORY
    │
    ▼
Registrar consumo
```

La implementación concreta de esta regla se definirá posteriormente.

---

# 28. Regla para dependencias de lectura

Una dependencia de lectura no debe otorgar control sobre la entidad consultada.

Ejemplo:

```text
SALES
    │
    ▼
CLIENTS
```

`sales` puede necesitar consultar:

```text
clientId
estado
información comercial necesaria
```

Pero no debe modificar directamente:

```text
CLIENTE
```

La modificación pertenece a:

```text
clients
```

La misma regla aplica a:

```text
purchases → suppliers
purchases → supplies
recipes → products
recipes → supplies
production → recipes
sales → products
payments → sales
```

---

# 29. Dependencias para operaciones críticas

Las operaciones que producen efectos sobre información histórica o inventario requieren límites claros.

Inicialmente se consideran operaciones críticas:

```text
registro de compra
registro de movimiento de inventario
ejecución de producción
creación de lote
registro de venta
registro de pago
registro de gasto
```

Cuando una de estas operaciones necesite involucrar varios módulos, la coordinación deberá respetar:

```text
MÓDULO ORIGEN
        │
        ▼
VALIDACIÓN
        │
        ▼
OPERACIÓN PRINCIPAL
        │
        ▼
EFECTOS AUTORIZADOS
EN OTROS MÓDULOS
```

No se permitirá que los efectos secundarios queden dispersos sin una responsabilidad identificable.

---

# 30. Dependencias de cálculo y datos históricos

Los módulos:

```text
costs
profitability
dashboard
```

consumen información derivada de hechos históricos.

Por esta razón:

* no deben modificar el hecho original;
* no deben corregir directamente datos operativos;
* no deben convertirse en propietarios de compras, ventas o gastos;
* deben utilizar la información conservada según las reglas de trazabilidad aprobadas.

El flujo general es:

```text
HECHOS DEL NEGOCIO
        │
        ├── compras
        ├── producción
        ├── movimientos
        ├── lotes
        ├── ventas
        ├── pagos
        └── gastos
                │
                ▼
          CÁLCULOS
                │
                ▼
        RENTABILIDAD
                │
                ▼
          DASHBOARD
```

---

# 31. Dependencias y arquitectura interna

Este documento define dependencias entre módulos.

No reemplaza las reglas internas de cada módulo.

Cada módulo podrá evolucionar internamente según:

```text
docs/architecture/architecture-evolution.md
```

La existencia de una dependencia entre módulos no autoriza automáticamente:

```text
controller
    ↓
service interno de otro módulo
```

ni:

```text
service
    ↓
repository interno de otro módulo
```

La forma de exponer capacidades entre módulos deberá definirse explícitamente.

---

# 32. Modificación de una dependencia

Una nueva dependencia entre módulos no debe agregarse únicamente porque simplifica temporalmente la implementación.

Antes de agregarla deberá verificarse:

```text
1. ¿La responsabilidad realmente pertenece al módulo destino?

2. ¿La dependencia es de consulta, operación,
   cálculo o consolidación?

3. ¿Existe una dependencia ya definida
   que pueda reutilizarse?

4. ¿La nueva dependencia genera un ciclo?

5. ¿Expone información o implementación interna
   innecesaria?

6. ¿Debe registrarse una decisión arquitectónica?
```

Si la dependencia modifica el mapa arquitectónico aprobado, deberá actualizarse la documentación correspondiente antes o junto con la implementación.

---

# 33. Estado actual

```text
Documento: 02-module-dependencies.md
Versión: V1
Estado: APROBADO PARA CONTINUAR CON EL DISEÑO BACKEND
```

Este documento establece las dependencias conceptuales permitidas entre los módulos del backend.

El siguiente documento deberá definir la estructura interna mínima y evolutiva que seguirá cada módulo:

```text
03-module-internal-structure.md
```
