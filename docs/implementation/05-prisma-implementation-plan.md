# Prisma Implementation Plan — V1

## 1. Propósito del documento

Este documento define el plan para implementar la capa de persistencia del sistema mediante Prisma.

Su objetivo es establecer el orden, las responsabilidades y las restricciones para traducir el modelo de datos ya validado a una implementación concreta en la base de datos.

Este documento no redefine el modelo de negocio.

La implementación de Prisma debe respetar como fuente de decisión:

```text
docs/domains/
```

para las reglas y responsabilidades funcionales.

```text
docs/data-model/
```

para entidades, relaciones, integridad, historial y trazabilidad.

```text
docs/backend/
```

para fronteras de módulos, persistencia y transacciones.

```text
docs/implementation/
```

para el orden general de construcción.

La regla principal será:

```text
PRISMA IMPLEMENTA
EL MODELO DEFINIDO

NO REDISEÑA
EL MODELO
```

---

# 2. Alcance

Este plan cubre:

* configuración inicial de Prisma;
* definición del datasource;
* definición del generator;
* implementación progresiva del schema;
* mapeo de entidades;
* relaciones;
* restricciones;
* índices;
* enums cuando correspondan;
* migraciones;
* validación de la base de datos;
* integración con NestJS;
* estrategia de evolución del schema.

No cubre la implementación completa de cada módulo de negocio.

Tampoco introduce nuevas entidades únicamente por conveniencia técnica.

---

# 3. Principio de fidelidad

La implementación debe conservar la lógica ya validada del sistema original.

El proceso será:

```text
DOCUMENTACIÓN VALIDADA
        ↓
MODELO DE DATOS
        ↓
MODELO PRISMA
        ↓
MIGRACIONES
        ↓
BASE DE DATOS
```

No debe ocurrir:

```text
PRISMA
   ↓
INVENTAR ENTIDADES
   ↓
MODIFICAR EL MODELO
   ↓
OBLIGAR AL NEGOCIO
A ADAPTARSE
```

Si durante la implementación aparece una necesidad no contemplada, debe analizarse antes de modificar el schema.

---

# 4. Fuente de verdad para Prisma

Antes de implementar cualquier modelo, se debe verificar su correspondencia con los documentos existentes.

La jerarquía de referencia será:

```text
1. docs/data-model/12-vba-fidelity-validation.md
```

cuando exista una decisión relacionada con la fidelidad respecto al sistema maestro original.

```text
2. docs/data-model/
```

para estructura, relaciones e integridad.

```text
3. docs/domains/
```

para significado y reglas funcionales.

```text
4. docs/backend/
```

para límites de persistencia y transacciones.

El schema de Prisma no debe convertirse en una fuente independiente de decisiones de negocio.

---

# 5. Ubicación inicial

La estructura recomendada será:

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   │
│   └── migrations/
│
└── src/
    │
    ├── database/
    │   ├── database.module.js
    │   └── prisma.service.js
    │
    └── modules/
```

Inicialmente se utilizará un único schema:

```text
prisma/schema.prisma
```

No se dividirá anticipadamente en múltiples archivos.

La razón es mantener la implementación inicial simple y facilitar la revisión completa de relaciones.

---

# 6. Configuración inicial de Prisma

El schema deberá definir inicialmente:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

La conexión a la base de datos debe provenir de variables de entorno.

No deben existir credenciales directamente dentro del código.

---

# 7. Validación de variables de entorno

Antes de inicializar Prisma, el backend debe validar la configuración requerida.

Como mínimo:

```text
DATABASE_URL
```

debe estar presente.

El flujo será:

```text
VARIABLES DE ENTORNO
        ↓
VALIDACIÓN DE CONFIGURACIÓN
        ↓
INICIALIZACIÓN DEL BACKEND
        ↓
PRISMA
        ↓
BASE DE DATOS
```

La aplicación no debe iniciar parcialmente si la configuración esencial de persistencia es inválida.

---

# 8. Prisma como infraestructura

Prisma será tratado como una herramienta de persistencia.

No debe contener reglas de negocio.

La separación conceptual será:

```text
MÓDULO
   ↓
CASO DE USO
   ↓
REPOSITORIO / ACCESO A PERSISTENCIA
   ↓
PRISMA
   ↓
POSTGRESQL
```

Prisma no decide:

```text
cuándo puede realizarse una venta
```

```text
cuándo debe descontarse inventario
```

```text
cuándo un lote puede utilizarse
```

```text
cómo se calcula la rentabilidad
```

Esas decisiones pertenecen a los módulos y casos de uso correspondientes.

---

# 9. Estrategia de implementación del schema

El schema no debe construirse de una sola vez sin validación.

La implementación será progresiva.

El proceso general será:

```text
DEFINIR BLOQUE
        ↓
REVISAR RELACIONES
        ↓
AGREGAR RESTRICCIONES
        ↓
GENERAR MIGRACIÓN
        ↓
INSPECCIONAR RESULTADO
        ↓
VALIDAR
        ↓
CONTINUAR
```

Cada grupo de entidades debe ser coherente antes de continuar.

---

# 10. Orden general de implementación

El orden de implementación debe seguir las dependencias del modelo.

La secuencia inicial será:

```text
1. CONFIGURACIÓN BASE
```

```text
2. PRESENTACIONES (COMPLETADO)
```

```text
3. INSUMOS (COMPLETADO)
```

```text
4. PROVEEDORES (COMPLETADO)
```

```text
5. PRECIOS DE PROVEEDORES (COMPLETADO)
```

```text
6. PRODUCTOS (COMPLETADO)
```

```text
7. RECETAS (COMPLETADO)
```

```text
8. DETALLE DE RECETAS (COMPLETADO)
```

```text
9. COMPRAS (COMPLETADO)
```

```text
10. DETALLE DE COMPRAS (COMPLETADO)
```

```text
11. INVENTARIO Y MOVIMIENTOS (COMPLETADO)
```

```text
12. PRODUCCIÓN (COMPLETADO)
```

```text
13. DETALLE DE PRODUCCIÓN (COMPLETADO)
```

```text
14. LOTES (COMPLETADO)
```

```text
15. CLIENTES
```

```text
16. VENTAS
```

```text
17. DETALLE DE VENTAS
```

```text
18. PAGOS DE CLIENTES
```

```text
19. GASTOS
```

Este orden debe ajustarse únicamente cuando una dependencia técnica o una relación validada exija otro orden.

---

# 11. Implementación de entidades maestras

Las primeras entidades deben corresponder a los datos que sirven como referencia para otros procesos.

Entre ellas:

```text
Presentaciones
```

```text
Insumos
```

```text
Proveedores
```

```text
Productos
```

```text
Clientes
```

Estas entidades deben implementarse antes de los procesos que dependan de ellas.

Conceptualmente:

```text
MAESTROS
    ↓
CONFIGURACIÓN DEL NEGOCIO
    ↓
OPERACIONES
```

---

# 12. Presentaciones

La implementación de `Presentation` debe respetar los atributos definidos en la documentación de dominio y modelo de datos.

Su implementación debe representar una entidad persistente independiente.

No debe duplicarse la información de presentación dentro de productos, ventas o producción como sustituto de una relación.

Las relaciones deben utilizarse conforme al modelo validado.

---

# 13. Insumos

La entidad de insumos debe representar el catálogo definido para los materiales o ingredientes utilizados por el sistema.

Debe permitir su relación con:

```text
proveedores
```

cuando corresponda mediante la estructura definida para precios.

```text
recetas
```

mediante los detalles de receta.

```text
compras
```

mediante detalle de compras.

```text
inventario
```

según la estructura validada.

El modelo Prisma no debe fusionar estos conceptos en una única tabla genérica.

---

# 14. Proveedores y precios

La información de proveedores y los precios asociados deben mantenerse separados cuando esa separación exista en el modelo validado.

La relación conceptual será:

```text
PROVEEDOR
    │
    └──< PRECIOS >── INSUMO
```

La implementación debe permitir que el precio corresponda a una combinación específica definida por el modelo.

No debe reemplazarse esta estructura por un único campo:

```text
precioProveedor
```

dentro del insumo si eso elimina la trazabilidad de proveedores y precios.

---

# 15. Productos y presentaciones

Los productos deben mantener su relación con la presentación según el modelo validado.

Conceptualmente:

```text
PRODUCTO
    │
    └── PRESENTACIÓN
```

La presentación no debe copiarse como texto dentro del producto cuando ya existe una entidad relacionada.

Los atributos de identificación y negocio deben seguir la documentación aprobada.

---

# 16. Recetas y detalle de recetas

La receta debe implementarse como entidad independiente.

Su composición debe representarse mediante una entidad de detalle.

Conceptualmente:

```text
RECETA
    │
    └──< DETALLE_RECETA >── INSUMO
```

Esto permite conservar:

* cantidades;
* unidades;
* composición;
* relación entre receta e insumos.

No debe almacenarse la receta como:

```text
JSON
```

o:

```text
texto libre
```

si el modelo validado ya define una estructura relacional.

---

# 17. Compras y detalle de compras

Las compras deben representar una operación independiente.

Su contenido debe persistirse mediante detalle de compra.

Conceptualmente:

```text
COMPRA
    │
    └──< DETALLE_COMPRA >── INSUMO
```

La información de la compra no debe depender exclusivamente del precio actual de un insumo o proveedor.

Los datos necesarios para preservar la operación histórica deben mantenerse según las reglas de trazabilidad definidas.

---

# 18. Inventario

La implementación del inventario debe respetar la separación existente entre:

```text
ESTADO ACTUAL
```

y:

```text
HISTORIAL DE MOVIMIENTOS
```

Cuando el modelo validado utilice ambas estructuras, no deben fusionarse.

Conceptualmente:

```text
OPERACIÓN
    │
    ↓
MOVIMIENTO DE INVENTARIO
    │
    ↓
ACTUALIZACIÓN DEL ESTADO
```

El historial de movimientos representa trazabilidad.

El inventario representa disponibilidad o estado actual según la definición aprobada.

---

# 19. Movimientos de inventario

Cada movimiento debe conservar la información necesaria para identificar:

```text
qué cambió
```

```text
cuánto cambió
```

```text
cuándo ocurrió
```

```text
por qué ocurrió
```

```text
qué operación lo originó
```

Los campos concretos deben respetar el modelo ya documentado.

No debe eliminarse el historial para depender únicamente de un saldo acumulado.

---

# 20. Producción y detalle de producción

La producción representa una operación independiente.

Su estructura debe permitir registrar los elementos definidos por el modelo de negocio.

Conceptualmente:

```text
PRODUCCIÓN
    │
    └──< DETALLE_PRODUCCIÓN
```

La implementación debe permitir mantener la relación entre una producción y sus resultados o componentes según la estructura validada.

Las operaciones de producción pueden requerir transacciones.

El schema debe permitir que las relaciones necesarias puedan persistirse de forma consistente.

---

# 21. Lotes

Los lotes deben conservar su identidad y trazabilidad.

Como mínimo, la implementación debe respetar los conceptos ya definidos para:

```text
identificación del lote
```

```text
fecha de creación
```

```text
fecha de vencimiento
```

y su relación con el proceso que los genera.

La relación conceptual será:

```text
PRODUCCIÓN
    │
    └── LOTE
```

o la relación equivalente definida en el modelo validado.

La fecha de creación del lote y la fecha de vencimiento deben persistirse como datos propios del lote para garantizar trazabilidad histórica.

No deben calcularse únicamente en tiempo de consulta a partir de configuraciones actuales.

---

# 22. Clientes

Los clientes deben implementarse como una entidad independiente.

Su información debe utilizarse mediante relaciones en operaciones como:

```text
ventas
```

```text
pagos
```

cuando corresponda al modelo definido.

No debe duplicarse innecesariamente la información maestra del cliente en cada operación.

Los datos históricos específicos de una operación deben conservarse según las reglas de trazabilidad aprobadas.

---

# 23. Ventas y detalle de ventas

Las ventas deben implementarse mediante una entidad principal y una estructura de detalle.

Conceptualmente:

```text
CLIENTE
    │
    └──< VENTA
             │
             └──< DETALLE_VENTA
