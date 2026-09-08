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

export function ProductsHeader({ onNew }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Productos</h1>
        <p className={styles.subtitle}>Catálogo de productos terminados listos para distribución comercial.</p>
      </div>
      <Button onClick={() => onNew()}>Nuevo Registro</Button>
    </div>
  );
}
