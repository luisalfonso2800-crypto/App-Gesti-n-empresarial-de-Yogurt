# TAREA CONTROLADA — SUITE E2E FOCO A: LISTADO DE HUÉRFANOS Y CASCADA POKA-YOKE FASE 1 (R01-R10)

OBJETIVO TÉCNICO:
Crear la suite de pruebas E2E `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js` (≤ 140 líneas) para validar los requisitos R01 a R10 sobre `/catalog/recipes`:
1. Renderizado y conteo del banner de huérfanos.
2. Buscador reactivo por nombre y código de producto.
3. Filtro por tipo: "Todos", "Comercial" y "WIP / Tanque".
4. Apertura del modal de formulación (`RecipeModal.jsx`) precargando el producto huérfano seleccionado.
5. Compuerta Poka-Yoke: verificación de que las etapas y el panel de configuración permanezcan bloqueados u ocultos hasta completar la información básica (Fase 1).

REGLAS DE CUOTA ESTRICTA Y ARQUITECTURA:
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO esperas ciegas (`waitForTimeout`); usar aserciones web-first de Playwright (`toBeVisible()`, `toBeEnabled()`).
- Archivo único en JavaScript (.js), estrictamente ≤ 140 líneas (regla `check-e2e-limits.js`).

CONTENIDO A IMPLEMENTAR EN `apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js`:
- `test.beforeEach`: Navegar a `/catalog/recipes` y esperar que el contenedor principal o cabecera esté montado.
- Pruebas R01 a R10 estructuradas de forma concisa:
  * **R01**: Cabecera principal visible con el título "Recetas Técnicas" y el botón "+ Nueva Receta".
  * **R02**: Si existen productos huérfanos, el banner de advertencia está presente con su texto de productos sin receta.
  * **R03**: Tipear en el input de búsqueda de huérfanos (`input[type="search"], input[placeholder*="Buscar"]`) filtra las tarjetas coincidentes por nombre.
  * **R04**: El buscador filtra adecuadamente cuando se ingresa el código interno de un producto.
  * **R05**: Seleccionar "WIP" en el selector de tipo muestra exclusivamente tarjetas con el badge "WIP".
  * **R06**: Seleccionar "Comercial" en el selector de tipo muestra tarjetas con el badge "COM" o "COMERCIAL".
  * **R07**: Clic en "+ Crear Receta" dentro de una tarjeta huérfana abre el modal de recetas (`RecipeModal`) con dicho producto preseleccionado en el campo correspondiente.
  * **R08**: Compuerta Poka-Yoke: con el modal recién abierto y sin completar los 4 campos canónicos (producto, nombre técnico, cantidad base > 0, unidad), la secuencia de etapas y dock inferior permanecen bloqueados u ocultos.
  * **R09**: Completar Producto, Nombre Técnico, Cantidad Base (ej. 100) y Unidad desbloquea la interfaz de etapas operativas.
  * **R10**: Al seleccionar un producto en el modal, el nombre técnico se sugiere automáticamente con el prefijo "Fórmula - [Nombre]".

VERIFICACIÓN:
1. `node --check apps/web/e2e/recipes/recipes-orphans-and-gate.spec.js`
2. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Archivo creado con ≤ 140 líneas y sintaxis limpia (código de salida 0).
- `check-e2e-limits.js` retorna 0.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE REQUERIDO:
- Archivo creado y conteo de líneas.
- Comando para ejecución manual en PowerShell.
- Estado: [COMPLETADO / BLOQUEADO].
