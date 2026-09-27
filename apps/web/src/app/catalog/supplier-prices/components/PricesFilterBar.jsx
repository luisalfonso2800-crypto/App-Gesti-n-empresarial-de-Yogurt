/**
 * @file PricesFilterBar.jsx
 * @module catalog/supplier-prices/components
 * @description Barra de filtros en cadena dependiente (Proveedor -> Insumo -> Presentación) (SRP < 145 líneas).
 * @responsibility Conectar controles en cascada y permitir limpieza ágil.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies react, lucide-react, ../supplier-prices.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../supplier-prices.module.css';

export function PricesFilterBar({
  filterProveedor, setFilterProveedor,
  filterInsumo, setFilterInsumo,
  filterPresentacion, setFilterPresentacion,
  filterEstado, setFilterEstado,
  filterSort, setFilterSort,
  filterSearch, setFilterSearch,
  hasFilters, clearFilters,
  uniqueProveedores = [],
  availableInsumos = [],
  availablePresentaciones = []
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Proveedor</label>
        <select className={styles.filterSelect} value={filterProveedor} onChange={(e) => setFilterProveedor(e.target.value)} aria-label="Filtrar por proveedor">
          <option value="">Todos ({uniqueProveedores.length})</option>
          {uniqueProveedores.map((prov) => (
            <option key={prov.id || prov.ID_Proveedor} value={prov.id || prov.ID_Proveedor}>{prov.Nombre_Proveedor || prov.nombre}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Insumo / Materia Prima</label>
        <select className={styles.filterSelect} value={filterInsumo} onChange={(e) => setFilterInsumo(e.target.value)} aria-label="Filtrar por insumo">
          <option value="">{filterProveedor ? `Insumos cotizados (${availableInsumos.length})` : `Todos (${availableInsumos.length})`}</option>
          {availableInsumos.map((ins) => (
            <option key={ins.id || ins.ID_Insumo} value={ins.id || ins.ID_Insumo}>{ins.Nombre_Insumo || ins.nombre}</option>
          ))}
        </select>
      </div>

      {/* 3. Presentación (Cadena) */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>3. Presentación Compra</label>
        <select
          className={styles.filterSelect}
          value={filterPresentacion}
          onChange={(e) => setFilterPresentacion && setFilterPresentacion(e.target.value)}
          disabled={availablePresentaciones.length === 0}
          aria-label="Filtrar por presentación de compra"
        >
          <option value="">
            {availablePresentaciones.length === 0 ? 'Todas' : `Formato (${availablePresentaciones.length})`}
          </option>
          {availablePresentaciones.map((pres) => (
            <option key={pres} value={pres}>{pres}</option>
          ))}
        </select>
      </div>

      {/* 4. Estado */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>4. Estado</label>
        <select 
          className={styles.filterSelect} 
          value={filterEstado} 
          onChange={(e) => setFilterEstado(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>
      </div>

      {/* 5. Comparativa */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>5. Comparativa</label>
        <select 
          className={styles.filterSelect} 
          value={filterSort} 
          onChange={(e) => setFilterSort(e.target.value)}
          aria-label="Ordenar cotizaciones"
        >
          <option value="none">Por defecto</option>
          <option value="asc">★ Menor costo base</option>
          <option value="desc">Mayor costo base</option>
        </select>
      </div>

      {/* 6. Búsqueda Rápida */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Búsqueda rápida</label>
        <div className={styles.searchInputWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.filterInputWithIcon} 
            placeholder="Insumo, proveedor..." 
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label="Búsqueda rápida"
          />
          {filterSearch && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setFilterSearch('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

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
