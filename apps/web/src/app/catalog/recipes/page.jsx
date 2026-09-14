/**
 * @file page.jsx
 * @module catalog/recipes
 * @description Orquestador principal del módulo de recetas técnicas (SRP <120 líneas, 0 inline styles).
 * @responsibility Centralizar estado e inyectarlo a la cabecera, lista y modal de edición.
 * @usedBy Next.js App Router
 * @dependencies React, Link, RecipesHeader, RecipesList, RecipeModal, ./recipes.module.css, ./hooks/useRecipesPageManager
 */
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { RecipesHeader } from './components/RecipesHeader';
import { RecipesList } from './components/RecipesList';
import { RecipeModal } from './components/RecipeModal';
import styles from './recipes.module.css';
import { useRecipesPageManager } from './hooks/useRecipesPageManager';

function RecipesContent() {
  const {
    items, products, supplies, loading, error, isEditing, formData,
    handleOpenEditor, handleCloseEditor, handleChange, applyStageTemplate,
    addEtapa, updateEtapa, removeEtapa, moveStage, addDetalle, updateDetalle,
    removeDetalle, handleSubmit, calculateCost, handleToggleActive,
    canCreate, hasProducts, hasSupplies, disabledTooltip
  } = useRecipesPageManager();

  if (isEditing) {
    return (
      <RecipeModal
        formData={formData} products={products} supplies={supplies}
        onClose={handleCloseEditor} onSubmit={handleSubmit} onChange={handleChange}
        onApplyStageTemplate={applyStageTemplate} onAddEtapa={addEtapa}
        onUpdateEtapa={updateEtapa} onRemoveEtapa={removeEtapa} onMoveEtapa={moveStage}
        onAddDetalle={addDetalle} onUpdateDetalle={updateDetalle} onRemoveDetalle={removeDetalle}
        calculateCost={calculateCost}
      />
    );
  }

  return (
    <div>
      <RecipesHeader 
        onNewRecipe={handleOpenEditor} 
        canCreate={canCreate} 
        disabledTooltip={disabledTooltip} 
      />

      {!loading && !hasProducts && (
        <div className={styles.prereqBanner}>
          <div>
            <strong>Prerrequisito requerido:</strong> Debe registrar al menos un Producto antes de formular recetas.
          </div>
          <Link href="/catalog/products" className={styles.prereqLink}>
            Ir a Productos
          </Link>
        </div>
      )}

      {!loading && !hasSupplies && (
        <div className={styles.prereqBanner}>
          <div>
            <strong>Prerrequisito requerido:</strong> Debe registrar al menos un Insumo antes de formular recetas.
          </div>
          <Link href="/catalog/supplies" className={styles.prereqLink}>
            Ir a Insumos
          </Link>
        </div>
      )}
      
      <RecipesList 
        items={items} loading={loading} error={error}
        onEdit={handleOpenEditor} onToggleActive={handleToggleActive}
        onNewRecipe={handleOpenEditor} canCreate={canCreate}
        disabledTooltip={disabledTooltip}
      />
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className={styles.loaderFallback}>Cargando recetas técnicas...</div>}>
      <RecipesContent />
    </Suspense>
  );
}
