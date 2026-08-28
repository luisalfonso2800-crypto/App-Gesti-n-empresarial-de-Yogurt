# Orden de Implementación de Módulos — V1

## 1. Propósito del documento

Este documento define el orden en que los módulos del sistema deben implementarse.

El orden no se determina por:

```text
orden alfabético
```

ni por:

```text
orden numérico de los documentos
```

ni por:

```text
qué módulo parece más fácil de construir
```

El orden debe responder a las dependencias reales entre módulos.

La secuencia de implementación debe permitir que cada módulo se construya sobre información y capacidades que ya existen.

El principio será:

```text
FUNDAMENTOS
    ↓
DATOS MAESTROS
    ↓
DEPENDENCIAS FUNCIONALES
    ↓
OPERACIONES TRANSACCIONALES
    ↓
TRAZABILIDAD
    ↓
CÁLCULOS Y ANÁLISIS
```

---

# 2. Fuentes utilizadas para definir el orden

El orden de implementación debe respetar principalmente:

```text
docs/domains/
```

```text
docs/data-model/
```

```text
docs/backend/
```

Además, debe mantenerse consistente con la validación de fidelidad realizada respecto al sistema maestro VBA.

La referencia principal para evitar contradicciones será:

```text
docs/data-model/12-vba-fidelity-validation.md
```

Por lo tanto, este documento no redefine el negocio.

Únicamente establece una secuencia técnica para implementar lo que ya fue definido.

---

# 3. Principio fundamental

Un módulo no debe implementarse completamente si depende de capacidades que todavía no existen.

Ejemplo conceptual:

```text
VENTA
    ↓
requiere
    ├── cliente
    ├── producto
    ├── inventario
    └── lote
```

Por lo tanto, no tiene sentido comenzar por el módulo de ventas.

Primero deben existir las dependencias necesarias.

La regla será:

```text
IMPLEMENTAR PRIMERO
LO QUE PRODUCE LA INFORMACIÓN
```

antes de:

```text
IMPLEMENTAR
LO QUE LA CONSUME
```

---

# 4. Estrategia general de implementación

La implementación se dividirá en capas progresivas.

```text
FASE 0
FUNDAMENTOS TÉCNICOS
        ↓
FASE 1
MAESTROS FUNDAMENTALES
        ↓
FASE 2
RELACIONES Y DEFINICIÓN DEL PRODUCTO
        ↓
FASE 3
ABASTECIMIENTO
        ↓
FASE 4
INVENTARIO
        ↓
FASE 5
PRODUCCIÓN Y LOTES
        ↓
FASE 6
CLIENTES Y VENTAS
        ↓
FASE 7
PAGOS Y GASTOS
        ↓
FASE 8
COSTOS Y RENTABILIDAD
        ↓
FASE 9
DASHBOARD Y CONSULTAS
```

Esta secuencia representa dependencias funcionales, no una obligación de implementar cada módulo de manera aislada.

---

# 5. Fase 0 — Fundamentos técnicos

Antes de implementar módulos funcionales deben completarse las bases técnicas necesarias.

Incluye:

```text
MONOREPO
```

```text
CONFIGURACIÓN DEL WORKSPACE
```

```text
APLICACIÓN NESTJS
```

```text
CONFIGURACIÓN DE ENTORNO
```

```text
MANEJO GLOBAL DE ERRORES
```

```text
VALIDACIÓN GLOBAL
```

```text
POSTGRESQL
```

```text
PRISMA
```

```text
MIGRACIONES
```

Esta fase corresponde a los documentos:

```text
00-implementation-overview.md
```

```text
01-backend-bootstrap.md
```

```text
02-database-implementation-plan.md
```

No deben implementarse operaciones de negocio antes de que exista una base mínima verificable.

---

# 6. Fase 1 — Presentaciones

El primer módulo funcional será:

```text
01-presentations
```

Las presentaciones representan una información fundamental para definir la forma en que los productos del negocio pueden comercializarse.

El módulo debe implementarse antes de productos porque los productos pueden depender de la definición de presentación.

Conceptualmente:

```text
PRESENTACIÓN
    ↓
puede ser utilizada por
    ↓
PRODUCTO
```

La implementación inicial debe respetar el modelo documentado.

No deben añadirse atributos o relaciones no aprobadas.

---

# 7. Fase 2 — Insumos

El siguiente módulo será:

```text
02-supplies
```

Los insumos representan los elementos utilizados dentro de la operación productiva.

Este módulo constituye una dependencia fundamental para:

```text
PRECIOS DE PROVEEDORES
```

```text
RECETAS
```

```text
COMPRAS
```

```text
INVENTARIO
```

```text
PRODUCCIÓN
```

La relación conceptual será:

```text
INSUMO
    ├── puede tener precios
    ├── puede comprarse
    ├── puede participar en recetas
    ├── puede existir en inventario
    └── puede utilizarse en producción
```

Por esta razón debe existir antes de los módulos que consumen esta información.

---

# 8. Fase 3 — Proveedores

El siguiente módulo será:

```text
03-suppliers
```

Los proveedores son necesarios antes de implementar la relación de precios y el proceso de compras.

Conceptualmente:

```text
PROVEEDOR
    ↓
puede ofrecer
    ↓
INSUMO
```

La implementación del proveedor no debe asumir que el proveedor genera inventario.

El proveedor únicamente representa la contraparte comercial desde la cual se adquieren insumos.

---

# 9. Fase 4 — Precios de proveedores

La lógica relacionada con precios de proveedores debe implementarse después de:

```text
SUPPLIES
```

y:

```text
SUPPLIERS
```

Conceptualmente:

```text
PROVEEDOR
        ↓
        └───────┐
                ↓
         PRECIO DE INSUMO
                ↑
        ┌───────┘
        ↓
INSUMO
```

Este componente no debe implementarse como un módulo independiente si la arquitectura definitiva determina que pertenece funcionalmente al módulo de compras o proveedores.

La frontera técnica debe respetar:

```text
docs/backend/01-module-boundaries.md
```

Lo importante para el orden de implementación es que:

```text
INSUMOS + PROVEEDORES
```

deben existir antes de registrar sus relaciones de precio.

---

# 10. Fase 5 — Productos

Después de establecer las bases necesarias se implementará:

```text
04-products
```

El producto representa aquello que será producido y posteriormente vendido.

Su implementación debe apoyarse en la información definida previamente.

Dependiendo del modelo aprobado, podrá relacionarse con:

```text
PRESENTACIONES
```

y posteriormente será utilizado por:

```text
RECETAS
```

```text
PRODUCCIÓN
```

```text
LOTES
```

```text
VENTAS
```

La relación conceptual será:

```text
PRESENTACIÓN
        ↓
PRODUCTO
        ↓
    ┌───┼────┐
    ↓   ↓    ↓
RECETA PROD. VENTA
```

---

# 11. Fase 6 — Recetas

El siguiente módulo será:

```text
05-recipes
```

Una receta requiere que existan previamente:

```text
PRODUCTOS
```

e:

```text
INSUMOS
```

Conceptualmente:

```text
PRODUCTO
    ↓
RECETA
    ↓
DETALLE DE RECETA
    ↓
INSUMOS
```

La receta debe representar la definición documentada del proceso de composición del producto.

No debe confundirse una receta con una operación de producción.

La receta define.

La producción ejecuta.

---

# 12. Fase 7 — Compras

Una vez implementados:

```text
INSUMOS
```

```text
PROVEEDORES
```

y la información necesaria de precios, podrá implementarse:

```text
06-purchases
```

El proceso conceptual será:

```text
PROVEEDOR
        ↓
      COMPRA
        ↓
DETALLE DE COMPRA
        ↓
      INSUMOS
```

Las compras representan hechos transaccionales.

Por esta razón, la información registrada en una compra debe respetar los requisitos históricos documentados.

No debe depender exclusivamente de los valores actuales de los maestros.

---

# 13. Fase 8 — Inventario

El siguiente módulo será:

```text
07-inventory
```

El inventario no debe construirse como una lista independiente de cantidades editables.

Debe respetar el flujo documentado.

Conceptualmente:

```text
COMPRA
    ↓
MOVIMIENTO
    ↓
INVENTARIO
```

Posteriormente:

```text
PRODUCCIÓN
    ↓
MOVIMIENTO
    ↓
INVENTARIO
```

Y:

```text
VENTA
    ↓
MOVIMIENTO / SALIDA
    ↓
INVENTARIO
```

La implementación del inventario debe permitir mantener la trazabilidad de los cambios.

Por esta razón se implementa después de compras y antes de producción.

---

# 14. Fase 9 — Producción

Una vez disponibles:

```text
PRODUCTOS
```

```text
RECETAS
```

```text
INSUMOS
```

e:

```text
INVENTARIO
```

podrá implementarse:

```text
08-production
```

La producción representa la ejecución de una operación real.

Conceptualmente:

```text
PRODUCTO
    ↓
RECETA
    ↓
PRODUCCIÓN
    ↓
DETALLE DE PRODUCCIÓN
    ↓
CONSUMO DE INSUMOS
    ↓
MOVIMIENTOS DE INVENTARIO
```

La operación debe respetar las fronteras transaccionales definidas.

No debe ser posible registrar parcialmente una producción válida.

---

# 15. Fase 10 — Lotes

Después de producción se implementará:

```text
09-lots
```

Los lotes representan la identificación trazable de la producción obtenida.

Su implementación depende de la existencia del proceso productivo.

Conceptualmente:

```text
PRODUCCIÓN
        ↓
      LOTE
        ↓
PRODUCTO DISPONIBLE
```

El módulo debe conservar los datos históricos definidos, incluyendo:

```text
FECHA DE CREACIÓN DEL LOTE
```

y:

```text
FECHA DE VENCIMIENTO
```

Estas fechas representan hechos funcionales y deben permanecer disponibles para la trazabilidad.

---

# 16. Fase 11 — Clientes

El siguiente módulo será:

```text
10-clients
```

Los clientes representan información necesaria para registrar ventas y pagos asociados.

Este módulo puede implementarse técnicamente antes de producción, pero dentro del orden funcional se implementará antes de ventas.

No debe bloquearse la implementación de los módulos anteriores por depender de clientes, porque estos no son una dependencia de producción o inventario.

Conceptualmente:

```text
CLIENTE
    ↓
VENTA
    ↓
PAGO
```

---

# 17. Fase 12 — Ventas

Una vez implementados:

```text
CLIENTES
```

```text
PRODUCTOS
```

```text
INVENTARIO
```

y:

```text
LOTES
```

se implementará:

```text
11-sales
```

La venta representa una operación transaccional.

Conceptualmente:

```text
CLIENTE
        ↓
      VENTA
        ↓
DETALLE DE VENTA
        ↓
PRODUCTO / LOTE
        ↓
SALIDA DE INVENTARIO
```

La implementación debe garantizar que la operación respete las reglas de integridad y disponibilidad definidas.

---

# 18. Fase 13 — Pagos

Después de ventas se implementará:

```text
12-payments
```

Los pagos deben relacionarse con las obligaciones o ventas según el modelo aprobado.

Conceptualmente:

```text
CLIENTE
    ↓
VENTA
    ↓
PAGO
```

La implementación no debe modificar retroactivamente los hechos históricos de una venta.

El pago representa un hecho adicional dentro del historial financiero de la operación.

---

# 19. Fase 14 — Gastos

El siguiente módulo será:

```text
13-expenses
```

Los gastos pueden representar operaciones económicas independientes de compras, producción o ventas.

Por esta razón se implementan después de las operaciones fundamentales, pero antes de los módulos que consolidan información económica.

Conceptualmente:

```text
GASTO
    ↓
INFORMACIÓN FINANCIERA
```

La implementación debe respetar la separación documentada entre:

```text
COMPRA
```

y:

```text
GASTO
```

No deben fusionarse ambos conceptos únicamente porque ambos representan una salida económica.

---

# 20. Fase 15 — Costos

Después de implementar las fuentes de información necesarias podrá construirse:

```text
14-costs
```

El módulo de costos consume información proveniente de otros módulos.

Entre ellos:

```text
COMPRAS
```

```text
INSUMOS
```

```text
RECETAS
```

```text
PRODUCCIÓN
```

y los elementos definidos específicamente en la documentación del dominio.

Por esta razón, costos no debe implementarse como un módulo aislado al inicio.

Conceptualmente:

```text
DATOS OPERATIVOS
        ↓
INFORMACIÓN DE COSTOS
        ↓
RESULTADOS DE COSTEO
```

El módulo debe respetar las responsabilidades de cálculo definidas.

No debe duplicar información que ya constituye la fuente de verdad.

---

# 21. Fase 16 — Rentabilidad

Una vez disponibles las fuentes necesarias se implementará:

```text
15-profitability
```

La rentabilidad depende de información consolidada.

Entre sus fuentes pueden encontrarse:

```text
VENTAS
```

```text
COSTOS
```

```text
GASTOS
```

Por lo tanto:

```text
OPERACIÓN
    ↓
COSTOS
    ↓
INGRESOS
    ↓
GASTOS
    ↓
RENTABILIDAD
```

La rentabilidad debe implementarse después de que los hechos que analiza ya puedan existir en el sistema.

---

# 22. Fase 17 — Dashboard

El último módulo funcional será:

```text
16-dashboard
```

El dashboard no debe convertirse en una fuente independiente de datos del negocio.

Su función principal será:

```text
CONSULTAR
```

```text
CONSOLIDAR
```

```text
PRESENTAR
```

información proveniente de los módulos funcionales.

Conceptualmente:

```text
PRESENTACIONES
SUPPLIES
SUPPLIERS
PRODUCTS
RECIPES
PURCHASES
INVENTORY
PRODUCTION
LOTS
CLIENTS
SALES
PAYMENTS
EXPENSES
COSTS
PROFITABILITY
        ↓
     DASHBOARD
```

Por esta razón se implementa al final.

---

# 23. Orden completo

La secuencia general de implementación será:

```text
FASE 0
Fundamentos técnicos
    │
    ├── Backend Bootstrap
    └── Persistencia inicial
```

```text
FASE 1
Presentations
```

```text
FASE 2
Supplies
```

```text
FASE 3
Suppliers
```

```text
FASE 4
Relación de precios de proveedores
```

```text
FASE 5
Products
```

```text
FASE 6
Recipes
```

```text
FASE 7
Purchases
```

```text
FASE 8
Inventory
```

```text
FASE 9
Production
```

```text
FASE 10
Lots
```

```text
FASE 11
Clients
```

```text
FASE 12
Sales
```

```text
FASE 13
Payments
```

```text
FASE 14
Expenses
```

```text
FASE 15
Costs
```

```text
FASE 16
Profitability
```

```text
FASE 17
Dashboard
```

---

# 24. Representación de dependencias

La cadena principal del sistema puede visualizarse de la siguiente manera:

```text
PRESENTATIONS
        ↓
     PRODUCTS
        ↑
        │
SUPPLIES ← SUPPLIERS
    ↓          ↓
    └── PRICES ┘
        ↓
      RECIPES
        ↓
     PURCHASES
        ↓
    INVENTORY
        ↓
    PRODUCTION
        ↓
       LOTS
        ↓
       SALES ← CLIENTS
        ↓
      PAYMENTS
```

La información financiera posterior se alimenta de:

```text
PURCHASES
```

```text
PRODUCTION
```

```text
SALES
```

```text
PAYMENTS
```

```text
EXPENSES
```

para construir:

```text
COSTS
        ↓
PROFITABILITY
        ↓
DASHBOARD
```

Esta representación es conceptual.

No implica que todos los módulos deban depender técnicamente unos de otros de forma directa.

Las dependencias reales deben respetar:

```text
docs/backend/02-module-dependencies.md
```

---

# 25. Implementación vertical por módulo

Cada módulo no debe implementarse únicamente creando primero toda la base de datos y dejando el resto para después.

Cuando un módulo entre en implementación, debe completarse de manera vertical hasta alcanzar un estado funcional verificable.

Conceptualmente:

```text
MÓDULO
    ↓
MODELO DE PERSISTENCIA
    ↓
MIGRACIÓN
    ↓
LÓGICA DE APLICACIÓN
    ↓
VALIDACIONES
    ↓
API
    ↓
PRUEBAS
    ↓
VERIFICACIÓN
```

Solo después debe avanzarse al siguiente módulo o dependencia funcional.

Esto reduce el riesgo de acumular capas incompletas.

---

# 26. Implementación mínima antes de continuar

Un módulo no debe considerarse terminado únicamente porque existe:

```text
carpeta
```

```text
modelo
```

```text
controller
```

o:

```text
endpoint
```

Debe contar, según corresponda, con:

```text
MODELO PERSISTENTE
```

```text
REGLAS DE VALIDACIÓN
```

```text
LÓGICA DE NEGOCIO
```

```text
OPERACIONES NECESARIAS
```

```text
MANEJO DE ERRORES
```

```text
PRUEBAS
```

```text
VERIFICACIÓN CONTRA LA DOCUMENTACIÓN
```

---

# 27. Validación entre fases

Antes de iniciar una nueva fase debe realizarse una revisión.

La revisión debe responder:

```text
¿EL MÓDULO ANTERIOR FUNCIONA?
```

```text
¿SUS DATOS PUEDEN SER UTILIZADOS
POR EL SIGUIENTE MÓDULO?
```

```text
¿LAS RELACIONES IMPLEMENTADAS
COINCIDEN CON EL MODELO?
```

```text
¿EXISTEN DECISIONES NUEVAS?
```

```text
¿SE INTRODUJO ALGUNA CONTRADICCIÓN?
```

Si existe una contradicción, debe resolverse antes de continuar propagando el problema hacia los módulos siguientes.

---

# 28. Implementación por dependencias, no por carpetas

La arquitectura no debe convertirse en un proceso mecánico de:

```text
crear carpeta
    ↓
crear controller
    ↓
crear service
    ↓
crear repository
    ↓
siguiente carpeta
```

La implementación debe responder a una capacidad funcional real.

Por ejemplo:

```text
CREAR PRESENTACIÓN
```

requiere únicamente las piezas necesarias para registrar correctamente una presentación.

No debe generar automáticamente una infraestructura completa que todavía no tiene responsabilidad.

---

# 29. Módulos que pueden evolucionar conjuntamente

Algunos módulos poseen una relación estrecha y pueden requerir trabajo coordinado.

Por ejemplo:

```text
PURCHASES
        ↔
INVENTORY
```

Una compra puede producir efectos sobre inventario.

Por lo tanto, aunque el orden general establezca:

```text
PURCHASES
    ↓
INVENTORY
```

la implementación de la operación completa puede requerir preparar ambos componentes antes de cerrar definitivamente el flujo.

La regla será:

```text
ORDEN DE IMPLEMENTACIÓN
≠
AISLAMIENTO ARTIFICIAL
```

---

# 30. Producción, inventario y lotes

Estos tres componentes forman una cadena especialmente relacionada.

```text
INVENTORY
        ↓
PRODUCTION
        ↓
LOTS
```

La producción puede requerir:

```text
consumo de insumos
```

lo que afecta:

```text
inventario
```

y genera resultados identificables mediante:

```text
lotes
```

Por esta razón, las fronteras transaccionales deben verificarse antes de considerar cerrado cualquiera de estos procesos.

---

# 31. Ventas, lotes e inventario

La implementación de ventas debe respetar la información disponible de inventario y la trazabilidad de los lotes.

La relación conceptual será:

```text
LOTE DISPONIBLE
        ↓
VENTA
        ↓
SALIDA
        ↓
ACTUALIZACIÓN DEL ESTADO DISPONIBLE
```

La forma exacta debe respetar el modelo aprobado.

No deben añadirse mecanismos alternativos de descuento de inventario sin una decisión documentada.

---

# 32. Costos y rentabilidad como consumidores

Los módulos:

```text
COSTS
```

y:

```text
PROFITABILITY
```

deben construirse principalmente como consumidores de información ya existente.

La regla será:

```text
OPERACIONES
        ↓
DATOS BASE
        ↓
CÁLCULOS
```

No:

```text
CÁLCULO
        ↓
NUEVA FUENTE DE VERDAD
```

Estos módulos no deben convertirse en propietarios de información que pertenece a compras, producción, ventas o gastos.

---

# 33. Dashboard como capa final

El dashboard se implementará cuando los datos necesarios ya puedan producirse.

La regla será:

```text
MÓDULOS OPERATIVOS
        ↓
CONSULTAS
        ↓
INDICADORES
        ↓
DASHBOARD
```

No debe utilizarse el dashboard para introducir cálculos de negocio que deberían pertenecer a módulos especializados.

---

# 34. Orden dentro de cada módulo

Cada módulo deberá implementarse siguiendo una secuencia controlada.

```text
1. Revisar documentación del dominio.
```

```text
2. Revisar entidades y relaciones afectadas.
```

```text
3. Identificar reglas de integridad.
```

```text
4. Identificar requisitos históricos.
```

```text
5. Determinar persistencia necesaria.
```

```text
6. Crear o actualizar el modelo Prisma.
```

```text
7. Crear migración.
```

```text
8. Implementar lógica de aplicación.
```

```text
9. Implementar contratos de entrada y salida necesarios.
```

```text
10. Implementar endpoints.
```

```text
11. Implementar pruebas.
```

```text
12. Validar contra la documentación.
```

---

# 35. Prohibición de avanzar con módulos incompletos

No debe avanzarse automáticamente al siguiente módulo solo porque:

```text
EL CRUD FUNCIONA
```

Un CRUD no demuestra necesariamente que el módulo respeta:

```text
REGLAS DE NEGOCIO
```

```text
TRAZABILIDAD
```

```text
INTEGRIDAD
```

```text
TRANSACCIONES
```

```text
DEPENDENCIAS
```

El criterio de avance debe ser funcional y documental.

---

# 36. Cambios en el orden

El orden definido en este documento puede evolucionar únicamente cuando aparezca una dependencia real no identificada anteriormente.

El procedimiento será:

```text
NUEVA DEPENDENCIA DETECTADA
        ↓
REVISAR DOCUMENTACIÓN
        ↓
DETERMINAR IMPACTO
        ↓
ACTUALIZAR ORDEN
        ↓
DOCUMENTAR DECISIÓN
```

No debe modificarse el orden simplemente por preferencias de implementación.

---

# 37. Primera implementación funcional recomendada

El primer flujo funcional recomendado será:

```text
PRESENTATION
    ↓
crear
```

Después:

```text
SUPPLY
    ↓
crear
```

Posteriormente:

```text
SUPPLIER
    ↓
crear
```

Esto permitirá verificar progresivamente:

```text
estructura del módulo
```

```text
persistencia
```

```text
validación
```

```text
manejo de errores
```

```text
API
```

```text
pruebas
```

