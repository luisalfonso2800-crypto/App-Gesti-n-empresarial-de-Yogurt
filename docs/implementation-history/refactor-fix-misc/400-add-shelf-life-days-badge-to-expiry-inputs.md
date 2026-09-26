TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Incorporar la indicación en días de vida útil al frente de cada selector de fecha de vencimiento en `ProductionOrderCompleteModal.jsx` y su CSS:
1. Al lado derecho del input de fecha del lote comercial, renderizar una pastilla dinámica con la cantidad de días restantes calculados entre la fecha seleccionada y hoy (`X días de vida útil`).
2. Al lado derecho del input de caducidad del inóculo (si la reserva está activa), renderizar igualmente la pastilla calculada (`Y días de vida útil`).
3. Actualizar dinámicamente el número de días si el usuario cambia manualmente la fecha en el calendario.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `apps/web/src/app/operations/production/production.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderCompleteModal.jsx`:
   - Crear una función utilitaria de cálculo de días de diferencia:
     ```javascript
     const calcularDiasDiff = (fechaStr) => {
       if (!fechaStr) return 0;
       const target = new Date(fechaStr + 'T00:00:00');
       const hoy = new Date();
       hoy.setHours(0, 0, 0, 0);
       const diffTime = target.getTime() - hoy.getTime();
       return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
     };
     ```
   - Alinear horizontalmente el selector de fecha comercial con su indicador:
     ```jsx
     <div className={styles.expiryRowContainer}>
       <input
         type="date"
         className={styles.expiryDateInput}
         value={fechaVenc}
         min={fechaHoyString}
         onChange={(e) => setFechaVenc(e.target.value)}
       />
       <span className={styles.daysBadge}>
         ⏱️ {calcularDiasDiff(fechaVenc)} días de vida útil
       </span>
     </div>
     ```
   - Aplicar la misma estructura al selector de fecha del inóculo:
     ```jsx
     <div className={styles.expiryRowContainer}>
       <input
         type="date"
         className={styles.expiryDateInputCompact}
         value={fechaVencInoc}
         min={fechaHoyString}
         onChange={(e) => setFechaVencInoc(e.target.value)}
       />
       <span className={styles.daysBadgeInoculum}>
         🧫 {calcularDiasDiff(fechaVencInoc)} días de vida útil
       </span>
     </div>
     ```
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `production.module.css`:
   - `.expiryRowContainer`: `display: flex; align-items: center; gap: 10px; margin-top: 4px;`.
   - `.daysBadge`: `background: #F1F5F9; color: #1E293B; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; white-space: nowrap;`.
   - `.daysBadgeInoculum`: `background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; border-radius: 6px; padding: 4px 10px; font-size: 11.5px; font-weight: 600; white-space: nowrap;`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al frente de cada campo de fecha figura la pastilla con los días calculados exactos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.