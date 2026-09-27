/**
 * @file PurchasesPagination.jsx
 * @module operations/purchases/components
 * @description Barra de controles de paginación para compras (MAN-UI-002, SRP < 60 líneas).
 * @responsibility Renderizar rango de compras mostrado y botones de avance/retroceso.
 * @usedBy apps/web/src/app/operations/purchases/components/PurchasesHistoryTable.jsx
 * @dependencies react, ../purchases.module.css
 */
import React from 'react';
import styles from '../purchases.module.css';

export function PurchasesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  if (totalItems === 0) return null;

  return (
    <div className={styles.paginationContainer} role="navigation" aria-label="Paginación de Compras">
      <span className={styles.paginationInfo}>
        Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} compras
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
