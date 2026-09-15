/**
 * @file ProductsPagination.jsx
 * @module catalog/products/components
 * @description Barra de controles de paginación para el catálogo de productos terminados.
 * @responsibility Renderizar información de rango de ítems y botones de avance/retroceso.
 * @dependencies react, ../products.module.css
 */
import React from 'react';
import styles from '../products.module.css';

export function ProductsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  if (totalItems === 0) return null;

  return (
    <div className={styles.paginationContainer}>
      <span className={styles.paginationInfo}>
        Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} productos
      </span>
      <div className={styles.paginationControls}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.pageBtnActive : ''}`}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
