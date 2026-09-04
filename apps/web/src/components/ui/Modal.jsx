import React from 'react';
import styles from './modal.module.css';



export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
