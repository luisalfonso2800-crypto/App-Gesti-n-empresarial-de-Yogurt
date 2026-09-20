TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Optimizar el contenedor "PARÁMETROS DE ENTRADA" en la planificación de producción (`ProductionOrderForm.jsx` o componente equivalente y su módulo CSS):
1. Colocar los campos "Receta / Producto" y "Cantidad a Producir (Litros)" lado a lado en la misma fila (65% / 35%).
2. Integrar el badge "Zona de Configuración Activa" en la misma línea del título para ahorrar espacio vertical.
3. Ampliar la foto del producto a la derecha (aprox. 140x140px) ocupando armónicamente la altura de la tarjeta.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `apps/web/src/app/production/production.module.css` (o el CSS correspondiente)

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderForm.jsx`:
   - Cabecera del contenedor:
     * Unificar el título `PARÁMETROS DE ENTRADA` y la pastilla `Zona de Configuración Activa` en un flex con `justify-content: space-between; align-items: center;`.
   - Grid principal del contenedor (`.parametersSplitLayout`):
     * Columna izquierda (Campos de entrada):
       - Un contenedor flex/grid con `display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: flex-end;`.
       - Campo 1: `<label>Receta / Producto</label>` + `<select>`.
       - Campo 2: `<label>Cantidad a Producir (Litros)</label>` + `<input type="number" step="1" min="1" />`.
     * Columna derecha (Imagen ampliada):
       - `<img className={styles.productImagePreviewLarge} ... />`.
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En el archivo CSS:
   - Estilos para la cabecera integrada y campos horizontales:
     ```css
     .parametersHeaderRow {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 12px;
     }
     .parametersBodyGrid {
       display: grid;
       grid-template-columns: 1fr 140px;
       gap: 18px;
       align-items: center;
     }
     .inputsRow {
       display: grid;
       grid-template-columns: 1.8fr 1fr;
       gap: 14px;
     }
     .productImagePreviewLarge {
       width: 140px;
       height: 120px;
       border-radius: 10px;
       object-fit: cover;
       border: 1px solid #E5E7EB;
       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Ambos campos (Receta y Cantidad) quedan alineados en una sola fila.
- El badge de configuración activa queda en la misma línea del título.
- La foto del producto resalta con mayor tamaño a la derecha sin desbordes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.