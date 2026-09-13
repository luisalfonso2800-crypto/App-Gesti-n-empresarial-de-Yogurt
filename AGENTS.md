# REGLAS GLOBALES DEL PROYECTO (STRICT)

> **NOTA PARA LA IA:** SIEMPRE QUE INICIES UNA SESIÓN, DEBES LEER EL DOCUMENTO `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md` POR REFERENCIAS CRUZADAS EN ESTOS ARCHIVOS.

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
* **Prohibición de Scripts Basura en la Raíz:** Queda terminantemente prohibido dejar scripts temporales de escritura o automatización sueltos en el repositorio (ej. `write_step1.js`, `temp_patch.js`). Si se utiliza un script auxiliar, este debe eliminarse automáticamente antes de concluir la tarea.

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

### 2.1. PREVENCIÓN DE CONFLICTOS DE ENRUTAMIENTO EN EXPRESS

* **Jerarquía Estricta de Rutas:** Toda ruta fija, de acción masiva o sub-recurso (ej. `/orders/merge`, `/active`, `/items/move`) DEBE declararse en el router de Express OBLIGATORIAMENTE **antes** de cualquier ruta parametrizada dinámica (ej. `/:id` o `/orders/:id`).
* Nunca expongas parámetros comodín por encima de rutas específicas para evitar que Express capture palabras reservadas como si fueran IDs/UUIDs.

### 3. REGLA DE DETENCIÓN

* Solo detente ante errores irresolubles o bloqueos reales de diseño. Si hay un error de sintaxis en Prisma o JavaScript introducido por ti, corrígelo de inmediato.

### 4. MANEJO DE ICONOS (FRONTEND)

* Busca y reutiliza primero los iconos de `lucide-react` o los exportados en `@/components/ui/icons`.
* Si no existe un icono representativo en `lucide-react`, créalo como componente SVG accesible y agrégalo directamente a `@/components/ui/icons` para centralizarlo.
* **Verificación Previa de Exports:** Queda prohibido importar componentes o iconos a ciegas desde `@/components/ui/icons` sin antes verificar que el archivo realmente contenga la sentencia `export` para ese símbolo. Si no está exportado allí, impórtalo directamente desde `lucide-react`.
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

### 9.1. VERIFICACIÓN ESTRATÉGICA BACKEND-FIRST (DATOS REALES Y CONTROL DE CUOTA)

* **Prohibido asumir que el backend soporta una acción solo porque el frontend la requiere.**
* Toda acción de frontend que implique mutación de datos (crear, editar, eliminar, transferir, fusionar) DEBE verificar primero la existencia y el contrato real del endpoint en `apps/api/src/routes/` y sus controladores.
* **Protocolo de Verificación sin Exceso de Cuota:**
1. No leas todo el backend ni hagas búsquedas globales ciegas. Inspecciona directamente el archivo de rutas del submódulo correspondiente (ej. `apps/api/src/routes/purchase.routes.js` o `purchases/`).
2. Si el endpoint no existe o le faltan campos, **debes crearlo o completarlo en el backend antes de conectar el frontend**.
3. No implementes "soluciones temporales" simuladas con datos en memoria del cliente cuando la acción deba persistir en base de datos.
4. La implementación en el backend debe ser acotada y respetar la estructura Controller $\rightarrow$ Service $\rightarrow$ Repository, validando con Prisma.



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
* Antes de modificar un seed, la IA DEBE determinar si su ejecución es: idempotente, acumulativa intencionalmente o destructiva.
* Los seeds de prueba DEBEN ser idempotentes o limpiar explícitamente los datos que ellos mismos generan.
* NUNCA debe eliminar datos existentes de una base de datos sin identificar previamente el alcance y finalidad de dicha eliminación.
* Cuando exista riesgo de duplicación, la IA DEBE verificar la existencia previa mediante identificadores o claves únicas antes de insertar.
* Las relaciones entre entidades deben utilizar siempre los identificadores reales provenientes de la base de datos.
* NUNCA se deben inventar IDs, UUIDs o relaciones únicamente para hacer funcionar la interfaz.

### 12.1. MAPEO Y NOMBRES EXACTOS DE CAMPOS EN PRISMA

