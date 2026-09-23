/**
 * @file StrictNumberInput.jsx
 * @module components/ui/inputs
 * @description Input numérico estricto para cédulas, NITs, teléfonos, días de crédito (CSS Modules).
 * @responsibility Filtrar caracteres no numéricos en tiempo real sin ceros por defecto.
 */

import React from 'react';
import { onlyNumbers } from '../../../lib/formatters';
import styles from '../SmartModal.module.css';

export default function StrictNumberInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  name,
  maxLength
}) {
  const handleChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = onlyNumbers(rawValue);
    
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: cleanValue
        }
      });
    }
  };

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
