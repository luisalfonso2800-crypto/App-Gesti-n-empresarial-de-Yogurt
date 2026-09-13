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

export function ProductsHeader({ onNew, canCreate = true }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Productos</h1>
        <p className={styles.subtitle}>Catálogo de productos terminados listos para distribución comercial.</p>
      </div>
      <Button 
        onClick={() => { if (canCreate) onNew(); }}
        disabled={!canCreate}
        title={!canCreate ? 'Debe registrar al menos una Presentación antes de crear productos' : 'Registrar nuevo producto'}
        style={!canCreate ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        Nuevo Registro
      </Button>
    </div>
  );
}