```

Cada detalle debe conservar la relación necesaria con el producto, lote u otra entidad definida por el modelo.

No debe reducirse una venta a un único registro si la estructura validada contempla múltiples elementos.

---

# 24. Pagos de clientes

Los pagos deben mantenerse como operaciones independientes de las ventas cuando así esté definido en el modelo.

Conceptualmente:

```text
CLIENTE
    │
    └──< PAGOS
```

y su relación con ventas debe implementarse únicamente según la estructura documentada.

No debe suponerse automáticamente una relación:

```text
1 PAGO = 1 VENTA
```

si el modelo validado permite otro comportamiento.

La cardinalidad definitiva debe seguir `02-relationships.md`.

---

# 25. Gastos

Los gastos deben implementarse como una entidad funcional independiente.

No deben mezclarse automáticamente con:

```text
compras
```

o:

```text
costos
```

aunque puedan participar posteriormente en cálculos.

La separación conceptual debe mantenerse:

```text
COMPRA
    ↓
OPERACIÓN DE ABASTECIMIENTO
```

```text
GASTO
    ↓
SALIDA O REGISTRO DE GASTO
```

```text
COSTO
    ↓
RESULTADO O VALOR CALCULADO
SEGÚN LA RESPONSABILIDAD DEFINIDA
```

---

# 26. Costos y rentabilidad

No debe crearse una entidad persistente para cada cálculo simplemente porque exista un módulo funcional de:

```text
costos
```

o:

```text
rentabilidad
```

La decisión de persistir resultados calculados debe seguir:

```text
docs/data-model/09-calculation-responsibilities.md
```

La regla será:

```text
SI UN VALOR ES DERIVADO
    ↓
NO SE PERSISTE AUTOMÁTICAMENTE
```

Solo debe almacenarse si existe una razón explícita relacionada con:

* historial;
* trazabilidad;
* rendimiento;
* congelamiento de un valor histórico;
* decisión funcional documentada.

---

# 27. Tipos de identificadores

Los identificadores técnicos deben definirse de forma consistente.

La decisión concreta debe respetar lo establecido en:

```text
docs/data-model/05-data-model-decisions.md
```

El sistema debe diferenciar entre:

```text
IDENTIFICADOR TÉCNICO
```

y:

```text
CÓDIGO FUNCIONAL
```

Ejemplo conceptual:

```text
id
```

puede representar la identidad técnica interna.

Mientras que:

```text
codigo
```

puede representar una identificación utilizada por el negocio.

No deben confundirse ambas responsabilidades.

---

# 28. Campos obligatorios y opcionales

Prisma debe reflejar correctamente la obligatoriedad del modelo.

La decisión no debe basarse en conveniencia del formulario o del endpoint.

El proceso será:

```text
DOCUMENTO DEL MODELO
        ↓
¿EL DATO ES OBLIGATORIO?
        ↓
SÍ → CAMPO REQUIRED
NO → CAMPO OPTIONAL
```

No deben marcarse campos como opcionales únicamente para facilitar la creación inicial de registros.

---

# 29. Relaciones obligatorias y opcionales

La nulabilidad de una relación debe reflejar el modelo real.

Ejemplo conceptual:

```text
Una venta requiere cliente
```

si esa es una regla del modelo, debe implementarse como relación obligatoria.

No debe convertirse en opcional para facilitar operaciones técnicas.

Del mismo modo, una relación histórica que pueda desaparecer no debe utilizar una estrategia de eliminación que destruya la trazabilidad.

---

# 30. Restricciones de unicidad

Las restricciones únicas deben implementarse cuando correspondan al modelo.

Ejemplos potenciales:

```text
código único
```

```text
identificador único
```

```text
combinación proveedor + insumo
```

cuando represente una relación única validada.

La restricción debe existir tanto en la lógica de aplicación como, cuando corresponda, en la base de datos.

El principio será:

```text
VALIDACIÓN DE APLICACIÓN
        +
RESTRICCIÓN DE BASE DE DATOS
        =
MAYOR INTEGRIDAD
```

---

# 31. Índices

Los índices no deben añadirse indiscriminadamente.

Inicialmente deben considerarse índices sobre:

```text
foreign keys utilizadas frecuentemente
```

```text
campos de búsqueda habituales
```

```text
códigos funcionales
```

```text
fechas utilizadas en consultas frecuentes
```

```text
campos utilizados para trazabilidad
```

La necesidad de un índice debe estar relacionada con una consulta real o una relación frecuente.

No se debe optimizar prematuramente.

---

# 32. Precisión numérica

Las cantidades y valores monetarios no deben depender de `Float` cuando pueda producir errores de precisión incompatibles con el dominio.

Los valores que representen:

```text
dinero
```

```text
costos
```

```text
precios
```

deben utilizar un tipo decimal adecuado.

Las cantidades deben definirse según la precisión necesaria para:

```text
unidades
```

```text
gramos
```

```text
mililitros
```

u otras unidades utilizadas por el sistema.

La precisión definitiva debe definirse antes de consolidar el schema.

---

# 33. Fechas y tiempo

Las fechas deben representar correctamente el significado funcional documentado.

Deben diferenciarse conceptos como:

```text
fecha de compra
```

```text
fecha de registro
```

```text
fecha de producción
```

```text
fecha de creación del lote
```

```text
fecha de vencimiento
```

No deben utilizarse indistintamente.

Cada fecha debe existir porque representa un hecho específico.

---

# 34. Campos de creación y actualización

Los campos técnicos como:

```text
createdAt
```

```text
updatedAt
```

pueden utilizarse para auditoría técnica.

Sin embargo, no sustituyen las fechas funcionales.

Ejemplo:

```text
createdAt
```

no reemplaza automáticamente:

```text
fechaCompra
```

ni:

```text
fechaProduccion
```

ni:

```text
fechaVencimiento
```

La regla será:

```text
FECHA TÉCNICA
≠
FECHA DE NEGOCIO
```

---

# 35. Eliminación de registros

La estrategia de eliminación debe respetar la integridad y trazabilidad.

No se debe aplicar:

```text
CASCADE
```

indiscriminadamente.

Antes de definir una acción referencial se debe analizar:

```text
¿EL REGISTRO TIENE HISTORIAL?
```

```text
¿OTRAS OPERACIONES DEPENDEN DE ÉL?
```

```text
¿ELIMINARLO ROMPE LA TRAZABILIDAD?
```

Cuando la eliminación física pueda destruir historial, debe utilizarse una estrategia compatible con el modelo.

---

# 36. Soft Delete

No se implementará `soft delete` automáticamente en todas las entidades.

Solo debe utilizarse cuando exista una necesidad funcional o de trazabilidad documentada.

Agregar:

```text
deletedAt
```

a todas las tablas por defecto introduce complejidad innecesaria.

La regla será:

```text
SOFT DELETE
SOLO CUANDO EL MODELO
LO JUSTIFIQUE
```

---

# 37. Enums

Los `enum` de Prisma deben utilizarse únicamente cuando representen conjuntos relativamente estables.

Ejemplos posibles:

```text
estados
```

```text
tipos
```

```text
categorías cerradas
```

No debe utilizarse un `enum` cuando el valor corresponda realmente a:

```text
un catálogo administrable
```

En ese caso debe utilizarse una entidad o estructura de configuración si el modelo así lo requiere.

---

# 38. Migraciones

Cada modificación estructural debe realizarse mediante una migración.

El flujo será:

```text
MODIFICAR schema.prisma
        ↓
REVISAR CAMBIO
        ↓
GENERAR MIGRACIÓN
        ↓
INSPECCIONAR SQL
        ↓
EJECUTAR
        ↓
VALIDAR BASE DE DATOS
```

No deben realizarse cambios manuales en producción que luego no estén representados en las migraciones.

---

# 39. Nombres de migraciones

Las migraciones deben tener nombres descriptivos.

Ejemplos:

```text
init_database
```

```text
add_presentations_and_products
```

```text
add_recipes_and_recipe_details
```

```text
add_purchases_and_purchase_details
```

No deben utilizarse nombres ambiguos como:

```text
update
```

```text
fix
```

```text
changes
```

La migración debe permitir comprender qué modificación estructural introdujo.

---

# 40. Primera migración

La primera migración no debe contener automáticamente todo el sistema si todavía existen dudas sobre la traducción del modelo.

La estrategia recomendada será construir primero un bloque coherente.

Por ejemplo:

```text
CONFIGURACIÓN BASE
        ↓
PRESENTACIONES
        ↓
INSUMOS
        ↓
PROVEEDORES
        ↓
PRECIOS DE PROVEEDORES
        ↓
PRODUCTOS
```

Después de validar este bloque:

```text
MIGRACIÓN
```

Luego se continúa con el siguiente conjunto.

Esto permite detectar errores de interpretación antes de que todo el schema sea demasiado grande.

---

# 41. Validación posterior a cada bloque

Después de cada migración deben verificarse:

```text
1. TABLAS CREADAS
```

```text
2. COLUMNAS
```

```text
3. TIPOS
```

```text
4. NULLABILITY
```

```text
5. FOREIGN KEYS
```

```text
6. UNIQUE CONSTRAINTS
```

```text
7. ÍNDICES
```

```text
8. ACCIONES REFERENCIALES
```

La validación no debe limitarse a comprobar que:

```text
prisma migrate
```

finalizó correctamente.

Una migración puede ejecutarse correctamente y aun así representar incorrectamente el modelo.

---

# 42. Prisma Service

La integración inicial con NestJS utilizará un servicio centralizado de Prisma.

Conceptualmente:

```text
database/
│
├── database.module.js
│
└── prisma.service.js
```

La responsabilidad de `PrismaService` será proporcionar acceso controlado al cliente.

No debe convertirse en un lugar para implementar reglas de negocio.

Ejemplo conceptual:

```text
PrismaService
    ↓
CONEXIÓN Y CICLO DE VIDA
```

No:

```text
PrismaService
    ↓
LÓGICA DE COMPRAS
VENTAS
PRODUCCIÓN
INVENTARIO
```

---

# 43. Acceso desde los módulos

Los módulos accederán a Prisma respetando las fronteras de persistencia definidas.

El patrón exacto puede evolucionar, pero debe mantenerse esta regla:

```text
EL MÓDULO
CONTROLA SU ACCESO
A SUS DATOS
```

No debe existir un único servicio global con métodos como:

```text
createProduct()
```

```text
registerSale()
```

```text
registerPurchase()
```

dentro de la capa técnica de Prisma.

La infraestructura proporciona acceso.

El módulo define la operación.

---

# 44. Repositorios

No se creará una capa universal de repositorios por obligación.

La decisión será evaluada por módulo.

Un repositorio puede justificarse cuando:

```text
encapsula consultas complejas
```

```text
reduce acoplamiento con Prisma
```

```text
representa claramente una frontera de persistencia
```

No debe crearse simplemente porque la arquitectura utiliza Prisma.

---

# 45. Transacciones con Prisma

Las operaciones que afecten múltiples estructuras relacionadas deben utilizar límites transaccionales cuando sea necesario.

Ejemplo conceptual:

```text
REGISTRAR COMPRA
        │
        ├── CREAR COMPRA
        │
        ├── CREAR DETALLES
        │
        └── REGISTRAR MOVIMIENTOS
```

Si todas esas operaciones deben ocurrir juntas:

```text
BEGIN
    ↓
OPERACIONES
    ↓
COMMIT
```

Si una falla:

```text
ROLLBACK
```

La decisión debe seguir:

```text
docs/backend/05-transaction-boundaries.md
```

---

# 46. Operaciones críticas

Inicialmente deben identificarse como candidatas a transacción las operaciones relacionadas con:

```text
compras
```

```text
movimientos de inventario
```

```text
producción
```

```text
creación de lotes
```

```text
ventas
```

```text
pagos
```

La implementación concreta dependerá de las reglas de cada caso de uso.

No todas las operaciones CRUD requieren una transacción explícita.

---

# 47. Integridad entre aplicación y base de datos

La base de datos debe proteger la integridad estructural.

La aplicación debe proteger la integridad de negocio.

Conceptualmente:

```text
BASE DE DATOS
    ↓
EXISTENCIA
RELACIONES
UNICIDAD
RESTRICCIONES ESTRUCTURALES
```

```text
APLICACIÓN
    ↓
REGLAS DE NEGOCIO
ESTADOS
VALIDACIONES CONTEXTUALES
```

Una capa no sustituye completamente a la otra.

---

# 48. Validación del schema

Antes de considerar un bloque terminado deben ejecutarse verificaciones equivalentes a:

```text
PRISMA VALIDATE
```

```text
PRISMA GENERATE
```

y las pruebas necesarias sobre las operaciones implementadas.

La validación debe confirmar:

```text
EL SCHEMA ES VÁLIDO
```

y también:

```text
EL SCHEMA REPRESENTA
CORRECTAMENTE EL MODELO
```

---

# 49. Datos de prueba y seed

Los datos iniciales no deben confundirse con datos obligatorios del sistema.

Solo deben crearse mecanismos de seed cuando exista una necesidad concreta.

Pueden utilizarse para:

```text
entorno de desarrollo
```

```text
pruebas
```

```text
configuración inicial documentada
```

No deben introducirse registros ficticios como parte permanente del modelo productivo.

---

# 50. Datos maestros iniciales

Si algunos datos deben existir antes de operar el sistema, deben identificarse explícitamente.

Por ejemplo:

```text
configuración inicial
```

o catálogos cerrados definidos por el negocio.

No se debe asumir que todos los módulos requieren datos precargados.

Cada caso debe documentarse.

---

# 51. Estrategia de pruebas de persistencia

La implementación debe probar, como mínimo:

```text
CREACIÓN CORRECTA
```

```text
RELACIONES
```

```text
RESTRICCIONES
```

```text
UNICIDAD
```

```text
TRANSACCIONES CRÍTICAS
```

```text
COMPORTAMIENTO ANTE ERRORES
```

Las pruebas deben ejecutarse sobre una base de datos controlada para pruebas.

No deben depender de una base de desarrollo manualmente configurada.

---

# 52. Validación contra el modelo documentado

Cada bloque implementado debe compararse contra los documentos correspondientes.

Ejemplo:

```text
PRESENTACIONES
        ↓
01-presentations.md
```

```text
PRODUCTOS
        ↓
04-products.md
```

```text
RELACIONES
        ↓
02-relationships.md
```

```text
INTEGRIDAD
        ↓
03-data-integrity-rules.md
```

```text
TRAZABILIDAD
        ↓
04-history-and-traceability.md
```

El objetivo es detectar diferencias antes de continuar con el siguiente bloque.

---

# 53. Control de cambios del schema

Cada modificación posterior debe responder a una de estas situaciones:

```text
CORRECCIÓN DE IMPLEMENTACIÓN
```

```text
DECISIÓN ARQUITECTÓNICA NUEVA
```

```text
NUEVA NECESIDAD FUNCIONAL
```

```text
CAMBIO DE REQUISITO
```

No deben realizarse modificaciones estructurales sin registrar su motivo.

Cuando un cambio afecte el modelo, la documentación correspondiente también debe revisarse.

---

# 54. Proceso ante una ambigüedad

Si durante la implementación aparece una ambigüedad, no debe resolverse automáticamente mediante una decisión técnica.

El proceso será:

```text
AMBIGÜEDAD DETECTADA
        ↓
IDENTIFICAR DOCUMENTOS RELACIONADOS
        ↓
REVISAR MODELO VALIDADO
        ↓
REVISAR FIDELIDAD AL SISTEMA MAESTRO
        ↓
DETERMINAR SI EXISTE DECISIÓN DOCUMENTADA
```

Si no existe:

```text
NO INVENTAR
```

La ambigüedad debe documentarse como decisión pendiente.

---

# 55. Proceso de corrección

Cuando se detecte que Prisma contradice el modelo:

```text
DETENER IMPLEMENTACIÓN DEL BLOQUE
        ↓
IDENTIFICAR DIFERENCIA
        ↓
DETERMINAR FUENTE CORRECTA
        ↓
ACTUALIZAR MODELO O IMPLEMENTACIÓN
        ↓
GENERAR MIGRACIÓN CORRECTIVA
        ↓
