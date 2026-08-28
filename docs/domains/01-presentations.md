Sí. Basado en la estructura real del Excel y en el módulo `modPresentaciones` que veníamos usando, `presentations.md` ya puede quedar bastante definido.

Hay que separar lo que está **confirmado por la fuente VBA** de lo que todavía no debemos inventar. La estructura de datos de Presentaciones está claramente definida por `tblPresentaciones`: ID, nombre, cantidad en onzas, cantidad en mililitros, tipo de envase, estado y observaciones. 

Además, el módulo VBA establece que la presentación tiene ID permanente, nombre único, edición sin modificar el ID y eliminación lógica mediante desactivación. El módulo de Productos confirma también que un producto depende de una presentación existente y activa. 

Guarda el siguiente contenido en:

```text
docs/domains/presentations.md
```

````md
# PRESENTACIONES

## 1. Propósito

El dominio de Presentaciones administra las presentaciones comerciales utilizadas por los productos del sistema.

Una presentación define las características físicas o comerciales del formato en el que un producto puede ser comercializado.

Ejemplos conceptuales:

- Vaso de 3.5 oz.
- Vaso de 6 oz.
- Envase de 1 litro.
- Botella de determinada capacidad.

La presentación no representa un producto.

La presentación representa el formato o envase asociado a un producto.

---

# 2. Responsabilidad

El dominio de Presentaciones es responsable de:

- Registrar nuevas presentaciones.
- Consultar presentaciones existentes.
- Buscar presentaciones.
- Obtener información de una presentación.
- Actualizar una presentación existente.
- Validar nombres duplicados.
- Activar una presentación.
- Desactivar una presentación.
- Determinar si una presentación se encuentra activa.

---

# 3. No responsabilidad

El dominio de Presentaciones no es responsable de:

- Administrar productos.
- Crear productos.
- Administrar recetas.
- Administrar insumos.
- Gestionar proveedores.
- Registrar compras.
- Gestionar inventario.
- Registrar producción.
- Administrar lotes.
- Registrar ventas.
- Administrar clientes.
- Registrar pagos.
- Registrar gastos.
- Calcular costos.
- Calcular rentabilidad.
- Generar indicadores del Dashboard.

Tampoco es responsabilidad del dominio definir cómo se almacena físicamente la información en PostgreSQL.

---

# 4. Entidad principal

El dominio administra una entidad principal:

```text
Presentación
````

Cada presentación posee una identidad permanente dentro del sistema.

Conceptualmente:

```text
PRESENTACIÓN
│
├── ID
├── Nombre
├── Cantidad en onzas
├── Cantidad en mililitros
├── Tipo de envase
├── Estado
└── Observaciones
```

---

# 5. Información administrada

La estructura histórica del sistema VBA define los siguientes datos:

| Campo histórico     | Descripción                                         |
| ------------------- | --------------------------------------------------- |
| ID_Presentacion     | Identificador único y permanente de la presentación |
| Nombre_Presentacion | Nombre comercial o descriptivo de la presentación   |
| Cantidad_Oz         | Capacidad expresada en onzas                        |
| Cantidad_ml         | Capacidad expresada en mililitros                   |
| Tipo_Envase         | Tipo de recipiente o envase                         |
| Activo              | Estado de disponibilidad de la presentación         |
| Observaciones       | Información adicional                               |

La estructura histórica de Excel utilizaba una tabla denominada:

```text
tblPresentaciones
```

La migración a PostgreSQL podrá cambiar los nombres técnicos de almacenamiento, pero no debe modificar el significado de estos datos sin una decisión explícita.

---

# 6. Identidad de la presentación

Cada presentación tiene un identificador único:

```text
ID_Presentacion
```

El ID identifica permanentemente a la presentación.

Reglas confirmadas:

* El ID es generado por el sistema.
* El usuario no debe introducir manualmente el ID.
* El ID no debe modificarse durante una edición.
* Las relaciones con otros dominios deben utilizar el ID.
* El nombre no debe utilizarse como identificador permanente.

Conceptualmente:

```text
ID_Presentacion
        │
        └── Identidad permanente
```

El nombre de la presentación puede modificarse.

Por esta razón:

```text
Nombre_Presentacion
≠
Identidad permanente
```

---

# 7. Datos obligatorios

Según las validaciones existentes en el módulo VBA, los siguientes datos son obligatorios al crear o editar una presentación:

```text
Nombre_Presentacion
Cantidad_Oz
Cantidad_ml
Tipo_Envase
```

Las observaciones son opcionales.

El estado inicial de una nueva presentación es:

```text
ACTIVA
```

En la fuente VBA histórica esto se representaba mediante:

```text
SI
```

La representación técnica definitiva del estado será determinada durante el diseño del modelo de datos.

---

# 8. Reglas de negocio confirmadas

## 8.1 El nombre es obligatorio

No se puede crear ni actualizar una presentación sin nombre.

```text
Nombre vacío
    ↓
Operación rechazada
```

---

## 8.2 El nombre debe ser único

No pueden existir dos presentaciones con el mismo nombre.

La comparación histórica normalizaba el texto y no dependía de diferencias de mayúsculas y minúsculas.

Por ejemplo:

```text
Vaso 6 Oz
```

y:

```text
VASO 6 OZ
```

deben representar el mismo nombre a efectos de validación.

Por lo tanto:

```text
El nombre debe ser único después de aplicar la normalización
definida por el sistema.
```

---

## 8.3 La cantidad en onzas debe ser mayor que cero

```text
Cantidad_Oz > 0
```

Una presentación no puede registrarse con:

```text
0
```

o con una cantidad negativa.

---

## 8.4 La cantidad en mililitros debe ser mayor que cero

```text
Cantidad_ml > 0
```

Una presentación no puede registrarse con:

```text
0
```

o con una cantidad negativa.

---

## 8.5 El tipo de envase es obligatorio

Una presentación debe indicar el tipo de envase asociado.

No puede registrarse una presentación sin este dato.

---

# 9. Regla pendiente sobre onzas y mililitros

El sistema VBA almacenaba simultáneamente:

```text
Cantidad_Oz
Cantidad_ml
```

Sin embargo, el propio módulo dejó pendiente una revisión sobre la relación entre ambos valores.

Actualmente, la fuente histórica permite registrar ambos valores de forma independiente siempre que sean mayores que cero.

Por tanto, todavía no está confirmado si en la nueva aplicación debe existir una regla como:

```text
Cantidad_ml = conversión automática de Cantidad_Oz
```

o si ambos valores deben continuar siendo introducidos y almacenados independientemente.

Estado:

```text
PENDIENTE DE DECISIÓN
```

Hasta tomar una decisión explícita, la migración debe conservar ambos conceptos.

---

# 10. Ciclo de vida

Una presentación tiene dos estados funcionales:

```text
ACTIVA
```

```text
INACTIVA
```

El ciclo de vida conceptual es:

```text
CREAR
  │
  ▼
ACTIVA
  │
  ├──────────────► EDITAR
  │
  ▼
DESACTIVAR
  │
  ▼
INACTIVA
  │
  ▼
ACTIVAR
  │
  ▼
ACTIVA
```

---

# 11. No existe eliminación física

La operación históricamente denominada:

```text
EliminarPresentacion
```

no elimina físicamente el registro.

Su comportamiento real es:

```text
Eliminar
    │
    ▼
Desactivar presentación
```

La presentación permanece almacenada en el sistema.

Esto permite conservar referencias existentes y evita romper relaciones históricas.

Por tanto, la regla del dominio es:

> Una presentación no debe eliminarse físicamente mediante la operación normal de gestión.

---

# 12. Activación

Una presentación inactiva puede volver a activarse.

Conceptualmente:

```text
INACTIVA
    │
    ▼
ACTIVAR
    │
    ▼
ACTIVA
```

La activación no genera una nueva presentación.

La misma identidad se conserva.

---

# 13. Edición

Una presentación existente puede ser modificada.

Los datos que pueden actualizarse son:

* Nombre.
* Cantidad en onzas.
* Cantidad en mililitros.
* Tipo de envase.
* Observaciones.

El identificador no se modifica.

```text
ID_Presentacion
        │
        ▼
NO MODIFICABLE
```

Durante una edición, la validación de duplicados debe excluir la propia presentación.

Ejemplo:

```text
Presentación actual:

ID: PRE-001
Nombre: Vaso 6 Oz
```

Al guardar nuevamente:

```text
Vaso 6 Oz
```

no debe considerarse un duplicado de sí misma.

Pero:

```text
PRE-002
Vaso 6 Oz
```

sí representaría un conflicto.

---

# 14. Operaciones principales

El dominio requiere, como mínimo, las siguientes operaciones funcionales:

```text
Crear presentación
```

```text
Consultar presentación
```

```text
Buscar presentación por ID
```

```text
Buscar presentación por nombre
```

```text
Actualizar presentación
```

```text
Activar presentación
```

```text
Desactivar presentación
```

```text
Consultar estado
```

También existe la operación histórica denominada:

```text
Eliminar presentación
```

pero su comportamiento funcional equivale a:

```text
Desactivar presentación
```

La nomenclatura definitiva de la nueva aplicación deberá evitar ambigüedad entre:

```text
Eliminar físicamente
```

y:

```text
Desactivar
```

---

# 15. Consultas principales

El dominio histórico permitía consultar:

* Existencia de una presentación por ID.
* Existencia de una presentación por nombre.
* Nombre de una presentación.
* Cantidad en onzas.
* Cantidad en mililitros.
* Tipo de envase.
* Estado.
* Observaciones.
* ID de una presentación a partir de su nombre.

Estas consultas representan capacidades funcionales del dominio.

No implican necesariamente que la nueva API deba tener un endpoint independiente para cada una.

La implementación técnica será definida posteriormente.

---

# 16. Relación con Productos

La relación confirmada con otro dominio es:

```text
PRESENTACIÓN
      │
      │  ID_Presentacion
      ▼
   PRODUCTO
```

Un producto almacena una referencia a una presentación.

Por tanto:

```text
PRODUCTO
    │
    └── pertenece o utiliza una PRESENTACIÓN
```

La referencia histórica utilizada es:

```text
ID_Presentacion
```

---

# 17. Regla de disponibilidad para Productos

La lógica histórica de Productos valida que una presentación utilizada por un producto:

1. Exista.
2. Se encuentre activa.

Conceptualmente:

```text
¿La presentación existe?
        │
        ├── NO
        │     └── Operación rechazada
        │
        └── SÍ
              │
              ▼
        ¿Está activa?
              │
              ├── NO
              │     └── Operación rechazada
              │
              └── SÍ
                    │
                    ▼
              Puede utilizarse
```

Esto significa que una presentación inactiva no debe estar disponible para ser seleccionada en la creación o actualización de un producto.

---

# 18. Dependencias del dominio

## Dependencia de identidad

El dominio requiere un mecanismo central de generación de identificadores.

Históricamente:

```text
modPresentaciones
        │
        ▼
      modIDs
        │
        ▼
GenerarIDPresentacion()
```

La presentación no generaba directamente su propio ID.

Principio que se conserva:

> La generación técnica del identificador debe estar centralizada y no duplicada dentro de la lógica específica de Presentaciones.

El mecanismo concreto será definido durante el diseño técnico.

---

## Dependencia de persistencia

Históricamente, Presentaciones utilizaba una estructura centralizada para acceder a:

```text
tblPresentaciones
```

La lógica de negocio no era responsable de crear hojas ni definir la estructura física de Excel.

Principio que se conserva:

> La lógica del dominio de Presentaciones no debe asumir responsabilidades propias de la infraestructura de persistencia.

La implementación concreta con PostgreSQL y Prisma será definida posteriormente.

---

# 19. Información histórica que debe conservarse

Las presentaciones forman parte de la información maestra del sistema.

Por este motivo, la desactivación se utilizaba para evitar la pérdida de información y posibles referencias desde otros módulos.

La migración debe preservar este principio:

```text
Registro histórico
        +
Identidad permanente
        +
Desactivación
```

No debe introducirse eliminación física como comportamiento normal sin una decisión explícita y sin revisar sus efectos sobre Productos y otros dominios futuros.

---

# 20. Casos funcionales identificados

## Crear presentación

Entrada:

```text
Nombre
Cantidad_Oz
Cantidad_ml
Tipo_Envase
Observaciones
```

Proceso:

```text
Normalizar datos
      ↓
Validar campos obligatorios
      ↓
Validar cantidades positivas
      ↓
Validar nombre único
      ↓
Generar ID
      ↓
Crear presentación
      ↓
Asignar estado ACTIVA
```

---

## Editar presentación

Entrada:

```text
ID_Presentacion
Nombre
Cantidad_Oz
Cantidad_ml
Tipo_Envase
Observaciones
```

Proceso:

```text
Buscar presentación
      ↓
¿Existe?
      │
      ├── NO → rechazar operación
      │
      └── SÍ
            ↓
      Validar datos
            ↓
      Validar nombre único
      excluyendo el propio ID
            ↓
      Actualizar datos
            ↓
      Conservar ID
```

---

## Desactivar presentación

Entrada:

```text
ID_Presentacion
```

Proceso:

```text
Buscar presentación
      ↓
¿Existe?
      │
      ├── NO → rechazar operación
      │
      └── SÍ
            ↓
      Cambiar estado a INACTIVA
```

---

## Activar presentación

Entrada:

```text
ID_Presentacion
```

Proceso:

```text
Buscar presentación
      ↓
