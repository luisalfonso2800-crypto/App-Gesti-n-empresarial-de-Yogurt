TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Estructurar la barra lateral izquierda de etapas (`RecipeStagesTimeline.jsx`) en dos contenedores semánticos claros: un bloque superior para selección de plantillas rápidas con encabezado instructivo y un bloque inferior para la secuencia activa de etapas con su respectiva guía visual.

CLÁUSULA DE CONSUMO MÍNIMO (ANTI-QUOTA EXHAUSTION):
- PROHIBIDO usar búsquedas globales (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee cada archivo exactamente 1 vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx`
2. `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeStagesTimeline.jsx`:
   - Agrupar los botones de tipo/plantilla en una tarjeta con clase `styles.sidebarTemplatesCard`:
     * Encabezado: `<span className={styles.sidebarSectionTitle}>💡 Plantillas Rápidas</span>`
     * Micro-guía: `<p className={styles.sidebarSectionSubtitle}>Carga secuencias estándar predefinidas:</p>`
     * Contenedor horizontal con los 3 botones existentes (Base Láctea, Empaque, Fruta).
   
   - Agrupar la lista y botón de etapas en una tarjeta con clase `styles.sidebarStagesCard`:
     * Encabezado: `<span className={styles.sidebarSectionTitle}>📋 Secuencia de Etapas</span>`
     * Micro-guía: `<p className={styles.sidebarSectionSubtitle}>Organiza, reordena o añade las fases del proceso:</p>`
     * Botón `+ Agregar Etapa` ubicado en la parte superior o pie de esta tarjeta.
     * Lista de tarjetas de etapas (`RecipeTimelineCard`).
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `recipe-stages.module.css`:
   - Definir las clases:
     ```css
     .sidebarTemplatesCard, .sidebarStagesCard {
       background: #FFFFFF;
       border: 1px solid #E5E7EB;
       border-radius: 8px;
       padding: 10px 12px;
       margin-bottom: 12px;
     }
     .sidebarSectionTitle {
       font-size: 12px;
       font-weight: 700;
       color: #1F2937;
       display: flex;
       align-items: center;
       gap: 6px;
       margin-bottom: 2px;
     }
     .sidebarSectionSubtitle {
       font-size: 11px;
       color: #6B7280;
       margin: 0 0 8px 0;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La barra lateral se divide claramente en dos contenedores rotulados que explican la función de las plantillas y la gestión de la secuencia técnica.
- `verify-srp.js` devuelve código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.