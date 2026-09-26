# 08 — CROSS-MODULE RULES

## 1. Propósito del documento

Este documento define las reglas que deben respetarse cuando una operación involucra información, responsabilidades o consecuencias en más de un módulo.

Su objetivo es evitar que los módulos funcionen como partes aisladas del sistema o que un módulo invada responsabilidades que pertenecen a otro.

Las reglas definidas aquí establecen:

* qué información puede ser utilizada entre módulos;
* qué módulo es propietario de cada tipo de información;
* qué módulos pueden generar consecuencias sobre otros;
* cómo deben mantenerse las referencias entre procesos;
* qué módulos no pueden modificar información ajena directamente;
* qué reglas deben respetarse para mantener la consistencia del sistema.

Este documento debe leerse junto con:

```text
00-data-model-overview.md
01-entities.md
02-relationships.md
03-data-integrity-rules.md
04-history-and-traceability.md
05-data-model-decisions.md
06-inventory-flow.md
07-business-processes.md
```

---

# 2. Principio general de propiedad de la información

Cada módulo es responsable de su propia información y de las operaciones que pertenecen a su dominio.

La regla general es:

```text
UN DATO
        ↓
TIENE UN MÓDULO RESPONSABLE
```

Por ejemplo:

```text
Presentaciones
        ↓
Presentations

Insumos
        ↓
Supplies

Proveedores
        ↓
Suppliers

Productos
        ↓
Products

Recetas
        ↓
Recipes

Compras
        ↓
Purchases

Movimientos y disponibilidad
de inventario
        ↓
Inventory

Producciones
        ↓
Production

Lotes
        ↓
Lots

Clientes
        ↓
Clients

Ventas
        ↓
Sales

Pagos
        ↓
Payments

Gastos
        ↓
Expenses

Cálculos de costos
        ↓
Costs

Análisis económico
        ↓
Profitability

Indicadores y visualización
        ↓
Dashboard
```

Un módulo puede utilizar información perteneciente a otro módulo, pero eso no significa que pueda asumir su responsabilidad.

---

# 3. Regla de consulta entre módulos

Un módulo puede necesitar consultar información producida por otro.

Ejemplo:

```text
Production
        ↓
Consulta
        ↓
Recipes
```

Otro ejemplo:

```text
Sales
        ↓
Consulta
        ↓
Inventory
```

La consulta de información no transfiere la propiedad del dato.

Por tanto:

```text
Sales
```

puede consultar disponibilidad de inventario, pero no se convierte en propietario del inventario.

La regla es:

> **Consultar información de otro módulo no autoriza a modificar directamente la responsabilidad interna de ese módulo.**

---

# 4. Regla de modificación entre módulos

Un módulo no debe modificar arbitrariamente la información que pertenece a otro módulo.

Incorrecto conceptualmente:

```text
Sales
        ↓
Modifica directamente
        ↓
Inventario
```

La relación correcta es:

```text
Venta confirmada
        ↓
Consecuencia definida
        ↓
Inventory registra
la salida correspondiente
```

Lo mismo aplica a otros procesos.

```text
Purchase
        ↓
No administra directamente
todo el inventario
```

La compra representa la operación comercial de adquisición.

La consecuencia sobre existencias corresponde al dominio de inventario.

---

# 5. Regla de origen y consecuencia

Los procesos deben distinguir entre:

```text
ORIGEN
```

y:

```text
CONSECUENCIA
```

Ejemplo:

```text
COMPRA
        ↓
Origen de la operación
```

```text
ENTRADA DE INVENTARIO
        ↓
Consecuencia
```

Otro ejemplo:

```text
PRODUCCIÓN CONFIRMADA
        ↓
Origen
```

```text
SALIDA DE INSUMOS
        ↓
Consecuencia
```

y:

```text
ENTRADA DE PRODUCTO TERMINADO
        ↓
Consecuencia
```

Otro ejemplo:

```text
VENTA CONFIRMADA
        ↓
Origen
```

```text
SALIDA DE INVENTARIO
        ↓
Consecuencia
```

La consecuencia debe poder relacionarse con la operación que la originó.

---

# 6. Regla de trazabilidad entre módulos

Cuando una operación de un módulo produzca una consecuencia en otro, debe existir una relación identificable entre ambas.

Conceptualmente:

```text
COMPRA
        │
        └──→ MOVIMIENTO DE INVENTARIO
```

```text
PRODUCCIÓN
        │
        ├──→ SALIDA DE INSUMOS
        │
        ├──→ LOTE
        │
        └──→ ENTRADA DE PRODUCTO TERMINADO
```

```text
VENTA
        │
        └──→ SALIDA DE INVENTARIO
```

La trazabilidad debe permitir responder:

```text
¿Por qué ocurrió este movimiento?
```

y:

```text
¿De qué operación proviene este registro?
```

No deben existir consecuencias históricas importantes sin una causa identificable.

---

# 7. Regla de datos maestros y operaciones

Los módulos de datos maestros proporcionan información para los procesos operativos.

La relación general es:

```text
DATOS MAESTROS
        ↓
OPERACIONES
```

Los principales datos maestros incluyen:

```text
Presentaciones

Insumos

Proveedores

Productos

Clientes
```

Las operaciones incluyen:

```text
Compras

Producción

Lotes

Ventas

Pagos

Gastos
```

Una operación puede utilizar un dato maestro, pero la operación histórica no debe depender únicamente del estado actual de ese dato maestro para poder interpretarse en el futuro.

Por ejemplo:

```text
Un proveedor cambia su nombre
```

Eso no debe destruir la capacidad de identificar las compras históricas realizadas.

La relación histórica debe conservar su referencia correspondiente.

---

# 8. Regla de disponibilidad

Los módulos que necesitan utilizar recursos disponibles deben consultar el estado correspondiente antes de confirmar la operación.

Ejemplo:

```text
Production
        ↓
Consulta disponibilidad
        ↓
Inventory
```

Otro ejemplo:

```text
Sales
        ↓
Consulta disponibilidad
        ↓
Inventory / Lots
```

La operación no debe confirmar una consecuencia que contradiga las reglas de disponibilidad.

Ejemplo:

```text
Cantidad requerida
>
Cantidad disponible
```

Si no existe una regla explícita que permita continuar, la operación no debe confirmarse.

---

# 9. Regla de receta y producción

El módulo:

```text
Recipes
```

es responsable de definir cómo se compone una receta.

El módulo:

```text
Production
```

es responsable de registrar la ejecución de una producción.

Por tanto:

```text
RECETA
        ≠
PRODUCCIÓN
```

La receta define:

```text
Qué se necesita.
```

La producción registra:

```text
Qué se utilizó realmente.
```

Una modificación posterior de la receta no debe reinterpretar automáticamente una producción histórica.

La producción debe conservar la información necesaria para mantener su trazabilidad histórica.

---

# 10. Regla de producción y lotes

La producción y el lote son responsabilidades relacionadas, pero no equivalentes.

```text
PRODUCCIÓN
        ↓
Proceso de transformación
```

```text
LOTE
        ↓
Unidad identificable del resultado
```

Una producción confirmada puede originar el registro de uno o varios lotes si la lógica definitiva del proceso lo requiere.

La arquitectura no debe asumir que:

```text
1 Producción
=
Siempre exactamente 1 lote
```

a menos que esa restricción sea definida explícitamente como una regla del negocio.

El sistema debe conservar la relación entre el lote y la producción que le dio origen.

---

# 11. Regla de lotes e inventario

El módulo:

```text
Lots
```

es responsable de la identidad, fechas y trazabilidad del lote.

El módulo:

```text
Inventory
```

es responsable del registro y disponibilidad de existencias.

Por tanto:

```text
LOTES
        ≠
INVENTARIO
```

Un lote puede existir históricamente aunque:

```text
Su existencia disponible sea cero.
```

El lote no desaparece cuando se agota.

La disponibilidad puede cambiar.

La trazabilidad permanece.

---

# 12. Regla de vencimiento

La fecha de vencimiento pertenece al contexto del lote.

El proceso de ventas debe respetar esa información.

Conceptualmente:

```text
Sales
        ↓
Consulta lote
        ↓
Verifica vencimiento
```

Un lote vencido no debe considerarse disponible para una venta normal.

El vencimiento no elimina:

```text
El lote

La producción

Los movimientos históricos

Las ventas históricas
```

La condición de vencimiento afecta la disponibilidad operativa, no la existencia histórica del registro.

---

# 13. Regla de compras e inventario

Una compra representa una operación de adquisición.

El inventario representa las consecuencias sobre existencias.

La secuencia correcta es:

```text
COMPRA
        ↓
CONFIRMACIÓN
        ↓
ENTRADA DE INVENTARIO
```

Una compra que todavía no produce una consecuencia definitiva no debe incrementar automáticamente las existencias.

La relación entre:

```text
Compra

Detalle de compra

Movimiento de inventario
```

debe permitir rastrear el origen de las entradas correspondientes.

---

# 14. Regla de ventas e inventario

Una venta confirmada puede generar una salida de inventario.

La secuencia conceptual es:

```text
VENTA
        ↓
VALIDAR DISPONIBILIDAD
        ↓
CONFIRMAR
        ↓
REGISTRAR SALIDA
```

La venta no debe reducir disponibilidad antes de cumplir las condiciones necesarias para ser confirmada.

La salida debe poder relacionarse con:

```text
Venta

Detalle de venta

Producto

Lote, cuando corresponda
```

---

# 15. Regla de ventas y lotes

Cuando el control del producto requiera trazabilidad por lote, la venta debe poder identificar el lote del cual proviene el producto vendido.

Esto permite conservar la relación:

```text
PRODUCCIÓN
        ↓
LOTE
        ↓
VENTA
```

La venta histórica debe poder responder:

```text
¿Qué producto fue vendido?

¿De qué lote provino?

¿Cuándo fue producido?

¿Cuál era su fecha de vencimiento?
```

Esta información debe conservarse según las reglas de trazabilidad establecidas.

---

# 16. Regla de ventas y clientes

El módulo:

```text
Clients
```

es responsable de la información del cliente.

El módulo:

```text
Sales
```

es responsable de la operación comercial.

Por tanto:

```text
CLIENTE
        ↓
Puede participar en
        ↓
VENTA
```

Pero una venta no debe convertirse en propietaria de la gestión general del cliente.

Modificar información del cliente no debe requerir modificar las ventas históricas.

---

# 17. Regla de ventas y pagos

Una venta y un pago representan responsabilidades diferentes.

```text
VENTA
        ↓
Genera obligación comercial
```

```text
PAGO
        ↓
Registra cumplimiento total o parcial
```

Por tanto:

```text
VENTA
        ≠
PAGO
```

Una venta puede existir sin un pago registrado.

Una venta puede tener varios pagos.

El módulo Payments no debe crear una nueva venta para registrar un pago.

La relación debe mantenerse mediante una referencia clara entre:

```text
Pago
        ↓
Venta correspondiente
```

---

# 18. Regla de pagos y saldo

El saldo de una venta depende de la relación entre:

```text
Valor de la venta
        -
Pagos registrados
        =
Saldo pendiente
```

La definición exacta de esta responsabilidad será desarrollada en:

```text
09-calculation-responsibilities.md
```

El módulo de pagos registra hechos históricos.

No debe alterar arbitrariamente el valor original de una venta para representar un pago.

---

# 19. Regla de precios de proveedores y compras

El precio registrado en:

```text
Suppliers / precios de referencia
```

puede servir para consulta y comparación.

Pero una compra debe conservar:

```text
El valor realmente pagado.
```

Por tanto:

```text
PRECIO ACTUAL DEL PROVEEDOR
        ≠
PRECIO HISTÓRICO DE LA COMPRA
```

Modificar un precio de referencia no debe modificar automáticamente compras anteriores.

---

# 20. Regla de costos y operaciones

El módulo Costs puede utilizar información procedente de:

```text
Compras

Insumos

Recetas

Producción

Productos

Inventario
```

Pero Costs no debe convertirse en propietario de esas operaciones.

El flujo correcto es:

```text
OPERACIÓN REGISTRADA
        ↓
INFORMACIÓN DISPONIBLE
        ↓
COSTOS ANALIZA O CALCULA
```

El cálculo de costos no debe modificar la compra, receta o producción original únicamente para almacenar un resultado analítico.

---

# 21. Regla de gastos y rentabilidad

El módulo:

```text
Expenses
```

registra hechos económicos relacionados con gastos.

El módulo:

```text
Profitability
```

utiliza esos datos para realizar análisis.

Por tanto:

```text
GASTO
        ↓
Dato de origen
```

```text
RENTABILIDAD
        ↓
Análisis derivado
```

El módulo de rentabilidad no debe ser propietario del gasto original.

---

# 22. Regla de ventas, costos y rentabilidad

La relación conceptual es:

```text
VENTAS
        ↓
INGRESOS
```

```text
COSTOS
        ↓
COSTO ASOCIADO
```

```text
GASTOS
        ↓
SALIDAS ECONÓMICAS
```

Estos elementos pueden ser utilizados por:

```text
PROFITABILITY
```

para generar análisis como:

```text
Ingresos

Costos

Gastos

Margen

Resultado
```

El módulo de rentabilidad debe trabajar sobre información producida por otros módulos.

No debe duplicar innecesariamente la propiedad de los datos originales.

---

# 23. Regla del dashboard

El dashboard es un consumidor de información.

Puede consultar:

```text
Compras

Inventario

Producción

Lotes

Ventas

Pagos

Gastos

Costos

Rentabilidad
```

Pero no debe convertirse en el origen de una operación de negocio.

No corresponde que el dashboard:

```text
Cree compras.

Modifique inventario.

Confirme producciones.

Registre pagos.

Altere ventas.
```

El dashboard puede dirigir al usuario hacia una operación, pero la ejecución de esa operación debe pertenecer al módulo responsable.

---

# 24. Regla de referencias entre módulos

Las relaciones entre módulos deben ser explícitas.

No deben depender de:

```text
Nombres

Descripciones

Texto libre

Coincidencias manuales
```

cuando exista una relación de negocio definida.

Ejemplo incorrecto:

```text
Buscar compras por el nombre escrito
del proveedor.
```

Ejemplo correcto conceptualmente:

```text
Compra
        ↓
Referencia
        ↓
Proveedor identificado
```

Las relaciones históricas deben utilizar identificadores o mecanismos equivalentes definidos en el modelo de datos.

---

# 25. Regla de desactivación

Cuando un dato maestro deja de utilizarse, no debe eliminarse automáticamente si existen operaciones históricas relacionadas.

Ejemplo:

```text
Producto
        ↓
Tiene producción y ventas históricas
```

No debe eliminarse simplemente porque ya no se venderá.

La regla general es:

```text
SIN HISTORIAL
        ↓
Puede evaluarse eliminación

CON HISTORIAL
        ↓
Preferir desactivación
```

La decisión final depende de las reglas específicas de cada entidad.

---

# 26. Regla de eliminación histórica

No debe permitirse que una operación destruya información histórica relacionada con otros módulos sin un procedimiento explícito.

Especialmente:

```text
Compras

Producciones

Lotes

Movimientos de inventario

Ventas

Pagos

Gastos
```

Estos registros representan hechos ocurridos.

Su corrección debe seguir mecanismos compatibles con la trazabilidad.

---

# 27. Regla de duplicación de responsabilidades

Un módulo no debe duplicar una responsabilidad que ya tiene propietario.

Ejemplo incorrecto:

```text
Sales
        ↓
Mantiene su propio inventario paralelo
```

o:

```text
Production
        ↓
Mantiene su propia lista independiente
de existencias de insumos
```

La arquitectura debe evitar:

```text
DOS FUENTES DE VERDAD
```

La regla es:

> **Cada información operativa debe tener una fuente principal de verdad claramente identificada.**

Otros módulos pueden consultar o utilizar esa información.

---

# 28. Regla de consistencia de consecuencias

Cuando una operación confirmada produzca consecuencias en varios módulos, el sistema debe tratar esas consecuencias como partes de la misma operación de negocio.

Ejemplo:

```text
PRODUCCIÓN CONFIRMADA
        │
        ├── Registrar producción
        │
        ├── Registrar detalle utilizado
        │
        ├── Registrar salida de insumos
        │
        ├── Crear lote
        │
        └── Registrar disponibilidad
            de producto terminado
```

No debe considerarse una producción correctamente completada si solo una parte de sus consecuencias quedó registrada de forma permanente.

La implementación técnica deberá definir el mecanismo necesario para garantizar la consistencia correspondiente.

---

# 29. Regla de independencia de módulos

La independencia de módulos no significa aislamiento absoluto.

Los módulos pueden colaborar.

La regla es:

```text
COLABORACIÓN
        ≠
INVASIÓN DE RESPONSABILIDADES
```

Ejemplo correcto:

```text
Sales
        ↓
Solicita validación
        ↓
Inventory
```

Ejemplo incorrecto:

```text
Sales
        ↓
Reimplementa internamente
toda la lógica de Inventory
```

---

# 30. Regla de evolución de relaciones

Si aparece una nueva necesidad entre módulos, no debe resolverse automáticamente creando dependencias directas sin revisar la arquitectura.

El procedimiento debe ser:

```text
NUEVA NECESIDAD
        ↓
IDENTIFICAR MÓDULOS INVOLUCRADOS
        ↓
IDENTIFICAR PROPIETARIO DE LA RESPONSABILIDAD
        ↓
DEFINIR ORIGEN
        ↓
DEFINIR CONSECUENCIA
        ↓
DEFINIR TRAZABILIDAD
        ↓
ACTUALIZAR DOCUMENTACIÓN
        ↓
IMPLEMENTAR
```

No debe agregarse una dependencia únicamente porque resulta más rápida de implementar.

---

# 31. Matriz conceptual de colaboración

La siguiente matriz resume las principales relaciones funcionales:

```text
Presentations
    ↓
Products

Supplies
    ↓
Purchases
Recipes
Inventory
Production

Suppliers
    ↓
Purchases
Precios de referencia

Products
    ↓
Recipes
Production
Lots
Sales
Costs
Profitability

Recipes
    ↓
Production

Purchases
    ↓
Inventory

Production
    ↓
Inventory
Lots
Costs

Lots
    ↓
Inventory
Sales

Clients
    ↓
Sales

Sales
    ↓
Inventory
Payments
Costs
Profitability

Payments
    ↓
Estado financiero de ventas

Expenses
    ↓
Profitability

Costs
    ↓
Profitability

Profitability
    ↓
Dashboard

Todos los módulos operativos relevantes
    ↓
Dashboard
```

Esta matriz representa colaboración funcional.

No obliga todavía a una implementación técnica específica.

---

# 32. Regla final

La regla central de interacción entre módulos es:

```text
MÓDULO DE ORIGEN
        ↓
REALIZA UNA OPERACIÓN
        ↓
SE GENERA UNA CONSECUENCIA
        ↓
EL MÓDULO RESPONSABLE
REGISTRA ESA CONSECUENCIA
        ↓
SE CONSERVA LA TRAZABILIDAD
```

En consecuencia:

> **Un módulo puede participar en un proceso compartido, consultar información de otros módulos y producir consecuencias que afecten responsabilidades externas, pero no debe apropiarse de la lógica ni convertirse en una segunda fuente de verdad del dominio de otro módulo.**
