TAREA:
Rediseñar y modernizar la sección "Cabecera de Receta" (`RecipeHeader.jsx` o componente equivalente en `apps/web/src/app/catalog/recipes/components/modal-parts/`), organizando los inputs en un grid limpio, integrando la miniatura del producto y estilizando la alerta de planta.

OBJETIVO:
1. En el componente de cabecera de recetas (`RecipeHeader.jsx` / `RecipeBasicFields.jsx`):
   - **Contenedor Principal:** Envolver los campos en una tarjeta unificada con fondo limpio, borde sutil (`border: 1px solid #e8e5de`), `border-radius: 12px` y padding balanceado.
   - **Sección de Producto y Rendimiento:**
     * Integrar la miniatura (avatar 56x56 px con `border-radius: 10px`) de forma armónica junto al dropdown "PRODUCTO A FABRICAR".
     * Agrupar en la misma fila el campo numérico "CANTIDAD RENDIMIENTO BASE" y el badge de "UNIDAD DE MEDIDA" (mostrado como chip fijo con fondo neutro y texto claro).
   - **Nombre de la Receta y Notas:**
     * Colocar "NOMBRE TÉCNICO DE LA RECETA" con input de borde suave y placeholder claro.
     * Integrar el botón/toggle de "+ Agregar notas u observaciones" con un enlace o botón colapsable discreto.
   - **Banner de Atención de Planta:**
     * Reemplazar la franja plana por una tarjeta callout con borde izquierdo sólido en color ámbar (`border-left: 4px solid #f59e0b`), fondo suave (`#fffbeb`) e ícono de advertencia limpio.

2. Restricciones Técnicas:
   - Respetar el límite de Circuit Breaker (< 135 líneas por archivo). Si la cabecera es extensa, separar el banner de alerta en `RecipeHeaderAlert.jsx`.
   - CSS Modules puro (cero estilos inline `style={{}}`).
   - Mantener intactas las props, bindings y validaciones con `useRecipeForm`.
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- Componentes de cabecera: `apps/web/src/app/catalog/recipes/components/modal-parts/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- Componente de cabecera de la receta y su CSS Module asociado.

CREAR (si aplica por SRP):
- `RecipeHeaderAlert.jsx` (subcomponente para el banner de atención de planta).

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/*.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Cabecera visualmente alineada, legible y moderna.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados/creados:
- Estructura visual aplicada:
- Resultado de verify-srp.js:
- Estado: