TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Habilitar la edición manual de la fecha de vencimiento tanto para el lote comercial como para el inóculo en `ProductionOrderCompleteModal.jsx` y reflejarla en la trazabilidad:
1. En `ProductionOrderCompleteModal.jsx`: Sustituir los textos fijos de vencimiento por inputs de fecha (`type="date"`) precargados con la fecha sugerida por defecto (`YYYY-MM-DD`), permitiendo que el operador los modifique manualmente.
2. Asegurar que las fechas seleccionadas se envíen en el payload a `submitComplete` (`fechaVencimiento` para el lote principal y `fechaVencimientoInoculo` dentro de `reservaInoculo`).
3. En `production.module.css`: Añadir los estilos ergonómicos para los inputs de fecha dentro del modal y la tarjeta de inóculo.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `apps/web/src/app/operations/production/production.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderCompleteModal.jsx`:
   - Inicializar el estado de fecha principal:
     `const [fechaVenc, setFechaVenc] = useState(() => calcularFechaDefecto(diasVidaProd));`
   - Inicializar el estado de fecha para inóculo:
     `const [fechaVencInoc, setFechaVencInoc] = useState(() => calcularFechaDefecto(14));`
   - En el cuerpo del modal (junto o debajo del volumen real obtenido):
     * Renderizar el bloque de fecha de caducidad del lote:
       ```jsx
       <div className={styles.expiryInputGroup}>
         <label className={styles.expiryLabel}>
           <Calendar size="{14}"/> Fecha de Vencimiento (Lote Comercial):
         </label>
         <input
           type="date"
           className={styles.expiryDateInput}
           value={fechaVenc}
           min={fechaHoyString}
           onChange={(e) => setFechaVenc(e.target.value)}
         />
       </div>
       ```
   - En la tarjeta de reserva de inóculo:
     * Si `reserveActive === true`, incluir el input para la caducidad de la cepa:
       ```jsx
       <div className={styles.inoculumExpiryGroup}>
         <label className={styles.expiryLabelSub}>
           <Calendar size="{13}"/> Caducidad Cepa / Inóculo:
         </label>
         <input
           type="date"
           className={styles.expiryDateInputCompact}
           value={fechaVencInoc}
           min={fechaHoyString}
           onChange={(e) => setFechaVencInoc(e.target.value)}
         />
       </div>
       ```
   - En `handleConfirm`:
     * Incluir `fechaVencimiento: fechaVenc` en el nivel raíz del payload y en `reservaPayload.fechaVencimiento: fechaVencInoc`.
   - Respetar estrictamente el límite SRP (< 135 líneas).

2. En `production.module.css`:
   - Añadir estilos limpios:
     ```css
     .expiryInputGroup {
       margin: 12px 0;
       display: flex;
       flex-direction: column;
       gap: 4px;
     }
     .expiryLabel, .expiryLabelSub {
       font-size: 11.5px;
       font-weight: 600;
       color: #374151;
       display: inline-flex;
       align-items: center;
       gap: 5px;
     }
     .expiryDateInput {
       height: 38px;
       border: 1px solid #CBD5E1;
       border-radius: 6px;
       padding: 0 10px;
       font-size: 13px;
       color: #1F2937;
       background: #FFFFFF;
       max-width: 220px;
     }
     .expiryDateInputCompact {
       height: 32px;
       border: 1px solid #CBD5E1;
       border-radius: 6px;
       padding: 0 8px;
       font-size: 12px;
       color: #1F2937;
       background: #FFFFFF;
       max-width: 180px;
       margin-top: 4px;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El operador puede validar o alterar manualmente la fecha de vencimiento sugerida con un control estándar de fecha.
- El valor manual llega a la base de datos y gobierna la trazabilidad en `/operations/lots`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.