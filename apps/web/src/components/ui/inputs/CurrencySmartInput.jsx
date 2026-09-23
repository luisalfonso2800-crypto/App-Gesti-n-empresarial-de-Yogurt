/**
 * @file CurrencySmartInput.jsx
 * @module components/ui/inputs
 * @description Input monetario con prevención de errores, formato visual y conversión a texto (CSS Modules).
 * @responsibility Proveer entrada segura de moneda (sin negativos, sin letras) y mostrar el valor formateado y en texto.
 */

import React from 'react';
import { formatCurrency, numberToWordsSpanish } from '../../../lib/formatters';
import styles from '../SmartModal.module.css';

export default function CurrencySmartInput({
  label,
  value,
  onChange,
  placeholder = 'Ej: 50.000',
  error,
  required = false,
  name
}) {
  const handleChange = (e) => {
    // Bloquear letras, espacios, signos negativos, símbolos en tiempo real
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, '');
    
    // Llamar al onChange padre con el valor limpio
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
      <div className={styles.currencyWrapper}>
        <span className={styles.currencySymbol}>$</span>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`${styles.input} ${styles.inputWithSymbol} ${error ? styles.inputError : ''}`}
        />
      </div>
      
      {/* Contenedor de asistencia */}
      <div className={styles.assistContainer}>
        {value && String(value).length > 0 ? (
          <>
            <span className={styles.assistFormat}>Formato: {formatCurrency(value)}</span>
            <span>{numberToWordsSpanish(value)}</span>
          </>
        ) : null}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
