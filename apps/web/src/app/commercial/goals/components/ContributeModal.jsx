'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../goals.module.css';

/**
 * @file ContributeModal.jsx
 * @description Modal de alcancía para aportar dinero real a un sueño personal (< 110 líneas).
 */
export function ContributeModal({ isOpen, onClose, goal, onSuccess }) {
  const [monto, setMonto] = useState('');
  const [nota, setNota] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const falta = Math.max(0, (goal.valorObjetivo || 0) - (goal.valorActual || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numMonto = Number(monto);
    if (!numMonto || numMonto <= 0) return;

    setIsSubmitting(true);
    try {
      await onSuccess(goal.id, { monto: numMonto, nota });
      setMonto('');
      setNota('');
      onClose();
    } catch (err) {
      console.error('Error aportando a la meta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>🏺 Sembrar Fondos a la Alcancía</h2>
          <button type="button" className={styles.closeModalBtn} onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.contributeGoalSummary}>
            <p className={styles.contributeGoalTitle}>{goal.titulo}</p>
            <div className={styles.contributeBalanceRow}>
              <span>Falta para cumplir:</span>
              <strong className={styles.contributeFaltaValue}>{formatCurrency(falta)}</strong>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Monto a Sembrar ($ COP)</label>
            <input
              type="number"
              min="1"
              step="100"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej. 150000"
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nota de Cosecha / Procedencia (Opcional)</label>
            <input
              type="text"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. Ganancia de feria dominical"
              className={styles.formInput}
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Sembrando...' : 'Confirmar Aporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
