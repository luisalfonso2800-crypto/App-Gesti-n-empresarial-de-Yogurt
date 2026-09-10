import React from 'react';
import styles from './table.module.css';

export function Table({ children }) {
  return <div className={styles.container}><table className={styles.table}>{children}</table></div>;
}

export function THead({ children }) {
  return <thead>{children}</thead>;
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children, ...props }) {
  return <tr className={styles.tr} {...props}>{children}</tr>;
}

export function TH({ children, ...props }) {
  return <th className={styles.th} {...props}>{children}</th>;
}

export function TD({ children, ...props }) {
  return <td className={styles.td} {...props}>{children}</td>;
}
