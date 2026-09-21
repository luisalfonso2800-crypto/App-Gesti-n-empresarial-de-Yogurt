TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Agregar un botón de acceso rápido de "Nueva Venta" en el encabezado general superior (Navbar global), que dispare directamente la apertura del modal de registro de ventas desde cualquier vista del ERP.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/components/layout/Header.jsx` (o la ruta exacta del navbar/header global donde se ubican los accesos rápidos a la derecha de "Planta Operativa")
2. `apps/web/src/app/commercial/sales/` (o componente raíz del layout donde se escucha la apertura del modal de ventas)

INSTRUCCIONES TÉCNICAS:

1. Modificar el Encabezado Superior (Header/Navbar):
   - A la derecha del selector "Planta Operativa", o junto a los iconos de calculadora y bolsa:
     * Agregar un botón estilizado:
       - Puede ser un botón compacto con icono (`ShoppingCart` / `PlusCircle` / `BadgeDollarSign`) o un botón verde/primario:
         `<button onClick={handleQuickSale} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors">`
         `<PlusIcon className="w-3.5 h-3.5" /> Nueva Venta`
         `</button>`
   - Manejo del clic (`handleQuickSale`):
     * Si la aplicación no está actualmente en la ruta `/commercial/sales`:
       Navegar hacia `/commercial/sales?action=new` (usando `router.push`).
     * Si ya se encuentra en `/commercial/sales`, emitir el evento personalizado `window.dispatchEvent(new CustomEvent('open-sales-modal'))`.

2. Integración en el Módulo de Ventas (`sales/page.jsx` o componente modal):
   - Añadir un listener en `useEffect` para escuchar tanto:
     * El parámetro de URL `action === 'new'` (abriendo el modal automáticamente y limpiando el query param del router).
     * El evento `'open-sales-modal'`:
       ```javascript
       useEffect(() => {
         const handleOpen = () => form.handleOpenModal();
         window.addEventListener('open-sales-modal', handleOpen);
         return () => window.removeEventListener('open-sales-modal', handleOpen);
       }, [form]);
       ```
   - Respetar el límite estricto de SRP (< 130 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/web/src/components/layout/Header.jsx`
2. `pnpm --filter web build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- El botón "Nueva Venta" aparece visible y armonizado en el navbar superior.
- Al pulsarlo desde cualquier pantalla, abre fluidamente el modal de registro de ventas.
- Cero infracciones de SRP y código de salida 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.