/**
 * @file useRecipesPageManager.js
 * @module catalog/recipes/hooks
 * @description Hook orquestador de datos, formularios y eventos globales para el catálogo de recetas.
 * @responsibility Integrar useRecipesData, useRecipeForm, sincronización con URL y eventos de onboarding.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies React, next/navigation, ./useRecipesData, ./useRecipeForm
 */
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecipesData } from './useRecipesData';
import { useRecipeForm } from './useRecipeForm';

export function useRecipesPageManager() {
  const {
    items, products, supplies, prices,
    loading, error, fetchData, handleToggleActive
  } = useRecipesData();

  const {
    isEditing, formData, handleOpenEditor, handleCloseEditor,
    handleChange, applyStageTemplate, addEtapa, updateEtapa, removeEtapa,
    moveStage, addDetalle, updateDetalle, removeDetalle,
    handleSubmit, calculateCost
  } = useRecipeForm({ supplies, products, prices, onSaveSuccess: fetchData });

  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const hasProducts = products.length > 0;
  const hasSupplies = supplies.length > 0;
  const canCreate = !loading && hasProducts && hasSupplies;

  const isCreateParam = searchParams.get('crear') === 'receta';

  useEffect(() => {
    if (isCreateParam && !autoOpenedRef.current && !loading) {
      if (canCreate) {
        autoOpenedRef.current = true;
        handleOpenEditor(null);
      }
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/catalog/recipes');
      }
    }
    if (!isCreateParam) {
      autoOpenedRef.current = false;
    }
  }, [isCreateParam, loading, canCreate, handleOpenEditor]);

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
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-recipe-modal', handleGlobalOpenModal);
      }
    };
  }, [canCreate, handleOpenEditor]);

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
    removeDetalle, handleSubmit, calculateCost, handleToggleActive,
    canCreate, hasProducts, hasSupplies, disabledTooltip
  };
}
