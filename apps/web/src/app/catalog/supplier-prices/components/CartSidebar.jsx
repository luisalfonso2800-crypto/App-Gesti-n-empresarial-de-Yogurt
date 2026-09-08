/**
 * @file CartSidebar.jsx
 * @module catalog/supplier-prices/components
 * @description Panel flotante de carrito de compras que consolida la selección para una nueva orden.
 * @responsibility Presentar un resumen de ítems agregados y opciones de checkout.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../supplier-prices.module.css';

export function CartSidebar({ selectedForPurchase, clearPurchaseList, proceedToPurchase }) {
  if (selectedForPurchase.length === 0) return null;

  return (
    <div className={styles.floatingCart}>
      <div className={styles.cartInfo}>
        <span>{selectedForPurchase.length} insumo(s) seleccionados para compra</span>
      </div>
      <div className={styles.cartActions}>
        <Button variant="secondary" onClick={clearPurchaseList}>Vaciar lista</Button>
        <Button variant="primary" onClick={proceedToPurchase}>Continuar a Orden de Compra</Button>
      </div>
    </div>
  );
}
