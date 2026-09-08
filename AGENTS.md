# REGLAS GLOBALES DEL PROYECTO (STRICT)

### 0. PRINCIPIO FUNDAMENTAL DE EJECUCIÓN

* Hacer exactamente lo necesario para completar correctamente la tarea asignada.
* Ni menos, porque el sistema no debe quedar roto ni con cabos sueltos.
* Ni más, porque el proyecto no debe sufrir refactorizaciones ni cambios especulativos no solicitados.
* **Prioridad Absoluta:**
`INTEGRIDAD DEL SISTEMA > CUMPLIMIENTO DE LA TAREA > CALIDAD DE IMPLEMENTACIÓN > MEJORAS FUTURAS`.
* Toda acción y comando ejecutado debe tener una justificación técnica o funcional directamente ligada al objetivo de la tarea actual.

---

## BLOQUE I: CONVENCIONES TÉCNICAS Y ENTORNO

### 1. ENTORNO Y COMANDOS

* Usa EXCLUSIVAMENTE `pnpm --filter api exec ...` para Prisma. NUNCA uses `npx`.
* Prohibido ejecutar `prisma migrate` o alterar la base de datos real sin control.
* **Sincronización y Aviso Obligatorio de Tablas:** Cada vez que agregues o modifiques un modelo o tabla en `apps/api/prisma/schema.prisma`, DEBES notificar explícitamente al usuario al finalizar la tarea con las instrucciones exactas para ejecutar `pnpm --filter api exec prisma db push` y `pnpm --filter api exec prisma generate` para evitar desincronizaciones de base de datos.
* **Modo Rápido Obligatorio:** Prohibido ejecutar `pnpm build` o purgar la caché (`.next`) para comprobaciones rápidas. Toda validación estática ligera debe realizarse mediante `node --check` sobre los archivos modificados.

### 2. ARQUITECTURA Y EJECUCIÓN (BACKEND)

* El código backend reside en `apps/api/`. El schema está en `apps/api/prisma/schema.prisma`.
* No modificar `apps/api/src/` **fuera del alcance** de la fase o tarea actual.
* Si la tarea requiere explícitamente modificar backend para completar la funcionalidad, la modificación está permitida siempre que:
1. Sea necesaria para cumplir el objetivo técnico de la tarea.
2. Respete la arquitectura existente (Controller → Service → Repository).
3. No rompa contratos existentes.
4. Sea validada posteriormente.


* Prohibido introducir entidades o funcionalidades ajenas al objetivo de la fase.
* Las tareas deben ejecutarse como bloques completos sin detenerse por confirmaciones intermedias, salvo bloqueos reales de diseño o seguridad.

### 3. REGLA DE DETENCIÓN

* Solo detente ante errores irresolubles o bloqueos reales de diseño. Si hay un error de sintaxis en Prisma o JavaScript introducido por ti, corrígelo de inmediato.

### 4. MANEJO DE ICONOS (FRONTEND)

* Busca y reutiliza primero los iconos de `lucide-react` o los exportados en `@/components/ui/icons`.
* Si no existe un icono representativo en `lucide-react`, créalo como componente SVG accesible y agrégalo directamente a `@/components/ui/icons` para centralizarlo.
* NUNCA incrustes SVGs en línea dentro de las páginas o subcomponentes.

### 5. SISTEMA DE RUTAS, PATH ALIASES Y MIGRACIÓN OPORTUNISTA ACOTADA

* Usa SIEMPRE alias canónicos (`@/*`) para imports (ej. `@/components/...`, `@/lib/api-client`, `@/hooks/...`).
* Queda TERMINANTEMENTE PROHIBIDO el uso de rutas relativas profundas (como `../../../../`). Si un alias falta en `apps/web/jsconfig.json`, agrégalo de inmediato.
* Las únicas rutas relativas permitidas (`./` o `../`) son las estrictamente co-locadas dentro de la misma carpeta de submódulo (ej. `./hooks/...`, `../new-purchase.module.css`).
* **Migración Oportunista Acotada:** Si el archivo que estás modificando obligatoriamente contiene rutas relativas profundas, corrígelas reemplazándolas por `@/*`. No saltes a limpiar archivos externos a la tarea actual.

### 6. ARQUITECTURA MODULAR Y RESPONSABILIDAD ÚNICA (FRONTEND)

* Toda pantalla en `apps/web/src/app` debe seguir el patrón de 3 capas delimitadas:
* **`page.jsx` (Orquestador Visual):** Exclusivamente layout y delegación declarativa. Debe tener menos de 100-120 líneas. Prohibido incluir sentencias `fetch`, procesamiento matemático pesado o múltiples estados acoplados.
* **`hooks/`:** Carpeta co-locada para Custom Hooks que encapsulen peticiones asíncronas, sincronizaciones con Storage, lógica de negocio y estados complejos del formulario.
* **`components/`:** Carpeta co-locada con componentes de presentación puramente declarativos ("dumb components") que reciben datos y manejadores únicamente a través de props.



### 7. COMENTARIOS EXHAUSTIVOS Y TRAZABILIDAD EMPRESARIAL (JSDOC)

* Todo archivo `.js` o `.jsx` creado o refactorizado debe iniciar obligatoriamente con el bloque JSDoc en la cabecera:
```javascript
/**
 * @file [NombreDelArchivo.jsx]
 * @module [Modulo/Submodulo]
 * @description [Propósito puntual del componente o hook]
 * @responsibility [Qué hace y qué NO debe hacer]
 * @usedBy [Rutas exactas de los archivos que lo consumen]
 * @dependencies [Librerías, cliente API, iconos o módulos requeridos]
 */

```


* **Comentarios Internos Línea a Línea:** Comenta minuciosamente cada función, hook, cálculo matemático, condición de guarda, efecto (`useEffect`) y handler de eventos, explicando el porqué técnico y el impacto de negocio para que cualquier desarrollador o IA comprenda el flujo de inmediato sin ambigüedades.

### 8. LENGUAJE, ESTILOS Y TEMPLATES

