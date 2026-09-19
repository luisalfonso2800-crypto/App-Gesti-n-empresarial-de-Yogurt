/**
 * @file ExpenseFormModal.jsx
 * @module commercial/expenses/components
 * @description Modal orquestador para captura de gastos operativos (SRP + CSS Modules).
 * @responsibility Presentar diálogo, bandera hasSubmitted Poka-Yoke y resumen de persistencia.
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/formatters, ./modal-parts/ExpensePeriodAndCategoryFields, ./modal-parts/ExpenseValueAndDetailFields
 */
import React, { useState } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../expenses.module.css';
import ExpensePeriodAndCategoryFields from './modal-parts/ExpensePeriodAndCategoryFields';
import ExpenseValueAndDetailFields from './modal-parts/ExpenseValueAndDetailFields';

export default function ExpenseFormModal({
  isOpen,
  onClose,
  formData,
  isSubmitting,
  submitError,
  isDirty,
  isSubmitDisabled,
  submitTitle,
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
      title="Nuevo Gasto"
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
        <ExpensePeriodAndCategoryFields
          formData={formData}
          handleChange={handleChange}
          hasSubmitted={hasSubmitted}
        />

        <ExpenseValueAndDetailFields
          formData={formData}
          handleChange={handleChange}
          hasSubmitted={hasSubmitted}
        />

        {formData.categoria && formData.descripcion && formData.valor && (
          <div className={styles.summaryBanner}>
            <strong>Resumen:</strong> Se registrará un gasto de <strong>{formData.categoria.replace('_', ' ')}</strong> por un valor de <strong>{formatCurrency(formData.valor)}</strong>, clasificado como gasto <strong>{formData.tipoGasto ? formData.tipoGasto.toLowerCase() : 'operativo'}</strong> para el periodo de <strong>{formData.periodo || 'no especificado'}</strong>.
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
            text="Guardar Gasto"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
