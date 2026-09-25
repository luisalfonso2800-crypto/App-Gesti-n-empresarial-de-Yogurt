# 01. NÚCLEO Y PRINCIPIOS DE EJECUCIÓN (CORE EXECUTION)

> **NOTA:** Este módulo define las reglas operativas y de gobierno transversal que rigen todo el desarrollo del sistema.

---

### 0. PRINCIPIO FUNDAMENTAL DE EJECUCIÓN

* Hacer exactamente lo necesario para completar correctamente la tarea asignada.
* Ni menos, porque el sistema no debe quedar roto ni con cabos sueltos.
* Ni más, porque el proyecto no debe sufrir refactorizaciones ni cambios especulativos no solicitados.
* **Prioridad Absoluta:**
`INTEGRIDAD DEL SISTEMA > CUMPLIMIENTO DE LA TAREA > CALIDAD DE IMPLEMENTACIÓN > MEJORAS FUTURAS`.
* Toda acción y comando ejecutado debe tener una justificación técnica o funcional directamente ligada al objetivo de la tarea actual.

---

### 0.1. ENRUTAMIENTO CONTEXTUAL DE REGLAS (CONSUMO MÍNIMO)

* Queda PROHIBIDO leer todos los archivos de `.agents/rules/` simultáneamente.
* La IA debe abrir ÚNICAMENTE el submódulo normativo afín a la tarea asignada:
  - Base de datos / Endpoints / Modelos Prisma: `02-backend-database.md`
  - Vistas / Componentes / Hooks / Arquitectura Frontend: `03-frontend-architecture.md`
  - Paleta MANNÁ / UX / Empty States / Ergonomía: `04-design-system-manna.md`
  - Formularios / SmartModal / Moneda / Poka-Yoke: `05-forms-and-modals.md`
  - Prevención de bucles / Circuit Breaker / Frontera hermética: `06-circuit-breaker-and-anti-loop.md`

---

### 0.2. REFERENCIAS CRUZADAS NORMATIVAS (OBLIGATORIEDAD DE CONSULTA)

