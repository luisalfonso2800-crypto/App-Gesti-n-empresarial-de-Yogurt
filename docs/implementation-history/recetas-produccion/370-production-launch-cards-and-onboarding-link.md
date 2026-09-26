TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
1. Conectar el botón "Completar →" del Paso 5 del Wizard de Onboarding (`OnboardingStepItem.jsx`) para que navegue a `/production?action=new`.
2. En la página de Producción (`apps/web/src/app/production/page.jsx`), leer el parámetro `action=new` de la URL para desplegar de inmediato el formulario "Planificar Nueva Orden" sin obligar a un segundo clic.
3. Incorporar en la parte superior de la Bitácora de Producción una fila o galería de productos formulados (`ProductionProductLaunchpad.jsx`), mostrando nombre, imagen, stock actual en cava y el botón [ Producir Lote ] que precarga automáticamente la receta y la cantidad base.

CLÁUSULA ANTI-EXPLORACIÓN (REGLA 07):
- PROHIBIDO usar `Search`, `Find` o búsquedas recursivas.
- LECTURA ÚNICA: Lee una sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los archivos indicados.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/components/shell/parts/OnboardingStepItem.jsx`
2. `apps/web/src/app/production/page.jsx`
3. Crear componente atómico (o modificar componente de cabecera de producción): `apps/web/src/app/production/components/ProductionProductLaunchpad.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `OnboardingStepItem.jsx`:
   - Para el paso 5 (`step.key === 'produce_commercial_batch'` o id equivalente a fabricación de primer lote comercial):
     Asegurar que la ruta de redirección del botón "Completar →" apunte exactamente a:
     `/production?action=new`

2. En `apps/web/src/app/production/page.jsx`:
   - Utilizar `useSearchParams()` de `next/navigation`.
   - Si `searchParams.get('action') === 'new'` o `searchParams.get('productId')`:
     * Inicializar o cambiar el estado del formulario de planificación a visible (`isPlanningOpen: true` o `showNewOrder: true`) automáticamente al montar el componente.
   - En la parte superior de la bitácora (sobre el listado o estado vacío), renderizar el `<ProductionProductLaunchpad />`.
   - Respetar el límite de líneas SRP (< 135 líneas).

3. Crear/implementar `ProductionProductLaunchpad.jsx` (< 130 líneas):
   - Cargar o recibir la lista de productos que ya tienen receta formulada activa.
   - Renderizar una fila horizontal con tarjetas compactas:
     * Avatar/foto del producto y nombre técnico.
     * Pastilla con stock en cava: `En Cava: ${p.stockCava || 0} ${p.unidad}`.
     * Botón `[ Producir Lote ]`: al hacer clic, dispara la planificación de orden (`onSelectProductToProduce(producto.idReceta, producto.rendimientoBase)`), precargando la receta en el formulario sin dejarlo en blanco.

VERIFICACIÓN:
1. `node --check apps/web/src/components/shell/parts/OnboardingStepItem.jsx`
2. `node --check apps/web/src/app/production/page.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Hacer clic en "Completar →" en el Paso 5 lleva directamente a la pantalla de producción con el formulario de planificación abierto.
- La Bitácora de Producción muestra las tarjetas de productos con su stock disponible y botón para iniciar el lote con receta precargada.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.