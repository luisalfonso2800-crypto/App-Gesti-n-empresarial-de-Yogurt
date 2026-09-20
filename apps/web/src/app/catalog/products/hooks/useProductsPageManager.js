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
  const {
    items,
    presentations,
    recipes,
    loading,
    loadingPresentations,
    error,
    actionNotice,
    clearActionNotice,
    fetchItems,
    handleToggleActive,
    deleteProduct,
    notifyUser
  } = useProductsData();
  const form = useProductForm({ onSuccess: fetchItems });
  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const isBaseIntermediaMode = searchParams.get('crear') === 'base-intermedia';
  const isActionNew = searchParams.get('action') === 'new';
  const suggestedCategory = searchParams.get('category');

  useEffect(() => {
    if ((isBaseIntermediaMode || isActionNew) && !autoOpenedRef.current && presentations.length > 0) {
      autoOpenedRef.current = true;
      form.handleOpenModal();
      if (isBaseIntermediaMode) {
        const granelPres = presentations.find(p => 
          p.tipoEnvase === 'TANQUE_GRANEL' || 
          p.nombre?.toUpperCase().includes('GRANEL')
        );
        if (granelPres) {
          form.handleChange({ target: { name: 'idPresentacion', value: granelPres.id } });
        }
      }
      if (suggestedCategory) {
        form.handleChange({ target: { name: 'categoria', value: suggestedCategory } });
      }
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/catalog/products');
      }
    }
    if (!isBaseIntermediaMode && !isActionNew) {
      autoOpenedRef.current = false;
    }
  }, [isBaseIntermediaMode, isActionNew, suggestedCategory, presentations, form]);

  const [channelFilter, setChannelFilter] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredItems = items.filter((prod) => {
    const isSoloPlanta = prod.canalVenta === 'SOLO_PLANTA' || prod.canalVenta === 'USO_INTERNO' || prod.categoria?.includes('WIP');
    if (channelFilter === 'COMERCIAL') return !isSoloPlanta;
    if (channelFilter === 'WIP') return isSoloPlanta;
    return true;
  });

  const handleFilterChange = (filter) => {
    setChannelFilter(filter);
    setCurrentPage(1);
  };
  
  const paginatedProducts = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const hasPresentations = presentations.length > 0;
  const canCreate = !loadingPresentations && hasPresentations;

  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (paginatedProducts.length > 0 && !hoveredProduct) {
      setHoveredProduct(paginatedProducts[0]);
    }
  }, [paginatedProducts, hoveredProduct]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (pageItems = []) => {
    const pageIds = pageItems.map(p => p.id);
    const allSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  return {
    items,
    filteredItems,
    channelFilter,
    handleFilterChange,
    presentations,
    recipes,
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
    fetchItems,
    handleToggleActive,
    deleteProduct,
    actionNotice,
    clearActionNotice,
    notifyUser,
    selectedIds,
    handleToggleSelect,
    handleToggleSelectAll,
    handleClearSelection,
    hasPresentations,
    canCreate,
    autoOpenedRef,
    hoveredProduct,
    setHoveredProduct
  };
}
