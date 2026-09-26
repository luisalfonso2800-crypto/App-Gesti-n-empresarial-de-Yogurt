TAREA:
Transformar el banner de productos huérfanos en el módulo de Recetas Técnicas (`RecipesList.jsx` o componente contenedor de la alerta) en un selector dinámico basado en tarjetas (Cards) con imagen para cada producto pendiente de fórmula.

OBJETIVO:
1. En el componente de alerta de productos huérfanos de Recetas:
   - **Listado en Cards:** En lugar de mostrar un único botón fijo, renderizar una retícula horizontal o grid de tarjetas compactas para cada producto que no tenga receta técnica.
   - **Detalle Visual:** Cada tarjeta debe incluir la miniatura de la imagen del producto, su nombre, categoría y un botón de acción directo `[ + Crear Receta ]` que abra el modal precargando dicho producto.
   - **Ergonomía Industrial:** Permitir al operario distinguir visualmente de inmediato qué productos faltan por formular y elegir cuál crear con un solo clic.
2. Cumplir estrictamente con el SRP (< 150 líneas por archivo) y CSS Modules puro. Cero estilos en línea (`style={{}}`).
3. Ejecutar el guardián de calidad y verificar código de salida 0.

FUENTES DE VERDAD:
- Componentes de recetas en `apps/web/src/app/catalog/recipes/components/`
- `.agents/rules/01-core-rules.md` (Protocolo Circuit Breaker)
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modifica exclusivamente los componentes frontend en `apps/web/src/app/catalog/recipes/`. Queda terminantemente prohibido alterar archivos en `apps/api/`.

ALCANCE:

MODIFICAR:
- Componentes de la vista de recetas en `apps/web/src/app/catalog/recipes/components/`
- Hojas `.module.css` asociadas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Reemplazar el botón único del banner por un grid de tarjetas con imágenes para cada producto huérfano.
2. Conectar cada tarjeta con el evento de apertura del modal de creación de receta pasando el producto correspondiente.

VERIFICACIÓN:
1. `node --check` de los componentes modificados.
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Selector de tarjetas visuales operativo para productos sin receta.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Componente de tarjetas huérfanas integrado:
- Resultado de verify-srp.js:
- Estado: