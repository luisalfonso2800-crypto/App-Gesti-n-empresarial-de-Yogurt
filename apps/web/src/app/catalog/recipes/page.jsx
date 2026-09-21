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
import { OrphanProductsBanner } from './components/OrphanProductsBanner';
import { ConfirmDeleteRecipeModal } from './components/ConfirmDeleteRecipeModal';
import styles from './recipes.module.css';

import { useRecipesPageManager } from './hooks/useRecipesPageManager';

function RecipesContent() {
  const {
    items, products, supplies, loading, error, isEditing, formData,
    handleOpenEditor, handleCloseEditor, handleChange, applyStageTemplate,
    addEtapa, updateEtapa, removeEtapa, moveStage, addDetalle, updateDetalle,
    removeDetalle, handleSubmit, calculateCost, getCostRollup, handleToggleActive,
    recipeToDelete, isDeleting, deleteError,
    handleOpenDelete, handleCloseDelete, handleConfirmDelete,
    notice, clearNotice,
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
        calculateCost={calculateCost} getCostRollup={getCostRollup}
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

      {notice && (
        <div className={styles.noticeBanner}>
          <div>⚠️ {notice}</div>
          <button type="button" className={styles.noticeBannerClose} onClick={clearNotice} aria-label="Cerrar advertencia">
            ✕
          </button>
        </div>
      )}

      {!loading && !hasProducts && (
        <div className={styles.prereqBanner}>
          <div><strong>Prerrequisito requerido:</strong> Debe registrar al menos un Producto antes de formular recetas.</div>
          <Link href="/catalog/products" className={styles.prereqLink}>Ir a Productos</Link>
        </div>
      )}

      {!loading && !hasSupplies && (
        <div className={styles.prereqBanner}>
          <div><strong>Prerrequisito requerido:</strong> Debe registrar al menos un Insumo antes de formular recetas.</div>
          <Link href="/catalog/supplies" className={styles.prereqLink}>Ir a Insumos</Link>
        </div>
      )}

      {/* Selector en tarjetas de Productos Huérfanos sin Receta Técnica (Estilo MANNÁ) */}
      {!loading && hasProducts && (
        <OrphanProductsBanner
          orphanProducts={products.filter(p => !items.some(r => String(r.idProducto) === String(p.id)))}
          onSelectProduct={(productId) => handleOpenEditor(null, productId)}
        />
      )}

      
      <RecipesList 
        items={items} loading={loading} error={error}
        onEdit={handleOpenEditor} onToggleActive={handleToggleActive}
        onDelete={handleOpenDelete}
        onNewRecipe={handleOpenEditor} canCreate={canCreate}
        disabledTooltip={disabledTooltip}
      />

      <ConfirmDeleteRecipeModal
        isOpen={Boolean(recipeToDelete)}
        item={recipeToDelete}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
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
