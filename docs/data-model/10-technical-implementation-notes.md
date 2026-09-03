# 10 — TECHNICAL IMPLEMENTATION NOTES

## 1. Propósito del documento

Este documento establece las notas y restricciones técnicas que deberán tenerse en cuenta cuando la lógica de negocio y el modelo de datos definidos en la documentación comiencen a convertirse en código real.

Su objetivo es servir como puente entre:

```text
LÓGICA DEL NEGOCIO
        ↓
MODELO DE DATOS
        ↓
ARQUITECTURA DEL SISTEMA
        ↓
IMPLEMENTACIÓN TÉCNICA
```

Este documento no sustituye:

```text
system-architecture.md

dependency-rules.md

architecture-evolution.md

documentos de dominio

documentos del modelo de datos
```

Tampoco define todavía la implementación completa de:

* NestJS;
* Prisma;
* PostgreSQL;
* Electron;
* React;
* autenticación;
* endpoints;
* DTOs;
* componentes visuales;
* migraciones;
* pruebas.

Su función es establecer criterios técnicos que permitan implementar el sistema sin contradecir la lógica documental ya definida.

---

# 2. Jerarquía de implementación

La implementación técnica debe seguir la documentación oficial del proyecto.

La secuencia de referencia es:

```text
MAPA DEL NEGOCIO
        ↓
DOCUMENTOS DE DOMINIO
        ↓
MODELO DE DATOS
        ↓
REGLAS TRANSVERSALES
        ↓
RESPONSABILIDADES DE CÁLCULO
        ↓
DECISIONES TÉCNICAS
        ↓
CÓDIGO
```

El código no debe introducir nuevas reglas de negocio sin una decisión explícita.

Si durante la implementación aparece una necesidad no documentada:

```text
NECESIDAD DETECTADA
        ↓
¿EXISTE UNA REGLA DOCUMENTADA?
        │
        ├── SÍ
        │       ↓
        │   IMPLEMENTAR
        │
        └── NO
                ↓
        ANALIZAR
                ↓
        DOCUMENTAR LA DECISIÓN
                ↓
        IMPLEMENTAR
```

---

# 3. Fuente de verdad

La fuente de verdad funcional del proyecto debe respetar la siguiente jerarquía:

```text
1. REGLAS Y HECHOS DOCUMENTADOS DEL NEGOCIO

2. DECISIONES ARQUITECTÓNICAS Y ADRs

3. MODELO DE DATOS DOCUMENTADO

4. CÓDIGO IMPLEMENTADO Y PRUEBAS

5. DOCUMENTACIÓN DE IMPLEMENTACIÓN

6. CONVERSACIONES
```

Las conversaciones no deben utilizarse como fuente permanente de reglas.

Una conversación puede producir:

```text
ANÁLISIS
        ↓
DECISIÓN
        ↓
DOCUMENTACIÓN OFICIAL
        ↓
IMPLEMENTACIÓN
```

Una vez documentada una decisión, futuras implementaciones deben consultar el documento correspondiente.

---

# 4. Principio de implementación progresiva

La arquitectura completa puede estar definida documentalmente.

Sin embargo, el código debe implementarse progresivamente.

No se deben crear:

```text
Clases vacías

Servicios ficticios

Repositorios sin necesidad real

Interfaces sin consumidores

Eventos anticipados

Factories innecesarias

Mappers artificiales

Abstracciones sin responsabilidad concreta
```

La regla es:

> **La arquitectura define dónde debe vivir una responsabilidad cuando exista. El código aparece únicamente cuando esa responsabilidad es necesaria.**

---

# 5. Implementación por módulos

La implementación debe realizarse por módulos funcionales.

Cada módulo debe construirse respetando:

```text
Responsabilidad definida
        +
Reglas del dominio
        +
Relaciones autorizadas
        +
Reglas de integridad
        +
Historial y trazabilidad
        +
Reglas transversales
```

Un módulo no debe implementarse únicamente a partir de una tabla.

La secuencia correcta es:

```text
MÓDULO
        ↓
RESPONSABILIDAD
        ↓
CASOS DE USO
        ↓
DATOS NECESARIOS
        ↓
REGLAS
        ↓
IMPLEMENTACIÓN
```

---

# 6. Relación entre módulos y tablas

No debe asumirse que:

```text
UNA TABLA
=
UN MÓDULO
```

Un módulo puede contener varias entidades y relaciones.

Ejemplo conceptual:

```text
PURCHASES
        │
        ├── Compra
        │
        └── Detalle de compra
```

Igualmente:

```text
SALES
        │
        ├── Venta
        │
        └── Detalle de venta
```

Y:

```text
PRODUCTION
        │
        ├── Producción
        │
        └── Detalle de producción
```

La estructura técnica debe representar responsabilidades de negocio, no simplemente replicar la estructura de PostgreSQL en carpetas.

---

# 7. PostgreSQL como persistencia

PostgreSQL será la capa de persistencia relacional del sistema.

La base de datos será responsable de almacenar:

```text
Datos maestros

Operaciones

Relaciones

Historial

Información necesaria para trazabilidad
```

La base de datos no debe convertirse automáticamente en el lugar donde vive toda la lógica del negocio.

Las reglas deben distribuirse según su naturaleza.

Por ejemplo:

```text
RESTRICCIONES ESTRUCTURALES
        ↓
Base de datos
```

```text
PROCESOS DE NEGOCIO
        ↓
Backend
```

```text
PRESENTACIÓN
        ↓
Frontend
```

---

# 8. Integridad en la base de datos

La implementación del esquema deberá utilizar mecanismos de integridad cuando correspondan.

Esto puede incluir:

```text
Primary Keys

Foreign Keys

Unique Constraints

Not Null Constraints

Check Constraints
```

La aplicación no debe ser la única responsable de impedir inconsistencias estructurales.

Ejemplo conceptual:

```text
Un registro que depende de una entidad inexistente
```

debe ser protegido mediante una relación válida en la persistencia.

La validación en el backend complementa la integridad.

No la reemplaza.

---

# 9. Identificadores

Los identificadores técnicos deben distinguirse de los identificadores visibles o funcionales del negocio cuando ambos conceptos existan.

Conceptualmente:

```text
IDENTIFICADOR INTERNO
        ↓
Relaciones técnicas
Persistencia
Integridad
```

y:

```text
IDENTIFICADOR DE NEGOCIO
        ↓
Visualización
Búsqueda
Referencia humana
```

No debe asumirse automáticamente que ambos identificadores serán iguales.

La estrategia concreta de generación de identificadores deberá definirse antes de crear el esquema definitivo.

---

# 10. Fechas y tiempo

Las fechas deben conservarse según el significado real del dato.

No todas las fechas representan el mismo concepto.

Ejemplos:

```text
Fecha de compra

Fecha de producción

Fecha de creación del lote

Fecha de vencimiento

Fecha de venta

Fecha de pago

Fecha de registro
```

No deben utilizarse como un único concepto genérico.

Cada fecha debe conservar:

```text
Significado

Responsabilidad

Origen
```

Cuando la implementación técnica requiera manejar hora además de fecha, deberá evaluarse según la naturaleza del proceso.

No se debe convertir automáticamente toda fecha en un timestamp sin analizar su significado.

---

# 11. Unidades de medida

El sistema debe conservar claramente las unidades utilizadas por las cantidades.

No debe asumirse que todos los valores numéricos representan la misma unidad.

Ejemplos:

```text
Kilogramos

Gramos

Litros

Mililitros

Unidades

Onzas
```

La implementación debe respetar la lógica definida para:

```text
Insumos

Presentaciones

Recetas

Compras

Producción

Inventario
```

Antes de implementar conversiones automáticas debe existir una regla documentada que indique:

```text
Unidad origen

Unidad destino

Factor de conversión

Responsabilidad de la conversión
```

---

# 12. Valores monetarios

Los valores monetarios no deben implementarse utilizando tipos de precisión imprecisa.

No se debe utilizar un tipo de dato basado en aproximación binaria para representar dinero.

La implementación deberá utilizar una estrategia decimal adecuada tanto en:

```text
PostgreSQL
```

como en:

```text
Backend
```

La precisión definitiva deberá definirse antes de implementar cálculos económicos.

Esto aplica a:

```text
Precios

Costos

Valores de compra

Valores de venta

Pagos

Gastos

Rentabilidad
```

---

# 13. Cantidades y precisión

Las cantidades pueden requerir diferentes niveles de precisión.

Por ejemplo:

```text
1 unidad
```

no necesariamente requiere la misma precisión que:

```text
1.275 kilogramos
```

La implementación deberá establecer:

```text
Precisión permitida

Número de decimales

Unidad base

Reglas de conversión
```

Estas reglas no deben definirse arbitrariamente en cada módulo.

---

# 14. Redondeos

Los redondeos pueden afectar resultados económicos y operativos.

Por tanto, antes de implementar cálculos definitivos deberá definirse:

```text
Cuándo se redondea

Con cuántos decimales

Qué método se utiliza

Si el valor almacenado conserva
más precisión que el valor mostrado
```

La interfaz puede mostrar un valor redondeado.

Eso no significa necesariamente que el valor interno de cálculo deba perder precisión.

---

# 15. Prisma como capa de acceso

Prisma será utilizado para la comunicación entre el backend y PostgreSQL.

Prisma no debe determinar la estructura del dominio.

La secuencia conceptual es:

```text
LÓGICA DEL NEGOCIO
        ↓
MODELO DE DATOS
        ↓
ESQUEMA DE PERSISTENCIA
        ↓
PRISMA
```

No debe ocurrir:

```text
CREAR MODELOS PRISMA
        ↓
INVENTAR DESPUÉS
LA LÓGICA DEL NEGOCIO
```

El esquema deberá implementarse después de validar:

```text
Entidades

Relaciones

Integridad

Historial

Trazabilidad
```

---

# 16. Migraciones

Los cambios en la estructura de PostgreSQL deben realizarse mediante migraciones controladas.

No se debe modificar manualmente una base de datos y considerar esa modificación como parte oficial del sistema.

La secuencia debe ser:

```text
CAMBIO EN EL MODELO
        ↓
DECISIÓN DOCUMENTADA
        ↓
ACTUALIZACIÓN DEL ESQUEMA
        ↓
MIGRACIÓN
        ↓
PRUEBAS
```

Las migraciones forman parte de la historia técnica del sistema.

---

# 17. Seed y datos de prueba

Los datos iniciales y de prueba deben diferenciarse claramente.

Conceptualmente:

```text
DATOS NECESARIOS PARA EL SISTEMA
```

no son necesariamente iguales a:

```text
DATOS UTILIZADOS PARA PRUEBAS
```

No deben mezclarse datos ficticios con información necesaria para el funcionamiento normal sin una distinción clara.

La estrategia de:

```text
seed

fixtures

test data
```

se definirá durante la implementación técnica.

---

# 18. Validación en diferentes niveles

Una regla puede requerir validación en diferentes niveles.

Por ejemplo:

```text
FRONTEND
        ↓
Mejora experiencia del usuario
```

```text
BACKEND
        ↓
Protege reglas de negocio
```

```text
BASE DE DATOS
        ↓
Protege integridad estructural
```

Una validación visual no sustituye una validación de negocio.

La regla general es:

> **El frontend orienta al usuario; el backend protege el proceso; la base de datos protege la integridad estructural.**

---

# 19. Backend como autoridad del negocio

El backend debe ser la autoridad principal para:

```text
Reglas de negocio

Validaciones críticas

Coordinación de procesos

Autorizaciones

Persistencia controlada
```

El frontend no debe ser la única capa que determine si una operación es válida.

Incorrecto:

```text
Electron / React
        ↓
Decide si puede venderse
un producto vencido
```

Correcto:

```text
Frontend
        ↓
Solicita operación
        ↓
Backend
        ↓
Valida reglas
        ↓
Ejecuta o rechaza
```

---

# 20. Frontend y lógica de negocio

El frontend puede contener lógica relacionada con:

```text
Interacción

Estado visual

Formularios

Validación de experiencia

Presentación

Navegación
```

No debe convertirse en la fuente definitiva de reglas críticas.

Las reglas de negocio deben poder mantenerse aunque en el futuro exista:

```text
Cliente desktop

Cliente web

API externa

Otro consumidor
```

---

# 21. Electron como cliente de escritorio

Electron será responsable de proporcionar la aplicación de escritorio.

Su responsabilidad principal incluye:

```text
Ventana de aplicación

Integración con el sistema operativo

Carga del cliente frontend

Comunicación controlada
entre procesos cuando sea necesaria
```

Electron no debe absorber la lógica del negocio que pertenece al backend.

La arquitectura conceptual es:

```text
ELECTRON
        ↓
CLIENTE REACT
        ↓
API
        ↓
LÓGICA DEL NEGOCIO
        ↓
POSTGRESQL
```

---

# 22. Comunicación entre procesos de Electron

Cuando sea necesaria comunicación entre:

```text
Main Process
```

y:

```text
Renderer Process
```

debe utilizarse una interfaz controlada.

No debe exponerse libremente el acceso completo a:

```text
Node.js

Sistema operativo

Sistema de archivos
```

desde el proceso de interfaz.

La implementación deberá utilizar un mecanismo de comunicación explícito y limitado a las capacidades realmente necesarias.

---

# 23. React como interfaz

React será responsable de la construcción de la interfaz de usuario.

La organización deberá seguir el principio:

```text
GLOBAL
        │
        ├── app/
        ├── components/
        ├── assets/
        ├── hooks/
        ├── lib/
        └── styles/
```

y:

```text
ESPECÍFICO DE FUNCIONALIDAD
        ↓
features/<feature-name>/
```

Una funcionalidad debe mantener juntas sus responsabilidades específicas mientras no exista una necesidad real de extraerlas.

---

# 24. Componentes reutilizables

Un componente debe permanecer dentro de una feature mientras su responsabilidad sea específica de esa feature.

Ejemplo:

```text
features/presentations/
└── components/
    └── presentation-form.tsx
```

No debe moverse automáticamente a:

```text
components/
```

solo porque es un componente.

La extracción a un nivel global debe ocurrir cuando exista una necesidad real de reutilización o cuando represente una responsabilidad transversal claramente definida.

---

# 25. Contratos entre frontend y backend

La comunicación entre aplicaciones debe tener contratos explícitos.

Estos contratos pueden incluir:

```text
Request DTOs

Response DTOs

Tipos compartidos autorizados
```

La existencia de:

```text
packages/contracts
```

no significa que todos los tipos del backend deban compartirse automáticamente con el frontend.

Solo deben compartirse contratos que representen una necesidad real de comunicación entre aplicaciones.

El frontend no debe depender directamente de:

```text
Entidades internas

Repositorios

Modelos de Prisma

Implementación del dominio
```

---

# 26. Código compartido

El código no debe trasladarse prematuramente a:

```text
packages/shared
```

Una responsabilidad debe permanecer cerca de su contexto original hasta que exista una segunda necesidad real de reutilización.

La regla es:

```text
UNA UTILIZACIÓN
        ↓
Permanece local
```

```text
REUTILIZACIÓN REAL
        ↓
Evaluar extracción
```

Antes de mover código a un paquete compartido se debe evaluar:

```text
¿Es realmente genérico?

¿Tiene dependencias específicas?

¿Será utilizado por más de una aplicación o módulo?

¿La extracción reduce o aumenta el acoplamiento?
```

---

# 27. Configuración

La configuración técnica debe mantenerse separada de la lógica del negocio.

Conceptualmente:

```text
CONFIGURACIÓN TÉCNICA
```

incluye:

```text
Variables de entorno

Puertos

Credenciales

Configuración de conexión

Entornos de ejecución
```

Mientras que:

```text
CONFIGURACIÓN DEL NEGOCIO
```

incluye conceptos funcionales que el sistema pueda necesitar registrar o administrar.

Ambos conceptos no deben mezclarse.

---

# 28. Variables de entorno

Las credenciales y configuraciones sensibles no deben almacenarse directamente en el repositorio.

Debe existir una referencia como:

```text
.env.example
```

que indique las variables necesarias sin incluir secretos reales.

La implementación deberá validar la configuración necesaria al iniciar la aplicación cuando corresponda.

---

# 29. Errores

Los errores deben distinguir entre:

```text
Error de validación

Error de regla de negocio

Error de recurso inexistente

Error de autorización

Error de infraestructura
```

No todos los errores deben convertirse en una respuesta genérica.

La arquitectura de errores deberá permitir que el cliente reciba información controlada y consistente sin exponer detalles internos innecesarios.

---

# 30. Operaciones críticas

Las operaciones que modifican varias partes del sistema deben analizarse como una unidad.

Ejemplo conceptual:

