/**
 * @file page.jsx
 * @module catalog/products
 * @description Controlador principal para el catálogo de productos terminados.
 * @responsibility Punto de entrada del Next.js Router (<120 líneas).
 * @usedBy Next.js App Router
 * @dependencies Hooks locales y componentes visuales.
 */
'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductsData } from './hooks/useProductsData';
import { useProductForm } from './hooks/useProductForm';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsTable } from './components/ProductsTable';
import Link from 'next/link';
import { ProductModal } from './components/ProductModal';
import styles from './products.module.css';

function ProductsContent() {
  const { items, presentations, loading, loadingPresentations, error, fetchItems, handleToggleActive } = useProductsData();
  const form = useProductForm({ onSuccess: fetchItems });
  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const isBaseIntermediaMode = searchParams.get('crear') === 'base-intermedia';

  // Detección de parámetro y auto-apertura con preselección de A GRANEL
  useEffect(() => {
    if (isBaseIntermediaMode && !autoOpenedRef.current && presentations.length > 0) {
      autoOpenedRef.current = true;
      form.handleOpenModal();
      const granelPres = presentations.find(p => 
        p.tipoEnvase === 'TANQUE_GRANEL' || 
        p.nombre?.toUpperCase().includes('GRANEL')
      );
      if (granelPres) {
        form.handleChange({ target: { name: 'idPresentacion', value: granelPres.id } });
      }
      // Limpiar de forma silenciosa el query param de la URL para permitir re-apertura posterior
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/catalog/products');
      }
    }
    if (!isBaseIntermediaMode) {
      autoOpenedRef.current = false;
    }
  }, [isBaseIntermediaMode, presentations, form]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const paginatedProducts = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const hasPresentations = presentations.length > 0;
  const canCreate = !loadingPresentations && hasPresentations;

  return (
    <div>
      <ProductsHeader onNew={form.handleOpenModal} canCreate={canCreate} />

      {!loadingPresentations && !hasPresentations && (
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1E40AF',
          padding: '0.875rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <strong>Prerrequisito requerido:</strong> Para registrar productos terminados debe configurar primero los formatos de envase.
          </div>
          <Link 
            href="/catalog/presentations" 
            style={{
              backgroundColor: '#1E40AF',
              color: '#FFFFFF',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            Configurar Presentaciones
          </Link>
        </div>
      )}

      {Boolean(error) && (
        <div className={styles.errorMessage} style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', color: '#B91C1C', fontSize: '0.875rem' }}>
          {typeof error === 'string' ? error : error?.message || 'Error al cargar datos'}
        </div>
      )}

      <ProductsTable 
        items={paginatedProducts} loading={loading} error={error}
        onEdit={form.handleOpenModal} onToggleActive={handleToggleActive}
        onNew={() => form.handleOpenModal(null)}
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
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Cargando catálogo de productos...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
