/**
 * @file ProductionProductLaunchpad.jsx
 * @module operations/production/components
 * @description Galería superior de productos formulados listos para producir en planta (Módulo MANNÁ).
 * @responsibility Mostrar productos con receta activa, stock en cava y precarga directa de lote.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
'use client';

import React from 'react';
import { Package, Play, Warehouse } from 'lucide-react';
import styles from '../production.module.css';

export default function ProductionProductLaunchpad({
  products = [],
  recipes = [],
  onProduceProduct
}) {
  const formulatedProducts = products.filter((p) => {
    if (p.activo === false) return false;
    return recipes.some((r) => String(r.idProducto) === String(p.id));
  });

  if (formulatedProducts.length === 0) return null;

  return (
    <section className={styles.launchpadSection} aria-label="Lanzadera de productos formulados">
      <div className={styles.launchpadHeader}>
        <div className={styles.launchpadTitleGroup}>
          <Warehouse size={16} className={styles.launchpadIcon} />
          <h2 className={styles.launchpadHeaderTitle}>Productos Formulados Listos para Producir</h2>
        </div>
        <span className={styles.launchpadBadge}>{formulatedProducts.length} disponibles</span>
      </div>

      <div className={styles.launchpadGrid}>
        {formulatedProducts.map((p) => {
          const matchingRecipe = recipes.find((r) => String(r.idProducto) === String(p.id));
          const stock = Number(p.stockCava ?? p.stockActual ?? 0);
          const unidad = p.unidadMedida || p.unidad || 'und';

          return (
            <article key={p.id} className={styles.launchpadCard}>
              {p.imagenUrl ? (
                <img
                  src={p.imagenUrl}
                  alt={p.nombre}
                  className={styles.launchpadImg}
                />
              ) : (
                <div className={styles.launchpadImgPlaceholder}>
                  <Package size={22} />
                </div>
              )}
              <div className={styles.launchpadContent}>
                <h4 className={styles.launchpadTitle} title={p.nombre}>{p.nombre}</h4>
                <span className={styles.badgeStock}>📦 En Cava: {stock} {unidad}</span>
                <button
                  type="button"
                  className={styles.btnLaunch}
                  onClick={() => {
                    if (matchingRecipe && onProduceProduct) {
                      onProduceProduct(matchingRecipe.id, matchingRecipe.rendimientoBase);
                    }
                  }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>▶ Producir Lote</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

