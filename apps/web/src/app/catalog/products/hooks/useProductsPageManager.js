/**
 * @file useProductsPageManager.js
 * @module catalog/products/hooks
 * @description Hook orquestador de paginación y apertura automática de productos terminados.
 * @responsibility Control de auto-apertura por URL, cambio de página y estado de formulario.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies React, next/navigation, ./useProductsData, ./useProductForm
 */
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductsData } from './useProductsData';
import { useProductForm } from './useProductForm';

export function useProductsPageManager() {
  const { items, presentations, loading, loadingPresentations, error, fetchItems, handleToggleActive } = useProductsData();
  const form = useProductForm({ onSuccess: fetchItems });
  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const isBaseIntermediaMode = searchParams.get('crear') === 'base-intermedia';

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

  return {
    items,
    presentations,
    loading,
    loadingPresentations,
    error,
    form,
    isBaseIntermediaMode,
    currentPage,
    paginatedProducts,
    totalPages,
    ITEMS_PER_PAGE,
    handlePageChange,
    hasPresentations,
    canCreate,
    autoOpenedRef
  };
}
