/**
 * @file ProductionOrderCompleteModal.jsx
 * @module operations/production/components
 * @description Modal para cerrar orden de producción, reportar consumo real de insumos y mermas.
 * @responsibility Presentar captura de producto terminado obtenido y desglose de insumos consumidos.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, @/components/ui/Button
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../production.module.css';

export default function ProductionOrderCompleteModal({
  completeModal,
  setCompleteModal,
  realDetails,
  setRealDetails,
  submitComplete
}) {
  if (!completeModal.open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Cerrar Orden y Liquidar Lote</h3>
        <p className={styles.modalSub}>Reporte de consumo real y mermas operativas.</p>
        
        <div className={styles.formGroup}>
          <label>Unidades Reales Obtenidas</label>
          <input 
            type="number" 
            min="0" 
            value={completeModal.realQty} 
            onChange={e => setCompleteModal({ ...completeModal, realQty: e.target.value })} 
            className={styles.input} 
          />
        </div>

        <h4 className={styles.consumoTitle}>Consumo de Insumos (Ajuste de Mermas)</h4>
        <table className={styles.bomTable}>
          <thead>
            <tr>
              <th>Insumo</th>
              <th className={styles.thRight}>Teórico</th>
              <th className={styles.thCenter}>Real Utilizado</th>
            </tr>
          </thead>
          <tbody>
            {completeModal.order?.detalles?.map((det) => (
              <tr key={det.id}>
                <td>ID: {det.idInsumo?.split('-')[0]}</td>
                <td className={styles.thRight}>{Number(det.cantidadTeorica).toFixed(2)} {det.unidad}</td>
                <td className={styles.thCenter}>
                  <input 
                    type="number" 
                    step="0.01"
                    value={realDetails[det.id] || ''} 
                    onChange={e => setRealDetails({ ...realDetails, [det.id]: e.target.value })}
                    className={styles.inputTableQty}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setCompleteModal({ open: false, order: null })}>Cancelar</Button>
          <Button variant="primary" onClick={submitComplete}>Cerrar y Costear Lote</Button>
        </div>
      </div>
    </div>
  );
}
