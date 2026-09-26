TAREA:
Dotar de inteligencia al módulo de Recetas Técnicas (`catalog/recipes/`) integrando un banner de productos huérfanos sin receta, imágenes en miniatura del producto asociado y corrección estricta del diagnóstico del paso 5 de Puesta en Marcha.

OBJETIVO:
1. **Banner de Productos Huérfanos:**
   - En la página principal de Recetas (`recipes/page.jsx` o componente contenedor), contrastar la lista de productos activos (`/catalog/products`) frente a las recetas técnicas existentes.
   - Si hay productos sin receta asociada (ej. "Yogurt Frutos Rojos"), mostrar una alerta visual elegante estilo MANNÁ (`#F7F4EE`, borde `#CAD5B5`) con contador y botón directo `[ + Crear Receta para: [Nombre Producto] ]`.
2. **Miniatura de Imagen en Recetas:**
   - Incorporar la imagen del producto asociado en la tabla de recetas técnicas y en la cabecera del editor/modal de la receta, reutilizando la URL de la imagen del catálogo de productos.
3. **Corrección de Diagnóstico de Onboarding (Paso 5):**
   - En el servicio de diagnóstico del asistente de Puesta en Marcha, asegurar que el Paso 5 ("Fabricar Primer Lote Comercial") no se considere completo a menos que exista al menos una receta técnica cuyo producto asociado pertenezca a la categoría de venta comercial con envase (y no sea solo WIP/base a granel).
4. Respetar SRP (< 150 líneas por archivo) y CSS Modules puro. Cero `style={{}}`.
5. Ejecutar `verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Modifica exclusivamente los componentes frontend de recetas y el widget/diagnóstico de onboarding. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/app/catalog/recipes/page.jsx`
- Componentes de recetas y cabeceras de tabla.
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx` (o su lógica de diagnóstico asociada).

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Implementar la detección de productos huérfanos en frontend comparando `products` vs `recipes`.
2. Renderizar la foto del producto en la tabla de recetas técnicas.
3. Ajustar la validación del paso 5 del onboarding en frontend para evitar falsos positivos de recetas comerciales.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Módulo de recetas inteligente con alerta de productos sin fórmula e imágenes integradas.
- Puesta en marcha refleja fielmente la necesidad de la receta comercial.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0, DETENTE.

SALIDA:
- Archivos modificados:
- Características añadidas:
- Resultado de verify-srp.js:
- Estado: