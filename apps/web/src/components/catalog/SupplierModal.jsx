/**
 * @file SupplierModal.jsx
 * @module components/catalog
 * @description Modal orquestador declarativo para creación/edición de proveedores (SRP + CSS Modules).
 * @responsibility Presentar el diálogo modal, delegar lógica en useSupplierForm y campos en SupplierFormFields.
 * @dependencies SmartModal, ./parts/useSupplierForm, ./parts/SupplierFormFields
 */
'use client';

import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './supplier-modal.module.css';
import { useSupplierForm } from './parts/useSupplierForm';
import SupplierFormFields from './parts/SupplierFormFields';

export function SupplierModal({ isOpen, onClose, editingItem, onSuccess, initialData = {} }) {
  const {
    formData,
    isSubmitting,
    errorMessage,
    isDirty,
    isNitError,
    isTelefonoError,
    isEmailError,
    isSubmitDisabled,
    submitTitle,
    handleChange,
    handleSubmit
  } = useSupplierForm({ isOpen, editingItem, initialData, onSuccess, onClose });

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <SupplierFormFields
          formData={formData}
          handleChange={handleChange}
          isNitError={isNitError}
          isTelefonoError={isTelefonoError}
          isEmailError={isEmailError}
        />

        {formData.razonSocial && (
          <div className={styles.summaryCard}>
            <strong>Resumen:</strong> Se registrará el proveedor <strong>{formData.razonSocial}</strong>
            {formData.nit ? <> identificado con NIT/C.C. <strong>{formData.nit}</strong></> : null}.
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
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
            text="Guardar Proveedor"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
