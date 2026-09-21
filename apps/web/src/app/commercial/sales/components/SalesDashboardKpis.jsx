/**
 * @file SalesDashboardKpis.jsx
 * @module commercial/sales/components
 * @description Dashboard superior de KPIs comerciales del mes actual (SRP < 120 líneas).
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 */
import React, { useMemo } from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sales.module.css';

export default function SalesDashboardKpis({ sales = [], allSales = [], mostrarCifras = false }) {
  const currentYear = new Date().getFullYear();

  const maskMoney = (valor) => mostrarCifras ? formatCurrency(valor) : '$ ••••••';
  const maskQty = (valor, suffix = '') => mostrarCifras ? `${valor.toLocaleString('es-CO')} ${suffix}`.trim() : `•• ${suffix}`.trim();

  const kpis = useMemo(() => {
    const totalVentas = (sales || []).reduce((sum, s) => sum + Number(s.totalVenta || 0), 0);
    const totalCosto = (sales || []).reduce((sum, s) => sum + Number(s.costoTotal || 0), 0);
    const gananciaReal = Math.max(0, totalVentas - totalCosto);
    const carteraCobrar = (sales || []).reduce((sum, s) => sum + Math.max(0, Number(s.saldoPendiente || 0)), 0);
    const unidadesDespachadas = (sales || []).reduce((sum, s) => {
      const itemsQty = (s.detalles || []).reduce((q, d) => q + Number(d.cantidad || 0), 0);
      return sum + itemsQty;
    }, 0);

    const yearSales = (allSales.length > 0 ? allSales : sales).filter(s => {
      if (!s.fechaVenta) return false;
      return new Date(s.fechaVenta).getFullYear() === currentYear;
    });

    const gananciaAnual = yearSales.reduce((sum, s) => {
      const vTotal = Number(s.totalVenta || 0);
      const cTotal = Number(s.costoTotal || 0);
      return sum + Math.max(0, vTotal - cTotal);
    }, 0);

    return { totalVentas, gananciaReal, carteraCobrar, unidadesDespachadas, gananciaAnual, count: (sales || []).length };
  }, [sales, allSales, currentYear]);

  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Ventas del Período ({kpis.count})</span>
        <strong className={styles.kpiValue}>{maskMoney(kpis.totalVentas)}</strong>
        <span className={styles.kpiSub}>{maskQty(kpis.unidadesDespachadas, 'unds despachadas')}</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Ganancia del Período</span>
        <strong className={styles.kpiValueProfit}>{maskMoney(kpis.gananciaReal)}</strong>
        <span className={styles.kpiSub}>Utilidad neta en rango</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Cartera por Cobrar</span>
        <strong className={kpis.carteraCobrar > 0 ? styles.kpiValueWarning : styles.kpiValue}>
          {maskMoney(kpis.carteraCobrar)}
        </strong>
        <span className={styles.kpiSub}>{kpis.carteraCobrar > 0 ? 'Créditos pendientes' : 'Cartera al día'}</span>
      </div>

      <div className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Ganancia Total Año {currentYear}</span>
        <strong className={styles.kpiValueProfit}>{maskMoney(kpis.gananciaAnual)}</strong>
        <span className={styles.kpiSub}>Acumulada {currentYear}</span>
      </div>
    </div>
  );
}
