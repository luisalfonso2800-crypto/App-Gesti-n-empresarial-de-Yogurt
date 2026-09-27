/**
 * @file PresentationsPagination.jsx
 * @module catalog/presentations/components
 * @description Paginador accesible y responsivo para el catálogo de presentaciones (SRP < 70 líneas).
 * @responsibility Renderizar rango de elementos visibles y botones de navegación de páginas.
 * @usedBy apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
 * @dependencies react, ../presentations.module.css
 */
import React from 'react';
import styles from '../presentations.module.css';

export function PresentationsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) {
  if (totalItems <= pageSize) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.paginationContainer}>
      <span className={styles.paginationInfo}>
        Mostrando <strong>{startItem}–{endItem}</strong> de <strong>{totalItems}</strong> presentaciones (10 por pág.)
      </span>
      <div className={styles.paginationControls}>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          &larr; Anterior
        </button>

        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ''}`}
                onClick={() => onPageChange(pageNum)}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Página siguiente"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}
