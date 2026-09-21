/**
 * @file ExpensesKpis.jsx
 * @module commercial/expenses/components
 * @description Tarjetas de métricas consolidadas de Egresos y Gastos (SRP < 90 líneas).
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 */
'use client';

import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../expenses.module.css';

export default function ExpensesKpis({ items = [] }) {
  let totalEgresos = 0;
  let egresosCompras = 0;
  let gastosOperativos = 0;
  let gastosAdministrativos = 0;

  for (const item of items) {
    const val = Number(item.valor || 0);
    totalEgresos += val;
    const cat = String(item.categoria || '').toUpperCase();
    const tipo = String(item.tipoGasto || '').toUpperCase();

    if (cat === 'COMPRAS' || cat === 'MATERIA_PRIMA' || cat === 'INSUMOS') {
      egresosCompras += val;
    } else if (
      tipo === 'OPERATIVO' ||
      ['SERVICIOS_PUBLICOS', 'NOMINA', 'MANTENIMIENTO', 'ALQUILER', 'TRANSPORTE'].includes(cat)
    ) {
      gastosOperativos += val;
    } else {
      gastosAdministrativos += val;
    }
  }

  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Total Egresos</span>
        <strong className={styles.kpiValueHighlight}>{formatCurrency(totalEgresos)}</strong>
        <span className={styles.kpiSub}>Consolidado del período</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Egresos Compras / Insumos</span>
        <strong className={styles.kpiValue}>{formatCurrency(egresosCompras)}</strong>
        <span className={styles.kpiSub}>Adquisición de materia prima</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Gastos Operativos y Servicios</span>
        <strong className={styles.kpiValue}>{formatCurrency(gastosOperativos)}</strong>
        <span className={styles.kpiSub}>Luz, agua, arriendo, nómina planta</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Gastos Admin / Otros</span>
        <strong className={styles.kpiValue}>{formatCurrency(gastosAdministrativos)}</strong>
        <span className={styles.kpiSub}>Administración, ventas y finanzas</span>
      </div>
    </div>
  );
}
