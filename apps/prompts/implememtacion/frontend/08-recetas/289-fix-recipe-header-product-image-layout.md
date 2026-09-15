TAREA:
Rediseñar la cabecera de la receta técnica (`RecipeHeaderFields.jsx` o componente equivalente) para separar la imagen miniatura del selector de producto y mostrarla en un tamaño grande y destacado.

OBJETIVO:
1. En el componente de cabecera de recetas (`RecipeHeaderFields.jsx` o modal de creación de recetas):
   - **Desacoplar la imagen:** Sacar la imagen del contenedor apretado del select.
   - **Tarjeta de Previsualización Visual:** Crear un bloque o card lateral/superior dedicado (ej. tamaño `64px` a `80px` con bordes redondeados limpios y sombra suave) que muestre la foto en alta resolución del producto comercial seleccionado.
   - **Distribución Ergonómica:** Organizar el campo "Producto a Fabricar" y su imagen de forma que respete la retícula del Design System MANNÁ, evitando aglomeraciones de texto e iconos.
2. Cumplir estrictamente con el SRP (< 150 líneas) y CSS Modules puro (`recipe-modal.module.css`). Cero estilos en línea (`style={{}}`).
3. Ejecutar el guardián de calidad y verificar código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
- `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`
- `.agents/rules/01-core-rules.md` (Protocolo Circuit Breaker)
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modifica exclusivamente los componentes frontend en `apps/web/src/app/catalog/recipes/components/`. Queda prohibido alterar archivos en `apps/api/`.

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
- `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Separar la etiqueta/renderizado de la imagen del producto para que se despliegue en formato grande (card de previsualización).
2. Asegurar clases limpias en CSS Modules.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Imagen del producto en la cabecera de la receta grande, nítida y perfectamente alineada.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Ajuste visual aplicado:
- Resultado de verify-srp.js:
- Estado: