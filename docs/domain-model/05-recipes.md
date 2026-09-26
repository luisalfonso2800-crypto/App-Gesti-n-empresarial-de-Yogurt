# RECETAS

## 1. Propósito del módulo

El módulo de Recetas define la composición necesaria para fabricar cada producto del negocio.

Una receta establece:

* qué producto se puede producir;
* qué insumos requiere;
* qué cantidad de cada insumo se necesita;
* en qué unidad se expresa esa cantidad;
* qué porcentaje de merma puede existir;
* cuál es el rendimiento base esperado de la receta.

La receta es la definición técnica de producción. No registra inventario, no ejecuta producción, no calcula por sí misma los costos y no registra lotes.

Su responsabilidad es responder:

> **¿Qué se necesita y en qué cantidades para producir un producto según una receta definida?**

La lógica reconstruida parte de la estructura final del módulo VBA, donde Recetas está organizada explícitamente mediante una relación Cabecera–Detalle. 

---

## 2. Responsabilidad del módulo

El módulo de Recetas es responsable de:

1. Crear recetas.
2. Identificar cada receta de forma única.
3. Asociar una receta con un producto existente.
4. Definir el nombre de la receta.
5. Definir el rendimiento base.
6. Definir la unidad del rendimiento.
7. Agregar insumos a una receta.
8. Definir la cantidad requerida de cada insumo.
9. Definir la unidad utilizada dentro de la receta.
10. Registrar el porcentaje de merma esperado por ingrediente.
11. Consultar los ingredientes de una receta.
12. Modificar los datos de una receta.
13. Modificar los datos de un ingrediente dentro de una receta.
14. Activar o desactivar recetas.
15. Mantener la integridad entre recetas, productos e insumos.

La estructura original establece que el módulo administra exclusivamente las recetas y que no debe asumir responsabilidades correspondientes a otros dominios. 

---

## 3. Lo que este módulo no hace

El módulo de Recetas no es responsable de:

* crear productos;
* administrar productos;
* crear insumos;
* administrar insumos;
* registrar compras;
* calcular precios de compra;
* calcular costos de producción;
* descontar inventario;
* aumentar inventario;
* ejecutar producción;
* crear lotes;
* registrar ventas;
* calcular rentabilidad;
* administrar formularios o interfaces.

En el sistema original, estas responsabilidades estaban explícitamente separadas del módulo de Recetas. 

---

# 4. Concepto de receta

Una receta representa una definición de producción asociada a un producto.

La relación conceptual es:

```text
PRODUCTO
    │
    │  tiene
    ▼
RECETA
    │
    ├── Rendimiento base
    ├── Unidad de rendimiento
    │
    └── contiene
            │
            ▼
      INGREDIENTES
            │
            ├── Insumo
            ├── Cantidad requerida
            ├── Unidad
            ├── Merma
            └── Observaciones
```

Una receta no es un movimiento de inventario.

Tampoco representa una producción realizada.

Por ejemplo:

```text
Producto:
Yogurt Natural 1 Litro

Receta:
REC-001

Rendimiento base:
10 Litros

Ingredientes:

Leche
10 Litros

Cultivo lácteo
1 Unidad

Azúcar
2 Kilogramos
```

La receta define el estándar necesario para producir.

La producción real será responsabilidad del módulo de Producción.

---

# 5. Estructura del dominio

El modelo original utiliza una estructura Cabecera–Detalle:

```text
RECETA
    │
    │ ID_Receta
    │
    ├──────────────────────────────┐
    │                              │
    ▼                              ▼
DATOS GENERALES              DETALLE DE RECETA
                                   │
                                   ├── Insumo 1
                                   ├── Insumo 2
                                   ├── Insumo 3
                                   └── ...
```

Las dos estructuras originales son:

```text
tblRecetas
```

y:

```text
tblDetalleRecetas
```

La relación es:

```text
tblRecetas.ID_Receta
            │
            ▼
tblDetalleRecetas.ID_Receta
```

Esta relación Cabecera–Detalle está definida explícitamente en el módulo VBA actualizado. 

---

# 6. Entidad principal: Receta

La receta representa la cabecera de la definición técnica.

Su estructura original es:

| Campo                | Descripción                                   |
| -------------------- | --------------------------------------------- |
| `ID_Receta`          | Identificador único de la receta              |
| `ID_Producto`        | Producto al que pertenece                     |
| `Nombre_Receta`      | Nombre descriptivo de la receta               |
| `Rendimiento_Base`   | Cantidad esperada producida según la receta   |
| `Unidad_Rendimiento` | Unidad utilizada para expresar el rendimiento |
| `Activo`             | Estado lógico de la receta                    |
| `Observaciones`      | Información adicional                         |

La estructura fue validada en el módulo original mediante la función `EstructuraRecetasCorrecta`. 

---

## 6.1 Identificador de receta

Cada receta tiene un identificador único:

```text
ID_Receta
```

El sistema VBA utiliza el prefijo:

```text
REC
```

La generación conceptual es:

```text
REC-001
REC-002
REC-003
```

La generación del identificador estaba centralizada mediante:

```text
GenerarNuevoID("REC")
```



En la nueva aplicación, el identificador técnico interno será definido durante el diseño de la base de datos.

El código histórico visible para el usuario puede conservar una estructura equivalente si continúa siendo útil para operación y consulta.

---

## 6.2 Producto asociado

Toda receta pertenece a un producto existente.

La relación es:

```text
Producto
    1
    │
    │
    ▼
    N
Recetas
```

El campo es:

```text
ID_Producto
```

El sistema original valida que el producto exista antes de crear una receta. 

Una receta no puede existir asociada a un producto inexistente.

---

## 6.3 Nombre de la receta

El campo:

```text
Nombre_Receta
```

permite identificar la receta de forma descriptiva.

Ejemplos conceptuales:

```text
Receta estándar
Receta Yogurt Natural
Receta Producción Base
```

El nombre no sustituye al identificador técnico de la receta.

---

## 6.4 Rendimiento base

El campo:

```text
Rendimiento_Base
```

representa la cantidad esperada que produce la receta definida.

Ejemplo:

```text
Rendimiento_Base = 10
Unidad_Rendimiento = Litros
```

Esto representa:

```text
La receta está definida para un rendimiento base de 10 litros.
```

El rendimiento base pertenece a la cabecera porque describe el resultado esperado de la receta completa.

---

## 6.5 Unidad de rendimiento

El campo:

```text
Unidad_Rendimiento
```

indica cómo debe interpretarse el rendimiento base.

Ejemplos:

```text
Litros
Kilogramos
Unidades
```

No debe confundirse con la unidad de cada ingrediente.

Ejemplo:

```text
RECETA

Rendimiento:
10 Litros


INGREDIENTES

Leche:
10 Litros

Azúcar:
2 Kilogramos

Cultivo:
1 Unidad
```

---

## 6.6 Estado de la receta

El campo:

```text
Activo
```

representa el estado lógico de la receta.

La lógica histórica establece que los registros se desactivan en lugar de eliminarse físicamente dentro del módulo. 

Por tanto:

```text
Activa
```

significa que la receta está disponible para las operaciones que requieran utilizarla.

```text
Inactiva
```

significa que permanece conservada como registro histórico, pero no debe considerarse disponible como receta operativa.

---

# 7. Entidad de detalle: Ingrediente de receta

Cada receta puede contener múltiples ingredientes.

La estructura original del detalle es:

| Campo                | Descripción                     |
| -------------------- | ------------------------------- |
| `ID_Detalle_Receta`  | Identificador único del detalle |
| `ID_Receta`          | Receta a la que pertenece       |
| `ID_Insumo`          | Insumo utilizado                |
| `Cantidad_Requerida` | Cantidad necesaria del insumo   |
| `Unidad`             | Unidad utilizada                |
| `Merma_Porcentaje`   | Porcentaje esperado de merma    |
| `Observaciones`      | Información adicional           |

Esta estructura está definida por `EstructuraDetalleRecetasCorrecta`. 

---

## 7.1 Identificador del detalle

Cada ingrediente registrado dentro de una receta tiene su propio identificador:

```text
ID_Detalle_Receta
```

El sistema VBA utiliza el prefijo:

```text
DREC
```

Ejemplo conceptual:

```text
DREC-001
DREC-002
DREC-003
```

La generación estaba definida mediante:

```text
GenerarNuevoID("DREC")
```



---

## 7.2 Insumo asociado

Cada línea del detalle corresponde a un insumo existente:

```text
ID_Insumo
```

La relación es:

```text
RECETA
    │
    └── INGREDIENTE DE RECETA
                │
                ▼
             INSUMO
```

Antes de agregar un ingrediente, el sistema original valida que el insumo exista. 

No puede agregarse un identificador arbitrario o inexistente.

---

## 7.3 Cantidad requerida

El campo:

```text
Cantidad_Requerida
```

indica cuánto insumo necesita la receta para el rendimiento base definido.

Ejemplo:

```text
Rendimiento de la receta:
10 litros

Ingrediente:
Azúcar

Cantidad requerida:
2

Unidad:
Kilogramos
```