```text
CONFIRMAR PRODUCCIÓN
        ↓
Registrar producción
        ↓
Registrar consumo de insumos
        ↓
Actualizar inventario
        ↓
Crear lote
        ↓
Registrar producto terminado
```

La implementación debe evitar que una parte del proceso quede confirmada mientras otra parte necesaria falla y deja el sistema en un estado inconsistente.

Cuando corresponda, deberá evaluarse el uso de transacciones de base de datos.

Otro ejemplo:

```text
CONFIRMAR VENTA
        ↓
Registrar venta
        ↓
Registrar detalle
        ↓
Registrar salida de inventario
```

Estas operaciones deberán analizarse como procesos completos.

---

# 31. Idempotencia y operaciones repetidas

Las operaciones críticas deben considerar qué ocurre si una solicitud es procesada más de una vez.

Ejemplos que requieren evaluación:

```text
Confirmar una producción

Confirmar una venta

Registrar un pago
```

El sistema debe evitar, cuando corresponda, que una misma operación produzca accidentalmente:

```text
Doble salida de inventario

Doble registro de pago

Duplicación de producción
```

La estrategia técnica concreta deberá definirse durante el diseño de cada caso de uso.

---

# 32. Estados y transiciones

Cuando una entidad tenga estados, las transiciones permitidas deben definirse explícitamente.

No debe permitirse que cualquier parte del sistema modifique un estado arbitrariamente.

Conceptualmente:

```text
ESTADO ACTUAL
        ↓
OPERACIÓN AUTORIZADA
        ↓
VALIDACIÓN
        ↓
NUEVO ESTADO
```

Las transiciones deberán respetar la documentación del módulo correspondiente.

---

# 33. Eliminación de datos

Antes de implementar eliminación física de registros debe evaluarse:

```text
¿Es un dato maestro?

¿Tiene operaciones históricas asociadas?

¿Es necesario conservar trazabilidad?

¿Debe desactivarse en lugar de eliminarse?
```

Los datos que participan en procesos históricos no deben eliminarse sin analizar las consecuencias sobre:

```text
Compras

Producción

Lotes

Inventario

Ventas

Pagos

Costos

Rentabilidad
```

La estrategia de eliminación o desactivación debe respetar las reglas documentadas de historial y trazabilidad.

---

# 34. Auditoría

No debe implementarse un sistema de auditoría genérico únicamente por anticipación.

Sin embargo, las operaciones que requieran trazabilidad deberán preservar la información definida en:

```text
04-history-and-traceability.md
```

Si durante la implementación se identifica la necesidad de registrar:

```text
Quién realizó una operación

Cuándo fue modificada

Qué valor existía anteriormente

Qué valor fue aplicado
```

deberá evaluarse una responsabilidad de auditoría específica.

La necesidad debe documentarse antes de introducir una infraestructura transversal de auditoría.

---

# 35. Eventos entre módulos

Los eventos no deben introducirse automáticamente.

Una operación puede comenzar como una coordinación directa cuando las responsabilidades son claras y están dentro de un proceso controlado.

Los eventos deben evaluarse cuando aparezca una necesidad real de desacoplar responsabilidades.

Ejemplo conceptual:

```text
OPERACIÓN
        ↓
PRODUCE UN HECHO
        ↓
VARIOS PROCESOS
INDEPENDIENTES REACCIONAN
```

La introducción de eventos deberá seguir los criterios definidos en:

```text
architecture-evolution.md
```

---

# 36. Consultas y comandos

Cuando un módulo crezca en complejidad puede ser necesario separar conceptualmente:

```text
OPERACIONES QUE MODIFICAN ESTADO
```

de:

```text
OPERACIONES QUE CONSULTAN INFORMACIÓN
```

Sin embargo, esta separación no debe crearse artificialmente para un CRUD simple.

La evolución debe responder a una necesidad identificada.

---

# 37. Rendimiento

No deben introducirse mecanismos de optimización prematuramente.

Antes de agregar:

```text
Cache

Redis

Materialized Views

Colas

Procesamiento asíncrono
```

debe existir una necesidad identificada.

El proceso correcto es:

```text
FUNCIONALIDAD CORRECTA
        ↓
MEDICIÓN
        ↓
IDENTIFICACIÓN DEL PROBLEMA
        ↓
DECISIÓN TÉCNICA
        ↓
OPTIMIZACIÓN
```

No:

```text
SUPOSICIÓN
        ↓
INFRAESTRUCTURA COMPLEJA
```

---

# 38. Pruebas

La implementación debe incluir pruebas progresivamente.

Las pruebas deben priorizar:

```text
Reglas críticas

Procesos con varias consecuencias

Cálculos económicos

Movimientos de inventario

Estados y transiciones

Historial y trazabilidad
```

No es necesario comenzar intentando alcanzar una cobertura artificial del 100 %.

La prioridad es proteger las partes donde un error puede producir inconsistencias en el negocio.

---

# 39. Documentación y código

Cuando se implemente una decisión importante, deberá verificarse si afecta alguno de estos documentos:

```text
docs/domains/

docs/data-model/

docs/architecture/

docs/decisions/

docs/project/
```

La documentación no debe convertirse en una descripción histórica desconectada del sistema.

Cuando una decisión funcional cambie:

```text
DOCUMENTACIÓN
        ↓
IMPLEMENTACIÓN
        ↓
PRUEBAS
```

deben mantenerse coherentes.

---

# 40. Proceso para introducir una nueva responsabilidad técnica

Cuando aparezca una necesidad de crear:

```text
Nueva carpeta

Nueva capa

Nuevo patrón

Nuevo paquete

Nueva dependencia

Nueva infraestructura
```

debe seguirse este procedimiento:

```text
1. IDENTIFICAR LA NECESIDAD

2. IDENTIFICAR LA RESPONSABILIDAD

3. REVISAR LA ARQUITECTURA EXISTENTE

4. VERIFICAR SI YA EXISTE UNA UBICACIÓN ADECUADA

5. EVALUAR SI LA NUEVA ESTRUCTURA ES NECESARIA

6. DOCUMENTAR LA DECISIÓN SI MODIFICA LA ARQUITECTURA

7. IMPLEMENTAR
```

No debe agregarse estructura únicamente porque:

```text
Es común

Se utiliza en otros proyectos

Parece más profesional

Podría ser útil en el futuro
```

---

# 41. Orden técnico recomendado de implementación

La implementación técnica no debe comenzar por la interfaz completa.

El orden general recomendado es:

```text
1. Configuración del monorepo

2. Configuración base del backend

3. Configuración de PostgreSQL y Prisma

4. Validación del esquema inicial

5. Migración inicial

6. Infraestructura base del backend

7. Implementación progresiva de módulos base

8. Implementación de operaciones

9. Reglas de inventario

10. Producción y lotes

11. Ventas y pagos

12. Costos y rentabilidad

13. Dashboard

14. Cliente desktop

15. Integración y pruebas completas
```

Este orden podrá ajustarse mediante:

```text
docs/project/development-order.md
```

si las dependencias reales entre módulos requieren una secuencia diferente.

---

# 42. Criterio para considerar una implementación terminada

Un módulo no debe considerarse terminado únicamente porque:

```text
Tiene pantallas

Tiene endpoints

Guarda datos
```

Un módulo estará funcionalmente terminado para una etapa cuando:

```text
Su responsabilidad está implementada.

Sus reglas principales están protegidas.

Sus relaciones están respetadas.

Su historial necesario está preservado.

Sus operaciones críticas son consistentes.

Sus cálculos pertenecen al responsable correcto.

Sus dependencias no contradicen
las reglas arquitectónicas.

La documentación relevante
refleja la implementación.
```

---

# 43. Regla final de implementación

La implementación técnica del sistema debe respetar el siguiente modelo:

```text
DOCUMENTACIÓN
        ↓
Define qué debe existir
```

```text
ARQUITECTURA
        ↓
Define dónde debe existir
```

```text
REGLAS DE EVOLUCIÓN
        ↓
Definen cuándo crear
nuevas responsabilidades
```

```text
IMPLEMENTACIÓN
        ↓
Convierte las decisiones
en código real
```

Por tanto, la regla final del proyecto es:

> **Ninguna decisión técnica debe alterar silenciosamente la lógica del negocio, el modelo de datos o las responsabilidades arquitectónicas. Cuando una necesidad obligue a modificar alguno de esos elementos, la decisión debe analizarse, documentarse y luego implementarse de forma coherente en todo el sistema.**
