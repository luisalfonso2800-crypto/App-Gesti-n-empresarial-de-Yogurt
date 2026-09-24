/**
 * @file SmartSelect.jsx
 * @module components/ui/inputs
 * @description Selector dinámico que maneja estados vacíos amigables (CSS Modules).
 */

import React from 'react';
import styles from '../SmartModal.module.css';

export default function SmartSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione una opción',
  emptyActionLabel,
  onEmptyAction,
  error,
  required = false,
  disabled = false,
  name
}) {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      )}
      
      {options && options.length > 0 ? (
        <select
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${styles.select} ${error ? styles.inputError : ''}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label} {opt.subtext ? `(${opt.subtext})` : ''}
            </option>
          ))}
        </select>
      ) : (
        <div className={styles.emptySelectState}>
          <p className={styles.emptySelectText}>No hay registros disponibles.</p>
          {emptyActionLabel && onEmptyAction && (
            <button
              type="button"
              onClick={onEmptyAction}
              className={styles.emptySelectAction}
            >
              + {emptyActionLabel}
            </button>
          )}
        </div>
      )}
      
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
