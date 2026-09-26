TAREA:
Corregir la detección de productos a granel/base en el Onboarding y solucionar la navegación/reapertura del modal en /catalog/products.

OBJETIVO:
1. Asegurar que tanto el backend (`onboarding.service.js` / `system.service.js`) como el widget (`OnboardingWizardWidget.jsx`) reconozcan como base láctea válida cualquier producto con presentación `A GRANEL` (incluyendo su relación en Prisma) O con categorías de planta (`BASES_LACTEAS`, `INSUMO_BASE_WIP`, `DULCES_JALEAS`) O con canal `USO_INTERNO`.
2. Al detectar que ya existe la base láctea (`YOGURT BASE`), actualizar de inmediato el Paso 4 del Onboarding: retirar la advertencia amarilla y hacer que el botón [Completar ➔] redirija a `/catalog/recipes`.
3. En `apps/web/src/app/catalog/products/page.jsx`, limpiar el parámetro de búsqueda `crear=base-intermedia` tras abrir o cerrar el modal para que el botón del widget vuelva a funcionar si se pulsa estando en la misma página.
4. Forzar la revalidación reactiva del diagnóstico de onboarding cada vez que se cree o modifique un producto en `ProductModal.jsx`.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `apps/api/src/` (servicio o controlador que responda el diagnóstico de onboarding / system status)
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38)

ARCHIVOS A MODIFICAR:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- Archivo backend del endpoint de onboarding (si el conteo proviene de la API).

INSTRUCCIONES:

1. DETECCIÓN ROBUSTA DE PRODUCTO BASE (Backend / Frontend):
   - Si el diagnóstico se evalúa en backend (ej. Prisma en `apps/api/`):
     * Asegurar que la consulta de productos incluya `include: { presentacion: true }`.
     * Validar existencia de base láctea con condición amplia:
       ```javascript
       const hasBulkProduct = products.some(p =>
         p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' ||
         p.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
         ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p.categoria) ||
         p.canalVenta === 'USO_INTERNO' ||
         (Number(p.precioVenta) === 0 && p.categoria !== 'LACTEOS')
       );
       ```
   - Si se evalúa en frontend en `OnboardingWizardWidget.jsx`:
     * Aplicar exactamente la misma lógica amplia para determinar `hasBulkProduct`.
     * Si `hasBulkProduct === true`:
       - Retirar la advertencia "⚠️ Pendiente: Base láctea a granel requerida...".
       - Asignar la ruta de destino del botón `[Completar ➔]` a: `/catalog/recipes`.

2. LIMPIEZA DE QUERY PARAMS Y MANEJO DE MODAL (`page.jsx`):
   - En `apps/web/src/app/catalog/products/page.jsx`:
     * Al detectar `searchParams.get('crear') === 'base-intermedia'`:
       - Abrir el modal (`setIsModalOpen(true)`).
       - Limpiar de forma silenciosa el query param de la URL usando `window.history.replaceState({}, '', '/catalog/products')` o `router.replace('/catalog/products', { scroll: false })` para que la URL quede limpia.
     * Al pulsar el botón [Completar ➔] desde el Onboarding estando ya en `/catalog/products`:
       - Si aún se requiere crear producto, disparar la apertura directa del modal o asegurar que la navegación responda al cambio de hash o estado.

3. REVALIDACIÓN AL CREAR PRODUCTO (`ProductModal.jsx`):
   - Al completar la mutación de creación de producto con éxito:
     * Disparar la revalidación del diagnóstico de onboarding (ej. despachar evento global `window.dispatchEvent(new Event('onboarding-refresh'))` o refrescar el router/contexto correspondiente).
     * En `OnboardingWizardWidget.jsx`, escuchar el evento o refrescar el estado para actualizar los contadores y pasos completados en tiempo real.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/components/shell/OnboardingWizardWidget.jsx --file src/app/catalog/products/page.jsx --file src/app/catalog/products/components/ProductModal.jsx`
2. `node --check apps/web/src/app/catalog/products/page.jsx`

CRITERIO DE FINALIZACIÓN:
- Con "YOGURT BASE" registrado, el Paso 4 del widget muestra la advertencia resuelta.
- El botón [Completar ➔] redirige directamente a `/catalog/recipes` para formular la receta técnica.
- La URL `/catalog/products` limpia el query param tras abrir el modal.
- Lint finaliza con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Lógica de detección de base ampliada:
- Ruta corregida en el botón del Paso 4:
- Comprobación lint:
- Estado: