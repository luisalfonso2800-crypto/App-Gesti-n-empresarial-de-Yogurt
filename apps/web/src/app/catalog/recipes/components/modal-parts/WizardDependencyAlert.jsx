'use client';

/**
 * @file WizardDependencyAlert.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Tarjeta de alerta y asistencia guiada para dependencias operativas faltantes (< 80 líneas).
 * @responsibility Presentar mensaje guiado y botones de acción/redirección para formular recetas o registrar insumos.
 * @usedBy PackagingCerealQuestion, PackagingWizardModal
 * @dependencies react, ./packaging-wizard.module.css
 */

import React from 'react';
import styles from './packaging-wizard.module.css';

export function WizardDependencyAlert({
  title,
  message,
  primaryActionLabel,
  primaryActionUrl,
  onSecondaryAction,
  secondaryActionLabel
}) {
  const handlePrimaryClick = () => {
    if (primaryActionUrl) {
      window.open(primaryActionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.guidedBanner}>
      <div className={styles.guidedBannerContent}>
        <span className={styles.guidedBannerIcon}>ℹ️</span>
        <div>
          <strong className={styles.guidedBannerTitle}>{title}</strong>
          <p className={styles.guidedBannerText}>{message}</p>
        </div>
      </div>
      <div className={styles.guidedBannerActions}>
        {onSecondaryAction && secondaryActionLabel && (
          <button
            type="button"
            className={styles.btnBannerAction}
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}
        {primaryActionUrl && primaryActionLabel && (
          <button
            type="button"
            className={styles.btnBannerActionPrimary}
            onClick={handlePrimaryClick}
          >
            {primaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
