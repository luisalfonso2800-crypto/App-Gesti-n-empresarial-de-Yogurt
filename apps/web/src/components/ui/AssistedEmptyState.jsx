/**
 * @file AssistedEmptyState.jsx
 * @module components/ui
 * @description Componente estándar de Estado Vacío Asistido con diseño oficial MANNÁ.
 * @responsibility Renderizar tarjeta visual orientada a la acción cuando una tabla o listado no posee datos.
 * @usedBy Módulos de Catálogos, Operaciones y Comercial
 * @dependencies react, AssistedEmptyState.module.css
 */
'use client';

import React from 'react';
import styles from './AssistedEmptyState.module.css';

/**
 * Renderiza una tarjeta guiada de estado vacío para orientar al operario en planta.
 * @param {Object} props
 * @param {React.ReactNode|string} props.icon - Emoji o componente ícono representativo.
 * @param {string} props.title - Título de bienvenida orientado a la acción.
 * @param {string} props.description - Explicación pedagógica del valor de la entidad en planta.
 * @param {string} [props.actionLabel] - Texto del botón primario de acción (ej. "+ Formular Nueva Receta").
 * @param {Function} [props.onAction] - Callback disparado al hacer clic en el botón primario.
 * @param {string} [props.topButtonLabel] - Nombre del botón superior referenciado como guía espacial (ej. "Nueva Receta").
 * @param {boolean} [props.canAction=true] - Si la acción está habilitada o bloqueada por prerrequisitos Poka-Yoke.
 * @param {string} [props.disabledTooltip=''] - Mensaje explicativo cuando la acción está deshabilitada.
 */
export function AssistedEmptyState({
  icon = '📋',
  title,
  description,
  actionLabel,
  onAction,
  topButtonLabel,
  canAction = true,
  disabledTooltip = ''
}) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {typeof icon === 'string' ? icon : React.createElement(icon, { size: 36, color: '#182622' })}
      </div>
      
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      
      <div className={styles.actionWrapper}>
        {actionLabel && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              if (canAction && onAction) onAction();
            }}
            disabled={!canAction}
            title={!canAction ? disabledTooltip : actionLabel}
          >
            {actionLabel}
          </button>
        )}
        {topButtonLabel && (
          <span className={styles.topGuide}>
            o pulsa el botón <strong>{topButtonLabel}</strong> situado arriba a la derecha ↗
          </span>
        )}
      </div>
    </div>
  );
}

export default AssistedEmptyState;
