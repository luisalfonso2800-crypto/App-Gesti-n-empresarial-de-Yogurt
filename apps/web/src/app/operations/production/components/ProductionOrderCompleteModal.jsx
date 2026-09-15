/**
 * @file ProductionOrderCompleteModal.jsx
 * @module operations/production/components
 * @description Modal homologado a Design System MANNÁ para liquidar orden de producción y calcular mermas reales.
 * @responsibility Presentar captura de producto terminado obtenido, comparativa de insumos y Poka-Yoke de liquidación.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, lucide-react, @/components/ui/SmartModal, ../production.module.css
 */
import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import styles from '../production.module.css';

export default function ProductionOrderCompleteModal({
  completeModal,
  setCompleteModal,
  realDetails,
  setRealDetails,
  submitComplete
}) {
  const order = completeModal.order;
  const unidadMedida = order?.receta?.unidadRendimiento || order?.receta?.unidadMedida || 'Litros';
  const nombreProducto = order?.receta?.nombre || order?.producto?.nombre || 'Producto Terminado';

  const handleClose = () => {
    setCompleteModal({ open: false, order: null, realQty: '' });
  };

  return (
    <SmartModal
      isOpen={Boolean(completeModal.open)}
      onClose={handleClose}
      title={`Finalizar y Liquidar: ${nombreProducto}`}
      isDirty={false}
      isSubmitting={false}
    >
      <div className={styles.modalPokaYokeBanner}>
        <CheckCircle2 size={18} />
        <span>
          Al liquidar, se descontarán los insumos de bodega y se ingresará el producto final a cava/tanque.
        </span>
      </div>

      <div className={styles.modalQtyRow}>
        <span className={styles.modalQtyLabel}>Volumen Real Obtenido ({unidadMedida}):</span>
        <div className={styles.modalQtyInputWrapper}>
          <input
            type="number"
            min="0"
            step="0.1"
            value={completeModal.realQty ?? ''}
            onChange={(e) => setCompleteModal({ ...completeModal, realQty: e.target.value })}
            className={styles.modalQtyInput}
            placeholder="0.0"
          />
          <span className={styles.infoGridLabel}>{unidadMedida}</span>
        </div>
      </div>

      <h4 className={styles.consumoTitle}>Consumo Real de Insumos vs Teórico</h4>
      <table className={styles.bomTable}>
        <thead>
          <tr>
            <th className={styles.colText}>Insumo / Material</th>
            <th className={styles.thRight}>Teórico</th>
            <th className={styles.thCenter}>Real Utilizado</th>
            <th className={styles.thRight}>Merma / Desviación</th>
          </tr>
        </thead>
        <tbody>
          {order?.detalles?.map((det) => {
            const teorico = Number(det.cantidadTeorica) || 0;
            const realVal = realDetails[det.id] !== undefined ? realDetails[det.id] : det.cantidadTeorica;
            const realNum = Number(realVal) || 0;
            const diff = realNum - teorico;
            const mermaPct = teorico > 0 ? ((diff / teorico) * 100).toFixed(1) : 0;
            const nombreInsumo = det.insumo?.nombre || det.productoIntermedio?.nombre || 'Insumo';

            return (
              <tr key={det.id}>
                <td className={styles.colText}>
                  <div className={styles.insumoName}>{nombreInsumo}</div>
                  <div className={styles.insumoSub}>Unidad: {det.unidad}</div>
                </td>
                <td className={styles.thRight}>
                  {teorico.toFixed(2)} {det.unidad}
                </td>
                <td className={styles.thCenter}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={realDetails[det.id] ?? ''}
                    onChange={(e) => setRealDetails({ ...realDetails, [det.id]: e.target.value })}
                    className={styles.inputTableQty}
                  />
                </td>
                <td className={styles.thRight}>
                  {diff > 0 ? (
                    <span className={styles.mermaDanger}>
                      +{diff.toFixed(2)} (+{mermaPct}%)
                    </span>
                  ) : diff < 0 ? (
                    <span className={styles.mermaSuccess}>
                      {diff.toFixed(2)} ({mermaPct}%)
                    </span>
                  ) : (
                    <span className={styles.infoGridLabel}>0.00 (0%)</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.modalActions}>
        <button
          type="button"
          className={styles.btnMannaSecondary}
          onClick={handleClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.btnMannaPrimary}
          onClick={submitComplete}
        >
          <CheckCircle2 size={16} className={styles.iconSpaced} /> Confirmar Liquidación y Entrada a Stock
        </button>
      </div>
    </SmartModal>
  );
}
