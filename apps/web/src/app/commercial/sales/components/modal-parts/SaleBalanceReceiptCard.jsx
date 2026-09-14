/**
 * @file SaleBalanceReceiptCard.jsx
 * @module commercial/sales/components/modal-parts
 * @description Tarjeta de previsualización tipo ticket con balance previo de venta y margen bruto estimado.
 * @responsibility Renderizar desglose de costos, subtotal general y margen proyectado de la venta actual.
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 * @dependencies react, lucide-react, @/lib/formatters
 */
import React from 'react';
import { Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

export default function SaleBalanceReceiptCard({ detalles, totalVenta, utilidadTotal }) {
  if (!detalles || detalles.length === 0) return null;

  return (
    <div className={styles.balanceReceiptCard}>
      <h4 className={styles.balanceReceiptTitle}>
        <Receipt size={20} /> BALANCE PREVIO
      </h4>

      <div className={styles.balanceReceiptItemsList}>
        {detalles.map((d, i) => (
          <div key={i} className={styles.balanceReceiptItemRow}>
            <span>{d.cantidad}x {d.nombre}</span>
            <span className={styles.balanceReceiptCostEst}>
              Costo Est: {formatCurrency(d.costoUnitario * d.cantidad)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.balanceReceiptSummaryBox}>
        <div className={styles.balanceReceiptSubtotalRow}>
          <span>Subtotal Venta:</span>
          <strong>{formatCurrency(totalVenta)}</strong>
        </div>
        <div className={styles.balanceReceiptMarginRow}>
          <span>Margen Bruto Estimado:</span>
          <strong className={utilidadTotal > 0 ? styles.marginGainPositive : styles.marginGainNegative}>
            {formatCurrency(utilidadTotal)}
          </strong>
        </div>
      </div>
    </div>
  );
}
