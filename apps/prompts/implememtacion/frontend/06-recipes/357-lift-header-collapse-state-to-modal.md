TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS):
Elevar el estado `isHeaderCollapsed` al orquestador padre `RecipeModal.jsx` y conectarlo mediante `onClickCapture` en el contenedor de etapas, para que cualquier clic o interacción en la zona de etapas pliegue automáticamente la cabecera, permitiendo re-desplegarla desde la barra resumen.

CLÁUSULA ANTI-EXPLORACIÓN (REGLA 07):
- PROHIBIDO usar `Search`, `Find` o comandos de búsqueda.
- Modificación directa y única en los 2 archivos indicados.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeModal.jsx`:
   - Declarar el estado: `const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);`
   - Pasar a `<RecipeHeaderFields />`:
     * `isCollapsed={isHeaderCollapsed}`
     * `onToggleCollapse={() => setIsHeaderCollapsed(prev => !prev)}`
   - En el contenedor que envuelve las etapas (`styles.stagesContainer` o la sección donde se renderizan el Timeline y el Editor):
     * Agregar detector de interacción:
       `onClickCapture={() => { if (!isHeaderCollapsed && formData.nombre) setIsHeaderCollapsed(true); }}`
   - Asegurar que el archivo no supere las 135 líneas.

2. En `RecipeHeaderFields.jsx`:
   - Recibir las props `{ isCollapsed, onToggleCollapse, ...rest }` y eliminar el `useState` local duplicado.
   - Si `isCollapsed === true`:
     Renderizar la barra compacta (`styles.headerCollapsedBar`) mostrando miniatura, nombre, cantidad/unidad y el botón con `onClick={onToggleCollapse}` ("✏️ Modificar Cabecera ▾").
   - Si `isCollapsed === false`:
     Renderizar la cabecera completa y el botón para plegar con `onClick={onToggleCollapse}` ("▲ Plegar").
   - Mantener bajo 135 líneas.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Hacer clic en la lista de etapas, en las temperaturas o en el BOM colapsa inmediatamente la cabecera superior.
- Al pulsar el botón de la barra comprimida, la cabecera se vuelve a abrir.
- `verify-srp.js` devuelve código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.