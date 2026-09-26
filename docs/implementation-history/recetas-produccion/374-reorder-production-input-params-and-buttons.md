TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Refactorizar la cabecera de parámetros y los botones de acción del modal de planificación de producción (`ProductionOrderForm.jsx` / `production.module.css`):
1. Apilar los campos: "Cantidad a Producir" debajo de "Receta / Producto".
2. Ampliar el tamaño de la imagen a la derecha y remover el texto redundante que tiene debajo.
3. Incorporar iconos limpios (SVG/Lucide estándar, sin emojis de smartmodal) en los 3 botones del pie.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `apps/web/src/app/production/production.module.css` (o archivo CSS de producción)

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderForm.jsx`:
   - En el contenedor de "PARÁMETROS DE ENTRADA":
     * Columna izquierda (`.inputsColumn`):
       - Campo 1: `<label>Receta / Producto</label>` + `<select>`.
       - Campo 2 (justo debajo): `<label>Cantidad a Producir (Litros)</label>` + `<input type="number">`.
     * Columna derecha (`.imageColumn`):
       - Contenedor de imagen ampliado (`productImagePreviewLarge`).
       - Eliminar cualquier `<p>` o `<span>` que renderice el nombre o fórmula debajo de la imagen.
   - En la barra de botones del pie:
     * Botón "Cancelar Formulario": agregar icono SVG/Lucide de cancelación o retorno (ej. `<X size={15} />`).
     * Botón "Guardar como Planificada": agregar icono de calendario/guardado (ej. `<CalendarClock size={15} />` o `<BookmarkCheck size={15} />`).
     * Botón "Iniciar Fabricación Inmediata": agregar icono de marcha/ejecución (ej. `<Play size={15} fill="currentColor" />` o `<Zap size={15} />`).
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En el archivo CSS:
   - Ajustar el flexbox/grid para la cabecera:
     ```css
     .parametersCardBody {
       display: grid;
       grid-template-columns: 1fr 140px;
       gap: 16px;
       align-items: center;
     }
     .inputsColumn {
       display: flex;
       flex-direction: column;
       gap: 12px;
     }
     .productImagePreviewLarge {
       width: 100%;
       height: 115px;
       border-radius: 8px;
       object-fit: cover;
       border: 1px solid #E5E7EB;
     }
     ```
   - Asegurar que los botones muestren `display: inline-flex; align-items: center; gap: 8px;` para alinear los iconos.

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los dos campos de entrada quedan apilados verticalmente a la izquierda.
- La foto del producto queda ampliada a la derecha sin textos debajo.
- Los botones de acción cuentan con sus respectivos iconos profesionales alineados.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.