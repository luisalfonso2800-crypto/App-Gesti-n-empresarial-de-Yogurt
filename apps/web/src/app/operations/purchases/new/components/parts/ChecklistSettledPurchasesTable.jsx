/**
 * @file ChecklistSettledPurchasesTable.jsx
 * @module operations/purchases/new/parts
 * @description Resumen de compras ya asentadas en base de datos durante la sesión de compras.
 * @responsibility Presentación tabular de compras confirmadas y acción para cerrar el resumen.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function ChecklistSettledPurchasesTable({
  comprasAsentadas,
  setComprasAsentadas
}) {
  if (comprasAsentadas.length === 0) return null;

  return (
    <div className={`${styles.card} ${styles.settledSummaryCard}`}>
      <div className={`${styles.cardTitle} ${styles.settledSummaryTitle}`}>Resumen de Compras Asentadas en Sesión</div>
      <div className={styles.tableResponsive}>
        <table className={styles.tableFullWidth}>
          <thead>
            <tr className={styles.settledThRow}>
              <th className={styles.tableCellPad}>Insumo</th>
              <th className={styles.tableCellPad}>Proveedor</th>
              <th className={styles.tableCellPad}>Marca</th>
              <th className={styles.tableCellPad}>Cant. Empaques</th>
              <th className={styles.tableCellPad}>Neto a Bodega</th>
              <th className={styles.tableCellPad}>Costo Base</th>
              <th className={styles.tableCellPad}>Subtotal Pagado</th>
            </tr>
          </thead>
          <tbody>
            {comprasAsentadas.map((c, i) => (
              <tr key={i} className={styles.settledTdRow}>
                <td className={styles.tableCellPad}>{c.insumoData?.nombre || c.nombre}</td>
                <td className={styles.tableCellPad}>{c.provNombre || 'N/A'}</td>
                <td className={styles.tableCellPad}>{c.marca}</td>
                <td className={styles.tableCellPad}>{c.empaques}</td>
                <td className={styles.tableCellPad}>{c.cantidadBaseTotal?.toFixed(2)} {c.unidadEmpaque}</td>
                <td className={styles.tableCellPad}>${c.costoBase?.toFixed(2)}</td>
                <td className={styles.tableCellPad}>${c.subtotal?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.settledActionsRow}>
        <button 
          type="button" 
          className={`${styles.submitBtn} ${styles.btnActionAuto} ${styles.btnBlue}`}
          onClick={() => setComprasAsentadas([])}
        >
          Cerrar Resumen
        </button>
      </div>
    </div>
  );
}
