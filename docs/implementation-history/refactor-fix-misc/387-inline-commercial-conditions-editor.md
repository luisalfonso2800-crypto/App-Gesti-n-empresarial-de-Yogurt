TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Refactorizar el sub-panel de "Cambiar proveedor / marca / empaque" en `ChecklistItemRow.jsx` (o componente modal/drawer asociado en `apps/web/src/app/purchases/new/components/` y `new-purchase.module.css`):
1. Convertir la sección en un panel inline delimitado (`.editConditionsPanel`) con cabecera institucional, descripción clara y botón '✕'.
2. Renombrar y estandarizar etiquetas: "Presentación comercial", "Contenido neto" y "Mantener proveedor actual".
3. Implementar la barra inferior de confirmación con botón primario "Aplicar cambios" (verde #1B4332) y "Cancelar".

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx` (o subcomponente de condiciones comerciales)
2. `apps/web/src/app/purchases/new/new-purchase.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ChecklistItemRow.jsx`:
   - El botón disparador pasa a:
     * `<button className={isEditing ? styles.btnEditActive : styles.btnEdit}>`
     * Texto: `⚙ {isEditing ? 'Editando condiciones' : 'Editar condiciones'}`
   - Renderizar el sub-panel condicional (`isEditing && (...)`):
     * Contenedor con clase `styles.editConditionsPanel`.
     * Cabecera:
       - Título: `⚙ EDITAR CONDICIONES DE COMPRA`
       - Botón cerrar: `<button onClick={cancelEditing}><X size={14} /></button>`
       - Subtítulo sutil: `Modifica proveedor, marca o presentación para esta compra.`
     * Formulario en grid de 2 filas:
       - Fila 1: `Proveedor` (Select con opción por defecto: "Mantener proveedor actual") y `Marca` (Input/Select).
       - Fila 2: `Presentación comercial` (Input/Select) y `Contenido neto` (Input numérico + Select unidad: g / ml / kg / L).
     * Barra de acciones:
       - `<button className={styles.btnCancelEdit} onClick={cancelEditing}>Cancelar</button>`
       - `<button className={styles.btnApplyEdit} onClick={handleApplyChanges}>Aplicar cambios</button>`
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas). Extraer el panel a un componente atómico si excede el límite.

2. En `new-purchase.module.css`:
   - Estilos del panel inline delimitado:
     ```css
     .editConditionsPanel {
       background: #FAF9F6;
       border: 1px solid #E2E8F0;
       border-radius: 8px;
       padding: 16px;
       margin-top: 12px;
       box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
     }
     .editConditionsHeader {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 4px;
     }
     .editConditionsTitle {
       font-size: 12.5px;
       font-weight: 700;
       color: #1F2937;
       letter-spacing: 0.03em;
       margin: 0;
     }
     .editConditionsSubtext {
       font-size: 11.5px;
       color: #64748B;
       margin: 0 0 12px 0;
     }
     .editConditionsGrid {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 12px;
     }
     .editActionsRow {
       display: flex;
       justify-content: flex-end;
       gap: 10px;
       margin-top: 14px;
       padding-top: 10px;
       border-top: 1px solid #E5E7EB;
     }
     .btnApplyEdit {
       background: #1B4332;
       color: #FFFFFF;
       border: none;
       border-radius: 6px;
       padding: 6px 14px;
       font-size: 12px;
       font-weight: 600;
       cursor: pointer;
     }
     .btnCancelEdit {
       background: #FFFFFF;
       border: 1px solid #D1D5DB;
       border-radius: 6px;
       padding: 6px 14px;
       font-size: 12px;
       color: #4B5563;
       cursor: pointer;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El formulario se enmarca dentro de un bloque visual independiente con fondo suave, borde y cabecera institucional.
- Se cuenta con botones claros para "Aplicar cambios" y "Cancelar".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.