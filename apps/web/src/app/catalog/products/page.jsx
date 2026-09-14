/**
 * @file page.jsx
 * @module catalog/products
 * @description Controlador principal para el catálogo de productos terminados (SRP <120 líneas, 0 inline styles).
 * @responsibility Punto de entrada del Next.js Router, delegación a tabla, modal y banner.
 * @usedBy Next.js App Router
 * @dependencies React, Link, ProductsHeader, ProductsTable, ProductModal, ./products.module.css, ./hooks/useProductsPageManager
 */
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsTable } from './components/ProductsTable';
import { ProductModal } from './components/ProductModal';
import styles from './products.module.css';
import { useProductsPageManager } from './hooks/useProductsPageManager';

function ProductsContent() {
  const {
    items, loading, loadingPresentations, error, form, isBaseIntermediaMode,
    currentPage, paginatedProducts, totalPages, ITEMS_PER_PAGE,
    handlePageChange, hasPresentations, canCreate, autoOpenedRef
  } = useProductsPageManager();

  return (
    <div>
      <ProductsHeader onNew={form.handleOpenModal} canCreate={canCreate} />

      {!loadingPresentations && !hasPresentations && (
        <div className={styles.prereqBanner}>
          <div>
            <strong>Prerrequisito requerido:</strong> Para registrar productos terminados debe configurar primero los formatos de envase.
          </div>
          <Link href="/catalog/presentations" className={styles.prereqLink}>
            Configurar Presentaciones
          </Link>
        </div>
      )}

      {Boolean(error) && (
        <div className={styles.errorMessage}>
          {typeof error === 'string' ? error : error?.message || 'Error al cargar datos'}
        </div>
      )}

      <ProductsTable 
        items={paginatedProducts} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={form.handleToggleActive}
        onNew={() => form.handleOpenModal(null)}
      />
      
      {items.length > 0 && !loading && !error && (
        <div className={styles.paginationContainer}>
          <span className={styles.paginationInfo}>
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} de {items.length} productos
          </span>
          <div className={styles.paginationControls}>
            <button className={styles.pageBtn} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx} 
                className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.pageBtnActive : ''}`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button className={styles.pageBtn} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      <ProductModal 
        isOpen={form.isModalOpen} 
        onClose={() => {
          form.handleCloseModal();
          autoOpenedRef.current = false;
          if (typeof window !== 'undefined' && window.location.search.includes('crear=')) {
            window.history.replaceState({}, '', '/catalog/products');
          }
        }}
        editingItem={form.editingItem} formData={form.formData}
        handleChange={form.handleChange} handleSubmit={form.handleSubmit}
        presentations={form.presentations}
        isSubmitting={form.isSubmitting} errorMsg={form.errorMsg}
        isBaseIntermedia={isBaseIntermediaMode}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className={styles.loaderFallback}>Cargando catálogo de productos...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
