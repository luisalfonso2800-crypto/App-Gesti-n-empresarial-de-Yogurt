/**
 * @file GoalsFilterBar.jsx
 * @module commercial/goals/components
 * @description Barra de filtros multicriterio con botón X individual y separador vertical (SRP < 140 líneas).
 * @responsibility Filtrar metas por ámbito (Personal/Empresarial), estado botánico y búsqueda de texto.
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies react, lucide-react, ../goals.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../goals.module.css';

export function GoalsFilterBar({
  filterSearch, setFilterSearch,
  filterAmbito, setFilterAmbito,
  filterBotanico, setFilterBotanico,
  hasFilters, clearFilters
}) {
  return (
    <div className={styles.filterBar} role="region" aria-label="Filtros de Metas y Sueños">
      {/* 1. Ámbito de Meta */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Ámbito</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterAmbito !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterAmbito}
            onChange={(e) => setFilterAmbito(e.target.value)}
            aria-label="Filtrar por ámbito"
          >
            <option value="TODOS">Todos los ámbitos</option>
            <option value="PERSONAL_FAMILIAR">🏡 Sueño Personal / Familiar</option>
            <option value="EMPRESARIAL">🏭 Objetivo Empresarial</option>
          </select>
          {filterAmbito !== 'TODOS' && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterAmbito('TODOS')}
              title="Limpiar ámbito"
              aria-label="Limpiar ámbito"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Estado Botánico */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Estado Botánico</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterBotanico !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterBotanico}
            onChange={(e) => setFilterBotanico(e.target.value)}
            aria-label="Filtrar por estado botánico"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="SEMILLA">🌱 Semilla (0-25%)</option>
            <option value="EN_CRECIMIENTO">🌿 En Crecimiento (26-70%)</option>
            <option value="FLORACION">🌸 Floración (71-99%)</option>
            <option value="COSECHADA">🍇 Cosechada (100%)</option>
          </select>
          {filterBotanico !== 'TODOS' && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterBotanico('TODOS')}
              title="Limpiar estado botánico"
              aria-label="Limpiar estado botánico"
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
            placeholder="Buscar por título, propósito o descripción..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label="Buscar metas"
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