Antes de introducir procesos transaccionales más complejos.

---

# 38. Punto de control antes de compras

Antes de iniciar:

```text
PURCHASES
```

debe verificarse que existan correctamente:

```text
SUPPLIES
```

```text
SUPPLIERS
```

y las relaciones necesarias entre ambos.

También debe verificarse que:

```text
PRODUCTS
```

y:

```text
RECIPES
```

respeten las relaciones documentadas.

Este punto representa el cierre de los fundamentos funcionales.

---

# 39. Punto de control antes de producción

Antes de iniciar:

```text
PRODUCTION
```

debe verificarse:

```text
RECIPES
```

```text
PURCHASES
```

```text
INVENTORY
```

La producción no debe convertirse en el primer módulo que intenta resolver simultáneamente problemas de recetas, compras e inventario.

Cada dependencia debe encontrarse validada previamente.

---

# 40. Punto de control antes de ventas

Antes de implementar:

```text
SALES
```

debe verificarse:

```text
CLIENTS
```

```text
PRODUCTS
```

```text
INVENTORY
```

```text
LOTS
```

La venta debe consumir información ya confiable.

No debe convertirse en responsable de corregir inconsistencias producidas por los módulos anteriores.

---

# 41. Punto de control antes de análisis financiero

Antes de implementar:

```text
COSTS
```

```text
PROFITABILITY
```

debe verificarse la existencia y consistencia de las fuentes de información.

Especialmente:

```text
PURCHASES
```

```text
PRODUCTION
```

```text
SALES
```

```text
PAYMENTS
```

```text
EXPENSES
```

Los módulos analíticos no deben utilizar datos provisionales como fuente definitiva.

---

# 42. Criterio de finalización del orden de implementación

Este documento se considera correctamente definido cuando permite responder:

```text
¿QUÉ IMPLEMENTAMOS PRIMERO?
```

```text
¿QUÉ DEPENDE DE QUÉ?
```

```text
¿CUÁNDO PODEMOS IMPLEMENTAR
UN PROCESO TRANSACCIONAL?
```

```text
¿CUÁNDO UN MÓDULO ESTÁ
LO SUFICIENTEMENTE COMPLETO
PARA CONTINUAR?
```

La respuesta debe estar basada en dependencias funcionales y técnicas reales.

---

# 43. Secuencia final

```text
FASE 0
BASE TÉCNICA
        ↓
FASE 1
PRESENTATIONS
        ↓
FASE 2
SUPPLIES
        ↓
FASE 3
SUPPLIERS
        ↓
FASE 4
PRECIOS DE PROVEEDORES
        ↓
FASE 5
PRODUCTS
        ↓
FASE 6
RECIPES
        ↓
FASE 7
PURCHASES
        ↓
FASE 8
INVENTORY
        ↓
FASE 9
PRODUCTION
        ↓
FASE 10
LOTS
        ↓
FASE 11
CLIENTS
        ↓
FASE 12
SALES
        ↓
FASE 13
PAYMENTS
        ↓
FASE 14
EXPENSES
        ↓
FASE 15
COSTS
        ↓
FASE 16
PROFITABILITY
        ↓
FASE 17
DASHBOARD
```

---

# 44. Estado del documento

```text
Documento: 03-module-implementation-order.md

Versión: V1

Estado:
ORDEN CONTROLADO DE IMPLEMENTACIÓN

Dependencias:
- 00-implementation-overview.md
- 01-backend-bootstrap.md
- 02-database-implementation-plan.md
- docs/domains/
- docs/data-model/
- docs/backend/

Resultado:
SECUENCIA DEFINIDA PARA COMENZAR
LA IMPLEMENTACIÓN PROGRESIVA DEL SISTEMA
```

Este documento establece el orden de implementación del sistema basándose en las dependencias documentadas. El orden podrá ajustarse únicamente cuando una nueva dependencia real o una decisión arquitectónica validada haga necesario modificar la secuencia.
