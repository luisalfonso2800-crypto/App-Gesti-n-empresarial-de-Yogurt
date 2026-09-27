/**
 * @file useRecipesPageManager.js
 * @module catalog/recipes/hooks
 * @description Hook orquestador de datos, formularios, filtrado, métricas y paginación para el catálogo de recetas.
 * @responsibility Integrar datos, filtrado reactivo, métricas de catálogo, paginación (10/pág) y modales.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies React, next/navigation, ./useRecipesData, ./useRecipeForm
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecipesData } from './useRecipesData';
import { useRecipeForm } from './useRecipeForm';

const PAGE_SIZE = 10;

export function useRecipesPageManager() {
  const {
    items, products, supplies, prices,
    loading, error, fetchData, handleToggleActive, deleteRecipe
  } = useRecipesData();

  const [notice, setNotice] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Estados de filtrado y paginación
  const [filterSearch, setFilterSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMetricDetail, setActiveMetricDetail] = useState(null);

  const handleOpenDelete = (item) => {
    setDeleteError(null);
    setRecipeToDelete(item);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setRecipeToDelete(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete?.id) return;
    setIsDeleting(true);
    setDeleteError(null);
    setNotice(null);

    const result = await deleteRecipe(recipeToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      setRecipeToDelete(null);
    } else {
      setDeleteError(result.message);
      setNotice(result.message);
    }
  };

  const {
    isEditing, formData, handleOpenEditor, handleCloseEditor,
    handleChange, applyStageTemplate, addEtapa, updateEtapa, removeEtapa,
    moveStage, addDetalle, updateDetalle, removeDetalle,
    handleSubmit, calculateCost, getCostRollup
  } = useRecipeForm({ supplies, products, prices, recipes: items, onSaveSuccess: fetchData });

  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const hasProducts = products.length > 0;
  const hasSupplies = supplies.length > 0;
  const canCreate = !loading && hasProducts && hasSupplies;

  const isCreateParam = searchParams.get('crear') === 'receta' || searchParams.get('action') === 'new';
  const targetProductId = searchParams.get('productId');

  useEffect(() => {
    if (isCreateParam && !autoOpenedRef.current && !loading && hasProducts && hasSupplies) {
      autoOpenedRef.current = true;
      handleOpenEditor(null, targetProductId || null);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/catalog/recipes');
      }
    }
    if (!isCreateParam) {
      autoOpenedRef.current = false;
    }
  }, [isCreateParam, targetProductId, loading, hasProducts, hasSupplies, handleOpenEditor]);

  useEffect(() => {
    const handleGlobalOpenModal = () => {
      if (canCreate) {
        handleOpenEditor(null);
      }
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/catalog/recipes');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('open-recipe-modal', handleGlobalOpenModal);
      window.addEventListener('reset-recipe-modal', handleCloseEditor);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-recipe-modal', handleGlobalOpenModal);
        window.removeEventListener('reset-recipe-modal', handleCloseEditor);
      }
    };
  }, [canCreate, handleOpenEditor, handleCloseEditor]);

  // Reset de página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterSearch, filterProduct, filterStatus]);

  // Lista de productos huérfanos sin receta
  const orphanProducts = useMemo(() => {
    if (!products.length) return [];
    return products.filter(p => !items.some(r => String(r.idProducto) === String(p.id)));
  }, [products, items]);

  // Métricas globales del catálogo de recetas
  const globalMetrics = useMemo(() => {
    const totalRecipes = items.length;
    const activeCount = items.filter(r => r.activo).length;
    const inactiveCount = totalRecipes - activeCount;
    const orphanProductsCount = orphanProducts.length;

    let totalStagesCount = 0;
    items.forEach(r => {
      const stages = r.etapas?.filter(e => e.activo !== false) || [];
      totalStagesCount += stages.length;
    });
    const averageStages = totalRecipes > 0 ? (totalStagesCount / totalRecipes).toFixed(1) : 0;

    return {
      totalRecipes,
      activeCount,
      inactiveCount,
      orphanProductsCount,
      averageStages,
      totalStagesAll: totalStagesCount
    };
  }, [items, orphanProducts]);

  // Filtrado reactivo multicriterio
  const filteredRecipes = useMemo(() => {
    return items.filter(recipe => {
      // 1. Filtro Producto
      if (filterProduct && String(recipe.idProducto) !== String(filterProduct)) {
        return false;
      }
      // 2. Filtro Estado
      if (filterStatus === 'ACTIVO' && !recipe.activo) return false;
      if (filterStatus === 'INACTIVO' && recipe.activo) return false;

      // 3. Filtro Búsqueda
      if (filterSearch) {
        const term = filterSearch.toLowerCase().trim();
        const matchName = recipe.nombre?.toLowerCase().includes(term);
        const matchProd = recipe.producto?.nombre?.toLowerCase().includes(term);
        const matchCode = recipe.codigo?.toLowerCase().includes(term);
        if (!matchName && !matchProd && !matchCode) return false;
      }

      return true;
    });
  }, [items, filterProduct, filterStatus, filterSearch]);

  // Paginación fija de 10 elementos
  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecipes.slice(start, start + PAGE_SIZE);
  }, [filteredRecipes, currentPage]);

  const hasFilters = Boolean(filterSearch || filterProduct || filterStatus !== 'TODOS');
  const clearFilters = () => {
    setFilterSearch('');
    setFilterProduct('');
    setFilterStatus('TODOS');
  };

  let disabledTooltip = '';
  if (!canCreate) {
    if (!hasProducts && !hasSupplies) {
      disabledTooltip = 'Debe registrar Productos e Insumos antes de formular recetas';
    } else if (!hasProducts) {
      disabledTooltip = 'Debe registrar al menos un Producto antes de formular recetas';
    } else {
      disabledTooltip = 'Debe registrar al menos un Insumo antes de formular recetas';
    }
  }

  return {
    items, products, supplies, loading, error, isEditing, formData,
    handleOpenEditor, handleCloseEditor, handleChange, applyStageTemplate,
    addEtapa, updateEtapa, removeEtapa, moveStage, addDetalle, updateDetalle,
    removeDetalle, handleSubmit, calculateCost, getCostRollup, handleToggleActive,
    recipeToDelete, isDeleting, deleteError,
    handleOpenDelete, handleCloseDelete, handleConfirmDelete,
    notice, clearNotice: () => setNotice(null),
    canCreate, hasProducts, hasSupplies, disabledTooltip,
    // Filtros, métricas y paginación
    filterSearch, setFilterSearch,
    filterProduct, setFilterProduct,
    filterStatus, setFilterStatus,
    hasFilters, clearFilters,
    filteredCount: filteredRecipes.length,
    paginatedRecipes,
    currentPage, setCurrentPage,
    totalPages, PAGE_SIZE,
    globalMetrics, orphanProducts,
    activeMetricDetail, setActiveMetricDetail
  };
}
