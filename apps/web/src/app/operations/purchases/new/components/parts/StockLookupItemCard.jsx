/**
 * @file StockLookupItemCard.jsx
 * @module operations/purchases/new/components/parts
 * @description Tarjeta atómica para visualizar stock de un insumo y agregarlo a la orden de compra.
 * @responsibility Presentar datos de insumo, semáforo de inventario y botón interactivo con feedback.
 * @usedBy StockLookupDrawer.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function StockLookupItemCard({ item, isAdded, onAdd, onRemove }) {
  const hasInventoryRecord = item.hasInventoryRecord ?? (item.invItem !== undefined || item.stockActual !== undefined);
  const invItem = item.invItem;
  const stockReal = Number(item.stockActual ?? invItem?.cantidadActual ?? 0);
  const stockMinimo = Number(item.stockMinimo || 0);
  const unidad = item.unidadBase || item.unidadMedida || 'und';

  let status = 'OPTIMAL';
  let semaforoClass = styles.stockPillOpt;
  let semaforoLabel = 'EN RANGO';

  if (!hasInventoryRecord || (invItem?.ultimaActualizacion == null && stockReal === 0 && !invItem?.id)) {
    status = 'UNACQUIRED';
    semaforoClass = styles.stockPillNeutral || styles.badgeNeutral;
    semaforoLabel = 'SIN INGRESOS';
  } else if (stockReal <= 0) {
    status = 'DEPLETED';
    semaforoClass = styles.stockPillOut;
    semaforoLabel = 'AGOTADO';
  } else if (stockReal <= stockMinimo) {
    status = 'LOW';
    semaforoClass = styles.stockPillLow;
    semaforoLabel = 'BAJO MÍNIMO';
  }

  return (
    <div className={`${styles.stockItemCard} ${isAdded ? styles.itemCardAdded : ''}`}>
      <div className={styles.stockItemInfo}>
        <div className={styles.stockItemNameRow}>
          <span className={styles.stockItemName}>{item.nombre}</span>
          <span className={`${styles.stockPill} ${semaforoClass}`}>{semaforoLabel}</span>
          {isAdded && <span className={styles.badgeAdded}>✓ En compra</span>}
        </div>
        <div className={styles.stockItemMeta}>
          {item.marca && item.marca !== 'N/A' && <span className={styles.stockItemMarca}>Marca: {item.marca} • </span>}
          {status === 'UNACQUIRED' ? (
            <span>Stock: Sin compras previas • (Mín: {stockMinimo.toLocaleString('es-CO')} {unidad})</span>
          ) : (
            <span>
              Stock: <strong>{stockReal.toLocaleString('es-CO')} {unidad}</strong>
              {stockMinimo > 0 && <span className={styles.stockMinSub}> • (Mín: {stockMinimo.toLocaleString('es-CO')} {unidad})</span>}
            </span>
          )}
        </div>
      </div>
      {isAdded ? (
        <button
          type="button"
          className={styles.btnRemoveFromDrawer}
          onClick={() => onRemove(item.idInsumo || item.id)}
        >
          ✕ Quitar
        </button>
      ) : (
        <button
          type="button"
          className={styles.stockAddBtn}
          onClick={() => onAdd(item)}
        >
          + Añadir a Compra
        </button>
      )}
    </div>
  );
}
