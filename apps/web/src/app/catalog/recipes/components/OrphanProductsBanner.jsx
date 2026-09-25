/**
 * @file OrphanProductsBanner.jsx
 * @module catalog/recipes/components
 * @description Selector dinámico en tarjetas para productos huérfanos sin receta técnica.
 * @responsibility Renderizar retícula de tarjetas con miniatura, nombre, presentación y acción directa.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies react, @/components/ui/ProductAvatar, @/lib/presetImages, ../recipes.module.css
 */
import React, { useState } from 'react';
import { OrphanCardItem } from './OrphanCardItem';
import styles from '../recipes.module.css';

const ITEMS_PER_PAGE = 12;

const isWipProduct = (p) => {
  const tipo = (p.tipoProducto || p.tipo || '').toUpperCase();
  const cat = (p.categoria || '').toUpperCase();
  return tipo.includes('WIP') || cat.includes('WIP') || cat.includes('BASE') || cat.includes('JALEA') || cat.includes('TANQUE');
};

export function OrphanProductsBanner({ orphanProducts = [], onSelectProduct }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');

  const cleanOrphans = (orphanProducts || []).filter(p => 
    !p.idItem && 
    p.tipoItem !== 'INOCULO_WIP' && 
    p.tipoItem !== 'BASE_GRANEL'
  );

  if (cleanOrphans.length === 0) return null;

  const filteredProducts = cleanOrphans.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      p.nombre?.toLowerCase().includes(term) ||
      p.codigo?.toLowerCase().includes(term);

    const isWip = isWipProduct(p);
    const matchTipo =
      tipoFilter === 'TODOS' ||
      (tipoFilter === 'WIP' && isWip) ||
      (tipoFilter === 'COMERCIAL' && !isWip);

    return matchSearch && matchTipo;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const visibleOrphans = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={styles.orphanBanner}>
      <div className={styles.orphanContent}>
        <div className={styles.orphanTitle}>
          <span>⚠️</span>
          <span>{cleanOrphans.length} producto(s) en catálogo sin receta técnica formulada</span>
        </div>
        <span className={styles.orphanSubtitle}>
          Los productos huérfanos no se pueden fabricar ni descontar ingredientes en bodega. Selecciona uno para formular:
        </span>
      </div>

      <div className={styles.orphanToolbar}>
        <input
          type="search"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.orphanSearch}
          aria-label="Buscar producto huérfano"
        />
        <select
          value={tipoFilter}
          onChange={(e) => {
            setTipoFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.orphanFilter}
          aria-label="Filtrar por tipo"
        >
          <option value="TODOS">Todos ({cleanOrphans.length})</option>
          <option value="COMERCIAL">Comercial</option>
          <option value="WIP">WIP / Tanque</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.orphanEmpty}>
          No hay productos que coincidan con la búsqueda &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className={styles.orphanGrid}>
          {visibleOrphans.map((product) => (
            <OrphanCardItem
              key={`orphan-prod-${product.id}`}
              product={product}
              isWip={isWipProduct(product)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.orphanPagination}>
          <button
            type="button"
            className={styles.orphanPageBtn}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
          >
            ← Anterior
          </button>
          <span className={styles.orphanPageInfo}>
            Página {safeCurrentPage} de {totalPages} ({filteredProducts.length} productos)
          </span>
          <button
            type="button"
            className={styles.orphanPageBtn}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
