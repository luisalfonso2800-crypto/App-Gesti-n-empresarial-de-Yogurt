/**
 * @file ProductBulkActionBar.jsx
 * @module catalog/products/components
 * @description Barra de acciones masivas para productos seleccionados con apertura concurrente de recetas.
 * @responsibility Presentar contador de selección y disparador para formular recetas en nuevas pestañas.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies React, ./product-bulk-action-bar.module.css
 */
import React from 'react';
import styles from './product-bulk-action-bar.module.css';

export function ProductBulkActionBar({
  selectedIds = [],
  items = [],
  recipes = [],
  onClearSelection = () => {},
  onNotify = () => {},
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete
}) {
  if (!selectedIds || selectedIds.length === 0) return null;

  // Filtrar productos seleccionados
  const selectedProducts = items.filter(item => selectedIds.includes(item.id));

  // Filtrar aquellos seleccionados que NO posean receta técnica asociada activa
  const productsWithoutRecipe = selectedProducts.filter(prod => {
    const hasRecipe = recipes.some(
      r => r.activo !== false && String(r.idProducto) === String(prod.id)
    );
    return !hasRecipe;
  });

  const countWithoutRecipe = productsWithoutRecipe.length;

  const handleOpenBulkRecipes = () => {
    if (productsWithoutRecipe.length === 0) return;

    // Abrir cada receta en su propia pestaña en el evento directo de clic
    productsWithoutRecipe.forEach((prod) => {
      window.open(`/catalog/recipes?action=new&productId=${prod.id}`, '_blank');
    });

    const msg = `Se abrieron ${productsWithoutRecipe.length} pestaña${productsWithoutRecipe.length > 1 ? 's' : ''} para formular recetas técnicas.`;
    onNotify(msg);
    onClearSelection();
  };

  return (
    <div className={styles.bulkBarContainer}>
      <div className={styles.bulkInfo}>
        <span className={styles.selectedBadge}>
          {selectedIds.length}
        </span>
        <span>
          producto{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.bulkActions}>
        {onBulkActivate && (
          <button
            type="button"
            className={styles.btnBulkActivate}
            onClick={() => onBulkActivate(selectedIds)}
            title="Activar productos seleccionados"
          >
            <span>🟢</span>
            <span>Activar</span>
          </button>
        )}

        {onBulkDeactivate && (
          <button
            type="button"
            className={styles.btnBulkDeactivate}
            onClick={() => onBulkDeactivate(selectedIds)}
            title="Desactivar productos seleccionados"
          >
            <span>🟡</span>
            <span>Desactivar</span>
          </button>
        )}

        {onBulkDelete && (
          <button
            type="button"
            className={styles.btnBulkDelete}
            onClick={() => onBulkDelete(selectedIds)}
            title="Eliminar productos seleccionados"
          >
            <span>🗑️</span>
            <span>Eliminar</span>
          </button>
        )}

        {countWithoutRecipe > 0 && (
          <button
            type="button"
            className={styles.btnBulkRecipe}
            onClick={handleOpenBulkRecipes}
            title="Formular recetas en pestañas independientes para los productos seleccionados sin receta"
          >
            <span>📖</span>
            <span>+ Formular Recetas ({countWithoutRecipe})</span>
          </button>
        )}

        <button
          type="button"
          className={styles.btnClearSelection}
          onClick={onClearSelection}
          title="Limpiar selección actual"
        >
          <span>✖</span>
          <span>Limpiar Selección</span>
        </button>
      </div>
    </div>
  );
}
