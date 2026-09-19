TAREA (PRESUPUESTO ULTRA-BAJO: MÁXIMO 2 TOOL CALLS):
Hacer colapsable/plegable la tarjeta de cabecera de recetas (`RecipeHeaderFields.jsx`), transformándola en una barra resumen delgada (~38px) con botón de expandir/contraer y auto-colapso al interactuar con las etapas.

CLÁUSULA DE CONSUMO MÍNIMO (ANTI-QUOTA EXHAUSTION):
- PROHIBIDO usar búsquedas globales (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee cada archivo exactamente 1 vez y edita directamente.
- Modificación exclusiva en los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`

INSTRUCCIONES DE IMPLEMENTACIÓN:

1. En `RecipeHeaderFields.jsx`:
   - Importar `useState` de React si no está.
   - Declarar el estado: `const [isCollapsed, setIsCollapsed] = useState(false);`
   - Si `isCollapsed === true`, retornar la barra resumen compacta:
     ```jsx
     <div className={styles.headerCollapsedBar}>
       <div className={styles.collapsedSummaryLeft}>
         {selectedProduct?.imagenUrl && (
           <img 
             src={selectedProduct.imagenUrl} 
             alt={selectedProduct.nombre} 
             className={styles.collapsedProductThumb} 
           />
         )}
         <span className={styles.collapsedRecipeTitle}>
           <strong>{formData.nombre || selectedProduct?.nombre || 'Nueva Receta'}</strong>
           <span className={styles.collapsedSeparator}>•</span>
           <span className={styles.collapsedSubInfo}>
             {formData.cantidadBase || 0} {formData.unidadMedida || 'Litros'}
           </span>
         </span>
       </div>
       <button 
         type="button" 
         onClick={() => setIsCollapsed(false)} 
         className={styles.collapsedExpandBtn}
       >
         ✏️ Editar Datos de Cabecera ▾
       </button>
     </div>
     ```
   - Si `isCollapsed === false`, renderizar la tarjeta actual agregando en la cabecera superior o pie:
     ```jsx
     <div className={styles.collapseHeaderRow}>
       <button 
         type="button" 
         onClick={() => setIsCollapsed(true)} 
         className={styles.collapseToggleBtn}
       >
         ▲ Plegar Cabecera (Modo Foco)
       </button>
     </div>
     ```
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En `recipe-modal.module.css`:
   - Añadir estilos limpios con la paleta botánica de MANNÁ:
     ```css
     .headerCollapsedBar {
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding: 6px 14px;
       background: #F4F6F0;
       border: 1px solid #D1D5DB;
       border-radius: 8px;
       margin-bottom: 12px;
       min-height: 38px;
     }
     .collapsedSummaryLeft {
       display: flex;
       align-items: center;
       gap: 10px;
     }
     .collapsedProductThumb {
       width: 28px;
       height: 28px;
       border-radius: 6px;
       object-fit: cover;
       border: 1px solid #CBD5E1;
     }
     .collapsedRecipeTitle {
       font-size: 13px;
       color: #1F2937;
       display: flex;
       align-items: center;
       gap: 8px;
     }
     .collapsedSeparator {
       color: #9CA3AF;
     }
     .collapsedSubInfo {
       color: #4B5563;
       font-size: 12px;
     }
     .collapsedExpandBtn, .collapseToggleBtn {
       background: #FFFFFF;
       border: 1px solid #9CA3AF;
       border-radius: 6px;
       padding: 3px 10px;
       font-size: 11px;
       font-weight: 600;
       color: #374151;
       cursor: pointer;
       transition: all 0.15s ease;
     }
     .collapsedExpandBtn:hover, .collapseToggleBtn:hover {
       background: #E5E7EB;
       border-color: #6B7280;
     }
     .collapseHeaderRow {
       display: flex;
       justify-content: flex-end;
       margin-top: 8px;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta de cabecera se pliega y despliega mediante el botón, ocupando solo una barra de 38px al contraerse.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.