/**
 * @file ProductsModalsContainer.jsx
 * @module catalog/products/components
 * @description Contenedor de modales de edición/creación y confirmación de eliminación de productos (SRP < 150 líneas).
 * @responsibility Renderizar ProductModal y ConfirmDeleteProductModal para mantener page.jsx ligero.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies react, ./ProductModal, ./ConfirmDeleteProductModal
 */
import React from 'react';
import { ProductModal } from './ProductModal';
import { ConfirmDeleteProductModal } from './ConfirmDeleteProductModal';

export function ProductsModalsContainer({
  form,
  autoOpenedRef,
  isBaseIntermediaMode,
  deletingItem,
  isDeleting,
  deleteError,
  handleConfirmDelete,
  handleCloseDelete
}) {
  return (
    <>
      <ProductModal 
        isOpen={form.isModalOpen} 
        onClose={() => {
          form.handleCloseModal();
          autoOpenedRef.current = false;
          if (typeof window !== 'undefined' && window.location.search.includes('crear=')) {
            window.history.replaceState({}, '', '/catalog/products');
          }
        }}
        editingItem={form.editingItem}
        formData={form.formData}
        handleChange={form.handleChange}
        handleSubmit={form.handleSubmit}
        presentations={form.presentations}
        isSubmitting={form.isSubmitting}
        errorMsg={form.errorMsg}
        isBaseIntermedia={isBaseIntermediaMode}
      />

      <ConfirmDeleteProductModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />
    </>
  );
}
