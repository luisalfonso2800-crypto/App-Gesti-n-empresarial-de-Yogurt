/**
 * @file FormPhaseRowIvaSection.jsx
 * @module operations/purchases/new/parts
 * @description Controles reactivos de IVA por fila y desglose contable (Base, Tasa, Monto, Subtotal) (< 150 líneas).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowIvaSection({
  row,
  updateDetalle,
  tieneIva,
  pctIva,
  precioIncluyeIva,
  baseRow,
  ivaRow,
  subtotalRow
}) {
  return (
    <div className={styles.ivaSection}>
      <div className={styles.ivaControls}>
        <label className={styles.ivaCheckboxLabel}>
          <input
            type="checkbox"
            checked={tieneIva}
            onChange={e => updateDetalle(row.id, 'tieneIva', e.target.checked)}
            className={styles.ivaCheckbox}
          />
          Aplica IVA
        </label>

        {tieneIva && (
          <>
            <div className={styles.ivaTasaGroup}>
              <span>Tasa:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={row.porcentajeIva !== undefined ? row.porcentajeIva : 19}
                onChange={e => updateDetalle(row.id, 'porcentajeIva', parseFloat(e.target.value) || 0)}
                className={styles.ivaTasaInput}
              />
              <span>%</span>
            </div>

            <select
              value={precioIncluyeIva ? 'INCLUIDO' : 'ADICIONAL'}
              onChange={e => updateDetalle(row.id, 'precioIncluyeIva', e.target.value === 'INCLUIDO')}
              className={styles.ivaTipoSelect}
            >
              <option value="INCLUIDO">Precio incluye IVA</option>
              <option value="ADICIONAL">IVA adicional (+)</option>
            </select>
          </>
        )}
      </div>

      <div className={styles.ivaDesgloseMicro}>
        <span>Base: <strong>${baseRow.toLocaleString('es-CO')}</strong></span>
        <span>|</span>
        <span className={styles.ivaDesgloseBadge}>IVA ({tieneIva ? `${pctIva}%` : 'Exento'}): <strong>${ivaRow.toLocaleString('es-CO')}</strong></span>
        <span>|</span>
        <span>Subtotal: <strong>${subtotalRow.toLocaleString('es-CO')}</strong></span>
      </div>
    </div>
  );
}
