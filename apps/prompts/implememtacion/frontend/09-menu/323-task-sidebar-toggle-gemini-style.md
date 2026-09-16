TAREA:
Incorporar el botón toggle de colapso/despliegue en la esquina superior derecha del Sidebar (idéntico al botón de panel de Gemini/Google) sin mover, desalinear ni alterar el logo MANNÁ, los textos, ni los espaciados verticales actuales.

REGLA DE EFICIENCIA (REGLA 07):
- Máximo 1 lectura por archivo. No ejecutes Search globales ni bucles de lectura.
- Edita directamente los archivos asignados y valida con verify-srp.js.

OBJETIVO:
1. En el contenedor superior del Sidebar (`Sidebar.jsx` o su cabecera):
   - El logo, isotipo y lema se mantienen exactamente en su posición y estilos actuales.
   - En la esquina superior derecha de la cabecera (usando `position: absolute; top: 12px; right: 12px;` dentro de un contenedor `position: relative` del sidebar header, o mediante flexbox limpio con `justify-content: space-between`):
     * Renderizar el botón `SidebarCollapseButton`.
     * Botón cuadrado estilizado (~28x28px), fondo transparente, `border-radius: 6px`, color de trazo SVG blanco/crema sutil (`rgba(255,255,255,0.7)`), hover: `background: rgba(255,255,255,0.08)`.
     * Ícono SVG: Ícono de panel/sidebar rectangular con barra lateral vertical (idéntico a la UI de Gemini).
       - Expandido: ícono de panel con barra a la izquierda o chevron sutil de repliegue.
       - Colapsado: ícono de panel abierto.
     * Accesibilidad: `aria-label="Alternar barra lateral"`, `title="Colapsar menú"`.

2. En el archivo CSS Module correspondiente (`shell.module.css` o `sidebar.module.css`):
   - NO modificar paddings, márgenes ni fuentes de los enlaces ya calibrados en la tarea anterior.
   - Definir la clase `.toggleButton`:
     ```css
     .toggleButton {
       position: absolute;
       top: 14px;
       right: 12px;
       width: 28px;
       height: 28px;
       display: inline-flex;
       align-items: center;
       justify-content: center;
       background: transparent;
       border: 1px solid rgba(255, 255, 255, 0.12);
       border-radius: 6px;
       color: rgba(255, 255, 255, 0.8);
       cursor: pointer;
       transition: background 0.15s ease, color 0.15s ease;
       z-index: 10;
     }
     .toggleButton:hover {
       background: rgba(255, 255, 255, 0.08);
       color: #ffffff;
     }
     ```
   - Al estar `.sidebarCollapsed` activo:
     * Reducir ancho del sidebar a ~68px.
     * Ocultar textos de enlaces y subtítulos (`display: none`), manteniendo los íconos de cada ruta centrados horizontalmente (`justify-content: center`).
     * Reposicionar el botón toggle centrado en la parte superior.

3. Restricciones Técnicas:
   - Cumplir SRP (< 135 líneas por archivo en frontend).
   - Estilos exclusivos en CSS Modules (cero estilos inline `style={{}}`).
   - Cero scrollbars (`overflow-y: hidden`).
   - `node .agents/scripts/verify-srp.js` debe devolver código 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/Sidebar.jsx`
- `apps/web/src/components/shell/shell.module.css` (o CSS del sidebar)
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/components/shell/`. Backend intacto.

ALCANCE:

MODIFICAR:
- `apps/web/src/components/shell/Sidebar.jsx`
- Archivo CSS Module del sidebar

CREAR (si aplica por SRP):
- `apps/web/src/components/shell/parts/SidebarCollapseButton.jsx`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/shell/Sidebar.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Botón integrado en la esquina superior derecha del sidebar sin alterar el diseño de MANNÁ.
- Transición limpia entre expandido y colapsado.
- Cero desbordes y `verify-srp.js` en código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Resultado de verify-srp.js:
- Estado: