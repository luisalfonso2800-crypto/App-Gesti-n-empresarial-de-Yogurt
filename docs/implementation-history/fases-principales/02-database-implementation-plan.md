# Plan de Implementación de la Base de Datos — V1

## 1. Propósito del documento

Este documento define el proceso mediante el cual el modelo de datos aprobado será traducido hacia una implementación real de persistencia para **App Gestión Empresarial de Yogurt**.

Su propósito no es diseñar nuevamente el modelo de datos ni inventar nuevas entidades. El modelo funcional, sus relaciones, reglas de integridad y requisitos de trazabilidad ya fueron documentados y validados.

La responsabilidad de esta etapa es realizar la traducción:

```text
MODELO DE NEGOCIO
        ↓
MODELO DE DATOS DOCUMENTADO
        ↓
MODELO DE PERSISTENCIA
        ↓
PRISMA SCHEMA
        ↓
MIGRACIONES
        ↓
BASE DE DATOS
```

La implementación debe conservar la fidelidad respecto a las decisiones previamente aprobadas.

---

# 2. Documentación de referencia

La implementación de persistencia debe consultar principalmente los siguientes documentos.

## 2.1. Modelo general

```text
docs/data-model/00-data-model-overview.md
```

Define la visión general del modelo de información.

---

## 2.2. Entidades

```text
docs/data-model/01-entities.md
```

Define las entidades identificadas y sus responsabilidades dentro del sistema.

Este documento será la referencia principal para determinar qué información requiere representación persistente.

---

## 2.3. Relaciones

```text
docs/data-model/02-relationships.md
```

Define las relaciones entre entidades.

La implementación deberá respetar:

* dependencias;
* cardinalidades;
* referencias;
* relaciones obligatorias;
* relaciones opcionales;
* relaciones históricas.

---

## 2.4. Reglas de integridad

```text
docs/data-model/03-data-integrity-rules.md
```

Define las reglas necesarias para preservar la consistencia de la información.

Estas reglas deberán analizarse para determinar dónde deben aplicarse:

```text
BASE DE DATOS
```

```text
PRISMA
```

```text
SERVICIO DE APLICACIÓN
```

o mediante una combinación de estas capas.

---

## 2.5. Historia y trazabilidad

```text
docs/data-model/04-history-and-traceability.md
```

Define qué información debe permanecer históricamente disponible y qué relaciones no deben perderse.

La implementación de persistencia no debe tratar toda la información como datos libremente modificables.

---

## 2.6. Decisiones del modelo

```text
docs/data-model/05-data-model-decisions.md
```

Este documento debe revisarse antes de tomar decisiones estructurales que puedan afectar el modelo aprobado.

---

## 2.7. Flujo de inventario

```text
docs/data-model/06-inventory-flow.md
```

Este documento es especialmente importante para las entidades relacionadas con:

```text
COMPRAS
```

```text
MOVIMIENTOS DE INVENTARIO
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

El modelo de persistencia debe permitir representar estos flujos sin perder su origen.

---

## 2.8. Procesos de negocio

```text
docs/data-model/07-business-processes.md
```

Debe utilizarse para comprender qué procesos generan o modifican información.

---

## 2.9. Reglas entre módulos

```text
docs/data-model/08-cross-module-rules.md
```

Debe utilizarse para identificar restricciones que no pertenecen a una sola entidad.

---

## 2.10. Responsabilidades de cálculo

```text
docs/data-model/09-calculation-responsibilities.md
```

Este documento es importante para evitar persistir como datos independientes valores que deben ser calculados.

Antes de crear una columna debe determinarse si representa:

```text
UN HECHO
```

o:

```text
UN RESULTADO CALCULADO
```

---

## 2.11. Notas de implementación técnica

```text
docs/data-model/10-technical-implementation-notes.md
```

Define consideraciones técnicas ya identificadas durante el modelado.

---

## 2.12. Validación del modelo

```text
docs/data-model/11-model-validation.md
```

Debe utilizarse como referencia para conocer las validaciones, ambigüedades y decisiones pendientes o resueltas durante la revisión del modelo.

---

## 2.13. Validación de fidelidad respecto al sistema maestro

```text
docs/data-model/12-vba-fidelity-validation.md
```

Este documento es una referencia crítica para garantizar que la implementación no contradiga la lógica originalmente establecida y validada.

Cuando exista una duda sobre si una decisión técnica altera la lógica histórica del sistema, deberá revisarse esta documentación.

---

# 3. Objetivo de la implementación

El objetivo no es crear una base de datos genérica para un sistema de gestión empresarial.

El objetivo es implementar la base de datos necesaria para representar correctamente el modelo específico de este proyecto.

La pregunta principal no debe ser:

```text
¿QUÉ PODRÍA NECESITAR UNA EMPRESA?
```

Debe ser:

```text
¿QUÉ INFORMACIÓN REQUIERE
EL MODELO APROBADO DEL SISTEMA?
```

Por lo tanto, no deben añadirse entidades por analogía con otros ERP, sistemas de inventario o aplicaciones empresariales.

---

# 4. Principio de traducción controlada

La traducción del modelo deberá seguir este proceso:

```text
DOCUMENTACIÓN
        ↓
ANÁLISIS DE LA ENTIDAD
        ↓
IDENTIFICACIÓN DE DATOS PERSISTENTES
        ↓
DEFINICIÓN DE RELACIONES
        ↓
DEFINICIÓN DE RESTRICCIONES
        ↓
IMPLEMENTACIÓN EN PRISMA
        ↓
VALIDACIÓN CONTRA EL MODELO
```

No debe realizarse directamente:

```text
IDEA
        ↓
PRISMA SCHEMA
        ↓
BASE DE DATOS
```

---

# 5. Tecnología de persistencia

La persistencia principal utilizará:

```text
PostgreSQL
```

La interacción con el modelo de persistencia utilizará:

```text
Prisma ORM
```

La estructura conceptual será:

```text
NESTJS
    ↓
CAPA DE APLICACIÓN
    ↓
PRISMA
    ↓
POSTGRESQL
```

Prisma será una herramienta de persistencia.

No será la fuente de verdad para definir las reglas del negocio.

---

# 6. Prisma Schema

El schema de Prisma será una representación técnica del modelo de persistencia.

Su responsabilidad será definir, según corresponda:

* modelos persistentes;
* campos;
* tipos;
* claves primarias;
* claves foráneas;
* relaciones;
* índices;
* restricciones soportadas;
* nombres físicos cuando sea necesario.

El schema no debe contener lógica de negocio que corresponda a los casos de uso.

La separación conceptual será:

```text
PRISMA
=
ESTRUCTURA Y RELACIONES DE PERSISTENCIA
```

```text
APLICACIÓN
=
REGLAS Y OPERACIONES DEL NEGOCIO
```

---

# 7. No existe una traducción automática uno a uno

Una entidad documentada no implica automáticamente un modelo Prisma idéntico.

Durante la implementación debe analizarse:

```text
ENTIDAD DE NEGOCIO
        ↓
¿REQUIERE PERSISTENCIA?
        ↓
¿QUÉ DATOS SON HECHOS?
        ↓
¿QUÉ DATOS SON CALCULADOS?
        ↓
¿QUÉ RELACIONES DEBEN PERSISTIR?
        ↓
MODELO DE PERSISTENCIA
```

Asimismo, una tabla anterior del sistema VBA no debe copiarse automáticamente como un modelo final.

El proceso debe respetar la lógica validada, no necesariamente la forma técnica original de Excel.

---

# 8. Inventario inicial de entidades

La implementación debe comenzar elaborando un inventario técnico basado exclusivamente en:

```text
docs/data-model/01-entities.md
```

Para cada entidad se deberá registrar:

```text
Nombre de la entidad
```

```text
Responsabilidad
```

```text
Persistencia requerida
```

```text
Identificador
```

```text
Campos persistentes
```

```text
Campos calculados
```

```text
Relaciones
```

```text
Reglas de integridad
```

```text
Requisitos históricos
```

```text
Módulo responsable
```

Este inventario será el paso previo a la escritura del schema.

---

# 9. Clasificación de información

Antes de crear los campos del modelo deben clasificarse los datos.

## 9.1. Datos maestros

Representan información relativamente estable utilizada por otros procesos.

Entre ellos se encuentran las entidades maestras documentadas en los módulos correspondientes.

Su comportamiento deberá respetar las reglas de modificación y uso histórico definidas en la documentación.

---

## 9.2. Datos transaccionales

Representan hechos u operaciones ocurridas en el negocio.

Ejemplos conceptuales dentro del modelo documentado incluyen operaciones relacionadas con:

```text
COMPRAS
```

```text
PRODUCCIÓN
```

```text
VENTAS
```

```text
PAGOS
```

```text
GASTOS
```

Estos registros requieren especial atención respecto a:

* fecha;
* origen;
* detalle;
* relaciones históricas;
* valores registrados en el momento de la operación.

---

## 9.3. Datos de detalle

Representan componentes de una operación principal.

Conceptualmente:

```text
OPERACIÓN PRINCIPAL
        ↓
