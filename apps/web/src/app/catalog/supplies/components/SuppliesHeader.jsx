/**
 * @file SuppliesHeader.jsx
 * @module catalog/supplies/components
 * @description Encabezado del catálogo de insumos con barra de filtros avanzados (SRP < 120 líneas).
 * @responsibility Renderizar banner conceptual, búsqueda contextual, selects de filtros y botón de limpieza.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies react, lucide-react, @/components/ui/Button, @/components/ui/ContextBanner
 */
import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../supplies.module.css';

export function SuppliesHeader({
  onNew,
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
  totalFound = 0
}) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.stockStatus ||
    filters.traceability ||
    filters.activeStatus
  );

  return (
    <div className={styles.headerSection}>
      <ContextBanner 
        title="Catálogo de Insumos y Materias Primas" 
        description="Gestiona las materias primas, cultivos y recipientes con control de trazabilidad, stock de seguridad y conversión por densidad." 
        action={<Button onClick={() => onNew()}>+ Nuevo Insumo</Button>}
      />
      
      <div className={styles.filtersBar}>
        {/* Input de Búsqueda con Iconos */}
        <div className={styles.searchInputWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por código, nombre, marca..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar insumos"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              className={styles.clearInputBtn}
              aria-label="Limpiar búsqueda"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filtro por Categoría */}
        <select 
          value={filters.category} 
          onChange={(e) => onFilterChange('category', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Filtro por Estado de Stock */}
        <select
          value={filters.stockStatus}
          onChange={(e) => onFilterChange('stockStatus', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filtrar por nivel de stock"
        >
          <option value="">Todos los niveles de stock</option>
          <option value="in_range">🟢 En Rango (Óptimo)</option>
          <option value="low_stock">🟠 Bajo Mínimo (Alerta)</option>
          <option value="out_of_stock">🔴 Agotados (Stock 0)</option>
        </select>

        {/* Filtro por Trazabilidad */}
        <select
          value={filters.traceability}
          onChange={(e) => onFilterChange('traceability', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filtrar por trazabilidad"
        >
          <option value="">Toda la trazabilidad</option>
          <option value="with_traceability">🔒 Con Trazabilidad (Historial)</option>
          <option value="without_traceability">🛡️ Sin Trazabilidad (Purgable)</option>
        </select>

        {/* Filtro por Estado Activo / Inactivo */}
        <select
          value={filters.activeStatus}
          onChange={(e) => onFilterChange('activeStatus', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filtrar por estado activo o inactivo"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {/* Botón Reset de Filtros */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.btnResetFilters}
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={13} />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}