La cantidad requerida debe ser:

```text
Mayor que 0
```

Esta validación está definida explícitamente en la lógica original. 

---

## 7.4 Unidad del ingrediente

Cada ingrediente tiene su propia unidad:

```text
Unidad
```

La unidad es obligatoria.

No se debe asumir automáticamente que todos los ingredientes utilizan la misma unidad.

Ejemplo:

```text
Leche       → Litros
Azúcar      → Kilogramos
Cultivo     → Unidades
Envase      → Unidades
```

El módulo original exige que la unidad esté informada antes de registrar el ingrediente. 

---

## 7.5 Merma porcentual

El campo:

```text
Merma_Porcentaje
```

permite registrar una pérdida esperada asociada a un ingrediente dentro de la receta.

La regla histórica establece:

```text
Merma_Porcentaje >= 0
```

y:

```text
Merma_Porcentaje < 100
```

Por tanto, el valor válido se encuentra en:

```text
0 ≤ Merma_Porcentaje < 100
```

Esta validación existe tanto para la creación como para la actualización del ingrediente. 

---

# 8. Relación entre Receta y Producto

Cada receta pertenece a un único producto.

```text
PRODUCTO
    │
    ├── REC-001
    ├── REC-002
    └── REC-003
```

El módulo original contiene una función específica para consultar si un producto tiene al menos una receta. 

Esto confirma que el modelo histórico permite conceptualmente identificar recetas asociadas a un mismo producto.

La relación exacta que tendrá la nueva base de datos debe preservar esta capacidad.

---

# 9. Relación entre Receta e Insumos

Una receta contiene múltiples insumos.

Un mismo insumo puede formar parte de diferentes recetas.

La relación conceptual es:

```text
RECETA
   │
   │ 1
   │
   ▼
DETALLE_RECETA
   │
   │ N
   │
   ▼
INSUMO
```

Ejemplo:

```text
REC-001
│
├── Leche
├── Azúcar
├── Cultivo
└── Envases
```

Otro producto puede utilizar algunos de los mismos insumos:

```text
REC-002
│
├── Leche
├── Azúcar
├── Saborizante
└── Envases
```

---

# 10. Regla de no duplicación de insumos

Un mismo insumo no puede aparecer dos veces dentro de la misma receta.

La clave lógica es:

```text
ID_Receta + ID_Insumo
```

Debe ser única.

Correcto:

```text
REC-001 + INS-001
REC-001 + INS-002
REC-001 + INS-003
```

Incorrecto:

```text
REC-001 + INS-001
REC-001 + INS-001
```

La lógica original contiene una validación específica para esta combinación. 

En PostgreSQL, esta regla deberá convertirse posteriormente en una restricción de unicidad equivalente.

---

# 11. Flujo para crear una receta

La creación conceptual de una receta ocurre en dos etapas.

Primero se crea la cabecera:

```text
1. Seleccionar producto
        ↓
2. Validar que el producto exista
        ↓
3. Definir nombre de receta
        ↓
4. Definir rendimiento base
        ↓
5. Definir unidad de rendimiento
        ↓
6. Crear receta
        ↓
7. Generar identificador
```

Después se agregan los ingredientes:

```text
RECETA EXISTENTE
        ↓
Seleccionar insumo
        ↓
Validar que exista
        ↓
Definir cantidad requerida
        ↓
Definir unidad
        ↓
Definir merma
        ↓
Comprobar duplicado
        ↓
Registrar ingrediente
```

La separación Cabecera–Detalle es explícita: la receta debe existir antes de agregar ingredientes.  

---

# 12. Flujo de actualización de una receta

La actualización debe distinguir entre:

```text
DATOS DE LA RECETA
```

y:

```text
DATOS DEL INGREDIENTE
```

Los datos generales pertenecen a la cabecera:

```text
Nombre_Receta
Rendimiento_Base
Unidad_Rendimiento
Activo
Observaciones
```

Los datos del ingrediente pertenecen al detalle:

```text
Cantidad_Requerida
Unidad
Merma_Porcentaje
Observaciones
```

No se debe tratar toda la receta como una única fila de datos.

---

# 13. Flujo de actualización de un ingrediente

La actualización de un ingrediente debe localizar el registro correspondiente a:

```text
ID_Receta
+
ID_Insumo
```

Después se pueden modificar:

```text
Cantidad_Requerida
Unidad
Merma_Porcentaje
Observaciones
```

Las validaciones continúan aplicándose:

```text
Cantidad_Requerida > 0
```

```text
Unidad no vacía
```

```text
0 ≤ Merma_Porcentaje < 100
```

La lógica histórica de actualización conserva estas reglas. 

---

# 14. Reglas de negocio

## RN-REC-001 — Identificador único de receta

Cada receta debe tener un identificador único.

```text
ID_Receta
```

no puede repetirse.

---

## RN-REC-002 — Identificador único de detalle

Cada registro de ingrediente debe tener un identificador único.

```text
ID_Detalle_Receta
```

no puede repetirse.

---

## RN-REC-003 — El producto debe existir

No puede crearse una receta para un producto inexistente.

```text
Receta
    ↓
Producto existente obligatorio
```

---

## RN-REC-004 — El insumo debe existir

No puede agregarse un insumo inexistente a una receta.

---

## RN-REC-005 — La receta debe existir antes de agregar ingredientes

No puede existir un detalle de receta sin una receta válida.

```text
Crear receta
      ↓
Después
      ↓
Agregar ingredientes
```

---

## RN-REC-006 — Un insumo no puede repetirse dentro de una receta

La combinación:

```text
ID_Receta + ID_Insumo
```

debe ser única.

---

## RN-REC-007 — La cantidad requerida debe ser mayor que cero

No son válidos:

```text
0
-1
-5
```

Solo:

```text
Cantidad_Requerida > 0
```

---

## RN-REC-008 — La unidad es obligatoria

Cada ingrediente debe indicar una unidad.

No puede registrarse:

```text
Cantidad = 10
Unidad = vacío
```

---

## RN-REC-009 — La merma debe estar dentro del rango permitido

La regla es:

```text
0 ≤ Merma_Porcentaje < 100
```

---

## RN-REC-010 — La receta pertenece a un producto

Una receta debe mantener su asociación con el producto para el cual fue definida.

Un ingrediente agregado a una receta pertenece indirectamente al producto de esa receta.

---

## RN-REC-011 — Las recetas se conservan históricamente

El comportamiento histórico definido para el módulo es la desactivación lógica en lugar de la eliminación física. 

---

# 15. Operaciones funcionales del módulo

El sistema debe poder realizar las siguientes operaciones.

## Recetas

```text
Crear receta
Consultar receta
Consultar recetas de un producto
Actualizar receta
Activar receta
Desactivar receta
```

## Ingredientes de receta

```text
Agregar ingrediente
Consultar ingredientes
Consultar un ingrediente
Actualizar ingrediente
Consultar cantidad requerida
Consultar unidad
Consultar merma
```

El módulo VBA incluía funciones específicas para consultar detalles como unidad y merma de un ingrediente dentro de una receta. 

---

# 16. Dependencias del dominio

El módulo de Recetas depende conceptualmente de:

```text
PRODUCTS
```

porque toda receta pertenece a un producto existente.

También depende de:

```text
SUPPLIES
```

porque los ingredientes de una receta deben ser insumos existentes.

La relación es:

```text
PRESENTATIONS
        │
        ▼
PRODUCTS
        │
        ├───────────────┐
        │               │
        ▼               ▼
     RECIPES         SUPPLIES
        │               │
        └───────┬───────┘
                │
                ▼
         RECIPE DETAILS
```

---

# 17. Dependencias futuras

La receta será utilizada posteriormente por otros módulos.

## Producción

Producción necesitará consultar:

```text
Producto
        ↓
Receta
        ↓
Ingredientes
        ↓
Cantidades requeridas
```

La receta sirve como base técnica para determinar los requerimientos de producción.

---

## Inventario

Inventario no pertenece al módulo de Recetas.

Sin embargo, Producción podrá utilizar la receta para determinar qué insumos deberían ser requeridos para ejecutar una producción.

El movimiento real de inventario seguirá perteneciendo al módulo correspondiente.

---

## Costos

El módulo de Costos podrá utilizar la composición de una receta como fuente de información para calcular el costo de los insumos requeridos.

Pero:

```text
RECETAS
≠
COSTOS
```

Recetas define cantidades y composición.

Costos determina el valor económico correspondiente.

---

# 18. Límites de responsabilidad

La arquitectura del negocio debe mantener esta separación:

```text
RECIPES
│
├── Define composición
├── Define cantidades requeridas
├── Define rendimiento base
├── Define merma esperada
└── Mantiene relación Producto ↔ Insumos
```

Mientras que:

```text
PRODUCTION
│
└── Ejecuta la producción
```

```text
INVENTORY
│
└── Registra existencias y movimientos
```

```text
COSTS
│
└── Calcula valores económicos
```

```text
PURCHASES
│
└── Registra adquisición de insumos
```

