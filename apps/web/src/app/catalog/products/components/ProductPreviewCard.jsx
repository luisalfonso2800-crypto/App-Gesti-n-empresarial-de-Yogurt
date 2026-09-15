/**
 * @file ProductPreviewCard.jsx
 * @module catalog/products/components
 * @description Hero Card de previsualización lateral interactiva de producto estilo Netflix (SRP < 150 líneas).
 * @responsibility Mostrar banner panorámico 16:9, badges de estado/tipo, ficha técnica, margen y estado de receta.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies react, @/lib/presetImages, @/lib/formatters, @/components/ui/Badge, ./product-preview-card.module.css, ./products-table.module.css
 */
'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { resolveProductImage } from '@/lib/presetImages';
import { formatCurrency } from '@/lib/formatters';
import styles from './product-preview-card.module.css';
import tableStyles from './products-table.module.css';

const CATEGORY_MAP = {
  BASES_LACTEAS: { label: 'Bases Lácteas', className: tableStyles.catBasesLacteas },
  DULCES_JALEAS: { label: 'Dulces y Jaleas', className: tableStyles.catDulcesJaleas },
  TOPPING_CEREAL: { label: 'Topping / Cereal (WIP)', className: tableStyles.catToppingCereal },
  INSUMO_BASE_WIP: { label: 'Premezcla Planta (WIP)', className: tableStyles.catInsumoBaseWip },
  LACTEOS: { label: 'Lácteos Terminados', className: tableStyles.catLacteos },
  POSTRES: { label: 'Postres y Otros', className: tableStyles.catPostres },
  BEBIDAS: { label: 'Bebidas', className: tableStyles.catBebidas }
};

export function ProductPreviewCard({ product, recipes = [] }) {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const hasActiveRecipe = recipes.some(
    r => r.activo !== false && String(r.idProducto) === String(product.id)
  );

  const isWip = product.categoria?.includes('WIP') || product.canalVenta === 'USO_INTERNO';
  const categoryConfig = CATEGORY_MAP[product.categoria] || {
    label: product.categoria || 'Sin Categoría',
    className: tableStyles.catDefault
  };

  const presentationText = product.presentacion?.nombre || (isWip ? 'A GRANEL' : 'ESTÁNDAR');
  const numPrice = Number(product.precioVenta) || 0;
  const numMargin = Number(product.margenObjetivo) || 0;
  const imageSrc = resolveProductImage(product);

  return (
    <div className={styles.previewCard}>
      <div className={styles.bannerContainer}>
        {!imgError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.nombre}
            className={styles.bannerImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.bannerImage}>🥛</div>
        )}
        <div className={styles.bannerGradient}></div>

        <div className={styles.bannerBadges}>
          <span className={styles.typeBadge}>
            {isWip ? 'WIP (Planta)' : 'Comercial'}
          </span>
          <Badge status={product.activo ? 'active' : 'inactive'}>
            {product.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.headerInfo}>
          <h3 className={styles.productTitle}>{product.nombre}</h3>
          <span className={styles.presentationSubtitle}>{presentationText}</span>
          <div className={styles.categoryTag}>
            <span className={`${tableStyles.categoryChip} ${categoryConfig.className}`}>
              {categoryConfig.label}
            </span>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Precio Venta</span>
            {numPrice > 0 ? (
              <span className={styles.metricValue}>{formatCurrency(numPrice)}</span>
            ) : (
              <span className={styles.internalCostValue}>$0 (Costo Interno)</span>
            )}
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Margen Objetivo</span>
            <span className={styles.metricValue}>
              {numMargin > 0 ? `${numMargin}%` : '0%'}
            </span>
          </div>
        </div>

        <div>
          <span className={`${styles.recipeStatusBadge} ${hasActiveRecipe ? styles.recipeActive : styles.recipeMissing}`}>
            {hasActiveRecipe ? '✓ Receta Formulada' : '⚠️ Sin Receta Técnica'}
          </span>
        </div>

        {(product.descripcion || product.observaciones) && (
          <div className={styles.descriptionSection}>
            <div className={styles.descriptionLabel}>Ficha Técnica / Notas</div>
            <p className={styles.descriptionText}>
              {product.descripcion || product.observaciones}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
