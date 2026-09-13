/**
 * @file page.jsx
 * @module catalog/recipes
 * @description Orquestador principal del módulo de recetas técnicas.
 * @responsibility Centralizar estado e inyectarlo a los componentes visuales.
 * @usedBy Next.js App Router
 * @dependencies useRecipesData, useRecipeForm, RecipesHeader, RecipesList, RecipeModal
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useRecipesData } from './hooks/useRecipesData';
import { useRecipeForm } from './hooks/useRecipeForm';
import { RecipesHeader } from './components/RecipesHeader';
import { RecipesList } from './components/RecipesList';
import { RecipeModal } from './components/RecipeModal';

export default function RecipesPage() {
  const {
    items, products, supplies, prices,
    loading, error, fetchData, handleToggleActive
  } = useRecipesData();

  const {
    isEditing, formData, handleOpenEditor, handleCloseEditor,
    handleChange, addEtapa, updateEtapa, removeEtapa,
    addDetalle, updateDetalle, removeDetalle,
    handleSubmit, calculateCost
  } = useRecipeForm({ supplies, products, prices, onSaveSuccess: fetchData });

  if (isEditing) {
    return (
      <RecipeModal
        formData={formData}
        products={products}
        supplies={supplies}
        onClose={handleCloseEditor}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onAddEtapa={addEtapa}
        onUpdateEtapa={updateEtapa}
        onRemoveEtapa={removeEtapa}
        onAddDetalle={addDetalle}
        onUpdateDetalle={updateDetalle}
        onRemoveDetalle={removeDetalle}
        calculateCost={calculateCost}
      />
    );
  }

  const hasProducts = products.length > 0;
  const hasSupplies = supplies.length > 0;
  const canCreate = !loading && hasProducts && hasSupplies;

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
      />
    </div>
  );
}
