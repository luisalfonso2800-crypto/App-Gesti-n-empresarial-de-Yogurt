TAREA:
Alinear visualmente `PresentationModal` y `SmartModal` a la identidad botánica estricta de MANNÁ, tomando como referencia el diseño aplicado en `SaleModal.jsx` o `ClientFormModal.jsx` (cabecera verde profundo con isotipo/hoja, tipografía institucional, separación clara de zonas y botones tácticos de acción).

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido búsquedas globales.
- Edición focalizada en el layout visual del modal.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. Inspeccionar `apps/web/src/app/commercial/sales/components/SaleModal.jsx` (o `ClientFormModal.jsx`) para replicar su lenguaje visual exacto:
   - **Header Institucional Botánico:**
     * Fondo institucional verde bosque / superficie distintiva (`#152e22` o token de header de modal MANNÁ).
     * Isotipo de hoja MANNÁ o badge del catálogo al lado del título.
     * Título en tipografía institucional serif/botánica en blanco/crema (`#f7f4ed`).
     * Subtítulo con contraste suave (`#d1d5db` o tono crema tenue).
     * Botón de cierre (`X`) estilizado y contrastado con el fondo oscuro.
   - **Body:**
     * Fondo crema sutil o blanco limpio con padding estructurado y bordes de input redondeados acordes al design system.
     * Tarjeta verde de resumen inferior bien delineada.
   - **Footer Táctico Estandarizado:**
     * Fondo ligeramente diferenciado con borde superior sutil (`border-top: 1px solid rgba(...)`).
     * Botón primario con estilo botón botánico (`bg: #1b4332`, hover `#2d6a4f`, texto blanco crema).

2. Aplicar estos ajustes en `apps/web/src/components/ui/SmartModal.jsx` y `SmartModal.module.css` (o en `presentation-modal.module.css` si el modal maneja su propio skin):
   - Garantizar que la variante o cabecera por defecto proyecte de inmediato la identidad MANNÁ.
   - Asegurar que no se rompan otros modales que consumen `SmartModal`.

3. Restricciones Técnicas:
   - Mantener componentes bajo 135 líneas (SRP).
   - Cero inline styles (`style={{}}`).
   - `node .agents/scripts/verify-srp.js` debe arrojar código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/commercial/sales/components/SaleModal.jsx`
- `apps/web/src/components/ui/SmartModal.jsx`
- `apps/web/src/components/ui/SmartModal.module.css`
- `.agents/rules/04-design-system-manna.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/`. Backend intacto.

ALCANCE:

MODIFICAR:
- `apps/web/src/components/ui/SmartModal.jsx`
- `apps/web/src/components/ui/SmartModal.module.css`
- (Opcional) `presentation-modal.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/ui/SmartModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal de Nueva Presentación exhibe la cabecera botánica auténtica de MANNÁ con contraste cromático, ícono y footer estandarizado.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Elementos visuales aplicados de la identidad botánica:
- Resultado de verify-srp.js:
- Estado: