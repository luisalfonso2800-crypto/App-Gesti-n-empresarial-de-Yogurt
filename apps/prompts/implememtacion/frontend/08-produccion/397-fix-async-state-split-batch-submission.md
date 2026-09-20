TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir la condición de carrera en el modal de liquidación para que `reservaInoculo` viaje efectivamente en la petición HTTP:
1. En `useProductionPageData.js`: Permitir que `submitComplete` reciba un argumento opcional `reservaOverride` y usarlo prioritariamente al armar el payload hacia `/production/:id/complete`.
2. En `ProductionOrderCompleteModal.jsx`: En `handleConfirm`, armar el objeto `reservaPayload` de forma síncrona y pasarlo directamente como argumento a `submitComplete(reservaPayload)`.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/hooks/useProductionPageData.js`
2. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`

INSTRUCCIONES TÉCNICAS:

1. En `useProductionPageData.js`:
   - En la declaración de `submitComplete`:
     ```javascript
     const submitComplete = async (reservaOverride = null) => {
       // ...
       const payload = {
         cantidadProducidaReal: completeModal.cantidadProducidaReal,
         reservaInoculo: reservaOverride !== null ? reservaOverride : completeModal.reservaInoculo,
         detalles: completeModal.detalles
       };
       // Enviar payload al endpoint PATCH /production/:id/complete
     ```

2. En `ProductionOrderCompleteModal.jsx`:
   - En la función `handleConfirm`:
     ```javascript
     const handleConfirm = () => {
       const reservaPayload = reserveActive && inoculoNum > 0
         ? { activo: true, cantidad: inoculoNum, codigoLoteHijo: loteHijoCode }
         : null;
       
       setCompleteModal(prev => ({
         ...prev,
         reservaInoculo: reservaPayload
       }));
       
       submitComplete(reservaPayload);
     };
     ```
   - Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al liquidar un lote con reserva activa, el backend recibe el objeto `reservaInoculo` con cantidad y código.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.