DETALLE
```

La persistencia debe impedir, cuando corresponda, la existencia de detalles sin una operación válida de origen.

---

## 9.4. Datos de movimiento

Representan cambios producidos por operaciones válidas.

Esto es especialmente relevante para:

```text
INVENTARIO
```

Los movimientos deben mantener una relación trazable con la operación que los produjo según las reglas documentadas.

---

## 9.5. Datos históricos

Representan información que debe conservarse como evidencia de un hecho ocurrido.

Estos datos no deben tratarse igual que los valores maestros modificables.

---

## 9.6. Datos calculados

Representan resultados derivados de otros datos.

Antes de persistirlos debe analizarse si:

```text
DEBEN CALCULARSE BAJO DEMANDA
```

o si existe una razón documentada para:

```text
CONSERVAR EL RESULTADO HISTÓRICO
```

No deben duplicarse cálculos sin una justificación funcional.

---

# 10. Identificadores

Cada entidad persistente debe contar con una estrategia clara de identificación.

La implementación deberá distinguir entre:

```text
IDENTIFICADOR TÉCNICO
```

y:

```text
IDENTIFICADOR FUNCIONAL
```

cuando ambos sean necesarios.

El identificador técnico permite mantener relaciones internas de forma estable.

El identificador funcional representa un código o referencia utilizada dentro de la operación del sistema cuando el modelo así lo requiera.

La decisión concreta para cada entidad deberá respetar:

```text
01-entities.md
```

y las decisiones previamente documentadas.

No debe asumirse que todos los identificadores funcionales deben sustituir las claves técnicas de persistencia.

---

# 11. Claves primarias

Cada modelo persistente debe tener una clave primaria estable.

La elección concreta de su tipo debe realizarse de manera coherente en todo el sistema.

No se deben mezclar estrategias de identificación sin una razón técnica o funcional documentada.

La estrategia elegida deberá permitir:

* relaciones estables;
* trazabilidad;
* migraciones;
* referencias internas;
* crecimiento futuro razonable.

---

# 12. Identificadores funcionales y generación de códigos

Cuando el modelo requiera códigos funcionales, debe determinarse:

```text
¿QUIÉN GENERA EL CÓDIGO?
```

```text
¿CUÁNDO SE GENERA?
```

```text
¿PUEDE CAMBIAR?
```

```text
¿DEBE SER ÚNICO?
```

```text
¿TIENE SIGNIFICADO PARA EL NEGOCIO?
```

La generación de códigos no debe depender de contar registros existentes de forma insegura.

Conceptualmente, debe evitarse una estrategia como:

```text
COUNT(registros) + 1
```

cuando pueda producir colisiones o reutilización.

La estrategia definitiva deberá implementarse de acuerdo con los requisitos funcionales documentados.

---

# 13. Relaciones

Las relaciones deben implementarse basándose en:

```text
docs/data-model/02-relationships.md
```

Para cada relación debe identificarse:

```text
ENTIDAD DE ORIGEN
```

```text
ENTIDAD RELACIONADA
```

```text
CARDINALIDAD
```

```text
OBLIGATORIEDAD
```

```text
PROPIEDAD DE LA RELACIÓN
```

```text
COMPORTAMIENTO HISTÓRICO
```

```text
RESTRICCIONES DE MODIFICACIÓN
```

La conveniencia técnica de Prisma no debe alterar una cardinalidad documentada.

---

# 14. Eliminación y relaciones históricas

Las relaciones deben analizarse especialmente antes de definir comportamientos de eliminación.

No debe configurarse automáticamente:

```text
CASCADE
```

para todas las relaciones.

Cada caso debe determinar:

```text
¿EL REGISTRO PUEDE ELIMINARSE?
```

```text
¿EXISTEN TRANSACCIONES QUE LO REFERENCIAN?
```

```text
¿LA ELIMINACIÓN ROMPE TRAZABILIDAD?
```

```text
¿DEBE RESTRINGIRSE?
```

```text
¿DEBE UTILIZARSE UNA DESACTIVACIÓN LÓGICA?
```

La estrategia dependerá de la responsabilidad de cada entidad y de las reglas documentadas.

---

# 15. Eliminación física y desactivación

La base de datos no debe asumir un único mecanismo para todos los registros.

Deben distinguirse al menos conceptualmente:

```text
DATOS MAESTROS SIN HISTORIA
```

```text
DATOS MAESTROS CON REFERENCIAS HISTÓRICAS
```

```text
DATOS TRANSACCIONALES
```

```text
DATOS DE TRAZABILIDAD
```

La decisión sobre eliminación física, restricción o desactivación debe respetar las reglas de integridad e historial existentes.

No debe añadirse un campo genérico:

```text
deletedAt
```

a todas las entidades únicamente como patrón técnico.

---

# 16. Integridad en múltiples capas

Las reglas de integridad no pertenecen todas a la misma capa.

La estrategia general será:

```text
BASE DE DATOS
```

para proteger restricciones estructurales fundamentales.

```text
PRISMA
```

para representar correctamente modelos y relaciones.

```text
APLICACIÓN
```

para validar reglas de negocio y procesos dependientes del contexto.

Ejemplo conceptual:

```text
CAMPO OBLIGATORIO
        ↓
