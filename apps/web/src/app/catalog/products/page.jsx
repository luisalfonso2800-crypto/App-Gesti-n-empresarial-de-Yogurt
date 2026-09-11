/**
 * @file page.jsx
 * @module catalog/products
 * @description Controlador principal para el catálogo de productos terminados.
 * @responsibility Punto de entrada del Next.js Router (<120 líneas).
 * @usedBy Next.js App Router
 * @dependencies Hooks locales y componentes visuales.
 */
'use client';
import React, { useState } from 'react';
import { useProductsData } from './hooks/useProductsData';
import { useProductForm } from './hooks/useProductForm';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsTable } from './components/ProductsTable';
import { ProductModal } from './components/ProductModal';
import styles from './products.module.css';

export default function ProductsPage() {
  const { items, loading, error, fetchItems, handleToggleActive } = useProductsData();
  const form = useProductForm({ onSuccess: fetchItems });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const paginatedProducts = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <ProductsHeader onNew={form.handleOpenModal} />
      <ProductsTable 
        items={paginatedProducts} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
      />
      
      {items.length > 0 && !loading && !error && (
        <div className={styles.paginationContainer}>
          <span className={styles.paginationInfo}>
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} de {items.length} productos
          </span>
          <div className={styles.paginationControls}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
            >
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
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <ProductModal 
        isOpen={form.isModalOpen} onClose={form.handleCloseModal}
        editingItem={form.editingItem} formData={form.formData}
        handleChange={form.handleChange} handleSubmit={form.handleSubmit}
        presentations={form.presentations}
        isSubmitting={form.isSubmitting} errorMsg={form.errorMsg}
      />
    </div>
  );
}
