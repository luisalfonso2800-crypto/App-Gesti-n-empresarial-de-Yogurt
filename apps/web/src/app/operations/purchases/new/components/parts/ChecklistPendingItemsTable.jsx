/**
 * @file ChecklistPendingItemsTable.jsx
 * @module operations/purchases/new/parts
 * @description Tabla de insumos no conseguidos o pendientes de reintento durante la jornada de compra.
 * @responsibility Renderizado del listado de ítems pendientes y botón de reintento operativo.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
 * @dependencies React, @/components/ui/icons, ../../new-purchase.module.css
 */
import React from 'react';
import { ClockIcon, RotateCcwIcon } from '@/components/ui/icons';
import styles from '../../new-purchase.module.css';

export default function ChecklistPendingItemsTable({
  pendingItems,
  setPendingItems,
  setChecklistItems
}) {
  if (pendingItems.length === 0) return null;

  const handleReintentar = (idx, pi) => {
    const reactivatedItem = { ...pi };
    delete reactivatedItem.estadoOperativo;
    delete reactivatedItem.motivoNoConseguido;
    delete reactivatedItem.detalleMotivoNoConseguido;
    delete reactivatedItem.fechaRegistro;
    setChecklistItems(prev => [...prev, reactivatedItem]);
    setPendingItems(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className={`${styles.card} ${styles.pendingSection}`}>
      <div className={`${styles.cardTitle} ${styles.pendingSectionTitle}`}>
        <ClockIcon size={20} />
        Insumos Pendientes de Compra (No Conseguidos)
      </div>
      <div className={styles.tableResponsive}>
        <table className={`${styles.tablePending} ${styles.tableFullWidth}`}>
          <thead>
            <tr className={styles.pendingThRow}>
              <th className={styles.tableCellPad}>Insumo</th>
              <th className={styles.tableCellPad}>Proveedor / Presentación</th>
              <th className={styles.tableCellPad}>Motivo Registrado</th>
              <th className={styles.tableCellPad}>Estado</th>
              <th className={styles.tableCellCenter}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((pi, idx) => (
              <tr key={idx} className={styles.pendingTdRow}>
                <td className={styles.tableCellPad}>
                  <b>{pi.insumoData?.nombre || pi.nombre}</b><br/>
                  <span className={styles.itemCatSub}>{pi.insumoData?.categoria || pi.categoria}</span>
                </td>
                <td className={styles.tableCellPad}>
                  {pi.proveedorData?.nombre || pi.proveedorNombre || 'N/A'}<br/>
                  <span className={styles.itemCatSub}>{pi.priceData?.presentacionCompra || 'N/A'}</span>
                </td>
                <td className={styles.tableCellPad}>
                  <span className={styles.motivoTextBold}>{pi.motivoNoConseguido}</span>
                  {pi.detalleMotivoNoConseguido && <div className={styles.motivoDetalleSub}>{pi.detalleMotivoNoConseguido}</div>}
                </td>
                <td className={styles.tableCellPad}>
                  <span className={styles.badgePending}>Pendiente</span>
                </td>
                <td className={styles.tableCellCenter}>
                  <button
                    type="button"
                    className={styles.btnReintentar}
                    onClick={() => handleReintentar(idx, pi)}
                  >
                    <RotateCcwIcon size={16} /> Reintentar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
