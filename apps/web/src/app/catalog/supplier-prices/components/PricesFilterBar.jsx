/**
 * @file PricesFilterBar.jsx
 * @module catalog/supplier-prices/components
 * @description Barra de filtros con buscador predictivo y controles ergonómicos (< 110 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 */
'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import styles from '../supplier-prices.module.css';

export function PricesFilterBar({
  filterInsumo, setFilterInsumo,
  filterProveedor, setFilterProveedor,
  filterEstado, setFilterEstado,
  filterSort, setFilterSort,
  filterSearch, setFilterSearch,
  hasFilters, clearFilters,
  uniqueInsumos = [], uniqueProveedores = []
}) {
  const [insumoSearch, setInsumoSearch] = useState('');
  const [proveedorSearch, setProveedorSearch] = useState('');

  const filteredInsumoOptions = uniqueInsumos.filter(ins => {
    const name = ins.Nombre_Insumo || ins.nombre || '';
    return name.toLowerCase().includes(insumoSearch.toLowerCase());
  });

  const filteredProveedorOptions = uniqueProveedores.filter(prov => {
    const name = prov.Nombre_Proveedor || prov.nombre || '';
    return name.toLowerCase().includes(proveedorSearch.toLowerCase());
  });

  return (
    <div className={styles.filterBar}>
      {/* 1. Selector Insumo con filtro rápido */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Insumo</label>
        <div className={styles.searchableSelectWrapper}>
          <select
            className={styles.filterSelect}
            value={filterInsumo}
            onChange={e => setFilterInsumo(e.target.value)}
          >
            <option value="">Todos los insumos ({uniqueInsumos.length})</option>
            {filteredInsumoOptions.map(ins => (
              <option key={ins.id || ins.ID_Insumo} value={ins.id || ins.ID_Insumo}>
                {ins.Nombre_Insumo || ins.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Selector Proveedor con filtro rápido */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Proveedor</label>
        <div className={styles.searchableSelectWrapper}>
          <select
            className={styles.filterSelect}
            value={filterProveedor}
            onChange={e => setFilterProveedor(e.target.value)}
          >
            <option value="">Todos los proveedores ({uniqueProveedores.length})</option>
            {filteredProveedorOptions.map(prov => (
              <option key={prov.id || prov.ID_Proveedor} value={prov.id || prov.ID_Proveedor}>
                {prov.Nombre_Proveedor || prov.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Estado */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Estado</label>
        <select className={styles.filterSelect} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>
      </div>

      {/* 4. Orden */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Orden</label>
        <select className={styles.filterSelect} value={filterSort} onChange={e => setFilterSort(e.target.value)}>
          <option value="none">Por defecto</option>
          <option value="asc">Menor a mayor costo</option>
        </select>
      </div>

      {/* 5. Búsqueda de Texto en Presentación */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Búsqueda rápida</label>
        <div className={styles.searchInputWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.filterInputWithIcon} 
            placeholder="Buscar presentación..." 
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
          />
          {filterSearch && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setFilterSearch('')}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {hasFilters && (
        <button type="button" className={styles.btnClearFilters} onClick={clearFilters}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
