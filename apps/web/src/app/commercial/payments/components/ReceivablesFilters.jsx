/**
 * @file ReceivablesFilters.jsx
 * @module commercial/payments/components
 * @description Barra de filtros rápidos y búsqueda para Cartera (SRP < 110 líneas).
 * @responsibility Filtrar cartera por cliente, estado de vencimiento y rango de saldos.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, ../payments.module.css
 */
'use client';

import React from 'react';
import styles from '../payments.module.css';

const TABS = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'VENCIDO', label: 'Vencidos' },
  { id: 'POR_VENCER', label: 'Por Vencer' },
  { id: 'CON_ABONOS', label: 'Con Abonos' }
];

export default function ReceivablesFilters({
  filters,
  onChangeFilter,
  onResetFilters
}) {
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onChangeFilter(name, value);
  };

  const handleMontoChange = (name, rawVal) => {
    const clean = rawVal.replace(/\D/g, '');
    onChangeFilter(name, clean);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterRowTop}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            name="searchQuery"
            placeholder="Buscar por cliente..."
            value={filters.searchQuery ?? ''}
            onChange={handleTextChange}
            className={styles.filterInputSearch}
          />
        </div>

        <div className={styles.tabsGroup}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeFilter('estado', tab.id)}
              className={filters.estado === tab.id ? styles.tabActive : styles.tabInactive}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterRowBottom}>
        <div className={styles.rangeGroup}>
          <span className={styles.rangeLabel}>Saldo Pendiente:</span>
          <div className={styles.rangeInputs}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Monto Mín"
              value={filters.montoMin ? String(filters.montoMin).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
              onChange={(e) => handleMontoChange('montoMin', e.target.value)}
              className={styles.rangeInput}
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Monto Máx"
              value={filters.montoMax ? String(filters.montoMax).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
              onChange={(e) => handleMontoChange('montoMax', e.target.value)}
              className={styles.rangeInput}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className={styles.btnResetFilters}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