* Exclusivamente JavaScript nativo (`.js`, `.jsx`). PROHIBIDO introducir TypeScript (`.ts`, `.tsx`).
* Estilizado estricto mediante CSS Modules (`.module.css`). Prohibido alterar nombres de clases existentes o añadir dependencias externas de UI que rompan el diseño actual.
* Al manipular o generar código mediante scripts de automatización, NUNCA escapes comillas invertidas (`) ni interpolaciones (${}) dentro de template strings para evitar errores de parseo (`Expected unicode escape`).

### 9. COMUNICACIÓN HTTP Y RED

* Toda llamada a la API debe realizarse mediante la instancia centralizada del cliente (`@/lib/api-client` o `@/lib/api`).
* Resuelve siempre contra las rutas canónicas versionadas del backend (`/api/v1/...`).

---

## BLOQUE II: INGENIERÍA, INTEGRIDAD Y MODELADO

### 10. FUENTE DE VERDAD DEL PROYECTO

* La aplicación existente es la fuente de verdad funcional del sistema.
* Antes de diseñar o modificar un módulo existente, la IA DEBE inspeccionar:
1. El modelo de datos actualmente utilizado (`schema.prisma`).
2. Los endpoints actualmente disponibles en el backend.
3. El cliente API existente y sus contratos.
4. La implementación frontend existente.
5. Las relaciones reales entre módulos.


* NO debe asumir que una funcionalidad existe porque aparezca mencionada en documentación antigua, prompts, planes anteriores o especificaciones históricas.
* Si existe contradicción entre documentación antigua y código funcional actual, prevalece el código y la estructura actualmente ejecutada.
* La documentación solo puede utilizarse como contexto adicional, nunca como sustituto de la realidad del proyecto.
* Antes de proponer una modificación estructural, la IA DEBE identificar qué módulos existentes dependen de ella.

### 11. VALIDACIÓN REAL — NO CONFUNDIR BUILD CON FUNCIONALIDAD

* Que el proyecto compile NO significa que la funcionalidad esté terminada.
* Toda tarea DEBE validarse en tres niveles cuando corresponda:
1. Sintaxis/código.
2. Integración frontend ↔ API ↔ base de datos.
3. Comportamiento funcional esperado.


* La IA NO puede reportar una funcionalidad como "OK" si únicamente verificó que el archivo compila.
* Si una validación funcional no puede ejecutarse, debe reportarse explícitamente como "NO VERIFICADA".
* Está PROHIBIDO declarar "COMPLETADA", "FUNCIONAL", "OK" o "LISTO PARA PRODUCCIÓN" basándose únicamente en un build exitoso o sintaxis limpia.

### 12. INTEGRIDAD Y DUPLICACIÓN DE DATOS

* Ningún seed, script de prueba o proceso de inicialización puede insertar datos duplicados accidentalmente.
* Antes de modificar un seed, la IA DEBE determinar si su ejecución es:
1. Idempotente.
2. Acumulativa intencionalmente.
3. Destructiva.


* Los seeds de prueba DEBEN ser idempotentes o limpiar explícitamente los datos que ellos mismos generan.
* NUNCA debe eliminar datos existentes de una base de datos sin identificar previamente el alcance y finalidad de dicha eliminación.
* Cuando exista riesgo de duplicación, la IA DEBE verificar la existencia previa mediante identificadores o claves únicas antes de insertar.
* Las relaciones entre entidades deben utilizar siempre los identificadores reales provenientes de la base de datos.
* NUNCA se deben inventar IDs, UUIDs o relaciones únicamente para hacer funcionar la interfaz.

### 13. RELACIONES ENTRE ENTIDADES (UI HUMANA)

* Ningún usuario debe tener que escribir manualmente un UUID o ID interno cuando la relación pueda seleccionarse desde una entidad existente.
* Los IDs internos son identificadores técnicos y NO son información de entrada normal para el usuario.
* Para relaciones entre entidades se DEBEN utilizar selectores, búsquedas, autocompletado o componentes equivalentes.
* El frontend debe mostrar información humana de la entidad relacionada (ej. `Producto: Yogurt Fresa 1L`), no únicamente su UUID (`ID Producto: 7cb221eb-e5e5...`).
* El backend DEBE validar que las entidades relacionadas existan y sean compatibles antes de persistir la operación.
* Nunca se debe solucionar un problema de relación mostrando el UUID directamente al usuario.

### 14. ANÁLISIS DE IMPACTO OBLIGATORIO

* Antes de modificar una entidad, tabla, endpoint o estructura utilizada por otros módulos, la IA DEBE identificar sus dependencias.
* Como mínimo debe revisar:
* Base de datos.
* Backend.
* Frontend.
* Cliente API.
* Seeds.
* Módulos consumidores.
* Relaciones con inventario, producción, compras, ventas y costos cuando correspondan.


* Ningún cambio estructural debe implementarse de forma aislada si afecta un flujo existente.
* Si un cambio rompe una dependencia existente, la IA DEBE corregir la dependencia dentro de la misma fase cuando esté dentro de su alcance.
* No se permite dejar deliberadamente una estructura nueva incompatible con el módulo que actualmente la consume.

### 15. VALIDACIÓN DE FLUJOS DE NEGOCIO COMPLETOS

* Las funcionalidades que formen parte de un flujo empresarial deben validarse de extremo a extremo:
* `Compra → Inventario`
* `Receta → Producción → Inventario → Lote`
* `Venta → Inventario → Lote`
* `Venta → Pago`
* `Producto → Receta → Producción`


* No se considera terminada una funcionalidad si únicamente funciona su pantalla aislada pero no su flujo empresarial.
* Cuando una fase modifique un flujo existente, la IA DEBE verificar que las operaciones anteriores continúen funcionando.

---

## BLOQUE III: REGLAS FUNCIONALES Y EXPERIENCIA DE USUARIO (UX)

### 16. UX Y ESTADOS DE INTERFAZ

* Toda pantalla funcional DEBE contemplar como mínimo:
* Estado de carga.
* Estado vacío.
* Estado con datos.
* Estado de error.
* Confirmación de operaciones destructivas.
* Feedback de guardado exitoso.
* Feedback de validación.
* Prevención de doble envío (`disabled` durante peticiones activas).


* Los formularios deben priorizar selección de entidades existentes sobre entrada manual de IDs.
* Las acciones principales deben ser visualmente claras.
* Las acciones destructivas deben requerir confirmación cuando exista riesgo de pérdida de información.
* Los mensajes de error deben ser comprensibles para el usuario y no limitarse al mensaje técnico del backend.
* No se deben mostrar datos técnicos innecesarios al usuario final.
* Las interfaces deben mantener coherencia visual, espacial y de interacción con el resto del sistema.

### 17. FORMULARIOS COMPLEJOS Y ENTIDADES RELACIONADAS

* Cuando una entidad tenga relaciones 1:N, N:N o estructuras jerárquicas, el formulario NO debe limitarse a la cabecera.
* La interfaz debe permitir administrar las entidades relacionadas dentro del flujo natural de creación/edición.
* Las listas dinámicas deben permitir como mínimo:
* Agregar.
* Editar.
* Eliminar.
* Cambiar cantidades.
* Seleccionar entidades existentes.
* Validar datos antes de guardar.


* Las estructuras complejas deben organizarse visualmente por secciones o etapas para evitar formularios planos y ambiguos.
* La IA debe distinguir entre:
* Datos maestros.
* Materiales.
* Procesos.
* Parámetros.
* Resultados.
* Costos.


* No debe introducir toda esta información en una única estructura plana cuando el dominio requiera separación conceptual.

### 18. CÁLCULOS, INVENTARIO Y COSTOS

* Todo cálculo relacionado con cantidades, inventario, producción, costos, mermas o rendimientos debe tener una única fuente de cálculo.
* El mismo cálculo NO debe duplicarse independientemente en múltiples pantallas.
* Las cantidades deben respetar la unidad base definida para el insumo.
* Las conversiones de unidades deben ser explícitas y verificables.
* Los cálculos de producción deben distinguir entre:
* Cantidad planificada.
* Cantidad requerida.
* Cantidad disponible.
* Cantidad faltante.
* Cantidad a comprar.
* Merma prevista.
* Cantidad realmente consumida.


* Cuando corresponda, el sistema debe poder determinar el costo estimado antes de ejecutar una producción.
* Los valores calculados por frontend deben coincidir con las reglas de negocio del backend.

### 19. PROHIBICIÓN DE HARDCODEAR DATOS DE NEGOCIO

* Nombres de productos, insumos, proveedores, IDs, precios, cantidades, categorías o relaciones reales NO deben quedar hardcodeados en el frontend.
* Los datos de negocio deben provenir de la API o de la configuración correspondiente.
* Los valores utilizados únicamente para demostraciones deben estar claramente identificados como datos de prueba.
* No se debe modificar código para que una pantalla "se vea bien" utilizando datos falsos cuando la API real debería proporcionar dichos datos.

---

## BLOQUE IV: CALIDAD, CONFIGURACIÓN Y TRAZABILIDAD

### 20. DIAGNÓSTICO ANTES DE CORREGIR (CAUSA RAÍZ)

* Ante un error, la IA DEBE identificar primero:
1. Qué componente falla.
2. En qué capa ocurre.
3. Cuál es la causa raíz.
4. Qué módulos dependen del componente.


* No se permiten soluciones cosméticas que oculten el error sin solucionar su causa.
* No se debe modificar código funcional únicamente para eliminar un mensaje de error sin comprender su origen.
* Si existen varias causas posibles, deben comprobarse antes de aplicar cambios estructurales.

### 21. CONFIGURACIÓN Y DEPENDENCIAS

* No eliminar reglas, plugins, validaciones o dependencias únicamente para conseguir que un comando termine exitosamente.
* Toda modificación de configuración debe conservar la finalidad original del sistema siempre que sea técnicamente compatible.
* Si una configuración resulta incompatible, la IA DEBE buscar primero una solución compatible antes de eliminar funcionalidad de validación.
* Toda dependencia nueva debe justificarse técnicamente.
* No se deben introducir librerías para resolver problemas que puedan resolverse utilizando componentes o utilidades ya existentes en el proyecto.

### 22. TRAZABILIDAD DE CAMBIOS Y REPORTE DE CIERRE

* Toda modificación estructural debe indicar:
* Qué se modificó.
* Por qué se modificó.
* Qué problema resuelve.
* Qué módulos afecta.
* Qué validaciones fueron ejecutadas.
* Qué queda pendiente.


* El reporte final DEBE distinguir claramente entre:
* `VERIFICADO`
* `NO VERIFICADO`
* `BLOQUEADO`
* `PENDIENTE`


* Está prohibido reportar como completada una validación que no fue ejecutada realmente.

### 23. DATOS DE PRUEBA Y SEEDS

* Los datos de prueba deben representar escenarios reales del negocio.
* Deben permitir comprobar relaciones entre módulos.
* El seed debe incluir datos suficientes para probar:
* Catálogos.
* Compras.
* Inventario.
* Producción.
* Lotes.
* Ventas.
* Pagos.
* Costos cuando corresponda.


* Los seeds deben poder ejecutarse repetidamente sin generar duplicaciones accidentales.
* Los datos de prueba nunca deben confundirse con datos reales.
* Cuando una nueva funcionalidad requiera datos relacionados, el seed debe actualizarse para permitir probar el flujo completo.

---

## BLOQUE V: GOBIERNO DE PROYECTO, ALCANCE Y CONSUMO DE TOKENS

### 24. CONTROL DE ALCANCE — V1 vs V2/V3

* La V1 debe resolver correctamente las necesidades actuales del negocio.
* No introducir arquitectura, autenticación avanzada, auditoría empresarial, machine learning, multitenancy, versionado complejo u otras capacidades reservadas para V2/V3 salvo que sean necesarias para que V1 funcione.
* Si durante una fase aparece una necesidad futura, debe documentarse como pendiente y NO implementarse automáticamente.
* La IA debe diferenciar entre:
* Necesario para V1.
* Mejora conveniente para V1.
* Funcionalidad futura V2/V3.


* No convertir una necesidad futura en una dependencia actual sin justificación.

### 25. PRESERVACIÓN DEL CONTEXTO Y DEL TRABAJO EXISTENTE

* Antes de modificar un archivo existente, la IA DEBE comprender su responsabilidad actual y revisar las partes relevantes del código.
* No reemplazar archivos completos cuando una modificación localizada sea suficiente.
* No eliminar funcionalidades existentes para implementar una nueva.
* No asumir que un archivo está incompleto únicamente porque no contiene la funcionalidad de la fase actual.
* Las modificaciones deben ser incrementales y compatibles con el trabajo realizado en fases anteriores.
* Cuando una fase reutilice código creado anteriormente, debe conservarse el patrón existente salvo que exista una razón técnica documentada para cambiarlo.

### 26. CONTROL ESTRICTO DE ALCANCE Y CONSUMO DE CONTEXTO

* La IA DEBE trabajar únicamente sobre el objetivo explícito de la tarea actual.
* Antes de actuar, debe identificar el conjunto mínimo de archivos necesarios para completar correctamente la tarea.
* NO debe realizar auditorías generales, revisiones profundas, refactorizaciones globales, limpiezas masivas ni mejoras no solicitadas.
* NO debe explorar todo el proyecto si la tarea puede resolverse revisando únicamente un módulo y sus dependencias directas.
* NO debe leer documentación completa, módulos completos o archivos no relacionados únicamente "para tener más contexto".
* El contexto debe ampliarse únicamente cuando exista una dependencia real que pueda afectar la implementación.
* Prioridad de lectura:
1. Prompt de la fase actual.
2. Archivos directamente afectados.
3. Dependencias directas necesarias para comprender el cambio.
4. Archivos adicionales únicamente si una prueba o error demuestra que son necesarios.


* Una vez obtenido el contexto suficiente, DEBE comenzar la implementación. No continuar investigando indefinidamente.
* NO realizar trabajo preventivo o especulativo que no sea necesario para completar la tarea.
* NO corregir problemas encontrados incidentalmente si no afectan la tarea actual, salvo que puedan provocar que el trabajo realizado quede roto.
* Si encuentra un problema fuera de alcance que NO afecta la tarea, debe registrarlo como "OBSERVACIÓN" y continuar.
* Si encuentra un problema fuera de alcance que SÍ impide completar correctamente la tarea o deja el sistema roto, puede corregir únicamente lo necesario para restaurar la integridad.
* NO crear archivos, componentes, endpoints, modelos, dependencias o abstracciones "por si en el futuro hacen falta".
* NO implementar funcionalidades pertenecientes a V2/V3 durante una tarea V1.
* NO modificar código funcional simplemente para aplicar una preferencia personal de arquitectura.
* Cada cambio debe responder directamente a una necesidad identificable de la tarea.
* Si una solución requiere cambios adicionales, estos deben estar justificados por una dependencia real.

### 27. CONTEXTO MÍNIMO SUFICIENTE — NO TRABAJAR A CIEGAS

* La reducción de consumo de contexto NUNCA debe comprometer la integridad del sistema.
* Antes de modificar código, la IA DEBE conocer al menos:
* Qué hace actualmente el archivo.
* Quién lo consume.
* Qué API utiliza, cuando corresponda.
* Qué datos recibe y produce.
* Qué dependencia directa puede verse afectada.


* Si una modificación puede afectar otro módulo, debe revisar ese módulo antes de modificar.
* Si una modificación de base de datos afecta relaciones existentes, debe revisar los consumidores de dichas relaciones.
* Si una modificación de API cambia un contrato existente, debe revisar frontend y consumidores afectados.
* Si una modificación de frontend cambia el contrato esperado por la API, debe verificar el contrato correspondiente.
* El objetivo es utilizar el MENOR CONTEXTO NECESARIO, no el MENOR CONTEXTO POSIBLE.

### 28. EJECUCIÓN DIRECTA Y VALIDACIÓN PROPORCIONAL

* La IA debe aplicar primero la solución mínima necesaria.
* Después debe ejecutar únicamente las validaciones proporcionales al cambio realizado.
* Para cambios simples de JavaScript: utilizar `node --check` sobre los archivos modificados.
* Para cambios de estilos o componentes sin impacto estructural: realizar validación estática puntual.
* Para cambios de API, Prisma, relaciones, persistencia o lógica transversal: ejecutar las validaciones necesarias para confirmar que el contrato continúa funcionando.
* NO ejecutar auditorías completas del proyecto para cambios locales.
* NO ejecutar múltiples comandos equivalentes que proporcionen la misma información.
* NO repetir una comprobación que ya produjo un resultado concluyente, salvo que posteriormente se haya modificado el código relacionado.
* Si la validación demuestra que el cambio funciona, detener la investigación y entregar el reporte.

### 29. REGLA DE "NO MEJORAR POR MEJORAR"

* La IA NO debe modificar código únicamente porque considere que podría escribirse de una manera "mejor".
* No realizar refactorizaciones oportunistas durante una implementación funcional.
* No cambiar nombres, estructuras, componentes, estilos, patrones o arquitectura existentes sin necesidad funcional o técnica.
* No sustituir una implementación funcional por otra equivalente únicamente por preferencia.
* Las mejoras detectadas pero no necesarias deben quedar fuera de la tarea.
* Si una mejora es necesaria para evitar que la implementación actual quede técnicamente defectuosa, debe realizarse únicamente en el alcance mínimo necesario.

### 30. CRITERIO DE FINALIZACIÓN

Una tarea se considera terminada cuando:

1. El objetivo definido en el prompt fue implementado.
2. No quedan errores introducidos por la propia tarea.
3. Las dependencias directamente afectadas continúan siendo compatibles.
4. Se ejecutaron las validaciones proporcionales correspondientes.
5. Los cambios fueron documentados en el reporte de cierre.

Una vez cumplidos estos cinco puntos, la IA DEBE detenerse. Está PROHIBIDO continuar explorando, refactorizando o "mejorando" el proyecto después de alcanzar el criterio de finalización.