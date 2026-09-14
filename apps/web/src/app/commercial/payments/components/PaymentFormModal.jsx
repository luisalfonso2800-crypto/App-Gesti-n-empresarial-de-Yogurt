/**
 * @file PaymentFormModal.jsx
 * @module commercial/payments/components
 * @description Modal y formulario para registro de cobros e imputación a ventas (SRP + CSS Modules).
 * @responsibility Presentar los campos de recaudo, cálculo de saldo proyectado y feedback Poka-Yoke.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, @/lib/formatters, @/utils/numberToWords
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { formatCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../payments.module.css';

const METODOS_PAGO = [
  { id: 'EFECTIVO', label: 'Efectivo' },
  { id: 'TRANSFERENCIA', label: 'Transferencia' },
  { id: 'TARJETA', label: 'Tarjeta' }
];

export default function PaymentFormModal({
  isOpen,
  onClose,
  formData,
  clients,
  pendingSales,
  paymentValue,
  showExceedError,
  clientName,
  projectedBalance,
  isSubmitDisabled,
  submitTitle,
  isSubmitting,
  submitError,
  isDirty,
  handleChange,
  handleSubmit
}) {
  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nuevo Pago"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {submitError && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Fecha de Pago <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="fechaPago" 
            type="date" 
            value={formData.fechaPago ?? ''} 
            onChange={handleChange} 
            className={modalStyles.input} 
            required 
          />
        </div>

        <SmartSelect
          label="Cliente"
          name="idCliente"
          value={formData.idCliente ?? ''}
          onChange={handleChange}
          options={clients.map(c => ({ id: c.id, label: c.nombre, subtext: c.documento }))}
          required
          placeholder="Seleccione un cliente"
        />

        {formData.idCliente && pendingSales.length === 0 && (
          <div className={styles.clientUpToDateBanner}>
            Este cliente está al día
          </div>
        )}

        {formData.idCliente && pendingSales.length > 0 && (
          <SmartSelect
            label="Venta Pendiente"
            name="idVenta"
            value={formData.idVenta ?? ''}
            onChange={handleChange}
            options={pendingSales.map(s => ({
              id: s.id,
              label: `Venta ${new Date(s.fechaVenta).toLocaleDateString()} - ${s.canalVenta}`,
              subtext: `Saldo: ${formatCurrency(s.saldoPendiente)}`
            }))}
            required
            placeholder="Seleccione venta a abonar"
          />
        )}

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
            className={modalStyles.input}
            required
          />
          {showExceedError && (
            <span className={styles.paymentExceedError}>
              El valor excede el saldo pendiente
            </span>
          )}
          {formData.valorPagado && parseInt(String(formData.valorPagado).replace(/\D/g, ''), 10) > 0 && (
            <span className={styles.paymentWordsBadge}>
              ✦ {montoATextoPesos(parseInt(String(formData.valorPagado).replace(/\D/g, ''), 10))}
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

        {formData.idCliente && formData.idVenta && paymentValue > 0 && !showExceedError && (
          <div className={styles.summaryBanner}>
            <strong>Resumen:</strong> Se registrará un abono de <strong>{formatCurrency(paymentValue)}</strong> del cliente <strong>{clientName}</strong> imputado a la venta seleccionada. El nuevo saldo proyectado será de <strong>{formatCurrency(projectedBalance)}</strong> ({formData.metodoPago ? formData.metodoPago.toLowerCase() : 'método sin definir'}).
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={modalStyles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Pago"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
