TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) Corregir la validación del diagnóstico para que el Paso 5 (Fabricar Primer Lote) se marque completado si ya existen unidades en Cava o si ya se emitió la primera venta.
2) Al completar el 100% (o al activar 'Modo Dashboard Tradicional'), desactivar y ocultar definitivamente el asistente de puesta en marcha del Dashboard y de la barra superior:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/dashboard/hooks/useOnboardingDiagnostics.js` (o servicio que calcula los 6 pasos)
2. `apps/web/src/app/dashboard/page.jsx` (y componente que renderiza el banner de Configuración Inicial)

INSTRUCCIONES TÉCNICAS:

1. Autocompletar Paso 5 si hay Stock Comercial o Venta (`useOnboardingDiagnostics.js`):
   - En la evaluación de `paso5_fabricarLote`:
     ```javascript
     const tieneLoteRegistrado = lotesComercialesCount > 0 || stockCavaUnidades > 0 || totalVentasCount > 0;
     ```
   - Si `tieneLoteRegistrado === true`, marcar el paso 5 con `completado: true`.
   - Con los 6 pasos en verde, marcar el estado global de onboarding como `isCompleted: true`.

2. Transición a Modo Dashboard Tradicional (`dashboard/page.jsx`):
   - Si `isCompleted === true` o si el usuario seleccionó `Modo Dashboard Tradicional`:
     * Persistir la bandera `onboarding_completed = 'true'` en `localStorage` y/o preferencias de usuario.
     * Desmontar por completo el contenedor verde oscuro `Configuración Inicial de Planta MANNÁ` y la `Cadena de Puesta en Marcha`.
     * Desmontar o no renderizar el badge de progreso superior `Paso 6/6 (100%)` del header.
     * Desplegar el Dashboard operativo tradicional (Telemetría de tanques, Gráficos de Producción vs Ventas, Rendimiento de Cava y Alertas).
   - Respetar el límite de líneas SRP (< 120 líneas en `page.jsx`, delegando el panel tradicional a un componente modular si supera el límite).

VERIFICACIÓN:
1. `node --check apps/web/src/app/dashboard/...`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La Puesta en Marcha reconoce el 100% (6 de 6 pasos).
- El banner de configuración inicial desaparece y la pantalla inicial muestra directamente el Dashboard comercial y de planta tradicional.
- El pill de porcentaje de la barra de navegación superior deja de mostrarse.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
