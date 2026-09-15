TAREA:
Implementar plantillas de etapas predeterminadas inteligentes en el creador de recetas técnicas (`RecipeStagesEditor.jsx` o componente de etapas) para productos comerciales que derivan del Yogurt Base.

OBJETIVO:
1. En el módulo de gestión de etapas de la receta (`RecipeStagesEditor.jsx` / modal de recetas):
   - **Detección de Producto Comercial:** Al seleccionar un producto que no sea base pura, verificar si en el inventario o producción ya se ha fabricado al menos un lote de "Yogurt Base".
   - **Etapa Predeterminada Automática:** En lugar de mostrar "Sin etapas aún", inyectar automáticamente la primera etapa de proceso: `1° Incorporación de Yogurt Base (Tanque)` para guiar al operario y asegurar la trazabilidad desde el tanque de origen.
   - **Flexibilidad de Planta:** Permitir al usuario continuar agregando etapas posteriores (*Saborización, Fruta, Envasado*) a partir de esa etapa inicial predefinida.
2. Respetar estrictamente el SRP (< 150 líneas por archivo) y CSS Modules puro. Cero estilos en línea (`style={{}}`).
3. Ejecutar el guardián de calidad y verificar código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/` (componentes de etapas y modales)
- `.agents/rules/01-core-rules.md` (Protocolo Circuit Breaker)
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modifica exclusivamente los componentes frontend de recetas en `apps/web/src/app/catalog/recipes/`. Queda prohibido alterar archivos en `apps/api/`.

ALCANCE:

MODIFICAR:
- Componentes de etapas y creación de recetas técnicas en `apps/web/src/app/catalog/recipes/components/`
- Hojas `.module.css` asociadas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Añadir la lógica condicional que detecta si el producto es comercial y pre-carga la etapa base inicial de mezcla.
2. Mantener la interfaz limpia bajo los lineamientos del Design System MANNÁ.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/` (archivos modificados)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Las recetas comerciales heredan automáticamente la etapa inicial de integración de base láctea.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Lógica de plantilla aplicada:
- Resultado de verify-srp.js:
- Estado: