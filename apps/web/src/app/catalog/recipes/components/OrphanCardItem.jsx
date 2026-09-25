/**
 * @file OrphanCardItem.jsx
 * @module catalog/recipes/components
 * @description Tarjeta individual de producto huérfano con distinción visual y acción directa.
 */
import React from 'react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import styles from '../recipes.module.css';

export function OrphanCardItem({ product, isWip, onSelectProduct }) {
  const metaText = product.presentacion?.nombre || product.categoria || 'Sin presentación';
  const cleanMeta = metaText.startsWith('E2E_TEST_PRES_') ? product.categoria || '' : metaText;

  return (
    <div className={`${styles.orphanCard} ${isWip ? styles.orphanCardWIP : styles.orphanCardCommercial}`}>
      <div className={styles.orphanCardAvatar}>
        <ProductAvatar
          src={resolveProductImage(product)}
          alt={product.nombre}
          name={product.nombre}
          size={38}
        />
      </div>
      <div className={styles.orphanCardInfo}>
        <span className={styles.orphanCardTitle} title={product.nombre}>
          {product.nombre}
          <span className={`${styles.orphanBadge} ${isWip ? styles.orphanBadgeWIP : styles.orphanBadgeCommercial}`}>
            {isWip ? 'WIP' : 'COM'}
          </span>
        </span>
        {cleanMeta && <span className={styles.orphanCardMeta}>{cleanMeta}</span>}
      </div>
      <button
        type="button"
        className={styles.orphanCardBtn}
        onClick={() => onSelectProduct(product.id)}
        title={`Formular receta técnica para ${product.nombre}`}
      >
        + Crear Receta
      </button>
    </div>
  );
}
