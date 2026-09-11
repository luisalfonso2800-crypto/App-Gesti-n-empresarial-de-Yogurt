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
          {label} {required && <span style={{color: '#e11d48'}}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#78716c', fontWeight: 500, pointerEvents: 'none' }}>$</span>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={styles.input}
          style={{ paddingLeft: '2rem', ...(error ? { borderColor: '#e11d48' } : {}) }}
        />
      </div>
      
      {/* Contenedor de asistencia */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#78716c', marginTop: '0.25rem', userSelect: 'none' }}>
        {value && String(value).length > 0 ? (
          <>
            <span style={{ color: '#44403c', fontWeight: 600 }}>Formato: {formatCurrency(value)}</span>
            <span>{numberToWordsSpanish(value)}</span>
          </>
        ) : null}
      </div>

      {error && <span style={{ fontSize: '0.75rem', color: '#e11d48' }}>{error}</span>}
    </div>
  );
}
