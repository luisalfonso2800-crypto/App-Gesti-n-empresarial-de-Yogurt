/**
 * @file page.jsx
 * @module catalog/recipes
 * @description Orquestador principal del módulo de recetas técnicas.
 * @responsibility Centralizar estado e inyectarlo a los componentes visuales.
 * @usedBy Next.js App Router
 * @dependencies useRecipesData, useRecipeForm, RecipesHeader, RecipesList, RecipeModal
 */
'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRecipesData } from './hooks/useRecipesData';
import { useRecipeForm } from './hooks/useRecipeForm';
import { RecipesHeader } from './components/RecipesHeader';
import { RecipesList } from './components/RecipesList';
import { RecipeModal } from './components/RecipeModal';

function RecipesContent() {
  const {
    items, products, supplies, prices,
    loading, error, fetchData, handleToggleActive
  } = useRecipesData();

  const {
    isEditing, formData, handleOpenEditor, handleCloseEditor,
    handleChange, applyStageTemplate, addEtapa, updateEtapa, removeEtapa,
    moveStage,
    addDetalle, updateDetalle, removeDetalle,
    handleSubmit, calculateCost
  } = useRecipeForm({ supplies, products, prices, onSaveSuccess: fetchData });

  const searchParams = useSearchParams();
  const autoOpenedRef = useRef(false);

  const hasProducts = products.length > 0;
  const hasSupplies = supplies.length > 0;
  const canCreate = !loading && hasProducts && hasSupplies;

  const isCreateParam = searchParams.get('crear') === 'receta';

  // Sincronización query param ?crear=receta
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

  // Escucha del evento global open-recipe-modal disparado desde el Onboarding
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

  if (isEditing) {
    return (
      <RecipeModal
        formData={formData}
        products={products}
        supplies={supplies}
        onClose={handleCloseEditor}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onApplyStageTemplate={applyStageTemplate}
        onAddEtapa={addEtapa}
        onUpdateEtapa={updateEtapa}
        onRemoveEtapa={removeEtapa}
        onMoveEtapa={moveStage}
        onAddDetalle={addDetalle}
        onUpdateDetalle={updateDetalle}
        onRemoveDetalle={removeDetalle}
        calculateCost={calculateCost}
      />
    );
  }

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

  return (
    <div>
      <RecipesHeader 
        onNewRecipe={handleOpenEditor} 
        canCreate={canCreate} 
        disabledTooltip={disabledTooltip} 
      />

      {!loading && !hasProducts && (
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1E40AF',
          padding: '0.875rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <strong>Prerrequisito requerido:</strong> Debe registrar al menos un Producto antes de formular recetas.
          </div>
          <Link 
            href="/catalog/products" 
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
            Ir a Productos
          </Link>
        </div>
      )}

      {!loading && !hasSupplies && (
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
            <strong>Prerrequisito requerido:</strong> Debe registrar al menos un Insumo antes de formular recetas.
          </div>
          <Link 
            href="/catalog/supplies" 
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
            Ir a Insumos
          </Link>
        </div>
      )}
      
      <RecipesList 
        items={items}
        loading={loading}
        error={error}
        onEdit={handleOpenEditor}
        onToggleActive={handleToggleActive}
        onNewRecipe={handleOpenEditor}
        canCreate={canCreate}
        disabledTooltip={disabledTooltip}
      />
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Cargando recetas técnicas...</div>}>
      <RecipesContent />
    </Suspense>
  );
}
