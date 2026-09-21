/**
 * @file ConfirmDeleteRecipeModal.jsx
 * @module catalog/recipes/components
 * @description Diálogo modal de confirmación para eliminación física segura de una receta técnica.
 * @responsibility Advertir y confirmar ejecución de hard delete condicional según reglas de integridad.
 * @dependencies @/components/ui/SmartModal, @/components/ui/Button, apps/web/src/app/catalog/products/components/confirm-delete.module.css
 */
import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../../products/components/confirm-delete.module.css';

export function ConfirmDeleteRecipeModal({
  isOpen,
  item,
  isDeleting = false,
  errorMessage = null,
  onConfirm,
  onClose
}) {
  if (!isOpen || !item) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Eliminar Receta Técnica?"
      isSubmitting={isDeleting}
    >
      <div className={styles.container}>
        <p className={styles.confirmText}>
          ¿Estás seguro de eliminar la receta <strong>"{item.nombre}"</strong>? Esta acción no se puede deshacer.
        </p>
        <p className={styles.confirmSubtext}>
          Esta acción purgará la fórmula únicamente si se encuentra desactivada y no cuenta con órdenes de producción, lotes fabricados ni dependencias de elaboración activas.
        </p>

        {errorMessage && (
          <div className={styles.alertDanger}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={styles.formActions}>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
          </Button>
        </div>
      </div>
    </SmartModal>
  );
}
