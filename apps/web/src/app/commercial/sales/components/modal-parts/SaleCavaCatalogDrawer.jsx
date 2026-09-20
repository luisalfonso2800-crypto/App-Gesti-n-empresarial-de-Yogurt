/**
 * @file SaleCavaCatalogDrawer.jsx
 * @module commercial/sales/components/modal-parts
 * @description Drawer lateral derecho para selección y agregado de productos desde Cava (SRP < 135 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx
 */
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

import SaleCavaProductCard from './SaleCavaProductCard';

export default function SaleCavaCatalogDrawer({ isOpen, onClose, products = [], onAddProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  const filtered = useMemo(() => {
    const rawItems = Array.isArray(products) ? products : [];
    const validProducts = rawItems.filter(item => {
      const cat = (item.categoria || item.producto?.categoria || '').toUpperCase();
      const pres = (item.presentacionNombre || item.presentacion?.nombre || item.producto?.presentacion?.nombre || '').toUpperCase();
      const tipoEnvase = (item.presentacion?.envase || item.producto?.presentacion?.envase || '').toUpperCase();
      const esGranel = pres.includes('GRANEL') || tipoEnvase === 'BALDE' || tipoEnvase === 'GRANEL' || (item.nombre || item.producto?.nombre || '').toUpperCase().includes('GRANEL');
      const esComercial = cat === 'LACTEOS' || cat === 'PRODUCTO_TERMINADO' || Boolean(item.presentacionId || item.producto?.presentacionId);
      
      return esComercial && !esGranel;
    });

    const term = searchTerm.trim().toLowerCase();
    if (!term) return validProducts;
    return validProducts.filter(p => {
      const name = (p.nombre || p.producto?.nombre || '').toLowerCase();
      const pres = (p.presentacion?.nombre || p.producto?.presentacion?.nombre || '').toLowerCase();
      return name.includes(term) || pres.includes(term);
    });
  }, [products, searchTerm]);

  if (!isOpen) return null;

  const handleStep = (id, delta, maxStock) => {
    const current = Number(quantities[id] || 1);
    const next = Math.min(maxStock, Math.max(1, current + delta));
    setQuantities(prev => ({ ...prev, [id]: next }));
  };

  const handleChangeQty = (id, val, maxStock) => {
    const parsed = parseInt(val, 10);
    const valid = isNaN(parsed) ? 1 : Math.min(maxStock, Math.max(1, parsed));
    setQuantities(prev => ({ ...prev, [id]: valid }));
  };

  const handleAdd = (prod, stock) => {
    const qty = Number(quantities[prod.id] || 1);
    if (qty <= 0 || qty > stock) return;
    onAddProduct(prod, qty);
    setQuantities(prev => ({ ...prev, [prod.id]: 1 }));
  };

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerPanel} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <ShoppingCart size={20} /> Catálogo en Cava
          </div>
          <button type="button" onClick={onClose} className={styles.btnCloseDrawer} aria-label="Cerrar">✕</button>
        </div>

        <div className={styles.drawerSearchBox}>
          <input
            type="text"
            placeholder="Buscar por producto o presentación..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.drawerSearchInput}
          />
        </div>

        <div className={styles.drawerBodyList}>
          {filtered.length === 0 ? (
            <div className={styles.drawerEmptyText}>No se encontraron productos en Cava.</div>
          ) : (
            filtered.map(p => (
              <SaleCavaProductCard
                key={p.id}
                item={p}
                qty={Number(quantities[p.id] || 1)}
                onStep={handleStep}
                onChangeQty={handleChangeQty}
                onAdd={handleAdd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
