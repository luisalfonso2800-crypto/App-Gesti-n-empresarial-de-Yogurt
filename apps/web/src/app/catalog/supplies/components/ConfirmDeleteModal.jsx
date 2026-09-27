/**
 * @file ConfirmDeleteModal.jsx
 * @module catalog/supplies/components
 * @description Diálogo de confirmación para eliminación física segura de insumos desactivados y sin trazabilidad (SRP < 85 líneas).
 * @responsibility Informar advertencia y confirmar ejecución de hard delete condicional según reglas de trazabilidad.
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/Button, ../utils/supplyTraceability
 */
import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import { checkSupplyTraceability } from '../utils/supplyTraceability';
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

  const { hasTraceability, reasons, canDelete } = checkSupplyTraceability(item);

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

        {item.activo && (
          <div className={styles.alertDanger}>
            <span>⚠️</span>
            <span>El insumo está activo. Primero debe desactivarlo para poder proceder con su eliminación.</span>
          </div>
        )}

        {hasTraceability && (
          <div className={styles.alertDanger}>
            <span>🛡️</span>
            <div>
              <strong>Insumo con trazabilidad histórica registrada:</strong>
              <p className={styles.traceabilityReasonText}>
                Cuenta con {reasons.join(', ')}. Por integridad y control de costos no se puede eliminar físicamente; debe mantenerse desactivado.
              </p>
            </div>
          </div>
        )}

        {!hasTraceability && !item.activo && (
          <p className={styles.confirmSubtext}>
            ✅ Se verificó que el insumo <strong>no cuenta con compras, recetas, lotes ni inventario registrado</strong>. Esta acción purgará el registro definitivamente del catálogo.
          </p>
        )}

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
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            disabled={isDeleting || !canDelete}
            title={canDelete ? 'Confirmar purga definitiva' : 'Acción bloqueada por trazabilidad o estado activo'}
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
          </Button>
        </div>
      </div>
    </SmartModal>
  );
}
