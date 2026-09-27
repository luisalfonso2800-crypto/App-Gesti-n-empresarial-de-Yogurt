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
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPresentation, setFilterPresentation] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Manejo de cambio en cadena: al cambiar categoría, si la presentación no aplica, se limpia
  const handleCategoryChange = (cat) => {
    setFilterCategory(cat);
    setFilterPresentation('');
    setCurrentPage(1);
  };

  const handlePresentationChange = (pres) => {
    setFilterPresentation(pres);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setChannelFilter('TODOS');
    setFilterSearch('');
    setFilterCategory('');
    setFilterPresentation('');
    setFilterStatus('TODOS');
    setCurrentPage(1);
  };

  const hasFilters = Boolean(
    channelFilter !== 'TODOS' ||
    filterSearch ||
    filterCategory ||
    filterPresentation ||
    filterStatus !== 'TODOS'
  );

  // Presentaciones filtradas disponibles según la categoría elegida
  const availablePresentations = (presentations || []).filter((pres) => {
    if (!filterCategory) return true;
    return items.some(p => p.categoria === filterCategory && (p.idPresentacion === pres.id || p.presentacionId === pres.id || p.presentacion?.id === pres.id));
  });

  // Métricas globales para las tarjetas de resumen
  const globalMetrics = {
    totalProducts: items.length,
    activeCount: items.filter(p => p.activo !== false).length,
    commercialCount: items.filter(p => p.canalVenta !== 'SOLO_PLANTA' && p.canalVenta !== 'USO_INTERNO' && !p.categoria?.includes('WIP')).length,
    wipCount: items.filter(p => p.canalVenta === 'SOLO_PLANTA' || p.canalVenta === 'USO_INTERNO' || p.categoria?.includes('WIP')).length,
    readyCount: items.filter(p => {
      const hasPres = Boolean(p.idPresentacion || p.presentacionId || p.presentacion?.id);
      return Number(p.precioVenta || 0) > 0 && hasPres && p.activo !== false;
    }).length,
    incompleteCount: items.filter(p => {
      const hasPres = Boolean(p.idPresentacion || p.presentacionId || p.presentacion?.id);
      return (Number(p.precioVenta || 0) <= 0 || !hasPres) && p.activo !== false;
    }).length,
    withRecipeCount: items.filter(p => recipes.some(r => r.activo !== false && String(r.idProducto) === String(p.id))).length
  };

  const filteredItems = items.filter((prod) => {
    const isSoloPlanta = prod.canalVenta === 'SOLO_PLANTA' || prod.canalVenta === 'USO_INTERNO' || prod.categoria?.includes('WIP');
    if (channelFilter === 'COMERCIAL' && isSoloPlanta) return false;
    if (channelFilter === 'WIP' && !isSoloPlanta) return false;

    if (filterCategory && prod.categoria !== filterCategory) return false;

    if (filterPresentation) {
      const presId = prod.idPresentacion || prod.presentacionId || prod.presentacion?.id;
      if (presId !== filterPresentation) return false;
    }

    const numPrice = Number(prod.precioVenta) || 0;
    const hasPres = Boolean(prod.idPresentacion || prod.presentacionId || prod.presentacion?.id);
    const isReady = numPrice > 0 && hasPres && prod.activo !== false;
    const isIncomplete = (numPrice <= 0 || !hasPres) && prod.activo !== false;
    const isDeactivated = prod.activo === false;

    if (filterStatus === 'LISTO' && !isReady) return false;
    if (filterStatus === 'INCOMPLETO' && !isIncomplete) return false;
    if (filterStatus === 'DESACTIVADO' && !isDeactivated) return false;

    if (filterSearch) {
      const q = filterSearch.toLowerCase().trim();
      const name = (prod.nombre || '').toLowerCase();
      const code = (prod.codigo || prod.sku || '').toLowerCase();
      const pres = (prod.presentacion?.nombre || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !pres.includes(q)) return false;
    }

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
    filterSearch,
    setFilterSearch: (val) => { setFilterSearch(val); setCurrentPage(1); },
    filterCategory,
    setFilterCategory: handleCategoryChange,
    filterPresentation,
    setFilterPresentation: handlePresentationChange,
    filterStatus,
    setFilterStatus: (val) => { setFilterStatus(val); setCurrentPage(1); },
    clearFilters,
    hasFilters,
    availablePresentations,
    globalMetrics,
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