* **Cero Asunciones en Nombres de Columnas:** Al realizar consultas, agregaciones o inserciones en Prisma (`create`, `update`, `deleteMany`), la IA DEBE consultar el nombre exacto de las propiedades en `schema.prisma`.
* Queda terminantemente prohibido adivinar campos (ej. usar `cantidadSolicitada` en lugar de `cantidad`, o `ordenId` en lugar de `purchaseId`). La discrepancia de un solo nombre provoca un `PrismaClientValidationError` y error 500 en cadena.
* En operaciones destructivas (`delete`, `deleteMany`), purga siempre los hijos/ítems dependientes antes de destruir el registro padre para no violar restricciones de clave foránea (`Foreign Key Constraint`).

### 13. RELACIONES ENTRE ENTIDADES (UI HUMANA)

* Ningún usuario debe tener que escribir manualmente un UUID o ID interno cuando la relación pueda seleccionarse desde una entidad existente.
* Los IDs internos son identificadores técnicos y NO son información de entrada normal para el usuario.
* Para relaciones entre entidades se DEBEN utilizar selectores, búsquedas, autocompletado o componentes equivalentes.
* El frontend debe mostrar información humana de la entidad relacionada (ej. `Producto: Yogurt Fresa 1L`), no únicamente su UUID (`ID Producto: 7cb221eb-e5e5...`).
* El backend DEBE validar que las entidades relacionadas existan y sean compatibles antes de persistir la operación.
* Nunca se debe solucionar un problema de relación mostrando el UUID directamente al usuario.

### 13.1. UX DE ENTRADAS, MÁSCARAS DE MONEDA Y VALIDACIÓN DE TIPOS DE DATOS

1. **UX de Entradas Numéricas (Prohibición de Forzar Cero y Valores Negativos):**
   * **Gestión de cadenas vacías en el estado:** Prohibido fijar `value={0}` o forzar `|| 0` en el `onChange`. Al borrar un campo numérico (precio, cantidad, stock, flete), el estado debe permitir la cadena vacía `""`.
   * **Uso obligatorio de Placeholders:** Utilizar siempre `placeholder="0"` o `placeholder="0.00"`. Nunca precargar un `0` visible que obligue al usuario a borrarlo manualmente al escribir nuevos dígitos (evitando cadenas inválidas como `"05000"`).
   * **Restricción estricta de negativos:** Todo input numérico debe incluir `min="0"`. En el manejador `onChange`, bloquear explícitamente el signo menos (`-`). Ningún costo, precio, cantidad o stock mínimo puede persistirse con valores menores que cero.
   * **Parseo diferido:** La conversión numérica (`parseFloat(val) || 0` o `Number(val)`) se ejecutará únicamente al calcular totales en pantalla o al preparar el payload para el backend (`onSubmit`).

2. **Formateo y Máscaras de Moneda (COP / Pesos en Tiempo Real):**
   * **Visualización en vivo:** Todo campo de costo, precio de compra, venta o flete debe mostrar visualmente el prefijo fijo de divisa `$ ` y aplicar separadores de miles con punto (`.`) en tiempo real mientras el usuario tipea (ej. `$ 10.000`, `$ 1.000.000`).
   * **Prohibición de decimales redundantes:** No renderizar decimales fijos finales (`.00` o `,00`) a menos que el negocio lo requiera explícitamente. Las monedas sin fraccionario operativo deben redondearse a enteros enteros en pantalla (`Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })`).
   * **Estado limpio en memoria:** La máscara visual no debe contaminar el valor real. En el payload hacia el backend o en el cálculo matemático, el dato siempre debe limpiarse a número puro (`raw.replace(/\D/g, '')` o parseo a entero/decimal numérico sin símbolos ni puntos).

3. **Validación Preventiva por Tipo de Campo:**
   * **Campos estrictamente numéricos (Teléfonos, NIT, Documentos, Códigos):** Prohibir la entrada de letras y caracteres especiales en el evento `onKeyDown` / `onChange`. Si el usuario pega o escribe texto alfabético, debe filtrarse instantáneamente (`replace(/\D/g, '')`).
   * **Nombres de personas y razones sociales mixtas:**
     * **Nombres / Apellidos de contacto:** Solo permitir letras, espacios, acentos y caracteres idiomáticos (`a-zA-ZáéíóúÁÉÍÓÚñÑ `). Bloquear números y símbolos de puntuación ajenos.
     * **Nombres de negocio, proveedores o productos:** Permitir cadenas alfanuméricas con espacios y caracteres especiales de empresa (ej. `2 Esquinas`, `Lácteos 3 Hermanos & Cía`). No restringir números en nombres de locales comerciales.
   * **Correos electrónicos:** Forzar `type="email"`, sanitizar espacios accidentales en blanco (`trim()`) y validar en tiempo real el formato estándar (`usuario@dominio.ext`) antes de habilitar el botón de guardado.
   * **Sanitización global:** Todo texto debe aplicar `.trim()` antes de enviarse al backend para evitar espacios residuales que distorsionen búsquedas e índices en PostgreSQL.

