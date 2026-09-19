/**
 * @file RecipeExitConfirmModal.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Diálogo de confirmación Poka-Yoke para salir del editor de recetas sin guardar.
 * @responsibility Presentar advertencia de descarte de cambios y confirmar salida o continuación de edición.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, ../recipe-modal.module.css
 */

import React from 'react';
import styles from '../recipe-modal.module.css';

export function RecipeExitConfirmModal({ isOpen, onClose, onConfirmExit }) {
  if (!isOpen) return null;

  return (
    <div className={styles.confirmDialogOverlay} onClick={onClose}>
      <div className={styles.confirmDialogCard} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.confirmDialogTitle}>¿Deseas salir del editor de recetas?</h3>
        <p className={styles.confirmDialogText}>Se perderán los cambios no guardados en la formulación técnica.</p>
        <div className={styles.confirmDialogActions}>
          <button type="button" className={styles.btnContinueEditing} onClick={onClose}>
            Continuar Editando
          </button>
          <button type="button" className={styles.btnDiscardRecipe} onClick={onConfirmExit}>
            Descartar y Salir
          </button>
        </div>
      </div>
    </div>
  );
}
