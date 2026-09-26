# Productos

## 1. Identificación del dominio

**Nombre del dominio:** Productos
**Archivo:** `04-products.md`
**Área del sistema:** Maestros
**Entidad principal:** Producto
**Identificador principal:** `ID_Producto`

El dominio de Productos administra los productos comercializados por el negocio.

Cada producto representa una unidad comercial definida dentro del sistema y se encuentra asociado a una presentación específica.

La estructura original del sistema define este dominio mediante:

```text
tblProductos
```

La relación principal identificada es:

```text
PRODUCTO
    │
    └── PRESENTACIÓN
```

El producto almacena la referencia:

```text
ID_Presentacion
```

Por tanto, un producto no contiene directamente toda la información física de su envase o capacidad. Esa información pertenece al dominio de Presentaciones.

---

# 2. Propósito

El propósito del dominio de Productos es definir qué productos comercializa el negocio y bajo qué presentación, categoría, canal y condiciones de venta.

El sistema debe permitir registrar y administrar información como:

* Nombre del producto.
* Presentación comercial.
* Categoría.
* Descripción.
* Canal de venta.
* Precio de venta.
* Margen objetivo.
* Estado operativo.
* Observaciones.

El producto funciona como un punto central de relación para procesos posteriores.

Conceptualmente:

```text
PRESENTACIÓN
      │
      ▼
   PRODUCTO
      │
      ├── RECETAS
      ├── PRODUCCIÓN
      ├── LOTES
      ├── INVENTARIO
      ├── VENTAS
      ├── COSTOS
      └── RENTABILIDAD
```

El dominio de Productos define el producto comercial, pero no ejecuta directamente esos procesos.

---

# 3. Responsabilidad principal

El dominio de Productos es responsable de:

* Registrar productos.
* Consultar productos.
* Buscar productos.
* Obtener información de un producto.
* Actualizar productos.
* Validar la relación con su presentación.
* Activar productos.
* Desactivar productos.
* Mantener la identidad permanente de cada producto.
* Proporcionar información del producto a otros dominios.

---

# 4. No responsabilidades

El dominio de Productos no es responsable de:

* Administrar presentaciones.
* Administrar insumos.
* Administrar proveedores.
* Administrar precios de proveedores.
* Definir ingredientes de recetas.
* Registrar compras.
* Registrar movimientos de inventario.
* Calcular existencias.
* Ejecutar producción.
* Crear lotes.
* Registrar ventas.
* Administrar clientes.
* Registrar pagos.
* Registrar gastos.
* Calcular el costo real de producción.
* Calcular la rentabilidad final.
* Administrar el Dashboard.

La responsabilidad del dominio termina en la definición y administración del producto.

Por tanto:

```text
PRODUCTO
≠
RECETA
≠
PRODUCCIÓN
≠
LOTE
≠
VENTA
```

Cada uno representa una responsabilidad diferente dentro del negocio.

---

# 5. Entidad principal

La entidad principal es:

```text
Producto
```

Cada producto posee una identidad permanente dentro del sistema:

```text
ID_Producto
```

El nombre del producto no debe utilizarse como identificador permanente para las relaciones internas.

Las relaciones deben utilizar:

```text
ID_Producto
```

y no:

```text
Nombre_Producto
```

Esto permite modificar el nombre comercial del producto sin romper las relaciones históricas existentes.

---

# 6. Estructura de información

La estructura original del sistema define los siguientes campos para `tblProductos`:

| Campo                | Descripción                                   |
| -------------------- | --------------------------------------------- |
| `ID_Producto`        | Identificador único y permanente del producto |
| `Nombre_Producto`    | Nombre comercial del producto                 |
| `ID_Presentacion`    | Referencia a la presentación utilizada        |
| `Categoria_Producto` | Clasificación del producto                    |
| `Descripcion`        | Descripción adicional                         |
| `Canal_Venta`        | Canal mediante el cual se comercializa        |
| `Precio_Venta`       | Precio de venta definido                      |
| `Margen_Objetivo`    | Margen objetivo asociado al producto          |
| `Activo`             | Estado operativo                              |
| `Observaciones`      | Información adicional                         |

La estructura histórica del módulo de Productos define explícitamente estos campos y su relación con Presentaciones. 

---

# 7. Identificador del producto

Cada producto debe poseer:

```text
ID_Producto
```

El identificador debe ser generado por el sistema.

El usuario no debe introducir manualmente el identificador como parte de la operación normal.

El identificador tiene las siguientes características:

```text
ID único
    ↓
Generado por el sistema
    ↓
Asignado al crear el producto
    ↓
No puede modificarse
    ↓
Utilizado por otros dominios
```

En el sistema VBA original, la generación del identificador se realizaba con el prefijo:

```text
PROD
```

Conceptualmente:

```text
PROD-001
PROD-002
PROD-003
```

La nueva implementación deberá conservar la regla de identidad única, aunque el mecanismo técnico definitivo de generación del identificador se definirá posteriormente.

---

# 8. Nombre del producto

El campo:

```text
Nombre_Producto
```

representa el nombre comercial del producto.

El nombre debe existir para crear un producto.

El sistema original establece que no se permiten productos duplicados con la misma combinación:

```text
Nombre_Producto
+
ID_Presentacion
```

Por tanto, la unicidad histórica del producto no depende únicamente del nombre.

La regla conceptual es:

```text
Un mismo nombre puede existir
en diferentes presentaciones.

Pero no debe existir duplicación de:

Nombre_Producto
+
ID_Presentacion
```

Ejemplo conceptual:

```text
Yogurt Natural + 8 oz
→ permitido

Yogurt Natural + 16 oz
→ permitido

Yogurt Natural + 8 oz nuevamente
→ no permitido
```

---

# 9. Relación con Presentaciones

Cada producto está asociado a una presentación mediante:

```text
ID_Presentacion
```

La relación conceptual es:

```text
PRESENTACIÓN
      │
      │ ID_Presentacion
      ▼
   PRODUCTO
```

La presentación debe existir antes de poder crear un producto.

Además, según las reglas existentes en el sistema original:

```text
La presentación debe existir.

La presentación debe estar activa
para crear o actualizar un producto.
```

Por tanto, el flujo esperado es:

```text
SELECCIONAR PRESENTACIÓN
        │
        ▼
¿EXISTE?
        │
   ┌────┴────┐
   │         │
  NO        SÍ
   │         │
   ▼         ▼
 ERROR   ¿ESTÁ ACTIVA?
                │
           ┌────┴────┐
           │         │
          NO        SÍ
           │         │
           ▼         ▼
         ERROR   CONTINUAR
```

El producto no debe almacenar duplicadamente:

```text
Cantidad_Oz
Cantidad_ml
Tipo_Envase
```

Estos datos pertenecen al dominio de Presentaciones y deben obtenerse a partir de:

```text
ID_Presentacion
```

---

# 10. Categoría del producto

El campo:

```text
Categoria_Producto
```

permite clasificar comercialmente el producto.

La estructura histórica exige que la categoría sea indicada para crear o actualizar un producto.

Sin embargo, el sistema original no define todavía un catálogo independiente de categorías.

Por tanto, en el modelo reconstruido actualmente:

```text
Categoria_Producto
```

es un dato propio del producto y no una entidad independiente.

Queda pendiente determinar si en el futuro será necesario evolucionar hacia un catálogo formal de categorías.

No debe crearse dicho módulo o tabla anticipadamente sin una necesidad real.

---

# 11. Descripción

El campo:

```text
Descripcion
```

permite almacenar información descriptiva adicional sobre el producto.

La estructura original lo contempla como parte de `tblProductos`.

El contenido exacto y la obligatoriedad de este campo deberán conservarse según las reglas funcionales definitivas que se establezcan durante la reconstrucción completa del dominio.

---

# 12. Canal de venta

El campo:

```text
Canal_Venta
```

representa el canal mediante el cual el producto se comercializa.

La estructura original del sistema exige que el producto tenga un canal de venta definido.

Sin embargo, el modelo histórico no establece todavía un catálogo independiente de canales.

Por tanto, actualmente:

```text
Canal_Venta
```

es un atributo del producto.

No debe suponerse todavía que representa una entidad independiente.

La evolución futura hacia:

```text
Canal
```

como dominio o catálogo separado deberá justificarse mediante una necesidad concreta del negocio.

---

# 13. Precio de venta

El campo:

```text
Precio_Venta
```

representa el precio de venta definido para el producto.

La regla histórica establecida en el módulo VBA es:

```text
El precio de venta no puede ser negativo.
```

Conceptualmente:

```text
Precio_Venta >= 0
```

El producto puede proporcionar su precio de venta como información a otros procesos, especialmente:

```text
Ventas
Costos
Rentabilidad
Consultas
Dashboard
```

Sin embargo, este dominio no debe asumir automáticamente que el precio almacenado representa el precio histórico de todas las ventas realizadas.

La conservación de precios históricos de una venta pertenece al proceso de Ventas.

---

# 14. Margen objetivo

El campo:

```text
Margen_Objetivo
```

representa el margen objetivo asociado al producto.

La regla histórica establecida es:

```text
El margen objetivo debe estar entre 0 y 100.
```

Conceptualmente:

```text
0 <= Margen_Objetivo <= 100
```

El margen objetivo representa una meta o referencia comercial.

No debe confundirse automáticamente con:

```text
Margen real
```

El margen real depende de información histórica y de costos reales que pertenecen a otros procesos.

Por tanto:

```text
Margen_Objetivo
≠
Margen_Real
```

---

# 15. Estado del producto

Cada producto posee el campo:

```text
Activo
```

Este campo determina su disponibilidad operativa.

Conceptualmente:

```text
Activo
```

significa que el producto puede continuar utilizándose en las operaciones permitidas por el sistema.

```text
Inactivo
```

significa que el producto se conserva históricamente, pero deja de estar disponible para nuevas operaciones cuando corresponda.

---

# 16. Eliminación lógica

Un producto no debe eliminarse físicamente como operación normal.

La acción conceptual de eliminar debe interpretarse como:

```text
Desactivar producto
```

La estructura histórica establece expresamente:

```text
Un producto se desactiva mediante el campo Activo.

No se elimina físicamente un producto.
```

Esto permite conservar la integridad de relaciones futuras con:

```text
Recetas
Producción
Lotes
Inventario
Ventas
Costos
Rentabilidad
```

La secuencia conceptual es:

```text
PRODUCTO ACTIVO
        │
        ▼
DESACTIVACIÓN
        │
        ▼
PRODUCTO INACTIVO
        │
        ├── Conserva ID_Producto
        ├── Conserva información histórica
        └── Conserva relaciones existentes
```

---

# 17. Crear producto

La creación de un producto debe seguir conceptualmente el siguiente flujo:

```text
1. Recibir información
        ↓
2. Normalizar datos
        ↓
3. Validar nombre
        ↓
4. Validar presentación
        ↓
5. Verificar que la presentación exista
        ↓
6. Verificar que la presentación esté activa
        ↓
7. Validar categoría
        ↓
8. Validar canal de venta
        ↓
9. Validar precio de venta
        ↓
10. Validar margen objetivo
        ↓
11. Verificar duplicidad
        ↓
12. Generar ID_Producto
        ↓
13. Crear producto
        ↓
14. Establecer estado inicial
```

La regla histórica establece que el producto debe iniciar activo.

---

# 18. Validación de duplicidad

El sistema original establece que no pueden existir productos duplicados con la misma combinación:

```text
Nombre_Producto
+
ID_Presentacion
```

La validación conceptual es:

```text
¿Existe otro producto con:

Nombre_Producto = X

y

ID_Presentacion = Y?
```

Si la respuesta es:

```text
SÍ
```

el nuevo registro o actualización debe rechazarse.

Si la respuesta es:

```text
NO
```

la operación puede continuar, siempre que se cumplan las demás reglas.

---

# 19. Actualizar producto

La actualización de un producto puede modificar:

```text
Nombre_Producto
ID_Presentacion
Categoria_Producto
Descripcion
Canal_Venta
Precio_Venta
Margen_Objetivo
Observaciones
```

No debe modificarse:

```text
ID_Producto
```

Durante una actualización deben mantenerse las validaciones fundamentales:

* El producto debe existir.
* El nombre debe ser válido.
* La presentación debe existir.
* La presentación debe estar activa.
* La categoría debe cumplir las reglas establecidas.
* El canal de venta debe cumplir las reglas establecidas.
* El precio no puede ser negativo.
* El margen objetivo debe estar entre 0 y 100.
* No debe crearse una combinación duplicada de nombre y presentación.

---

# 20. Activar producto

Un producto inactivo puede volver a estar disponible.

Conceptualmente:

```text
PRODUCTO INACTIVO
        │
        ▼
ACTIVAR
        │
        ▼
PRODUCTO ACTIVO
```

La activación no genera un nuevo producto.

No modifica:

```text
ID_Producto
```

---

# 21. Desactivar producto

La desactivación cambia el estado operativo del producto:

```text
PRODUCTO ACTIVO
        │
        ▼
DESACTIVAR
        │
        ▼
PRODUCTO INACTIVO
```

La desactivación:

* No elimina físicamente el producto.
* No modifica su identificador.
* No elimina su información histórica.
* No elimina relaciones existentes.

Las restricciones específicas para desactivar productos que tengan producción, lotes o ventas históricas deberán definirse posteriormente.

---

# 22. Operaciones del dominio

El dominio debe soportar conceptualmente las siguientes operaciones:

```text
Crear producto
Consultar producto
Buscar producto
Listar productos
Listar productos activos
Contar productos
Contar productos activos
Contar productos inactivos
Actualizar producto
Activar producto
Desactivar producto
Obtener presentación del producto
Obtener categoría
Obtener canal de venta
Obtener precio de venta
Obtener margen objetivo
Obtener estado
Obtener observaciones
Verificar existencia
```

Estas operaciones están respaldadas por la lógica existente del módulo histórico de Productos. 

---

# 23. Datos que pertenecen al producto

Pertenecen directamente al dominio:

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

No pertenecen directamente al producto:

```text
ID_Receta
ID_Insumo
Cantidad_Requerida
Costo_Produccion
Cantidad_Producida
ID_Lote
Cantidad_Existente
Cantidad_Vendida
ID_Venta
Margen_Real
Rentabilidad_Real
```

Estos datos pertenecen a otros dominios o procesos.

---

# 24. Relación con Recetas

El producto es una referencia principal para el dominio de Recetas.

La relación conceptual es:

```text
PRODUCTO
    │
    └── RECETA
            │
            └── INSUMOS
```

Una receta pertenece a un producto.

La estructura histórica del módulo de Recetas establece que:

```text
El producto debe existir para poder crear una receta.
```

El dominio de Productos no define los ingredientes.

Su responsabilidad termina en proporcionar la identidad del producto.

---

# 25. Relación con Producción

El producto puede ser producido mediante el proceso de Producción.

Conceptualmente:

```text
PRODUCTO
    │
    ▼
PRODUCCIÓN
```

El dominio de Productos no ejecuta la producción.

No descuenta insumos.

No calcula cantidades producidas.

No crea movimientos de inventario.

No genera lotes.

Estas responsabilidades pertenecen al proceso de Producción y a sus dominios relacionados.

---

# 26. Relación con Lotes

Los lotes representan unidades o agrupaciones de producción asociadas a productos.

Conceptualmente:

```text
PRODUCTO
    │
    └── LOTE
```

Un producto puede tener múltiples lotes a lo largo del tiempo.

El producto no administra:

```text
Fecha de producción
Fecha de vencimiento
Cantidad disponible
Estado del lote
```

Estos datos pertenecen al dominio de Lotes.

---

# 27. Relación con Inventario

El producto puede formar parte del inventario de productos terminados.

Sin embargo:

```text
PRODUCTO
≠
INVENTARIO
```

El producto define qué producto existe.

El inventario determina:

```text
Cuánto existe
Dónde se encuentra
Qué movimientos ha tenido
Cuál es su disponibilidad
```

La relación conceptual es:

```text
PRODUCTO
    │
    ▼
INVENTARIO
```

---

# 28. Relación con Ventas

Los productos son utilizados posteriormente en el proceso de ventas.

Conceptualmente:

```text
PRODUCTO
    │
    ▼
VENTA
```

El dominio de Productos proporciona la información maestra del producto.

El proceso de Ventas es responsable de registrar la operación comercial realizada.

El precio actual del producto no debe utilizarse automáticamente para modificar el valor histórico de una venta ya registrada.

---

# 29. Relación con Costos

El producto posee un:

```text
Margen_Objetivo
```

pero el costo real del producto depende de otros procesos.

Conceptualmente:

```text
INSUMOS
    │
    ▼
RECETA
    │
    ▼
PRODUCCIÓN
    │
    ▼
COSTO REAL
    │
    ▼
PRODUCTO
```

El dominio de Productos no debe calcular por sí mismo el costo real de producción.

---

# 30. Relación con Rentabilidad

El producto contiene información comercial como:

```text
Precio_Venta
Margen_Objetivo
```

Sin embargo, la rentabilidad real requiere información procedente de otros procesos.

Conceptualmente:

```text
PRECIO HISTÓRICO DE VENTA
        │
        +
COSTO REAL
        │
        ▼
RENTABILIDAD
```

Por tanto:

```text
PRODUCTOS
```

proporciona información base.

```text
RENTABILIDAD
```

realiza el análisis correspondiente.

---

# 31. Modelo conceptual

```text
┌───────────────────────────────────────┐
│               PRODUCTO                │
├───────────────────────────────────────┤
│ ID_Producto                           │
│ Nombre_Producto                       │
│ ID_Presentacion                       │
│ Categoria_Producto                    │
│ Descripcion                           │
│ Canal_Venta                           │
│ Precio_Venta                          │
│ Margen_Objetivo                       │
│ Activo                                │
│ Observaciones                         │
└───────────────────┬───────────────────┘
                    │
                    │ ID_Presentacion
                    ▼
┌───────────────────────────────────────┐
│             PRESENTACIÓN              │
└───────────────────────────────────────┘

                    │
                    │ ID_Producto
                    ▼

        ┌───────────┼───────────┬────────────┐
        ▼           ▼           ▼            ▼
     RECETAS    PRODUCCIÓN    LOTES      VENTAS
```

---

# 32. Flujo general

El ciclo conceptual del producto dentro del negocio es:

```text
CREAR PRODUCTO
        │
        ▼
ASOCIAR PRESENTACIÓN
        │
        ▼
DEFINIR INFORMACIÓN COMERCIAL
        │
        ▼
PRODUCTO ACTIVO
        │
        ├──────────────┐
        ▼              ▼
      RECETAS       CONSULTAS
        │
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
```

No todos estos procesos pertenecen al dominio de Productos.

El producto funciona como una entidad maestra compartida por ellos.

---

# 33. Reglas fundamentales

Las reglas reconstruidas hasta este punto son:

1. Cada producto debe tener un `ID_Producto` único.
2. El ID debe ser generado por el sistema.
3. El ID no puede modificarse durante una actualización.
4. El producto debe tener un nombre.
5. La presentación debe existir.
6. La presentación debe estar activa para crear o actualizar un producto.
7. No pueden existir productos duplicados con la misma combinación de nombre y presentación.
8. El precio de venta no puede ser negativo.
9. El margen objetivo debe estar entre 0 y 100.
10. El producto se controla mediante el campo `Activo`.
11. La eliminación normal del producto debe ser lógica, no física.
12. Las relaciones internas deben utilizar `ID_Producto`.

---

# 34. Dependencias funcionales

El dominio de Productos depende conceptualmente de:

```text
Generación de identificadores
Persistencia
Consulta de registros
Validación
Normalización de datos
Presentaciones
Manejo de estado
```

La dependencia funcional más importante es:

```text
PRODUCTOS
      │
      ▼
PRESENTACIONES
```

La presentación debe existir y estar disponible según las reglas del proceso.

La relación no debe convertirse en una dependencia inversa innecesaria donde Presentaciones administre Productos.

---

# 35. Consumidores del dominio

El dominio de Productos será utilizado conceptualmente por:

```text
Recetas
Producción
Lotes
Inventario
Ventas
Costos
Rentabilidad
Dashboard
Consultas
```

El producto proporciona principalmente:

```text
Identidad
Nombre
Presentación
Categoría
Información comercial
Estado
```

Cada consumidor debe mantener sus propias responsabilidades.

---

# 36. Límites del dominio

El dominio termina cuando la pregunta deja de ser:

```text
¿Qué producto es?
```

y pasa a ser:

```text
¿Qué ingredientes necesita?
¿Cuánto se debe producir?
¿Qué cantidad se produjo?
¿En qué lote quedó?
¿Cuánto inventario existe?
¿Cuánto se vendió?
¿Cuál fue el costo real?
¿Cuál fue la rentabilidad?
```

Estas preguntas pertenecen a otros dominios.

Por tanto:

```text
PRODUCTOS
```

administra la identidad y definición comercial del producto.

```text
RECETAS
```

administra su composición.

```text
PRODUCCIÓN
```

administra su fabricación.

```text
LOTES
```

administra la trazabilidad por lote.

```text
INVENTARIO
```

administra las existencias y movimientos.

```text
VENTAS
```

administra la operación comercial.

```text
COSTOS Y RENTABILIDAD
```

administran el análisis económico correspondiente.

---

# 37. Decisiones pendientes

La reconstrucción actual permite identificar varias decisiones que todavía no deben considerarse cerradas:

* Definir el catálogo real de `Categoria_Producto`.
* Definir los valores válidos de `Canal_Venta`.
* Determinar si un producto puede existir sin receta.
* Determinar si un producto puede tener más de una receta activa.
* Definir la política para modificar la presentación de un producto que ya tenga historial.
* Definir la política para modificar el precio de venta.
* Definir cómo se conservará el historial de cambios de precio.
* Definir si `Margen_Objetivo` se utilizará como porcentaje, valor decimal u otro formato técnico.
* Definir las restricciones para desactivar un producto con operaciones activas.
* Determinar la relación exacta entre producto, receta y producción.
* Determinar si existen diferentes tipos de productos con comportamientos distintos.

Estas decisiones deben resolverse durante la reconstrucción de los dominios dependientes y no deben inventarse durante la implementación.

---

# 38. Estado actual del dominio

Actualmente están reconstruidos con claridad:

* La existencia del dominio como maestro.
* La tabla histórica `tblProductos`.
* La estructura de sus campos.
* El identificador `ID_Producto`.
* La relación con Presentaciones.
* La validación de existencia y estado de la presentación.
* La regla de unicidad por nombre y presentación.
* La validación del precio de venta.
* La validación del margen objetivo.
* El modelo de activación y desactivación.
* La relación conceptual con Recetas.
* La participación futura del producto en Producción, Lotes, Inventario y Ventas.

---

# 39. Fuente histórica

Este documento reconstruye el dominio a partir del sistema original basado en Excel y VBA.

La estructura histórica definía:

```text
06 - PRODUCTOS
    └── tblProductos
```

El módulo `modProductos` establecía expresamente:

```text
Responsabilidad:
Administrar exclusivamente el maestro de productos.

Relación principal:
Producto
    │
    └── Presentación

Reglas:
- ID generado automáticamente.
- ID inmutable.
- Presentación existente.
- Presentación activa.
- Sin duplicados por nombre + presentación.
- Eliminación lógica mediante Activo.
- Precio no negativo.
- Margen objetivo entre 0 y 100.
```

Estas reglas constituyen la base histórica de reconstrucción del dominio. 

---

# 40. Estado del documento

```text
ESTADO: Reconstrucción inicial del dominio
FUENTE PRINCIPAL: Sistema Excel/VBA anterior
IMPLEMENTACIÓN: No iniciada
MODELO DE DATOS DEFINITIVO: Pendiente
REGLAS ESPECÍFICAS COMPLETAS: Pendientes de reconstrucción
```
