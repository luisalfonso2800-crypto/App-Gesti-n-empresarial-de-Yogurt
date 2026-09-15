/**
 * @file page.jsx
 * @module catalog/products
 * @description Controlador principal para el catálogo de productos terminados (SRP <105 líneas, 0 inline styles).
 * @responsibility Punto de entrada del Next.js Router, layout 2 columnas y delegación modular.
 * @usedBy Next.js App Router
 * @dependencies React, ProductsHeader, ProductPageNotices, ProductBulkActionBar, ProductsTable, ProductPreviewCard, ProductsPagination, ProductsModalsContainer
 */
'use client';

import React, { Suspense } from 'react';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductPageNotices } from './components/ProductPageNotices';
import { ProductBulkActionBar } from './components/ProductBulkActionBar';
import { ProductsTable } from './components/ProductsTable';
import { ProductPreviewCard } from './components/ProductPreviewCard';
import { ProductsPagination } from './components/ProductsPagination';
import { ProductsModalsContainer } from './components/ProductsModalsContainer';
import styles from './products.module.css';
import { useProductsPageManager } from './hooks/useProductsPageManager';
import { useProductDeleteManager } from './hooks/useProductDeleteManager';
import { useBulkProductsActions } from './hooks/useBulkProductsActions';

function ProductsContent() {
  const {
    items, presentations, recipes, loading, loadingPresentations, error, form, isBaseIntermediaMode,
    currentPage, paginatedProducts, totalPages, ITEMS_PER_PAGE,
    handlePageChange, fetchItems, handleToggleActive, deleteProduct, actionNotice, clearActionNotice, notifyUser,
    selectedIds, handleToggleSelect, handleToggleSelectAll, handleClearSelection,
    hasPresentations, canCreate, autoOpenedRef, hoveredProduct, setHoveredProduct
  } = useProductsPageManager();

  const {
    deletingItem, isDeleting, deleteError,
    handleOpenDelete, handleCloseDelete, handleConfirmDelete
  } = useProductDeleteManager({ onDeleteProduct: deleteProduct });

  const {
    handleBulkActivate, handleBulkDeactivate, handleBulkDelete
  } = useBulkProductsActions({
    onRefresh: fetchItems,
    onNotify: notifyUser,
    onClearSelection: handleClearSelection
  });

  return (
    <div>
      <ProductsHeader onNew={form.handleOpenModal} canCreate={canCreate} />

      <ProductPageNotices
        loadingPresentations={loadingPresentations}
        hasPresentations={hasPresentations}
        actionNotice={actionNotice}
        clearActionNotice={clearActionNotice}
        error={error}
      />

      <ProductBulkActionBar
        selectedIds={selectedIds}
        items={items}
        recipes={recipes}
        onClearSelection={handleClearSelection}
        onNotify={notifyUser}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={(ids) => handleOpenDelete({ ids, count: ids.length })}
      />

      <div className={styles.productsLayout}>
        <div className={styles.tableColumn}>
          <ProductsTable 
            items={paginatedProducts} loading={loading} error={error}
            recipes={recipes} selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect} onToggleSelectAll={handleToggleSelectAll}
            hoveredProductId={hoveredProduct?.id} onHoverProduct={setHoveredProduct}
            onEdit={form.handleOpenModal} onNew={() => form.handleOpenModal(null)}
          />
          
          {!loading && !error && (
            <ProductsPagination
              currentPage={currentPage} totalPages={totalPages}
              totalItems={items.length} itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {!loading && paginatedProducts.length > 0 && (
          <div className={styles.previewColumn}>
            <ProductPreviewCard
              product={hoveredProduct || paginatedProducts[0]}
              recipes={recipes}
            />
          </div>
        )}
      </div>

      <ProductsModalsContainer
        form={form}
        autoOpenedRef={autoOpenedRef}
        isBaseIntermediaMode={isBaseIntermediaMode}
        deletingItem={deletingItem}
        isDeleting={isDeleting}
        deleteError={deleteError}
        handleConfirmDelete={handleConfirmDelete}
        handleCloseDelete={handleCloseDelete}
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