### 13.2. SELECTORES EN CASCADA Y DEPENDENCIAS CONTEXTUALES (POKA-YOKE)

* **Análisis de Dependencia Previo:** Al diseñar o intervenir cualquier formulario, la IA DEBE identificar si algún campo maestro condiciona las opciones, la validez o la pertinencia de otros campos dependientes.
* **Filtrado Reactivo Estricto:** Los selectores dependientes NO deben mostrar opciones incompatibles con el valor actual del campo maestro (ej. si la presentación es "A GRANEL", el selector de categoría solo debe mostrar categorías de semielaborados/WIP; si es presentación comercial, solo categorías terminadas).
* **Auto-Reseteo Preventivo:** Si el usuario cambia el valor de un campo maestro y el campo dependiente contiene un valor que ya no es válido en el nuevo contexto, la IA DEBE resetearlo inmediatamente en el estado a un valor por defecto seguro. Está terminantemente prohibido dejar valores huérfanos o contradictorios en el payload.
* **Adaptación Visual de Campos (Hiding/Showing):** Si la selección de un campo vuelve irrelevante a otros (ej. costo de producción vs precio de venta comercial), los campos no aplicables deben ocultarse o sustituirse por tarjetas informativas contextuales.
* **Imposibilidad de Estados Inválidos:** La interfaz debe hacer físicamente imposible que el usuario arme combinaciones contradictorias antes de presionar guardar.

### 14. ANÁLISIS DE IMPACTO OBLIGATORIO

* Antes de modificar una entidad, tabla, endpoint o estructura utilizada por otros módulos, la IA DEBE identificar sus dependencias.
* Como mínimo debe revisar: Base de datos, Backend, Frontend, Cliente API, Seeds, Módulos consumidores y relaciones transversales.
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
* Los mensajes de error deben ser comprensibles para el usuario y no limitarse al mensaje técnico del backend.
* Las interfaces deben mantener coherencia visual, espacial y de interacción con el resto del sistema.

### 16.1. ERRADICACIÓN DE DIÁLOGOS NATIVOS Y FEEDBACK VISUAL OBLIGATORIO

* **PROHIBICIÓN ABSOLUTA:** Queda terminantemente prohibido el uso de diálogos nativos del navegador (`window.alert()`, `window.confirm()`, `window.prompt()`). Ninguna interacción debe utilizar estas ventanas emergentes por ser bloqueantes, obsoletas y degradar la experiencia de usuario.
* **Confirmación Previa:** Toda acción destructiva, irreversible o crítica (ej. eliminar lista, borrar ítem, fusionar órdenes, anular registros) DEBE desplegar un componente Modal estilizado (`<Modal/>`) con botones claros de "Cancelar" y "Confirmar acción".
* **Confirmación Posterior (Feedback Visual):** Toda acción ejecutada por el usuario (exitosa o fallida) DEBE mostrar confirmación visual explícita en pantalla:
* **Éxito:** Toast/Notificación visual estilizada en verde con el detalle de lo ocurrido (ej. `"Insumo transferido exitosamente a ORD-2026-0002"`).
* **Error:** Toast/Notificación estilizada en rojo o badge descriptivo indicando el motivo comprensible para humanos (ej. `"No fue posible fusionar las listas. Intente nuevamente"`).
* **Estado Activo:** Badges, chips o resaltes visuales que confirmen el estado actual del sistema (ej. `Lista Activa: [Nombre]`).



### 16.2. INTEGRIDAD FUNCIONAL EXTREMO A EXTREMO PARA ELEMENTOS INTERACTIVOS (BOTONES Y ACCIONES)

