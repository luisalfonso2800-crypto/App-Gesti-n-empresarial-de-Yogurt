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

export function TR({ children }) {
  return <tr className={styles.tr}>{children}</tr>;
}

export function TH({ children }) {
  return <th className={styles.th}>{children}</th>;
}

export function TD({ children }) {
  return <td className={styles.td}>{children}</td>;
}
