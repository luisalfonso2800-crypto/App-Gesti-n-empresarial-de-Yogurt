/**
 * @file PricesFilterBar.jsx
 * @module catalog/supplier-prices/components
 * @description Barra de herramientas para filtrar la tabla de precios.
 * @responsibility Presentar controles de búsqueda, ordenamiento y filtro.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../supplier-prices.module.css';

export function PricesFilterBar({
  filterInsumo, setFilterInsumo,
  filterProveedor, setFilterProveedor,
  filterEstado, setFilterEstado,
  filterSort, setFilterSort,
  filterSearch, setFilterSearch,
  hasFilters, clearFilters,
  uniqueInsumos, uniqueProveedores
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Insumo</label>
        <select className={styles.filterSelect} value={filterInsumo} onChange={e => setFilterInsumo(e.target.value)}>
          <option value="">Todos los insumos</option>
          {uniqueInsumos.map(ins => (
            <option key={ins.id || ins.ID_Insumo} value={ins.id || ins.ID_Insumo}>
              {ins.Nombre_Insumo || ins.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Proveedor</label>
        <select className={styles.filterSelect} value={filterProveedor} onChange={e => setFilterProveedor(e.target.value)}>
          <option value="">Todos los proveedores</option>
          {uniqueProveedores.map(prov => (
            <option key={prov.id || prov.ID_Proveedor} value={prov.id || prov.ID_Proveedor}>
              {prov.Nombre_Proveedor || prov.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Estado</label>
        <select className={styles.filterSelect} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Orden</label>
        <select className={styles.filterSelect} value={filterSort} onChange={e => setFilterSort(e.target.value)}>
          <option value="none">Por defecto</option>
          <option value="asc">Menor a mayor costo</option>
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Búsqueda</label>
        <input 
          type="text" 
          className={styles.filterInput} 
          placeholder="Buscar presentación..." 
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
        />
      </div>
      {hasFilters && (
        <Button variant="secondary" onClick={clearFilters}>Limpiar Filtros</Button>
      )}
    </div>
  );
}
