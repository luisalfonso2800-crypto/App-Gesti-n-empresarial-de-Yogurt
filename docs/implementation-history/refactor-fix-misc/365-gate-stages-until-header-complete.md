TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar la compuerta Poka-Yoke en `RecipeModal.jsx` para ocultar completamente la sección de etapas (plantillas, lista lateral y editor) y el dock de costos inferior si la cabecera no tiene sus 4 datos obligatorios completos (`idProducto`, `nombre`, `cantidadBase > 0`, `unidadMedida`).

CLÁUSULA DE CONSUMO MÍNIMO (ANTI-QUOTA EXHAUSTION):
- PROHIBIDO usar búsquedas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee una sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeModal.jsx`:
   - Evaluar la completitud estricta de la cabecera:
     ```javascript
     const isHeaderComplete = Boolean(
       (formData.idProducto || formData.productoId) &&
       formData.nombre?.trim() &&
       Number(formData.cantidadBase || formData.rendimientoBase) > 0 &&
       (formData.unidadMedida || formData.unidadRendimiento)?.trim()
     );
     ```
   - Condicionar la renderización de la zona de etapas y del balance:
     * Si `!isHeaderComplete`:
       Renderizar una tarjeta asistida institucional de orientación:
       ```jsx
       <div className={styles.headerGatePlaceholder}>
         <div className={styles.headerGateIcon}>🔒</div>
         <h4 className={styles.headerGateTitle}>Paso 1: Completa la información básica</h4>
         <p className={styles.headerGateText}>
           Ingresa el producto, nombre técnico, cantidad base y unidad de medida para habilitar las etapas y el costeo.
         </p>
       </div>
       ```
       NO renderizar `<RecipeStagesList />` ni `<RecipeBalanceFooter />`.
     * Si `isHeaderComplete`:
       Renderizar normalmente el panel de etapas (`RecipeStagesList`) y el dock inferior (`RecipeBalanceFooter`).
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En `recipe-modal.module.css`:
   - Agregar las clases:
     ```css
     .headerGatePlaceholder {
       background: #FDFBF7;
       border: 1px dashed #D1D5DB;
       border-radius: 12px;
       padding: 48px 24px;
       text-align: center;
       margin-top: 16px;
     }
     .headerGateIcon {
       font-size: 28px;
       margin-bottom: 8px;
     }
     .headerGateTitle {
       font-size: 15px;
       font-weight: 700;
       color: #1F2937;
       margin: 0 0 4px 0;
     }
     .headerGateText {
       font-size: 13px;
       color: #6B7280;
       margin: 0;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Si "CANTIDAD BASE" está vacía o en 0, no se muestran etapas ni dock inferior.
- Al ingresar una cantidad válida, la sección de etapas y el balance aparecen de inmediato.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.