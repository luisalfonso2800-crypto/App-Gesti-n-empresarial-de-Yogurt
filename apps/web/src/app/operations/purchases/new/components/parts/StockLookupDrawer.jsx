/**
 * @file StockLookupDrawer.jsx
 * @module operations/purchases/new/components/parts
 * @description Panel lateral para consultar existencias de insumos y agregarlos a compra directa (<145 líneas).
 * @responsibility Búsqueda y visualización de stock/mínimo con semáforo y acción rápida de incorporación.
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseStickyBar.jsx
 * @dependencies React, apiClient, ../../new-purchase.module.css
 */
import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import StockLookupItemCard from './StockLookupItemCard';
import styles from '../../new-purchase.module.css';

export default function StockLookupDrawer({ isOpen, onClose, onAddSupply, currentItems = [], onRemoveItem }) {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    Promise.all([
      apiClient.get('/supplies').catch(() => ({ data: [] })),
      apiClient.get('/inventory').catch(() => ({ data: [] }))
    ])
      .then(([suppliesRes, invRes]) => {
        if (!isMounted) return;
        const sRaw = suppliesRes?.data;
        const suppliesList = Array.isArray(suppliesRes) ? suppliesRes : (Array.isArray(sRaw) ? sRaw : (sRaw?.data || []));
        const iRaw = invRes?.data;
        const invList = Array.isArray(invRes) ? invRes : (Array.isArray(iRaw) ? iRaw : (iRaw?.data || []));
        const invMap = new Map(invList.map(inv => [inv.idInsumo || inv.id, inv]));

        const enrichedSupplies = suppliesList.map(item => {
          const id = item.id || item.idInsumo;
          const invItem = invMap.get(id);
          const hasInventoryRecord = Boolean(invItem);
          const realStock = hasInventoryRecord ? Number(invItem.cantidadActual ?? 0) : Number(item.stockActual ?? item.stock ?? 0);
          return { ...item, hasInventoryRecord, invItem, stockActual: realStock };
        });

        setSupplies(enrichedSupplies);
      })
      .catch(err => console.error('Error al cargar insumos e inventario en drawer de stock:', err))
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [isOpen]);

  const filteredSupplies = useMemo(() => {
    if (!search?.trim()) return supplies;
    const q = search.toLowerCase();
    return supplies.filter(s =>
      (s.nombre || '').toLowerCase().includes(q) ||
      (s.marca || '').toLowerCase().includes(q) ||
      (s.categoria || '').toLowerCase().includes(q)
    );
  }, [supplies, search]);

  const addedSupplyIds = useMemo(() => {
    const set = new Set();
    (currentItems || []).forEach(item => {
      const insumoId = item.insumo?.id || item.idInsumo || item.insumoId || item.id;
      if (insumoId) set.add(insumoId);
    });
    return set;
  }, [currentItems]);

  const handleRemove = (supplyId) => {
    const targetRow = (currentItems || []).find(item => {
      const id = item.insumo?.id || item.idInsumo || item.insumoId || item.id;
      return id === supplyId;
    });
    if (targetRow && onRemoveItem) {
      onRemoveItem(targetRow.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={`${styles.drawerContainer} ${styles.drawerContent}`} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <span className={styles.drawerIcon}>📦</span>
            <h3 className={styles.drawerTitle}>Consultar Stock de Insumos</h3>
          </div>
          <button type="button" className={styles.drawerCloseBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className={styles.drawerSearchBox}>
          <input
            type="text"
            className={styles.drawerSearchInput}
            placeholder="Buscar por nombre, marca o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button type="button" className={styles.drawerClearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className={styles.drawerListContainer}>
          {loading && <div className={styles.drawerStatusMsg}>Consultando inventario en tiempo real...</div>}
          {!loading && filteredSupplies.length === 0 && (
            <div className={styles.drawerStatusMsg}>No se encontraron insumos que coincidan con la búsqueda.</div>
          )}
          {!loading && filteredSupplies.map(item => {
            const supplyId = item.idInsumo || item.id;
            const isAlreadyAdded = addedSupplyIds.has(supplyId);
            return (
              <StockLookupItemCard
                key={supplyId}
                item={item}
                isAdded={isAlreadyAdded}
                onAdd={onAddSupply}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
