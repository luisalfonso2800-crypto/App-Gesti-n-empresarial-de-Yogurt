TAREA:
Implementar un widget desplegable de herramientas de planta (Calculadora y Conversor de Unidades) en el TopBar global junto al carrito de compras/notificaciones.

OBJETIVO:
1. Crear la estructura modular del widget en `apps/web/src/components/common/tools/`:
   - `PlantToolsModal.jsx` (o popover contenedor):
     * Activador en la barra superior con ícono discreto (ej. 🧮 o balanza/herramientas).
     * Navegación por pestañas simples: `[ 🧮 Calculadora ]` y `[ ⚖️ Conversor de Unidades ]`.
     * Botón de cierre o descarte al hacer clic fuera / tecla Escape.
   - `ToolCalculatorTab.jsx`:
     * Display numérico y pad táctil: dígitos 0-9, punto decimal, operaciones básicas (+, -, *, /), porcentaje (%) y botón limpiar (C).
   - `ToolConverterTab.jsx`:
     * Selector de magnitud: Volumen o Masa.
     * Inputs numéricos bidireccionales con unidades clave:
       - Volumen: ml, fl oz (onza líquida), Litros.
       - Masa: gramos, kg, libras.
     * Cálculo reactivo inmediato al escribir.
   - Hoja de estilos `plant-tools.module.css`:
     * CSS Modules puro, respetando el Design System MANNÁ (tonos neutros, tipografía legible y sombras sutiles).

2. Integrar en la barra superior (`TopBar.jsx` o componente análogo en `apps/web/src/components/layout/`):
   - Ubicar el acceso directo inmediatamente al lado del carrito de compras o campana de alertas.

3. Restricciones Técnicas:
   - Respetar estrictamente el umbral preventivo SRP (< 135 líneas por archivo).
   - Cero estilos en línea (`style={{}}`), todo mediante CSS Modules.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- Componentes de cabecera: `apps/web/src/components/layout/` o estructura de layout activa
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente código de frontend en `apps/web/src/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

CREAR:
- `apps/web/src/components/common/tools/PlantToolsModal.jsx`
- `apps/web/src/components/common/tools/ToolCalculatorTab.jsx`
- `apps/web/src/components/common/tools/ToolConverterTab.jsx`
- `apps/web/src/components/common/tools/plant-tools.module.css`

MODIFICAR:
- Componente de cabecera / TopBar para incluir el activador.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/common/tools/PlantToolsModal.jsx`
2. `node --check apps/web/src/components/common/tools/ToolCalculatorTab.jsx`
3. `node --check apps/web/src/components/common/tools/ToolConverterTab.jsx`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Panel desplegable con calculadora y conversor de unidades operativo en el TopBar.
- Modularización limpia con `verify-srp.js` retornando código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos creados/modificados:
- Funcionalidades del conversor y calculadora verificadas:
- Resultado de verify-srp.js:
- Estado: