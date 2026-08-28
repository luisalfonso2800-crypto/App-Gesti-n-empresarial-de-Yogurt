# Testing Implementation Plan — V1

## 1. Propósito del documento

Este documento define el plan de implementación de pruebas para el sistema de gestión empresarial de yogurt.

Su propósito es establecer **qué se prueba, en qué nivel, en qué momento y contra qué reglas**.

Las pruebas no son una actividad separada que ocurre únicamente al final del proyecto.

Forman parte de la implementación.

El principio será:

```text
DOCUMENTACIÓN APROBADA
        ↓
IMPLEMENTACIÓN
        ↓
PRUEBAS
        ↓
VALIDACIÓN DEL COMPORTAMIENTO
        ↓
CONTINUAR AL SIGUIENTE BLOQUE
```

No se considerará un módulo terminado simplemente porque:

```text
EL CÓDIGO COMPILA
```

o porque:

```text
EL ENDPOINT RESPONDE
```

Un módulo estará terminado cuando su comportamiento relevante haya sido validado.

---

# 2. Fuentes de verdad para las pruebas

Las pruebas deben derivarse de la documentación ya construida.

Las principales fuentes serán:

```text
docs/
```

### Dominio

Los documentos de dominio definen:

* qué hace cada módulo;
* qué información administra;
* qué operaciones existen;
* qué comportamientos pertenecen al módulo.

### Modelo de datos

```text
docs/data-model/
```

Define:

* entidades;
* relaciones;
* reglas de integridad;
* historial;
* trazabilidad;
* flujos de inventario;
* procesos de negocio;
* reglas entre módulos;
* responsabilidades de cálculo.

### Backend

```text
docs/backend/
```

Define:

* límites de módulos;
* dependencias;
* diseño de API;
* persistencia;
* transacciones;
* manejo de errores;
* estrategia de validación;
* decisiones arquitectónicas.

### Implementación

```text
docs/implementation/
```

Define:

* orden de implementación;
* bootstrap;
* base de datos;
* módulos;
* componentes compartidos;
* Prisma;
* API.

Por tanto:

```text
DOCUMENTACIÓN
        ↓
COMPORTAMIENTO ESPERADO
        ↓
CASOS DE PRUEBA
```

Las pruebas no deben inventar reglas nuevas.

---

# 3. Principio fundamental

La estrategia de pruebas será:

```text
PROBAR COMPORTAMIENTO
NO IMPLEMENTACIÓN INTERNA
```

Ejemplo incorrecto:

```text
debe llamar exactamente
al método X tres veces
```

cuando lo relevante realmente es:

```text
debe registrar correctamente
la operación y actualizar
el estado correspondiente
```

Las pruebas deben validar el resultado observable y las reglas del sistema.

No deben quedar excesivamente acopladas a detalles internos que puedan cambiar sin modificar el comportamiento.

---

# 4. Niveles de prueba

La V1 utilizará varios niveles de prueba.

```text
                    E2E
                 ─────────
              INTEGRACIÓN
           ─────────────────
                 UNIDAD
        ─────────────────────────
```

No todos los comportamientos requieren pruebas en todos los niveles.

Cada nivel tiene una responsabilidad diferente.

---

# 5. Pruebas unitarias

Las pruebas unitarias validan una unidad concreta de comportamiento.

Ejemplos:

```text
cálculo
```

```text
regla de negocio
```

```text
validador
```

```text
servicio aislado
```

```text
transformación de datos
```

El objetivo es comprobar:

```text
DADO UN CONTEXTO
        ↓
CUANDO OCURRE UNA ACCIÓN
        ↓
ENTONCES EL RESULTADO
ES EL ESPERADO
```

Ejemplo conceptual:

```text
Dado:
inventario disponible = 10

Cuando:
se solicita consumir 15

Entonces:
la operación debe ser rechazada
```

---

# 6. Pruebas de integración

Las pruebas de integración validan la colaboración entre componentes reales.

Por ejemplo:

```text
CASO DE USO
        ↓
REPOSITORIO
        ↓
PRISMA
        ↓
BASE DE DATOS
```

Estas pruebas son especialmente importantes para operaciones que afectan varias entidades.

Ejemplo:

```text
REGISTRAR COMPRA
        ↓
CREAR COMPRA
        ↓
CREAR DETALLES
        ↓
REGISTRAR MOVIMIENTO
        ↓
ACTUALIZAR INVENTARIO
```

La prueba debe verificar el resultado completo de la operación.

---

# 7. Pruebas End-to-End

Las pruebas E2E validan el sistema desde una perspectiva externa.

Ejemplo:

```text
HTTP REQUEST
        ↓
CONTROLLER
        ↓
VALIDACIÓN
        ↓
CASO DE USO
        ↓
PERSISTENCIA
        ↓
HTTP RESPONSE
```

El objetivo es verificar que el contrato completo funciona correctamente.

Ejemplo:

```text
POST /api/v1/purchases
```

Debe validarse:

```text
REQUEST
        ↓
RESPUESTA HTTP
        ↓
DATOS PERSISTIDOS
        ↓
EFECTO EN INVENTARIO
```

---

# 8. Distribución de responsabilidad

La estrategia será:

| Comportamiento      |         Unit Test |                   Integration Test |                  E2E Test |
| ------------------- | ----------------: | ---------------------------------: | ------------------------: |
| Cálculos aislados   |                Sí |                  No necesariamente |                        No |
| Validadores simples |                Sí |                  No necesariamente |    Sí, cuando afecten API |
| Reglas de negocio   |                Sí | Sí, cuando involucren persistencia |            Casos críticos |
| Persistencia        |                No |                                 Sí |            Casos críticos |
| Transacciones       |                No |                                 Sí |            Casos críticos |
| Endpoints           | No necesariamente |                       Parcialmente |                        Sí |
| Procesos completos  |      Parcialmente |                                 Sí |     Sí, casos principales |
| Dashboard           |     Según cálculo |                                 Sí | Sí, consultas principales |

No se buscará duplicar mecánicamente todas las pruebas en los tres niveles.

---

# 9. Estructura general de pruebas

La estructura debe mantenerse cercana a los módulos.

Conceptualmente:

```text
src/
└── modules/
    ├── presentations/
    │   ├── ...
    │   └── *.spec.ts
    │
    ├── products/
    │   ├── ...
    │   └── *.spec.ts
    │
    ├── purchases/
    │   ├── ...
    │   └── *.spec.ts
    │
    └── inventory/
        ├── ...
        └── *.spec.ts
```

Las pruebas de integración y E2E pueden tener una estructura separada:

```text
test/
├── integration/
│   ├── purchases/
│   ├── inventory/
│   ├── production/
│   └── sales/
│
└── e2e/
    ├── presentations/
    ├── purchases/
    ├── production/
    └── sales/
```

La estructura definitiva debe evitar duplicación innecesaria.

---

# 10. Convención de nombres

Los nombres deben expresar el comportamiento probado.

Ejemplo:

```text
should_create_product_when_data_is_valid
```

o utilizando una estructura descriptiva:

```text
describe('Create Product')
```

```text
it('should create a product when the input is valid')
```

La prueba debe poder responder claramente:

```text
¿QUÉ COMPORTAMIENTO
ESTÁ VALIDANDO?
```

---

# 11. Patrón de pruebas

Se utilizará preferentemente el patrón:

```text
ARRANGE
ACT
ASSERT
```

Conceptualmente:

```text
ARRANGE
Preparar escenario
```

```text
ACT
Ejecutar comportamiento
```

```text
ASSERT
Verificar resultado
```

Ejemplo:

```text
ARRANGE
Crear datos necesarios

ACT
Registrar compra

ASSERT
Verificar compra
Verificar detalles
Verificar inventario
```

---

# 12. Pruebas de Presentaciones

El módulo debe probar los comportamientos definidos para la gestión de presentaciones.

Como mínimo:

```text
crear presentación válida
```

```text
rechazar datos inválidos
```

```text
consultar presentación existente
```

```text
rechazar presentación inexistente
```

```text
actualizar cuando esté permitido
```

Las restricciones de eliminación deben probarse únicamente según las reglas documentadas.

---

# 13. Pruebas de Insumos

Se deben validar:

```text
creación válida
```

```text
validación de datos requeridos
```

```text
consultas
```

```text
actualizaciones permitidas
```

```text
restricciones derivadas
de relaciones existentes
```

---

# 14. Pruebas de Proveedores

Se deben validar:

```text
registro de proveedor
```

```text
consulta
```

```text
actualización
```

```text
reglas de integridad
```

También deben probarse las relaciones necesarias con precios de proveedores cuando estas operaciones estén implementadas.

---

# 15. Pruebas de Productos

Los productos deben probarse teniendo en cuenta sus relaciones reales.

Casos relevantes:

```text
crear producto con referencias válidas
```

```text
rechazar referencias inexistentes
```

```text
consultar producto
```

```text
actualizar información permitida
```

```text
proteger relaciones históricas
cuando corresponda
```

---

# 16. Pruebas de Recetas

Las recetas requieren especial atención porque involucran una estructura principal y detalles asociados.

Debe probarse:

```text
crear receta
```

```text
crear detalles correctamente
```

```text
validar insumos relacionados
```

```text
rechazar cantidades inválidas
```

```text
mantener consistencia entre
receta y detalle
```

Cuando una receta y sus detalles deban persistirse juntos:

```text
OPERACIÓN COMPLETA
        ↓
ÉXITO
```

o:

```text
OPERACIÓN COMPLETA
        ↓
ERROR
        ↓
ROLLBACK
```

---

# 17. Pruebas de Compras

Las compras representan uno de los primeros procesos integrados relevantes.

Debe probarse:

```text
COMPRA VÁLIDA
        ↓
CREAR COMPRA
        ↓
CREAR DETALLES
        ↓
ACTUALIZAR INVENTARIO
```

También:

```text
ERROR EN DETALLE
        ↓
NO DEBE QUEDAR
UNA COMPRA PARCIAL
```

Casos mínimos:

* compra válida;
* proveedor válido;
* insumos válidos;
* cantidades válidas;
* múltiples detalles;
* fallo durante la operación;
* consistencia posterior del inventario.

---

# 18. Pruebas de Inventario

El inventario debe ser uno de los módulos con mayor cobertura funcional.

Se deben probar:

```text
entrada de inventario
```

```text
salida de inventario
```

```text
actualización correcta del saldo
```

```text
rechazo de operaciones inválidas
```

```text
consistencia entre movimiento
y saldo resultante
```

No basta con verificar que un valor cambió.

Debe verificarse que el movimiento y el estado resultante respeten las reglas documentadas.

---

# 19. Pruebas del flujo de inventario

Se deben implementar pruebas basadas directamente en:

```text
docs/data-model/06-inventory-flow.md
```

Cada flujo documentado debe transformarse progresivamente en casos de prueba.

Conceptualmente:

```text
COMPRA
    ↓
ENTRADA INVENTARIO
```

```text
PRODUCCIÓN
    ↓
SALIDA INSUMOS
    ↓
ENTRADA PRODUCTOS TERMINADOS
```

```text
VENTA
    ↓
SALIDA INVENTARIO
```

El comportamiento real debe coincidir con el flujo documentado.

---

# 20. Pruebas de Producción

La producción debe probarse como un proceso completo.

Conceptualmente:

```text
RECETA
        ↓
VALIDAR INSUMOS
        ↓
CONSUMIR INVENTARIO
        ↓
REGISTRAR PRODUCCIÓN
        ↓
CREAR RESULTADO
        ↓
CREAR LOTE
```

Las pruebas deben verificar tanto:

```text
RESULTADO EXITOSO
```

como:

```text
FALLO DURANTE EL PROCESO
```

En caso de fallo:

```text
NO DEBE EXISTIR
UN ESTADO PARCIAL INCONSISTENTE
```

---

# 21. Pruebas de Lotes

Los lotes deben validar especialmente la trazabilidad.

Debe comprobarse la persistencia correcta de:

```text
fecha de creación
```

```text
fecha de vencimiento
```

además de las relaciones correspondientes con el proceso que les da origen.

Las pruebas deben impedir que una implementación futura omita estos datos cuando el modelo requiera conservarlos.

---

# 22. Pruebas de trazabilidad

La trazabilidad debe probarse de extremo a extremo en los procesos relevantes.

Ejemplo conceptual:

```text
COMPRA
        ↓
INSUMO
        ↓
PRODUCCIÓN
        ↓
LOTE
        ↓
VENTA
```

Cuando las relaciones documentadas lo permitan, el sistema debe conservar suficiente información para reconstruir el recorrido del dato.

Las pruebas no deben inventar relaciones que el modelo aprobado no contemple.

---

# 23. Pruebas de Clientes

Casos principales:

```text
crear cliente
```

```text
consultar cliente
```

```text
actualizar cliente
```

```text
validar datos requeridos
```

