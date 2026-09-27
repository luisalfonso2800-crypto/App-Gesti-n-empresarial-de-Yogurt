/**
 * @file ProductsFilterBar.jsx
 * @module catalog/products/components
 * @description Barra de filtros multicriterio en cadena para productos con botón X individual y separador (SRP < 150 líneas).
 * @responsibility Filtrado por búsqueda, categoría, presentación dependiente, canal, estado y reseteo.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies react, lucide-react, ../products.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../products.module.css';

const CATEGORIES = [
  { value: 'LACTEOS', label: 'Lácteos Terminados' },
  { value: 'BASES_LACTEAS', label: 'Bases Lácteas (WIP)' },
  { value: 'DULCES_JALEAS', label: 'Dulces y Jaleas' },
  { value: 'TOPPING_CEREAL', label: 'Topping / Cereal (WIP)' },
  { value: 'INSUMO_BASE_WIP', label: 'Premezcla Planta (WIP)' },
  { value: 'POSTRES', label: 'Postres y Otros' },
  { value: 'BEBIDAS', label: 'Bebidas' }
];

export function ProductsFilterBar({
  filterSearch, setFilterSearch,
  filterCategory, setFilterCategory,
  filterPresentation, setFilterPresentation,
  channelFilter, onChannelChange,
  filterStatus, setFilterStatus,
  availablePresentations = [],
  hasFilters, clearFilters
}) {
  return (
    <div className={styles.filterBar} role="region" aria-label="Filtros de Catálogo de Productos">
      {/* 1. Categoría */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Categoría</label>
        <div className={styles.filterSelectWrapper}>
          <select className={filterCategory ? styles.filterSelectWithClear : styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas ({CATEGORIES.length})</option>
            {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
          {filterCategory && (
            <button type="button" className={styles.clearFilterBtn} onClick={() => setFilterCategory('')} title="Limpiar categoría" aria-label="Limpiar categoría"><X size={13} /></button>
          )}
        </div>
      </div>

      {/* 2. Presentación (En cadena) */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Presentación</label>
        <div className={styles.filterSelectWrapper}>
          <select className={filterPresentation ? styles.filterSelectWithClear : styles.filterSelect} value={filterPresentation} onChange={(e) => setFilterPresentation(e.target.value)} disabled={availablePresentations.length === 0} aria-label="Filtrar por presentación">
            <option value="">{filterCategory ? `Formatos (${availablePresentations.length})` : 'Todas'}</option>
            {availablePresentations.map((p) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
          </select>
          {filterPresentation && (
            <button type="button" className={styles.clearFilterBtn} onClick={() => setFilterPresentation('')} title="Limpiar presentación" aria-label="Limpiar presentación"><X size={13} /></button>
          )}
        </div>
      </div>

      {/* 3. Canal de Venta */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>3. Canal</label>
        <div className={styles.filterSelectWrapper}>
          <select className={channelFilter !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect} value={channelFilter} onChange={(e) => onChannelChange(e.target.value)} aria-label="Filtrar por canal">
            <option value="TODOS">Todos</option>
            <option value="COMERCIAL">Comercial (Venta)</option>
            <option value="WIP">Bases de Planta (WIP)</option>
          </select>
          {channelFilter !== 'TODOS' && (
            <button type="button" className={styles.clearFilterBtn} onClick={() => onChannelChange('TODOS')} title="Limpiar canal" aria-label="Limpiar canal"><X size={13} /></button>
          )}
        </div>
      </div>

      {/* 4. Estado de Ficha */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>4. Estado Ficha</label>
        <div className={styles.filterSelectWrapper}>
          <select className={filterStatus !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filtrar por estado de ficha">
            <option value="TODOS">Todos</option>
            <option value="LISTO">🟢 Listo para Venta</option>
            <option value="INCOMPLETO">🟡 Incompleto (Sin precio/envase)</option>
            <option value="DESACTIVADO">🔴 Desactivado</option>
          </select>
          {filterStatus !== 'TODOS' && (
            <button type="button" className={styles.clearFilterBtn} onClick={() => setFilterStatus('TODOS')} title="Limpiar estado" aria-label="Limpiar estado"><X size={13} /></button>
          )}
        </div>
      </div>

      {/* 5. Búsqueda Rápida */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Búsqueda rápida</label>
        <div className={styles.searchInputWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input type="text" className={styles.filterInputWithIcon} placeholder="Nombre, código, SKU..." value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} aria-label="Búsqueda rápida de productos" />
          {filterSearch && (
            <button type="button" className={styles.clearSearchBtn} onClick={() => setFilterSearch('')} aria-label="Limpiar búsqueda" title="Limpiar texto"><X size={12} /></button>
          )}
        </div>
      </div>

      {/* 6. Botón Restablecer */}
      {hasFilters && (
        <div className={styles.filterResetWrapper}>
          <button type="button" className={styles.btnClearFilters} onClick={clearFilters} title="Restablecer todos los filtros">
            <RotateCcw size={13} />
            <span>Limpiar todos</span>
          </button>
        </div>
      )}
    </div>
  );
}
