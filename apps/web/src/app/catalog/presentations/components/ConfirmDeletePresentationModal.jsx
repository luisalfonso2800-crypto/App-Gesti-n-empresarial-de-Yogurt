/**
 * @file ConfirmDeletePresentationModal.jsx
 * @module catalog/presentations/components
 * @description Diálogo modal de confirmación para la eliminación física segura de una presentación comercial.
 * @responsibility Confirmar borrado definitivo si la presentación está inactiva y no tiene productos vinculados.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/components/ui/SmartModal, @/components/ui/Button, ../../products/components/confirm-delete.module.css
 */
import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../../products/components/confirm-delete.module.css';

export function ConfirmDeletePresentationModal({
  isOpen,
  item,
  isDeleting,
  errorMessage,
  onConfirm,
  onClose
}) {
  if (!isOpen || !item) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Presentación Definitivamente"
      isSubmitting={isDeleting}
    >
      <div className={styles.container}>
        <p className={styles.confirmText}>
          ¿Está seguro de eliminar definitivamente la presentación <strong>{item.nombre}</strong>?
        </p>
        <p className={styles.confirmSubtext}>
          Esta acción purgará el registro únicamente si no cuenta con productos asociados en el catálogo ni dependencias de recetas.
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
