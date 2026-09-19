TAREA:
Simplificar el modal de "Nueva Presentación" para eliminar opciones ambiguas del selector de envases y añadir microtextos explicativos claros y libres de tecnicismos para el operador.

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido búsquedas globales.
- Edición focalizada en el modal/formulario de Presentaciones.
- Cumplimiento estricto de SRP (< 135 líneas por archivo).

OBJETIVO:
1. En el componente del modal de creación de presentaciones (`PresentationModal.jsx` o `PresentationForm.jsx`):
   - **Depurar la lista de `TIPO DE ENVASE`:**
     Eliminar valores redundantes (`UNIDAD`, `BULTO`, `CANASTILLA`).
     Definir catálogo claro:
     * `ENVASE` (Pote / Contenedor Plástico)
     * `BOTELLA` (Bebible)
     * `BOLSA` (Flexible / Sachet)
     * `VASO` (Porción individual)
     * `BALDE` (Granel / Mayorista)
     * `OTRO`
   - **Microtexto descriptivo bajo el select:**
     Añadir texto sutil (fontSize 12px, color atenuado):
     "Elige la forma física del producto. Aparecerá en las órdenes de producción y etiquetas de venta."
   - **Mejora del Resumen Dinámico:**
     Redactar la tarjeta informativa en lenguaje claro:
     "Se creará la presentación [NOMBRE] en formato [TIPO_ENVASE] de [ML] ml. Cada lote descontará 1 recipiente por unidad terminada."

2. Restricciones Técnicas:
   - Mantener el componente por debajo de 135 líneas (SRP).
   - Estilos en CSS Modules.
   - Ejecutar `node .agents/scripts/verify-srp.js` con código 0.

FUENTES DE VERDAD:
- Componente de formulario de Presentaciones en `apps/web/src/app/catalog/presentations/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código frontend en `apps/web/src/app/catalog/presentations/`. Backend intacto.

ALCANCE:

MODIFICAR:
- Formulario modal de Presentaciones y su respectivo archivo de estilos.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-componente-modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Lista de envases clara, sin redundancias como "envase de unidad".
- Explicación visible para el operador.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Nuevas opciones de envase configuradas:
- Resultado de verify-srp.js:
- Estado: