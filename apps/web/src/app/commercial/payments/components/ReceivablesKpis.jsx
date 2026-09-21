/**
 * @file ReceivablesKpis.jsx
 * @module commercial/payments/components
 * @description Tarjetas de métricas consolidadas de Cartera y Recaudos (SRP < 100 líneas).
 * @responsibility Renderizar 4 KPIs financieros respetando el Design System MANNÁ.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/lib/formatters, ../payments.module.css
 */
'use client';

import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../payments.module.css';

export default function ReceivablesKpis({ kpis = {} }) {
  const {
    carteraTotal = 0,
    totalCobrado = 0,
    clientesDeudores = 0,
    carteraVencida = 0
  } = kpis;

  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Cartera Pendiente</span>
        <strong className={styles.kpiValueAlert}>
          {formatCurrency(carteraTotal)}
        </strong>
        <span className={styles.kpiSub}>Saldo total por cobrar</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Recaudado</span>
        <strong className={styles.kpiValueSuccess}>
          {formatCurrency(totalCobrado)}
        </strong>
        <span className={styles.kpiSub}>Histórico cobrado efectivo</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Clientes Deudores</span>
        <strong className={styles.kpiValue}>
          {clientesDeudores}
        </strong>
        <span className={styles.kpiSub}>Cuentas con saldo activo</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Cartera Vencida</span>
        <strong className={carteraVencida > 0 ? styles.kpiValueDanger : styles.kpiValue}>
          {formatCurrency(carteraVencida)}
        </strong>
        <span className={styles.kpiSub}>
          {carteraVencida > 0 ? 'Excedió fecha de crédito' : 'Sin deudas en mora'}
        </span>
      </div>
    </div>
  );
}
