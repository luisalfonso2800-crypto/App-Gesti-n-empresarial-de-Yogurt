/**
 * @file ExpenseValueAndDetailFields.jsx
 * @module commercial/expenses/components/modal-parts
 * @description Campos de Descripción, Valor ($) con letras y Observaciones con validación Poka-Yoke.
 * @responsibility Renderizar los campos de valor y detalle del gasto con feedback reactivo de error.
 * @usedBy apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx
 * @dependencies react, @/utils/numberToWords, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../expenses.module.css';

export default function ExpenseValueAndDetailFields({
  formData,
  handleChange,
  hasSubmitted = false
}) {
  const cleanNumericVal = formData.valor ? parseInt(String(formData.valor).replace(/\D/g, ''), 10) : 0;
  const isDescripcionInvalid = hasSubmitted && !formData.descripcion?.trim();
  const isValorInvalid = hasSubmitted && (!formData.valor || cleanNumericVal <= 0);

  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Descripción <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="descripcion" 
          value={formData.descripcion} 
          onChange={handleChange} 
          placeholder="DESCRIPCIÓN DEL GASTO"
          className={`${modalStyles.input} ${styles.uppercaseInput} ${isDescripcionInvalid ? styles.inputErrorBorder : ''}`} 
          required 
        />
        {isDescripcionInvalid && (
          <span className={styles.fieldErrorText}>La descripción del gasto es requerida</span>
        )}
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Valor ($) <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input
          name="valor"
          type="text"
          inputMode="numeric"
          min="0"
          placeholder="0"
          value={formData.valor ? String(formData.valor).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            handleChange({ target: { name: 'valor', value: raw } });
          }}
          onKeyDown={(e) => {
            if (e.key === '-') e.preventDefault();
          }}
          className={`${modalStyles.input} ${isValorInvalid ? styles.inputErrorBorder : ''}`}
          required
        />
        {isValorInvalid && (
          <span className={styles.fieldErrorText}>El valor debe ser mayor a $ 0</span>
        )}
        {cleanNumericVal > 0 && (
          <span className={styles.amountWordsBadge}>
            ✦ {montoATextoPesos(cleanNumericVal)}
          </span>
        )}
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <textarea 
          name="observaciones" 
          value={formData.observaciones} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.textareaObservations}`} 
        />
      </div>
    </>
  );
}
