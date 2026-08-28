# INSUMOS

## 1. Propósito del módulo

El módulo de **Insumos** administra los materiales, ingredientes y demás recursos que el negocio necesita adquirir y utilizar para elaborar sus productos.

Un insumo representa un recurso individual que puede ser comprado a uno o varios proveedores y posteriormente utilizado dentro de una receta o proceso de producción.

Este módulo constituye una base para los procesos de:

* Compras.
* Recetas.
* Producción.
* Inventario.
* Costos.

El módulo no administra directamente las compras, la producción ni las existencias. Su responsabilidad es definir y mantener correctamente la información maestra de cada insumo.

---

# 2. Responsabilidad principal

El módulo es responsable de:

* Registrar insumos.
* Consultar insumos.
* Buscar insumos.
* Editar información de insumos.
* Activar o desactivar insumos.
* Identificar la unidad base utilizada para controlar cada insumo.
* Definir la información necesaria para relacionar el insumo con proveedores, recetas, compras e inventario.

---

# 3. No responsabilidades

El módulo de Insumos no es responsable de:

* Registrar compras.
* Registrar proveedores.
* Definir precios de proveedores.
* Registrar movimientos de inventario.
* Calcular existencias.
* Descontar inventario durante producción.
* Registrar producción.
* Crear recetas.
* Calcular el costo total de un producto.
* Registrar ventas.
* Gestionar lotes.

Estas responsabilidades pertenecen a otros módulos.

---

# 4. Identidad del insumo

Cada insumo debe tener una identidad permanente dentro del sistema.

La identidad principal será:

```text
ID_Insumo
```

El ID identifica al insumo dentro de las relaciones con otros procesos.

El nombre del insumo no debe utilizarse como clave principal para relaciones entre módulos.

Ejemplo:

```text
INS-0001
```

Las relaciones futuras deben utilizar:

```text
ID_Insumo
```

y no:

```text
Nombre_Insumo
```

El nombre puede modificarse durante una edición, mientras que la identidad del insumo debe permanecer estable.

---

# 5. Información del insumo

De acuerdo con la estructura existente del sistema original, cada insumo contiene la siguiente información:

| Campo         | Descripción                                                 |
| ------------- | ----------------------------------------------------------- |
| ID_Insumo     | Identificador único y permanente del insumo                 |
| Nombre_Insumo | Nombre utilizado para identificar el insumo                 |
| Categoria     | Clasificación del insumo                                    |
| Unidad_Base   | Unidad utilizada para controlar y calcular el insumo        |
| Stock_Minimo  | Cantidad mínima definida para el control del insumo         |
| Activo        | Indica si el insumo está disponible para nuevas operaciones |
| Observaciones | Información adicional del insumo                            |

La estructura base del insumo queda representada así:

```text
INSUMO
│
├── ID_Insumo
├── Nombre_Insumo
├── Categoria
├── Unidad_Base
├── Stock_Minimo
├── Activo
└── Observaciones
```

---

# 6. Nombre del insumo

Cada insumo debe tener un nombre que permita identificarlo dentro del negocio.

Ejemplos conceptuales:

```text
Leche
Azúcar
Fresa
Envase plástico
Tapa
Etiqueta
```

El nombre debe cumplir las siguientes reglas:

* Es obligatorio.
* No puede estar vacío.
* Debe almacenarse normalizado según las reglas generales del sistema.
* No deben existir duplicados equivalentes dentro del catálogo de insumos.

La validación de duplicados debe considerar las reglas de normalización definidas por el sistema.

Por ejemplo, no deberían coexistir registros equivalentes como:

```text
Azúcar
AZÚCAR
 azúcar
```

si después de la normalización representan el mismo nombre.

---

# 7. Categoría

Cada insumo posee una categoría.

La categoría permite clasificar el insumo dentro del negocio.

Ejemplos posibles:

```text
Materia prima
Ingrediente
Envase
Empaque
Etiqueta
Otro
```

La clasificación definitiva de categorías deberá mantenerse como una decisión explícita del dominio.

El módulo de Insumos almacena la categoría asignada al insumo, pero no define todavía un sistema independiente de administración de categorías.

Por tanto, inicialmente:

```text
Categoria
```

forma parte de la información del insumo.

No existe actualmente un módulo independiente:

```text
categories/
```

La creación de un catálogo independiente de categorías solo deberá evaluarse si aparece una necesidad real de administrar dichas categorías como una entidad propia.

---

# 8. Unidad base

La unidad base representa la unidad utilizada para controlar y calcular las cantidades del insumo.

Ejemplos:

```text
g
kg
ml
L
unidad
```

La unidad base es importante porque un mismo insumo puede comprarse en una presentación diferente a la unidad utilizada internamente.

Ejemplo conceptual:

```text
INSUMO:
Leche

Unidad base:
ml
```

Puede comprarse:

```text
1 botella = 1.000 ml
```

pero las recetas pueden utilizar:

```text
250 ml
```

La unidad base permite mantener una referencia común para las cantidades del insumo.

El módulo de Insumos define cuál es la unidad base del recurso.

La conversión entre una presentación de compra y la unidad base deberá ser responsabilidad del proceso que gestione dicha relación.

---

# 9. Stock mínimo

El insumo contiene un valor:

```text
Stock_Minimo
```

Este valor representa la cantidad mínima definida como referencia para el control del insumo.

El módulo de Insumos únicamente almacena este valor.

El módulo no es responsable de:

* Calcular el stock actual.
* Generar automáticamente una compra.
* Registrar faltantes.
* Modificar inventario.

El análisis entre:

```text
Stock actual
```

y:

```text
Stock mínimo
```

corresponde al dominio de Inventario y a los procesos de análisis o planificación que se definan posteriormente.

---

# 10. Estado del insumo

Cada insumo posee un estado representado mediante:

```text
Activo
```

El estado determina si el insumo puede utilizarse en nuevas operaciones.

Conceptualmente:

```text
Activo
```

significa que el insumo está disponible para nuevas operaciones permitidas por el sistema.

```text
Inactivo
```

significa que el insumo deja de estar disponible para nuevas operaciones.

La desactivación no elimina físicamente el registro.

La información histórica debe conservarse.

Esto permite mantener referencias existentes en:

* Compras.
* Recetas.
* Producción.
* Inventario.
* Costos.

Por tanto:

```text
ELIMINAR INSUMO
```

no debe interpretarse como eliminación física del registro.

La operación debe evaluarse como:

```text
DESACTIVAR INSUMO
```

cuando el insumo ya no debe utilizarse en nuevas operaciones.

---

# 11. Observaciones

El campo:

```text
Observaciones
```

permite almacenar información adicional relacionada con el insumo.

Este campo no representa una regla de negocio estructurada.

Su contenido no debe utilizarse como base para cálculos o relaciones entre módulos.

---

# 12. Relación con proveedores

Un insumo puede estar disponible a través de uno o varios proveedores.

Conceptualmente:

```text
INSUMO
   │
   ├── PROVEEDOR A
   │
   ├── PROVEEDOR B
   │
   └── PROVEEDOR C
```

La relación entre el insumo y el proveedor contiene información adicional relacionada con la forma en que ese proveedor ofrece el insumo.

El sistema original contempla una estructura de precios de proveedores que incluye:

```text
ID_PrecioProveedor
ID_Insumo
ID_Proveedor
Presentacion_Compra
Cantidad_Compra
Unidad_Compra
Cantidad_Unidad_Base
Precio_Compra
Costo_Unidad_Base
Fecha_Registro
Activo
```

Esta información no forma parte directamente de la entidad Insumo.

La relación debe mantenerse separada conceptualmente:

```text
INSUMO
   │
   └── OFERTA / PRECIO DE PROVEEDOR
            │
            └── PROVEEDOR
```

La definición completa de esta relación se documentará posteriormente junto con los dominios de Proveedores y Compras.

---

# 13. Relación con recetas

Los insumos pueden formar parte de una receta.

Conceptualmente:

```text
PRODUCTO
   │
   └── RECETA
          │
          ├── INSUMO A
          ├── INSUMO B
          └── INSUMO C
```

El módulo de Insumos no administra las recetas.

Su responsabilidad es proporcionar una identidad válida y una unidad base que permita a una receta indicar qué insumo utiliza y en qué cantidad.

La relación con la receta deberá utilizar:

```text
ID_Insumo
```

y no el nombre del insumo.

---

# 14. Relación con compras

Un insumo puede aparecer dentro de múltiples compras.

Conceptualmente:

```text
INSUMO
   │
   ├── COMPRA 001
   ├── COMPRA 002
   ├── COMPRA 003
   └── COMPRA N
```

El módulo de Insumos no registra compras.

Las compras deben referenciar el insumo mediante:

```text
ID_Insumo
```

La información histórica de una compra no debe depender exclusivamente de que el insumo permanezca activo.

Por esta razón, un insumo utilizado históricamente no debe eliminarse físicamente.

---

# 15. Relación con inventario

Los insumos participan en el inventario del negocio.

Conceptualmente:

```text
INSUMO
   │
   └── INVENTARIO
          │
          └── MOVIMIENTOS
```

El módulo de Insumos define el recurso.

El módulo de Inventario administra las cantidades, movimientos y existencias relacionadas con dicho recurso.

El módulo de Insumos no debe modificar directamente:

```text
Stock actual
Entradas
Salidas
Ajustes
Existencias
```

---

# 16. Relación con producción

Durante la producción, los insumos pueden ser utilizados como parte de una receta o de un proceso productivo.

Conceptualmente:

```text
PRODUCCIÓN
     │
     └── RECETA
            │
            └── INSUMOS
```

La producción debe utilizar los insumos previamente definidos.

El módulo de Insumos no ejecuta producción ni descuenta existencias.

---

# 17. Reglas principales del módulo

Las reglas reconstruidas para el módulo son:

## Regla 1. Identidad permanente

Cada insumo posee un:

```text
ID_Insumo
```

único dentro del sistema.

El ID no debe cambiar durante una edición.

---

## Regla 2. Nombre obligatorio

No puede existir un insumo sin nombre.

---

## Regla 3. Nombre no duplicado

No deben existir dos insumos con el mismo nombre después de aplicar las reglas de normalización del sistema.

---

## Regla 4. Unidad base obligatoria

Cada insumo debe definir una unidad base.

---

## Regla 5. Stock mínimo válido

El valor definido como stock mínimo debe ser una cantidad válida para la unidad base correspondiente.

La validación exacta de si puede ser:

```text
0
```

deberá mantenerse pendiente hasta reconstruir completamente las reglas implementadas en el código VBA del módulo de Insumos.

---

## Regla 6. Eliminación lógica

Los insumos no deben eliminarse físicamente cuando ya forman parte de información histórica.

La operación de eliminación debe resolverse mediante desactivación.

---

## Regla 7. El estado controla nuevas operaciones

Un insumo inactivo no debe estar disponible para nuevas operaciones que requieran seleccionar un insumo activo.

Las operaciones históricas existentes deben conservar sus referencias.

---

## Regla 8. Las relaciones utilizan el ID

Los módulos relacionados deben utilizar:

```text
ID_Insumo
```

como referencia principal.

El nombre del insumo es información descriptiva y no una clave relacional.

---

# 18. Operaciones del módulo

El módulo debe permitir conceptualmente las siguientes operaciones:

```text
Crear insumo
Consultar insumo
Listar insumos
Buscar insumos
Editar insumo
Activar insumo
Desactivar insumo
Consultar información de un insumo
```

La eliminación física no forma parte de las operaciones normales del dominio.

---

# 19. Operaciones que no pertenecen al módulo

Las siguientes operaciones no pertenecen directamente al módulo:

```text
Registrar compra
Modificar existencias
Registrar movimiento de inventario
Crear receta
Agregar insumo a una receta
Ejecutar producción
Calcular costo de producción
Registrar proveedor
Asignar precio de compra
Registrar venta
```

Estas operaciones pertenecen a otros dominios o procesos que utilizan el insumo como referencia.

---

# 20. Dependencias conceptuales

El módulo de Insumos funciona como un dominio base para otros procesos.

Relaciones principales:

```text
                    INSUMOS
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
  PROVEEDORES       RECETAS        INVENTARIO
       │               │               │
       ▼               ▼               │
PRECIOS DE        PRODUCCIÓN          │
PROVEEDOR                            │
       │                              │
       └─────────── COMPRAS ──────────┘
```

El insumo no controla estos procesos.

Otros módulos utilizan la información del insumo para realizar sus propias operaciones.

---

# 21. Límites del dominio

El límite del módulo queda definido así:

```text
┌─────────────────────────────────────┐
│               INSUMOS               │
│                                     │
│  • Identidad                        │
│  • Nombre                           │
│  • Categoría                        │
│  • Unidad base                      │
│  • Stock mínimo                     │
│  • Estado                           │
│  • Observaciones                    │
└─────────────────────────────────────┘
```

Fuera del límite del módulo:

```text
┌─────────────────────────────────────┐
│        RESPONSABILIDADES EXTERNAS   │
│                                     │
│  • Proveedores                      │
│  • Precios                          │
│  • Compras                          │
│  • Inventario                       │
│  • Recetas                          │
│  • Producción                       │
│  • Costos                           │
└─────────────────────────────────────┘
```

---

# 22. Estado actual del dominio

El dominio de Insumos está reconstruido inicialmente a partir de la estructura existente del sistema original.

Su función principal dentro de la nueva aplicación queda definida como:

> Mantener el catálogo maestro de los recursos utilizados por el negocio, proporcionando una identidad estable, información descriptiva, unidad base, categoría, stock mínimo y estado para su utilización por los demás procesos del sistema.

La implementación futura deberá respetar los límites definidos en este documento.

Las reglas que dependan de la interacción con:

* Proveedores.
* Precios.
* Compras.
* Inventario.
* Recetas.
* Producción.
* Costos.

se terminarán de definir en los documentos correspondientes.

---

# 23. Pendientes de definición

Los siguientes puntos no deben considerarse cerrados todavía:

```text
[ ] Catálogo definitivo de categorías de insumos.

[ ] Catálogo definitivo de unidades base permitidas.

[ ] Regla exacta para Stock_Minimo = 0.

[ ] Reglas de conversión entre unidades de compra y unidades base.

[ ] Ubicación definitiva de la responsabilidad
    Insumo–Proveedor–Precio dentro de la arquitectura.

[ ] Reglas para impedir la desactivación de un insumo
    cuando existan procesos pendientes que dependan de él.

[ ] Reglas específicas para modificar la unidad base de
    un insumo que ya posee movimientos históricos.

[ ] Definición de si la categoría seguirá siendo un campo
    simple o evolucionará a una entidad administrable.
```

---

# 24. Fuente histórica

Este documento reconstruye el dominio de Insumos a partir de la estructura funcional existente en el sistema original desarrollado en Excel y VBA.

La estructura histórica incluye:

```text
tblInsumos
```

con los campos:

```text
ID_Insumo
Nombre_Insumo
Categoria
Unidad_Base
Stock_Minimo
Activo
Observaciones
```

Las decisiones futuras de implementación en JavaScript, TypeScript, PostgreSQL y la arquitectura modular del nuevo sistema deberán respetar este documento mientras no exista una decisión arquitectónica posterior que lo modifique explícitamente.
