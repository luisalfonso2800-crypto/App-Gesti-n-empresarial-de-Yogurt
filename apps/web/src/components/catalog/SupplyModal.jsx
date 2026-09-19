/**
 * @file SupplyModal.jsx
 * @module components/catalog
 * @description Modal orquestador declarativo para creación/edición de insumos (SRP + CSS Modules).
 * @responsibility Presentar el modal, delegar lógica en useSupplyForm y campos en SupplyFormFields.
 * @dependencies SmartModal, ./parts/useSupplyForm, ./parts/SupplyFormFields
 */
'use client';

import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './supply-modal.module.css';
import { useSupplyForm } from './parts/useSupplyForm';
import SupplyFormFields from './parts/SupplyFormFields';
import { UNIT_NAMES } from './parts/supplyConstants';

export function SupplyModal({ isOpen, onClose, editingItem, onSuccess, initialData = {} }) {
  const {
    formData,
    isSubmitting,
    errorMsg,
    isDirty,
    rawCostoBase,
    minStockNum,
    isSubmitDisabled,
    submitTitle,
    isNombreError,
    isCategoriaError,
    isMarcaError,
    isUnidadBaseError,
    isStockMinimoError,
    handleChange,
    handleSubmit
  } = useSupplyForm({ isOpen, editingItem, initialData, onSuccess, onClose });

  const selectedUnitName = UNIT_NAMES[formData.unidadBase] || formData.unidadBase;

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Insumo' : 'Nuevo Insumo'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <SupplyFormFields
          formData={formData}
          handleChange={handleChange}
          rawCostoBase={rawCostoBase}
          minStockNum={minStockNum}
          isNombreError={isNombreError}
          isCategoriaError={isCategoriaError}
          isMarcaError={isMarcaError}
          isUnidadBaseError={isUnidadBaseError}
          isStockMinimoError={isStockMinimoError}
        />

        {formData.nombre && (
          <div className={styles.summaryCard}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el insumo <strong>{formData.nombre}</strong>
            {formData.categoria ? <> (categoría <strong>{formData.categoria.replace('_', ' ').toLowerCase()}</strong>)</> : null}
            {formData.unidadBase ? <>, medido en <strong>{formData.unidadBase}</strong> con umbral de alerta en <strong>{formData.stockMinimo || 0}</strong> {selectedUnitName}</> : null}
            {rawCostoBase > 0 ? <> y costo base de <strong>${rawCostoBase.toLocaleString('es-CO')}</strong></> : null}.
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
            text="Guardar Insumo"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
