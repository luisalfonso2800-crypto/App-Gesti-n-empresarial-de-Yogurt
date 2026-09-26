# TAREA CONTROLADA — PAGINACIÓN Y MEDIA QUERIES RESPONSIVAS EN BANNER DE HUÉRFANOS

OBJETIVO:
1. Limitar a un máximo de 12 tarjetas por página en el banner de productos huérfanos (`OrphanProductsBanner.jsx`).
2. Si hay más de 12 productos huérfanos, habilitar controles de paginación accesibles y ergonómicos ("Anterior", "Página X de Y", "Siguiente").
3. Diseñar comportamiento responsivo con Media Queries completas en `recipes.module.css` (desktop, tablet, mobile).
4. Mantener la regla SRP (< 120 líneas para el componente, CSS Modules puro sin estilos inline).
5. Mantener intacta la lógica de selección de producto huérfano para crear receta técnica.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css`

CRITERIOS DE FINALIZACIÓN:
- Máximo 12 tarjetas mostradas a la vez.
- Barra de paginación responsiva (estilo MANNÁ) con estados disabled limpios.
- Media queries adaptables a pantallas móviles (< 640px, < 768px).
- Verificación linter y SRP exitosa.
