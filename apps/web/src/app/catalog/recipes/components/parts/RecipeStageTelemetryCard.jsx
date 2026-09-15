'use client';

/**
 * @file RecipeStageTelemetryCard.jsx
 * @module catalog/recipes/components/parts
 * @description Tarjeta de telemetría viva para la narración en tiempo real de la etapa activa en planta.
 * @responsibility Mostrar la lectura operativa generada dinámicamente con estética MANNÁ (< 80 líneas).
 * @usedBy RecipeStageEditor.jsx
 */

import React from 'react';
import styles from './recipe-stages.module.css';

export function RecipeStageTelemetryCard({ summaryText = '' }) {
  return (
    <div className={styles.telemetryCard}>
      <span className={styles.telemetryIcon}>📋</span>
      <div className={styles.telemetryContent}>
        <strong className={styles.telemetryHeading}>
          Lectura de Operación en Planta (En Vivo)
        </strong>
        <div className={styles.telemetryBody}>
          {summaryText || 'Etapa sin parámetros definidos.'}
        </div>
      </div>
    </div>
  );
}
