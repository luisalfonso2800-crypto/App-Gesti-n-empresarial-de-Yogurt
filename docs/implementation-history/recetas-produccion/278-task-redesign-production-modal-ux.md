TAREA:
Rediseñar el modal de planificación y creación de órdenes de producción (`ProductionModal.jsx` / `ProductionOrderCreator.jsx`) para hacerlo altamente intuitivo, transparente en el cálculo de cantidades y guiado por Poka-Yoke industrial.

OBJETIVO:
1. En el componente de creación/planificación de lotes de producción:
   - **Explicación de Rendimiento Base:** Al seleccionar una receta, mostrar de forma visible su rendimiento base configurado (ej. "Lote estándar: 100 Litros") para aclarar qué significa la cantidad a producir.
   - **Claridad en Cantidad a Producir:** Ayudar al operario a entender si está fabricando 1 lote entero o un volumen personalizado, mostrando el factor de proporción matemático en tiempo real.
   - **BOM Dinámico y Reactivo:** Hacer que la tabla de materiales (insumos requeridos) multiplique los requerimientos teóricos al instante conforme se modifica la cantidad a producir.
   - **Validación Poka-Yoke de Stock:** Mostrar claramente si el stock actual en bodega cubre el 100% de la orden, advirtiendo con colores y bloqueando el botón "Iniciar Producción" si hay insuficiencia crítica de insumos.
2. Modularizar en subcomponentes atómicos co-locados (< 150 líneas) utilizando CSS Modules puro (`production-modal.module.css`). Prohibido `style={{}}`.
3. Asegurar que `node .agents/scripts/verify-srp.js` finalice con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx` (o modal equivalente)
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Inspecciona exclusivamente el submódulo de producción en `apps/web/src/app/operations/production/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/app/operations/production/components/` (archivos del modal/creador de órdenes)
- `apps/web/src/app/operations/production/production.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. TARJETA DE CONTEXTO DE RECETA:
   - Al seleccionar la receta en el selector, extraer su rendimiento base y unidad. Renderizar una cápsula informativa `#F7F4EE` que indique: `✦ Receta seleccionada: [Nombre]. Rendimiento base estándar: [X] [Unidad].`

2. CÁLCULO PROPORCIONAL DE INSUMOS (BOM):
   - Al cambiar el input `cantidadAProducir`, calcular el factor de proporción:
     `const factor = cantidadDeseada / receta.rendimientoBase` (si el rendimiento base es 0 o nulo, asumir 1).
   - Multiplicar cada insumo del BOM: `reqTeorico = insumoReceta.cantidad * factor`.
   - Mostrar el resultado formateado con su unidad técnica correspondiente en la tabla.

3. VALIDACIÓN DE SUFICIENCIA:
   - Comparar `reqTeorico` con `stockActual`. Si `stockActual < reqTeorico`, marcar la fila en rojo tenue (`#FEF2F2`) con estado `Insuficiente` y deshabilitar el botón de inicio de producción para proteger la planta contra mermas por desabastecimiento.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal de producción explica claramente el rendimiento base y calcula los insumos de forma proporcional y transparente al cambiar la cantidad.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al completar la verificación y obtener código 0, DETENTE.

SALIDA:
- Componentes modificados:
- Lógica de proporción aplicada:
- Resultado de verify-srp.js:
- Estado: