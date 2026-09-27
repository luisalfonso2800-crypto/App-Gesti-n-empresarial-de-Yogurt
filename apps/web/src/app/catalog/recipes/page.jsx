/**
 * @file page.jsx
 * @module catalog/recipes
 * @description Orquestador principal del módulo de recetas técnicas (SRP <120 líneas, 0 inline styles).
 */
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { RecipesHeader } from './components/RecipesHeader';
import { RecipesList } from './components/RecipesList';
import { RecipeModal } from './components/RecipeModal';
import { ConfirmDeleteRecipeModal } from './components/ConfirmDeleteRecipeModal';
import { RecipesMetrics } from './components/RecipesMetrics';
import { RecipesMetricsDetailModal } from './components/RecipesMetricsDetailModal';
import { RecipesFilterBar } from './components/RecipesFilterBar';
import { RecipesPagination } from './components/RecipesPagination';
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
    notice, clearNotice, canCreate, hasProducts, hasSupplies, disabledTooltip,
    filterSearch, setFilterSearch, filterProduct, setFilterProduct,
    filterStatus, setFilterStatus, hasFilters, clearFilters, filteredCount,
    paginatedRecipes, currentPage, setCurrentPage, totalPages, PAGE_SIZE,
    globalMetrics, orphanProducts, activeMetricDetail, setActiveMetricDetail
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
    <div className={styles.pageContainer}>
      <RecipesHeader onNewRecipe={handleOpenEditor} canCreate={canCreate} disabledTooltip={disabledTooltip} />
      {notice && (
        <div className={styles.noticeBanner}>
          <div>⚠️ {notice}</div>
          <button type="button" className={styles.noticeBannerClose} onClick={clearNotice} aria-label="Cerrar advertencia">✕</button>
        </div>
      )}
      {!loading && (!hasProducts || !hasSupplies) && (
        <div className={styles.prereqBanner}>
          <div><strong>Prerrequisito:</strong> Debe registrar {!hasProducts ? 'Productos' : 'Insumos'} antes de formular recetas.</div>
          <Link href={!hasProducts ? '/catalog/products' : '/catalog/supplies'} className={styles.prereqLink}>Ir a {!hasProducts ? 'Productos' : 'Insumos'}</Link>
        </div>
      )}
      <RecipesMetrics metrics={globalMetrics} loading={loading} onCardClick={setActiveMetricDetail} />
      <RecipesFilterBar
        filterSearch={filterSearch} setFilterSearch={setFilterSearch}
        filterProduct={filterProduct} setFilterProduct={setFilterProduct}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        products={products} hasFilters={hasFilters} clearFilters={clearFilters}
      />
      <RecipesList 
        items={paginatedRecipes} loading={loading} error={error}
        onEdit={handleOpenEditor} onToggleActive={handleToggleActive}
        onDelete={handleOpenDelete} onNewRecipe={handleOpenEditor}
        canCreate={canCreate} disabledTooltip={disabledTooltip}
      />
      {!loading && filteredCount > 0 && (
        <RecipesPagination
          currentPage={currentPage} totalPages={totalPages}
          totalItems={filteredCount} itemsPerPage={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
      <ConfirmDeleteRecipeModal
        isOpen={Boolean(recipeToDelete)} item={recipeToDelete}
        isDeleting={isDeleting} errorMessage={deleteError}
        onConfirm={handleConfirmDelete} onClose={handleCloseDelete}
      />
      <RecipesMetricsDetailModal
        isOpen={Boolean(activeMetricDetail)} onClose={() => setActiveMetricDetail(null)}
        detailType={activeMetricDetail} metrics={globalMetrics} orphanProducts={orphanProducts}
        onFilterByStatus={setFilterStatus} onNewRecipe={() => handleOpenEditor(null)}
        onSelectOrphan={(prodId) => handleOpenEditor(null, prodId)}
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
