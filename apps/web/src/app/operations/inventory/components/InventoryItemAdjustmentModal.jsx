/**
 * @file InventoryItemAdjustmentModal.jsx
 * @module operations/inventory/components
 * @description Modal rápido para ajuste positivo, negativo o merma sobre un ítem específico de inventario.
 * @responsibility Presentar el diálogo de ajuste manual con validación de motivo y selector de tipo.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, @/components/ui/Button
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../inventory.module.css';

export default function InventoryItemAdjustmentModal({
  adjustmentModal,
  setAdjustmentModal,
  activeTab,
  submitAdjustment
}) {
  if (!adjustmentModal.open) return null;

  const itemName = activeTab === 'INSUMOS' 
    ? adjustmentModal.item?.insumo?.nombre 
    : adjustmentModal.item?.producto?.nombre;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Ajuste Manual de Inventario</h3>
        <p className={styles.modalSub}>
          {itemName}
        </p>

        <div className={styles.formGroup}>
          <label>Tipo de Ajuste</label>
          <select 
            className={styles.input} 
            value={adjustmentModal.tipo} 
            onChange={(e) => setAdjustmentModal(prev => ({ ...prev, tipo: e.target.value }))}
          >
            <option value="AJUSTE_POSITIVO">Ajuste Positivo (+)</option>
            <option value="AJUSTE_NEGATIVO">Ajuste Negativo (-)</option>
            <option value="MERMA_DESPERDICIO">Merma / Desperdicio (-)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input 
            type="number" 
            className={styles.input} 
            placeholder="0" 
            value={adjustmentModal.cantidad} 
            onChange={(e) => setAdjustmentModal(prev => ({ ...prev, cantidad: e.target.value }))} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Motivo</label>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Ej: Conteo físico, vencimiento, daño" 
            value={adjustmentModal.motivo} 
            onChange={(e) => setAdjustmentModal(prev => ({ ...prev, motivo: e.target.value }))} 
          />
        </div>

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setAdjustmentModal({ open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' })}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={submitAdjustment}>
            Guardar Ajuste
          </Button>
        </div>
      </div>
    </div>
  );
}
