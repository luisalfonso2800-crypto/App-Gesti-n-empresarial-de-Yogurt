/**
 * @file SaleSelectedProductBar.jsx
 * @module commercial/sales/components/modal-parts
 * @description Barra interactiva de control de cantidad, precio y adición para el producto seleccionado (SRP < 150 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx
 */
import React from 'react';
import { Plus } from 'lucide-react';
import styles from '../sale-modal.module.css';

export default function SaleSelectedProductBar({
  selectedProd,
  qty,
  price,
  stockError,
  onStepQty,
  onChangeQty,
  onChangePrice,
  onAdd
}) {
  if (!selectedProd) return null;

  const minMay = Number(selectedProd.producto?.cantidadMinimaMayorista || 12);
  const isWholesale = Number(selectedProd.producto?.precioMayorista) > 0 && Number(qty) >= minMay;
  const disp = Number(selectedProd.cantidadActual);

  return (
    <div className={styles.selectedItemActionRow}>
      <div className={styles.selectedItemInfo}>
        <div className={styles.selectedItemTitle}>{selectedProd.producto?.nombre}</div>
        <div className={styles.selectedItemSub}>
          Stock en Cava: {disp} und | {isWholesale ? '★ Tarifa mayorista aplicada' : 'Tarifa estándar'}
        </div>
      </div>

      <div className={styles.qtyControlGroup}>
        <button
          type="button"
          className={styles.btnQtyStep}
          onClick={() => onStepQty(-1)}
          disabled={Number(qty) <= 1}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={disp}
          value={qty}
          onChange={(e) => onChangeQty(e.target.value)}
          className={styles.qtyInputBox}
        />
        <button
          type="button"
          className={styles.btnQtyStep}
          onClick={() => onStepQty(1)}
          disabled={Number(qty) >= disp}
        >
          +
        </button>
      </div>

      <input
        type="text"
        inputMode="numeric"
        value={price ? String(price).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
        onChange={(e) => onChangePrice(e.target.value.replace(/\D/g, ''))}
        className={styles.priceOverrideBox}
        title="Precio unitario"
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={!qty || !price || !!stockError || Number(qty) > disp}
        className={styles.btnAddProduct}
      >
        <Plus size={16} /> Agregar
      </button>
    </div>
  );
}
