import React from 'react';
import styles from './badge.module.css';



export function Badge({ status, children }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{children}</span>;
}
