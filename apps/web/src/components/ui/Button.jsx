import React from 'react';
import styles from './button.module.css';



export function Button({ variant = 'primary', className = '', ...props }) {
  const btnClass = `${styles.button} ${styles[variant]} ${className}`;
  return <button className={btnClass} {...props} />;
}
