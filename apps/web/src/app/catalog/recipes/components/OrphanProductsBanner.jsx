/**
 * @file OrphanProductsBanner.jsx
 * @module catalog/recipes/components
 * @description Selector dinámico en tarjetas para productos huérfanos sin receta técnica.
 * @responsibility Renderizar retícula de tarjetas con miniatura, nombre, presentación y acción directa.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies react, @/components/ui/ProductAvatar, @/lib/presetImages, ../recipes.module.css
 */
import React from 'react';
import ProductAvatar from '@/components/ui/ProductAvatar';
import { resolveProductImage } from '@/lib/presetImages';
import styles from '../recipes.module.css';

export function OrphanProductsBanner({ orphanProducts = [], onSelectProduct }) {
  if (orphanProducts.length === 0) return null;

  return (
    <div className={styles.orphanBanner}>
      <div className={styles.orphanContent}>
        <div className={styles.orphanTitle}>
          <span>⚠️</span>
          <span>{orphanProducts.length} producto(s) en catálogo sin receta técnica formulada</span>
        </div>
        <span className={styles.orphanSubtitle}>
          Los productos huérfanos no se pueden fabricar ni descontar ingredientes en bodega. Selecciona uno para formular:
        </span>
      </div>

      <div className={styles.orphanGrid}>
        {orphanProducts.map((product) => (
          <div key={product.id} className={styles.orphanCard}>
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
              </span>
              <span className={styles.orphanCardMeta}>
                {product.presentacion?.nombre || product.categoria || 'Sin presentación'}
              </span>
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
        ))}
      </div>
    </div>
  );
}
