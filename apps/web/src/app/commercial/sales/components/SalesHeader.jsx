/**
 * @file SalesHeader.jsx
 * @module commercial/sales/components
 * @description Componente header de visualización de ventas.
 * @responsibility Título y disparador de acción para registrar facturas.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/Button
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../sales.module.css';

export function SalesHeader({ onNew }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Ventas</h1>
        <p className={styles.subtitle}>Facturación, pedidos y despachos de productos terminados a clientes.</p>
      </div>
      <Button onClick={onNew}>Nueva Venta</Button>
    </div>
  );
}
