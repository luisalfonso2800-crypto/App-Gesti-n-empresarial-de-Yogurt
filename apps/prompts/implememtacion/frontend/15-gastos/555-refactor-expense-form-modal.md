TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Refactorizar y modernizar el modal de registro de gasto en `apps/web/src/app/commercial/expenses/components/ExpenseModal.jsx` (o componente modal equivalente de gastos) y sus estilos, automatizando la selección de período, formateando el valor monetario y alineando los inputs al Design System MANNÁ, respetando SRP (< 130 líneas).

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/expenses/components/ExpenseModal.jsx` (o modal de formulario de gasto)
2. `apps/web/src/app/commercial/expenses/components/expense-modal.module.css` (o CSS Module respectivo)

INSTRUCCIONES TÉCNICAS:

1. Automatización y Ergonomía de Campos:
   - **Período Contable Automático:**
     * Al seleccionar o cambiar la `Fecha`, autocalcular el período contable en mayúsculas (ej. fecha `21/09/2026` -> período `SEPTIEMBRE 2026`).
     * Mantenerlo como campo de solo lectura o selector asistido para evitar inconsistencias ortográficas manuales.
   - **Formateo Monetario Poka-Yoke (`VALOR`):**
     * Input controlado con máscara o formateo visual de moneda en pesos colombianos (`$ 50.000`), almacenando el valor numérico limpio.
     * Si el valor es > 0, mostrar en pequeño el valor proyectado en letras o texto legible.

2. Alineación Visual con Design System MANNÁ:
   - Fondo de inputs y contenedor acorde a la paleta institucional (bordes sutiles cálidos, foco en verde bosque `#182622` o ámbar).
   - Labels con asterisco rojo de requeridos y tipografía legible y sobria.
   - Botón `Guardar Gasto`:
     * Deshabilitado en gris mientras los campos requeridos (`categoría`, `descripción`, `valor > 0`) no sean válidos.
     * En verde bosque institucional activo cuando el formulario esté completo y listo para enviar.

3. Restricción SRP:
   - Mantener el componente modularizado con menos de 130 líneas de código.
   - Cero estilos en línea; todo mediante clases en camelCase en su CSS Module.

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- El modal genera automáticamente el período contable según la fecha seleccionada.
- El valor monetario se formatea limpiamente en COP.
- Los botones y campos respetan los lineamientos visuales de MANNÁ sin desbordar líneas SRP.
- Verificación y compilación sin errores (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.