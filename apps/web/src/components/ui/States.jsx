import React from 'react';
import styles from './states.module.css';
import ServerOfflineCanvas from './ServerOfflineCanvas';

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

export function ErrorState({ error, onRetry }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const isConnectionError =
    errorMessage.toLowerCase().includes('failed to fetch') ||
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('conexión') ||
    errorMessage.toLowerCase().includes('econnrefused');

  if (isConnectionError) {
    return <ServerOfflineCanvas onRetry={onRetry} />;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.title} ${styles.error}`}>Error</div>
      <div className={styles.description}>{errorMessage || 'Ha ocurrido un error inesperado.'}</div>
    </div>
  );
}
