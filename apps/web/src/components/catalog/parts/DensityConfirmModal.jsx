/**
 * @file DensityConfirmModal.jsx
 * @module components/catalog/parts
 * @description Modal de advertencia para confirmación de edición manual de densidad (< 100 líneas).
 */
import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../supply-modal.module.css';

export function DensityConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onCancel}
      title="Modificar Densidad Manualmente"
    >
      <div className={styles.densityConfirmModalBody}>
        <div className={styles.densityWarningBox}>
          <span>⚠️</span>
          <span>
            La densidad estándar o deducida por balanza garantiza la precisión de inventarios y recetas.
            Si la modifica manualmente, asegúrese de conocer el valor técnico exacto en <strong>g/ml</strong>.
          </span>
        </div>
        <p className={styles.densityConfirmQuestion}>
          ¿Está seguro de desbloquear este campo para editar la densidad de forma manual?
        </p>
        <div className={styles.densityConfirmActions}>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Sí, Desbloquear y Editar
          </Button>
        </div>
      </div>
    </SmartModal>
  );
}
