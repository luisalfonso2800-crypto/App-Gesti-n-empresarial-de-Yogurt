/**
 * @file PaymentFormModal.jsx
 * @module commercial/payments/components
 * @description Modal orquestador para captura de cobros e imputación a ventas (SRP + CSS Modules).
 * @responsibility Orquestar diálogo de cobros, bandera hasSubmitted Poka-Yoke y resumen contable.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/formatters, ./modal-parts/PaymentClientAndSaleFields, ./modal-parts/PaymentAmountAndMethodFields
 */
import React, { useState } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../payments.module.css';
import PaymentClientAndSaleFields from './modal-parts/PaymentClientAndSaleFields';
import PaymentAmountAndMethodFields from './modal-parts/PaymentAmountAndMethodFields';

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
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (isSubmitDisabled) return;
    handleSubmit(e);
  };

  const handleClose = () => {
    setHasSubmitted(false);
    onClose();
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={handleClose} 
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

      <form onSubmit={handleFormSubmit} className={styles.formContainer}>
        <PaymentClientAndSaleFields
          formData={formData}
          handleChange={handleChange}
          clients={clients}
          pendingSales={pendingSales}
          hasSubmitted={hasSubmitted}
        />

        <PaymentAmountAndMethodFields
          formData={formData}
          handleChange={handleChange}
          showExceedError={showExceedError}
          hasSubmitted={hasSubmitted}
        />

        {formData.idCliente && formData.idVenta && paymentValue > 0 && !showExceedError && (
          <div className={styles.summaryBanner}>
            <strong>Resumen:</strong> Se registrará un abono de <strong>{formatCurrency(paymentValue)}</strong> del cliente <strong>{clientName}</strong> imputado a la venta seleccionada. El nuevo saldo proyectado será de <strong>{formatCurrency(projectedBalance)}</strong> ({formData.metodoPago ? formData.metodoPago.toLowerCase() : 'método sin definir'}).
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={handleClose}
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
