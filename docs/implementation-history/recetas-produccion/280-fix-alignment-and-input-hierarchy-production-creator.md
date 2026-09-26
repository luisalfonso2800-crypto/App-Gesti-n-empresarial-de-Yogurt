TAREA:
Corregir la alineación tabular del BOM y jerarquizar visualmente los campos interactivos de entrada en el creador de órdenes de producción (`ProductionOrderCreator.jsx` / componentes co-locados).

OBJETIVO:
1. **Jerarquización Ergonómica de Inputs Editables:**
   - Resaltar los únicos dos controles interactivos ("Receta / Producto" y "Cantidad a Producir") como la zona activa del operario:
     * Contenedor superior con fondo sutil de panel de control (`#FAF8F5`, borde `#D6D3D1`).
     * Input de cantidad y selector con fondo blanco puro, borde con peso visual nítido (`1.5px solid #182622` en focus o `#A8A29E` en reposo) y tipografía más prominente (`font-size: 1.05rem`, `font-weight: 600`).
     * Añadir indicador sutil tipo badge o etiqueta: *"Parámetros a Configurar"* para separar mentalmente la entrada de los resultados proyectados.

2. **Alineación Quirúrgica de la Tabla BOM:**
   - Regularizar la tabla con `table-layout: fixed` o CSS Grid de columnas estrictas:
     * Columna 1 (Insumo): `text-align: left` (ancho ~24%).
     * Columna 2 (Req. Teórico): `text-align: right` (cabecera y celdas alineadas a la derecha, ancho ~14%).
     * Columna 3 (Stock Actual): `text-align: right` (cabecera y celdas a la derecha, ancho ~14%).
     * Columna 4 (Costo Unit.): `text-align: right` (ancho ~11%).
     * Columna 5 (Subtotal): `text-align: right` (ancho ~13%).
     * Columna 6 (Faltante): `text-align: right` (ancho ~12%).
     * Columna 7 (Estado): `text-align: center` (ancho ~12%).
   - Garantizar que las cabeceras `<th>` compartan exactamente el mismo `padding` y `text-align` que sus celdas `<td>` hermanas para eliminar cualquier descuadre.

3. **Arquitectura y Estilos:**
   - Modificaciones 100% en `production.module.css` (o CSS Module co-locado).
   - Mantener componentes < 150 líneas. Cero `style={{}}`.
   - Ejecutar `node .agents/scripts/verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `apps/web/src/app/operations/production/production.module.css`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Inspecciona y modifica exclusivamente los componentes y CSS de `apps/web/src/app/operations/production/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- Componentes del creador de órdenes de producción en `apps/web/src/app/operations/production/components/`
- Hoja de estilos `.module.css` asociada.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. EN EL FORMULARIO DE ENTRADA:
   - Encapsular la fila de `Receta / Producto` y `Cantidad a Producir` en una clase `.controlInputPanel` que tenga:
     * Fondo suave para destacar que es la zona de digitación.
     * Inputs con buen espaciado interno (`padding: 0.65rem 0.85rem`).
     * Cursor pointer en el select y números claros en el input numérico.

2. EN LA TABLA BOM:
   - Configurar clases dedicadas para celdas numéricas:
     ```css
     .colText { text-align: left; }
     .colNumber { text-align: right; font-variant-numeric: tabular-nums; }
     .colStatus { text-align: center; }
     ```
   - Aplicar estas mismas clases tanto a los `<th>` como a los `<td>` correspondientes.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla BOM proyecta una alineación vertical perfecta entre cabeceras y números.
- Los campos de entrada de datos destacan nítidamente sobre las tarjetas informativas.
- `verify-srp.js` finaliza con código 0 y 0 infracciones.

DETENCIÓN:
Al terminar las verificaciones con código 0, DETENTE.

SALIDA:
- Archivos CSS y JSX actualizados:
- Clases aplicadas:
- Resultado de verify-srp.js:
- Estado: