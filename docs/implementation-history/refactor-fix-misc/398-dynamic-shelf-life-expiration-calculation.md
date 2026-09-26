TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Eliminar las fechas de vencimiento hardcodeadas en la liquidación de producción (`production.repository.js` y `ProductionOrderCompleteModal.jsx`):
1. En Backend (`production.repository.js`): Calcular dinámicamente la fecha de vencimiento a partir de la propiedad de vida útil configurada en el producto (`prodOrder.producto?.diasVidaUtil` o `receta.diasVidaUtil`), permitiendo además recibir `fechaVencimiento` y `fechaVencimientoInoculo` explícitas en el payload.
2. En Frontend (`ProductionOrderCompleteModal.jsx`): Mostrar la fecha de vencimiento sugerida calculada dinámicamente para el lote principal y para el inóculo, permitiendo su visualización/ajuste antes de confirmar.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `production.repository.js` (`completeProduction`):
   - Consultar en la orden el producto/receta con su campo de vida útil:
     ```javascript
     const diasVencimientoProd = prodOrder.producto?.diasVidaUtil || prodOrder.receta?.diasVidaUtil || 21;
     const diasVencimientoInoculo = 14; // Default para semielaborado si no existe campo específico
     
     const fechaVencPrincipal = data.fechaVencimiento 
       ? new Date(data.fechaVencimiento) 
       : new Date(Date.now() + diasVencimientoProd * 24 * 60 * 60 * 1000);

     const fechaVencInoculo = data.reservaInoculo?.fechaVencimiento
       ? new Date(data.reservaInoculo.fechaVencimiento)
       : new Date(Date.now() + diasVencimientoInoculo * 24 * 60 * 60 * 1000);
     ```
   - Asignar `fechaVencimiento: fechaVencPrincipal` en la creación del lote principal.
   - Asignar `fechaVencimiento: fechaVencInoculo` en la creación del sub-lote de inóculo.

2. En `ProductionOrderCompleteModal.jsx`:
   - Calcular la fecha sugerida localmente con base en la fecha actual (`new Date()`) y los días de vida útil de la orden.
   - Mostrar un renglón compacto con la fecha de caducidad calculada para el lote comercial y, si la reserva está activa, para el inóculo (`Vencimiento sugerido: DD/MM/AAAA`).
   - Incluir los campos de fecha en el payload de confirmación enviado a `submitComplete`.
   - Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Se eliminan las fechas estáticas fijas en el backend.
- Las fechas de vencimiento se basan en la configuración del catálogo y pueden auditarse antes del cierre del lote.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.