ESTRUCTURA DE DATOS
```

```text
RELACIÓN OBLIGATORIA
        ↓
BASE DE DATOS / MODELO
```

```text
OPERACIÓN PERMITIDA SOLO EN CIERTO ESTADO
        ↓
LÓGICA DE NEGOCIO
```

La misma regla no debe duplicarse innecesariamente en todas las capas.

---

# 17. Restricciones de unicidad

Las restricciones únicas deben aplicarse únicamente cuando la documentación determine que un valor representa una identidad o referencia que no puede duplicarse.

Para cada restricción debe responderse:

```text
¿EL VALOR ES REALMENTE ÚNICO?
```

```text
¿LA UNICIDAD ES GLOBAL?
```

```text
¿LA UNICIDAD DEPENDE DE OTRO CAMPO?
```

```text
¿EXISTEN CASOS HISTÓRICOS QUE DEBAN PERMITIR DUPLICADOS?
```

No debe marcarse automáticamente como único:

```text
nombre
```

porque podría existir más de una entidad con una denominación similar.

---

# 18. Índices

Los índices deben añadirse por razones concretas.

Las fuentes principales para identificar necesidades iniciales serán:

* relaciones frecuentes;
* claves foráneas;
* identificadores funcionales;
* consultas críticas documentadas;
* procesos de inventario;
* procesos de trazabilidad.

No deben añadirse índices indiscriminadamente a todos los campos.

La estrategia inicial será:

```text
RELACIÓN O CONSULTA CONCRETA
        ↓
JUSTIFICACIÓN
        ↓
ÍNDICE
```

---

# 19. Tipos de datos

Los tipos de datos deben representar correctamente el significado de la información.

Debe evitarse almacenar indiscriminadamente:

```text
NÚMEROS COMO TEXTO
```

```text
FECHAS COMO TEXTO
```

```text
VALORES MONETARIOS COMO FLOAT
```

```text
ESTADOS COMO TEXTO LIBRE
```

La elección concreta deberá respetar el significado del dato.

---

# 20. Valores monetarios

Los valores relacionados con:

```text
PRECIOS
```

```text
COSTOS
```

```text
IMPORTES
```

```text
PAGOS
```

```text
GASTOS
```

deben utilizar una representación adecuada para evitar errores derivados de precisión binaria.

La implementación deberá utilizar una estrategia consistente para valores monetarios.

No deben utilizarse tipos de punto flotante para representar dinero.

La precisión concreta deberá determinarse de forma coherente antes de consolidar el schema.

---

# 21. Cantidades y unidades

Las cantidades utilizadas por el sistema deben mantener coherencia con las unidades definidas por el modelo de negocio.

No debe suponerse que todas las cantidades pueden almacenarse como enteros.

La implementación debe revisar los requerimientos relacionados con:

```text
UNIDADES
```

```text
PESO
```

```text
VOLUMEN
```

```text
PRESENTACIONES
```

```text
RENDIMIENTOS
```

La precisión necesaria debe ser suficiente para representar correctamente las operaciones documentadas.

---

# 22. Fechas

Las fechas deben modelarse según su significado.

Deben diferenciarse conceptualmente:

```text
FECHA DE CREACIÓN DEL REGISTRO
```

```text
FECHA DEL HECHO DE NEGOCIO
```

```text
FECHA DE CREACIÓN DEL LOTE
```

```text
FECHA DE VENCIMIENTO
```

Estas fechas no deben utilizarse como equivalentes.

En particular, la fecha técnica de creación de un registro no sustituye una fecha funcional del negocio.

---

# 23. Lotes y fechas históricas

La persistencia de lotes deberá respetar expresamente los requisitos documentados.

Cada lote debe poder conservar, según el modelo aprobado:

```text
FECHA DE CREACIÓN DEL LOTE
```

```text
FECHA DE VENCIMIENTO
```

y las relaciones necesarias para su trazabilidad.

Estas fechas representan hechos funcionales y deben permanecer diferenciadas de los timestamps técnicos del registro.

---

# 24. Timestamps técnicos

La estrategia para timestamps técnicos debe definirse de forma consistente.

Conceptualmente, puede ser necesario distinguir:

```text
createdAt
```

como registro técnico de creación.

Y, cuando corresponda:

```text
updatedAt
```

como registro técnico de última modificación.

Estos campos no sustituyen las fechas específicas del negocio.

Su uso debe justificarse por necesidades de auditoría técnica, mantenimiento o control de modificaciones.

---

# 25. Estados

Cuando una entidad tenga estados definidos por el modelo, estos no deben representarse como texto libre sin control.

La implementación debe definir una estrategia consistente que permita representar únicamente los estados válidos para cada entidad.

La validación de transiciones continúa perteneciendo a la lógica de negocio.

Conceptualmente:

```text
MODELO DE DATOS
        ↓
ESTADOS VÁLIDOS
```

```text
LÓGICA DE NEGOCIO
        ↓
TRANSICIONES PERMITIDAS
```

---

# 26. Inventario

La implementación del inventario debe respetar el flujo documentado.

El modelo debe permitir identificar:

```text
QUÉ OPERACIÓN PRODUJO EL CAMBIO
```

```text
QUÉ ELEMENTO FUE AFECTADO
```

```text
QUÉ TIPO DE MOVIMIENTO OCURRIÓ
```

```text
CUÁNDO OCURRIÓ
```

```text
QUÉ RELACIÓN EXISTE CON EL ORIGEN
```

La persistencia no debe reducir el inventario a un único campo editable sin historial cuando el modelo documentado requiere trazabilidad.

---

# 27. Operaciones transaccionales

Las operaciones que afectan múltiples registros deberán identificarse antes de su implementación.

La referencia será:

```text
docs/backend/05-transaction-boundaries.md
```

Conceptualmente:

```text
OPERACIÓN
    ↓
MÚLTIPLES CAMBIOS
    ↓
TRANSACCIÓN
```

Entre los procesos que deberán analizarse se encuentran los módulos documentados relacionados con:

```text
COMPRAS
```

```text
INVENTARIO
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

```text
PAGOS
```

La existencia de una transacción no debe decidirse únicamente por conveniencia técnica.

Debe responder a la necesidad de mantener la consistencia del proceso.

---

# 28. Migraciones

Las modificaciones estructurales de la base de datos deberán realizarse mediante migraciones.

La secuencia será:

```text
CAMBIO DOCUMENTADO
        ↓
ACTUALIZACIÓN DEL MODELO
        ↓
CAMBIO EN PRISMA
        ↓
MIGRACIÓN
        ↓
VALIDACIÓN
```

No debe modificarse directamente la base de datos de desarrollo y posteriormente intentar reconstruir la historia.

