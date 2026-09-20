TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Eliminar la advertencia/error de consola `Received false for a non-boolean attribute loading` al interactuar o eliminar listas en el módulo de compras (`/purchases`):
1. Localizar en los componentes de listas de compra (`ShoppingListsView.jsx`, `ShoppingListCard.jsx` o el botón de confirmación de eliminación) dónde se pasa `loading={false}` a un elemento HTML nativo o componente UI base.
2. Evitar la propagación del atributo `loading` como booleano al DOM nativo.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/purchases/components/lists/ShoppingListCard.jsx` (o donde se renderiza el botón rojo de eliminar lista)
2. `apps/web/src/components/ui/Button.jsx` (o componente base si propaga `loading` al tag `<button>`)

INSTRUCCIONES TÉCNICAS:

1. Si el botón rojo de eliminar lista pasa `loading={isDeleting}` a un `<button>` nativo:
   - Cambiar a: `disabled={isDeleting}` o condicionar la prop para no escribirla en el DOM: `loading={isDeleting ? 'true' : undefined}`.
   - O bien, si es un `<button>` nativo: remover el atributo `loading` (los botones nativos de HTML no poseen atributo `loading`, solo `disabled`).

2. Si se utiliza un componente compartido (ej: `Button.jsx`):
   - Asegurar que `loading` sea extraído antes de propagar `rest` al elemento del DOM:
     ```javascript
     const { loading, children, ...buttonProps } = props;
     return (
       <button {...buttonProps} disabled={buttonProps.disabled || loading}>
         {loading ? <Spinner/> : children}
       </button>
     );
     ```

3. Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/purchases/components/lists/ShoppingListCard.jsx` (o archivo modificado)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al pulsar el botón de eliminar lista o confirmar su eliminación, la acción se ejecuta sin arrojar `ConsoleError: Received false for a non-boolean attribute loading`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.