/**
 * @file SaleProductCatalogCard.jsx
 * @module commercial/sales/components/modal-parts
 * @description Tarjeta visual individual para producto en Cava dentro del catálogo de despacho (SRP < 150 líneas).
 * @usedBy apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx
 */
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../sale-modal.module.css';

export default function SaleProductCatalogCard({ product, isSelected, onSelect }) {
  const prodInfo = product.producto || {};
  const stock = Number(product.cantidadActual) || 0;
  const imgSrc = prodInfo.fotoComercialUrl || prodInfo.imagenUrl || null;
  const regPrice = Number(prodInfo.precioVentaSug || prodInfo.precioVenta || 0);
  const mayPrice = Number(prodInfo.precioMayorista || 0);

  return (
    <div
      onClick={() => {
        if (stock > 0) onSelect(product);
      }}
      className={`${styles.productCatalogCard} ${isSelected ? styles.productCatalogCardActive : ''}`}
    >
      <div className={styles.cardImageWrapper}>
        {imgSrc ? (
          <img src={imgSrc} alt={prodInfo.nombre} className={styles.cardThumbnail} />
        ) : (
          <span className={styles.cardPlaceholder}>🥛</span>
        )}
      </div>
      <span className={styles.cardName} title={prodInfo.nombre}>
        {prodInfo.nombre || 'Producto'}
      </span>
      <span className={styles.cardPresentation}>
        {prodInfo.presentacion?.nombre || prodInfo.unidadMedida || 'Unidad'}
      </span>
      <div className={styles.cardPriceRow}>
        <span className={styles.cardPriceRegular}>
          {regPrice > 0 ? formatCurrency(regPrice) : 'S/P'}
        </span>
        {mayPrice > 0 && (
          <span className={styles.cardPriceWholesale} title={`Mayorista desde ${prodInfo.cantidadMinimaMayorista || 12} und`}>
            May: {formatCurrency(mayPrice)}
          </span>
        )}
      </div>
      <span className={`${styles.cardStockBadge} ${stock <= 0 ? styles.cardStockZero : ''}`}>
        {stock > 0 ? `${stock} und disponibles` : 'Sin stock'}
      </span>
    </div>
  );
}
