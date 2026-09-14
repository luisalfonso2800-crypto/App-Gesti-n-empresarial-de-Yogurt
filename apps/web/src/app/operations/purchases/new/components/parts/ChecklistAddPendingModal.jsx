/**
 * @file ChecklistAddPendingModal.jsx
 * @module operations/purchases/new/parts
 * @description Modal para registrar rápidamente un requerimiento o insumo pendiente de compra sin datos comerciales.
 * @responsibility Formulario de nombre y cantidad estimada, agregado a lista de pendientes manuales.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function ChecklistAddPendingModal({
  isOpen,
  onClose,
  pendingForm,
  setPendingForm,
  handleAddPending
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>Añadir Pendiente a la Lista</div>
        <p className={styles.addPendingModalSub}>
          Registra un insumo o requerimiento pendiente sin datos comerciales para incluirlo en el checklist imprimible.
        </p>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre del Insumo / Requerimiento *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ej: Azúcar morena, Empaques plásticos..."
            value={pendingForm.nombre}
            onChange={e => setPendingForm(prev => ({ ...prev, nombre: e.target.value }))}
            autoFocus
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cantidad Estimada</label>
          <input
            type="number"
            className={styles.input}
            placeholder="Ej: 10"
            min="0"
            step="any"
            value={pendingForm.cantidad}
            onChange={e => setPendingForm(prev => ({ ...prev, cantidad: e.target.value }))}
          />
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button type="button" className={styles.saveBtn} onClick={handleAddPending} disabled={!pendingForm.nombre.trim()}>
            Añadir al Checklist
          </button>
        </div>
      </div>
    </div>
  );
}
