/**
 * @file ExpensesFilters.jsx
 * @module commercial/expenses/components
 * @description Barra de filtros y rangos temporales para Gastos Operativos (SRP < 110 líneas).
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 */
'use client';

import React from 'react';
import styles from '../expenses.module.css';

const CATEGORY_TABS = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'COMPRAS', label: 'Compras' },
  { id: 'SERVICIOS_PUBLICOS', label: 'Servicios Públicos' },
  { id: 'NOMINA', label: 'Nómina' },
  { id: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { id: 'OTROS', label: 'Otros' }
];

const PERIOD_RANGES = [
  { id: 'TODOS', label: 'Todo el Histórico' },
  { id: 'HOY', label: 'Hoy' },
  { id: 'SEMANA', label: 'Esta Semana' },
  { id: 'MES', label: 'Este Mes' },
  { id: 'MES_ANTERIOR', label: 'Mes Anterior' }
];

export default function ExpensesFilters({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'TODOS',
  onCategoryChange,
  selectedPeriod = 'TODOS',
  onPeriodChange,
  onReset
}) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterRowTop}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por descripción, comprobante o categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.filterInputSearch}
          />
        </div>

        <div className={styles.tabsGroup}>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCategoryChange(tab.id)}
              className={selectedCategory === tab.id ? styles.tabActive : styles.tabInactive}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterRowBottom}>
        <div className={styles.periodGroup}>
          <span className={styles.periodLabel}>Período:</span>
          {PERIOD_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onPeriodChange(r.id)}
              className={selectedPeriod === r.id ? styles.btnPeriodActive : styles.btnPeriodInactive}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button type="button" onClick={onReset} className={styles.btnResetFilters}>
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
