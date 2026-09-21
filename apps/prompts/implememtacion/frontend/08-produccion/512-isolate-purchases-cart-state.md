TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Aislar el consumo de `/purchases/orders/active` en `CartContext` y `useHeaderCart`, evitando re-renders masivos e inconsistencias en la barra global mientras se gestionan compras:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07 + AUDITORÍA #506):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/context/CartContext.jsx` (o hook `useCartState.js`)
2. `apps/web/src/components/layout/HeaderCart.jsx` (o `useHeaderCart.js`)

INSTRUCCIONES TÉCNICAS:

1. Optimización en el Contexto (`CartContext.jsx`):
   - Evitar peticiones continuas al endpoint `/purchases/orders/active` en cada cambio de ruta.
   - Implementar un flag de sincronización perezosa (lazy fetch) o invalidación dirigida únicamente tras mutaciones confirmadas de compra:
     ```javascript
     const refreshActiveOrders = useCallback(async () => {
       try {
         const res = await api.get('/purchases/orders/active');
         setActiveOrders(res.data || []);
       } catch (err) {
         console.warn('Silent fallback for active purchases orders:', err.message);
         setActiveOrders([]);
       }
     }, []);
     ```

2. Encabezado Desacoplado (`HeaderCart.jsx`):
   - Renderizar el contador de órdenes de compra de forma defensiva sin depender del ciclo de vida de los formularios de `operations/purchases/new`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/context/CartContext.jsx`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La navegación en la barra superior permanece fluida sin bloqueos por consultas de compras activas.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
