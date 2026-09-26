# Proveedores

## 1. Identificación del dominio

**Nombre del dominio:** Proveedores
**Archivo:** `03-suppliers.md`
**Área del sistema:** Maestros
**Entidad principal:** Proveedor
**Identificador principal:** `ID_Proveedor`

El dominio de Proveedores administra la información de las personas o empresas que suministran insumos utilizados por el negocio.

Su responsabilidad es mantener un registro central de proveedores para que posteriormente puedan ser relacionados con precios de insumos y con las operaciones de compra.

En la estructura original del sistema, este dominio corresponde a la tabla:

```text
tblProveedores
```

El sistema también contiene una estructura independiente para registrar la relación entre proveedores e insumos mediante:

```text
tblPreciosProveedores
```

Por esta razón, el proveedor y el precio de un proveedor no representan la misma responsabilidad.

```text
PROVEEDORES
     │
     │ administra
     ▼
INFORMACIÓN DEL PROVEEDOR
     │
     │ se relaciona posteriormente con
     ▼
PRECIOS DE PROVEEDORES
     │
     ├── INSUMO
     └── PROVEEDOR
```

---

# 2. Propósito

El propósito del dominio de Proveedores es registrar y administrar la información necesaria para identificar y contactar a cada proveedor del negocio.

El sistema debe permitir conocer:

* Quién es el proveedor.
* Su identificación tributaria o documento.
* La persona de contacto.
* Su teléfono.
* Su correo electrónico.
* Su dirección.
* Si el proveedor se encuentra activo.
* Observaciones adicionales.

Este dominio constituye una fuente de información para otros procesos, especialmente:

```text
Precios de proveedores
        ↓
Compras
        ↓
Costos de insumos
```

El dominio de Proveedores no administra directamente los precios de compra ni registra compras.

---

# 3. Responsabilidad principal

El dominio de Proveedores es responsable de:

* Registrar proveedores.
* Consultar proveedores.
* Buscar proveedores.
* Obtener información de un proveedor.
* Actualizar la información de un proveedor.
* Activar proveedores.
* Desactivar proveedores.
* Mantener la identidad permanente de cada proveedor mediante `ID_Proveedor`.
* Proporcionar información de proveedores a otros dominios cuando sea necesaria.

---

# 4. No responsabilidades

El dominio de Proveedores no es responsable de:

* Administrar insumos.
* Administrar presentaciones.
* Administrar productos.
* Administrar recetas.
* Registrar precios de compra directamente dentro del proveedor.
* Registrar compras.
* Registrar movimientos de inventario.
* Calcular inventario.
* Registrar producción.
* Administrar lotes.
* Registrar ventas.
* Administrar clientes.
* Registrar pagos.
* Registrar gastos.
* Calcular costos.
* Calcular rentabilidad.
* Administrar el Dashboard.

La relación entre un proveedor y los insumos que puede suministrar pertenece al dominio o estructura de precios de proveedores.

Por tanto:

```text
Proveedor
≠
Precio del proveedor
≠
Compra
```

Cada uno representa una responsabilidad diferente.

---

# 5. Entidad principal

La entidad principal del dominio es:

```text
Proveedor
```

Cada proveedor posee una identidad propia dentro del sistema.

La identidad técnica y permanente del proveedor es:

```text
ID_Proveedor
```

El nombre del proveedor no debe utilizarse como identificador permanente para las relaciones internas del sistema.

Las relaciones futuras deben utilizar:

```text
ID_Proveedor
```

y no:

```text
Nombre_Proveedor
```

Esto permite modificar información visible del proveedor sin romper las relaciones históricas existentes.

---

# 6. Estructura de información

La estructura original definida para el proveedor contiene los siguientes campos:

| Campo              | Descripción                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `ID_Proveedor`     | Identificador único y permanente del proveedor                        |
| `Nombre_Proveedor` | Nombre comercial, empresarial o identificador principal del proveedor |
| `NIT_Cedula`       | Número de identificación tributaria o documento                       |
| `Nombre_Contacto`  | Persona de contacto asociada al proveedor                             |
| `Telefono`         | Información telefónica de contacto                                    |
| `Email`            | Correo electrónico del proveedor o contacto                           |
| `Direccion`        | Dirección registrada                                                  |
| `Activo`           | Estado operativo del proveedor                                        |
| `Observaciones`    | Información adicional                                                 |

La estructura original del sistema define estos campos en `tblProveedores`. 

---

# 7. Identificador del proveedor

Cada proveedor debe poseer un identificador único:

```text
ID_Proveedor
```

El identificador debe ser generado por el sistema.

El usuario no debe introducir manualmente el identificador como parte de la operación normal.

El identificador tiene las siguientes características:

```text
ID único
    ↓
Generado por el sistema
    ↓
Asignado al crear el proveedor
    ↓
No debe cambiar durante una actualización
    ↓
Utilizado para relaciones con otros dominios
```

El identificador debe conservarse incluso si posteriormente cambia:

* El nombre del proveedor.
* La información de contacto.
* El teléfono.
* El correo.
* La dirección.
* El estado operativo.

---

# 8. Información de identificación

## 8.1 Nombre del proveedor

El campo:

```text
Nombre_Proveedor
```

representa el nombre principal con el cual el proveedor será identificado dentro del sistema.

Puede representar, según corresponda:

```text
Empresa
Persona natural
Distribuidor
Fabricante
Mayorista
Otro proveedor comercial
```

El nombre es información de negocio visible para el usuario.

No debe utilizarse como identificador permanente en las relaciones internas.

---

## 8.2 NIT o documento

El campo:

```text
NIT_Cedula
```

permite almacenar el número de identificación del proveedor.

El campo contempla inicialmente dos posibilidades:

```text
NIT
```

o:

```text
Cédula
```

La estructura actual no define todavía un campo independiente para distinguir formalmente el tipo de documento.

Por tanto, la información histórica disponible establece únicamente:

```text
NIT_Cedula
```

Cualquier evolución futura que requiera separar:

```text
Tipo_Documento
Numero_Documento
```

deberá ser evaluada y documentada explícitamente antes de modificar el modelo de datos.

---

# 9. Información de contacto

El proveedor puede contener la siguiente información de contacto:

```text
Nombre_Contacto
Telefono
Email
Direccion
```

Estos campos permiten conservar la información necesaria para la comunicación y localización del proveedor.

La estructura actual del sistema no establece que cada proveedor pueda tener múltiples contactos.

Por tanto, el modelo inicial contempla:

```text
PROVEEDOR
    │
    └── INFORMACIÓN PRINCIPAL DE CONTACTO
```

y no:

```text
PROVEEDOR
    ├── CONTACTO 1
    ├── CONTACTO 2
    └── CONTACTO N
```

Si en el futuro surge una necesidad real de múltiples contactos por proveedor, deberá evolucionarse el modelo mediante una decisión explícita.

---

# 10. Estado del proveedor

Cada proveedor posee el campo:

```text
Activo
```

Este campo determina su disponibilidad operativa dentro del sistema.

Conceptualmente:

```text
Activo
```

significa que el proveedor puede continuar siendo utilizado para nuevas operaciones.

```text
Inactivo
```

significa que el proveedor se conserva históricamente, pero deja de estar disponible como opción normal para nuevas operaciones.

El sistema original utiliza el mismo principio de activación y desactivación para los maestros: los registros no se eliminan físicamente como operación normal, sino que se conserva su historial mediante un campo de estado. Este patrón aparece explícitamente en los módulos de maestros ya reconstruidos. 

---

# 11. Eliminación lógica

El proveedor no debe eliminarse físicamente como operación normal del sistema.

La operación conceptual de eliminación debe interpretarse como:

```text
Desactivar proveedor
```

El objetivo es conservar la integridad histórica de relaciones que puedan existir posteriormente con:

```text
Precios de proveedores
Compras
Historial de operaciones
Costos históricos
```

La lógica esperada es:

```text
Proveedor activo
        │
        ▼
Desactivación
        │
        ▼
Proveedor inactivo
        │
        ├── Se conserva su ID
        ├── Se conserva su información histórica
        └── Se conservan sus relaciones existentes
```

No debe eliminarse físicamente un proveedor simplemente porque ya no se utilice.

---

# 12. Relación con precios de proveedores

El proveedor se relaciona con la estructura:

```text
tblPreciosProveedores
```

La estructura original de precios contiene:

```text
ID_Precio
ID_Insumo
ID_Proveedor
Presentacion_Compra
Cantidad_Presentacion
Unidad_Presentacion
Cantidad_Equivalente_Base
Precio_Compra
Costo_Unidad_Base
Fecha_Registro
Fecha_Ultima_Compra
Activo
Observaciones
```

Esta estructura está definida separadamente de `tblProveedores`. 

La relación conceptual es:

```text
INSUMO
   │
   │
   ├───────────────┐
   │               │
   ▼               ▼
PROVEEDOR      PROVEEDOR
   │               │
   └───────┬───────┘
           ▼
   PRECIO DE PROVEEDOR
```

Un proveedor puede estar relacionado con uno o varios insumos.

Un insumo puede estar relacionado con uno o varios proveedores.

Por tanto, la relación conceptual es:

```text
PROVEEDOR
    │
    └──< PRECIO_PROVEEDOR >── INSUMO
```

La entidad de precio funciona como punto de relación entre ambas entidades.

---

# 13. El proveedor no contiene precios

El precio de compra no debe almacenarse directamente dentro del proveedor.

Incorrecto:

```text
Proveedor
├── Nombre
├── Teléfono
└── Precio de leche
```

Correcto:

```text
Proveedor
        │
        ▼
Precio de proveedor
        │
        ├── Insumo
        ├── Presentación de compra
        ├── Cantidad
        ├── Precio de compra
        └── Costo por unidad base
```

Esto permite que un mismo proveedor pueda suministrar diferentes insumos con diferentes condiciones comerciales.

Por ejemplo:

```text
PROVEEDOR A
    │
    ├── Leche
    │     └── Precio A
    │
    ├── Azúcar
    │     └── Precio B
    │
    └── Envases
          └── Precio C
```

---

# 14. Relación con insumos

El dominio de Proveedores no administra directamente los insumos.

La relación entre ambos se produce a través de la estructura de precios.

```text
Insumos
   │
   │ ID_Insumo
   ▼
Precios de proveedores
   │
   │ ID_Proveedor
   ▼
Proveedores
```

Por tanto, las responsabilidades permanecen separadas:

```text
Insumos
→ Define qué se utiliza.

Proveedores
→ Define quién puede suministrarlo.

Precios de proveedores
→ Define bajo qué presentación, cantidad y costo se registra la relación.
```

---

# 15. Relación con compras

El proveedor es una entidad maestra que posteriormente será utilizada por el proceso de compras.

La secuencia conceptual del negocio es:

```text
PROVEEDOR
      │
      ▼
PRECIOS DEL PROVEEDOR
      │
      ▼
COMPRA
      │
      ▼
DETALLE DE COMPRA
```

El dominio de Proveedores no registra la compra.

Su función es proporcionar la identidad y la información del proveedor para que otros procesos puedan referenciarlo.

---

# 16. Operaciones del dominio

El dominio debe soportar, como mínimo, las siguientes operaciones conceptuales:

```text
Crear proveedor
Consultar proveedor
Buscar proveedor
Listar proveedores
Actualizar proveedor
Activar proveedor
Desactivar proveedor
Obtener información de contacto
Verificar existencia del proveedor
Consultar estado del proveedor
```

Estas operaciones representan la responsabilidad del maestro de proveedores.

---

# 17. Crear proveedor

La creación de un proveedor debe seguir conceptualmente este proceso:

```text
1. Recibir información
        ↓
2. Normalizar información textual
        ↓
3. Validar datos requeridos
        ↓
4. Validar reglas de unicidad aplicables
        ↓
5. Generar ID_Proveedor
        ↓
6. Crear registro
        ↓
7. Establecer estado inicial
        ↓
8. Guardar información
```

El identificador debe ser generado por el sistema.

El proveedor debe iniciar con un estado operativo definido por la regla de creación correspondiente.

---

# 18. Consultar proveedor

El sistema debe permitir consultar un proveedor utilizando su identificador principal:

```text
ID_Proveedor
```

La consulta debe permitir recuperar, según corresponda:

```text
ID_Proveedor
Nombre_Proveedor
NIT_Cedula
Nombre_Contacto
Telefono
Email
Direccion
Activo
Observaciones
```

---

# 19. Buscar proveedor

El sistema debe permitir localizar proveedores para facilitar su utilización en procesos posteriores.

Las búsquedas pueden estar orientadas a información como:

```text
ID
Nombre
NIT o documento
Información de contacto
Estado
```

La implementación específica de filtros y mecanismos de búsqueda deberá definirse posteriormente durante el desarrollo del módulo.

Este documento define la necesidad funcional de búsqueda, pero no impone todavía una implementación técnica específica.

---

# 20. Actualizar proveedor

La actualización de un proveedor puede modificar su información administrativa y de contacto.

Puede actualizarse información como:

```text
Nombre_Proveedor
NIT_Cedula
Nombre_Contacto
Telefono
Email
Direccion
Observaciones
```

No debe modificarse:

```text
ID_Proveedor
```

El identificador constituye la identidad permanente del proveedor.

---

# 21. Activar proveedor

Un proveedor inactivo puede volver a estar disponible mediante una operación de activación.

Conceptualmente:

```text
Inactivo
    ↓
Activar
    ↓
Activo
```

La activación no genera un nuevo proveedor ni modifica su identificador.

---

# 22. Desactivar proveedor

La desactivación cambia el estado operativo del proveedor.

Conceptualmente:

```text
Activo
    ↓
Desactivar
    ↓
Inactivo
```

La desactivación:

* No elimina físicamente el registro.
* No modifica `ID_Proveedor`.
* No elimina la información histórica.
* No elimina relaciones existentes.

---

# 23. Reglas de identidad

Las reglas fundamentales de identidad son:

1. Cada proveedor debe tener un `ID_Proveedor`.
2. El identificador debe ser único.
3. El identificador debe ser generado por el sistema.
4. El identificador no debe cambiar durante una actualización.
5. Las relaciones internas deben utilizar `ID_Proveedor`.
6. El nombre del proveedor no debe utilizarse como clave permanente.

---

# 24. Reglas de estado

Las reglas fundamentales del estado son:

1. Un proveedor puede estar activo o inactivo.
2. La disponibilidad para nuevas operaciones debe depender de su estado.
3. La desactivación no implica eliminación física.
4. La información histórica debe conservarse.
5. La reactivación debe conservar el mismo `ID_Proveedor`.

---

# 25. Reglas de dependencia

El dominio de Proveedores puede ser utilizado por otros dominios para consultar información o verificar la existencia y disponibilidad de un proveedor.

Sus consumidores principales serán conceptualmente:

```text
Precios de proveedores
Compras
Consultas
Costos
Reportes
Dashboard
```

Sin embargo, el dominio de Proveedores no debe asumir responsabilidades pertenecientes a esos módulos.

La dirección conceptual es:

```text
PROVEEDORES
      │
      ├── proporciona identidad
      ├── proporciona información
      └── proporciona estado
              │
              ▼
      OTROS PROCESOS DEL NEGOCIO
```

No debe ocurrir lo contrario mediante acoplamientos innecesarios.

---

# 26. Dependencias funcionales

El dominio depende conceptualmente de capacidades transversales para:

```text
Generación de identificadores
Persistencia
Consulta de registros
Validación
Normalización de datos
Manejo de estado
```

Estas responsabilidades no forman parte del negocio específico de Proveedores.

En la versión original basada en VBA, la infraestructura técnica centralizaba el acceso a `tblProveedores` y distinguía explícitamente la lógica de negocio de la manipulación técnica de las tablas. 

La nueva implementación debe conservar esta separación conceptual, aunque cambie completamente la tecnología.

---

# 27. Datos que pertenecen al proveedor

Pertenecen directamente al dominio:

```text
ID_Proveedor
Nombre_Proveedor
NIT_Cedula
Nombre_Contacto
Telefono
Email
Direccion
Activo
Observaciones
```

No pertenecen directamente al proveedor:

```text
ID_Insumo
Precio_Compra
Costo_Unidad_Base
Cantidad_Equivalente_Base
Fecha_Ultima_Compra
Cantidad_Comprada
Inventario
Producción
Ventas
Rentabilidad
```

Estos datos pertenecen a otros procesos o relaciones del sistema.

---

# 28. Modelo conceptual

