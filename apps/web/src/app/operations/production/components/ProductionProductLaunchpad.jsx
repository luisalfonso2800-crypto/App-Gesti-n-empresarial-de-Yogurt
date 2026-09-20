/**
 * @file ProductionProductLaunchpad.jsx
 * @module operations/production/components
 * @description Galería superior de productos formulados listos para producir en planta (Módulo MANNÁ).
 * @responsibility Mostrar productos con receta activa, stock en cava (L vs und) y bloqueo Poka-Yoke por insumos/inóculo.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
'use client';

import React from 'react';
import { Package, Play, Warehouse, AlertTriangle } from 'lucide-react';
import styles from '../production.module.css';

const isWipOrBulk = (p) => {
  const cat = (p.categoria || '').toUpperCase();
  const pres = (p.presentacion?.tipoEnvase || p.presentacion?.nombre || '').toUpperCase();
  return (
    cat === 'BASES_LACTEAS' ||
    cat === 'INTERMEDIO_WIP' ||
    cat === 'INSUMO_BASE_WIP' ||
    pres.includes('GRANEL') ||
    pres === 'TANQUE_GRANEL'
  );
};

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
          const isWip = isWipOrBulk(p);
          const cleanName = (p.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase();

          // Buscar productos equivalentes a granel o por nombre limpio para sumar stock real en cava
          const relatedProducts = products.filter((item) => {
            if (String(item.id) === String(p.id)) return true;
            const itemClean = (item.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase();
            return itemClean === cleanName;
          });

          const totalStockLitros = relatedProducts.reduce(
            (acc, curr) => acc + Number(curr.stockLitros ?? curr.stockActual ?? 0),
            0
          );
          const totalStockUnd = relatedProducts.reduce(
            (acc, curr) => acc + Number(curr.stockCava ?? curr.stockActual ?? 0),
            0
          );

          const stockLabel = isWip ? `${totalStockLitros.toFixed(1)} L` : `${totalStockUnd} und`;

          const allDetails = matchingRecipe?.etapas?.flatMap((e) => e.detalles || []) || [];
          const requiresInoculum = allDetails.some(
            (d) => d.idProductoIntermedio || (d.tipoInsumo || '').includes('INOCULO') || (d.tipoInsumo || '').includes('WIP')
          );

          const totalWipStock = products
            .filter((prod) => isWipOrBulk(prod))
            .reduce((acc, curr) => acc + Number(curr.stockLitros ?? curr.stockActual ?? 0), 0);

          let shortageReason = null;
          if (requiresInoculum && totalWipStock <= 0) {
            shortageReason = 'Sin Inóculo en Cava';
          } else if (matchingRecipe?.hasShortage || matchingRecipe?.faltantes?.length > 0) {
            shortageReason = 'Insumos Insuficientes';
          }

          return (
            <article key={p.id} className={styles.launchpadCard}>
              {p.imagenUrl ? (
                <img src={p.imagenUrl} alt={p.nombre} className={styles.launchpadImg} />
              ) : (
                <div className={styles.launchpadImgPlaceholder}>
                  <Package size={22} />
                </div>
              )}
              <div className={styles.launchpadContent}>
                <h4 className={styles.launchpadTitle} title={p.nombre}>{p.nombre}</h4>
                <span className={styles.badgeStock}>📦 En Cava: {stockLabel}</span>
                {shortageReason ? (
                  <button type="button" disabled className={styles.btnLaunchDisabled} title={`Bloqueado: ${shortageReason}`}>
                    <AlertTriangle size={12} />
                    <span>{shortageReason}</span>
                  </button>
                ) : (
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
                    <span>Producir Lote</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
