TAREA:
Reducir exclusivamente el espaciado vertical entre los botones de navegación del Sidebar en su hoja de estilos CSS, para eliminar el scroll vertical sin alterar el diseño, el encabezado MANNÁ ni los tamaños de texto.

OBJETIVO:
1. En el archivo CSS del Sidebar (`apps/web/src/components/shell/sidebar.module.css` o `shell.module.css`):
   - Localizar las reglas que aplican a los ítems de navegación (`.navItem`, `.navLink` o enlaces `<a>` del menú):
     * Reducir el padding vertical: por ejemplo, de `8px` o `10px` a `5px` o `6px`.
     * Reducir cualquier margen vertical (`margin-top` / `margin-bottom`) entre ítems o su contenedor `gap` a `2px`.
   - Localizar los subtítulos de categoría (`GENERAL`, `CATÁLOGOS`, `OPERACIONES`, `COMERCIAL`):
     * Reducir ligeramente su margen superior e inferior (por ejemplo: `margin: 6px 0 2px 0`).
   - Mantener intacto el encabezado de MANNÁ, el logo, el lema y el pie de página ("Procesos que dan vida").
   - NO agregar botones de colapsar, ni lógica JS nueva, ni modificar `Sidebar.jsx` a menos que sea estrictamente necesario para vincular una clase CSS existente.

2. Restricciones Técnicas:
   - Modificación 100% confinada al CSS Module del menú.
   - Cero inline styles (`style={{}}`).
   - Cumplir Circuit Breaker (< 135 líneas por archivo).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/sidebar.module.css` (o `shell.module.css`)
- `apps/web/src/components/shell/Sidebar.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente hojas de estilo en `apps/web/src/components/shell/`. Prohibido tocar lógica de negocio o backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- Archivo CSS Module correspondiente al Sidebar/Shell.

NO MODIFICAR:
- `apps/api/` (backend)
- Estructura HTML de cabecera MANNÁ ni textos del menú.

VERIFICACIÓN:
1. Comprobar visualmente que el scroll vertical de la barra lateral desaparezca en pantalla completa.
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Scroll vertical eliminado en el sidebar gracias a la compactación sutil de márgenes.
- Encabezado y tipografías se conservan idénticos a la versión previa.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos CSS modificados:
- Valores de padding/margin ajustados:
- Resultado de verify-srp.js:
- Estado: