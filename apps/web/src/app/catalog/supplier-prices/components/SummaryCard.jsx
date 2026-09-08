/**
 * @file SummaryCard.jsx
 * @module catalog/supplier-prices/components
 * @description Muestra un resumen de ahorro y comparativa de opciones del insumo seleccionado.
 * @responsibility Renderizar los datos agregados y ahorros.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies styles local
 */
import React from 'react';
import styles from '../supplier-prices.module.css';

export function SummaryCard({ summaryCard }) {
  if (!summaryCard) return null;

  return (
    <div className={styles.summaryCard}>
      <h3 className={styles.summaryTitle}>Resumen de Aprovisionamiento</h3>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Opciones Disponibles</span>
          <span className={styles.summaryValue}>{summaryCard.optionsCount}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Mejor Tarifa (Costo Base)</span>
          <span className={styles.summaryValueSuccess}>${summaryCard.minItem.costoUnidadBase} - {summaryCard.minItem.proveedor?.Nombre_Proveedor || summaryCard.minItem.proveedor?.nombre || 'Proveedor'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Ahorro vs Tarifa Alta</span>
          <span className={styles.summaryValueInfo}>{summaryCard.savingsPercent}%</span>
        </div>
      </div>
    </div>
  );
}
