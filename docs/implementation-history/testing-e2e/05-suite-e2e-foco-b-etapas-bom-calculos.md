# TAREA CONTROLADA — SUITE E2E FOCO B: ETAPAS, BOM Y CÁLCULOS MATEMÁTICOS (R11-R22)

OBJETIVO TÉCNICO:
Crear la suite de pruebas E2E `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js` (≤ 140 líneas) para validar los requisitos R11 a R22 sobre la formulación técnica en `/catalog/recipes`:
1. Habilitación de adición de etapas tras completar la cabecera canónica.
2. Inyección de etapas predefinidas mediante plantillas rápidas.
3. Parametrización y validación de rangos de tiempo y temperatura.
4. Registro de materias primas e insumos intermedios (WIP) en la lista de materiales (BOM).
5. Cálculos automáticos: merma porcentual, subtotal de insumos, costo roll-up del lote y costo unitario proyectado.

REGLAS DE CUOTA Y ARQUITECTURA:
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO esperas ciegas (`waitForTimeout`); usar aserciones web-first de Playwright.
- Archivo único en JavaScript (.js), estrictamente ≤ 140 líneas (regla `check-e2e-limits.js`).

CONTENIDO A IMPLEMENTAR EN `apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js`:
- Helper local de apertura y desbloqueo:
  Navegar a `/catalog/recipes`, abrir el modal de recetas (`button:has-text("+ Nueva Receta")` o desde tarjeta huérfana) y llenar los 4 campos canónicos (Producto, Nombre Técnico, Cantidad Base y Unidad) para superar la compuerta de la Fase 1.
- Pruebas R11 a R22 estructuradas de forma concisa:
  * **R11**: Botón "+ Agregar Etapa" interactivo y habilitado tras superar la Fase 1.
  * **R12**: Botón de plantilla rápida inyecta la etapa preconfigurada en el listado.
  * **R13**: Formulario de etapa manual permite ingresar nombre y orden correlativo.
  * **R14**: Tiempo de proceso ingresado en minutos muestra la proyección secundaria formateada en horas.
  * **R15**: Validación de coherencia en rangos de temperatura ($Mín \le Obj \le Máx$), marcando advertencia o borde de error si se rompe la regla.
  * **R16**: Inserción de materia prima en el BOM asigna selector de insumo, cantidad requerida y unidad base.
  * **R17**: Selector del BOM permite la inclusión de productos semielaborados (WIP) como componente.
  * **R18**: Porcentaje de merma configurado calcula y proyecta la necesidad bruta requerida.
  * **R19**: Subtotal de costo por insumo se actualiza en tiempo real según el volumen/peso ingresado.
  * **R20**: Costo total del batch (Roll-Up) acumula insumos de bodega y bases intermedias.
  * **R21**: Costo unitario proyectado refleja la división exacta entre el Costo Total Batch y el Rendimiento Base.
  * **R22**: Producto WIP sin costo base configurado genera advertencia preventiva o marca alerta de costeo.

VERIFICACIÓN:
1. `node --check apps/web/e2e/recipes/recipes-stages-bom-calc.spec.js`
2. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Archivo creado con ≤ 140 líneas y sintaxis limpia (código de salida 0).
- `check-e2e-limits.js` retorna 0.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE REQUERIDO:
- Archivo creado y conteo de líneas.
- Comando para ejecución manual en PowerShell.
- Estado: [COMPLETADO / BLOQUEADO].
