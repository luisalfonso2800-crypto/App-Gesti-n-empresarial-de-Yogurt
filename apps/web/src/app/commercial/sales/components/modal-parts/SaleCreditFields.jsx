/**
 * @file SaleCreditFields.jsx
 * @module commercial/sales/components/modal-parts
 * @description Campos opcionales para venta a crédito (abono inicial con máscara y fecha límite).
 * @responsibility Renderizar los controles de crédito si el tipo de pago es CREDITO.
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 * @dependencies react, @/utils/numberToWords, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../sale-modal.module.css';

export default function SaleCreditFields({ formData, handleChange }) {
  if (formData.tipoPago !== 'CREDITO') return null;

  const rawClean = formData.valorPagado ? String(formData.valorPagado).replace(/\D/g, '') : '';
  const cleanNumericVal = rawClean ? parseInt(rawClean, 10) : 0;

  return (
    <div className={`${modalStyles.twoColumns} ${styles.creditRowMargin}`}>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Valor Pagado (Abono)</label>
        <input
          name="valorPagado"
          type="text"
          inputMode="numeric"
          min="0"
          placeholder="0"
          value={rawClean ? rawClean.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            handleChange({ target: { name: 'valorPagado', value: raw } });
          }}
          onKeyDown={(e) => {
            if (e.key === '-') e.preventDefault();
          }}
          className={modalStyles.input}
        />
        {cleanNumericVal > 0 && (
          <span className={styles.productPriceWords}>
            ✦ {montoATextoPesos(cleanNumericVal)}
          </span>
        )}
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Fecha Límite <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="fechaLimitePago" 
          type="date" 
          value={formData.fechaLimitePago ?? ''} 
          onChange={handleChange} 
          className={modalStyles.input} 
          required 
        />
      </div>
    </div>
  );
}
