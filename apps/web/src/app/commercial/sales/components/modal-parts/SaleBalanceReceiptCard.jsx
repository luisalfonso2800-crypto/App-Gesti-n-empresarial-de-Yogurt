/**
 * @file SaleBalanceReceiptCard.jsx
 * @module commercial/sales/components/modal-parts
 * @description Tarjeta moderna y limpia MANNÁ para resumen de liquidación financiera y margen bruto proyectado (SRP < 150 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 */
import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

export default function SaleBalanceReceiptCard({ detalles, totalVenta, utilidadTotal }) {
  if (!detalles || detalles.length === 0) return null;

  const totalItems = detalles.reduce((sum, d) => sum + Number(d.cantidad || 0), 0);

  return (
    <div className={styles.settlementReceiptCard}>
      <div className={styles.settlementHeader}>
        <FileText size={16} /> Resumen de Liquidación
      </div>

      <div className={styles.settlementRow}>
        <span>Subtotal ({totalItems} ítem{totalItems !== 1 ? 's' : ''})</span>
        <span>{formatCurrency(totalVenta)}</span>
      </div>

      <div className={styles.settlementDivider} />

      <div className={styles.settlementTotalRow}>
        <span className={styles.settlementTotalLabel}>Total a Despachar / Cobrar</span>
        <span className={styles.settlementTotalAmount}>{formatCurrency(totalVenta)}</span>
      </div>

      {utilidadTotal > 0 && (
        <span className={styles.settlementMarginBadge}>
          <Sparkles size={12} /> Margen Bruto Proyectado: {formatCurrency(utilidadTotal)}
        </span>
      )}
    </div>
  );
}
