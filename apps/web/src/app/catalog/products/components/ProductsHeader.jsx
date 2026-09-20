/**
 * @file ProductsHeader.jsx
 * @module catalog/products/components
 * @description Encabezado del catálogo de productos.
 * @responsibility Presentar controles básicos para producto y nueva acción.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/components/ui/Button
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../products.module.css';

export function ProductsHeader({
  onNew,
  canCreate = true,
  channelFilter = 'TODOS',
  onFilterChange = () => {}
}) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Productos</h1>
          <p className={styles.subtitle}>Catálogo de productos terminados listos para distribución comercial.</p>
        </div>
        <Button 
          onClick={() => { if (canCreate) onNew(); }}
          disabled={!canCreate}
          title={!canCreate ? 'Debe registrar al menos una Presentación antes de crear productos' : 'Registrar nuevo producto'}
          className={!canCreate ? styles.btnNewProductDisabled : ''}
        >
          Nuevo Registro
        </Button>
      </div>

      <div className={styles.channelFilterBar} role="tablist" aria-label="Filtrar por canal de venta">
        <button
          type="button"
          className={`${styles.channelTabBtn} ${channelFilter === 'TODOS' ? styles.channelTabActive : ''}`}
          onClick={() => onFilterChange('TODOS')}
        >
          Todos
        </button>
        <button
          type="button"
          className={`${styles.channelTabBtn} ${channelFilter === 'COMERCIAL' ? styles.channelTabActive : ''}`}
          onClick={() => onFilterChange('COMERCIAL')}
        >
          Comerciales (Venta)
        </button>
        <button
          type="button"
          className={`${styles.channelTabBtn} ${channelFilter === 'WIP' ? styles.channelTabActive : ''}`}
          onClick={() => onFilterChange('WIP')}
        >
          Bases de Planta (WIP)
        </button>
      </div>
    </>
  );
}