* **Consulta Previa al Circuit Breaker:** Toda IA colaboradora debe consultar imperativamente [`.agents/rules/06-circuit-breaker-and-anti-loop.md`](file:///.agents/rules/06-circuit-breaker-and-anti-loop.md) antes de iniciar procesos de refactorización, modularización de vistas o resolución de errores de límites SRP.
* **Consulta Previa a Pruebas y Siembra:** Toda IA colaboradora debe consultar imperativamente [`.agents/rules/07-testing-strategy-and-seeding.md`](file:///.agents/rules/07-testing-strategy-and-seeding.md) antes de crear o modificar tests y suites de datos. Queda estrictamente prohibido usar Playwright para siembra masiva por interfaz (anti-digitador).
* **Prohibición de Bucles de Lectura:** Queda terminantemente prohibido caer en bucles de rastreo recursivo de hooks, exploraciones especulativas en capas ajenas al alcance (ej. explorar `apps/api/` cuando se trabaja en `apps/web/`) o reintentos ciegos de edición.

---

### 1. ENTORNO Y COMANDOS

* Usa EXCLUSIVAMENTE `pnpm --filter api exec ...` para Prisma. NUNCA uses `npx`.
* Prohibido ejecutar `prisma migrate` o alterar la base de datos real sin control.
* **Sincronización y Aviso Obligatorio de Tablas:** Cada vez que agregues o modifiques un modelo o tabla en `apps/api/prisma/schema.prisma`, DEBES notificar explícitamente al usuario al finalizar la tarea con las instrucciones exactas para ejecutar `pnpm --filter api exec prisma db push` y `pnpm --filter api exec prisma generate` para evitar desincronizaciones de base de datos.
* **Modo Rápido Obligatorio:** Prohibido ejecutar `pnpm build` o purgar la caché (`.next`) para comprobaciones rápidas. Toda validación estática ligera debe realizarse mediante `node --check` sobre los archivos modificados.
* **Prohibición de Scripts Basura en la Raíz:** Queda terminantemente prohibido dejar scripts temporales de escritura o automatización sueltos en el repositorio (ej. `write_step1.js`, `temp_patch.js`). Si se utiliza un script auxiliar, este debe eliminarse automáticamente antes de concluir la tarea.
* **Comandos Seguros en Windows CLI:** Prohibido usar pipes interactivos profundos o comandos propensos a congelar la terminal de Windows (`findstr /s`, `Select-String` interactivo sin rutas acotadas o bucles infinitos). Toda inspección estática ligera debe realizarse mediante Node.js nativo (`node -e "..."` o scripts en `.agents/scripts/`).

---

### 3. REGLA DE DETENCIÓN

* Solo detente ante errores irresolubles o bloqueos reales de diseño. Si hay un error de sintaxis en Prisma o JavaScript introducido por ti, corrígelo de inmediato.

---

### 20. DIAGNÓSTICO ANTES DE CORREGIR (CAUSA RAÍZ)

* Ante un error, la IA DEBE identificar primero:
1. Qué componente falla.
2. En qué capa ocurre.
3. Cuál es la causa raíz.
4. Qué módulos dependen del componente.

* No se permiten soluciones cosméticas que oculten el error sin solucionar su causa.
* No se debe modificar código funcional únicamente para eliminar un mensaje de error sin comprender su origen.

---

### 21. CONFIGURACIÓN Y DEPENDENCIAS

* No eliminar reglas, plugins, validaciones o dependencias únicamente para conseguir que un comando termine exitosamente.
* Toda dependencia nueva debe justificarse técnicamente.
* No se deben introducir librerías para resolver problemas que puedan resolverse utilizando componentes o utilidades ya existentes en el proyecto.

---

### 22. TRAZABILIDAD DE CAMBIOS Y REPORTE DE CIERRE

* Toda modificación estructural debe indicar qué se modificó, por qué, qué problema resuelve, qué módulos afecta y qué validaciones se ejecutaron.
* El reporte final DEBE distinguir claramente entre: `VERIFICADO`, `NO VERIFICADO`, `BLOQUEADO` y `PENDIENTE`.
* Está prohibido reportar como completada una validación que no fue ejecutada realmente.

---

### 24. CONTROL DE ALCANCE — V1 vs V2/V3

* La V1 debe resolver correctamente las necesidades actuales del negocio.
* No introducir capacidades reservadas para V2/V3 salvo que sean necesarias para que V1 funcione.

---

### 25. PRESERVACIÓN DEL CONTEXTO Y DEL TRABAJO EXISTENTE

* Antes de modificar un archivo existente, la IA DEBE comprender su responsabilidad actual.
* No reemplazar archivos completos cuando una modificación localizada sea suficiente.
* Las modificaciones deben ser incrementales y compatibles con el trabajo realizado en fases anteriores.

---

### 26. CONTROL ESTRICTO DE ALCANCE Y CONSUMO DE CONTEXTO

* La IA DEBE trabajar únicamente sobre el objetivo explícito de la tarea actual.
* NO debe realizar auditorías generales, revisiones profundas, refactorizaciones globales, limpiezas masivas ni mejoras no solicitadas.
* Prioridad de lectura:
1. Prompt de la fase actual.
2. Archivos directamente afectados.
3. Dependencias directas necesarias para comprender el cambio.
4. Archivos adicionales únicamente si una prueba o error demuestra que son necesarios.

* Una vez obtenido el contexto suficiente, DEBE comenzar la implementación sin continuar investigando indefinidamente.

---

### 27. CONTEXTO MÍNIMO SUFICIENTE — NO TRABAJAR A CIEGAS

* La reducción de consumo de contexto NUNCA debe comprometer la integridad del sistema.
* Antes de modificar código, la IA DEBE conocer qué hace el archivo, quién lo consume, qué API utiliza y qué datos maneja.
* El objetivo es utilizar el MENOR CONTEXTO NECESARIO, no el MENOR CONTEXTO POSIBLE.

---

### 28. EJECUCIÓN DIRECTA Y VALIDACIÓN PROPORCIONAL

* La IA debe aplicar primero la solución mínima necesaria.
* Validaciones proporcionadas: `node --check` para JS/JSX; comprobación de endpoints y contratos en caso de mutaciones de persistencia.
* NO ejecutar auditorías completas del proyecto para cambios locales.
* Si la validación demuestra que el cambio funciona, detener la investigación y entregar el reporte.
* **Validación Mandatoria SRP y CSS Modules en Frontend:** Todo cambio que cree o modifique archivos `.jsx` o `.js` en `apps/web/src` debe ejecutar obligatoriamente:
  ```bash
  node .agents/scripts/verify-srp.js
  ```
  Si el script reporta archivos de más de 120 líneas (páginas), más de 150 líneas (componentes/modales) o estilos en línea (`style={{`), el cambio se considera TÉCNICAMENTE DEFECTUOSO y debe modularizarse de inmediato antes de cualquier entrega.

---

### 29. REGLA DE "NO MEJORAR POR MEJORAR"

* La IA NO debe modificar código únicamente porque considere que podría escribirse de una manera "mejor".
* No realizar refactorizaciones oportunistas durante una implementación funcional.
* Si una mejora es necesaria para evitar que la implementación actual quede técnicamente defectuosa, debe realizarse únicamente en el alcance mínimo necesario.

---

### 30. CRITERIO DE FINALIZACIÓN

Una tarea se considera terminada cuando:

1. El objetivo definido en el prompt fue implementado.
2. No quedan errores introducidos por la propia tarea (`node --check` limpio).
3. Las dependencias directamente afectadas continúan siendo compatibles.
4. Se ejecutaron las validaciones proporcionales correspondientes (incluyendo `node .agents/scripts/verify-srp.js` con código de salida 0 para frontend).
5. Los cambios fueron documentados en el reporte de cierre bajo las categorías `VERIFICADO`, `NO VERIFICADO` o `BLOQUEADO`.

Al cumplir estos cinco puntos, DETENTE inmediatamente. Queda PROHIBIDO continuar explorando o refactorizando tras alcanzar el criterio de finalización.

---

## 4. PROTOCOLO CIRCUIT BREAKER (PREVENCIÓN DE BUCLES INFINITOS)

> **DOCUMENTO NORMATIVO ESPECIALIZADO:** Para la especificación exhaustiva de corte de circuito, umbrales preventivos y aislamiento hermético, ver [`.agents/rules/06-circuit-breaker-and-anti-loop.md`](file:///.agents/rules/06-circuit-breaker-and-anti-loop.md).

### DISYUNTOR DE REINTENTOS DE LÍNEAS (MÁXIMO 2 INTENTOS)
* **Tope de Intentos:** Si un archivo excede los límites de `verify-srp.js` (>120 en páginas, >150 en componentes), el agente tiene un máximo de **2 intentos de edición** para modularizarlo.
* **Prohibición de Micro-Ediciones en Bucle:** Prohibido realizar múltiples ediciones consecutivas intentando eliminar saltos de línea o comprimir sintaxis para "encajar" en 149 líneas.
* **Parada Obligatoria y Consulta:** Al fallar el segundo intento, el agente DEBE DETENERSE inmediatamente, reportar el archivo conflictivo y proponer la extracción de un subcomponente sin continuar ejecutando comandos.

### MARGEN PREVENTIVO DE SEGURIDAD (135 LÍNEAS)
* **Umbral Seguro:** Todo componente debe apuntar a un rango de 70 a 130 líneas. Si un componente alcanza las **135 líneas**, la directriz obligatoria es extraer un subcomponente atómico (`parts/`) en lugar de apurar el margen hasta 150.

### FRONTERA HERMÉTICA FRONTEND / BACKEND
* **Aislamiento de Alcance:** Si una tarea tiene alcance en `apps/web/`, queda terminantemente prohibido leer, buscar o analizar archivos en `apps/api/` (controladores, repositorios, Prisma o servicios).
* **Falta de Contratos o Endpoints:** Si un flujo de frontend requiere un dato, mutación o endpoint que no está documentado en el prompt, el agente NO DEBE salir a explorar el backend para descubrirlo. Debe reportar la duda directamente al desarrollador y detenerse.
