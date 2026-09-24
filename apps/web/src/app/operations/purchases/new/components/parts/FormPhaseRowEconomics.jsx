/**
 * @file FormPhaseRowEconomics.jsx
 * @module operations/purchases/new/parts
 * @description Campos de cantidad de empaques, precio unitario, ingreso neto y subtotal (< 150 líneas).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx
 * @dependencies React, @/utils/numberToWords, ../../new-purchase.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowEconomics({
  row,
  updateDetalle,
  precioUnitarioNum,
  ingresoNeto,
  unidadLabel,
  subtotalRow,
  hasPokaYokeWarning
}) {
  return (
    <div className={styles.line2Grid}>
      <div className={styles.line2Col}>
        <label className={styles.line2Label}>Cant. Empaques</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={row.empaques ? row.empaques.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
          onChange={e => {
            let raw = e.target.value.replace(/\D/g, '');
            updateDetalle(row.id, 'empaques', raw);
          }}
          className={styles.empaquesInput}
        />
      </div>

      <div className={styles.line2Col}>
        <label className={styles.line2Label}>Precio Unitario ($)</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={row.precioUnitario ? row.precioUnitario.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
          onChange={e => {
            let raw = e.target.value.replace(/\D/g, '');
            updateDetalle(row.id, 'precioUnitario', raw);
          }}
          className={styles.unitPriceInput}
        />
        {precioUnitarioNum > 0 && (
          <span className={styles.priceWordsSub}>
            ✦ {montoATextoPesos(precioUnitarioNum)}
          </span>
        )}
      </div>

      <div className={styles.line2SummaryPanel}>
        <div className={`${styles.summaryColRight} ${hasPokaYokeWarning ? styles.netIngresoColWarning : ''}`}>
          <span className={styles.summaryMicroLabel}>Ingreso Neto</span>
          <strong className={`${styles.netIngresoVal} ${hasPokaYokeWarning ? styles.netIngresoValWarning : ''}`}>
            {ingresoNeto.toLocaleString('es-CO')} {unidadLabel}
          </strong>
          <span className={styles.netIngresoFormula}>
            {row.empaques && row.contenidoNeto 
              ? `(${row.empaques} ${row.empaque?.toLowerCase() || 'empaques'} × ${Number(row.contenidoNeto).toLocaleString('es-CO')} ${row.unidadMedida || 'ml'})` 
              : ''}
          </span>
        </div>

        <div className={styles.summaryColRight}>
          <span className={styles.summaryMicroLabel}>Subtotal</span>
          <strong className={styles.subtotalVal}>
            ${subtotalRow.toLocaleString('es-CO')}
          </strong>
          {subtotalRow > 0 && (
            <span className={styles.subtotalWordsSub}>
              ✦ {montoATextoPesos(subtotalRow)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
