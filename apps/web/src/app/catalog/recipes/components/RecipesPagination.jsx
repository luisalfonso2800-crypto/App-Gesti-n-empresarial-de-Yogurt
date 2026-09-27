/**
 * @file RecipesPagination.jsx
 * @module catalog/recipes/components
 * @description Barra de controles de paginación para el catálogo de recetas técnicas (MAN-UI-002, SRP < 60 líneas).
 * @responsibility Renderizar rango de recetas mostrado y botones de avance/retroceso.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies react, ../recipes.module.css
 */
import React from 'react';
import styles from '../recipes.module.css';

export function RecipesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  if (totalItems === 0) return null;

  return (
    <div className={styles.paginationContainer} role="navigation" aria-label="Paginación de Recetas">
      <span className={styles.paginationInfo}>
        Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} recetas
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
