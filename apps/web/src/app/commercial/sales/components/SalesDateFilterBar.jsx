/**
 * @file SalesDateFilterBar.jsx
 * @module commercial/sales/components
 * @description Barra modular para filtrado por rango de fechas con atajos rápidos de periodo (SRP < 120 líneas).
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 */
import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';
import styles from '../sales.module.css';

export default function SalesDateFilterBar({ fechaInicio, fechaFin, onDateChange, onReset }) {
  const handleQuickPeriod = (type) => {
    const now = new Date();
    let start = '';
    let end = '';

    const formatYMD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (type === 'TODAY') {
      start = formatYMD(now);
      end = formatYMD(now);
    } else if (type === 'WEEK') {
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      start = formatYMD(monday);
      end = formatYMD(now);
    } else if (type === 'MONTH') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = formatYMD(firstDay);
      end = formatYMD(lastDay);
    } else if (type === 'PREV_MONTH') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      start = formatYMD(firstDay);
      end = formatYMD(lastDay);
    }

    onDateChange(start, end);
  };

  return (
    <div className={styles.dateFilterBar}>
      <div className={styles.dateFilterGroup}>
        <Calendar size={16} className={styles.dateFilterIcon} />
        <span className={styles.dateFilterLabel}>Filtrar Período:</span>
        <button type="button" onClick={() => handleQuickPeriod('TODAY')} className={styles.btnQuickFilter}>Hoy</button>
        <button type="button" onClick={() => handleQuickPeriod('WEEK')} className={styles.btnQuickFilter}>Esta Semana</button>
        <button type="button" onClick={() => handleQuickPeriod('MONTH')} className={styles.btnQuickFilter}>Este Mes</button>
        <button type="button" onClick={() => handleQuickPeriod('PREV_MONTH')} className={styles.btnQuickFilter}>Mes Anterior</button>
      </div>

      <div className={styles.dateInputsGroup}>
        <div className={styles.dateInputItem}>
          <label className={styles.dateInputLabel}>Desde</label>
          <input
            type="date"
            value={fechaInicio || ''}
            onChange={(e) => onDateChange(e.target.value, fechaFin)}
            className={styles.dateInputControl}
          />
        </div>
        <div className={styles.dateInputItem}>
          <label className={styles.dateInputLabel}>Hasta</label>
          <input
            type="date"
            value={fechaFin || ''}
            onChange={(e) => onDateChange(fechaInicio, e.target.value)}
            className={styles.dateInputControl}
          />
        </div>
        <button type="button" onClick={onReset} className={styles.btnResetFilter} title="Restablecer fechas y ver todo">
          <RotateCcw size={13} /> Ver Todo
        </button>
      </div>
    </div>
  );
}
