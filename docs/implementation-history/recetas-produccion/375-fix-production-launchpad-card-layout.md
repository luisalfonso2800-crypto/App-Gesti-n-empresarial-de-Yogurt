TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir el layout desbordado del lanzador de productos (`ProductionProductLaunchpad.jsx`) en la Bitácora de Producción:
1. Confinar la tarjeta del producto en un card compacto horizontal (imagen máxima de 72x72px, badges institucionales y botón estructurado).
2. Asegurar que debajo del lanzador se renderice la sección de la Bitácora / Historial de Lotes (o su empty-state centrado si no hay órdenes).

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/ProductionProductLaunchpad.jsx`
2. `apps/web/src/app/production/production.module.css` (o el módulo CSS correspondiente de producción)

INSTRUCCIONES TÉCNICAS:

1. En `ProductionProductLaunchpad.jsx`:
   - Renderizar el carrusel/fila con clase `styles.launchpadGrid`.
   - Cada tarjeta debe tener clase `styles.launchpadCard`:
     * Contenedor flex horizontal:
       - Miniatura: `<img className={styles.launchpadImg} src={...} alt={p.nombre} />`
       - Contenido:
         * Título: `<h4 className={styles.launchpadTitle}>{p.nombre}</h4>`
         * Micro-badges: `<span className={styles.badgeStock}>📦 En Cava: {p.stockActual || 0} und</span>`
         * Botón de acción: `<button className={styles.btnLaunch} onClick={() => onProduce(p)}>▶ Producir Lote</button>`
   - Mantener el componente bajo 120 líneas (SRP).

2. En `production.module.css`:
   - Definir los estilos compactos:
     ```css
     .launchpadSection {
       margin-bottom: 24px;
       background: #FDFBF7;
       border: 1px solid #EFECE6;
       border-radius: 12px;
       padding: 16px;
     }
     .launchpadGrid {
       display: flex;
       gap: 16px;
       overflow-x: auto;
       padding: 4px 0;
     }
     .launchpadCard {
       background: #FFFFFF;
       border: 1px solid #E5E7EB;
       border-radius: 10px;
       padding: 12px;
       display: flex;
       align-items: center;
       gap: 14px;
       min-width: 280px;
       box-shadow: 0 1px 3px rgba(0,0,0,0.05);
     }
     .launchpadImg {
       width: 68px;
       height: 68px;
       border-radius: 8px;
       object-fit: cover;
       border: 1px solid #E5E7EB;
       flex-shrink: 0;
     }
     .launchpadTitle {
       font-size: 13px;
       font-weight: 700;
       color: #1F2937;
       margin: 0 0 4px 0;
     }
     .btnLaunch {
       background: #1B4332;
       color: #FFFFFF;
       border: none;
       border-radius: 6px;
       padding: 6px 12px;
       font-size: 12px;
       font-weight: 600;
       cursor: pointer;
       margin-top: 6px;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ProductionProductLaunchpad.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta del producto deja de expandirse por toda la pantalla y adquiere proporciones nítidas de card industrial.
- El botón de producción queda con estilo MANNÁ verde y el stock claramente rotulado.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.