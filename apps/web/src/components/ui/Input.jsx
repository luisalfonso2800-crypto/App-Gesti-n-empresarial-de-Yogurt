import React from 'react';
import styles from './input.module.css';



export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input 
        className={`${styles.input} ${error ? styles.error : ''} ${className}`} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
