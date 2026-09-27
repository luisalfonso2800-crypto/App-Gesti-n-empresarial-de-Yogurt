/**
 * @file ConfirmArchiveGoalModal.jsx
 * @module commercial/goals/components
 * @description Modal inteligente Poka-Yoke para confirmar archivo de metas (SRP < 120 líneas).
 * @responsibility Reemplazar window.confirm nativo por SmartModal MANNÁ.
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/Button, lucide-react
 */
'use client';

import React from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertCircle } from 'lucide-react';
import styles from '../goals.module.css';

export function ConfirmArchiveGoalModal({
  isOpen,
  onClose,
  goal,
  onConfirm,
  submitting = false
}) {
  if (!isOpen || !goal) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Archivar esta Meta o Sueño?"
      subtitle={goal.titulo}
      icon={Trash2}
      isSubmitting={submitting}
    >
      <div className={styles.archiveConfirmContainer}>
        <div className={styles.archiveWarningBox}>
          <AlertCircle size={20} className={styles.archiveWarningIcon} />
          <p>
            Esta meta dejará de recibir aportes y flujos automáticos. Los fondos aportados previamente permanecerán registrados en el historial financiero.
          </p>
        </div>

        <div className={styles.modalActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(goal.id)}
            disabled={submitting}
          >
            {submitting ? 'Archivando...' : 'Sí, Archivar Meta'}
          </Button>
        </div>
      </div>
    </SmartModal>
  );
}
