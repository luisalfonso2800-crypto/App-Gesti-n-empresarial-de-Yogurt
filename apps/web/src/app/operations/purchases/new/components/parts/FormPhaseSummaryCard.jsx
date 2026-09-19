/**
 * @file FormPhaseSummaryCard.jsx
 * @module operations/purchases/new/parts
 * @description Tarjeta final de consolidación financiera de la orden de compra.
 * @responsibility Conteo de ítems, suma de flete global, total acumulado y desglose en letras.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, @/utils/numberToWords, ../../new-purchase.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import styles from '../../new-purchase.module.css';

export default function FormPhaseSummaryCard({
  detallesCount,
  flete,
  totalSinIvaCompra,
  totalIvaCompra,
  totalConFlete
}) {
  if (detallesCount === 0) return null;

  const fleteNum = parseInt(String(flete).replace(/\D/g, ''), 10) || 0;

  return (
    <div className={styles.finalPurchaseSummaryCard}>
      <div className={styles.finalSummaryLeft}>
        <span>Ítems registrados: <strong className={styles.finalSummaryDarkVal}>{detallesCount}</strong></span>
        <span>Condición: <strong className={styles.finalSummaryDarkVal}>CONTADO</strong></span>
      </div>

      <div className={styles.finalSummaryRight}>
        <div className={styles.finalBreakdownRow}>
          <span className={styles.finalBreakdownLabel}>Subtotal Base (Sin IVA):</span>
          <span className={styles.finalBreakdownVal}>${(totalSinIvaCompra || 0).toLocaleString('es-CO')}</span>
        </div>

        <div className={styles.finalBreakdownRow}>
          <span className={styles.finalBreakdownLabel}>IVA Consolidado:</span>
          <span className={styles.finalBreakdownVal}>${(totalIvaCompra || 0).toLocaleString('es-CO')}</span>
        </div>

        {fleteNum > 0 && (
          <div className={styles.finalBreakdownRow}>
            <span className={styles.finalBreakdownLabel}>Flete Global:</span>
            <span className={styles.finalBreakdownVal}>${fleteNum.toLocaleString('es-CO')}</span>
          </div>
        )}

        <div className={styles.finalTotalRow}>
          <span className={styles.finalTotalLabel}>TOTAL COMPRA A PAGAR:</span>
          <strong className={styles.finalTotalValue}>
            ${totalConFlete.toLocaleString('es-CO')}
          </strong>
        </div>
        {totalConFlete > 0 && (
          <div className={styles.finalTotalWords}>
            ✦ {montoATextoPesos(totalConFlete)}
          </div>
        )}
      </div>
    </div>
  );
}
