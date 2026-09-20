/**
 * @file SaleCavaProductCard.jsx
 * @module commercial/sales/components/modal-parts
 * @description Tarjeta individual de producto para el Drawer lateral de Cava (SRP < 150 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx
 */
import React from 'react';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

export default function SaleCavaProductCard({
  item,
  qty,
  onStep,
  onChangeQty,
  onAdd
}) {
  const prod = item.producto || item;
  const stock = Number(item.cantidadActual ?? item.stockCava ?? item.stockActual ?? 0);
  const regPrice = Number(prod.precioVenta || prod.precioVentaSug || item.precioVenta || 0);
  const mayPrice = Number(prod.precioMayorista || item.precioMayorista || 0);
  const minMay = Number(prod.cantidadMinimaMayorista || item.cantidadMinimaMayorista || 12);
  const isWholesale = mayPrice > 0 && qty >= minMay;
  const unitPrice = isWholesale ? mayPrice : regPrice;
  const imgSrc = prod.fotoComercialUrl || prod.imagenUrl || item.fotoComercialUrl;

  return (
    <div className={styles.drawerCard}>
      <div className={styles.drawerCardImageWrapper}>
        {imgSrc ? (
          <img src={imgSrc} alt={prod.nombre} className={styles.drawerCardImg} />
        ) : (
          <span className={styles.cardPlaceholder}>🥛</span>
        )}
      </div>

      <div className={styles.drawerCardTitleRow}>
        <span className={styles.drawerCardName}>{prod.nombre || 'Producto'}</span>
        <span className={styles.drawerCardPresentation}>
          {item.presentacionNombre || prod.presentacionNombre || prod.presentacion?.nombre || prod.unidadMedida || 'Contenedor 16 oz'} {item.contenidoNeto || prod.contenidoNeto || prod.presentacion?.contenidoNeto ? `• ${item.contenidoNeto || prod.contenidoNeto || prod.presentacion?.contenidoNeto}` : ''}
        </span>
      </div>

      <div className={styles.drawerCardTechnical}>
        <span><strong>Precio Base:</strong> {formatCurrency(regPrice)}</span>
        {prod.ingredientes && <span><strong>Ingredientes:</strong> {prod.ingredientes}</span>}
      </div>

      <div className={styles.drawerCardBadgesRow}>
        <span className={styles.drawerStockBadge}>Stock Cava: {stock} und</span>
        {mayPrice > 0 && (
          <span className={styles.drawerB2BBadge}>
            B2B: {formatCurrency(mayPrice)} (min {minMay} und)
          </span>
        )}
      </div>

      <div className={styles.drawerCardActionsRow}>
        <div className={styles.qtyControlGroup}>
          <button
            type="button"
            className={styles.btnQtyStep}
            onClick={() => onStep(item.id, -1, stock)}
            disabled={qty <= 1 || stock <= 0}
          >-</button>
          <input
            type="number"
            min="1"
            max={stock}
            value={qty}
            onChange={e => onChangeQty(item.id, e.target.value, stock)}
            className={styles.qtyInputBox}
            disabled={stock <= 0}
          />
          <button
            type="button"
            className={styles.btnQtyStep}
            onClick={() => onStep(item.id, 1, stock)}
            disabled={qty >= stock || stock <= 0}
          >+</button>
        </div>

        <button
          type="button"
          onClick={() => onAdd(item, stock)}
          disabled={stock <= 0 || qty > stock}
          className={styles.btnDrawerAdd}
        >
          <Plus size={16} /> {formatCurrency(unitPrice * qty)}
        </button>
      </div>
    </div>
  );
}
