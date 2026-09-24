/**
 * @file PriceRowActions.jsx
 * @module catalog/supplier-prices/components/parts
 * @description Botonera de acciones estilizada con iconos Lucide React (< 60 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/parts/PriceRow.jsx
 */
'use client';

import React from 'react';
import { ShoppingCart, Trash2, Pencil, Power } from 'lucide-react';
import styles from '../../supplier-prices.module.css';

export default function PriceRowActions({
  item,
  isAdded,
  alreadyHasSameProviderAndInsumo,
  onToggleCart,
  onEdit,
  onToggleActive
}) {
  return (
    <div className={styles.actionButtonGroup}>
      {item.activo && (
        <button
          type="button"
          onClick={() => onToggleCart(item)}
          disabled={alreadyHasSameProviderAndInsumo}
          className={isAdded ? styles.btnCartActive : styles.btnCart}
          title={isAdded ? "Quitar de lista de compra" : alreadyHasSameProviderAndInsumo ? "Ya en lista" : "Añadir a orden"}
        >
          {isAdded ? <Trash2 size={14} /> : <ShoppingCart size={14} />}
          <span>{isAdded ? "Quitar" : "Comprar"}</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => onEdit(item)}
        className={styles.btnActionIcon}
        title="Editar cotización"
      >
        <Pencil size={14} />
      </button>

      <button
        type="button"
        onClick={() => onToggleActive(item)}
        className={`${styles.btnActionIcon} ${item.activo ? styles.btnPowerActive : styles.btnPowerInactive}`}
        title={item.activo ? "Desactivar cotización" : "Activar cotización"}
      >
        <Power size={14} />
      </button>
    </div>
  );
}
