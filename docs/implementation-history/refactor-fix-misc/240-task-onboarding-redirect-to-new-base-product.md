OBJETIVO:
Corregir la navegación del Paso 4 en el widget de Onboarding para que, si falta la base láctea intermedia (A GRANEL), el botón [Completar ➔] redirija a `/catalog/products?crear=base-intermedia`. Al cargar la página de productos con ese parámetro, debe abrirse automáticamente el modal de creación (`ProductModal`) con la presentación "A GRANEL" preseleccionada y un banner contextual superior indicando que se debe crear la base láctea de la planta. Prohibido tocar backend ni usar TypeScript.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `apps/web/src/app/catalog/products/hooks/useProductForm.js`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 31, 38, 39)

ARCHIVOS A MODIFICAR:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

INSTRUCCIONES:

1. REDIRECCIÓN INTELIGENTE EN EL ONBOARDING (`OnboardingWizardWidget.jsx`):
   - En la tarjeta del Paso 4 ("Ficha Comercial y Receta Técnica"):
     * Evaluar si existe advertencia de base faltante (ej. si no hay productos a granel creados en el diagnóstico).
     * Si falta la base láctea a granel, cambiar la ruta de navegación del botón `[Completar ➔]` de `/catalog/recipes` a:
       `/catalog/products?crear=base-intermedia`
     * Mantener la navegación hacia `/catalog/recipes` únicamente cuando ya exista al menos un producto a granel registrado.

2. DETECCIÓN DE PARÁMETRO Y APERTURA AUTOMÁTICA (`apps/web/src/app/catalog/products/page.jsx`):
   - Usar `useSearchParams` de Next.js (`searchParams.get('crear') === 'base-intermedia'`).
   - Si el parámetro está presente en la URL al montar el componente:
     * Disparar automáticamente la apertura del modal en modo creación (`handleOpenModal()` o `setIsModalOpen(true)`).
     * Envolver el lector de `useSearchParams` en `<Suspense>` si la compilación de Next.js lo requiere para rutas cliente.

3. BANNER DIDÁCTICO Y PRESELECCIÓN EN MODAL (`ProductModal.jsx`):
   - Si el modal se abrió por flujo de base intermedia o si la presentación elegida es `A GRANEL`:
     * Renderizar en la parte superior del formulario (arriba de "NOMBRE DEL PRODUCTO") un banner de orientación táctica (#EFF6FF, borde #BFDBFE, texto #1E40AF, padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem'):
       "🥛 **Paso Clave: Crear Producto Base (A Granel):** Registra aquí la base láctea (ej. 'Base Blanca de Yogurt' o 'Jalea Frutos Rojos') que se elaborará en tanque o marmita. Este producto semielaborado quedará en inventario a granel y servirá como insumo para preparar todos los yogures y postres terminados de la planta."
     * En la lista de presentaciones (`presentations`), buscar y preseleccionar automáticamente la presentación del sistema cuyo `tipoEnvase === 'TANQUE_GRANEL'` o nombre contenga `GRANEL` cuando el parámetro `crear=base-intermedia` esté activo.

4. VERIFICACIÓN Y LINT:
   - Ejecutar linter de Next.js sobre los 3 archivos modificados.

CRITERIO DE FINALIZACIÓN:
- Al hacer clic en [Completar ➔] en el Paso 4 (cuando falte la base), el usuario aterriza en `/catalog/products?crear=base-intermedia`.
- El modal `ProductModal` se abre de inmediato sin necesidad de hacer clic manual en [Nuevo Registro].
- El modal muestra el banner informativo azul destacando el rol de la base intermedia y tiene "A GRANEL" seleccionada.
- `next lint` finaliza con código 0.

VERIFICACIÓN:
pnpm --filter web exec next lint --file src/components/shell/OnboardingWizardWidget.jsx --file src/app/catalog/products/page.jsx --file src/app/catalog/products/components/ProductModal.jsx

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega exclusivamente:
- Archivos modificados:
- Confirmación de ruta ajustada en OnboardingWidget:
- Mecanismo de auto-apertura del modal con banner contextual:
- Resultado de comprobación lint:
- Estado: