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
  } = useRecipeForm({ supplies, prices, onSaveSuccess: fetchData });

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

  return (
    <div>
      <RecipesHeader onNewRecipe={handleOpenEditor} />
      
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
