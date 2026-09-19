/**
 * @file ConfirmDeleteModal.jsx
 * @module catalog/supplies/components
 * @description Diálogo de confirmación para eliminación física segura de insumos desactivados.
 * @responsibility Informar advertencia y confirmar ejecución de hard delete condicional.
 * @dependencies @/components/ui/SmartModal, @/components/ui/Button
 */
import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../supplies.module.css';

export function ConfirmDeleteModal({
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
      title="Eliminar Insumo Definitivamente"
      isSubmitting={isDeleting}
    >
      <div className={styles.container}>
        <p className={styles.confirmText}>
          ¿Está seguro de eliminar definitivamente el insumo <strong>{item.nombre}</strong>?
        </p>
        <p className={styles.confirmSubtext}>
          Esta acción purgará el insumo únicamente si no cuenta con compras, inventario registrado, recetas o registros de producción.
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

