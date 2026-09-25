/**
 * @file ProductPresentationSelector.jsx
 * @module catalog/products/components/modal-parts
 * @description Selector de presentación con soporte para creación rápida en estado vacío.
 * @responsibility Renderizar SmartSelect de presentaciones o botón de alta rápida si la lista está vacía.
 */

import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductPresentationSelector({
  presentations = [],
  formData,
  handleChange,
  isPresentacionError = false,
  disabled = false,
  onQuickCreate
}) {
  if (presentations.length === 0) {
    return (
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Presentación <span className={styles.requiredAsterisk}>*</span>
        </label>
        <div className={styles.emptyPresContainer}>
          <span className={styles.emptyPresText}>No hay formatos disponibles</span>
          <button
            type="button"
            className={styles.btnQuickCreatePres}
            onClick={onQuickCreate}
            disabled={disabled}
          >
            + Crear Formato
          </button>
        </div>
        {isPresentacionError && (
          <span className={styles.fieldErrorText}>Debe crear y seleccionar una presentación</span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.lockedFieldWrapper}>
      <SmartSelect
        label="Presentación"
        name="idPresentacion"
        value={formData.idPresentacion ?? ''}
        onChange={handleChange}
        disabled={disabled}
        options={presentations.map(p => ({
          id: p.id,
          label: p.nombre && p.nombre.length > 60 ? `${p.nombre.slice(0, 57)}...` : p.nombre
        }))}
        required
        placeholder={disabled ? '🔒 Ingrese nombre primero' : 'Seleccione presentación'}
        className={isPresentacionError ? styles.inputErrorBorder : ''}
      />
      {isPresentacionError && (
        <span className={styles.fieldErrorText}>Este campo es requerido</span>
      )}
    </div>
  );
}