```text
┌─────────────────────────────────────┐
│             PROVEEDOR               │
├─────────────────────────────────────┤
│ ID_Proveedor                        │
│ Nombre_Proveedor                    │
│ NIT_Cedula                          │
│ Nombre_Contacto                     │
│ Telefono                            │
│ Email                               │
│ Direccion                           │
│ Activo                              │
│ Observaciones                       │
└──────────────────┬──────────────────┘
                   │
                   │ ID_Proveedor
                   ▼
┌─────────────────────────────────────┐
│        PRECIO DE PROVEEDOR           │
├─────────────────────────────────────┤
│ ID_Precio                           │
│ ID_Insumo                           │
│ ID_Proveedor                        │
│ Presentacion_Compra                 │
│ Cantidad_Presentacion               │
│ Unidad_Presentacion                 │
│ Cantidad_Equivalente_Base           │
│ Precio_Compra                       │
│ Costo_Unidad_Base                   │
│ Fecha_Registro                      │
│ Fecha_Ultima_Compra                 │
│ Activo                              │
│ Observaciones                       │
└──────────────────┬──────────────────┘
                   │
                   │ ID_Insumo
                   ▼
┌─────────────────────────────────────┐
│               INSUMO                │
└─────────────────────────────────────┘
```

---

# 29. Flujo general

El flujo esperado del dominio es:

```text
CREAR PROVEEDOR
        │
        ▼
VALIDAR INFORMACIÓN
        │
        ▼
GENERAR ID
        │
        ▼
REGISTRAR PROVEEDOR
        │
        ▼
PROVEEDOR DISPONIBLE
        │
        ├───────────────┐
        ▼               ▼
PRECIOS            CONSULTAS
        │
        ▼
COMPRAS
```

---

# 30. Límites del dominio

El dominio termina cuando la responsabilidad deja de ser:

```text
¿Quién es el proveedor?
```

y pasa a ser:

```text
¿Qué insumo suministra?
¿En qué presentación?
¿A qué precio?
¿Cuándo se compró?
¿Cuánto se compró?
```

Estas preguntas pertenecen a otros dominios.

Por tanto:

```text
PROVEEDORES
```

administra la identidad y la información del proveedor.

```text
PRECIOS DE PROVEEDORES
```

administra la relación comercial entre:

```text
Proveedor
+
Insumo
+
Presentación de compra
+
Costo
```

```text
COMPRAS
```

administra la operación comercial realizada.

---

# 31. Estado actual del dominio

La información reconstruida hasta este punto procede de la estructura maestra del sistema anterior.

Actualmente están definidos con claridad:

* La existencia del dominio como maestro.
* La tabla original `tblProveedores`.
* Sus campos principales.
* Su identificador `ID_Proveedor`.
* Su relación con `tblPreciosProveedores`.
* Su participación futura en el proceso de compras.
* Su separación respecto de insumos, precios y compras.
* El modelo general de activación y desactivación utilizado por los maestros.

Quedan pendientes de definición específica durante la reconstrucción del modelo de negocio:

* Reglas exactas de unicidad para proveedores.
* Si `NIT_Cedula` debe ser obligatorio en todos los casos.
* Reglas formales de validación para teléfono.
* Reglas formales de validación para correo electrónico.
* Política exacta para modificar un proveedor que ya tenga operaciones históricas.
* Reglas para impedir o permitir la desactivación de proveedores con relaciones activas.
* Comportamiento de los precios asociados cuando un proveedor es desactivado.
* Posible evolución futura hacia múltiples contactos por proveedor.

Estas decisiones no deben inventarse durante la implementación. Deben resolverse y documentarse cuando reconstruyamos el comportamiento específico del dominio y sus dependencias.

---

# 32. Fuente histórica

Este documento reconstruye el dominio a partir de la estructura existente del sistema original.

La estructura física original definía:

```text
04 - PROVEEDORES
    └── tblProveedores

05 - PRECIOS_PROVEEDORES
    └── tblPreciosProveedores
```

con `ID_Proveedor` como vínculo entre la información del proveedor y la estructura de precios. 

La separación de estas dos tablas confirma que el sistema original trataba:

```text
Proveedor
```

y:

```text
Precio del proveedor
```

como responsabilidades distintas.

---

# 33. Estado del documento

```text
ESTADO: Reconstrucción inicial del dominio
FUENTE PRINCIPAL: Sistema Excel/VBA anterior
IMPLEMENTACIÓN: No iniciada
MODELO DE DATOS DEFINITIVO: Pendiente
REGLAS ESPECÍFICAS COMPLETAS: Pendientes de reconstrucción
```
