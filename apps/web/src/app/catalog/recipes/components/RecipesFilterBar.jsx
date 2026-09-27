/**
 * @file RecipesFilterBar.jsx
 * @module catalog/recipes/components
 * @description Barra de filtros multicriterio con botón X individual y separador vertical (SRP < 140 líneas).
 * @responsibility Filtrado por búsqueda de texto, producto asociado, estado de receta y reseteo.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies react, lucide-react, ../recipes.module.css
 */
'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from '../recipes.module.css';

export function RecipesFilterBar({
  filterSearch, setFilterSearch,
  filterProduct, setFilterProduct,
  filterStatus, setFilterStatus,
  products = [],
  hasFilters, clearFilters
}) {
  return (
    <div className={styles.filterBar} role="region" aria-label="Filtros de Catálogo de Recetas">
      {/* 1. Producto Asociado */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>1. Producto Asociado</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterProduct ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            aria-label="Filtrar por producto"
          >
            <option value="">Todos los productos ({products.length})</option>
            {products.map((prod, idx) => (
              <option key={`${prod.id || prod.idItem || idx}-${idx}`} value={prod.id || prod.idItem}>
                {prod.nombre} {prod.presentacion?.nombre ? `(${prod.presentacion.nombre})` : ''}
              </option>
            ))}
          </select>
          {filterProduct && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => setFilterProduct('')}
              title="Limpiar filtro de producto"
              aria-label="Limpiar filtro de producto"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Estado de Receta */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>2. Disponibilidad</label>
        <div className={styles.filterSelectWrapper}>
          <select
            className={filterStatus !== 'TODOS' ? styles.filterSelectWithClear : styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filtrar por estado de receta"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">🟢 Activas en Planta</option>
            <option value="INACTIVO">🔴 Pausadas / Inactivas</option>
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
            placeholder="Receta, producto, código..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            aria-label="Búsqueda rápida de recetas"
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
