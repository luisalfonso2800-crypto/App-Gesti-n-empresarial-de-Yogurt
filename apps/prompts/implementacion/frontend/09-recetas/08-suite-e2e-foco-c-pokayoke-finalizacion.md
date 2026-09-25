# TAREA CONTROLADA — SUITE E2E FOCO C: BARRERAS POKA-YOKE Y PUBLICACIÓN FINAL DE RECETAS (R23-R30)

OBJETIVO TÉCNICO:
Crear la suite de pruebas E2E `apps/web/e2e/recipes/recipes-finalization.spec.js` (≤ 140 líneas) para validar los requisitos R23 a R30 sobre la formulación y publicación en `/catalog/recipes`:
1. Evaluación de las 5 barreras Poka-Yoke de formulación técnica (alertas y bloqueos de consistencia física y de costos).
2. Reactividad del botón "Finalizar y Resumir": inactivo ante inconsistencias y habilitado cuando el balance es coherente.
3. Apertura del modal "Resumen Operativo / Hoja de Ruta".
4. Confirmación y persistencia final: la receta se publica, se cierra el flujo y el producto sale del listado de huérfanos.

REGLAS DE CUOTA Y ARQUITECTURA:
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO esperas fijas (`waitForTimeout`); usar aserciones web-first de Playwright (`toBeVisible()`, `toBeEnabled()`, `toBeDisabled()`).
- Archivo único en JavaScript (.js), estrictamente ≤ 140 líneas (regla `check-e2e-limits.js`).

CONTENIDO A IMPLEMENTAR EN `apps/web/e2e/recipes/recipes-finalization.spec.js`:
- Helper local de setup canónico:
  Navegar a `/catalog/recipes`, abrir modal desde tarjeta huérfana o "+ Nueva Receta", diligenciar campos canónicos y activar una etapa base para entrar al ciclo de finalización.
- Pruebas R23 a R30 estructuradas de forma concisa:
  * **R23**: Barrera 2: Alerta/Warning visible en la cabecera si un producto clasificado como comercial no incluye una base WIP en su BOM.
  * **R24**: Barrera 3: Advertencia o restricción visual si la receta de un producto envasado carece de empaque primario.
  * **R25**: Barrera 4: Advertencia ante desbordamiento de capacidad si el volumen a dosificar no es coherente con el envase seleccionado.
  * **R26**: Barrera 5: Advertencia o bloqueo en el balance si algún componente intermedio (WIP) no tiene costo unitario resuelto.
  * **R27**: Botón "Finalizar y Resumir" deshabilitado (`toBeDisabled()`) o con indicador restrictivo mientras existan alertas críticas no resueltas.
  * **R28**: Botón "Finalizar y Resumir" habilitado (`toBeEnabled()`) cuando la receta cuenta con etapas válidas y balance consistente.
  * **R29**: Clic en "Finalizar y Resumir" despliega el modal de "Resumen Operativo / Hoja de Ruta" con el desglose consolidado de etapas, tiempos y costos.
  * **R30**: Clic en "Publicar Receta" (o botón de guardado final) persiste la receta, cierra el modal y confirma que el producto seleccionado ya no figure como huérfano en el banner.

VERIFICACIÓN:
1. `node --check apps/web/e2e/recipes/recipes-finalization.spec.js`
2. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Archivo creado con ≤ 140 líneas y sintaxis limpia (código de salida 0).
- `check-e2e-limits.js` retorna 0.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivo creado y conteo de líneas.
- Comando para que el operador humano ejecute la prueba en PowerShell.
- Estado: [COMPLETADO / BLOQUEADO].
