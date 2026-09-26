TAREA:
Corregir bucle infinito (Maximum update depth exceeded) en useProductFormState.js

OBJETIVO:
Eliminar la recursión infinita en apps/web/src/app/catalog/products/components/modal-parts/useProductFormState.js estabilizando las dependencias del useEffect y evitando llamadas redundantes a setState.

CAUSA IDENTIFICADA:
En useProductFormState.js (alrededor de la línea 28), un useEffect ejecuta setState de manera descontrolada al montar componentes vinculados en el módulo de Recetas.

INSTRUCCIONES TÉCNICAS:
1. Abrir `apps/web/src/app/catalog/products/components/modal-parts/useProductFormState.js`.
2. Revisar el `useEffect` ubicado en las líneas 20-40:
   - Si sincroniza `initialData` o `product`:
     * Comprobar que solo actualice el estado si el identificador o los valores clave cambiaron (usar `product?.id !== prevId.current` o comparar valores clave antes de llamar a `setFormData`).
     * Asegurar que las dependencias del array sean primitivas estables (ej: `[product?.id, isOpen]`) en lugar del objeto completo `product` o funciones recreadas en cada render.
3. Garantizar que el hook mantenga su contrato de retorno intacto (mismos nombres de variables y funciones para no romper formularios consumidores).
4. Cumplir estrictamente con la regla de SRP (< 120 líneas).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.