* **Prohibición de Botones Huérfanos o Cosméticos:** Queda terminantemente prohibido crear, renderizar o modificar botones, enlaces o disparadores de acción que no tengan una implementación funcional completa y verificada.
* **Prohibición de Stubs y Alertas Temporales:** Ningún botón puede limitarse a emitir `alert()`, `console.log()` o dejar un manejador de eventos vacío (`onClick={() => {}}`). Si el botón está visible en la interfaz, su flujo de interacción debe estar completamente operativo.
* **Circuito Completo Frontend ↔ Backend:**
1. Si el botón ejecuta una acción que muta o consulta datos (guardar, editar, eliminar, mover, fusionar, cambiar estado), **debe existir y estar conectado el endpoint real en `apps/api/**`.
2. Si el backend carece del controlador, ruta o método en Prisma para respaldar la acción del botón, **debes crearlo en el backend antes de dar por completada la tarea**.
3. El frontend debe manejar los tres momentos del ciclo de vida del botón:
* **Estado previo/espera:** Deshabilitado (`disabled`) o con indicador de carga durante la ejecución asíncrona para evitar envíos múltiples.
* **Respuesta exitosa:** Actualización reactiva del estado visual/DOM y notificación toast de confirmación en verde.
* **Manejo de error:** Bloque `try / catch` que capture fallos de red o validaciones de la API, manteniendo la aplicación estable y mostrando el feedback correspondiente en rojo.




* **Regla de Alcance:** Si una tarea no incluye el tiempo o la autorización para implementar la lógica backend y frontend de una acción puntual, **el botón no debe crearse ni agregarse a la UI**.

### 16.3. REACTIVIDAD TRANSVERSAL Y SINCRONIZACIÓN EN TIEMPO REAL

* **Sincronización Contextual:** Cuando una acción ejecutada en un componente global (como el `Header` o el `CartContext`) altere o elimine un recurso compartido, el módulo o vista activa (ej. `PurchasesPage`) DEBE enterarse y reflejar el cambio de inmediato en el DOM sin obligar al usuario a recargar la página (`F5`).
* Para lograrlo, los contextos deben exponer disparadores de versión o timestamps reactivos (`lastUpdated`), y las vistas consumidoras deben suscribir sus efectos a dicho disparador.

### 16.4. RESILIENCIA Y MANEJO DEFENSIVO EN MONTAJES (PROHIBIDO "FAILED TO FETCH" CRÍTICO)

* **Protección de Efectos Iniciales (`useEffect`):** Ninguna llamada asíncrona o simulación que se ejecute durante el ciclo de vida de montaje de un componente puede dejarse sin un bloque `try / catch` defensivo.
* Si una petición inicial o de simulación falla o devuelve error de red, la interfaz NO debe estrellarse en pantalla roja (React Error Boundary); debe capturar el error, inicializar estados seguros (`items: []`, `loading: false`) y mostrar un estado de error comprensible al usuario.

### 17. FORMULARIOS COMPLEJOS Y ENTIDADES RELACIONADAS

* Cuando una entidad tenga relaciones 1:N, N:N o estructuras jerárquicas, el formulario NO debe limitarse a la cabecera.
* La interfaz debe permitir administrar las entidades relacionadas dentro del flujo natural de creación/edición.
* Las listas dinámicas deben permitir como mínimo: agregar, editar, eliminar, cambiar cantidades, seleccionar entidades existentes y validar datos antes de guardar.
* Las estructuras complejas deben organizarse visualmente por secciones o etapas para evitar formularios planos y ambiguos.

### 18. CÁLCULOS, INVENTARIO Y COSTOS

* Todo cálculo relacionado con cantidades, inventario, producción, costos, mermas o rendimientos debe tener una única fuente de cálculo.
* El mismo cálculo NO debe duplicarse independientemente en múltiples pantallas.
* Las cantidades deben respetar la unidad base definida para el insumo.
* Los valores calculados por frontend deben coincidir con las reglas de negocio del backend.

### 19. PROHIBICIÓN DE HARDCODEAR DATOS DE NEGOCIO

* Nombres de productos, insumos, proveedores, IDs, precios, cantidades, categorías o relaciones reales NO deben quedar hardcodeados en el frontend.
* Los datos de negocio deben provenir de la API o de la configuración correspondiente.
* **Prohibición de Placeholders Estáticos en Componentes:** En componentes de lista (como el Carrito), queda prohibido renderizar textos literales quemados como `"Insumo"` o `"Proveedor"`. Se debe mapear de forma segura contra los objetos recibidos (ej. `item.insumo?.nombre || 'Sin nombre'`).
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

### 21. CONFIGURACIÓN Y DEPENDENCIAS

