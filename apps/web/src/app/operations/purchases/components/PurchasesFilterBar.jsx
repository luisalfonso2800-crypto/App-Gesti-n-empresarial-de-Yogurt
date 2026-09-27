/**
 * @file PurchasesFilterBar.jsx
 * @module operations/purchases/components
 * @description Barra de filtros multicriterio para compras con botón X individual y separador vertical (SRP < 140 líneas).
 * @responsibility Filtrado por búsqueda de texto, proveedor, estado de lista y botón de reseteo.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, lucide-react, ../purchases.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../purchases.module.css';

export function PurchasesFilterBar({
  filterSearch, setFilterSearch,
  filterSupplier, setFilterSupplier,
  filterStatus, setFilterStatus,
  suppliers = [],
  hasFilters, clearFilters
}) {
  return (
    <div className={styles.filterBar} role="region" aria-label="Filtros de Historial de Compras">
      {/* 1. Proveedor */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Proveedor</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterSupplier ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            aria-label="Filtrar por proveedor"
          >
            <option value="">Todos ({suppliers.length})</option>
            {suppliers.map((sup, idx) => (
              <option key={`${sup.id || sup.nombre}-${idx}`} value={sup.nombre}>
                {sup.nombre}
              </option>
            ))}
          </select>
          {filterSupplier && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterSupplier('')}
              title="Limpiar proveedor"
              aria-label="Limpiar proveedor"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Estado de Compra */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Estado</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterStatus !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="TODOS">Todos</option>
            <option value="COMPLETADA">🟢 Completadas</option>
            <option value="PARCIAL">🟡 En Ruta / Parciales</option>
          </select>
          {filterStatus !== 'TODOS' && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterStatus('TODOS')}
              title="Limpiar estado"
              aria-label="Limpiar estado"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Búsqueda Rápida */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Búsqueda rápida</label>
        <div className={styles.searchInputWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.filterInputWithIcon}
            placeholder="Código orden, insumo, proveedor..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label="Búsqueda rápida de compras"
          />
          {filterSearch && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setFilterSearch('')}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Botón Restablecer */}
      {hasFilters && (
        <div className={styles.filterResetWrapper}>
          <button
            type="button"
            className={styles.btnClearFilters}
            onClick={clearFilters}
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={13} />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
}