VALIDAR
```

No se debe continuar acumulando diferencias.

---

# 56. Criterios de finalización

La implementación inicial de Prisma se considerará preparada cuando:

```text
1. EL SCHEMA REPRESENTE
LAS ENTIDADES DEFINIDAS.
```

```text
2. LAS RELACIONES ESTÉN
IMPLEMENTADAS CORRECTAMENTE.
```

```text
3. LAS RESTRICCIONES
IMPORTANTES EXISTAN.
```

```text
4. LA TRAZABILIDAD DEFINIDA
PUEDA PERSISTIRSE.
```

```text
5. LAS MIGRACIONES
PUEDAN REPRODUCIR LA BASE
DESDE CERO.
```

```text
6. LAS OPERACIONES
TRANSACCIONALES CRÍTICAS
PUEDAN IMPLEMENTARSE.
```

```text
7. NO EXISTAN ENTIDADES
INTRODUCIDAS SIN JUSTIFICACIÓN.
```

```text
8. EL MODELO PRISMA
SEA CONSISTENTE CON
LA DOCUMENTACIÓN VALIDADA.
```

---

# 57. Orden de ejecución de este plan

La implementación práctica seguirá esta secuencia:

```text
FASE 1
CONFIGURAR PRISMA (COMPLETADA)
```

```text
FASE 2
CONFIGURAR POSTGRESQL (COMPLETADA)
```

```text
FASE 3
VALIDAR CONEXIÓN (COMPLETADA)
```

```text
FASE 4
IMPLEMENTAR ENTIDADES MAESTRAS
```

```text
FASE 5
IMPLEMENTAR RELACIONES BASE
```

```text
FASE 6
GENERAR Y VALIDAR MIGRACIONES (COMPLETADA)
```

```text
FASE 7
IMPLEMENTAR OPERACIONES DE COMPRA
E INVENTARIO (COMPLETADA)
```

```text
FASE 8
IMPLEMENTAR RECETAS
Y PRODUCCIÓN
```

```text
FASE 9
IMPLEMENTAR LOTES
Y TRAZABILIDAD (COMPLETADA)
```

```text
FASE 10
IMPLEMENTAR CLIENTES
Y VENTAS (COMPLETADA)
```

```text
FASE 11
IMPLEMENTAR PAGOS
Y GASTOS (COMPLETADA)
```

```text
FASE 12
VALIDAR EL MODELO COMPLETO (COMPLETADA)
```

---

# 58. Decisión arquitectónica

Para V1 se adopta la siguiente estrategia:

```text
UN SOLO SCHEMA PRISMA
```

```text
IMPLEMENTACIÓN PROGRESIVA
POR BLOQUES COHERENTES
```

```text
MIGRACIONES CONTROLADAS
```

```text
VALIDACIÓN DESPUÉS
DE CADA BLOQUE
```

```text
PRISMA COMO
CAPA DE PERSISTENCIA
```

```text
REGLAS DE NEGOCIO
FUERA DE PRISMA
```

```text
NINGUNA ENTIDAD NUEVA
SIN JUSTIFICACIÓN DOCUMENTADA
```

---

# 59. Restricción fundamental

Durante la implementación queda prohibido utilizar Prisma como excusa para modificar silenciosamente el modelo.

La regla definitiva será:

```text
SI EL MODELO
Y PRISMA
NO COINCIDEN

NO SE MODIFICA
AUTOMÁTICAMENTE
EL MODELO

SE INVESTIGA
LA DIFERENCIA
```

Primero se determina cuál es la fuente correcta.

Después se documenta la decisión.

Solo entonces se modifica:

```text
DOCUMENTACIÓN
```

o:

```text
IMPLEMENTACIÓN
```

---

# 60. Estado del documento

```text
Documento:
05-prisma-implementation-plan.md

Versión:
V1

Estado:
DEFINIDO PARA IMPLEMENTACIÓN

Objetivo:
IMPLEMENTAR EL MODELO DE DATOS
EN POSTGRESQL MEDIANTE PRISMA
SIN CONTRADECIR EL MODELO VALIDADO

Principio principal:
PRISMA IMPLEMENTA EL MODELO;
NO LO REDISEÑA

