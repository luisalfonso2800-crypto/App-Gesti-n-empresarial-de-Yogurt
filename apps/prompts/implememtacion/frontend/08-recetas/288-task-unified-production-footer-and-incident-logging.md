TAREA:
Incorporar un banner de advertencia preventivo de productos sin receta y un botón de acceso directo en la Bitácora de Fabricación (`/operations/production/`), guiando al operario para que configure la fórmula antes de intentar producir.

OBJETIVO:
1. En la vista principal de la Bitácora de Fabricación (`operations/production/page.jsx` o componente contenedor de órdenes):
   - Evaluar reactivamente la lista de productos registrados frente a las recetas técnicas existentes.
   - Si existen productos comerciales activos que **no tienen receta técnica asociada**, renderizar un banner de alerta industrial MANNÁ (`#F7F4EE`, borde `#CAD5B5`, texto `#182622`):
     * *«⚠ Hay productos comerciales creados (ej. Yogurt Frutos Rojos) que aún no cuentan con receta técnica. Para planificar su producción en planta, primero debe crear su fórmula.»*
   - Incluir un botón de acción rápida: `[ + Crear Receta Técnica ]` que redirija al submódulo de recetas (`/catalog/recipes`).
2. En el modal de planificación de producción (`ProductionOrderCreator.jsx`):
   - Si el usuario despliega el selector de recetas y hay productos huérfanos sin fórmula, mostrar una nota aclaratoria o deshabilitar temporalmente la selección hasta que se cree su receta.
3. Respetar estrictamente SRP (< 150 líneas por archivo) y CSS Modules puro (`production.module.css`). Cero estilos en línea (`style={{}}`).
4. Ejecutar el guardián de calidad y verificar código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/page.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `.agents/rules/01-core-rules.md` (Protocolo Circuit Breaker)
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Lee y modifica exclusivamente los componentes de frontend en `apps/web/src/app/operations/production/`. Queda terminantemente prohibido explorar, leer o alterar archivos en `apps/api/` (Aislamiento de Frontera).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/operations/production/page.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `apps/web/src/app/operations/production/production.module.css`

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Cruzar los datos de productos y recetas en el componente de página de producción para detectar faltantes de formulación.
2. Añadir el banner de alerta visual con enlace/botón al catálogo de recetas.
3. Aplicar el protocolo de Circuit Breaker (máximo 2 intentos de ajuste; si un archivo llega a 135 líneas, extraer subcomponente).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Bitácora de fabricación con alerta visual inteligente de recetas pendientes por crear.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Componente de alerta integrado:
- Resultado de verify-srp.js:
- Estado: