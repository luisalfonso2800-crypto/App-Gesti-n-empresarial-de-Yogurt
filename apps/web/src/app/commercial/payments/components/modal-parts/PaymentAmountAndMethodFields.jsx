/**
 * @file PaymentAmountAndMethodFields.jsx
 * @module commercial/payments/components/modal-parts
 * @description Campos de Valor Pagado, Método de Pago, Referencia y Observaciones con validación Poka-Yoke.
 * @responsibility Renderizar los controles de monto, método financiero y notas del recaudo.
 * @usedBy apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx
 * @dependencies react, @/components/ui/inputs/SmartSelect, @/utils/numberToWords, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../../payments.module.css';

const METODOS_PAGO = [
  { id: 'EFECTIVO', label: 'Efectivo' },
  { id: 'TRANSFERENCIA', label: 'Transferencia' },
  { id: 'TARJETA', label: 'Tarjeta' }
];

export default function PaymentAmountAndMethodFields({
  formData,
  handleChange,
  showExceedError,
  hasSubmitted = false
}) {
  const cleanNumericVal = formData.valorPagado ? parseInt(String(formData.valorPagado).replace(/\D/g, ''), 10) : 0;
  const isValorInvalid = (hasSubmitted && (!formData.valorPagado || cleanNumericVal <= 0)) || showExceedError;
  const isMetodoInvalid = hasSubmitted && !formData.metodoPago;

  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Valor Pagado ($) <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input
          name="valorPagado"
          type="text"
          inputMode="numeric"
          min="0"
          placeholder="0"
          value={formData.valorPagado ? String(formData.valorPagado).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            handleChange({ target: { name: 'valorPagado', value: raw } });
          }}
          onKeyDown={(e) => {
            if (e.key === '-') e.preventDefault();
          }}
          className={`${modalStyles.input} ${isValorInvalid ? styles.inputErrorBorder : ''}`}
          required
        />
        {showExceedError && (
          <span className={styles.fieldErrorText}>
            El valor excede el saldo pendiente de la venta seleccionada
          </span>
        )}
        {!showExceedError && hasSubmitted && (!formData.valorPagado || cleanNumericVal <= 0) && (
          <span className={styles.fieldErrorText}>
            El valor del pago debe ser mayor a $ 0
          </span>
        )}
        {cleanNumericVal > 0 && (
          <span className={styles.paymentWordsBadge}>
            ✦ {montoATextoPesos(cleanNumericVal)}
          </span>
        )}
      </div>

      <SmartSelect
        label="Método de Pago"
        name="metodoPago"
        value={formData.metodoPago ?? ''}
        onChange={handleChange}
        options={METODOS_PAGO}
        required
        error={isMetodoInvalid ? 'Seleccione el método de pago' : undefined}
      />

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Referencia</label>
        <input 
          name="referencia" 
          type="text" 
          value={formData.referencia ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
        />
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <textarea 
          name="observaciones" 
          value={formData.observaciones ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.textareaObservations}`} 
        />
      </div>
    </>
  );
}