¿Existe?
      │
      ├── NO → rechazar operación
      │
      └── SÍ
            ↓
      Cambiar estado a ACTIVA
```

---

# 21. Restricciones conocidas

Las siguientes restricciones están confirmadas:

```text
1. El ID identifica permanentemente la presentación.

2. El ID no se modifica durante una edición.

3. El nombre es obligatorio.

4. El nombre debe ser único.

5. La comparación del nombre debe ignorar diferencias
   no significativas derivadas de la normalización.

6. Cantidad_Oz debe ser mayor que cero.

7. Cantidad_ml debe ser mayor que cero.

8. Tipo_Envase es obligatorio.

9. Una nueva presentación inicia activa.

10. La eliminación normal no elimina físicamente el registro.

11. Una presentación puede activarse y desactivarse.

12. Una presentación debe existir para ser utilizada por un producto.

13. Una presentación debe estar activa para poder ser utilizada
    en la creación o actualización de un producto.
```

---

# 22. Información pendiente de definir

Los siguientes puntos no deben considerarse todavía definitivos:

## 22.1 Conversión entre onzas y mililitros

Debe definirse si:

```text
Cantidad_Oz
```

es la fuente principal y:

```text
Cantidad_ml
```

se calcula automáticamente.

O si ambos valores seguirán siendo independientes.

---

## 22.2 Relación con registros históricos

Debe definirse qué ocurrirá si una presentación ya está asociada a productos y posteriormente se modifica.

Ejemplo:

```text
Producto histórico
        │
        ▼
Presentación modificada
```

Debe determinarse si los productos deben reflejar automáticamente el cambio o si algunos datos deben conservar una referencia histórica.

---

## 22.3 Desactivación de una presentación en uso

La fuente VBA permite desactivar una presentación.

Sin embargo, durante la reconstrucción completa del sistema debe confirmarse si se permitirá desactivar una presentación que actualmente está asociada a productos activos.

Estado:

```text
PENDIENTE DE VALIDACIÓN GLOBAL
```

---

## 22.4 Tipo de envase

Actualmente:

```text
Tipo_Envase
```

es un valor de texto.

Todavía no está definido si en la nueva aplicación será:

* Texto libre.
* Lista controlada.
* Catálogo independiente.
* Configuración del sistema.

Estado:

```text
PENDIENTE DE DECISIÓN
```

---

# 23. Decisiones confirmadas

## DECISIÓN P-001 — La presentación es un dato maestro

Una presentación pertenece al área de Maestros.

No representa una operación transaccional.

---

## DECISIÓN P-002 — El ID es la referencia permanente

Las relaciones entre dominios deben utilizar la identidad de la presentación.

No deben utilizar:

```text
Nombre_Presentacion
```

como clave permanente.

---

## DECISIÓN P-003 — No existe eliminación física como operación normal

La eliminación funcional equivale a desactivación.

---

## DECISIÓN P-004 — El nombre debe ser único

No pueden coexistir dos presentaciones con el mismo nombre después de aplicar las reglas de normalización.

---

## DECISIÓN P-005 — Los Productos dependen de Presentaciones

Un producto debe referenciar una presentación existente.

La presentación debe estar activa para poder seleccionarse durante la creación o actualización de un producto.

---

# 24. Estado del dominio

```text
ESTADO: RECONSTRUIDO DESDE LA FUENTE VBA
```

Nivel de certeza actual:

```text
ALTO
```

La estructura básica, datos, operaciones principales y reglas de validación están respaldadas por la implementación histórica del sistema.

Los puntos marcados como:

```text
PENDIENTE DE DECISIÓN
```

no deben implementarse como reglas definitivas hasta completar la revisión de los dominios relacionados.

---

# 25. Próximo dominio relacionado

El siguiente dominio a reconstruir es:

```text
INSUMOS
```

Documento:

```text
docs/domains/supplies.md
```

Posteriormente:

```text
PROVEEDORES
        ↓
PRODUCTOS
```

permitirá reconstruir completamente las relaciones de los datos maestros antes de entrar en Recetas, Compras, Producción e Inventario.

```

Este documento ya nos deja una base sólida porque **Presentaciones es realmente uno de los dominios más simples y mejor definidos en el VBA**. No he añadido una entidad, endpoint, tabla PostgreSQL ni estructura de NestJS: eso sería saltar prematuramente a la implementación.

El siguiente documento debería ser `supplies.md`, pero ahí debemos ser más cuidadosos porque Insumos empieza a conectar maestros, compras, precios de proveedores, recetas e inventario. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}
```
