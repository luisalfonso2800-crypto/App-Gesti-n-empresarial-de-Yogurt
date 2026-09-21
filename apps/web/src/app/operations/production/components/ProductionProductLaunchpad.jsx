/**
 * @file ProductionProductLaunchpad.jsx
 * @module operations/production/components
 * @description Galería superior de productos formulados con carrusel paginado y buscador en tiempo real.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { Warehouse } from 'lucide-react';
import ProductionProductLaunchpadCard from './ProductionProductLaunchpadCard';
import styles from './production-launchpad.module.css';

const ITEMS_PER_PAGE = 5;

const isWipOrBulk = (p) => {
  const cat = (p.categoria || '').toUpperCase();
  const pres = (p.presentacion?.tipoEnvase || p.presentacion?.nombre || '').toUpperCase();
  return cat === 'BASES_LACTEAS' || cat === 'INTERMEDIO_WIP' || cat === 'INSUMO_BASE_WIP' || pres.includes('GRANEL') || pres === 'TANQUE_GRANEL';
};

export default function ProductionProductLaunchpad({ products = [], recipes = [], onProduceProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const formulatedProducts = useMemo(() => {
    return products.filter((p) => p.activo !== false && recipes.some((r) => String(r.idProducto) === String(p.id)));
  }, [products, recipes]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term ? formulatedProducts.filter((p) => (p.nombre || '').toLowerCase().includes(term)) : formulatedProducts;
  }, [formulatedProducts, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const visibleProducts = filteredProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const totalWipStock = useMemo(() => {
    return products.filter(isWipOrBulk).reduce((acc, curr) => acc + Number(curr.stockLitros ?? curr.stockActual ?? 0), 0);
  }, [products]);

  if (formulatedProducts.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Lanzadera de productos formulados">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Warehouse size={16} className={styles.titleIcon} />
          <h2 className={styles.title}>Productos Formulados Listos para Producir</h2>
          <span className={styles.badge}>{filteredProducts.length} disponibles</span>
        </div>

        <div className={styles.controls}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            placeholder="Buscar fórmula o producto..."
            className={styles.searchInput}
          />
          <div className={styles.pagination}>
            <button type="button" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className={styles.navBtn} aria-label="Página anterior">‹</button>
            <span className={styles.pageIndicator}>{currentPage + 1} / {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1} className={styles.navBtn} aria-label="Página siguiente">›</button>
          </div>
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div className={styles.emptyState}>No se encontraron productos que coincidan con la búsqueda.</div>
      ) : (
        <div className={styles.grid}>
          {visibleProducts.map((p) => {
            const matchingRecipe = recipes.find((r) => String(r.idProducto) === String(p.id));
            const isWip = isWipOrBulk(p);
            const cleanName = (p.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase();
            const related = products.filter((item) => String(item.id) === String(p.id) || (item.nombre || '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim().toLowerCase() === cleanName);
            const stockLitros = related.reduce((acc, curr) => acc + Number(curr.stockLitros ?? curr.stockActual ?? 0), 0);
            const stockUnd = related.reduce((acc, curr) => acc + Number(curr.stockCava ?? curr.stockActual ?? 0), 0);
            const stockLabel = isWip ? `${stockLitros.toFixed(1)} L` : `${stockUnd} und`;

            const allDetails = matchingRecipe?.etapas?.flatMap((e) => e.detalles || []) || [];
            const reqInoculum = allDetails.some((d) => d.idProductoIntermedio || (d.tipoInsumo || '').includes('INOCULO') || (d.tipoInsumo || '').includes('WIP'));
            const shortageReason = reqInoculum && totalWipStock <= 0 ? 'Sin Inóculo en Cava' : (matchingRecipe?.hasShortage || matchingRecipe?.faltantes?.length > 0 ? 'Insumos Insuficientes' : null);

            return (
              <ProductionProductLaunchpadCard
                key={p.id}
                product={p}
                matchingRecipe={matchingRecipe}
                stockLabel={stockLabel}
                shortageReason={shortageReason}
                onProduceProduct={onProduceProduct}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