Las migraciones deben representar la evolución controlada del esquema.

---

# 29. Primera migración

La primera migración no debe crearse automáticamente antes de validar el schema completo correspondiente a la primera etapa funcional.

Antes de crearla debe verificarse:

```text
✓ Entidades incluidas.
```

```text
✓ Campos incluidos.
```

```text
✓ Tipos de datos.
```

```text
✓ Relaciones.
```

```text
✓ Restricciones.
```

```text
✓ Reglas estructurales.
```

```text
✓ Requisitos de trazabilidad.
```

La primera migración debe representar una decisión técnica validada, no un experimento.

---

# 30. Implementación incremental del schema

El schema no tiene que contener necesariamente todas las entidades del sistema desde el primer momento.

La implementación podrá avanzar por etapas, siempre que las migraciones y dependencias se mantengan coherentes.

La secuencia conceptual será:

```text
MODELO BASE
        ↓
MIGRACIÓN
        ↓
IMPLEMENTACIÓN DE MÓDULOS
        ↓
NUEVA NECESIDAD APROBADA
        ↓
EVOLUCIÓN DEL MODELO
        ↓
NUEVA MIGRACIÓN
```

La decisión de implementar incrementalmente no autoriza a improvisar relaciones temporales.

Cada etapa debe ser consistente por sí misma.

---

# 31. Datos semilla

Los datos semilla no deben confundirse con los datos maestros reales del negocio.

Deben distinguirse:

```text
CONFIGURACIÓN TÉCNICA NECESARIA
```

de:

```text
DATOS OPERATIVOS REALES
```

Los datos del negocio deben registrarse mediante los mecanismos funcionales correspondientes cuando estos existan.

No deben utilizarse seeds como sustituto permanente de módulos no implementados.

---

# 32. Base de datos de desarrollo

El entorno de desarrollo debe permitir:

```text
crear la estructura
```

```text
aplicar migraciones
```

```text
reinicializar datos cuando sea necesario
```

```text
ejecutar pruebas
```

sin alterar el modelo documentado.

La configuración debe permanecer separada del código y no depender de información personal o local versionada en el repositorio.

---

# 33. Base de datos de pruebas

La estrategia de pruebas deberá considerar un entorno aislado.

Las pruebas no deben depender de los datos manuales de una base de desarrollo compartida.

Conceptualmente:

```text
PRUEBA
    ↓
ENTORNO CONTROLADO
    ↓
DATOS CONTROLADOS
    ↓
EJECUCIÓN
    ↓
LIMPIEZA / AISLAMIENTO
```

La implementación concreta se definirá cuando se establezca el plan de pruebas.

---

# 34. Validación del modelo implementado

Antes de considerar válida una etapa de persistencia debe realizarse una revisión cruzada.

La comparación será:

```text
DOCUMENTACIÓN DEL DOMINIO
        ↓
MODELO DE DATOS
        ↓
PRISMA SCHEMA
        ↓
BASE DE DATOS RESULTANTE
```

La validación debe responder:

```text
¿FALTA ALGUNA ENTIDAD DOCUMENTADA?
```

```text
¿EXISTE ALGUNA ENTIDAD NO DOCUMENTADA?
```

```text
¿LAS RELACIONES COINCIDEN?
```

```text
¿LAS CARDINALIDADES COINCIDEN?
```

```text
¿LAS FECHAS FUNCIONALES ESTÁN DIFERENCIADAS?
```

```text
¿LOS REQUISITOS DE TRAZABILIDAD ESTÁN REPRESENTADOS?
```

```text
¿SE HAN PERSISTIDO DATOS QUE DEBERÍAN CALCULARSE?
```

```text
¿SE HAN OMITIDO DATOS HISTÓRICOS?
```

```text
¿SE HAN INTRODUCIDO DECISIONES NUEVAS?
```

---

# 35. Procedimiento ante diferencias

Si se detecta una diferencia entre la documentación y el schema, no debe corregirse automáticamente sin análisis.

El procedimiento será:

```text
DIFERENCIA DETECTADA
        ↓
IDENTIFICAR DOCUMENTOS AFECTADOS
        ↓
REVISAR DECISIONES PREVIAS
        ↓
DETERMINAR SI ES:
    - error de implementación
    - ambigüedad documental
    - evolución necesaria
        ↓
TOMAR DECISIÓN
        ↓
DOCUMENTAR
        ↓
IMPLEMENTAR
```

