/**
 * @file ConfirmDeleteProductModal.jsx
 * @module catalog/products/components
 * @description Diálogo modal de confirmación para la eliminación física segura de un producto terminado.
 * @responsibility Informar advertencia y confirmar ejecución de hard delete condicional según reglas de integridad.
 * @dependencies @/components/ui/Modal, @/components/ui/Button, ./confirm-delete.module.css
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import styles from './confirm-delete.module.css';

export function ConfirmDeleteProductModal({
  isOpen,
  item,
  isDeleting,
  errorMessage,
  onConfirm,
  onClose
}) {
  if (!isOpen || !item) return null;

  const isMultiple = Boolean(item.count && item.count > 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isMultiple ? "Eliminar Productos Definitivamente" : "Eliminar Producto Definitivamente"}>
      <div className={styles.container}>
        <p className={styles.confirmText}>
          {isMultiple ? (
            <>¿Está seguro de eliminar definitivamente los <strong>{item.count} productos</strong> seleccionados?</>
          ) : (
            <>¿Está seguro de eliminar definitivamente el producto <strong>{item.nombre}</strong>?</>
          )}
        </p>
        <p className={styles.confirmSubtext}>
          Esta acción purgará los registros únicamente si no cuentan con recetas, lotes de producción, movimientos de inventario ni ventas asociadas.
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
    </Modal>
  );
}
