/**
 * @file ProductionProductLaunchpadCard.jsx
 * @module operations/production/components
 * @description Tarjeta vertical de producto formulado listo para producir en planta.
 * @responsibility Renderizar imagen recortada a 120px, stock en cava y botón con estilo MANNÁ (#1b4d3e).
 */
'use client';

import React from 'react';
import { Package, Play, AlertTriangle } from 'lucide-react';
import styles from './production-launchpad.module.css';

export default function ProductionProductLaunchpadCard({
  product,
  matchingRecipe,
  stockLabel,
  shortageReason,
  onProduceProduct
}) {
  return (
    <article className={styles.card}>
      <div className={styles.imgWrapper}>
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className={styles.img}
          />
        ) : (
          <div className={styles.imgFallback}>
            <Package size={26} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div>
          <h4 className={styles.cardTitle} title={product.nombre}>
            {product.nombre}
          </h4>
          <span className={styles.stockBadge}>
            📦 En Cava: {stockLabel}
          </span>
        </div>

        <div>
          {shortageReason ? (
            <button
              type="button"
              disabled
              className={styles.btnDisabled}
              title={`Bloqueado: ${shortageReason}`}
            >
              <AlertTriangle size={12} />
              <span>{shortageReason}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (matchingRecipe && onProduceProduct) {
                  onProduceProduct(matchingRecipe.id, matchingRecipe.rendimientoBase);
                }
              }}
              className={styles.btnProduce}
            >
              <Play size={12} fill="currentColor" />
              <span>Producir Lote</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