---

# 36. Prohibición de entidades especulativas

No deben añadirse entidades porque:

```text
SON COMUNES EN UN ERP
```

```text
PODRÍAN SERVIR EN EL FUTURO
```

```text
OTROS SISTEMAS LAS UTILIZAN
```

```text
PARECEN NECESARIAS PARA ESCALAR
```

Cualquier nueva entidad debe responder a una necesidad funcional concreta.

La regla será:

```text
NECESIDAD DOCUMENTADA
        ↓
MODELO
        ↓
PERSISTENCIA
```

---

# 37. Prohibición de campos especulativos

Tampoco deben añadirse campos como:

```text
metadata
```

```text
settings
```

```text
extraData
```

```text
customFields
```

únicamente para anticipar futuras necesidades.

La flexibilidad genérica no debe utilizarse como sustituto de un modelo claro.

---

# 38. Responsabilidad del modelo de persistencia

La base de datos será responsable de conservar correctamente los hechos necesarios para operar el sistema.

No será responsable de sustituir:

```text
SERVICIOS DE NEGOCIO
```

```text
CASOS DE USO
```

```text
VALIDACIONES CONTEXTUALES
```

```text
CÁLCULOS DE PRESENTACIÓN
```

La persistencia debe mantener una separación clara entre almacenar información y decidir cómo funciona todo el negocio.

---

# 39. Orden de trabajo

La implementación de persistencia deberá avanzar en este orden:

```text
1. Revisar entidades documentadas.
```

```text
2. Clasificar la información.
```

```text
3. Identificar dependencias.
```

```text
4. Definir estrategia de identificadores.
```

```text
5. Definir tipos de datos.
```

```text
6. Definir relaciones.
```

```text
7. Definir restricciones estructurales.
```

```text
8. Definir necesidades de historial.
```

```text
9. Definir índices iniciales.
```

```text
10. Construir el schema.
```

```text
11. Validar contra la documentación.
```

```text
12. Crear la migración correspondiente.
```

```text
13. Verificar la base de datos resultante.
```

---

# 40. Criterio de finalización

La etapa de implementación de base de datos estará suficientemente preparada cuando:

```text
✓ La estrategia de persistencia esté definida.
```

```text
✓ Las entidades a implementar estén identificadas.
```

```text
✓ Las relaciones estén verificadas.
```

```text
✓ Los identificadores tengan una estrategia clara.
```

```text
✓ Los tipos monetarios y cuantitativos estén definidos.
```

```text
✓ Las fechas funcionales estén diferenciadas de los timestamps técnicos.
```

```text
✓ Los requisitos de trazabilidad estén representados.
```

```text
✓ Las restricciones estructurales estén identificadas.
```

```text
✓ La estrategia de migraciones esté definida.
```

```text
✓ El schema pueda contrastarse contra la documentación aprobada.
```

El resultado esperado será una base técnica preparada para implementar el modelo real sin volver a diseñarlo desde cero.

---

# 41. Relación con la siguiente etapa

Una vez definida la estrategia de implementación de la base de datos, el siguiente paso será establecer el orden concreto en que los módulos deben desarrollarse.

La secuencia será:

```text
00-implementation-overview.md
        ↓
01-backend-bootstrap.md
        ↓
02-database-implementation-plan.md
        ↓
03-module-implementation-order.md
        ↓
IMPLEMENTACIÓN DEL SISTEMA
```

El orden de los módulos deberá basarse en sus dependencias reales y no únicamente en el orden numérico de la documentación.

---

# 42. Estado del documento

```text
Documento: 02-database-implementation-plan.md
Versión: V1
Estado: PLAN DE TRADUCCIÓN DEL MODELO HACIA PERSISTENCIA
Dependencias:
- 00-implementation-overview.md
- 01-backend-bootstrap.md
- docs/data-model/
- docs/backend/

Siguiente etapa:
03-module-implementation-order.md
```

La implementación de la base de datos deberá ser una traducción controlada del modelo aprobado. Cualquier diferencia significativa entre documentación, schema o migraciones deberá analizarse y documentarse antes de consolidarse.