* No eliminar reglas, plugins, validaciones o dependencias únicamente para conseguir que un comando termine exitosamente.
* Toda dependencia nueva debe justificarse técnicamente.
* No se deben introducir librerías para resolver problemas que puedan resolverse utilizando componentes o utilidades ya existentes en el proyecto.

### 22. TRAZABILIDAD DE CAMBIOS Y REPORTE DE CIERRE

* Toda modificación estructural debe indicar qué se modificó, por qué, qué problema resuelve, qué módulos afecta y qué validaciones se ejecutaron.
* El reporte final DEBE distinguir claramente entre: `VERIFICADO`, `NO VERIFICADO`, `BLOQUEADO` y `PENDIENTE`.
* Está prohibido reportar como completada una validación que no fue ejecutada realmente.

### 23. DATOS DE PRUEBA Y SEEDS

* Los datos de prueba deben representar escenarios reales del negocio y permitir comprobar relaciones entre módulos.
* Los seeds deben ser idempotentes para poder ejecutarse repetidamente sin generar duplicaciones accidentales.

---

## BLOQUE V: GOBIERNO DE PROYECTO, ALCANCE Y CONSUMO DE TOKENS

### 24. CONTROL DE ALCANCE — V1 vs V2/V3

* La V1 debe resolver correctamente las necesidades actuales del negocio.
* No introducir capacidades reservadas para V2/V3 salvo que sean necesarias para que V1 funcione.

### 25. PRESERVACIÓN DEL CONTEXTO Y DEL TRABAJO EXISTENTE

* Antes de modificar un archivo existente, la IA DEBE comprender su responsabilidad actual.
* No reemplazar archivos completos cuando una modificación localizada sea suficiente.
* Las modificaciones deben ser incrementales y compatibles con el trabajo realizado en fases anteriores.

### 26. CONTROL ESTRICTO DE ALCANCE Y CONSUMO DE CONTEXTO

* La IA DEBE trabajar únicamente sobre el objetivo explícito de la tarea actual.
* NO debe realizar auditorías generales, revisiones profundas, refactorizaciones globales, limpiezas masivas ni mejoras no solicitadas.
* Prioridad de lectura:
1. Prompt de la fase actual.
2. Archivos directamente afectados.
3. Dependencias directas necesarias para comprender el cambio.
4. Archivos adicionales únicamente si una prueba o error demuestra que son necesarios.


* Una vez obtenido el contexto suficiente, DEBE comenzar la implementación sin continuar investigando indefinidamente.

### 27. CONTEXTO MÍNIMO SUFICIENTE — NO TRABAJAR A CIEGAS

* La reducción de consumo de contexto NUNCA debe comprometer la integridad del sistema.
* Antes de modificar código, la IA DEBE conocer qué hace el archivo, quién lo consume, qué API utiliza y qué datos maneja.
* El objetivo es utilizar el MENOR CONTEXTO NECESARIO, no el MENOR CONTEXTO POSIBLE.

### 28. EJECUCIÓN DIRECTA Y VALIDACIÓN PROPORCIONAL

* La IA debe aplicar primero la solución mínima necesaria.
* Validaciones proporcionadas: `node --check` para JS/JSX; comprobación de endpoints y contratos en caso de mutaciones de persistencia.
* NO ejecutar auditorías completas del proyecto para cambios locales.
* Si la validación demuestra que el cambio funciona, detener la investigación y entregar el reporte.

### 29. REGLA DE "NO MEJORAR POR MEJORAR"

* La IA NO debe modificar código únicamente porque considere que podría escribirse de una manera "mejor".
* No realizar refactorizaciones oportunistas durante una implementación funcional.
* Si una mejora es necesaria para evitar que la implementación actual quede técnicamente defectuosa, debe realizarse únicamente en el alcance mínimo necesario.


### 30. CRITERIO DE FINALIZACIÓN

Una tarea se considera terminada cuando:

1. El objetivo definido en el prompt fue implementado.
2. No quedan errores introducidos por la propia tarea.
3. Las dependencias directamente afectadas continúan siendo compatibles.
4. Se ejecutaron las validaciones proporcionales correspondientes.
5. Los cambios fueron documentados en el reporte de cierre.

Una vez cumplidos estos cinco puntos, la IA DEBE detenerse inmediatamente. Queda PROHIBIDO continuar explorando o refactorizando tras alcanzar el criterio de finalización.

---

