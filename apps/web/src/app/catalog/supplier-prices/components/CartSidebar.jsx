/**
 * @file CartSidebar.jsx
 * @module catalog/supplier-prices/components
 * @description Barra flotante de compra con cálculo de presupuesto preliminar consolidado (< 50 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../supplier-prices.module.css';

export function CartSidebar({ selectedForPurchase, clearPurchaseList, proceedToPurchase }) {
  if (!selectedForPurchase || selectedForPurchase.length === 0) return null;

  const totalPresupuesto = selectedForPurchase.reduce((acc, curr) => {
    const precio = Number(curr.precioCompra ?? curr.precio ?? 0);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  return (
    <div className={styles.floatingCart}>
      <div className={styles.cartInfo}>
        <div className={styles.cartIconBadge}>
          <ShoppingBag size={18} />
        </div>
        <div className={styles.cartTextGroup}>
          <strong className={styles.cartCountText}>
            {selectedForPurchase.length} {selectedForPurchase.length === 1 ? 'insumo seleccionado' : 'insumos seleccionados'}
          </strong>
          <span className={styles.cartBudgetSubtext}>
            Presupuesto preliminar: <strong>{formatCurrency(totalPresupuesto)} COP</strong>
          </span>
        </div>
      </div>
      <div className={styles.cartActions}>
        <Button variant="secondary" onClick={clearPurchaseList}>Vaciar lista</Button>
        <Button variant="primary" onClick={proceedToPurchase}>Continuar a Orden de Compra</Button>
      </div>
    </div>
  );
}
