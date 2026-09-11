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
  name
}) {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span style={{color: '#e11d48'}}>*</span>}
        </label>
      )}
      
      {options && options.length > 0 ? (
        <select
          name={name}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          className={styles.select}
          style={error ? { borderColor: '#e11d48' } : {}}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label} {opt.subtext ? `(${opt.subtext})` : ''}
            </option>
          ))}
        </select>
      ) : (
        <div style={{ padding: '0.75rem', border: '1px dashed #d6d3d1', borderRadius: '6px', backgroundColor: '#fafaf9', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#78716c', margin: '0 0 0.5rem 0' }}>No hay registros disponibles.</p>
          {emptyActionLabel && onEmptyAction && (
            <button
              type="button"
              onClick={onEmptyAction}
              style={{ background: 'none', border: 'none', color: '#1c1917', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              + {emptyActionLabel}
            </button>
          )}
        </div>
      )}
      
      {error && <span style={{ fontSize: '0.75rem', color: '#e11d48' }}>{error}</span>}
    </div>
  );
}
