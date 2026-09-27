/**
 * @file GoalsPagination.jsx
 * @module commercial/goals/components
 * @description Barra de paginación fija para metas (SRP < 60 líneas).
 * @responsibility Mostrar rango de metas y navegación de páginas.
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies react, ../goals.module.css
 */
'use client';

import React from 'react';
import styles from '../goals.module.css';

export function GoalsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  if (totalItems === 0) return null;

  return (
    <div className={styles.paginationContainer} role="navigation" aria-label="Paginación de Metas">
      <span className={styles.paginationInfo}>
        Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} metas
      </span>
      <div className={styles.paginationControls}>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.pageBtnActive : ''}`}
            onClick={() => onPageChange(idx + 1)}
            aria-label={`Ir a página ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