La receta no debe absorber responsabilidades de estos módulos.

---

# 19. Modelo conceptual de datos

El modelo conceptual actual es:

```text
┌─────────────────────┐
│      PRODUCT        │
├─────────────────────┤
│ ID_Producto         │
│ ...                 │
└──────────┬──────────┘
           │
           │ 1
           │
           ▼ N
┌─────────────────────────────┐
│           RECIPE            │
├─────────────────────────────┤
│ ID_Receta                   │
│ ID_Producto                 │
│ Nombre_Receta               │
│ Rendimiento_Base            │
│ Unidad_Rendimiento          │
│ Activo                      │
│ Observaciones               │
└──────────────┬──────────────┘
               │
               │ 1
               │
               ▼ N
┌─────────────────────────────┐
│        RECIPE DETAIL        │
├─────────────────────────────┤
│ ID_Detalle_Receta           │
│ ID_Receta                   │
│ ID_Insumo                   │
│ Cantidad_Requerida          │
│ Unidad                      │
│ Merma_Porcentaje            │
│ Observaciones               │
└──────────────┬──────────────┘
               │
               │ N
               │
               ▼ 1
┌─────────────────────┐
│       SUPPLY        │
├─────────────────────┤
│ ID_Insumo           │
│ ...                 │
└─────────────────────┘
```

---

# 20. Equivalencia con el sistema VBA

La estructura anterior procede de la evolución final del módulo `modRecetas`.

La versión inicial utilizaba una estructura más plana, donde los ingredientes podían estar representados directamente dentro de una misma tabla.

Posteriormente, el diseño evolucionó hacia una estructura correcta de:

```text
CABECERA
+
DETALLE
```

La estructura que debe utilizarse como referencia para la nueva aplicación es la versión actualizada:

```text
tblRecetas
```

como cabecera.

```text
tblDetalleRecetas
```

como detalle.

No debe retomarse el diseño anterior de una única tabla para representar toda la receta, porque el módulo actualizado ya establece la separación entre receta e ingredientes. 

---

# 21. Traducción futura a PostgreSQL

La implementación física definitiva todavía no se define en este documento.

Sin embargo, la estructura del dominio indica como mínimo dos entidades persistentes:

```text
recipes
```

y:

```text
recipe_items
```

o nombres equivalentes definidos posteriormente por las convenciones oficiales del proyecto.

La relación deberá preservar:

```text
Recipe
1 ─────── N RecipeItem
```

y:

```text
Product
1 ─────── N Recipe
```

además de:

```text
Supply
1 ─────── N RecipeItem
```

La restricción lógica:

```text
ID_Receta + ID_Insumo
```

deberá mantenerse como una restricción única equivalente.

---

# 22. Estado actual del dominio

La lógica de Recetas reconstruida hasta este punto define:

```text
[DEFINIDO]

✓ Propósito del módulo
✓ Responsabilidad
✓ Límites
✓ Relación con Productos
✓ Relación con Insumos
✓ Estructura Cabecera–Detalle
✓ Datos de la receta
✓ Datos del ingrediente
✓ Rendimiento base
✓ Unidad de rendimiento
✓ Cantidad requerida
✓ Unidad del ingrediente
✓ Merma
✓ Reglas de validación
✓ Regla de no duplicación
✓ Estado lógico
✓ Operaciones principales
✓ Dependencias
✓ Uso futuro por Producción
✓ Uso futuro por Costos
```

---

# 23. Decisiones pendientes

Este documento reconstruye la lógica existente y no debe inventar reglas que todavía no hayan sido definidas.

Quedan pendientes para etapas posteriores:

1. Determinar si un producto puede tener múltiples recetas activas simultáneamente.
2. Determinar si existirá una receta predeterminada por producto.
3. Definir si las recetas tendrán versiones históricas.
4. Definir el comportamiento cuando se modifique una receta utilizada en producciones anteriores.
5. Definir si una receta inactiva puede volver a activarse.
6. Definir cómo se realizará el escalado de una receta para producir cantidades diferentes al rendimiento base.
7. Definir si la merma registrada es únicamente informativa o debe afectar automáticamente los cálculos futuros.
8. Definir las reglas de conversión entre unidades cuando sean necesarias.
9. Definir la estrategia de preservación histórica de recetas utilizadas en producción.

Estas decisiones no se resolverán inventando comportamiento dentro del módulo de Recetas. Se definirán cuando se reconstruya la lógica de Producción, Inventario y Costos, y cualquier decisión nueva deberá actualizar este documento y quedar registrada en la documentación oficial correspondiente.
