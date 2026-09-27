/**
 * @file SuppliersHeader.jsx
 * @module catalog/suppliers/components
 * @description Cabecera del directorio de proveedores con barra de búsqueda y filtros (SRP < 100 líneas).
 * @responsibility Mostrar banner conceptual, buscador contextual y filtro de estado.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies react, lucide-react, @/components/ui/Button, @/components/ui/ContextBanner
 */
import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ContextBanner } from '@/components/ui/ContextBanner';
import styles from '../suppliers.module.css';

export function SuppliersHeader({
  onNew,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onResetFilters
}) {
  const hasActiveFilters = Boolean(searchTerm || statusFilter);

  return (
    <div className={styles.headerSection}>
      <ContextBanner 
        title="Directorio de Proveedores Comerciales" 
        description="Directorio centralizado de empresas y personas que proveen materias primas, insumos y empaques para la operación de la planta." 
        action={<Button onClick={() => onNew()}>+ Nuevo Proveedor</Button>}
      />

      <div className={styles.filtersBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, NIT, contacto o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar proveedores"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className={styles.clearInputBtn}
              aria-label="Limpiar búsqueda"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.btnResetFilters}
            title="Restablecer filtros"
          >
            <RotateCcw size={13} />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}
