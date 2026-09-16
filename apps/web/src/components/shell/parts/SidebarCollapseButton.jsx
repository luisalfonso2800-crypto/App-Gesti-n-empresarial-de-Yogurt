import React from 'react';
import styles from '../shell.module.css';

/**
 * @file SidebarCollapseButton.jsx
 * @description Botón toggle de colapso/despliegue estilo panel Gemini para el Sidebar de MANNÁ.
 */
export function SidebarCollapseButton({ collapsed, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.toggleButton}
      aria-label={collapsed ? 'Expandir barra lateral' : 'Alternar barra lateral'}
      title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        {collapsed ? (
          <path d="m14 9 3 3-3 3" />
        ) : (
          <path d="m16 15-3-3 3-3" />
        )}
      </svg>
    </button>
  );
}