## BLOQUE VI: REGLAS GLOBALES DE FORMULARIOS E INPUTS

### 31. TRANSFORMACIÓN A MAYÚSCULAS (TEXT TRANSFORM)
* Todo campo de texto en formularios debe transformarse y almacenarse en mayúsculas automáticamente (`UPPERCASE`), incluyendo campos como nombres de personas de contacto, descripciones y direcciones.
* En CSS/UI: Usar `uppercase` visualmente y asegurar que en el estado/payload se envíe siempre en mayúsculas.

### 32. CÉDULAS Y NITS (DOCUMENTOS DE IDENTIDAD)
* **Entrada de usuario**: Restringir estrictamente la entrada. NO permitir letras, puntos, comas, guiones ni espacios manuales (solo caracteres `0-9`).
* **Formateo en vivo (Máscara/Display)**: A medida que el usuario escribe, el sistema debe insertar automáticamente espacios donde tradicionalmente irían los separadores de miles para mejorar la legibilidad.
* **Almacenamiento**: El valor subyacente limpio (`raw value`) debe guardarse únicamente como dígitos numéricos.

### 33. NÚMEROS TELEFÓNICOS
* **Entrada de usuario**: Solo permitir números (`0-9`). Bloquear el ingreso manual de guiones, espacios o paréntesis.
* **Formato automático en vivo**: Aplicar máscara visual con el patrón estándar `XXX XXX XXXX` (3 dígitos, espacio, 3 dígitos, espacio, 4 dígitos):
  * Ejemplo visual: `300 123 4567`
  * Nota de arquitectura: La lógica debe quedar modular para permitir adaptaciones a formatos internacionales en futuras versiones.
### 34. DISEÑO VISUAL HOMOLOGADO PARA MODALES
* **Estructura Estándar:** Todos los modales del sistema DEBEN usar el componente `SmartModal` (`@/components/ui/SmartModal`) o replicar exactamente sus clases y estructura (fondo desenfocado `backdrop-filter: blur`, tarjeta fondo `#FAF8F5`, bordes redondeados `12px`, sombras `box-shadow: 0 20px 25px -5px`).
* **Encabezado:** Título en negrita a la izquierda (`#1c1917`), con línea separadora inferior tenue y un botón `X` de cierre a la derecha (sin fondo, icono o carácter `✕` color gris).
* **Campos (Tipografía y Labels):** Las etiquetas deben escribirse en MAYÚSCULAS compactas, fuente pequeña (`0.75rem`), color `#44403c`, peso `600`. Los campos obligatorios deben llevar un asterisco en color coral/rojo (`#e11d48`).
* **Inputs y Selects:** Fondo blanco puro, padding consistente, bordes grises suaves (`border: 1px solid #d6d3d1`), y placeholders explicativos en gris claro.
* **Acciones (Footer):** Separador superior tenue. Botones a la derecha. "Cancelar" con fondo gris claro (`#e7e5e4`) y texto oscuro. Botón primario ("Guardar") con fondo oscuro (`#292524`), texto claro (`#fafaf9`) y cambio a opacidad `0.5` si está deshabilitado.

### 35. REGLAS FINANCIERAS Y DE MONEDA