```text
verificar restricciones
cuando existan relaciones históricas
```

---

# 24. Pruebas de Ventas

Las ventas son un proceso crítico.

Debe probarse:

```text
VENTA VÁLIDA
        ↓
CREAR VENTA
        ↓
CREAR DETALLES
        ↓
VALIDAR DISPONIBILIDAD
        ↓
REGISTRAR SALIDA
```

También:

```text
INVENTARIO INSUFICIENTE
        ↓
RECHAZAR VENTA
        ↓
NO ALTERAR INVENTARIO
```

La prueba debe verificar la consistencia completa de la operación.

---

# 25. Pruebas de Pagos

Los pagos deben probarse según el modelo financiero aprobado.

Casos:

```text
registrar pago válido
```

```text
validar relación correspondiente
```

```text
rechazar referencias inválidas
```

```text
mantener consistencia histórica
```

No deben añadirse reglas financieras que no estén definidas por el modelo.

---

# 26. Pruebas de Gastos

Se deben validar:

```text
registro correcto
```

```text
validación de datos
```

```text
consulta
```

```text
modificaciones permitidas
```

```text
protección de información histórica
cuando corresponda
```

---

# 27. Pruebas de Costos

Los cálculos de costos deben tener pruebas unitarias explícitas.

La estructura será:

```text
DATOS DE ENTRADA
        ↓
CÁLCULO
        ↓
RESULTADO ESPERADO
```

Cada regla de cálculo documentada debe poder probarse independientemente.

Los resultados no deben depender exclusivamente de pruebas manuales en el frontend.

---

# 28. Pruebas de Rentabilidad

Los cálculos de rentabilidad deben probar:

```text
datos válidos
```

```text
valores límite
```

```text
ausencia de datos necesarios
```

```text
consistencia matemática
```

Las fórmulas y responsabilidades deben derivarse de:

```text
docs/data-model/09-calculation-responsibilities.md
```

No se deben crear fórmulas nuevas dentro de las pruebas.

---

# 29. Pruebas del Dashboard

El dashboard no debe probarse únicamente como interfaz visual.

Debe validarse que sus indicadores correspondan a los datos reales del sistema.

Ejemplo:

```text
REGISTRAR OPERACIONES
        ↓
CONSULTAR DASHBOARD
        ↓
VERIFICAR INDICADORES
```

Se deben comprobar especialmente los indicadores críticos definidos por el dominio.

---

# 30. Pruebas de integridad de datos

Las pruebas de integración deben verificar las reglas definidas en:

```text
docs/data-model/03-data-integrity-rules.md
```

Cada regla relevante debe tener cobertura.

Ejemplo conceptual:

```text
ENTIDAD RELACIONADA INEXISTENTE
        ↓
OPERACIÓN RECHAZADA
```

```text
REFERENCIA VÁLIDA
        ↓
OPERACIÓN PERMITIDA
```

Las restricciones deben validarse tanto a nivel de aplicación como en persistencia cuando corresponda.

---

# 31. Pruebas de transacciones

Las operaciones definidas en:

```text
docs/backend/05-transaction-boundaries.md
```

deben contar con pruebas de integración.

La estructura será:

```text
INICIAR OPERACIÓN
        ↓
FORZAR FALLO CONTROLADO
        ↓
VERIFICAR ROLLBACK
```

El objetivo es comprobar que una operación crítica no deje datos parcialmente persistidos.

Procesos prioritarios:

```text
recetas
```

```text
compras
```

```text
producción
```

```text
ventas
```

y cualquier otro proceso definido como transaccional.

---

# 32. Pruebas de validación

Las pruebas deben diferenciar:

```text
VALIDACIÓN ESTRUCTURAL
```

de:

```text
VALIDACIÓN DE NEGOCIO
```

Ejemplo estructural:

```text
cantidad = texto inválido
```

Ejemplo de negocio:

```text
cantidad solicitada >
cantidad disponible
```

Ambas deben probarse, pero en la capa correspondiente.

---

# 33. Pruebas de API

Cada endpoint implementado debe tener una cobertura mínima de contrato.

```text
REQUEST VÁLIDO
```

```text
REQUEST INVÁLIDO
```

```text
RECURSO INEXISTENTE
```

```text
REGLA DE NEGOCIO VIOLADA
```

```text
RESPUESTA CORRECTA
```

Cuando corresponda:

```text
NO AUTENTICADO
```

```text
NO AUTORIZADO
```

---

# 34. Pruebas de errores

El manejo de errores debe verificarse contra:

```text
docs/backend/06-error-handling.md
```

Debe comprobarse que:

* los errores tengan una estructura consistente;
* los códigos HTTP correspondan al tipo de error;
* los detalles internos no sean expuestos;
* los errores esperados sean distinguibles de fallos internos.

No debe probarse únicamente que:

```text
ALGO FALLÓ
```

Debe probarse:

```text
CÓMO RESPONDE EL SISTEMA
CUANDO FALLA
```

---

# 35. Pruebas de autenticación

Cuando la autenticación sea implementada, deben probarse:

```text
solicitud sin credenciales
```

```text
credenciales inválidas
```

```text
credenciales válidas
```

```text
acceso a endpoint protegido
```

La protección no debe verificarse únicamente mediante pruebas manuales.

---

# 36. Pruebas de autorización

Cuando existan permisos o roles, deben probarse explícitamente.

Ejemplo conceptual:

```text
USUARIO A
    ↓
PERMISO VÁLIDO
    ↓
OPERACIÓN PERMITIDA
```

```text
USUARIO B
    ↓
SIN PERMISO
    ↓
OPERACIÓN RECHAZADA
```

No basta con probar que el guard existe.

Debe probarse el comportamiento real de autorización.

---

# 37. Datos de prueba

Los datos utilizados en pruebas deben ser controlados.

No deben depender de:

```text
BASE DE DATOS PERSONAL
```

ni de:

```text
DATOS MANUALES EXISTENTES
```

Las pruebas deben poder:

```text
CREAR DATOS
```

```text
EJECUTAR
```

```text
VERIFICAR
```

```text
LIMPIAR
```

de manera repetible.

---

# 38. Factories y builders

Cuando sea necesario crear datos repetitivos, pueden utilizarse:

```text
FACTORIES
```

o:

```text
TEST BUILDERS
```

Ejemplo conceptual:

```text
createSupply()
```

```text
createProduct()
```

```text
createPurchase()
```

Su objetivo es reducir duplicación.

No deben convertirse en una capa compleja de abstracción.

---

# 39. Base de datos de pruebas

Las pruebas de integración y E2E deben utilizar un entorno controlado.

Conceptualmente:

```text
APPLICATION DATABASE
        ≠
TEST DATABASE
```

Nunca deben ejecutarse pruebas destructivas contra la base de datos utilizada para información real.

La configuración debe permitir:

```text
EJECUTAR PRUEBAS
        ↓
AISLAR DATOS
        ↓
LIMPIAR ENTORNO
```

---

# 40. Estado inicial de pruebas

Cada prueba debe ser independiente.

Idealmente:

```text
TEST A
```

no debe depender de:

```text
TEST B
```

La ejecución en diferente orden no debe modificar el resultado.

---

# 41. Pruebas de regresión

Cada error corregido que represente un comportamiento importante debe generar una prueba cuando sea razonable.

El flujo será:

```text
BUG DETECTADO
        ↓
REPRODUCIR
        ↓
CREAR PRUEBA
        ↓
CORREGIR
        ↓
VERIFICAR
```

La prueba evita que el mismo comportamiento incorrecto reaparezca posteriormente.

---

# 42. Orden de implementación de pruebas

Las pruebas deben desarrollarse junto con los módulos.

El orden seguirá la implementación general:

```text
1. Presentaciones
2. Insumos
3. Proveedores
4. Precios de proveedores
5. Productos
6. Recetas
7. Compras
8. Inventario
9. Producción
10. Lotes
11. Clientes
12. Ventas
13. Pagos
14. Gastos
15. Costos
16. Rentabilidad
17. Dashboard
```

No se debe esperar hasta implementar los 17 módulos para comenzar las pruebas.

---

# 43. Ciclo de implementación

Cada módulo seguirá este ciclo:

```text
REVISAR DOCUMENTACIÓN
        ↓
IMPLEMENTAR
        ↓
PRUEBAS UNITARIAS
        ↓
PRUEBAS DE INTEGRACIÓN
        ↓
PRUEBAS DE API
        ↓
VALIDAR RESULTADO
        ↓
DOCUMENTAR DECISIONES
        ↓
SIGUIENTE MÓDULO
```

No todos los módulos requerirán el mismo volumen de pruebas.

La profundidad dependerá del riesgo y complejidad.

---

# 44. Priorización por riesgo

La cobertura inicial debe priorizar las operaciones que puedan afectar la integridad del sistema.

Prioridad alta:

```text
INVENTARIO
```

```text
COMPRAS
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

Prioridad media:

```text
RECETAS
```

```text
PAGOS
```

```text
COSTOS
```

```text
RENTABILIDAD
```

Prioridad normal:

```text
PRESENTACIONES
```

```text
INSUMOS
```

```text
PROVEEDORES
```

```text
CLIENTES
```

```text
GASTOS
```

La prioridad no significa que los módulos de prioridad normal no deban probarse.

Significa que los procesos con mayor riesgo de inconsistencia deben recibir mayor atención.

---

# 45. Cobertura

La V1 no debe perseguir un porcentaje arbitrario como objetivo principal.

No se adoptará una regla como:

```text
100% COVERAGE
```

porque:

```text
100% DE LÍNEAS CUBIERTAS
≠
100% DE COMPORTAMIENTO VALIDADO
```

El objetivo será:

```text
COBERTURA DE COMPORTAMIENTOS CRÍTICOS
```

La métrica de cobertura puede utilizarse como señal técnica, pero no como única definición de calidad.

---

# 46. Casos límite

Las pruebas deben incluir casos límite cuando sean relevantes.

Ejemplos:

```text
cantidad = 0
```

```text
cantidad negativa
```

```text
inventario exactamente igual
a la cantidad solicitada
```

```text
fecha de vencimiento inválida
```

```text
recurso relacionado inexistente
```

```text
lista vacía
```

Estos casos deben derivarse de las reglas reales del dominio.

---

# 47. Pruebas contra decisiones documentadas

Cuando una decisión esté definida en:

```text
docs/data-model/05-data-model-decisions.md
```

o:

```text
docs/backend/08-backend-decisions.md
```

y afecte comportamiento observable, debe existir una prueba adecuada.

La relación será:

```text
DECISIÓN
        ↓
IMPLEMENTACIÓN
        ↓
PRUEBA
```

Esto ayuda a evitar que las decisiones arquitectónicas permanezcan únicamente como documentación.

---

# 48. Matriz de trazabilidad de pruebas

A medida que el proyecto avance, debe mantenerse una relación entre:

```text
REGLA
```

```text
CASO DE USO
```

```text
IMPLEMENTACIÓN
```

```text
PRUEBA
```

Conceptualmente:

| Regla o proceso       | Módulo            | Tipo de prueba    | Estado    |
| --------------------- | ----------------- | ----------------- | --------- |
| Crear presentación    | Presentations     | Unit / E2E        | Pendiente |
| Registrar compra      | Purchases         | Integration / E2E | Pendiente |
| Entrada de inventario | Inventory         | Integration       | Pendiente |
| Producción y lote     | Production / Lots | Integration / E2E | Pendiente |
| Venta y salida        | Sales / Inventory | Integration / E2E | Pendiente |

Esta matriz podrá crecer durante la implementación.

No es necesario construir desde ahora una matriz exhaustiva de todos los tests.

---

# 49. Automatización

Las pruebas deben poder ejecutarse mediante comandos definidos por el proyecto.

Conceptualmente:

```text
npm run test
```

```text
npm run test:integration
```

```text
npm run test:e2e
```

La nomenclatura definitiva dependerá del bootstrap técnico.

El objetivo es:

```text
IMPLEMENTACIÓN
        ↓
EJECUTAR PRUEBAS
        ↓
RESULTADO REPETIBLE
```

---

# 50. Integración continua

La integración continua podrá incorporarse posteriormente.

La condición para introducirla será contar con:

* proyecto estable;
* comandos de prueba definidos;
* base de datos de prueba controlada;
* ejecución reproducible.

No es necesario bloquear el inicio del desarrollo esperando una infraestructura completa de CI/CD.

Cuando exista:

```text
CAMBIO
        ↓
EJECUTAR PRUEBAS
        ↓
DETECTAR REGRESIONES
```

---

# 51. Qué no se probará inicialmente

La V1 no debe intentar automatizar desde el inicio todos los aspectos posibles.

No es prioritario inicialmente:

```text
PRUEBAS DE CARGA COMPLEJAS
```

```text
PRUEBAS DE ESTRÉS DISTRIBUIDAS
```

```text
SIMULACIONES DE ALTA CONCURRENCIA
A GRAN ESCALA
```

```text
AUTOMATIZACIÓN EXTREMA
DE UI
```

Estas capacidades pueden añadirse cuando el sistema tenga suficiente madurez y exista una necesidad real.

---

# 52. Criterio de aceptación de un módulo

Un módulo podrá considerarse implementado cuando:

```text
1. SU MODELO ESTÉ IMPLEMENTADO.
```

```text
2. SUS REGLAS PRINCIPALES
ESTÉN IMPLEMENTADAS.
```

```text
3. SUS CASOS DE USO
FUNCIONEN.
```

```text
4. SUS PRUEBAS UNITARIAS
CUBRAN LAS REGLAS RELEVANTES.
```

```text
5. SUS INTEGRACIONES CRÍTICAS
HAYAN SIDO VALIDADAS.
```

```text
6. SUS ENDPOINTS PRINCIPALES
HAYAN SIDO PROBADOS.
```

```text
7. NO EXISTA NINGÚN FALLO
CONOCIDO QUE COMPROMETA
LA INTEGRIDAD DEL MODELO.
```

```text
8. LA DOCUMENTACIÓN
CONTINÚE ALINEADA.
```

---

# 53. Restricción fundamental

Las pruebas no deben modificar el comportamiento esperado para adaptarse a una implementación incorrecta.

Si ocurre:

```text
PRUEBA
        ↓
IMPLEMENTACIÓN FALLA
```

primero debe determinarse:

```text
¿LA IMPLEMENTACIÓN ESTÁ MAL?
```

o:

```text
¿LA PRUEBA INTERPRETÓ MAL
LA DOCUMENTACIÓN?
```

No debe simplemente cambiarse la prueba hasta que pase.

El proceso correcto será:

```text
DOCUMENTACIÓN
        ↓
COMPORTAMIENTO ESPERADO
        ↓
PRUEBA
        ↓
IMPLEMENTACIÓN
```

Si existe contradicción, debe investigarse antes de modificar cualquiera de los dos.

---

# 54. Decisión de implementación

Para V1 se adopta la siguiente estrategia:

```text
PRUEBAS INCREMENTALES
POR MÓDULO
```

```text
PRUEBAS UNITARIAS
PARA REGLAS Y CÁLCULOS
```

```text
PRUEBAS DE INTEGRACIÓN
PARA PERSISTENCIA Y PROCESOS
```

```text
PRUEBAS E2E
PARA CONTRATOS Y FLUJOS CRÍTICOS
```

```text
BASE DE DATOS DE PRUEBAS
AISLADA
```

```text
PRIORIDAD SOBRE
OPERACIONES CRÍTICAS
```

```text
COBERTURA ORIENTADA
A COMPORTAMIENTO
```

```text
PRUEBAS DERIVADAS
DE LA DOCUMENTACIÓN APROBADA
```

---

# 55. Flujo definitivo de desarrollo

A partir de este documento, el ciclo de implementación será:

```text
DOCUMENTACIÓN APROBADA
        ↓
IMPLEMENTAR BLOQUE
        ↓
EJECUTAR PRUEBAS UNITARIAS
        ↓
EJECUTAR PRUEBAS DE INTEGRACIÓN
        ↓
VALIDAR API
        ↓
CORREGIR
        ↓
VALIDAR NUEVAMENTE
        ↓
DOCUMENTAR CAMBIOS
        ↓
CONTINUAR
```

---

# 56. Estado del documento

```text
Documento:
07-testing-implementation-plan.md

Versión:
V1

Estado:
DEFINIDO PARA IMPLEMENTACIÓN

Objetivo:
ESTABLECER LA ESTRATEGIA PARA VALIDAR
QUE LA IMPLEMENTACIÓN RESPETE EL MODELO,
LAS REGLAS DE NEGOCIO, LOS PROCESOS
Y LOS CONTRATOS DE LA API.

Principio principal:
NO SE PRUEBA PARA HACER PASAR EL CÓDIGO;
SE PRUEBA PARA VALIDAR EL COMPORTAMIENTO
DEFINIDO POR EL SISTEMA.

Estado de la documentación de implementación:
COMPLETADA
```

Con este documento queda cerrado el bloque de planificación de implementación. La siguiente fase ya no debería ser crear más documentación arquitectónica general, sino **iniciar la implementación real siguiendo el orden y las fronteras que ya quedaron definidas**.
