import React from 'react';
import styles from './states.module.css';

export function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Cargando...</div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.title} ${styles.error}`}>Error</div>
      <div className={styles.description}>{error}</div>
    </div>
  );
}