* **Puntuación y Cero Decimales:** Todo valor monetario debe formatearse automáticamente con puntos de miles (es-CO) y sin decimales (ej. $ 25.000 o $ 1.250.000).
* **No Inicializar en Cero:** Ningún campo de dinero debe arrancar clavado con un 0 en el estado inicial; debe usar campo limpio o placeholder="0" para evitar que el usuario deba borrar el número manualmente.
* **Bloqueo de Negativos:** Queda restringido el ingreso de signos negativos (-) o letras en los campos de dinero; la máscara debe limpiar caracteres no numéricos al vuelo.
* **Ayuda Visual Textual Obligatoria (Número a Letras):** Todo input de dinero (flete, precio unitario, costo base, subtotal) debe proyectar en tiempo real su equivalencia en palabras (ej. ✦ Veinticinco mil pesos) consumiendo la utilidad centralizada montoATextoPesos de @/utils/numberToWords.
* **Ubicación de la Ayuda Textual:** Debe ubicarse al frente (inline a la derecha) del input siempre que el ancho lo permita, o en una cápsula pill (#F7F4EE, borde #CAD5B5, texto verde #065F46) sin quebrar verticalmente la alineación de las filas contiguas.

### 36. REGLAS DE PUNTUACIÓN NUMÉRICA Y EXCEPCIONES

* **Cantidades y Stock:** Todo número representativo de volumen, existencias, conteo o contenido por empaque debe formatearse con separador de miles con punto (10.800 ml, 5.400 g) y estar acompañado siempre de su unidad técnica.
* **Cédulas de Ciudadanía:** Deben incluir formato de puntuación de miles tradicional para facilitar la lectura visual (ej. 1.020.345.678).
* **NIT (Norma Colombiana DIAN):**
  * Se formatea con puntos de separación de miles en el cuerpo principal.
  * Debe permitir e incluir el guion de separación (-).
  * Debe incluir el Dígito de Verificación (DV) único al final (ej. 900.123.456-7).
* **Excepciones de Puntuación (Sin formato de miles):**
  * **Teléfonos y Celulares:** Se capturan y visualizan continuos o agrupados por código de operador/área (ej. 300 123 4567 o 3001234567), nunca con puntuación monetaria ni puntos de miles.
  * **Códigos de Barra, Lotes y SKUs:** Se mantienen como secuencias alfanuméricas continuas sin formateadores numéricos.

### 37. UNIDADES DE MEDIDA Y CATÁLOGOS EN FORMULARIOS

* **Unidades Base Soportadas:** El selector técnico de unidades debe incluir de forma fija: kg (Kilogramo), g (Gramo), L (Litro), ml (Mililitro), oz (Onza) y und (Unidad / Pieza).
* **Tipos de Empaque Estandarizados:** Las opciones de empaque en listas desplegables contemplan: UNIDAD, ENVASE, BOLSA, CAJA, BULTO, BOTELLA, BIDÓN, CANASTILLA y OTRO.
* **Texto Dinámico de Ayuda:** Debajo de los inputs de umbral o mínimos (como stock mínimo), el texto de ayuda debe autocomponerse en cursiva pluralizando correctamente la unidad (ej. "El mínimo son 1000 gramos de..." o "El mínimo son 24 onzas de...").

### 38. ANATOMÍA Y COMPORTAMIENTO UX DE MODALES (DESIGN SYSTEM MANNÁ)

* **Estructura Visual de la Ventana:**
  * **Fondo y Tarjeta:** Contenedor blanco marfil (#FFFFFF) con bordes sutiles (#E5DFD5 o #D6D3D1), radios de curvatura de 8px y sombra flotante suave.
  * **Cabecera:** Título en negrita (#182622) y botón de cierre ✕ en gris suave (#78716C) con realce al cursor.
  * **Inputs:** Altura estandarizada, esquinas de 6px, bordes neutros y alineación a la derecha para valores monetarios y cantidades.
* **Botonera de Acción:**
  * **Botón Cancelar:** Apariencia neutra/secundaria (#F7F4EE o fondo grisáceo suave #E5DFD5, texto #182622), cerrando el modal sin persistir cambios.
  * **Botón Guardar:** Acción primaria en tono corporativo oscuro (#182622 o verde oscuro).
  * **Estado Deshabilitado (disabled):** Si faltan campos obligatorios (*) o los valores no son válidos, el botón debe verse grisáceo (#D6D3D1), con opacity: 0.6, cursor: not-allowed, pointer-events: none y tooltip explicativo al usuario.
  * Todo desplazamiento debe quedar confinado exclusivamente al interior del modal si la pantalla tiene altura reducida, evitando scrollbars en el layout general del dashboard.

### 39. REGLAS DE FLEXIBILIDAD EN ENTIDADES Y PREVENCIÓN DE ERRORES (POKA-YOKE)

* **Regla de Flexibilidad en Proveedores:**
  * En entidades proveedoras, `nombreContacto` y `email` son estrictamente opcionales. El sistema interactúa con almacenes de cadena y compras de mostrador (D1, ARA, supermercados locales) donde no existe un contacto individual ni buzón asignado.
* **Regla de Retroalimentación de Errores en Modales (Poka-Yoke):**
  * Queda estrictamente prohibido emitir alertas genéricas ('Error en la petición') o fallar en silencio sin retroalimentación visual. Todo modal debe capturar la respuesta del backend y proyectar un banner de advertencia inferior (`#FEF2F2`, borde `#F87171`) explicando en lenguaje natural y comprensible la causa raíz (ej. duplicidad de NIT/Cédula, nombre ya registrado o código inválido).