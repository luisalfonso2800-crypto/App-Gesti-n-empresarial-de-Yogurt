/**
 * @file LotsFilterBar.jsx
 * @module operations/lots/components
 * @description Barra de filtros multicriterio con botón X individual y separador vertical (SRP < 140 líneas).
 * @responsibility Filtrar lotes por búsqueda de texto, tipo/linaje, estado y reseteo.
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies react, lucide-react, ../lots.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../lots.module.css';

export function LotsFilterBar({
  filterSearch, setFilterSearch,
  filterType, setFilterType,
  filterStatus, setFilterStatus,
  hasFilters, clearFilters
}) {
  return (
    <div className={styles.filterBar} role="region" aria-label="Filtros de Lotes">
      {/* 1. Tipo / Naturaleza de Lote */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Tipo de Lote</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterType !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filtrar por tipo de lote"
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="TERMINADO">📦 Producto Terminado</option>
            <option value="SEMIELABORADO_WIP">🧫 Cepa / Semielaborado WIP</option>
          </select>
          {filterType !== 'TODOS' && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterType('TODOS')}
              title="Limpiar tipo de lote"
              aria-label="Limpiar tipo de lote"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Estado FEFO / Vencimiento */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Estado FEFO</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterStatus !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filtrar por estado FEFO"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="OPTIMO">🟢 Óptimo (&gt; 15 días)</option>
            <option value="WARNING">🟡 Próximo a Vencer (&le; 15 días)</option>
            <option value="DANGER">🔴 Vencido</option>
          </select>
          {filterStatus !== 'TODOS' && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterStatus('TODOS')}
              title="Limpiar estado FEFO"
              aria-label="Limpiar estado FEFO"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Búsqueda Rápida */}
      <div className={styles.filterGroupSearch}>
        <label className={styles.filterLabel}>3. Búsqueda Rápida</label>
        <div className={styles.searchInputWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.filterInputWithIcon}
            placeholder="Buscar por lote, ID o producto..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label="Buscar por lote o producto"
          />
          {filterSearch && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setFilterSearch('')}
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Reset Global de Filtros */}
      {hasFilters && (
        <div className={styles.filterResetWrapper}>
          <button
            type="button"
            className={styles.btnClearFilters}
            onClick={clearFilters}
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={13} /> Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
