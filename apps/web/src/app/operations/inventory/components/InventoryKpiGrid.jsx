/**
 * @file InventoryKpiGrid.jsx
 * @module operations/inventory/components
 * @description Indicadores KPI superiores para valoración de existencias, agotados y bajo mínimo.
 * @responsibility Renderizar las tarjetas de métricas de bodega con clases de CSS Modules.
 * @usedBy apps/web/src/app/operations/inventory/page.jsx
 * @dependencies react, lucide-react
 */
import React from 'react';
import { DollarSign, AlertCircle, TrendingDown } from 'lucide-react';
import styles from '../inventory.module.css';

export default function InventoryKpiGrid({ metadata }) {
  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <div className={`${styles.kpiIconWrapper} ${styles.kpiIconValor}`}>
          <DollarSign size={24} />
        </div>
        <div>
          <p className={styles.kpiLabel}>Valor en Bodega</p>
          <h3 className={styles.kpiValue}>
            ${Number(metadata.valorTotalBodega).toLocaleString('es-CO')}
          </h3>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={`${styles.kpiIconWrapper} ${styles.kpiIconAgotados}`}>
          <AlertCircle size={24} />
        </div>
        <div>
          <p className={styles.kpiLabel}>Agotados</p>
          <h3 className={styles.kpiValue}>
            {metadata.totalCriticos} refs
          </h3>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={`${styles.kpiIconWrapper} ${styles.kpiIconBajoMinimo}`}>
          <TrendingDown size={24} />
        </div>
        <div>
          <p className={styles.kpiLabel}>Bajo Mínimo</p>
          <h3 className={styles.kpiValue}>
            {metadata.totalBajoMinimo} refs
          </h3>
        </div>
      </div>
    </div>
  );
}
