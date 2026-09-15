/**
 * @file ProductionFinancialSummary.jsx
 * @module operations/production/components
 * @description Barra de KPIs financieros y operativos en vivo para la planificación de producción.
 * @responsibility Renderizar cuadrícula con costo total, unitario, tiempo estimado de proceso y lote sugerido.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx
 * @dependencies react, @/lib/formatters, ./production-financial-summary.module.css
 */

import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from './production-financial-summary.module.css';

export function ProductionFinancialSummary({
  costoTotal = 0,
  costoUnitario = 0,
  unidad = 'L',
  tiempoProceso = '⏱ Sin estimar',
  loteSugerido = 'LOT-PENDIENTE'
}) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <span className={styles.cardLabel}>Costo Total Estimado</span>
        <strong className={styles.cardValuePrimary}>
          {formatCurrency(costoTotal) || '$ 0'}
        </strong>
        <span className={styles.cardHelper}>Valor proyectado del lote</span>
      </div>

      <div className={styles.summaryCard}>
        <span className={styles.cardLabel}>Costo Unitario Proyectado</span>
        <strong className={styles.cardValue}>
          {formatCurrency(costoUnitario) || '$ 0'} <span className={styles.unitSpan}>COP / {unidad}</span>
        </strong>
        <span className={styles.cardHelper}>Por unidad fabricada</span>
      </div>

      <div className={styles.summaryCard}>
        <span className={styles.cardLabel}>Tiempo de Proceso</span>
        <strong className={styles.cardValueTime}>{tiempoProceso}</strong>
        <span className={styles.cardHelper}>Sumatoria etapas estándar</span>
      </div>

      <div className={styles.summaryCard}>
        <span className={styles.cardLabel}>Lote Sugerido</span>
        <strong className={styles.cardValueLot}>{loteSugerido}</strong>
        <span className={styles.cardHelper}>Trazabilidad correlativa</span>
      </div>
    </div>
  );
}
