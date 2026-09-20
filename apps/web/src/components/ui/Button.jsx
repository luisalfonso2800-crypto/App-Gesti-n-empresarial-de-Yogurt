import React from 'react';
import styles from './button.module.css';



export function Button({ variant = 'primary', className = '', loading, disabled, children, ...props }) {
  const btnClass = `${styles.button} ${styles[variant]} ${className}`;
  return (
    <button className={btnClass} disabled={disabled || Boolean(loading)} {...props}>
      {children}
    </button>
  );
}
